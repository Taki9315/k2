-- Lender Outreach Tracker
-- Per-deal status tracking + potential lenders table

-- Deal-level outreach status
ALTER TABLE deals ADD COLUMN IF NOT EXISTS outreach_status text NOT NULL DEFAULT 'preparing_materials';
-- Valid values: preparing_materials, lenders_identified, submitted_to_lenders, closed

-- Potential lenders table (manual rows per deal)
CREATE TABLE IF NOT EXISTS deal_lenders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lender_name text NOT NULL DEFAULT '',
  contact_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'submitted',
  -- Valid statuses: submitted, in_review, declined, closing, closed
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deal_lenders_deal ON deal_lenders(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_lenders_user ON deal_lenders(user_id);

-- RLS
ALTER TABLE deal_lenders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_deal_lenders"
  ON deal_lenders FOR ALL TO service_role USING (true) WITH CHECK (true);
