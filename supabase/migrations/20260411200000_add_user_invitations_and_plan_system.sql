-- Add user invitations and plan-based feature gating
-- This migration adds:
-- 1. User invitations table for admin-controlled user management
-- 2. Plan types and feature limits for museums
-- 3. Functions for invitation management

-- Create invitations table
CREATE TABLE IF NOT EXISTS public.user_invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  invited_by_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  museum_id uuid REFERENCES public.museums(id) ON DELETE CASCADE NOT NULL,
  role_name text DEFAULT 'member',
  invitation_token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at timestamptz DEFAULT (now() + interval '7 days') NOT NULL,
  accepted_at timestamptz,
  accepted_by_user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Ensure unique email per museum
  UNIQUE(email, museum_id)
);

-- Add plan types and limits to museums table
ALTER TABLE public.museums 
ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'personal' CHECK (plan_type IN ('personal', 'museum'));

ALTER TABLE public.museums 
ADD COLUMN IF NOT EXISTS max_users integer DEFAULT 1;

ALTER TABLE public.museums 
ADD COLUMN IF NOT EXISTS features_enabled jsonb DEFAULT '{"exhibitions": true, "loans": false, "advanced_reporting": false, "bulk_operations": false}';

-- Update existing museums to set proper limits based on type
UPDATE public.museums 
SET 
  max_users = CASE 
    WHEN type = 'personal' THEN 1
    WHEN type IN ('museum', 'organisation', 'conservator') THEN 10
    ELSE 1
  END,
  plan_type = CASE 
    WHEN type = 'personal' THEN 'personal'
    WHEN type IN ('museum', 'organisation', 'conservator') THEN 'museum'
    ELSE 'personal'
  END,
  features_enabled = CASE 
    WHEN type = 'personal' THEN '{"exhibitions": true, "loans": false, "advanced_reporting": false, "bulk_operations": false}'::jsonb
    WHEN type IN ('museum', 'organisation', 'conservator') THEN '{"exhibitions": true, "loans": true, "advanced_reporting": true, "bulk_operations": true}'::jsonb
    ELSE '{"exhibitions": true, "loans": false, "advanced_reporting": false, "bulk_operations": false}'::jsonb
  END
WHERE plan_type IS NULL OR max_users IS NULL OR features_enabled IS NULL;

-- Update item limits based on plan type
UPDATE public.museums 
SET item_limit = CASE 
  WHEN plan_type = 'personal' THEN 20
  WHEN plan_type = 'museum' THEN 50
  ELSE 20
END;

-- Re-add is_admin column to profiles table (needed for admin functionality)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false NOT NULL;

-- Set first user of each museum as admin
UPDATE public.profiles 
SET is_admin = true 
WHERE id IN (
  SELECT DISTINCT ON (museum_id) id 
  FROM public.profiles 
  WHERE museum_id IS NOT NULL 
  ORDER BY museum_id, created_at ASC
);

-- Enable RLS on invitations
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for invitations
DROP POLICY IF EXISTS "invitations: admin can manage" ON public.user_invitations;
CREATE POLICY "invitations: admin can manage" ON public.user_invitations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.museum_id = user_invitations.museum_id 
    AND p.is_admin = true
  )
);

DROP POLICY IF EXISTS "invitations: invitee can view own" ON public.user_invitations;
CREATE POLICY "invitations: invitee can view own" ON public.user_invitations
FOR SELECT USING (
  auth.email() = email AND accepted_at IS NULL
);

-- Function to send invitation
CREATE OR REPLACE FUNCTION public.send_user_invitation(
  target_email text,
  target_museum_id uuid,
  target_role text DEFAULT 'member'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  current_museum_id uuid;
  is_admin boolean;
  museum_max_users integer;
  current_user_count integer;
  invitation_id uuid;
  invitation_token text;
BEGIN
  -- Get current user info
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Get current user's museum and admin status
  SELECT p.museum_id, p.is_admin INTO current_museum_id, is_admin
  FROM public.profiles p
  WHERE p.id = current_user_id;
  
  IF current_museum_id IS NULL THEN
    RAISE EXCEPTION 'User must belong to a museum';
  END IF;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only admins can send invitations';
  END IF;
  
  IF target_museum_id != current_museum_id THEN
    RAISE EXCEPTION 'Can only invite users to your own museum';
  END IF;
  
  -- Check user limits
  SELECT max_users INTO museum_max_users
  FROM public.museums
  WHERE id = target_museum_id;
  
  SELECT COUNT(*) INTO current_user_count
  FROM public.profiles
  WHERE museum_id = target_museum_id;
  
  IF current_user_count >= museum_max_users THEN
    RAISE EXCEPTION 'Museum has reached maximum user limit of %', museum_max_users;
  END IF;
  
  -- Check if user is already invited or exists
  IF EXISTS (
    SELECT 1 FROM public.user_invitations 
    WHERE email = target_email 
    AND museum_id = target_museum_id 
    AND accepted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'User is already invited to this museum';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM auth.users u
    JOIN public.profiles p ON u.id = p.id
    WHERE u.email = target_email 
    AND p.museum_id = target_museum_id
  ) THEN
    RAISE EXCEPTION 'User is already a member of this museum';
  END IF;
  
  -- Create invitation
  invitation_token := gen_random_uuid()::text;
  
  INSERT INTO public.user_invitations (
    email, 
    invited_by_user_id, 
    museum_id, 
    role_name,
    invitation_token
  )
  VALUES (
    target_email, 
    current_user_id, 
    target_museum_id, 
    target_role,
    invitation_token
  )
  RETURNING id INTO invitation_id;
  
  RETURN json_build_object(
    'success', true,
    'invitation_id', invitation_id,
    'invitation_token', invitation_token,
    'message', 'Invitation sent successfully'
  );
END;
$$;

-- Function to accept invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(
  invitation_token text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  current_email text;
  invitation_record record;
  museum_max_users integer;
  current_user_count integer;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Get current user email
  SELECT email INTO current_email FROM auth.users WHERE id = current_user_id;
  
  -- Get invitation details
  SELECT * INTO invitation_record
  FROM public.user_invitations
  WHERE invitation_token = accept_invitation.invitation_token
  AND accepted_at IS NULL
  AND expires_at > now()
  AND email = current_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;
  
  -- Check if user already has a museum
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_user_id 
    AND museum_id IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'User already belongs to a museum';
  END IF;
  
  -- Check user limits
  SELECT max_users INTO museum_max_users
  FROM public.museums
  WHERE id = invitation_record.museum_id;
  
  SELECT COUNT(*) INTO current_user_count
  FROM public.profiles
  WHERE museum_id = invitation_record.museum_id;
  
  IF current_user_count >= museum_max_users THEN
    RAISE EXCEPTION 'Museum has reached maximum user limit';
  END IF;
  
  -- Create or update profile
  INSERT INTO public.profiles (
    id, 
    museum_id, 
    role, 
    is_admin,
    display_name,
    email
  )
  VALUES (
    current_user_id,
    invitation_record.museum_id,
    invitation_record.role_name,
    false, -- New users are not admin by default
    split_part(current_email, '@', 1), -- Use email prefix as display name
    current_email
  )
  ON CONFLICT (id) DO UPDATE SET
    museum_id = invitation_record.museum_id,
    role = invitation_record.role_name,
    updated_at = now();
  
  -- Mark invitation as accepted
  UPDATE public.user_invitations
  SET 
    accepted_at = now(),
    accepted_by_user_id = current_user_id,
    updated_at = now()
  WHERE invitation_token = accept_invitation.invitation_token;
  
  RETURN json_build_object(
    'success', true,
    'museum_id', invitation_record.museum_id,
    'message', 'Invitation accepted successfully'
  );
END;
$$;

-- Function to upgrade museum plan
CREATE OR REPLACE FUNCTION public.upgrade_museum_plan(
  target_plan_type text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  current_museum_id uuid;
  is_admin boolean;
  new_item_limit integer;
  new_max_users integer;
  new_features jsonb;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  -- Validate plan type
  IF target_plan_type NOT IN ('personal', 'museum') THEN
    RAISE EXCEPTION 'Invalid plan type. Must be "personal" or "museum"';
  END IF;
  
  -- Get current user's museum and admin status
  SELECT p.museum_id, p.is_admin INTO current_museum_id, is_admin
  FROM public.profiles p
  WHERE p.id = current_user_id;
  
  IF current_museum_id IS NULL THEN
    RAISE EXCEPTION 'User must belong to a museum';
  END IF;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only admins can upgrade the plan';
  END IF;
  
  -- Set new limits based on plan
  IF target_plan_type = 'personal' THEN
    new_item_limit := 20;
    new_max_users := 1;
    new_features := '{"exhibitions": true, "loans": false, "advanced_reporting": false, "bulk_operations": false}';
  ELSIF target_plan_type = 'museum' THEN
    new_item_limit := 50;
    new_max_users := 10;
    new_features := '{"exhibitions": true, "loans": true, "advanced_reporting": true, "bulk_operations": true}';
  END IF;
  
  -- Update museum
  UPDATE public.museums
  SET 
    plan_type = target_plan_type,
    item_limit = new_item_limit,
    max_users = new_max_users,
    features_enabled = new_features,
    updated_at = now()
  WHERE id = current_museum_id;
  
  RETURN json_build_object(
    'success', true,
    'plan_type', target_plan_type,
    'item_limit', new_item_limit,
    'max_users', new_max_users,
    'message', 'Plan upgraded successfully'
  );
END;
$$;