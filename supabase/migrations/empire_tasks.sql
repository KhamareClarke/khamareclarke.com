-- Empire Tasks: assign tasks to any project + agent from the dashboard.
-- Run this in your Supabase SQL editor (same project as empire_leads / empire_agent_activity).

CREATE TABLE IF NOT EXISTS empire_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  agent_id text NOT NULL,
  task_description text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'failed')),
  assigned_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  result_message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empire_tasks_project_id ON empire_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_empire_tasks_agent_id ON empire_tasks(agent_id);
CREATE INDEX IF NOT EXISTS idx_empire_tasks_status ON empire_tasks(status);
CREATE INDEX IF NOT EXISTS idx_empire_tasks_assigned_at ON empire_tasks(assigned_at DESC);

-- RLS: allow anon read/insert so dashboard (anon key) can create and list tasks.
-- Restrict to same policy pattern as empire_leads if you use auth.
ALTER TABLE empire_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "empire_tasks_anon_select" ON empire_tasks;
CREATE POLICY "empire_tasks_anon_select" ON empire_tasks FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "empire_tasks_anon_insert" ON empire_tasks;
CREATE POLICY "empire_tasks_anon_insert" ON empire_tasks FOR INSERT TO anon WITH CHECK (true);

-- Optional: allow service role or authenticated admin to update (e.g. mark done when agent runs).
DROP POLICY IF EXISTS "empire_tasks_anon_update" ON empire_tasks;
CREATE POLICY "empire_tasks_anon_update" ON empire_tasks FOR UPDATE TO anon USING (true) WITH CHECK (true);
