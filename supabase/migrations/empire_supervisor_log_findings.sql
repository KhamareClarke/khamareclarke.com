-- Add findings column so auto 24h runs can store full detail (leads scraped, bugs found, SEO updates).
ALTER TABLE empire_supervisor_log ADD COLUMN IF NOT EXISTS findings text;
