create type public.account_status as enum ('active', 'blocked', 'pending');

alter table public.profiles
  add column full_name text,
  add column account_status public.account_status not null default 'pending',
  add column onboarding_completed boolean not null default false,
  add column company_name text,
  add column assistance_type text,
  add column professional_title text,
  add column specializations text[] not null default '{}',
  add column years_experience integer,
  add column professional_description text,
  add column contact_person text,
  add column supplied_product_categories text[] not null default '{}',
  add column company_description text,
  add constraint profiles_years_experience_check check (years_experience is null or years_experience between 0 and 80);

update public.profiles
set onboarding_completed = onboarding_completed_at is not null,
    account_status = case when onboarding_completed_at is null then 'pending'::public.account_status else 'active'::public.account_status end;

-- Ordinary users cannot promote themselves or change account status. Their role is fixed at registration.
revoke update on public.profiles from authenticated;
grant update (
  full_name, country_code, preferred_language, spoken_languages, city, timezone, currency, remote_available,
  company_name, assistance_type, professional_title, specializations, years_experience, professional_description,
  contact_person, supplied_product_categories, company_description
) on public.profiles to authenticated;

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own permitted profile fields"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.complete_onboarding(
  p_full_name text,
  p_country_code text,
  p_preferred_language text,
  p_company_name text default null,
  p_assistance_type text default null,
  p_professional_title text default null,
  p_specializations text[] default null,
  p_years_experience integer default null,
  p_professional_description text default null,
  p_contact_person text default null,
  p_supplied_product_categories text[] default null,
  p_company_description text default null
) returns void
language plpgsql security definer set search_path = '' as $$
declare current_role public.marketplace_role;
begin
  select role into current_role from public.profiles where id = auth.uid();
  if current_role is null or current_role = 'admin' then raise exception 'Invalid onboarding session'; end if;
  if length(trim(p_full_name)) < 2 or p_country_code !~ '^[A-Z]{2}$' or p_preferred_language !~ '^[a-z]{2,3}$' then
    raise exception 'Invalid required onboarding values';
  end if;
  if current_role = 'client' and coalesce(nullif(trim(p_assistance_type), ''), '') = '' then raise exception 'Client assistance type is required'; end if;
  if current_role = 'expert' and (coalesce(nullif(trim(p_professional_title), ''), '') = '' or coalesce(cardinality(p_specializations), 0) = 0 or p_years_experience is null or coalesce(nullif(trim(p_professional_description), ''), '') = '') then raise exception 'Expert profile fields are required'; end if;
  if current_role = 'supplier' and (coalesce(nullif(trim(p_contact_person), ''), '') = '' or coalesce(nullif(trim(p_company_name), ''), '') = '' or coalesce(cardinality(p_supplied_product_categories), 0) = 0 or coalesce(nullif(trim(p_company_description), ''), '') = '') then raise exception 'Supplier profile fields are required'; end if;
  update public.profiles set
    full_name = trim(p_full_name), country_code = p_country_code, preferred_language = p_preferred_language,
    company_name = nullif(trim(p_company_name), ''), assistance_type = nullif(trim(p_assistance_type), ''),
    professional_title = nullif(trim(p_professional_title), ''), specializations = coalesce(p_specializations, '{}'),
    years_experience = p_years_experience, professional_description = nullif(trim(p_professional_description), ''),
    contact_person = nullif(trim(p_contact_person), ''), supplied_product_categories = coalesce(p_supplied_product_categories, '{}'),
    company_description = nullif(trim(p_company_description), ''), onboarding_completed = true,
    onboarding_completed_at = now(), account_status = 'active'
  where id = auth.uid();
end;
$$;
grant execute on function public.complete_onboarding(text, text, text, text, text, text, text[], integer, text, text, text[], text) to authenticated;
