-- Handle partial museum setups that might exist from imports or manual database changes
-- This ensures users with profiles but no museums get redirected properly

-- Function to check if a user needs onboarding setup
CREATE OR REPLACE FUNCTION public.user_needs_onboarding()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 
    FROM public.profiles p
    JOIN public.museums m ON p.museum_id = m.id
    WHERE p.id = auth.uid()
      AND p.museum_id IS NOT NULL
  )
$$;

-- Function to clean up orphaned profiles (profiles without valid museums)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_id uuid := auth.uid();
    museum_exists boolean;
BEGIN
    -- Check if user has a profile
    IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id) THEN
        -- Check if their museum_id points to a valid museum
        SELECT EXISTS (
            SELECT 1 
            FROM profiles p 
            JOIN museums m ON p.museum_id = m.id 
            WHERE p.id = user_id
        ) INTO museum_exists;
        
        -- If museum doesn't exist, clear the museum_id so they go through onboarding
        IF NOT museum_exists THEN
            UPDATE profiles 
            SET museum_id = NULL, role_id = NULL, updated_at = now()
            WHERE id = user_id;
        END IF;
    END IF;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_museum_validation ON profiles(id, museum_id) WHERE museum_id IS NOT NULL;