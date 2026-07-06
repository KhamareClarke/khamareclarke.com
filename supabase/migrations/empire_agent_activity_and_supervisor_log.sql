-- Empire agent activity: one row per agent run (running/done/failed). Used by dashboard "All agent activities".
CREATE TABLE IF NOT EXISTS empire_agent_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  agent_id text NOT NULL,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'done', 'failed')),
  started_at timestamptz DEFAULT now(),
  error_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empire_agent_activity_project_id ON empire_agent_activity(project_id);
CREATE INDEX IF NOT EXISTS idx_empire_agent_activity_agent_id ON empire_agent_activity(agent_id);
CREATE INDEX IF NOT EXISTS idx_empire_agent_activity_started_at ON empire_agent_activity(started_at DESC);

ALTER TABLE empire_agent_activity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "empire_agent_activity_anon_select" ON empire_agent_activity;
CREATE POLICY "empire_agent_activity_anon_select" ON empire_agent_activity FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "empire_agent_activity_anon_insert" ON empire_agent_activity;
CREATE POLICY "empire_agent_activity_anon_insert" ON empire_agent_activity FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "empire_agent_activity_anon_update" ON empire_agent_activity;
CREATE POLICY "empire_agent_activity_anon_update" ON empire_agent_activity FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Supervisor log: live feed for "Supervisor: Delegating SEO audit of Leverage Academy to Team Growth"
CREATE TABLE IF NOT EXISTS empire_supervisor_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  project_id text,
  team_id text,
  task_type text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empire_supervisor_log_created_at ON empire_supervisor_log(created_at DESC);

ALTER TABLE empire_supervisor_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "empire_supervisor_log_anon_select" ON empire_supervisor_log;
CREATE POLICY "empire_supervisor_log_anon_select" ON empire_supervisor_log FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "empire_supervisor_log_anon_insert" ON empire_supervisor_log;
CREATE POLICY "empire_supervisor_log_anon_insert" ON empire_supervisor_log FOR INSERT TO anon WITH CHECK (true);
