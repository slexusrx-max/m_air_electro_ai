create type public.marketplace_role as enum ('client', 'expert', 'supplier');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role public.marketplace_role not null default 'client',
  country_code text,
  preferred_language text,
  spoken_languages text[] not null default '{}',
  city text,
  timezone text,
  currency text,
  remote_available boolean,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_country_code_format check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  constraint profiles_language_code_format check (preferred_language is null or preferred_language ~ '^[a-z]{2,3}$')
);

alter table public.profiles enable row level security;
create policy "Users can read their own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users can update their own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, case when new.raw_user_meta_data ->> 'role' in ('client', 'expert', 'supplier') then (new.raw_user_meta_data ->> 'role')::public.marketplace_role else 'client' end);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
