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

-- ----------------------------------------------------------------------------
-- Bookings / reservations
-- ----------------------------------------------------------------------------
-- Written by trusted server code (Paystack initialize + webhook + reminder cron)
-- using the service-role key, which bypasses RLS. Signed-in admins may read and
-- manage these records.
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  customer_name text not null default '',
  customer_email text not null default '',
  customer_phone text not null default '',
  suite_type text not null default '',
  check_in text not null default '',
  check_out text not null default '',
  guest_count integer not null default 1,
  nights integer not null default 1,
  total_amount numeric(12, 2) not null default 0,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'abandoned')),
  booking_status text not null default 'pending'
    check (booking_status in ('pending', 'confirmed', 'cancelled')),
  payment_url text,
  payment_method text,
  metadata jsonb not null default '{}'::jsonb,
  reminder_sent_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_payment_status_idx
  on public.bookings (payment_status, created_at);

create index if not exists bookings_customer_email_idx
  on public.bookings (customer_email);

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row
  execute function public.set_updated_at();

alter table public.bookings enable row level security;

drop policy if exists "Admins can view bookings" on public.bookings;
create policy "Admins can view bookings"
  on public.bookings
  for select
  to authenticated
  using (true);

drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings"
  on public.bookings
  for all
  to authenticated
  using (true)
  with check (true);


-- ----------------------------------------------------------------------------
-- Profiles (one row per auth user; carries role, full_name, avatar_url)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  role text not null default 'guest',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Users can read and update their own profile.
create policy "Users can view own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Admins can read every profile.
create policy "Admins can view all profiles" on public.profiles
  for select to authenticated using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'guest'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Newsletter subscribers
-- ----------------------------------------------------------------------------
-- Only the server (service-role key) should write here. The public subscribe
-- and unsubscribe API routes validate input and sign unsubscribe links.
create table if not exists public.subscribers (
  email text primary key,
  subscribed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscribers_subscribed_idx
  on public.subscribers (subscribed);

drop trigger if exists subscribers_set_updated_at on public.subscribers;
create trigger subscribers_set_updated_at
  before update on public.subscribers
  for each row
  execute function public.set_updated_at();

alter table public.subscribers enable row level security;

drop policy if exists "Admins can view subscribers" on public.subscribers;
create policy "Admins can view subscribers"
  on public.subscribers
  for select
  to authenticated
  using (true);

drop policy if exists "Admins can manage subscribers" on public.subscribers;
create policy "Admins can manage subscribers"
  on public.subscribers
  for all
  to authenticated
  using (true)
  with check (true);

-- ----------------------------------------------------------------------------
-- Privileges
-- ----------------------------------------------------------------------------
-- Supabase usually grants these by default, but tables created outside the
-- standard flow (or projects with default privileges cleared) end up with
-- "permission denied for table ..." (SQLSTATE 42501). Granting explicitly keeps
-- the anon/authenticated API and the service-role client working.
grant usage on schema public to anon, authenticated, service_role;

grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

grant select, insert, update, delete on all tables in schema public
  to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;

-- Apply the same defaults to objects created in the future.
alter default privileges in schema public
  grant all privileges on tables to service_role;
alter default privileges in schema public
  grant all privileges on sequences to service_role;
alter default privileges in schema public
  grant execute on functions to service_role;
alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
alter default privileges in schema public
  grant execute on functions to anon, authenticated;