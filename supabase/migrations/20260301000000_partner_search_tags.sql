-- ============================================================================
-- K2 Commercial Finance – Partner Search & Filtering Enhancement
-- Migration: 20260301000000_partner_search_tags.sql
--
-- Adds loan_programs, searchable_tags columns to partner_profiles
-- for advanced filtering on the partner network page.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Add new array columns for searchable tags
-- ────────────────────────────────────────────────────────────────────────────
alter table public.partner_profiles
  add column if not exists loan_programs text[] default '{}',
  add column if not exists searchable_tags text[] default '{}';

comment on column public.partner_profiles.loan_programs is
  'Loan program tags: bridge, sba, stated_income, fix_flip, short_term_rental, etc.';
comment on column public.partner_profiles.searchable_tags is
  'Free-form searchable tags/keywords for this partner';

-- ────────────────────────────────────────────────────────────────────────────
-- 2. GIN index for fast array containment queries (@> operator)
-- ────────────────────────────────────────────────────────────────────────────
create index if not exists partner_profiles_loan_programs_idx
  on public.partner_profiles using gin (loan_programs);
create index if not exists partner_profiles_property_types_idx
  on public.partner_profiles using gin (property_types);
create index if not exists partner_profiles_searchable_tags_idx
  on public.partner_profiles using gin (searchable_tags);

-- ============================================================================
-- DONE – Run in Supabase SQL Editor, then refresh the admin partners page.
-- ============================================================================
