-- Migration: Create application_docs table for admin-uploaded downloadable documents (Document Library)

CREATE TABLE IF NOT EXISTS application_docs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  file_name   text NOT NULL,
  file_url    text NOT NULL,
  file_size   integer NOT NULL DEFAULT 0,
  mime_type   text NOT NULL DEFAULT 'application/pdf',
  category    text NOT NULL DEFAULT 'template',
  doc_type    text NOT NULL DEFAULT 'application_document'
    CHECK (doc_type IN ('application_document', 'resource', 'partner_document')),
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_application_docs_active ON application_docs(is_active);
CREATE INDEX IF NOT EXISTS idx_application_docs_doc_type ON application_docs(doc_type);
CREATE INDEX IF NOT EXISTS idx_application_docs_sort ON application_docs(sort_order, title);

-- RLS
ALTER TABLE application_docs ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read active docs
CREATE POLICY "Authenticated users can view active docs"
  ON application_docs FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Service role has full access (for admin API)
CREATE POLICY "Service role full access"
  ON application_docs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
