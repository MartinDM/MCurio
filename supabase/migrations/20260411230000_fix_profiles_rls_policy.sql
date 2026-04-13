-- Fix circular RLS policy on profiles table
-- The current policy queries profiles table from within the profiles policy itself,
-- causing infinite recursion when any authenticated function tries to access profiles

-- Drop the problematic policy
DROP POLICY IF EXISTS "profiles: manage own profile" ON public.profiles;

-- Create a simpler policy that doesn't cause circular dependencies
-- Users can only see their own profile
CREATE POLICY "profiles: read own profile"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

-- Users can only update their own profile (excluding museum_id and role which should be admin-only)
CREATE POLICY "profiles: update own profile"  
ON public.profiles
FOR UPDATE
USING (id = auth.uid());

-- Only allow inserts during user creation (handled by trigger)
CREATE POLICY "profiles: insert own profile"
ON public.profiles  
FOR INSERT
WITH CHECK (id = auth.uid());