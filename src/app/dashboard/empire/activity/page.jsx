'use client';

/**
 * Empire User Activity dashboard.
 * Live feed of end-user events ingested from every sister project
 * (Seoinforce, MyApproved, Leverage Journal, ...).
 *
 * Reads: GET /api/empire/activity/list  (service role; see route for auth model).
 * Source of events: POST /api/empire/activity/ingest (Bearer EMPIRE_INGEST_SECRET).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Section } from '../../../components/ui/Section';
import { Container } from '../../../components/ui/Container';
import { ALL_EMPIRE_PROJECT_IDS, getProjectLabel } from '@/lib/empire-projects';
import { useAdminGuard } from '@/lib/use-admin-guard';

const EVENT_TYPES = [
  'signin',
  'signin_failed',
  'signup',
  'signup_failed',
  'verify_email',
  'password_reset_request',
  'password_reset_complete',
  'project_created',
  'audit_started',
  'audit_completed',
  'audit_failed',
  'payment_succeeded',
  'payment_failed',
  'subscription_created',
  'subscription_cancelled',
  'lead_created',
  'logout',
  'custom',
];

const EVENT_LABEL = {
  signin: 'Sign in',
  signin_failed: 'Sign in failed',
  signup: 'Sign up',
  signup_failed: 'Sign up failed',
  verify_email: 'Email verified',
  password_reset_request: 'Password reset requested',
  password_reset_complete: 'Password reset',
  project_created: 'Project created',
  audit_started: 'Audit started',
  audit_completed: 'Audit completed',
  audit_failed: 'Audit failed',
  payment_succeeded: 'Payment succeeded',
  payment_failed: 'Payment failed',
  subscription_created: 'Subscription created',
  subscription_cancelled: 'Subscription cancelled',
  lead_created: 'Lead created',
  logout: 'Sign out',
  custom: 'Custom event',
};

const EVENT_COLOR = {
  signin: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  signin_failed: 'bg-red-500/20 text-red-300 border-red-500/40',
  signup: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  signup_failed: 'bg-red-500/20 text-red-300 border-red-500/40',
  verify_email: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  password_reset_request: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  password_reset_complete: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  project_created: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  audit_started: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  audit_completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  audit_failed: 'bg-red-500/20 text-red-300 border-red-500/40',
  payment_succeeded: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  payment_failed: 'bg-red-500/20 text-red-300 border-red-500/40',
  subscription_created: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  subscription_cancelled: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  lead_created: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
  logout: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
  custom: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
};

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleString();
}

function relativeTime(ts) {
  if (!ts) return '';
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return `${Math.max(1, Math.floor(diff))}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function EmpireActivityPage() {
  const authReady = useAdminGuard();
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({ total24h: 0, byProject: {}, byEvent: {}, failed24h: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectFilter, setProjectFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [search, setSearch] = useState('');
  const [auto, setAuto] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: '200' });
      if (projectFilter) params.set('projectId', projectFilter);
      if (eventFilter) params.set('eventType', eventFilter);
      const res = await fetch(`/api/empire/activity/list?${params}`, { cache: 'no-store' });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || 'Failed to load activity');
        setEvents([]);
        return;
      }
      setError(null);
      setEvents(Array.isArray(data.events) ? data.events : []);
      setSummary(data.summary || { total24h: 0, byProject: {}, byEvent: {}, failed24h: 0 });
    } catch (e) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [projectFilter, eventFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (!auto) return undefined;
    const id = setInterval(fetchEvents, 8000);
    return () => clearInterval(id);
  }, [auto, fetchEvents]);

  const filtered = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.trim().toLowerCase();
    return events.filter((e) =>
      [e.user_email, e.user_name, e.user_id, e.message, e.source, e.ip]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [events, search]);

  const dashboardProjects = ALL_EMPIRE_PROJECT_IDS.filter(
    (id) => id !== 'empire' && id !== 'empire-phase11-test'
  );

  if (!authReady) {
    return (
      <Section size="large" className="bg-black text-white min-h-screen">
        <Container size="wide"><p className="text-gray-400">Loading...</p></Container>
      </Section>
    );
  }

  return (
    <Section size="large" className="bg-black text-white min-h-screen">
      <Container size="wide">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Empire — User Activity
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Live feed of sign-ins, sign-ups, audits and payments across every project.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={auto}
                onChange={(e) => setAuto(e.target.checked)}
                className="accent-yellow-400"
              />
              Auto-refresh (8s)
            </label>
            <button
              onClick={fetchEvents}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-yellow-400 text-black hover:bg-yellow-300"
            >
              Refresh
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <SummaryCard label="Events (24h)" value={summary.total24h} accent="bg-yellow-400/10 text-yellow-300" />
          <SummaryCard
            label="Failed (24h)"
            value={summary.failed24h}
            accent="bg-red-500/10 text-red-300"
          />
          <SummaryCard
            label="Active projects"
            value={Object.keys(summary.byProject || {}).length}
            accent="bg-cyan-500/10 text-cyan-300"
          />
          <SummaryCard
            label="Sign-ins (24h)"
            value={summary.byEvent?.signin || 0}
            accent="bg-emerald-500/10 text-emerald-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All projects</option>
            {dashboardProjects.map((id) => (
              <option key={id} value={id}>
                {getProjectLabel(id)}
              </option>
            ))}
          </select>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All event types</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {EVENT_LABEL[t] || t}
              </option>
            ))}
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, name, IP, message..."
            className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-300 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/80 text-zinc-400">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">When</th>
                  <th className="text-left px-4 py-3 font-medium">Project</th>
                  <th className="text-left px-4 py-3 font-medium">Event</th>
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Source / IP</th>
                  <th className="text-left px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {loading && filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                      Loading activity…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                      No activity yet. Once sister projects POST events to
                      <code className="mx-1 text-yellow-300">/api/empire/activity/ingest</code>
                      they appear here in real-time.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <div className="font-medium">{relativeTime(row.created_at)}</div>
                        <div className="text-xs text-zinc-500">{formatTime(row.created_at)}</div>
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <span className="px-2 py-1 rounded-md text-xs bg-zinc-800 border border-zinc-700">
                          {getProjectLabel(row.project_id)}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-md text-xs border ${
                            EVENT_COLOR[row.event_type] ||
                            'bg-zinc-500/20 text-zinc-300 border-zinc-500/40'
                          }`}
                        >
                          {EVENT_LABEL[row.event_type] || row.event_type}
                        </span>
                        {row.status === 'failed' && (
                          <span className="ml-2 text-xs text-red-400">failed</span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium">{row.user_email || row.user_id || '—'}</div>
                        {row.user_name && <div className="text-xs text-zinc-500">{row.user_name}</div>}
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-zinc-400">
                        <div>{row.source || '—'}</div>
                        <div className="text-zinc-600">{row.ip || ''}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-zinc-300 max-w-[28rem]">
                        {row.message && <div className="mb-1">{row.message}</div>}
                        {row.metadata && Object.keys(row.metadata).length > 0 && (
                          <details className="text-zinc-500">
                            <summary className="cursor-pointer hover:text-zinc-300">metadata</summary>
                            <pre className="mt-1 whitespace-pre-wrap break-all text-[11px] text-zinc-400">
                              {JSON.stringify(row.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className={`rounded-xl border border-zinc-800 p-4 ${accent || ''}`}>
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-2xl font-extrabold mt-1">{value ?? 0}</div>
    </div>
  );
}
