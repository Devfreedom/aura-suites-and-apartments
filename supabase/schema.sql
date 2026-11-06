-- ============================================================================
-- Aura Suites & Apartments - Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Suites
-- ----------------------------------------------------------------------------
create table if not exists public.suites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tier text not null default '',
  category text not null default 'Studio',
  description text not null default '',
  price numeric(12, 2) not null default 0,
  guests integer not null default 2,
  bathrooms integer not null default 1,
  square_feet integer not null default 0,
  amenities text[] not null default '{}',
  house_rules text[] not null default '{}',
  -- Gallery image URLs (Supabase Storage public CDN links).
  images text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists suites_created_at_idx
  on public.suites (created_at desc);

-- Keep updated_at in sync on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists suites_set_updated_at on public.suites;
create trigger suites_set_updated_at
  before update on public.suites
  for each row
  execute function public.set_updated_at();

alter table public.suites enable row level security;

-- Public site may read every suite (catalogue is publicly viewable).
drop policy if exists "Public can read published suites" on public.suites;
drop policy if exists "Public can view suites" on public.suites;
create policy "Public can view suites"
  on public.suites
  for select
  to anon, authenticated
  using (true);

-- Only signed-in admins may create, update, or delete suites.
drop policy if exists "Anon can manage suites" on public.suites;
drop policy if exists "Admins can manage suites" on public.suites;
create policy "Admins can manage suites"
  on public.suites
  for all
  to authenticated
  using (true)
  with check (true);

-- ----------------------------------------------------------------------------
-- Storage bucket for suite images
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('suite-images', 'suite-images', true)
on conflict (id) do update set public = true;

-- Public read access to every object in the bucket.
drop policy if exists "Public read access for suite images" on storage.objects;
create policy "Public read access for suite images"
  on storage.objects
  for select
  using (bucket_id = 'suite-images');

-- Admin uploads/deletes are restricted to signed-in users.
drop policy if exists "Anon can upload suite images" on storage.objects;
drop policy if exists "Authenticated can upload suite images" on storage.objects;
create policy "Authenticated can upload suite images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'suite-images');

drop policy if exists "Anon can update suite images" on storage.objects;
drop policy if exists "Authenticated can update suite images" on storage.objects;
create policy "Authenticated can update suite images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'suite-images')
  with check (bucket_id = 'suite-images');

drop policy if exists "Anon can delete suite images" on storage.objects;
drop policy if exists "Authenticated can delete suite images" on storage.objects;
create policy "Authenticated can delete suite images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'suite-images');
