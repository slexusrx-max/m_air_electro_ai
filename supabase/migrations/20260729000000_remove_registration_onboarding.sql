-- Registration is complete once email verification succeeds. Profile details
-- can be added later from the dashboard and must not block account access.
update public.profiles
set onboarding_completed = true,
    onboarding_completed_at = coalesce(onboarding_completed_at, now()),
    account_status = 'active'::public.account_status
where role in ('client', 'expert')
  and onboarding_completed = false;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  selected_role public.marketplace_role;
begin
  selected_role := case
    when new.raw_user_meta_data ->> 'role' in ('client', 'expert')
      then (new.raw_user_meta_data ->> 'role')::public.marketplace_role
    else 'client'::public.marketplace_role
  end;

  insert into public.profiles (
    id,
    email,
    role,
    onboarding_completed,
    onboarding_completed_at,
    account_status
  )
  values (
    new.id,
    new.email,
    selected_role,
    true,
    now(),
    'active'::public.account_status
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
