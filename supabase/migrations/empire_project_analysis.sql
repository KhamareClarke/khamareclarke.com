-- Fleet analysis: one row per project with latest OpenRouter analysis summary (live-updated when "Analyze all" runs).
CREATE TABLE IF NOT EXISTS empire_project_analysis (
  project_id text PRIMARY KEY,
  summary text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'failed')),
  error_message text,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empire_project_analysis_updated_at ON empire_project_analysis(updated_at DESC);

ALTER TABLE empire_project_analysis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "empire_project_analysis_anon_select" ON empire_project_analysis;
CREATE POLICY "empire_project_analysis_anon_select" ON empire_project_analysis FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "empire_project_analysis_anon_insert" ON empire_project_analysis;
CREATE POLICY "empire_project_analysis_anon_insert" ON empire_project_analysis FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "empire_project_analysis_anon_update" ON empire_project_analysis;
CREATE POLICY "empire_project_analysis_anon_update" ON empire_project_analysis FOR UPDATE TO anon USING (true) WITH CHECK (true);
