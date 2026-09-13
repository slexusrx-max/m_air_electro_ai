-- Preserve lifecycle status and close the legacy onboarding RPC.
revoke all on function public.complete_onboarding(text, text, text, text, text, text, text[], integer, text, text, text[], text) from public, anon, authenticated;

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
  profile_role public.marketplace_role;
  current_status public.account_status;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if p_full_name is null or char_length(trim(p_full_name)) = 0 then raise exception 'Full name is required'; end if;
  if p_country_code !~ '^[A-Z]{2}$' then raise exception 'Invalid country code'; end if;
  if p_preferred_language !~ '^[a-z]{2,10}$' then raise exception 'Invalid language code'; end if;

  select role, account_status into profile_role, current_status from public.profiles where id = auth.uid() for update;
  if profile_role is null or current_status = 'blocked' then raise exception 'Account unavailable'; end if;
  if profile_role not in ('client', 'expert') then raise exception 'This role cannot complete public onboarding'; end if;

  if profile_role = 'expert' then
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
    onboarding_completed = true, onboarding_completed_at = now()
  where id = auth.uid();
end;
$$;

revoke all on function public.complete_user_onboarding(text, text, text, text, text, text, text, text[], integer, text) from public;
grant execute on function public.complete_user_onboarding(text, text, text, text, text, text, text, text[], integer, text) to authenticated;
