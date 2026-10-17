-- Account pages read profiles with the authenticated user session.
-- Existing RLS restricts SELECT to auth.uid() = id.
grant select on public.profiles to authenticated;
