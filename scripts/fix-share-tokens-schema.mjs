/**
 * One-time script to add missing columns to deal_room_share_tokens table.
 * Run with: node scripts/fix-share-tokens-schema.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load .env manually
const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const sql = `
  ALTER TABLE deal_room_share_tokens ADD COLUMN IF NOT EXISTS expires_at timestamptz DEFAULT (now() + interval '45 days');
  ALTER TABLE deal_room_share_tokens ADD COLUMN IF NOT EXISTS revoked boolean DEFAULT false;
  ALTER TABLE deal_room_share_tokens ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES deals(id) ON DELETE CASCADE;
  ALTER TABLE deal_room_share_tokens ADD COLUMN IF NOT EXISTS password_hash text;
  NOTIFY pgrst, 'reload schema';
`;

console.log('Running migration...');
const { data, error } = await supabase.rpc('exec_sql', { query: sql });
if (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
console.log('Done! Columns added and schema cache reloaded.');
console.log('You may need to wait a few seconds for PostgREST to pick up the changes.');
