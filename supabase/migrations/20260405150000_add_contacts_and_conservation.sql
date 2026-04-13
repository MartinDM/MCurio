-- Contact relationships and conservation treatments
-- This adds many-to-many contact relationships and conservation action tracking

-- Many-to-many contact relationships with context
CREATE TABLE contact_relationships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    related_entity_type text NOT NULL CHECK (related_entity_type IN ('item', 'exhibition', 'loan_agreement', 'condition_report', 'conservation_treatment')),
    related_entity_id uuid NOT NULL,
    relationship_type text NOT NULL,
    start_date date,
    end_date date,
    primary_contact boolean DEFAULT false,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Conservation treatments and actions
CREATE TABLE conservation_treatments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    condition_report_id uuid REFERENCES condition_reports(id),
    conservator_contact_id uuid NOT NULL REFERENCES contacts(id),
    treatment_type text NOT NULL,
    description text NOT NULL,
    start_date date NOT NULL,
    completion_date date,
    status text NOT NULL CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    materials_used text,
    cost decimal(10,2),
    before_images text[],
    after_images text[],
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conservation_treatments ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage contact relationships within their museum" ON contact_relationships
    FOR ALL USING (museum_id = public.get_my_museum_id());

CREATE POLICY "Users can manage conservation treatments within their museum" ON conservation_treatments
    FOR ALL USING (museum_id = public.get_my_museum_id());

-- Create indexes
CREATE INDEX idx_contact_relationships_museum_id ON contact_relationships(museum_id);
CREATE INDEX idx_contact_relationships_contact_id ON contact_relationships(contact_id);
CREATE INDEX idx_contact_relationships_entity ON contact_relationships(related_entity_type, related_entity_id);
CREATE INDEX idx_contact_relationships_type ON contact_relationships(relationship_type);

CREATE INDEX idx_conservation_treatments_museum_id ON conservation_treatments(museum_id);
CREATE INDEX idx_conservation_treatments_item_id ON conservation_treatments(item_id);
CREATE INDEX idx_conservation_treatments_conservator ON conservation_treatments(conservator_contact_id);
CREATE INDEX idx_conservation_treatments_status ON conservation_treatments(status);
CREATE INDEX idx_conservation_treatments_dates ON conservation_treatments(start_date, completion_date);