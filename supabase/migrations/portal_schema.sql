-- Jarvis Client Portal schema
-- Adds profiles, client_projects, documents on top of Supabase Auth.
-- Run in Supabase Dashboard > SQL Editor.

-- profiles: one row per auth.users entry
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('admin', 'client')),
  full_name text,
  company text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "admin reads all profiles" on public.profiles;
create policy "admin reads all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created (via invite or signup).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'client', coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- client_projects
create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_name text not null,
  ghl_contact_id text,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  tier text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.client_projects enable row level security;

drop policy if exists "clients read own projects" on public.client_projects;
create policy "clients read own projects" on public.client_projects for select using (auth.uid() = client_id);

drop policy if exists "admin all projects" on public.client_projects;
create policy "admin all projects" on public.client_projects for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create index if not exists client_projects_client_id_idx on public.client_projects(client_id);

-- documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  file_path text not null,
  file_name text not null,
  doc_type text not null default 'general' check (doc_type in ('contract', 'proposal', 'report', 'invoice', 'general')),
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamptz default now()
);
alter table public.documents enable row level security;

drop policy if exists "clients read own documents" on public.documents;
create policy "clients read own documents" on public.documents for select using (auth.uid() = client_id);

drop policy if exists "admin all documents" on public.documents;
create policy "admin all documents" on public.documents for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create index if not exists documents_client_id_idx on public.documents(client_id);

-- ---------------------------------------------------------------------------
-- STORAGE BUCKET (manual step — cannot be created via SQL migration)
-- ---------------------------------------------------------------------------
-- In Supabase Dashboard > Storage:
--   1. Create bucket: client-documents
--   2. Set to PRIVATE (uncheck "Public bucket").
--   3. File size limit: 25 MB. Allowed MIME: application/pdf, image/*, text/*.
--
-- Then add Storage policies (Dashboard > Storage > Policies) for object table:
--
--   -- admins can insert/update/delete any object in client-documents
--   create policy "admin all storage client-documents" on storage.objects for all
--     using (
--       bucket_id = 'client-documents' and exists (
--         select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
--       )
--     );
--
--   -- clients can read their own files (path must start with their user id: <user-uuid>/...)
--   create policy "clients read own storage" on storage.objects for select
--     using (
--       bucket_id = 'client-documents'
--       and (auth.uid()::text = (storage.foldername(name))[1])
--     );
--
-- Signed URLs are generated server-side using SUPABASE_SERVICE_ROLE_KEY —
-- clients never touch the anon storage API directly.

-- ---------------------------------------------------------------------------
-- SEED ADMIN ACCOUNT
-- ---------------------------------------------------------------------------
-- 1. In Supabase Dashboard > Authentication > Users > Invite user: enter your email.
-- 2. Accept the invite email, set your password.
-- 3. In Supabase Dashboard > SQL Editor, run:
--      UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
-- No credentials go in code.
