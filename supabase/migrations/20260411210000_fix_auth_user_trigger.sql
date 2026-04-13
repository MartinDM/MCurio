-- Fix the handle_new_user trigger to include role field
-- This ensures new auth users get a proper profile with a default role

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  INSERT INTO public.profiles (id, museum_id, role)
  VALUES (
    new.id,
    null, -- museum_id will be assigned later
    'editor' -- default role for new users
  );
  RETURN new;
END;
$$;