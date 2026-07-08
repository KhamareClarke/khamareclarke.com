-- Associate onboarding_clients entries with a Supabase auth user (portal submissions).
-- Public /onboarding leaves user_id null; /portal/onboarding sets it.

alter table public.onboarding_clients
  add column if not exists user_id uuid references auth.users(id);

alter table public.onboarding_clients
  add column if not exists website text;

create index if not exists onboarding_clients_user_id_idx on public.onboarding_clients(user_id);
