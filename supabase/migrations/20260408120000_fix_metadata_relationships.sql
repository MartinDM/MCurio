-- Fix metadata relationships: proper tags, clean up locations, standardize contacts
-- This migration converts text arrays and arbitrary text fields to proper entity relationships

-- Create tags table for proper tag management
CREATE TABLE tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text DEFAULT '#1890ff',
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(museum_id, name)
);

-- Create item_tags junction table for many-to-many relationship
CREATE TABLE item_tags (
    item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (item_id, tag_id)
);

-- Enable RLS for new tables
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for tags
CREATE POLICY "Users can manage tags within their museum" ON tags
    FOR ALL USING (museum_id = public.get_my_museum_id());

CREATE POLICY "Users can manage item tags within their museum" ON item_tags
    FOR ALL USING (museum_id = public.get_my_museum_id());

-- Create indexes for performance
CREATE INDEX idx_tags_museum_id ON tags(museum_id);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_item_tags_museum_id ON item_tags(museum_id);
CREATE INDEX idx_item_tags_item_id ON item_tags(item_id);
CREATE INDEX idx_item_tags_tag_id ON item_tags(tag_id);

-- Function to migrate existing text tags to tag entities
CREATE OR REPLACE FUNCTION migrate_item_tags() RETURNS void AS $$
DECLARE
    item_record RECORD;
    tag_name text;
    tag_id uuid;
BEGIN
    -- Loop through all items with tags
    FOR item_record IN 
        SELECT id, museum_id, tags 
        FROM items 
        WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
    LOOP
        -- Loop through each tag in the array
        FOREACH tag_name IN ARRAY item_record.tags
        LOOP
            -- Skip empty tags
            IF trim(tag_name) = '' THEN
                CONTINUE;
            END IF;
            
            -- Create or find existing tag
            INSERT INTO tags (museum_id, name)
            VALUES (item_record.museum_id, trim(tag_name))
            ON CONFLICT (museum_id, name) DO NOTHING;
            
            -- Get the tag_id
            SELECT id INTO tag_id 
            FROM tags 
            WHERE museum_id = item_record.museum_id 
            AND name = trim(tag_name);
            
            -- Create item_tag relationship
            INSERT INTO item_tags (item_id, tag_id, museum_id)
            VALUES (item_record.id, tag_id, item_record.museum_id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Run the migration function
SELECT migrate_item_tags();

-- Drop the migration function after use
DROP FUNCTION migrate_item_tags();

-- Remove old text-based fields that are now properly structured
ALTER TABLE items 
    DROP COLUMN IF EXISTS tags,
    DROP COLUMN IF EXISTS current_location; -- Keep current_location_id

-- Update acquisition_source to be clearer that it should reference contacts
-- For now, keep as text but add comment for future migration
COMMENT ON COLUMN items.acquisition_source IS 'DEPRECATED: Should be replaced with contact_relationships entries for acquisition source contacts';

-- Add constraint to ensure acquisition_source references are eventually migrated
-- ALTER TABLE items ADD CONSTRAINT acquisition_source_migration_reminder 
-- CHECK (acquisition_source IS NULL OR acquisition_source LIKE '%TO_MIGRATE%');

-- Create view for easy tag querying
CREATE VIEW item_tags_view AS
SELECT 
    i.id as item_id,
    i.title as item_title,
    t.id as tag_id,
    t.name as tag_name,
    t.color as tag_color,
    i.museum_id
FROM items i
JOIN item_tags it ON i.id = it.item_id
JOIN tags t ON it.tag_id = t.id;

-- Note: Views inherit RLS from underlying tables, so no need to enable RLS on the view itself