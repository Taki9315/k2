-- Add document_name column to deal_room_files for categorized uploads
ALTER TABLE deal_room_files ADD COLUMN IF NOT EXISTS document_name text;
