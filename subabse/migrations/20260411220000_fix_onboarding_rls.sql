-- Fix RLS circular dependency in user_needs_onboarding function
-- This function needs SECURITY DEFINER to bypass RLS policies when checking profiles

CREATE OR REPLACE FUNCTION public.user_needs_onboarding()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER  -- Add SECURITY DEFINER to bypass RLS
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

-- Grant execute permission to authenticated users  
GRANT EXECUTE ON FUNCTION public.user_needs_onboarding() TO authenticated;