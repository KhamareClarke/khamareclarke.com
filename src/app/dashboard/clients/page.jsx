'use client';

import { useEffect, useState } from 'react';
import { Section } from '../../components/ui/Section';
import { Container } from '../../components/ui/Container';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFullName, setInviteFullName] = useState('');
  const [inviteCompany, setInviteCompany] = useState('');
  const [inviteState, setInviteState] = useState(null);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/clients', { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/login?callbackUrl=/dashboard/clients';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setClients(data.clients || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteState('sending');
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          fullName: inviteFullName || null,
          company: inviteCompany || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invite failed');
      setInviteState('sent');
      setInviteEmail('');
      setInviteFullName('');
      setInviteCompany('');
      setTimeout(() => setInviteState(null), 3000);
      load();
    } catch (e) {
      setInviteState({ error: e.message });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <header className="border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
        <Container size="wide" className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="text-xl font-bold text-white">Control Centre</a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/dashboard" className="text-[#ADB7BE] hover:text-[#ffb700]">Leads</a>
              <a href="/dashboard/clients" className="text-[#ffb700]">Clients</a>
              <a href="/dashboard/empire" className="text-[#ADB7BE] hover:text-[#ffb700]">Empire OS</a>
            </nav>
          </div>
        </Container>
      </header>

      <Section>
        <Container size="wide" className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold text-white mb-4">Clients</h1>

              <div className="bg-[#1a1a1a]/50 border border-[#222] rounded-xl overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-[#ADB7BE]">Loading...</div>
                ) : error ? (
                  <div className="p-12 text-center text-red-400">{error}</div>
                ) : clients.length === 0 ? (
                  <div className="p-12 text-center text-[#ADB7BE]">
                    No clients yet. Invite one to get started.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#222]">
                          <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Name</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Company</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Email</th>
                          <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Projects</th>
                          <th className="text-right px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((c) => (
                          <tr key={c.id} className="border-b border-[#222]/50 hover:bg-[#222]/20">
                            <td className="px-6 py-4 text-white">{c.full_name || '—'}</td>
                            <td className="px-6 py-4 text-[#ADB7BE]">{c.company || '—'}</td>
                            <td className="px-6 py-4 text-[#ADB7BE]">{c.email || '—'}</td>
                            <td className="px-6 py-4 text-[#ADB7BE]">{c.project_count}</td>
                            <td className="px-6 py-4 text-right">
                              <a
                                href={`/dashboard/clients/${c.id}`}
                                className="text-[#ffb700] hover:underline text-sm"
                              >
                                View →
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Invite a client</h2>
              <form
                onSubmit={handleInvite}
                className="p-6 bg-[#1a1a1a]/50 border border-[#222] rounded-xl space-y-4"
              >
                <div>
                  <label className="block text-xs text-[#ADB7BE] mb-1">Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#ffb700]/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#ADB7BE] mb-1">Full name (optional)</label>
                  <input
                    type="text"
                    value={inviteFullName}
                    onChange={(e) => setInviteFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#ffb700]/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#ADB7BE] mb-1">Company (optional)</label>
                  <input
                    type="text"
                    value={inviteCompany}
                    onChange={(e) => setInviteCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#ffb700]/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={inviteState === 'sending'}
                  className="w-full py-2 bg-[#ffb700] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#e6a600] transition disabled:opacity-50"
                >
                  {inviteState === 'sending' ? 'Sending…' : 'Send invite'}
                </button>
                {inviteState === 'sent' && (
                  <p className="text-sm text-emerald-400">Invite sent.</p>
                )}
                {inviteState?.error && (
                  <p className="text-sm text-red-400">{inviteState.error}</p>
                )}
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
