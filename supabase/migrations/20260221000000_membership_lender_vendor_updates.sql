-- ============================================================================
-- K2 Commercial Finance - Membership, Lender & Vendor Updates
-- Migration: 20260221000000_membership_lender_vendor_updates.sql
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Extend profiles table with role + membership columns
-- ────────────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists role text not null default 'borrower'
    check (role in ('borrower', 'certified', 'lender', 'vendor', 'admin')),
  add column if not exists phone text,
  add column if not exists company text,
  add column if not exists workbook_purchased boolean not null default false,
  add column if not exists certified_at timestamptz;

comment on column public.profiles.role is
  'User role: borrower (default), certified (workbook buyer), lender, vendor, admin';

-- ────────────────────────────────────────────────────────────────────────────
-- 2. Lender Inquiries table
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.lender_inquiries (
  id              uuid primary key default gen_random_uuid(),
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text,
  company         text not null,
  lender_type     text not null
    check (lender_type in (
      'bank', 'credit_union', 'cdfi', 'sba_lender', 'private_lender',
      'hard_money', 'bridge_lender', 'life_company', 'agency', 'other'
    )),
  lending_focus   text,
  message         text,
  status          text not null default 'new'
    check (status in ('new', 'contacted', 'approved', 'declined', 'archived')),
  admin_notes     text,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists lender_inquiries_status_idx
  on public.lender_inquiries (status);
create index if not exists lender_inquiries_email_idx
  on public.lender_inquiries (email);

alter table public.lender_inquiries enable row level security;

-- Public insert (the form is on a public page)
drop policy if exists "Anyone can submit a lender inquiry" on public.lender_inquiries;
create policy "Anyone can submit a lender inquiry"
  on public.lender_inquiries
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admins / service role can read
drop policy if exists "Admins can view lender inquiries" on public.lender_inquiries;
create policy "Admins can view lender inquiries"
  on public.lender_inquiries
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 3. Vendor Inquiries table
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.vendor_inquiries (
  id              uuid primary key default gen_random_uuid(),
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text,
  company         text not null,
  service_type    text not null
    check (service_type in (
      'appraisal', 'environmental', 'insurance', 'legal', 'title',
      'construction_mgmt', 'property_inspection', 'property_mgmt',
      'accounting', 'architecture', 'surveying', 'other'
    )),
  service_areas   text,
  message         text,
  status          text not null default 'new'
    check (status in ('new', 'contacted', 'approved', 'declined', 'archived')),
  admin_notes     text,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists vendor_inquiries_status_idx
  on public.vendor_inquiries (status);
create index if not exists vendor_inquiries_email_idx
  on public.vendor_inquiries (email);

alter table public.vendor_inquiries enable row level security;

drop policy if exists "Anyone can submit a vendor inquiry" on public.vendor_inquiries;
create policy "Anyone can submit a vendor inquiry"
  on public.vendor_inquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can view vendor inquiries" on public.vendor_inquiries;
create policy "Admins can view vendor inquiries"
  on public.vendor_inquiries
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 4. Document Vault table (certified borrower uploads)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.document_vault (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  file_name       text not null,
  file_type       text not null,
  file_size       bigint not null default 0,
  storage_path    text not null,
  category        text not null default 'general'
    check (category in (
      'executive_summary', 'financial_statement', 'tax_return',
      'entity_docs', 'rent_roll', 'operating_statement',
      'personal_financial', 'insurance', 'appraisal', 'general'
    )),
  description     text,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists document_vault_user_id_idx
  on public.document_vault (user_id, created_at desc);

alter table public.document_vault enable row level security;

drop policy if exists "Users can view own documents" on public.document_vault;
create policy "Users can view own documents"
  on public.document_vault
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can upload own documents" on public.document_vault;
create policy "Users can upload own documents"
  on public.document_vault
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own documents" on public.document_vault;
create policy "Users can delete own documents"
  on public.document_vault
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Admins can view all documents
drop policy if exists "Admins can view all documents" on public.document_vault;
create policy "Admins can view all documents"
  on public.document_vault
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 5. Borrower Meeting Requests table
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.meeting_requests (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users (id) on delete cascade,
  meeting_type        text not null default 'project_review'
    check (meeting_type in ('project_review', 'general', 'follow_up')),
  executive_summary_path text,
  notes               text,
  status              text not null default 'pending'
    check (status in ('pending', 'scheduled', 'completed', 'cancelled')),
  scheduled_at        timestamptz,
  created_at          timestamptz not null default timezone('utc', now()),
  updated_at          timestamptz not null default timezone('utc', now())
);

create index if not exists meeting_requests_user_id_idx
  on public.meeting_requests (user_id, created_at desc);

alter table public.meeting_requests enable row level security;

drop policy if exists "Users can view own meeting requests" on public.meeting_requests;
create policy "Users can view own meeting requests"
  on public.meeting_requests
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create own meeting requests" on public.meeting_requests;
create policy "Users can create own meeting requests"
  on public.meeting_requests
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 6. Admin email notifications table (queue for sending)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.admin_notifications (
  id              uuid primary key default gen_random_uuid(),
  type            text not null
    check (type in ('lender_inquiry', 'vendor_inquiry', 'meeting_request', 'document_upload')),
  reference_id    uuid not null,
  subject         text not null,
  body            text not null,
  sent            boolean not null default false,
  created_at      timestamptz not null default timezone('utc', now())
);

alter table public.admin_notifications enable row level security;

drop policy if exists "Admins can view notifications" on public.admin_notifications;
create policy "Admins can view notifications"
  on public.admin_notifications
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Service role can insert (from API routes)
drop policy if exists "Service can insert notifications" on public.admin_notifications;
create policy "Service can insert notifications"
  on public.admin_notifications
  for insert
  to anon, authenticated
  with check (true);

-- ────────────────────────────────────────────────────────────────────────────
-- 7. Storage bucket for document vault
-- ────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('document-vault', 'document-vault', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload own vault documents" on storage.objects;
create policy "Users can upload own vault documents"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'document-vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can read own vault documents" on storage.objects;
create policy "Users can read own vault documents"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'document-vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own vault documents" on storage.objects;
create policy "Users can delete own vault documents"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'document-vault'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 8. Helper function: auto-update updated_at timestamps
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists lender_inquiries_updated_at on public.lender_inquiries;
create trigger lender_inquiries_updated_at
  before update on public.lender_inquiries
  for each row execute function public.set_updated_at();

drop trigger if exists vendor_inquiries_updated_at on public.vendor_inquiries;
create trigger vendor_inquiries_updated_at
  before update on public.vendor_inquiries
  for each row execute function public.set_updated_at();

drop trigger if exists document_vault_updated_at on public.document_vault;
create trigger document_vault_updated_at
  before update on public.document_vault
  for each row execute function public.set_updated_at();

drop trigger if exists meeting_requests_updated_at on public.meeting_requests;
create trigger meeting_requests_updated_at
  before update on public.meeting_requests
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 9. SAMPLE DATA for testing
-- ────────────────────────────────────────────────────────────────────────────

-- 9a. Sample lender inquiries
insert into public.lender_inquiries
  (first_name, last_name, email, phone, company, lender_type, lending_focus, message, status)
values
  ('Michael', 'Chen', 'mchen@firstnational.com', '(212) 555-0101',
   'First National Bank', 'bank',
   'Multifamily, Mixed-Use, $500K–$10M',
   'Interested in receiving pre-qualified borrower submissions for our commercial lending division. We focus on NY metro and NJ markets.',
   'new'),

  ('Sarah', 'Rodriguez', 'srodriguez@greenlightcap.com', '(415) 555-0202',
   'Greenlight Capital Partners', 'sba_lender',
   'SBA 7(a), SBA 504, $150K–$5M',
   'We are an SBA Preferred Lender looking to expand our borrower pipeline. Would like to learn about your certified borrower program.',
   'contacted'),

  ('James', 'Thompson', 'jthompson@bridgerock.com', '(310) 555-0303',
   'BridgeRock Lending', 'bridge_lender',
   'Bridge loans, Fix & Flip, $250K–$3M',
   'Specializing in short-term bridge financing for value-add properties. Interested in your deal flow.',
   'new'),

  ('Emily', 'Park', 'epark@communitycu.org', '(503) 555-0404',
   'Community First Credit Union', 'credit_union',
   'Small commercial, Owner-occupied, $100K–$2M',
   'We serve small businesses in the Pacific Northwest and would like access to educated borrowers ready to transact.',
   'approved'),

  ('David', 'Okafor', 'dokafor@metroprivate.com', '(305) 555-0505',
   'Metro Private Capital', 'private_lender',
   'Non-QM, DSCR loans, $200K–$5M',
   'Private lending shop focused on investor DSCR products. Very interested in your borrower preparation process.',
   'new');

-- 9b. Sample vendor inquiries
insert into public.vendor_inquiries
  (first_name, last_name, email, phone, company, service_type, service_areas, message, status)
values
  ('Robert', 'Kim', 'rkim@precisionappraisal.com', '(646) 555-0601',
   'Precision Appraisal Group', 'appraisal',
   'NY, NJ, CT, PA',
   'We provide FIRREA-compliant commercial appraisals with 10-day turnaround. Interested in partnering with K2.',
   'new'),

  ('Lisa', 'Martinez', 'lisa@clearviewenv.com', '(713) 555-0602',
   'ClearView Environmental', 'environmental',
   'TX, LA, OK, Nationwide Phase I',
   'Full-service environmental consulting firm specializing in Phase I & II ESAs for commercial properties.',
   'contacted'),

  ('Thomas', 'Brown', 'tbrown@shieldinsurance.com', '(312) 555-0603',
   'Shield Commercial Insurance', 'insurance',
   'Nationwide',
   'Providing competitive commercial property and liability insurance. Can bind coverage within 48 hours.',
   'new'),

  ('Amanda', 'Patel', 'apatel@summitlegal.com', '(202) 555-0604',
   'Summit Legal Advisors', 'legal',
   'DC, MD, VA',
   'Commercial real estate law firm handling closings, entity formation, lease review, and title work.',
   'approved'),

  ('Kevin', 'Wright', 'kwright@buildproconst.com', '(404) 555-0605',
   'BuildPro Construction Management', 'construction_mgmt',
   'Southeast US',
   'Full-service construction management for rehab and ground-up commercial projects. Licensed GC in 8 states.',
   'new');

-- 9c. Sample admin notifications
insert into public.admin_notifications
  (type, reference_id, subject, body, sent)
values
  ('lender_inquiry',
   (select id from public.lender_inquiries where email = 'mchen@firstnational.com' limit 1),
   'New Lender Inquiry: First National Bank',
   'Michael Chen from First National Bank has submitted a lender inquiry. Lender type: bank. Focus: Multifamily, Mixed-Use, $500K–$10M.',
   false),

  ('lender_inquiry',
   (select id from public.lender_inquiries where email = 'srodriguez@greenlightcap.com' limit 1),
   'New Lender Inquiry: Greenlight Capital Partners',
   'Sarah Rodriguez from Greenlight Capital Partners has submitted a lender inquiry. Lender type: SBA Preferred. Focus: SBA 7(a), SBA 504.',
   true),

  ('vendor_inquiry',
   (select id from public.vendor_inquiries where email = 'rkim@precisionappraisal.com' limit 1),
   'New Vendor Inquiry: Precision Appraisal Group',
   'Robert Kim from Precision Appraisal Group has submitted a vendor inquiry. Service type: Appraisal. Areas: NY, NJ, CT, PA.',
   false),

  ('vendor_inquiry',
   (select id from public.vendor_inquiries where email = 'apatel@summitlegal.com' limit 1),
   'New Vendor Inquiry: Summit Legal Advisors',
   'Amanda Patel from Summit Legal Advisors has submitted a vendor inquiry. Service type: Legal. Areas: DC, MD, VA.',
   true);

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
