-- Add missing updated_at column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Update existing records to have the current timestamp
UPDATE public.profiles SET updated_at = now() WHERE updated_at IS NULL;