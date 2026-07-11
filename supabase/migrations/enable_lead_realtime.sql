-- Enable Supabase Realtime for JARVIS lead notifications.
ALTER PUBLICATION supabase_realtime ADD TABLE form_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE onboarding_clients;
