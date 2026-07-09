import { supabaseAdmin } from '@/lib/supabase';

function daysAgoIso(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Count form + onboarding leads since N days ago (inclusive). */
export async function getLeadsCountForDays(days) {
  if (!supabaseAdmin || days < 1 || days > 90) return null;
  const since = days === 1 ? startOfTodayIso() : daysAgoIso(days);
  const [formsRes, onboardRes] = await Promise.all([
    supabaseAdmin.from('form_submissions').select('id', { count: 'exact', head: true }).gte('created_at', since),
    supabaseAdmin.from('onboarding_clients').select('id', { count: 'exact', head: true }).gte('created_at', since),
  ]);
  return (formsRes.count ?? 0) + (onboardRes.count ?? 0);
}

/**
 * Verify JARVIS context snapshot matches independent KPI queries.
 * Used by Phase E exam / CI check.
 */
export async function verifyJarvisKpiAlignment(snapshot) {
  if (!supabaseAdmin) {
    return { ok: false, error: 'Supabase not configured', checks: [] };
  }
  const todayStart = startOfTodayIso();
  const [formsTodayRes, onboardTodayRes, tasksPendingRes] = await Promise.all([
    supabaseAdmin.from('form_submissions').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabaseAdmin.from('onboarding_clients').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabaseAdmin.from('empire_tasks').select('id', { count: 'exact', head: true }).in('status', ['pending', 'running']),
  ]);
  const expectedLeads = (formsTodayRes.count ?? 0) + (onboardTodayRes.count ?? 0);
  const expectedTasks = tasksPendingRes.count ?? 0;
  const checks = [
    {
      name: 'leadsToday',
      expected: expectedLeads,
      actual: snapshot.leadsToday ?? 0,
      pass: expectedLeads === (snapshot.leadsToday ?? 0),
    },
    {
      name: 'tasksQueued',
      expected: expectedTasks,
      actual: snapshot.tasksQueued ?? 0,
      pass: expectedTasks === (snapshot.tasksQueued ?? 0),
    },
  ];
  return { ok: checks.every((c) => c.pass), checks };
}
