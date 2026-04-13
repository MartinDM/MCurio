-- Add locations and movement tracking
-- This enables tracking where items are stored and their movement history

-- Create locations table for storage areas, galleries, etc.
CREATE TABLE locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    name text NOT NULL,
    location_type text NOT NULL CHECK (location_type IN ('storage', 'gallery', 'conservation_lab', 'external', 'on_loan', 'transit')),
    parent_location_id uuid REFERENCES locations(id),
    description text,
    climate_controlled boolean DEFAULT false,
    public_access boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Track item movements over time
CREATE TABLE item_movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    from_location_id uuid REFERENCES locations(id),
    to_location_id uuid REFERENCES locations(id),
    moved_by_contact_id uuid REFERENCES contacts(id),
    movement_date timestamptz NOT NULL DEFAULT now(),
    reason text,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Add current location to items table
ALTER TABLE items ADD COLUMN current_location_id uuid REFERENCES locations(id);

-- Add RLS policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_movements ENABLE ROW LEVEL SECURITY;

-- Locations policies
CREATE POLICY "Users can manage locations within their museum" ON locations
    FOR ALL USING (museum_id = public.get_my_museum_id());

-- Item movements policies  
CREATE POLICY "Users can manage movements within their museum" ON item_movements
    FOR ALL USING (museum_id = public.get_my_museum_id());

-- Create indexes for performance
CREATE INDEX idx_locations_museum_id ON locations(museum_id);
CREATE INDEX idx_locations_type ON locations(location_type);
CREATE INDEX idx_item_movements_museum_id ON item_movements(museum_id);
CREATE INDEX idx_item_movements_item_id ON item_movements(item_id);
CREATE INDEX idx_item_movements_date ON item_movements(movement_date);
CREATE INDEX idx_items_current_location ON items(current_location_id);