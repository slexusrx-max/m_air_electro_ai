-- Production user-profile model. This migration preserves existing profile data
-- while removing Supplier from the set of roles accepted by the application.

update public.profiles set role = 'client' where role = 'supplier';

alter table public.profiles drop constraint if exists profiles_supported_roles;
alter table public.profiles
  add constraint profiles_supported_roles
  check (role in ('admin', 'expert', 'client')) not valid;
alter table public.profiles validate constraint profiles_supported_roles;

-- A user can update their own ordinary account settings, but cannot directly
-- modify their role, lifecycle status, onboarding state, or specialised data.
revoke update on public.profiles from authenticated;
grant update (full_name, country_code, preferred_language, spoken_languages, city, timezone, currency, remote_available)
  on public.profiles to authenticated;

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

  insert into public.profiles (id, email, role)
  values (new.id, new.email, selected_role)
  on conflict (id) do nothing;
  return new;
end;
$$;

create table if not exists public.expert_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  professional_title text,
  specializations text[] not null default '{}',
  years_experience integer check (years_experience between 0 and 80),
  professional_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  assistance_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  company_name text not null check (char_length(company_name) between 1 and 160),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_expert_profiles_updated_at before update on public.expert_profiles
  for each row execute function public.set_updated_at();
create trigger set_client_profiles_updated_at before update on public.client_profiles
  for each row execute function public.set_updated_at();
create trigger set_company_profiles_updated_at before update on public.company_profiles
  for each row execute function public.set_updated_at();

alter table public.expert_profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.company_profiles enable row level security;

create policy "Users can read their expert profile" on public.expert_profiles
  for select to authenticated using (profile_id = auth.uid());
create policy "Users can read their client profile" on public.client_profiles
  for select to authenticated using (profile_id = auth.uid());
create policy "Users can read their company profile" on public.company_profiles
  for select to authenticated using (profile_id = auth.uid());

-- Onboarding is performed through the RPC below. The client receives no direct
-- insert/update rights to specialised profile tables.
revoke all on public.expert_profiles, public.client_profiles, public.company_profiles from anon, authenticated;
grant select on public.expert_profiles, public.client_profiles, public.company_profiles to authenticated;

revoke execute on function public.complete_onboarding(text, text, text, text, text, text, text[], integer, text, text, text[], text) from authenticated;

create or replace function public.complete_user_onboarding(
  p_full_name text,
  p_country_code text,
  p_preferred_language text,
  p_assistance_type text default null,
  p_company_name text default null,
  p_company_description text default null,
  p_professional_title text default null,
  p_specializations text[] default '{}',
  p_years_experience integer default null,
  p_professional_description text default null
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  current_role public.marketplace_role;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if p_full_name is null or char_length(trim(p_full_name)) = 0 then raise exception 'Full name is required'; end if;
  if p_country_code !~ '^[A-Z]{2}$' then raise exception 'Invalid country code'; end if;
  if p_preferred_language !~ '^[a-z]{2,10}$' then raise exception 'Invalid language code'; end if;

  select role into current_role from public.profiles where id = auth.uid() for update;
  if current_role not in ('client', 'expert') then raise exception 'This role cannot complete public onboarding'; end if;

  if current_role = 'expert' then
    if coalesce(trim(p_professional_title), '') = '' or coalesce(trim(p_professional_description), '') = '' then
      raise exception 'Professional details are required';
    end if;
    if p_years_experience is null or p_years_experience not between 0 and 80 then
      raise exception 'Years of experience must be between 0 and 80';
    end if;

    insert into public.expert_profiles (profile_id, professional_title, specializations, years_experience, professional_description)
    values (auth.uid(), trim(p_professional_title), coalesce(p_specializations, '{}'), p_years_experience, trim(p_professional_description))
    on conflict (profile_id) do update set
      professional_title = excluded.professional_title,
      specializations = excluded.specializations,
      years_experience = excluded.years_experience,
      professional_description = excluded.professional_description;
  else
    if coalesce(trim(p_assistance_type), '') = '' then raise exception 'Assistance request is required'; end if;
    insert into public.client_profiles (profile_id, assistance_type)
    values (auth.uid(), trim(p_assistance_type))
    on conflict (profile_id) do update set assistance_type = excluded.assistance_type;

    if coalesce(trim(p_company_name), '') <> '' then
      insert into public.company_profiles (profile_id, company_name, description)
      values (auth.uid(), trim(p_company_name), nullif(trim(p_company_description), ''))
      on conflict (profile_id) do update set company_name = excluded.company_name, description = excluded.description;
    end if;
  end if;

  update public.profiles set
    full_name = trim(p_full_name), country_code = p_country_code, preferred_language = p_preferred_language,
    onboarding_completed = true, onboarding_completed_at = now(), account_status = 'active'
  where id = auth.uid();
end;
$$;

revoke all on function public.complete_user_onboarding(text, text, text, text, text, text, text, text[], integer, text) from public;
grant execute on function public.complete_user_onboarding(text, text, text, text, text, text, text, text[], integer, text) to authenticated;
