-- Enhanced loans with full lifecycle management
-- This adds proper loan agreements and item tracking

-- Loan agreements (parent record for loan management)
CREATE TABLE loan_agreements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id uuid NOT NULL REFERENCES museums(id) ON DELETE CASCADE,
    loan_number text NOT NULL,
    loan_type text NOT NULL CHECK (loan_type IN ('incoming', 'outgoing')),
    lender_contact_id uuid REFERENCES contacts(id),
    borrower_contact_id uuid REFERENCES contacts(id),
    purpose text,
    agreement_date date,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status text NOT NULL CHECK (status IN ('draft', 'active', 'extended', 'returned', 'overdue', 'cancelled')),
    insurance_value decimal(10,2),
    conditions text,
    transport_requirements text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enhance existing loan_items table with detailed tracking
ALTER TABLE loan_items 
    ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS loan_agreement_id uuid REFERENCES loan_agreements(id),
    ADD COLUMN IF NOT EXISTS condition_out_report_id uuid REFERENCES condition_reports(id),
    ADD COLUMN IF NOT EXISTS condition_in_report_id uuid REFERENCES condition_reports(id),
    ADD COLUMN IF NOT EXISTS date_shipped date,
    ADD COLUMN IF NOT EXISTS date_received date,
    ADD COLUMN IF NOT EXISTS date_returned date,
    ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'received', 'displayed', 'returned'));

-- Add reference to loan agreement on existing loans table
ALTER TABLE loans ADD COLUMN loan_agreement_id uuid REFERENCES loan_agreements(id);

-- Enable RLS
ALTER TABLE loan_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_items ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage loan agreements within their museum" ON loan_agreements
    FOR ALL USING (museum_id = public.get_my_museum_id());

CREATE POLICY "Users can manage loan items within their museum" ON loan_items
    FOR ALL USING (museum_id = public.get_my_museum_id());

-- Create indexes
CREATE INDEX idx_loan_agreements_museum_id ON loan_agreements(museum_id);
CREATE INDEX idx_loan_agreements_status ON loan_agreements(status);
CREATE INDEX idx_loan_agreements_dates ON loan_agreements(start_date, end_date);
CREATE INDEX idx_loan_items_museum_id ON loan_items(museum_id);
CREATE INDEX idx_loan_items_agreement_id ON loan_items(loan_agreement_id);
CREATE INDEX idx_loan_items_item_id ON loan_items(item_id);
CREATE INDEX idx_loan_items_status ON loan_items(status);