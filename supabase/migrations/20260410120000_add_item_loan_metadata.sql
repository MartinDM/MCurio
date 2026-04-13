-- Enhance loans for per-item loan metadata
-- This adds required fields for item-specific loan management and one-loan-per-item constraint

-- Add missing fields to loan_agreements table
ALTER TABLE loan_agreements 
    ADD COLUMN IF NOT EXISTS description text,
    ADD COLUMN IF NOT EXISTS internal_approver_contact_id uuid REFERENCES contacts(id),
    ADD COLUMN IF NOT EXISTS attachment_url text,
    ADD COLUMN IF NOT EXISTS agreed_return_date date;

-- Add current loan reference to items table (one loan at a time per item)
ALTER TABLE items 
    ADD COLUMN IF NOT EXISTS current_loan_agreement_id uuid REFERENCES loan_agreements(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_items_current_loan_agreement_id ON items(current_loan_agreement_id);

-- Add comment to clarify the relationship
COMMENT ON COLUMN items.current_loan_agreement_id IS 'Current active loan for this item. Only one loan per item at a time.';

-- Create view for easy querying of items with their current loan status
CREATE OR REPLACE VIEW items_with_loan_status AS
SELECT 
    i.*,
    la.id as loan_id,
    la.loan_number,
    la.loan_type,
    la.status as loan_status,
    la.start_date as loan_start_date,
    la.end_date as loan_end_date,
    la.agreed_return_date,
    la.description as loan_description,
    lender.name as lender_name,
    borrower.name as borrower_name,
    approver.name as internal_approver_name,
    CASE 
        WHEN la.end_date < CURRENT_DATE AND la.status = 'active' THEN true
        ELSE false
    END as is_loan_overdue
FROM items i
LEFT JOIN loan_agreements la ON i.current_loan_agreement_id = la.id
LEFT JOIN contacts lender ON la.lender_contact_id = lender.id
LEFT JOIN contacts borrower ON la.borrower_contact_id = borrower.id
LEFT JOIN contacts approver ON la.internal_approver_contact_id = approver.id;

-- RLS for the view - Views inherit RLS from underlying tables, cannot enable RLS directly on views
-- The items_with_loan_status view inherits RLS from the items table
-- CREATE POLICY "Users can view item loan status within their museum" ON items_with_loan_status
--     FOR SELECT USING (museum_id = public.get_my_museum_id());

-- Function to automatically manage loan_items when setting current loan on item
CREATE OR REPLACE FUNCTION handle_item_loan_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting a new loan
    IF NEW.current_loan_agreement_id IS NOT NULL THEN
        -- Remove any old loan_items entries for this item
        DELETE FROM loan_items WHERE item_id = NEW.id;
        
        -- Add new loan_items entry
        INSERT INTO loan_items (loan_agreement_id, item_id, museum_id, status)
        VALUES (NEW.current_loan_agreement_id, NEW.id, NEW.museum_id, 'pending')
        ON CONFLICT DO NOTHING;
    ELSE
        -- If removing loan, clean up loan_items
        DELETE FROM loan_items WHERE item_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic loan_items management
DROP TRIGGER IF EXISTS trigger_item_loan_assignment ON items;
CREATE TRIGGER trigger_item_loan_assignment
    AFTER UPDATE OF current_loan_agreement_id ON items
    FOR EACH ROW
    EXECUTE FUNCTION handle_item_loan_assignment();