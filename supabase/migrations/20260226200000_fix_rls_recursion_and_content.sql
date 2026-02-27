-- ============================================================================
-- K2 Commercial Finance – Fix RLS infinite recursion + content file_url
-- Migration: 20260226200000_fix_rls_recursion_and_content.sql
--
-- Problems fixed:
--   1. "Admins can read all profiles" policy causes infinite recursion
--      because it queries public.profiles (the very table it guards).
--   2. content table may be missing the file_url column.
--
-- Solution:
--   • Create a SECURITY DEFINER function `public.is_admin()` that bypasses
--     RLS, so admin-check policies never re-enter profiles RLS.
--   • Replace all recursive admin policies on profiles, content, and storage.
--   • Ensure content.file_url column exists.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Helper: is_admin() – SECURITY DEFINER bypasses RLS
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. Fix profiles RLS – drop recursive policies and recreate
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "Admins can read all profiles"   on public.profiles;
drop policy if exists "Admins can update all profiles"  on public.profiles;

create policy "Admins can read all profiles"
  on public.profiles for select
  using ( public.is_admin() );

create policy "Admins can update all profiles"
  on public.profiles for update
  using  ( public.is_admin() )
  with check ( public.is_admin() );

-- Admins can delete profiles
drop policy if exists "Admins can delete profiles" on public.profiles;
create policy "Admins can delete profiles"
  on public.profiles for delete
  using ( public.is_admin() );

-- ────────────────────────────────────────────────────────────────────────────
-- 3. Fix content RLS – replace admin policy to use is_admin()
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "Admins can manage content" on public.content;

create policy "Admins can manage content"
  on public.content
  for all
  to authenticated
  using  ( public.is_admin() )
  with check ( public.is_admin() );

-- ────────────────────────────────────────────────────────────────────────────
-- 4. Fix storage RLS – replace admin upload policy to use is_admin()
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "Admins can upload content files" on storage.objects;

create policy "Admins can upload content files"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'content-files'
    and public.is_admin()
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 5. Ensure content.file_url column exists
-- ────────────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'content'
      and column_name  = 'file_url'
  ) then
    alter table public.content add column file_url text;
  end if;
end $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 6. Ensure profiles has status and preferred columns
-- ────────────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists status text not null default 'active'
    check (status in ('active', 'inactive', 'suspended')),
  add column if not exists preferred boolean not null default false;

-- Extend the role check to include 'network' if needed
-- (safe: drops old constraint and recreates with all values)
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
    check (role in ('borrower', 'certified', 'lender', 'vendor', 'network', 'admin'));
