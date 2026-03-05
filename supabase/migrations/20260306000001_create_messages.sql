-- ============================================================
-- In-app Messaging System
-- Messages sent by admin appear in user dashboard inbox.
-- Users can reply; admin sees replies in admin panel.
-- ============================================================

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id     uuid NOT NULL,               -- groups original + replies
  sender_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject       text NOT NULL,
  body          text NOT NULL,
  is_read       boolean DEFAULT false,
  read_at       timestamptz,
  parent_id     uuid REFERENCES messages(id) ON DELETE SET NULL,  -- reply-to
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_recipient   ON messages(recipient_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_thread      ON messages(thread_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_sender      ON messages(sender_id, created_at DESC);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_messages_updated_at();

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read their own messages (sent or received)
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

-- Users can insert messages (replies) where they are the sender
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update their own received messages (mark read)
CREATE POLICY "Users can mark messages read"
  ON messages FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Service role bypass for admin sending
-- (service_role already bypasses RLS)
