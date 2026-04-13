-- Enhanced exhibitions with detailed item relationships
-- This replaces simple item-exhibition linking with rich context

-- Enhanced exhibition-item relationships with context
CREATE TABLE exhibition_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    exhibition_id uuid NOT NULL REFERENCES exhibitions(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    display_order integer,
    display_location text,
    item_role text CHECK (item_role IN ('featured', 'supporting', 'context', 'loan')),
    label_text text,
    date_installed date,
    date_removed date,
    installation_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE exhibition_items ENABLE ROW LEVEL SECURITY;

-- RLS policy for exhibition items
CREATE POLICY "Users can manage exhibition items within their museum" ON exhibition_items
    FOR ALL USING (museum_id = public.get_my_museum_id());

-- Create indexes
CREATE INDEX idx_exhibition_items_museum_id ON exhibition_items(museum_id);
CREATE INDEX idx_exhibition_items_exhibition_id ON exhibition_items(exhibition_id);
CREATE INDEX idx_exhibition_items_item_id ON exhibition_items(item_id);
CREATE INDEX idx_exhibition_items_display_order ON exhibition_items(exhibition_id, display_order);