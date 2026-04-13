-- Media assets and linking system
-- This handles images, documents, and other media files linked to various entities

-- Media assets storage
CREATE TABLE media_assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    filename text NOT NULL,
    original_filename text,
    file_size integer,
    mime_type text,
    storage_url text NOT NULL,
    thumbnail_url text,
    media_type text NOT NULL CHECK (media_type IN ('image', 'document', 'video', 'audio')),
    title text,
    description text,
    alt_text text,
    copyright_info text,
    photographer_contact_id uuid REFERENCES contacts(id),
    date_taken date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Link media to various entities (items, exhibitions, reports, etc.)
CREATE TABLE media_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    media_asset_id uuid NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    linked_entity_type text NOT NULL CHECK (linked_entity_type IN ('item', 'exhibition', 'condition_report', 'contact', 'loan_agreement', 'conservation_treatment')),
    linked_entity_id uuid NOT NULL,
    link_type text NOT NULL CHECK (link_type IN ('primary_image', 'gallery_image', 'documentation', 'condition_photo', 'before_treatment', 'after_treatment')),
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_links ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage media assets within their museum" ON media_assets
    FOR ALL USING (museum_id = public.get_my_museum_id());

CREATE POLICY "Users can manage media links within their museum" ON media_links
    FOR ALL USING (museum_id = public.get_my_museum_id());

-- Create indexes
CREATE INDEX idx_media_assets_museum_id ON media_assets(museum_id);
CREATE INDEX idx_media_assets_type ON media_assets(media_type);
CREATE INDEX idx_media_links_museum_id ON media_links(museum_id);
CREATE INDEX idx_media_links_asset_id ON media_links(media_asset_id);
CREATE INDEX idx_media_links_entity ON media_links(linked_entity_type, linked_entity_id);
CREATE INDEX idx_media_links_type ON media_links(link_type);
CREATE INDEX idx_media_links_display_order ON media_links(linked_entity_type, linked_entity_id, display_order);