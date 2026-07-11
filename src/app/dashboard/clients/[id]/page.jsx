'use client';

import { use, useEffect, useState } from 'react';
import { Section } from '../../../components/ui/Section';
import { Container } from '../../../components/ui/Container';

const STATUS_OPTIONS = ['active', 'paused', 'completed'];
const DOC_TYPES = ['general', 'contract', 'proposal', 'report', 'invoice'];

export default function ClientDetailPage({ params }) {
  const { id } = use(params);

  const [data, setData] = useState(null);
  const [ghl, setGhl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newProject, setNewProject] = useState({ project_name: '', tier: '', ghl_contact_id: '', notes: '' });
  const [creating, setCreating] = useState(false);

  const [uploadState, setUploadState] = useState(null);

  const load = async () => {
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { credentials: 'include' });
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/login?callbackUrl=/dashboard/clients/' + id;
        return;
      }
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      setData(d);

      // Fetch GHL data for the first project (if any).
      const projectWithGhl = (d.projects || []).find((p) => p.ghl_contact_id);
      if (projectWithGhl) {
        try {
          const gRes = await fetch(`/api/admin/ghl?contactId=${encodeURIComponent(projectWithGhl.ghl_contact_id)}`, {
            credentials: 'include',
          });
          if (gRes.ok) {
            const gData = await gRes.json();
            setGhl(gData);
          }
        } catch {}
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: id,
          project_name: newProject.project_name,
          tier: newProject.tier || null,
          ghl_contact_id: newProject.ghl_contact_id || null,
          notes: newProject.notes || null,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      setNewProject({ project_name: '', tier: '', ghl_contact_id: '', notes: '' });
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (projectId, status) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId, status }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed');
      }
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.append('client_id', id);
    setUploadState('uploading');
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Upload failed');
      setUploadState('done');
      form.reset();
      setTimeout(() => setUploadState(null), 3000);
      load();
    } catch (err) {
      setUploadState({ error: err.message });
    }
  };

  const handleGenerateReport = async (projectId) => {
    if (!confirm('Generate a monthly client report? This may take up to 60 seconds.')) return;
    try {
      const res = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: id, project_id: projectId }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      alert('Report generated.');
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-[#ffb700]">
        Loading…
      </main>
    );
  }
  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-red-400">
        {error || 'Not found'}
      </main>
    );
  }

  const c = data.client;
  const projects = data.projects || [];
  const documents = data.documents || [];
  const onboarding = data.onboarding || [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <header className="border-b border-[#222] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-10">
        <Container size="wide" className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard/clients" className="text-sm text-[#ADB7BE] hover:text-[#ffb700]">← Clients</a>
            <h1 className="text-xl font-bold text-white">{c.full_name || c.email}</h1>
          </div>
        </Container>
      </header>

      <Section>
        <Container size="wide" className="py-8 space-y-8">
          {/* Profile */}
          <section className="p-6 bg-[#1a1a1a]/50 border border-[#222] rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-3">Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <Field label="Full name" value={c.full_name} />
              <Field label="Company" value={c.company} />
              <Field label="Email" value={c.email} />
              <Field label="Role" value={c.role} />
              <Field label="Client since" value={c.created_at ? new Date(c.created_at).toLocaleDateString() : null} />
              <Field label="User ID" value={c.id} mono />
            </div>
          </section>

          {/* GHL Panel */}
          {ghl && (
            <section className="p-6 bg-[#1a1a1a]/50 border border-[#222] rounded-xl">
              <h2 className="text-lg font-semibold text-white mb-3">GoHighLevel</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <Field label="Pipeline stage" value={ghl?.opportunities?.[0]?.pipelineStageName || ghl?.opportunities?.[0]?.stage} />
                <Field
                  label="Next appointment"
                  value={
                    ghl?.appointments?.[0]
                      ? new Date(ghl.appointments[0].startTime || ghl.appointments[0].start_time).toLocaleString()
                      : null
                  }
                />
                <Field label="Contact source" value={ghl?.contact?.source} />
              </div>
            </section>
          )}

          {/* Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Projects</h2>
            </div>
            {projects.length === 0 ? (
              <div className="p-6 bg-[#1a1a1a]/50 border border-[#222] rounded-xl text-[#ADB7BE] text-sm mb-6">
                No projects yet.
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {projects.map((p) => (
                  <div key={p.id} className="p-4 bg-[#1a1a1a]/50 border border-[#222] rounded-xl">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="text-white font-semibold">{p.project_name}</div>
                        <div className="text-xs text-[#ADB7BE] mt-0.5">
                          Tier: {p.tier || '—'} · GHL: {p.ghl_contact_id || '—'}
                        </div>
                      </div>
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className="px-2 py-1 bg-[#0a0a0a] border border-[#333] rounded text-white text-xs"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    {p.notes && (
                      <p className="text-sm text-[#ADB7BE] mt-2 whitespace-pre-wrap">{p.notes}</p>
                    )}
                    {p.last_report_at && (
                      <div className="mt-3 pt-3 border-t border-[#222]">
                        <div className="text-xs text-[#ADB7BE] mb-1">
                          Last report: {new Date(p.last_report_at).toLocaleString()}
                        </div>
                        {p.last_report_text && (
                          <pre className="text-xs text-[#ccc] whitespace-pre-wrap font-sans">{p.last_report_text}</pre>
                        )}
                      </div>
                    )}
                    <div className="mt-3">
                      <button
                        onClick={() => handleGenerateReport(p.id)}
                        className="text-xs text-[#ffb700] hover:underline"
                      >
                        Generate monthly report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <details className="p-4 bg-[#1a1a1a]/50 border border-[#222] rounded-xl">
              <summary className="cursor-pointer text-sm text-[#ffb700]">+ Create project</summary>
              <form onSubmit={handleCreateProject} className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProject.project_name}
                  onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Tier (e.g. Growth)"
                    value={newProject.tier}
                    onChange={(e) => setNewProject({ ...newProject, tier: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm"
                  />
                  <input
                    type="text"
                    placeholder="GHL contact id"
                    value={newProject.ghl_contact_id}
                    onChange={(e) => setNewProject({ ...newProject, ghl_contact_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm"
                  />
                </div>
                <textarea
                  placeholder="Notes"
                  value={newProject.notes}
                  onChange={(e) => setNewProject({ ...newProject, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm"
                />
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-[#ffb700] text-[#0a0a0a] font-semibold rounded text-sm disabled:opacity-50"
                >
                  {creating ? 'Creating…' : 'Create project'}
                </button>
              </form>
            </details>
          </section>

          {/* Documents */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[#1a1a1a]/50 border border-[#222] rounded-xl overflow-hidden">
                {documents.length === 0 ? (
                  <div className="p-6 text-center text-[#ADB7BE] text-sm">No documents yet.</div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#222]">
                        <th className="text-left px-4 py-2 text-xs text-[#ADB7BE] uppercase">Name</th>
                        <th className="text-left px-4 py-2 text-xs text-[#ADB7BE] uppercase">Type</th>
                        <th className="text-left px-4 py-2 text-xs text-[#ADB7BE] uppercase">Uploaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((d) => (
                        <tr key={d.id} className="border-b border-[#222]/50">
                          <td className="px-4 py-2 text-white text-sm">{d.file_name}</td>
                          <td className="px-4 py-2 text-[#ADB7BE] text-sm">{d.doc_type}</td>
                          <td className="px-4 py-2 text-[#ADB7BE] text-sm">
                            {new Date(d.uploaded_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <form onSubmit={handleUpload} className="p-4 bg-[#1a1a1a]/50 border border-[#222] rounded-xl space-y-3">
                <h3 className="text-white font-semibold">Upload document</h3>
                <div>
                  <label className="block text-xs text-[#ADB7BE] mb-1">Type</label>
                  <select
                    name="doc_type"
                    defaultValue="general"
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded text-white text-sm"
                  >
                    {DOC_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#ADB7BE] mb-1">File</label>
                  <input
                    type="file"
                    name="file"
                    required
                    className="w-full text-[#ADB7BE] text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploadState === 'uploading'}
                  className="w-full py-2 bg-[#ffb700] text-[#0a0a0a] font-semibold rounded text-sm disabled:opacity-50"
                >
                  {uploadState === 'uploading' ? 'Uploading…' : 'Upload'}
                </button>
                {uploadState === 'done' && (
                  <p className="text-xs text-emerald-400">Uploaded.</p>
                )}
                {uploadState?.error && (
                  <p className="text-xs text-red-400">{uploadState.error}</p>
                )}
              </form>
            </div>
          </section>

          {/* Onboarding history */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Onboarding submissions</h2>
            {onboarding.length === 0 ? (
              <div className="p-6 bg-[#1a1a1a]/50 border border-[#222] rounded-xl text-[#ADB7BE] text-sm">
                No onboarding submissions.
              </div>
            ) : (
              <div className="space-y-3">
                {onboarding.map((o) => (
                  <details key={o.id || o.created_at} className="p-4 bg-[#1a1a1a]/50 border border-[#222] rounded-xl">
                    <summary className="cursor-pointer text-sm text-white">
                      {new Date(o.created_at).toLocaleString()} — {o.company_name || o.contact_name || o.email}
                    </summary>
                    <pre className="text-xs text-[#ccc] whitespace-pre-wrap font-mono mt-3">
                      {JSON.stringify(o, null, 2)}
                    </pre>
                  </details>
                ))}
              </div>
            )}
          </section>
        </Container>
      </Section>
    </main>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <div className="text-xs text-[#ADB7BE] uppercase mb-1">{label}</div>
      <div className={`text-white ${mono ? 'font-mono text-xs break-all' : ''}`}>
        {value || <span className="text-[#666]">—</span>}
      </div>
    </div>
  );
}
