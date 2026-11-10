-- ============================================================================
-- Fix: "infinite recursion detected in policy for relation profiles" (42P17)
--
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.
--
-- Why it is needed:
--   The policy "Admins can view all profiles" queried public.profiles inside
--   its own policy. PostgreSQL cannot evaluate a policy that references the
--   table it is defined on, so EVERY authenticated read of public.profiles
--   failed with 42P17. That broke the admin role check in proxy.ts (which
--   fails closed), so /admin redirected every user to /dashboard.
--
-- The check is moved into a SECURITY DEFINER function, which runs with the
-- owner's rights and therefore bypasses RLS for the inner query.
-- ============================================================================

-- 1) Security-definer helper (safe to re-run).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2) Replace the recursive policy with one that calls the helper.
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.is_admin());

-- 3) Optional columns used by the dashboard profile form.
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists emergency_contact text;

-- 4) Make sure the profiles row for an existing user exists and is an admin.
--    Replace the email with the admin account you sign in with.
-- insert into public.profiles (id, full_name, email, role)
-- select id, raw_user_meta_data->>'full_name', email, 'admin'
-- from auth.users
-- where email = 'editorfreedom01@gmail.com'
-- on conflict (id) do update set role = 'admin';
