-- Empire user activity: one row per end-user event from any sister project.
-- Ingested via POST /api/empire/activity/ingest (Bearer EMPIRE_INGEST_SECRET).
-- Rendered on the Empire dashboard "User activity" panel.
CREATE TABLE IF NOT EXISTS empire_user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  event_type text NOT NULL,
  status text NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'failed', 'pending')),
  user_email text,
  user_id text,
  user_name text,
  source text,
  ip text,
  user_agent text,
  message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empire_user_activity_created_at ON empire_user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_empire_user_activity_project_id ON empire_user_activity(project_id);
CREATE INDEX IF NOT EXISTS idx_empire_user_activity_event_type ON empire_user_activity(event_type);
CREATE INDEX IF NOT EXISTS idx_empire_user_activity_user_email ON empire_user_activity(user_email);

ALTER TABLE empire_user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "empire_user_activity_anon_select" ON empire_user_activity;
CREATE POLICY "empire_user_activity_anon_select" ON empire_user_activity FOR SELECT TO anon USING (true);
-- Inserts must go through the API (service role) so the ingest secret is enforced.
