'use client';

import { useEffect, useState } from 'react';
import { Section } from '../../components/ui/Section';
import { Container } from '../../components/ui/Container';
import PortalHeader from '../components/PortalHeader';

const TYPE_LABELS = {
  contract: 'Contract',
  proposal: 'Proposal',
  report: 'Report',
  invoice: 'Invoice',
  general: 'General',
};

const TYPE_CLASSES = {
  contract: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  proposal: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  report: 'bg-[#ffb700]/15 text-[#ffb700] border-[#ffb700]/30',
  invoice: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  general: 'bg-[#222] text-[#ADB7BE] border-[#333]',
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [meRes, docsRes] = await Promise.all([
          fetch('/api/auth/check', { credentials: 'include' }),
          fetch('/api/portal/documents', { credentials: 'include' }),
        ]);
        const meData = await meRes.json().catch(() => ({}));
        if (!meData.loggedIn) {
          window.location.href = '/login?callbackUrl=/portal/documents';
          return;
        }
        setMe(meData);
        if (!docsRes.ok) {
          const err = await docsRes.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to load documents');
        }
        const docsData = await docsRes.json();
        setDocs(docsData.documents || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`/api/portal/documents/download?id=${encodeURIComponent(id)}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Download failed');
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <PortalHeader email={me?.email} fullName={me?.fullName} />
      <Section>
        <Container size="wide" className="py-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Documents</h1>
            <p className="text-[#ADB7BE] mt-2 text-sm">
              Contracts, proposals, monthly reports and invoices shared by your account manager.
            </p>
          </div>

          <div className="bg-[#1a1a1a]/50 border border-[#222] rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-[#ADB7BE]">Loading...</div>
            ) : error ? (
              <div className="p-12 text-center text-red-400">{error}</div>
            ) : docs.length === 0 ? (
              <div className="p-12 text-center text-[#ADB7BE]">
                No documents yet. Anything your team shares will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#222]">
                      <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Type</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Uploaded</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-[#ADB7BE] uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => (
                      <tr key={d.id} className="border-b border-[#222]/50 hover:bg-[#222]/20">
                        <td className="px-6 py-4 text-white">{d.file_name}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs rounded-full border ${TYPE_CLASSES[d.doc_type] || TYPE_CLASSES.general}`}
                          >
                            {TYPE_LABELS[d.doc_type] || d.doc_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#ADB7BE] text-sm">
                          {new Date(d.uploaded_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDownload(d.id)}
                            className="px-3 py-1.5 text-sm bg-[#ffb700] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#e6a600] transition"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}
