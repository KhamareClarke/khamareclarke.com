-- SEO and Ops runs saved in DB like leads; dashboard shows them in tables.
-- Run in Supabase SQL Editor.

-- ---------------------------------------------------------------------------
-- 1. Table: empire_seo_runs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS empire_seo_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL DEFAULT 'myapproved',
  run_type TEXT NOT NULL DEFAULT 'cron',  -- 'cron' | 'auto_24h'
  success BOOLEAN NOT NULL DEFAULT false,
  push_ok BOOLEAN NOT NULL DEFAULT false,
  result_summary TEXT,
  push_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empire_seo_runs_project ON empire_seo_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_empire_seo_runs_created ON empire_seo_runs(created_at DESC);

COMMENT ON TABLE empire_seo_runs IS 'SEO (Growth) runs for MyApproved – dedicated cron and Auto 24h';

ALTER TABLE empire_seo_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "empire_seo_runs_anon_select" ON empire_seo_runs;
CREATE POLICY "empire_seo_runs_anon_select" ON empire_seo_runs FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "empire_seo_runs_service_insert" ON empire_seo_runs;
CREATE POLICY "empire_seo_runs_service_insert" ON empire_seo_runs FOR INSERT TO service_role WITH CHECK (true);
DROP POLICY IF EXISTS "empire_seo_runs_anon_insert" ON empire_seo_runs;
CREATE POLICY "empire_seo_runs_anon_insert" ON empire_seo_runs FOR INSERT TO anon WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 2. Table: empire_ops_runs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS empire_ops_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL DEFAULT 'myapproved',
  run_type TEXT NOT NULL DEFAULT 'cron',  -- 'cron' | 'auto_24h'
  success BOOLEAN NOT NULL DEFAULT false,
  push_ok BOOLEAN NOT NULL DEFAULT false,
  result_summary TEXT,
  push_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empire_ops_runs_project ON empire_ops_runs(project_id);
CREATE INDEX IF NOT EXISTS idx_empire_ops_runs_created ON empire_ops_runs(created_at DESC);

COMMENT ON TABLE empire_ops_runs IS 'Bugs & broken links (Ops) runs for MyApproved – dedicated cron and Auto 24h';

ALTER TABLE empire_ops_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "empire_ops_runs_anon_select" ON empire_ops_runs;
CREATE POLICY "empire_ops_runs_anon_select" ON empire_ops_runs FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "empire_ops_runs_service_insert" ON empire_ops_runs;
CREATE POLICY "empire_ops_runs_service_insert" ON empire_ops_runs FOR INSERT TO service_role WITH CHECK (true);
DROP POLICY IF EXISTS "empire_ops_runs_anon_insert" ON empire_ops_runs;
CREATE POLICY "empire_ops_runs_anon_insert" ON empire_ops_runs FOR INSERT TO anon WITH CHECK (true);
