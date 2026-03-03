-- Migration: Add membership_number to profiles for Certified Borrowers
-- Format: K2-XXXX (e.g. K2-1001)

-- 1. Add membership_number column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS membership_number text UNIQUE;

-- 2. Create a sequence for generating unique membership numbers starting at 1001
CREATE SEQUENCE IF NOT EXISTS membership_number_seq START WITH 1001;

-- 3. Create an RPC function callable from the service role to get next sequence value
CREATE OR REPLACE FUNCTION nextval_membership()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT nextval('membership_number_seq');
$$;

-- 4. Backfill: assign membership numbers to existing certified borrowers who don't have one
UPDATE profiles
SET membership_number = 'K2-' || nextval('membership_number_seq')
WHERE role = 'certified'
  AND membership_number IS NULL;
