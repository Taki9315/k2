-- Seed the K2 Financing Success Kit guide & Loan Comparison Spreadsheet
-- into the application_docs document library so they appear in the vault.

INSERT INTO application_docs (title, description, file_name, file_url, file_size, mime_type, category, doc_type, is_active, sort_order)
VALUES
  (
    'K2 Financing Success Kit — Full Guide',
    'The complete 4-chapter guide covering borrower preparation, loan programs, finding the right lender, and navigating underwriting to closing. Includes key formulas, checklists, and glossary.',
    'K2_Financing_Success_Kit.md',
    '/assets/K2_Financing_Success_Kit.md',
    0,
    'text/markdown',
    'guide',
    'resource',
    true,
    1
  ),
  (
    'Loan Comparison Spreadsheet',
    'Side-by-side loan comparison worksheet with columns for lender name, contact, term, rate, LTV, recourse, reserves, fees, and notes. Includes example entries and a Quick Reference sheet with key formulas.',
    'K2_Loan_Comparison_Spreadsheet.xlsx',
    '/assets/K2_Loan_Comparison_Spreadsheet.xlsx',
    0,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'template',
    'resource',
    true,
    2
  )
ON CONFLICT DO NOTHING;
