-- Migration: Multi-deal support for Deal Room
-- Adds deals table, updates deal_room_files and share tokens to be per-deal

-- 1. Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  password_hash text,          -- optional bcrypt hash for password-protected sharing
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deals_user ON deals(user_id);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deals"
  ON deals FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own deals"
  ON deals FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own deals"
  ON deals FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own deals"
  ON deals FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role full access to deals"
  ON deals FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 2. Add deal_id column to deal_room_files (nullable for backward compat)
ALTER TABLE deal_room_files ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES deals(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_deal_room_files_deal ON deal_room_files(deal_id);

-- 3. Add missing columns to deal_room_share_tokens (nullable for backward compat)
ALTER TABLE deal_room_share_tokens ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES deals(id) ON DELETE CASCADE;
ALTER TABLE deal_room_share_tokens ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE deal_room_share_tokens ADD COLUMN IF NOT EXISTS expires_at timestamptz DEFAULT (now() + interval '45 days');
ALTER TABLE deal_room_share_tokens ADD COLUMN IF NOT EXISTS revoked boolean DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_share_tokens_deal ON deal_room_share_tokens(deal_id);

-- 4. Drop the old unique index on user_id (multi-deal = multiple tokens per user)
DROP INDEX IF EXISTS idx_deal_room_share_tokens_user;
-- Recreate as a normal (non-unique) index
CREATE INDEX IF NOT EXISTS idx_deal_room_share_tokens_user ON deal_room_share_tokens(user_id);

-- 5. Refresh PostgREST schema cache so new columns are visible immediately
NOTIFY pgrst, 'reload schema';
