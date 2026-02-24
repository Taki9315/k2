-- ============================================================================
-- K2 Commercial Finance — Partner Profiles (Lender & Vendor Pages)
-- Migration: 20260224000000_partner_profiles.sql
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Partner profiles table — one row per approved lender or vendor page
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.partner_profiles (
  id              uuid primary key default gen_random_uuid(),

  -- lender | vendor
  partner_type    text not null
    check (partner_type in ('lender', 'vendor')),

  -- URL slug: k2cfinance.com/lender/<slug> or /vendor/<slug>
  slug            text not null unique,

  -- Display info
  company_name    text not null,
  logo_url        text,
  tagline         text,              -- short one-liner under company name
  description     text,              -- rich description / about section
  contact_name    text,              -- primary contact name shown on card
  contact_email   text not null,     -- receives inquiry emails
  contact_phone   text,
  website_url     text,

  -- Lender-specific
  lender_type     text,
  lending_focus   text,              -- e.g. "SBA 7(a), SBA 504, $150K–$5M"
  min_loan        numeric,
  max_loan        numeric,
  property_types  text[],            -- e.g. {"Multifamily","Retail","Office"}
  states_served   text[],            -- e.g. {"NY","NJ","CT"} or {"Nationwide"}

  -- Vendor-specific
  service_type    text,
  service_areas   text,

  -- Media
  video_url       text,              -- embedded video (private / members only)
  documents       jsonb default '[]', -- [{name, url, description}]

  -- Badges / highlights shown on the card
  highlights      jsonb default '[]', -- [{icon, label}]

  -- Publishing
  is_published    boolean not null default false,
  featured        boolean not null default false,

  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists partner_profiles_type_idx
  on public.partner_profiles (partner_type, is_published);
create index if not exists partner_profiles_slug_idx
  on public.partner_profiles (slug);

-- ────────────────────────────────────────────────────────────────────────────
-- 2. Partner contact submissions — borrower inquiries to lender/vendor
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.partner_contacts (
  id              uuid primary key default gen_random_uuid(),
  partner_id      uuid not null references public.partner_profiles (id) on delete cascade,
  user_id         uuid references auth.users (id) on delete set null,
  sender_name     text not null,
  sender_email    text not null,
  sender_phone    text,
  subject         text,
  message         text not null,
  created_at      timestamptz not null default timezone('utc', now())
);

create index if not exists partner_contacts_partner_idx
  on public.partner_contacts (partner_id, created_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- 3. Row-level security
-- ────────────────────────────────────────────────────────────────────────────
alter table public.partner_profiles enable row level security;
alter table public.partner_contacts enable row level security;

-- Published profiles visible to authenticated users (certified borrowers)
drop policy if exists "Published partners visible to authenticated" on public.partner_profiles;
create policy "Published partners visible to authenticated"
  on public.partner_profiles
  for select
  to authenticated
  using (is_published = true);

-- Admins can do everything with partner_profiles
drop policy if exists "Admins full access to partner profiles" on public.partner_profiles;
create policy "Admins full access to partner profiles"
  on public.partner_profiles
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Authenticated users can submit contact forms
drop policy if exists "Authenticated users can submit partner contacts" on public.partner_contacts;
create policy "Authenticated users can submit partner contacts"
  on public.partner_contacts
  for insert
  to authenticated
  with check (true);

-- Users can see their own submitted contacts
drop policy if exists "Users see own partner contacts" on public.partner_contacts;
create policy "Users see own partner contacts"
  on public.partner_contacts
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins can view all contacts
drop policy if exists "Admins view all partner contacts" on public.partner_contacts;
create policy "Admins view all partner contacts"
  on public.partner_contacts
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 4. Storage bucket for partner assets (logos, docs)
-- ────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('partner-assets', 'partner-assets', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can read partner assets" on storage.objects;
create policy "Anyone can read partner assets"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'partner-assets');

drop policy if exists "Admins can upload partner assets" on storage.objects;
create policy "Admins can upload partner assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'partner-assets'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can delete partner assets" on storage.objects;
create policy "Admins can delete partner assets"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'partner-assets'
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 5. Auto-update timestamps
-- ────────────────────────────────────────────────────────────────────────────
drop trigger if exists partner_profiles_updated_at on public.partner_profiles;
create trigger partner_profiles_updated_at
  before update on public.partner_profiles
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 6. Sample data for testing
-- ────────────────────────────────────────────────────────────────────────────
insert into public.partner_profiles
  (partner_type, slug, company_name, logo_url, tagline, description,
   contact_name, contact_email, contact_phone, website_url,
   lender_type, lending_focus, min_loan, max_loan, property_types, states_served,
   video_url, highlights, documents, is_published, featured)
values
  ('lender', 'first-national-bank', 'First National Bank', null,
   'Full-service commercial lending for multifamily and mixed-use properties.',
   'First National Bank has been a trusted name in commercial lending for over 40 years. ' ||
   'Specializing in multifamily and mixed-use properties in the NY metro area, ' ||
   'their dedicated commercial team delivers fast decisions and competitive terms for loans from $500K to $10M.',
   'Michael Chen', 'mchen@firstnational.com', '(212) 555-0101', 'https://firstnational.example.com',
   'bank', 'Multifamily, Mixed-Use, $500K–$10M', 500000, 10000000,
   '{"Multifamily","Mixed-Use","Office"}', '{"NY","NJ","CT"}',
   null,
   '[{"icon":"Building2","label":"40+ Years Experience"},{"icon":"TrendingUp","label":"$500K–$10M Loans"},{"icon":"Shield","label":"K2 Preferred"}]',
   '[]', true, true),

  ('lender', 'greenlight-capital-partners', 'Greenlight Capital Partners', null,
   'SBA Preferred Lender specializing in 7(a) and 504 programs.',
   'Greenlight Capital Partners is an SBA Preferred Lender focused on helping small business owners ' ||
   'access government-backed financing. With expertise in SBA 7(a) and 504 programs, they serve ' ||
   'borrowers nationwide with loan amounts from $150K to $5M.',
   'Sarah Rodriguez', 'srodriguez@greenlightcap.com', '(415) 555-0202', 'https://greenlightcap.example.com',
   'sba_lender', 'SBA 7(a), SBA 504, $150K–$5M', 150000, 5000000,
   '{"Retail","Office","Industrial","Mixed-Use"}', '{"Nationwide"}',
   null,
   '[{"icon":"Zap","label":"SBA Preferred"},{"icon":"DollarSign","label":"$150K–$5M"},{"icon":"Shield","label":"K2 Preferred"}]',
   '[]', true, false),

  ('vendor', 'precision-appraisal-group', 'Precision Appraisal Group', null,
   'FIRREA-compliant commercial appraisals with 10-day turnaround.',
   'Precision Appraisal Group provides best-in-class commercial real estate appraisals ' ||
   'throughout the Northeast. Their experienced team delivers FIRREA-compliant, ' ||
   'lender-accepted appraisals with a standard 10-business-day turnaround ' ||
   'for properties from $100K to $25M in value.',
   'Robert Kim', 'rkim@precisionappraisal.com', '(646) 555-0601', 'https://precisionappraisal.example.com',
   null, null, null, null, null, '{"NY","NJ","CT","PA"}',
   null,
   '[{"icon":"Clock","label":"10-Day Turnaround"},{"icon":"ShieldCheck","label":"FIRREA Compliant"},{"icon":"Shield","label":"K2 Preferred"}]',
   '[]', true, true),

  ('vendor', 'summit-legal-advisors', 'Summit Legal Advisors', null,
   'Commercial real estate law firm — closings, entities, title work.',
   'Summit Legal Advisors is a full-service commercial real estate law firm handling closings, ' ||
   'entity formation, lease review, and title work throughout DC, Maryland, and Virginia. ' ||
   'Their attorneys have closed over $500M in commercial transactions.',
   'Amanda Patel', 'apatel@summitlegal.com', '(202) 555-0604', 'https://summitlegal.example.com',
   null, null, null, null, null, '{"DC","MD","VA"}',
   null,
   '[{"icon":"Scale","label":"$500M+ Closed"},{"icon":"FileText","label":"Full-Service"},{"icon":"Shield","label":"K2 Preferred"}]',
   '[]', true, false);

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
