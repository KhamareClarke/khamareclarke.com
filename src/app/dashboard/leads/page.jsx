'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import {
  EnvelopeIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const fetchData = async (retry = false) => {
    try {
      setFetchError(null);
      const [subRes, clientRes] = await Promise.all([
        fetch('/api/submissions', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/onboarding', { credentials: 'include', cache: 'no-store' }),
      ]);
      if ((subRes.status === 401 || clientRes.status === 401) && !retry) {
        await new Promise((r) => setTimeout(r, 500));
        return fetchData(true);
      }
      if (subRes.status === 401 || clientRes.status === 401) {
        window.location.href = '/login?callbackUrl=/dashboard/leads';
        return;
      }
      if (!subRes.ok || !clientRes.ok) {
        const subErr = subRes.ok ? null : await subRes.json().catch(() => ({}));
        const clientErr = clientRes.ok ? null : await clientRes.json().catch(() => ({}));
        setFetchError(
          subErr?.error || clientErr?.error || subErr?.message || clientErr?.message || 'Could not load leads'
        );
        setSubmissions([]);
        setClients([]);
        return;
      }
      const subData = await subRes.json();
      const clientData = await clientRes.json();
      setSubmissions(subData.submissions || []);
      setClients(clientData.clients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/check', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setLoggedIn(d.loggedIn);
        if (!d.loggedIn) {
          window.location.href = '/login?callbackUrl=/dashboard/leads';
        } else {
          setTimeout(() => fetchData(), 100);
        }
      })
      .catch(() => {
        window.location.href = '/login?callbackUrl=/dashboard/leads';
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    fetchData();
  };

  if (loggedIn === false || loggedIn === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-pulse text-[#ffb700]">Loading...</div>
      </main>
    );
  }

  const allLeads = [
    ...submissions.map((s) => ({
      ...s,
      id: `form-${s.id || s.created_at}-${s.data?.email}`,
      type: 'form',
      name: s.data?.name || s.data?.email || 'Unknown',
      email: s.data?.email || '-',
      source: s.source || 'contact',
      date: s.created_at,
      message: s.data?.message ?? null,
      fullData: s.data || {},
    })),
    ...clients.map((c) => ({
      ...c,
      id: `onboarding-${c.id || c.created_at}-${c.email}`,
      type: 'onboarding',
      name: c.company_name || c.contact_name || c.email || 'Unknown',
      email: c.email || '-',
      source: 'onboarding',
      date: c.created_at,
      message: null,
      fullData: {
        contact_name: c.contact_name,
        email: c.email,
        phone: c.phone,
        company_name: c.company_name,
        business_type: c.business_type,
        industry: c.industry,
        current_challenges: c.current_challenges,
        goals: c.goals,
        timeline: c.timeline,
        budget: c.budget,
      },
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((lead, i) => ({ ...lead, rowKey: lead.id ?? `row-${i}` }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <header className="border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
        <Container size="wide" className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Control Centre</h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/dashboard/jarvis"
              className="text-sm text-cyan-400 hover:underline flex items-center gap-1"
            >
              JARVIS
            </a>
            <a
              href="/dashboard/clients"
              className="text-sm text-[#ffb700] hover:underline flex items-center gap-1"
            >
              Clients
            </a>
            <a
              href="/portal"
              className="text-sm text-[#ffb700] hover:underline flex items-center gap-1"
            >
              Client Portal
            </a>
            <a
              href="/dashboard/empire"
              className="text-sm text-[#ffb700] hover:underline flex items-center gap-1"
            >
              Empire OS
            </a>
            <a
              href="/onboarding"
              className="text-sm text-[#ffb700] hover:underline flex items-center gap-1"
            >
              <ClipboardDocumentListIcon className="w-4 h-4" />
              Start Onboarding
            </a>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-sm text-[#ffb700] hover:underline flex items-center gap-1 disabled:opacity-50"
              title="Refresh data"
            >
              <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </Container>
      </header>

      <Section>
        <Container size="wide" className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <StatCard icon={<EnvelopeIcon className="w-6 h-6" />} label="Form Submissions" value={submissions.length} />
          <StatCard icon={<UserGroupIcon className="w-6 h-6" />} label="Onboarding Clients" value={clients.length} />
          <StatCard icon={<ChartBarIcon className="w-6 h-6" />} label="Total Leads" value={allLeads.length} />
          <a
            href="/onboarding"
            className="block p-6 bg-[#ffb700]/10 border border-[#ffb700]/30 rounded-xl hover:bg-[#ffb700]/20 transition"
          >
            <ClipboardDocumentListIcon className="w-6 h-6 text-[#ffb700] mb-2" />
            <div className="text-2xl font-bold text-white">+ New</div>
            <div className="text-sm text-[#ADB7BE]">Start client onboarding</div>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a1a]/50 border border-[#222] rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[#222]">
            <h2 className="text-lg font-semibold text-white">All Leads & Clients</h2>
            <p className="text-sm text-[#ADB7BE]">Form submissions and onboarding data from all projects</p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#ADB7BE]">Loading...</div>
          ) : fetchError ? (
            <div className="p-12 text-center text-red-400">
              <p>{fetchError}</p>
              <p className="mt-2 text-sm text-[#ADB7BE]">
                Check Supabase tables exist (form_submissions, onboarding_clients) and SUPABASE_SERVICE_ROLE_KEY is set in Vercel.
              </p>
            </div>
          ) : allLeads.length === 0 ? (
            <div className="p-12 text-center text-[#ADB7BE]">
              <p>No leads yet. Form submissions and onboarding clients will appear here.</p>
              <p className="mt-2 text-sm">Configure Supabase to persist data. See .env.example for setup.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#222]">
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase w-8"></th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Source</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase min-w-[200px]">Message / Details</th>
                  </tr>
                </thead>
                <tbody>
                  {allLeads.map((lead, i) => (
                    <React.Fragment key={lead.rowKey}>
                      <tr
                        className="border-b border-[#222]/50 hover:bg-[#222]/30 cursor-pointer"
                        onClick={() => setExpandedId(expandedId === lead.rowKey ? null : lead.rowKey)}
                      >
                        <td className="px-4 py-4 text-[#ADB7BE]">
                          {expandedId === lead.rowKey ? (
                            <ChevronUpIcon className="w-5 h-5" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-white">{lead.name}</td>
                        <td className="px-6 py-4 text-[#ADB7BE]">{lead.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs rounded-full bg-[#ffb700]/20 text-[#ffb700]">{lead.source}</span>
                        </td>
                        <td className="px-6 py-4 text-[#ADB7BE] text-sm">{new Date(lead.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-[#ADB7BE] text-sm max-w-md">
                          {lead.type === 'form' && lead.message ? (
                            <span className="whitespace-pre-wrap block">{lead.message}</span>
                          ) : lead.type === 'onboarding' ? (
                            <span className="text-[#888]">
                              {(() => {
                                const parts = [lead.fullData?.goals, lead.fullData?.current_challenges].filter(Boolean);
                                const text = parts.join(' ΓÇó ');
                                return text ? (text.length > 120 ? text.slice(0, 120) + 'ΓÇª' : text) : 'ΓÇö';
                              })()}
                            </span>
                          ) : (
                            <span className="text-[#666]">ΓÇö</span>
                          )}
                        </td>
                      </tr>
                      <AnimatePresence>
                        {expandedId === lead.rowKey && (
                          <tr key={`${lead.rowKey}-expanded`} className="border-b border-[#222]/50 bg-[#0a0a0a]/80">
                            <td colSpan={6} className="px-6 py-4">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="rounded-lg border border-[#333] bg-[#111] p-4 text-sm">
                                  <div className="text-[#ADB7BE] mb-2 font-medium">Full message & data</div>
                                  {lead.type === 'form' && lead.message ? (
                                    <div className="mb-4">
                                      <div className="text-[#ADB7BE] text-xs uppercase mb-1">Message</div>
                                      <pre className="whitespace-pre-wrap text-white font-sans break-words">{lead.message}</pre>
                                    </div>
                                  ) : null}
                                  <div className="text-[#ADB7BE] text-xs uppercase mb-1">All fields</div>
                                  <pre className="whitespace-pre-wrap text-[#ccc] font-mono text-xs break-words overflow-x-auto">
                                    {JSON.stringify(lead.fullData, null, 2)}
                                  </pre>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
        </Container>
      </Section>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-6 bg-[#1a1a1a]/50 border border-[#222] rounded-xl">
      <div className="text-[#ffb700] mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-[#ADB7BE]">{label}</div>
    </div>
  );
}
