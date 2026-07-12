-- Fleet events: cross-project inquiry/event feed for JARVIS.
-- Ingested via POST /api/fleet/ingest (Bearer FLEET_INGEST_SECRET).
-- Sister projects push lead/order/form/status events here; JARVIS reads recent rows.
CREATE TABLE IF NOT EXISTS fleet_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project text NOT NULL,
  event_type text NOT NULL,
  summary text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fleet_events_created_at ON fleet_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fleet_events_project ON fleet_events(project);
CREATE INDEX IF NOT EXISTS idx_fleet_events_event_type ON fleet_events(event_type);

ALTER TABLE fleet_events ENABLE ROW LEVEL SECURITY;

-- Dashboard / JARVIS browser client reads via anon key (realtime + context queries).
DROP POLICY IF EXISTS "fleet_events_anon_select" ON fleet_events;
CREATE POLICY "fleet_events_anon_select" ON fleet_events FOR SELECT TO anon USING (true);

-- Inserts only via service-role API route (FLEET_INGEST_SECRET enforced in app layer).

-- Realtime for JARVIS toast notifications.
ALTER PUBLICATION supabase_realtime ADD TABLE fleet_events;
