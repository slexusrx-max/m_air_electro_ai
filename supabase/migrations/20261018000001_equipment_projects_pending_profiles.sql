-- Match the existing signed-in dashboard: incomplete (pending) profiles may
-- keep private equipment projects. This does not activate accounts, change any
-- profile data, bypass authentication or extend permissions for other features.
alter policy "Active users manage their own equipment projects"
  on public.equipment_projects
  rename to "Authenticated users manage their own equipment projects";

alter policy "Authenticated users manage their own equipment projects"
  on public.equipment_projects
  using (owner_id = (select auth.uid()) and exists (
    select 1 from public.profiles where id = (select auth.uid())
      and account_status in ('active', 'pending')
  ))
  with check (owner_id = (select auth.uid()) and exists (
    select 1 from public.profiles where id = (select auth.uid())
      and account_status in ('active', 'pending')
  ));
