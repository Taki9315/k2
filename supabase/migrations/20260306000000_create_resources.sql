-- ============================================================================
-- K2 Commercial Finance – Resources table
-- Migration: 20260306000000_create_resources.sql
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Resources table (videos, PDFs, links managed by admin)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.resources (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text not null default '',
  type            text not null default 'link'
    check (type in ('video', 'pdf', 'link', 'image')),
  url             text,                         -- external URL or generated storage URL
  file_url        text,                         -- uploaded file public URL
  file_path       text,                         -- storage path for deletion
  thumbnail_url   text,
  access_level    text not null default 'public'
    check (access_level in ('public', 'members_only')),
  category        text not null default 'General',
  tags            text[] not null default '{}',
  keywords        text not null default '',      -- SEO keywords comma-separated
  is_published    boolean not null default true,
  view_count      integer not null default 0,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists resources_type_idx on public.resources (type);
create index if not exists resources_access_level_idx on public.resources (access_level);
create index if not exists resources_category_idx on public.resources (category);
create index if not exists resources_is_published_idx on public.resources (is_published);
create index if not exists resources_tags_idx on public.resources using gin (tags);

alter table public.resources enable row level security;

-- Public can read published public resources
drop policy if exists "Anyone can read public resources" on public.resources;
create policy "Anyone can read public resources"
  on public.resources
  for select
  to anon, authenticated
  using (is_published = true);

-- Admins can do everything
drop policy if exists "Admins can manage resources" on public.resources;
create policy "Admins can manage resources"
  on public.resources
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

-- ────────────────────────────────────────────────────────────────────────────
-- 2. Add keywords column to content table (for SEO)
-- ────────────────────────────────────────────────────────────────────────────
alter table public.content add column if not exists keywords text not null default '';
alter table public.content add column if not exists tags text[] not null default '{}';

-- ────────────────────────────────────────────────────────────────────────────
-- 3. Updated_at trigger for resources
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists resources_updated_at on public.resources;
create trigger resources_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

drop trigger if exists content_updated_at on public.content;
create trigger content_updated_at
  before update on public.content
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 4. Storage bucket for resource files
-- ────────────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('resource-files', 'resource-files', true)
  on conflict (id) do nothing;

-- Allow public read on resource-files bucket
drop policy if exists "Public read resource-files" on storage.objects;
create policy "Public read resource-files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'resource-files');

-- Allow authenticated to upload resource-files
drop policy if exists "Admin upload resource-files" on storage.objects;
create policy "Admin upload resource-files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'resource-files');

-- Allow authenticated to delete resource-files
drop policy if exists "Admin delete resource-files" on storage.objects;
create policy "Admin delete resource-files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'resource-files');

-- Also ensure content-files bucket exists
insert into storage.buckets (id, name, public) values ('content-files', 'content-files', true)
  on conflict (id) do nothing;

drop policy if exists "Public read content-files" on storage.objects;
create policy "Public read content-files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'content-files');

drop policy if exists "Admin upload content-files" on storage.objects;
create policy "Admin upload content-files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'content-files');

drop policy if exists "Admin delete content-files" on storage.objects;
create policy "Admin delete content-files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'content-files');
