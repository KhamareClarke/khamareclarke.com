-- Run this entire script in Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Creates empire_leads and policies so the app can INSERT (service role) and SELECT (anon for dashboard).

-- ---------------------------------------------------------------------------
-- 1. Table: empire_leads
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS empire_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  source TEXT,
  email TEXT,
  name TEXT,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empire_leads_project ON empire_leads(project_id);
CREATE INDEX IF NOT EXISTS idx_empire_leads_created ON empire_leads(created_at DESC);

COMMENT ON TABLE empire_leads IS 'Leads from Empire scraper (MyApproved etc.)';

-- ---------------------------------------------------------------------------
-- 2. Optional columns (contacted tracking)
-- ---------------------------------------------------------------------------
ALTER TABLE empire_leads ADD COLUMN IF NOT EXISTS contacted boolean DEFAULT false;
ALTER TABLE empire_leads ADD COLUMN IF NOT EXISTS contacted_at timestamptz;

-- ---------------------------------------------------------------------------
-- 3. RLS: enable but allow service_role to do everything (default).
--    Allow anon to SELECT so dashboard list API can read.
-- ---------------------------------------------------------------------------
ALTER TABLE empire_leads ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist (avoid conflicts)
DROP POLICY IF EXISTS "empire_leads_read_admin" ON empire_leads;
DROP POLICY IF EXISTS "empire_leads_read_anon" ON empire_leads;

-- Let anyone with anon key read (for dashboard). Service role bypasses RLS for INSERT.
CREATE POLICY "empire_leads_read_anon" ON empire_leads
  FOR SELECT TO anon USING (true);

-- Allow service_role to insert (optional; service_role usually bypasses RLS)
-- If inserts still fail, uncomment below:
-- CREATE POLICY "empire_leads_service_all" ON empire_leads FOR ALL TO service_role USING (true) WITH CHECK (true);
