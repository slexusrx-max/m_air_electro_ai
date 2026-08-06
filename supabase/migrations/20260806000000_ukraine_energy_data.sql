create table if not exists public.energy_data_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_url text not null,
  status text not null check (status in ('live','recent','delayed','historical','unavailable','demo')),
  confidence text not null check (confidence in ('high','medium','low')),
  is_official boolean not null default false,
  is_historical boolean not null default false,
  fetched_at timestamptz,
  published_at timestamptz,
  valid_from timestamptz,
  valid_to timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create table if not exists public.ukraine_energy_snapshots (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.energy_data_sources(id) on delete set null,
  metric text not null,
  observed_at timestamptz not null,
  value numeric,
  unit text,
  dimensions jsonb not null default '{}'::jsonb,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ukraine_outage_events (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.energy_data_sources(id) on delete set null,
  oblast text not null,
  locality text,
  operator text not null,
  outage_type text not null check (outage_type in ('planned','hourly','emergency','actual')),
  status text not null check (status in ('scheduled','active','cancelled','completed','unknown')),
  starts_at timestamptz,
  ends_at timestamptz,
  queue text,
  subqueue text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists ukraine_energy_snapshots_metric_observed_at_idx on public.ukraine_energy_snapshots(metric, observed_at desc);
create index if not exists ukraine_outage_events_oblast_starts_at_idx on public.ukraine_outage_events(oblast, starts_at desc);

alter table public.energy_data_sources enable row level security;
alter table public.ukraine_energy_snapshots enable row level security;
alter table public.ukraine_outage_events enable row level security;
