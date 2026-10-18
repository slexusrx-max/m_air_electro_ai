-- Private, account-backed equipment planning. No orders, payments or stock data.
create function public.valid_equipment_project_items(value jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare item jsonb; seen text[] := '{}'; product_id text; quantity numeric;
begin
  if value is null or jsonb_typeof(value) <> 'array' then return false; end if;
  if jsonb_array_length(value) > 100 then return false; end if;
  for item in select * from jsonb_array_elements(value) loop
    if jsonb_typeof(item) <> 'object' or not (item ?& array['productId','quantity'])
      or (select count(*) from jsonb_object_keys(item)) <> 2
      or jsonb_typeof(item->'productId') <> 'string' or jsonb_typeof(item->'quantity') <> 'number'
      then return false; end if;
    product_id := item->>'productId';
    if product_id !~ '^[a-z0-9][a-z0-9_-]{0,119}$' or product_id = any(seen) then return false; end if;
    quantity := (item->>'quantity')::numeric;
    if quantity < 1 or quantity > 999 or quantity <> trunc(quantity) then return false; end if;
    seen := array_append(seen, product_id);
  end loop;
  return true;
end;
$$;

create table public.equipment_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100 and name !~ '[[:cntrl:]]'),
  items jsonb not null default '[]'::jsonb check (public.valid_equipment_project_items(items)),
  revision integer not null default 1 check (revision > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index equipment_projects_owner_updated_idx on public.equipment_projects(owner_id, updated_at desc);

alter table public.equipment_projects enable row level security;
create policy "Active users manage their own equipment projects" on public.equipment_projects
  for all to authenticated
  using (owner_id = (select auth.uid()) and exists (
    select 1 from public.profiles where id = (select auth.uid()) and account_status = 'active'
  ))
  with check (owner_id = (select auth.uid()) and exists (
    select 1 from public.profiles where id = (select auth.uid()) and account_status = 'active'
  ));

-- Neither ownership, revisions nor timestamps can be assigned by an API caller.
revoke all on public.equipment_projects from public, anon, authenticated;
grant select, delete on public.equipment_projects to authenticated;
grant insert (owner_id, name, items) on public.equipment_projects to authenticated;
grant update (name, items) on public.equipment_projects to authenticated;

create function public.guard_equipment_project()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    -- Serialise account inserts so concurrent requests cannot exceed the limit.
    perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text, 0));
    if (select count(*) from public.equipment_projects where owner_id = new.owner_id) >= 20 then
      raise exception 'PROJECT_LIMIT' using errcode = 'P0001';
    end if;
    new.revision := 1;
    new.created_at := now();
  else
    new.revision := old.revision + 1;
  end if;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.guard_equipment_project() from public, anon, authenticated;
create trigger equipment_projects_guard before insert or update on public.equipment_projects
  for each row execute function public.guard_equipment_project();
