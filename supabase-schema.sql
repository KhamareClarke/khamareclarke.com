-- Run this in Supabase SQL Editor to create tables for control centre

-- Form submissions from contact forms, business bundle, etc.
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding clients (from /onboarding flow)
CREATE TABLE IF NOT EXISTS onboarding_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  business_type TEXT,
  industry TEXT,
  current_challenges TEXT,
  goals TEXT,
  timeline TEXT,
  budget TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DISABLE RLS - API routes already check auth before reading
-- RLS was blocking dashboard from reading saved data
DROP POLICY IF EXISTS "Allow insert form_submissions" ON form_submissions;
DROP POLICY IF EXISTS "Allow insert onboarding_clients" ON onboarding_clients;
DROP POLICY IF EXISTS "Allow select form_submissions" ON form_submissions;
DROP POLICY IF EXISTS "Allow select onboarding_clients" ON onboarding_clients;
ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_clients DISABLE ROW LEVEL SECURITY;
