-- Store the most recent auto-generated monthly report on the project itself.
alter table public.client_projects
  add column if not exists last_report_text text;

alter table public.client_projects
  add column if not exists last_report_at timestamptz;
