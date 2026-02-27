-- ============================================================================
-- K2 Commercial Finance – Fix partner_profiles RLS recursion
-- Migration: 20260227000000_fix_partner_rls.sql
--
-- All admin policies on partner_profiles, partner_contacts, lender_inquiries,
-- vendor_inquiries, and related storage policies still use a direct subquery
-- on public.profiles, which triggers RLS recursion.
-- Replace them with the SECURITY DEFINER function public.is_admin().
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. partner_profiles – admin policy
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "Admins full access to partner profiles" on public.partner_profiles;
create policy "Admins full access to partner profiles"
  on public.partner_profiles
  for all
  to authenticated
  using  ( public.is_admin() )
  with check ( public.is_admin() );

-- ────────────────────────────────────────────────────────────────────────────
-- 2. partner_contacts – admin view policy
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "Admins view all partner contacts" on public.partner_contacts;
create policy "Admins view all partner contacts"
  on public.partner_contacts
  for select
  to authenticated
  using ( public.is_admin() );

-- ────────────────────────────────────────────────────────────────────────────
-- 3. lender_inquiries – admin view policy
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "Admins can view lender inquiries" on public.lender_inquiries;
create policy "Admins can view lender inquiries"
  on public.lender_inquiries
  for select
  to authenticated
  using ( public.is_admin() );

-- Also allow admin to update lender inquiries (change status)
drop policy if exists "Admins can update lender inquiries" on public.lender_inquiries;
create policy "Admins can update lender inquiries"
  on public.lender_inquiries
  for update
  to authenticated
  using  ( public.is_admin() )
  with check ( public.is_admin() );

-- ────────────────────────────────────────────────────────────────────────────
-- 4. vendor_inquiries – admin view policy
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "Admins can view vendor inquiries" on public.vendor_inquiries;
create policy "Admins can view vendor inquiries"
  on public.vendor_inquiries
  for select
  to authenticated
  using ( public.is_admin() );

-- Also allow admin to update vendor inquiries (change status)
drop policy if exists "Admins can update vendor inquiries" on public.vendor_inquiries;
create policy "Admins can update vendor inquiries"
  on public.vendor_inquiries
  for update
  to authenticated
  using  ( public.is_admin() )
  with check ( public.is_admin() );

-- ────────────────────────────────────────────────────────────────────────────
-- 5. Storage – partner-assets admin policies
-- ────────────────────────────────────────────────────────────────────────────
drop policy if exists "Admins can upload partner assets" on storage.objects;
create policy "Admins can upload partner assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'partner-assets'
    and public.is_admin()
  );

drop policy if exists "Admins can delete partner assets" on storage.objects;
create policy "Admins can delete partner assets"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'partner-assets'
    and public.is_admin()
  );
