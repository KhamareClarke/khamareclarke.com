-- Add contacted tracking for outreach pipeline (scrape → save → send outreach).
ALTER TABLE empire_leads ADD COLUMN IF NOT EXISTS contacted boolean DEFAULT false;
ALTER TABLE empire_leads ADD COLUMN IF NOT EXISTS contacted_at timestamptz;
