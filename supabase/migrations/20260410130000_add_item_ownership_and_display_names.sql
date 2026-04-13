-- Add item ownership and profile display names
-- This enables items to have internal owners (staff) and friendly display names

-- Step 1: Add display_name column to profiles for friendly names
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS display_name text;

-- Step 2: Add owner_id to items table for internal ownership
ALTER TABLE public.items 
    ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(id);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_items_owner_id ON public.items(owner_id);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);

-- Step 4: Backfill display_name from auth.users email (temporary for existing users)
-- This can be updated manually by users later
UPDATE public.profiles 
SET display_name = COALESCE(
    (SELECT split_part(email, '@', 1) FROM auth.users WHERE id = profiles.id),
    'User'
)
WHERE display_name IS NULL;

-- Step 5: Set default owner for existing items (assign to first admin of each museum)
UPDATE public.items 
SET owner_id = (
    SELECT p.id 
    FROM public.profiles p 
    WHERE p.museum_id = items.museum_id 
      AND p.role = 'admin' 
    LIMIT 1
)
WHERE owner_id IS NULL;

-- Step 6: Create helper function to get staff for owner dropdown
CREATE OR REPLACE FUNCTION public.get_museum_staff(museum_uuid uuid)
RETURNS TABLE (
    id uuid,
    display_name text,
    role text,
    email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.display_name,
        p.role,
        u.email
    FROM public.profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE p.museum_id = museum_uuid
    ORDER BY p.display_name ASC;
END;
$$;

-- Step 7: Update RLS policies to include owner relationships
-- Items can be viewed by owners and museum members
DROP POLICY IF EXISTS "items: view within museum" ON public.items;
CREATE POLICY "items: view within museum"
ON public.items
FOR SELECT
USING (
    museum_id = public.get_my_museum_id() OR
    owner_id = auth.uid()
);

-- Step 8: Profiles can be viewed by museum members (for staff directory)
CREATE POLICY "profiles: view museum staff"
ON public.profiles
FOR SELECT
USING (
    museum_id = public.get_my_museum_id() OR
    id = auth.uid()
);