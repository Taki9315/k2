-- Admin notifications table
-- Tracks user actions (signup, login, logout, document uploads, etc.)
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('signup', 'login', 'logout', 'upload', 'contact', 'checkout', 'general')),
  title text NOT NULL,
  message text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text,
  user_email text,
  metadata jsonb DEFAULT '{}',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast unread count and chronological listing
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created ON admin_notifications(created_at DESC);

-- Enable realtime for admin notifications
ALTER PUBLICATION supabase_realtime ADD TABLE admin_notifications;
