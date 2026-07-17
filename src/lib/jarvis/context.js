import { supabaseAdmin } from '@/lib/supabase';
import { getClientGHLData } from '@/lib/ghl';

const MAX_CONTEXT_CHARS = 7500; // ~2k tokens

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function startOfYesterdayIso() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfYesterdayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function daysAgoIso(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function empireLeadCompany(row) {
  const payload = row.payload || {};
  return payload.company || payload.company_name || row.name || '—';
}

function empireLeadContact(row) {
  const payload = row.payload || {};
  return row.email || payload.contact || payload.phone || row.name || '—';
}

/**
 * Build deterministic live-data context for JARVIS (~2k tokens cap).
 * Priority: leads → tasks → clients → activity → GHL summaries.
 */
export async function buildJarvisContext() {
  if (!supabaseAdmin) {
    return {
      text: 'LIVE DATA: Supabase service role not configured. All metrics unavailable.',
      snapshot: emptySnapshot('Database not connected'),
      clients: [],
      projects: [],
      activity: [],
      tasksRecent: [],
      fleet: [],
      fleetEvents: [],
      recentLeads: [],
      leadsHistory: {},
    };
  }

  const admin = supabaseAdmin;
  const todayStart = startOfTodayIso();
  const yesterdayStart = startOfYesterdayIso();
  const yesterdayEnd = endOfYesterdayIso();

  const DASHBOARD_PROJECT_IDS = [
    'myapproved', 'khamareclarke', 'omniwtms', 'leverageacademy', 'fliprepublic',
    'leveragejournal', 'inboker', 'identitymarketing', 'adstarter', 'seoinforce', 'alkemmy',
    'upgraderoofing',
  ];

  const [
    formsTodayRes,
    formsTotalRes,
    formsYesterdayRes,
    onboardTodayRes,
    onboardTotalRes,
    onboardYesterdayRes,
    tasksPendingRes,
    tasksRecentRes,
    profilesRes,
    projectsRes,
    activityRes,
    formsRecentRes,
    onboardRecentRes,
    fleetRes,
    forms7dRes,
    onboard7dRes,
    empireLeadsRecentRes,
    empireLeadsMyapprovedCountRes,
    fleetEventsRes,
  ] = await Promise.all([
    admin.from('form_submissions').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    admin.from('form_submissions').select('id', { count: 'exact', head: true }),
    admin
      .from('form_submissions')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', yesterdayStart)
      .lt('created_at', yesterdayEnd),
    admin.from('onboarding_clients').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    admin.from('onboarding_clients').select('id', { count: 'exact', head: true }),
    admin
      .from('onboarding_clients')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', yesterdayStart)
      .lt('created_at', yesterdayEnd),
    admin.from('empire_tasks').select('id', { count: 'exact', head: true }).in('status', ['pending', 'running']),
    admin
      .from('empire_tasks')
      .select('id, project_id, agent_id, status, task_description, assigned_at')
      .order('assigned_at', { ascending: false })
      .limit(5),
    admin.from('profiles').select('id, full_name, company, role').eq('role', 'client').limit(15),
    admin.from('client_projects').select('id, client_id, project_name, status, ghl_contact_id').limit(30),
    admin
      .from('empire_user_activity')
      .select('project_id, event_type, status, message, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    admin
      .from('form_submissions')
      .select('id, source, created_at, data')
      .order('created_at', { ascending: false })
      .limit(5),
    admin
      .from('onboarding_clients')
      .select('id, company_name, contact_name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    admin
      .from('empire_project_analysis')
      .select('project_id, summary, status, error_message, updated_at')
      .in('project_id', DASHBOARD_PROJECT_IDS),
    admin.from('form_submissions').select('id', { count: 'exact', head: true }).gte('created_at', daysAgoIso(7)),
    admin.from('onboarding_clients').select('id', { count: 'exact', head: true }).gte('created_at', daysAgoIso(7)),
    admin
      .from('empire_leads')
      .select('project_id, source, created_at, name, email, payload')
      .order('created_at', { ascending: false })
      .limit(20),
    admin
      .from('empire_leads')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', 'myapproved'),
    admin
      .from('fleet_events')
      .select('project, event_type, summary, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const formsToday = formsTodayRes.count ?? 0;
  const formsTotal = formsTotalRes.count ?? 0;
  const formsYesterday = formsYesterdayRes.count ?? 0;
  const onboardToday = onboardTodayRes.count ?? 0;
  const onboardTotal = onboardTotalRes.count ?? 0;
  const onboardYesterday = onboardYesterdayRes.count ?? 0;
  const leadsToday = formsToday + onboardToday;
  const leadsYesterday = formsYesterday + onboardYesterday;
  const tasksQueued = tasksPendingRes.count ?? 0;
  const tasksRecent = tasksRecentRes.data || [];
  const clients = profilesRes.data || [];
  const projects = projectsRes.data || [];
  const activity = activityRes.data || [];
  const fleetRows = fleetRes.data || [];
  const fleetByProject = fleetRows.reduce((acc, r) => {
    acc[r.project_id] = r;
    return acc;
  }, {});
  const fleet = DASHBOARD_PROJECT_IDS.map((project_id) => ({
    project_id,
    ...(fleetByProject[project_id] || { summary: null, status: 'pending', error_message: null, updated_at: null }),
  }));
  const empireLeadsRecent = empireLeadsRecentRes.data || [];
  const empireLeadsMyapprovedTotal = empireLeadsMyapprovedCountRes.count ?? 0;
  const fleetEvents = fleetEventsRes.data || [];

  const recentLeads = [
    ...(formsRecentRes.data || []).map((s) => ({
      id: `form-${s.id}`,
      name: s.data?.name || s.data?.email || 'Form lead',
      email: s.data?.email || null,
      phone: s.data?.phone || null,
      message: s.data?.message || null,
      businessType: s.data?.businessType || null,
      source: s.source || 'contact',
      date: s.created_at,
    })),
    ...(onboardRecentRes.data || []).map((c) => ({
      id: `onboard-${c.id}`,
      name: c.company_name || c.contact_name || c.email || 'Onboarding',
      email: c.email || null,
      phone: null,
      message: null,
      businessType: null,
      source: 'onboarding',
      date: c.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const projectsByClient = projects.reduce((acc, p) => {
    acc[p.client_id] = (acc[p.client_id] || 0) + 1;
    return acc;
  }, {});

  const lines = [
    '=== LIVE DATA (authoritative — do not exceed these figures) ===',
    `Leads today (form + onboarding): ${leadsToday}`,
    `Leads yesterday: ${leadsYesterday}`,
    `Form submissions today: ${formsToday} | total: ${formsTotal}`,
    `Onboarding clients today: ${onboardToday} | total: ${onboardTotal}`,
    `Task queue depth (pending + running): ${tasksQueued}`,
  ];

  if (tasksRecent.length) {
    lines.push('Last 5 tasks:');
    for (const t of tasksRecent) {
      lines.push(
        `  - [${t.status}] ${t.project_id}/${t.agent_id}: ${String(t.task_description || '').slice(0, 80)}`
      );
    }
  } else {
    lines.push('Last 5 tasks: none');
  }

  if (clients.length) {
    lines.push('Clients:');
    for (const c of clients.slice(0, 10)) {
      const count = projectsByClient[c.id] || 0;
      lines.push(`  - ${c.full_name || c.company || c.id} (${count} project(s))`);
    }
  } else {
    lines.push('Clients: none in profiles');
  }

  if (activity.length) {
    lines.push('Last 10 activity events:');
    for (const e of activity) {
      lines.push(
        `  - ${e.created_at?.slice(0, 16) || '?'} ${e.project_id} ${e.event_type} (${e.status})`
      );
    }
  } else {
    lines.push('Activity events: none');
  }

  lines.push(`Empire scraped leads (empire_leads) total for myapproved: ${empireLeadsMyapprovedTotal}`);

  if (recentLeads.length) {
    lines.push('Recent form + onboarding leads (newest first, name | email | source | time):');
    for (const l of recentLeads.slice(0, 8)) {
      lines.push(`  - ${l.name} | ${l.email || '—'} | ${l.source} | ${l.date?.slice(0, 16) || '?'}`);
    }
  } else {
    lines.push('Recent form + onboarding leads: none');
  }

  if (empireLeadsRecent.length) {
    lines.push('Last 20 empire_leads rows (company | contact | source | created_at):');
    for (const row of empireLeadsRecent) {
      const company = empireLeadCompany(row);
      const contact = empireLeadContact(row);
      const source = row.source || '—';
      const created = row.created_at?.slice(0, 16) || '?';
      lines.push(`  - [${row.project_id}] ${company} | ${contact} | ${source} | ${created}`);
    }
  } else {
    lines.push('Last 20 empire_leads rows: none');
  }

  if (fleetEvents.length) {
    lines.push('FLEET EVENTS (all projects — last 20):');
    for (const e of fleetEvents) {
      lines.push(
        `  - ${e.created_at?.slice(0, 16) || '?'} [${e.project}] ${e.event_type}: ${String(e.summary || '').slice(0, 120)}`
      );
    }
  } else {
    lines.push('FLEET EVENTS (all projects): none');
  }

  // GHL summaries (max 5 clients with ghl_contact_id)
  const ghlClients = projects.filter((p) => p.ghl_contact_id).slice(0, 5);
  if (ghlClients.length && process.env.GHL_API_KEY) {
    lines.push('GHL status (cached 5 min):');
    for (const p of ghlClients) {
      const ghl = await getClientGHLData(p.ghl_contact_id);
      if (!ghl) {
        lines.push(`  - ${p.project_name}: GHL unavailable`);
        continue;
      }
      const stage = ghl.opportunities?.[0]?.pipelineStageName || ghl.opportunities?.[0]?.stage || 'unknown';
      lines.push(`  - ${p.project_name}: stage=${stage}, appts=${ghl.appointments?.length ?? 0}`);
    }
  } else if (!process.env.GHL_API_KEY) {
    lines.push('GHL: not connected (GHL_API_KEY unset)');
  }

  let text = lines.join('\n');
  if (text.length > MAX_CONTEXT_CHARS) {
    text = `${text.slice(0, MAX_CONTEXT_CHARS)}\n...[context truncated]`;
  }

  return {
    text,
    snapshot: {
      leadsToday,
      leadsYesterday,
      tasksQueued,
      formsToday,
      formsTotal,
      onboardToday,
      onboardTotal,
    },
    clients,
    projects,
    activity,
    tasksRecent,
    fleet,
    fleetEvents,
    recentLeads,
    leadsHistory: {
      7: (forms7dRes.count ?? 0) + (onboard7dRes.count ?? 0),
    },
    leadsHistoryMeta: {
      7: {
        forms: forms7dRes.count ?? 0,
        onboard: onboard7dRes.count ?? 0,
      },
    },
  };
}

function emptySnapshot(note) {
  return {
    leadsToday: 0,
    leadsYesterday: 0,
    tasksQueued: 0,
    formsToday: 0,
    formsTotal: 0,
    onboardToday: 0,
    onboardTotal: 0,
    note,
  };
}
