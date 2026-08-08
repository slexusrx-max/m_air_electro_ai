-- User-owned technical documents. Apply through the existing Supabase migration workflow.
create table if not exists public.technical_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 240),
  storage_path text not null unique,
  mime_type text not null,
  byte_size bigint not null check (byte_size > 0 and byte_size <= 20971520),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists technical_documents_owner_created_idx on public.technical_documents(owner_id, created_at desc);
drop trigger if exists set_technical_documents_updated_at on public.technical_documents;
create trigger set_technical_documents_updated_at before update on public.technical_documents
  for each row execute function public.set_updated_at();

alter table public.technical_documents enable row level security;
create policy "Users manage their own technical documents" on public.technical_documents
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('technical-documents', 'technical-documents', false, 20971520,
  array['application/pdf','image/jpeg','image/png','image/webp','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set public = false, file_size_limit = 20971520;

create policy "Users upload their own technical files" on storage.objects
  for insert to authenticated with check (bucket_id = 'technical-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users read their own technical files" on storage.objects
  for select to authenticated using (bucket_id = 'technical-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete their own technical files" on storage.objects
  for delete to authenticated using (bucket_id = 'technical-documents' and (storage.foldername(name))[1] = auth.uid()::text);
