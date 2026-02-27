-- ============================================================================
-- K2 Commercial Finance – Providers table
-- Migration: 20260226300000_create_providers.sql
--
-- Stores partnership / provider inquiries submitted from the partnership page.
-- Admin approves → provider becomes visible on the public Resources page.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Providers table
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.providers (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  company         text not null default '',
  type            text not null default '',
  state           text not null default '',
  website         text,
  description     text not null default '',
  status          text not null default 'pending'
    check (status in ('pending', 'approved', 'declined')),
  admin_notes     text,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists providers_status_idx on public.providers (status);
create index if not exists providers_email_idx  on public.providers (email);

-- ────────────────────────────────────────────────────────────────────────────
-- 2. RLS
-- ────────────────────────────────────────────────────────────────────────────
alter table public.providers enable row level security;

-- Anyone (including anonymous) can submit a provider inquiry
drop policy if exists "Anyone can submit provider inquiry" on public.providers;
create policy "Anyone can submit provider inquiry"
  on public.providers
  for insert
  to anon, authenticated
  with check (true);

-- Anyone can read approved providers (for the public resources page)
drop policy if exists "Anyone can read approved providers" on public.providers;
create policy "Anyone can read approved providers"
  on public.providers
  for select
  to anon, authenticated
  using (status = 'approved');

-- Admins can do everything
drop policy if exists "Admins can manage providers" on public.providers;
create policy "Admins can manage providers"
  on public.providers
  for all
  to authenticated
  using  ( public.is_admin() )
  with check ( public.is_admin() );

-- ────────────────────────────────────────────────────────────────────────────
-- 3. Updated_at trigger
-- ────────────────────────────────────────────────────────────────────────────
drop trigger if exists providers_updated_at on public.providers;
create trigger providers_updated_at
  before update on public.providers
  for each row
  execute function public.handle_updated_at();
