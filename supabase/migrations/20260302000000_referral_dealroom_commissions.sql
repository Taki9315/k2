-- Migration: Add referral system, deal room, and commission tracking
-- Run this after all previous migrations

-- 1. Add referral_code to profiles (for partner referral links)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- 2. Add workbook_purchased and certified_at to profiles if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS workbook_purchased boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certified_at timestamptz;

-- 3. Create referral_commissions table
CREATE TABLE IF NOT EXISTS referral_commissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid NOT NULL REFERENCES profiles(id),
  buyer_id uuid NOT NULL REFERENCES profiles(id),
  product text NOT NULL,
  referral_code text NOT NULL,
  commission_amount integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  order_stripe_payment_intent text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index for quick partner lookups
CREATE INDEX IF NOT EXISTS idx_referral_commissions_partner ON referral_commissions(partner_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_status ON referral_commissions(status);

-- 4. Create deal_room_files table
CREATE TABLE IF NOT EXISTS deal_room_files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deal_room_files_user ON deal_room_files(user_id);

-- 5. Create documents storage bucket (if using Supabase Storage)
-- Run this in the Supabase dashboard SQL editor if not already present:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
-- ON CONFLICT (id) DO NOTHING;

-- 6. RLS policies for referral_commissions (admin-only read/write, no public access)
ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to commissions"
  ON referral_commissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. RLS policies for deal_room_files (users can manage their own files)
ALTER TABLE deal_room_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deal room files"
  ON deal_room_files
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own deal room files"
  ON deal_room_files
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own deal room files"
  ON deal_room_files
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role full access to deal room files"
  ON deal_room_files
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
