-- Roles refactoring and trial system implementation
-- This consolidates the confused roles system and adds 7-day trial functionality

-- Step 1: Add role column to profiles (simplified text-based approach)
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS role text;

-- Step 2: Backfill role data from existing is_admin flag
UPDATE public.profiles 
SET role = CASE 
    WHEN is_admin = true THEN 'admin'
    ELSE 'editor'
END 
WHERE role IS NULL;

-- Step 3: Set NOT NULL constraint on role
ALTER TABLE public.profiles 
    ALTER COLUMN role SET NOT NULL;

-- Step 4: Add check constraint for allowed role values  
ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'editor', 'viewer'));

-- Step 5: Clean up old role system (drop broken FK constraints first)
ALTER TABLE public.profiles
    DROP CONSTRAINT IF EXISTS profiles_role_museum_fkey;

-- Drop old columns
ALTER TABLE public.profiles
    DROP COLUMN IF EXISTS is_admin,
    DROP COLUMN IF EXISTS role_id;

-- Step 6: Add trial system fields to museums
ALTER TABLE public.museums 
    ADD COLUMN IF NOT EXISTS trial_started_at timestamptz DEFAULT now(),
    ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz DEFAULT (now() + INTERVAL '7 days'),
    ADD COLUMN IF NOT EXISTS item_limit integer DEFAULT 20;

-- Backfill trial dates for existing museums
UPDATE public.museums 
SET 
    trial_started_at = COALESCE(trial_started_at, created_at),
    trial_ends_at = COALESCE(trial_ends_at, created_at + INTERVAL '7 days')
WHERE trial_started_at IS NULL OR trial_ends_at IS NULL;

-- Step 7: Create function to check item limits with trial enforcement
CREATE OR REPLACE FUNCTION public.check_item_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    museum_record record;  
    current_item_count integer;
BEGIN
    -- Get museum info with trial data
    SELECT 
        trial_ends_at,
        item_limit,
        (trial_ends_at < now()) as trial_expired
    INTO museum_record
    FROM museums 
    WHERE id = NEW.museum_id;
    
    -- If museum not found, allow (shouldn't happen due to FK)
    IF NOT FOUND THEN
        RETURN NEW;
    END IF;
    
    -- If trial has expired, block item creation
    IF museum_record.trial_expired THEN
        RAISE EXCEPTION 'Trial period has expired. Cannot create new items.';
    END IF;
    
    -- Count existing items for this museum
    SELECT COUNT(*) INTO current_item_count
    FROM items 
    WHERE museum_id = NEW.museum_id;
    
    -- Check if adding this item would exceed the limit
    IF current_item_count >= museum_record.item_limit THEN
        RAISE EXCEPTION 'Item limit of % reached for this museum during trial period.', museum_record.item_limit;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Step 8: Create trigger to enforce item limits
DROP TRIGGER IF EXISTS trg_check_item_limit ON public.items;

CREATE TRIGGER trg_check_item_limit
    BEFORE INSERT ON public.items
    FOR EACH ROW 
    EXECUTE FUNCTION public.check_item_limit();

-- Step 9: Create helper function to get trial status for a museum
CREATE OR REPLACE FUNCTION public.get_trial_status(museum_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public 
AS $$
DECLARE
    result json;
    item_count integer;
BEGIN
    -- Get trial info and calculate status
    SELECT json_build_object(
        'trial_ends_at', trial_ends_at,
        'trial_expired', (trial_ends_at < now()),
        'days_remaining', GREATEST(0, EXTRACT(days FROM trial_ends_at - now())::integer),
        'item_limit', item_limit
    ) INTO result
    FROM museums 
    WHERE id = museum_uuid;
    
    -- Get current item count
    SELECT COUNT(*) INTO item_count
    FROM items 
    WHERE museum_id = museum_uuid;
    
    -- Add item count to result
    result := result || json_build_object('items_used', item_count);
    result := result || json_build_object('can_create_items', 
        (result->>'trial_expired')::boolean = false AND item_count < (result->>'item_limit')::integer
    );
    
    RETURN result;
END;
$$;

-- Step 10: Update onboarding function to set proper trial dates for new museums
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
    trial_start timestamptz := now();
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
    
    -- Create museum with trial period
    INSERT INTO museums (
        name, 
        type, 
        onboarding_completed,
        trial_started_at,
        trial_ends_at,
        item_limit
    )
    VALUES (
        trim(museum_name), 
        museum_type, 
        false,
        trial_start,
        trial_start + INTERVAL '7 days',
        20
    )
    RETURNING id INTO new_museum_id;
    
    -- Create or update user profile with admin role
    INSERT INTO profiles (id, museum_id, role)
    VALUES (user_id, new_museum_id, 'admin')
    ON CONFLICT (id) DO UPDATE SET
        museum_id = EXCLUDED.museum_id,
        role = EXCLUDED.role,
        updated_at = now();
    
    -- Initialize onboarding steps
    INSERT INTO onboarding_progress (museum_id, step_name, completed)
    VALUES 
        (new_museum_id, 'add_first_item', false),
        (new_museum_id, 'add_first_contact', false),
        (new_museum_id, 'create_exhibition', false),
        (new_museum_id, 'create_condition_report', false)
    ON CONFLICT (museum_id, step_name) DO NOTHING;
    
    RETURN new_museum_id;
END;
$$;

-- Step 11: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_museums_trial_dates ON public.museums(trial_ends_at, trial_started_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_items_museum_count ON public.items(museum_id);

-- Step 12: Update RLS policies for new role column
-- Drop old policies that reference is_admin
DROP POLICY IF EXISTS "profiles: read own" ON public.profiles;
DROP POLICY IF EXISTS "profiles: insert own" ON public.profiles;  
DROP POLICY IF EXISTS "profiles: update own" ON public.profiles;

-- Recreate with role-based logic
CREATE POLICY "profiles: manage own profile"
ON public.profiles
FOR ALL
USING (
    id = auth.uid() OR 
    (
        SELECT role IN ('admin') 
        FROM profiles 
        WHERE id = auth.uid() AND museum_id = profiles.museum_id
    )
);