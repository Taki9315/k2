-- Migration: Add review workflow to deal_room_files + drop unused application_docs
-- Admin can now review user-uploaded Deal Room documents (approve / decline).

-- 1. Add review columns to deal_room_files
ALTER TABLE deal_room_files
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending', 'approved', 'declined')),
  ADD COLUMN IF NOT EXISTS admin_note text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES profiles(id);

-- Index for admin queries (all files, newest first)
CREATE INDEX IF NOT EXISTS idx_deal_room_files_status ON deal_room_files(review_status);
CREATE INDEX IF NOT EXISTS idx_deal_room_files_created ON deal_room_files(created_at DESC);

-- 2. Allow service_role to read ALL deal_room_files (for admin listing)
-- (The existing service_role policy already grants full access.)

-- 3. Drop the application_docs table if it was previously created
DROP TABLE IF EXISTS application_docs;
