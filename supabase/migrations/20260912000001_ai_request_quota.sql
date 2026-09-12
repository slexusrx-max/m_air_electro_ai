-- A shared, atomic daily quota survives restarts and multiple app instances.
create table public.ai_request_usage (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  usage_day date not null,
  requests integer not null check (requests between 1 and 30)
);
alter table public.ai_request_usage enable row level security;
revoke all on public.ai_request_usage from public, anon, authenticated;

create function public.consume_ai_request() returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  request_user uuid := auth.uid();
  request_day date := (statement_timestamp() at time zone 'UTC')::date;
  consumed integer;
begin
  if request_user is null then raise exception 'Authentication required'; end if;
  perform 1 from public.profiles
    where id = request_user and account_status = 'active' for share;
  if not found then raise exception 'Active account required'; end if;

  insert into public.ai_request_usage as usage (user_id, usage_day, requests)
    values (request_user, request_day, 1)
  on conflict (user_id) do update set
    usage_day = excluded.usage_day,
    requests = case when usage.usage_day = excluded.usage_day then usage.requests + 1 else 1 end
  where usage.usage_day <> excluded.usage_day or usage.requests < 30
  returning requests into consumed;
  return consumed is not null;
end;
$$;
revoke all on function public.consume_ai_request() from public, anon;
grant execute on function public.consume_ai_request() to authenticated;
