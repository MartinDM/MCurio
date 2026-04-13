-- Fix circular dependency in RLS policies
-- The issue: get_my_museum_id() function queries profiles table, 
-- but profiles table has RLS that can trigger other policies using get_my_museum_id()
-- Solution: Make get_my_museum_id() a SECURITY DEFINER function to bypass RLS

-- Modify existing function to be SECURITY DEFINER instead of dropping/recreating
CREATE OR REPLACE FUNCTION public.get_my_museum_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER  -- This allows the function to bypass RLS
SET search_path = public
AS $$
  SELECT museum_id
  FROM public.profiles
  WHERE id = auth.uid()
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_museum_id() TO authenticated;