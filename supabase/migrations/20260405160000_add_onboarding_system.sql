-- Add onboarding and museum type support
-- This enables different museum types and tracks onboarding completion

-- Add type and onboarding fields to museums
ALTER TABLE museums 
    ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'museum' CHECK (type IN ('personal', 'museum', 'organisation', 'conservator')),
    ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

-- Add onboarding progress tracking (for checklist)
CREATE TABLE IF NOT EXISTS onboarding_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    step_name text NOT NULL,
    completed boolean NOT NULL DEFAULT false,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(museum_id, step_name)
);

-- Enable RLS
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS policy for onboarding progress
CREATE POLICY "Users can manage onboarding progress within their museum" ON onboarding_progress
    FOR ALL USING (museum_id = public.get_my_museum_id());

-- Function to create a new museum with profile for onboarding
CREATE OR REPLACE FUNCTION public.create_museum_with_profile(
    museum_name text,
    museum_type text DEFAULT 'museum'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_museum_id uuid;
    admin_role_id uuid;
    user_id uuid := auth.uid();
BEGIN
    -- Validate inputs
    IF museum_name IS NULL OR length(trim(museum_name)) = 0 THEN
        RAISE EXCEPTION 'Museum name cannot be empty';
    END IF;
    
    IF museum_type NOT IN ('personal', 'museum', 'organisation', 'conservator') THEN
        RAISE EXCEPTION 'Invalid museum type: %', museum_type;
    END IF;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated';
    END IF;
    
    -- Check if user already has a museum
    IF EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND museum_id IS NOT NULL) THEN
        RAISE EXCEPTION 'User already belongs to a museum';
    END IF;
    
    -- Create museum
    INSERT INTO museums (name, type, onboarding_completed)
    VALUES (trim(museum_name), museum_type, false)
    RETURNING id INTO new_museum_id;
    
    -- Get Admin role for the new museum 
    SELECT id INTO admin_role_id
    FROM roles 
    WHERE museum_id = new_museum_id AND lower(name) = 'admin';
    
    -- Create or update user profile
    INSERT INTO profiles (id, museum_id, role_id, is_admin)
    VALUES (user_id, new_museum_id, admin_role_id, true)
    ON CONFLICT (id) DO UPDATE SET
        museum_id = EXCLUDED.museum_id,
        role_id = EXCLUDED.role_id,
        is_admin = EXCLUDED.is_admin,
        updated_at = now();
    
    -- Initialize onboarding steps
    INSERT INTO onboarding_progress (museum_id, step_name, completed)
    VALUES 
        (new_museum_id, 'add_first_item', false),
        (new_museum_id, 'add_first_contact', false),
        (new_museum_id, 'create_exhibition', false)
    ON CONFLICT (museum_id, step_name) DO NOTHING;
    
    RETURN new_museum_id;
END;
$$;

-- Function to mark onboarding step as complete
CREATE OR REPLACE FUNCTION public.complete_onboarding_step(
    step_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_museum_id uuid := public.get_my_museum_id();
BEGIN
    IF user_museum_id IS NULL THEN
        RAISE EXCEPTION 'User must belong to a museum';
    END IF;
    
    -- Mark step as completed
    UPDATE onboarding_progress 
    SET completed = true, completed_at = now(), updated_at = now()
    WHERE museum_id = user_museum_id AND step_name = complete_onboarding_step.step_name;
    
    -- Check if all steps are completed and mark museum onboarding as complete
    IF NOT EXISTS (
        SELECT 1 FROM onboarding_progress 
        WHERE museum_id = user_museum_id AND completed = false
    ) THEN
        UPDATE museums 
        SET onboarding_completed = true, onboarding_completed_at = now(), updated_at = now()
        WHERE id = user_museum_id;
    END IF;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_museums_type ON museums(type);
CREATE INDEX IF NOT EXISTS idx_museums_onboarding ON museums(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_museum_id ON onboarding_progress(museum_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_step ON onboarding_progress(museum_id, step_name);