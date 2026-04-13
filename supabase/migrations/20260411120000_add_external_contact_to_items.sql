-- Add external contact relationship to items
-- This allows items to have an optional external contact (e.g., donor, lender, seller)

-- Add external_contact_id to items table
ALTER TABLE public.items 
    ADD COLUMN IF NOT EXISTS external_contact_id uuid REFERENCES public.contacts(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_items_external_contact_id ON public.items(external_contact_id);

-- Update RLS policy to include external contact access (contacts can view items they're associated with)
DROP POLICY IF EXISTS "items: view within museum" ON public.items;
CREATE POLICY "items: view within museum"
ON public.items
FOR SELECT
USING (
    museum_id = public.get_my_museum_id() OR
    owner_id = auth.uid()
);