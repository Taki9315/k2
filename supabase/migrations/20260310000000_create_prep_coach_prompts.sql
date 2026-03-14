-- ============================================================================
-- K2 Commercial Finance – Prep Coach Prompts table
-- Migration: 20260310000000_create_prep_coach_prompts.sql
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Prep Coach Prompts table (managed by admin, rendered on public page)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.prep_coach_prompts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  content         text not null default '',
  "order"         integer not null default 0,
  is_hidden       boolean not null default false,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists prep_coach_prompts_order_idx on public.prep_coach_prompts ("order");
create index if not exists prep_coach_prompts_hidden_idx on public.prep_coach_prompts (is_hidden);

alter table public.prep_coach_prompts enable row level security;

-- Public can read visible prompts
drop policy if exists "Anyone can read visible prompts" on public.prep_coach_prompts;
create policy "Anyone can read visible prompts"
  on public.prep_coach_prompts
  for select
  to anon, authenticated
  using (is_hidden = false);

-- Admins can do everything (service role bypasses RLS)
drop policy if exists "Admins can manage prompts" on public.prep_coach_prompts;
create policy "Admins can manage prompts"
  on public.prep_coach_prompts
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 2. Auto-update updated_at
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.handle_prep_coach_prompts_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_prep_coach_prompts_updated_at on public.prep_coach_prompts;
create trigger set_prep_coach_prompts_updated_at
  before update on public.prep_coach_prompts
  for each row
  execute function public.handle_prep_coach_prompts_updated_at();
