-- Add provenance tracking for legal ownership history
-- This tracks the chain of ownership/custody over time

-- Provenance entries track ownership history
CREATE TABLE provenance_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    owner_contact_id uuid REFERENCES contacts(id),
    ownership_type text NOT NULL CHECK (ownership_type IN ('owned', 'donated', 'purchased', 'inherited', 'loaned_from', 'found', 'unknown')),
    date_acquired date,
    date_until date, -- NULL means current ownership
    acquisition_method text,
    acquisition_price decimal(10,2),
    notes text,
    documentation_url text,
    sequence_order integer NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add reference to current provenance on items
ALTER TABLE items ADD COLUMN current_provenance_id uuid REFERENCES provenance_entries(id);

-- Enable RLS
ALTER TABLE provenance_entries ENABLE ROW LEVEL SECURITY;

-- RLS policy for provenance
CREATE POLICY "Users can manage provenance within their museum" ON provenance_entries
    FOR ALL USING (museum_id = public.get_my_museum_id());

-- Create indexes
CREATE INDEX idx_provenance_museum_id ON provenance_entries(museum_id);
CREATE INDEX idx_provenance_item_id ON provenance_entries(item_id);
CREATE INDEX idx_provenance_sequence ON provenance_entries(item_id, sequence_order);
CREATE INDEX idx_items_current_provenance ON items(current_provenance_id);