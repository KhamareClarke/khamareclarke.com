import { redirect } from 'next/navigation';
import { getSessionAndProfile } from '@/lib/supabase-server';
import { getClientGHLData } from '@/lib/ghl';
import { Section } from '../components/ui/Section';
import { Container } from '../components/ui/Container';
import PortalHeader from './components/PortalHeader';

export const dynamic = 'force-dynamic';

/**
 * Client portal dashboard (server component).
 * Fetches the logged-in user's profile + their projects.
 * If GHL_API_KEY + client_projects.ghl_contact_id are set, augments each
 * card with pipeline stage + next appointment; otherwise shows a placeholder chip.
 */
export default async function PortalDashboardPage() {
  const { user, profile, supabase } = await getSessionAndProfile();
  if (!user || !supabase) redirect('/login?callbackUrl=/portal');

  // Fetch this user's projects (RLS restricts to their own rows).
  const { data: projects = [] } = await supabase
    .from('client_projects')
    .select('id, project_name, status, tier, ghl_contact_id, notes, created_at, updated_at')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch GHL data per project in parallel — graceful degradation.
  const projectsWithGHL = await Promise.all(
    (projects || []).map(async (p) => {
      if (!p.ghl_contact_id) return { ...p, ghl: null };
      try {
        const ghl = await getClientGHLData(p.ghl_contact_id);
        return { ...p, ghl };
      } catch {
        return { ...p, ghl: null };
      }
    })
  );

  const displayName = profile?.full_name || user.email;
  const company = profile?.company;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <PortalHeader email={user.email} fullName={profile?.full_name} />

      <Section>
        <Container size="wide" className="py-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, {displayName}
            </h1>
            {company && (
              <p className="text-[#ADB7BE] mt-1">{company}</p>
            )}
            <p className="text-[#ADB7BE] mt-2 text-sm">
              Here&rsquo;s the latest on your projects with Khamare Clarke.
            </p>
          </div>

          {/* Project cards */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">Your projects</h2>
            {projectsWithGHL.length === 0 ? (
              <div className="p-8 bg-[#1a1a1a]/50 border border-[#222] rounded-xl text-[#ADB7BE]">
                <p>No projects yet. Once your account manager sets up a project, it will appear here.</p>
                <p className="mt-2 text-sm">
                  In the meantime, please{' '}
                  <a href="/portal/onboarding" className="text-[#ffb700] hover:underline">
                    complete your intake form
                  </a>{' '}
                  so we can plan the next step.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectsWithGHL.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </section>

          {/* Next steps */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Next steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CtaTile
                href="/portal/documents"
                title="View documents"
                desc="Contracts, proposals, monthly reports."
              />
              <CtaTile
                href="/portal/onboarding"
                title="Update your intake"
                desc="Keep your business info up to date."
              />
              <CtaTile
                href="mailto:hello@khamareclarke.com"
                title="Contact us"
                desc="Email your account manager directly."
              />
            </div>
          </section>
        </Container>
      </Section>
    </main>
  );
}

function StatusPill({ status }) {
  const map = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    paused: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    completed: 'bg-[#ffb700]/15 text-[#ffb700] border-[#ffb700]/30',
  };
  const cls = map[status] || 'bg-[#222] text-[#ADB7BE] border-[#333]';
  return (
    <span className={`inline-block px-2 py-0.5 text-xs rounded-full border ${cls}`}>
      {status}
    </span>
  );
}

function ProjectCard({ project }) {
  const ghl = project.ghl;
  const stage = ghl?.opportunities?.[0]?.pipelineStageName || ghl?.opportunities?.[0]?.stage;
  const nextAppt = ghl?.appointments?.[0];
  const lastActivity = ghl?.contact?.dateUpdated;
  const daysSince = lastActivity
    ? Math.max(0, Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="p-6 bg-[#1a1a1a]/70 border border-[#222] rounded-xl">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-white font-semibold">{project.project_name}</h3>
          {project.tier && (
            <p className="text-xs text-[#ADB7BE] mt-0.5">Tier: {project.tier}</p>
          )}
        </div>
        <StatusPill status={project.status} />
      </div>

      {project.notes && (
        <p className="text-sm text-[#ADB7BE] mb-3 whitespace-pre-wrap">{project.notes}</p>
      )}

      <div className="mt-4 pt-4 border-t border-[#222] space-y-2 text-sm">
        {ghl ? (
          <>
            {stage && (
              <div className="flex justify-between">
                <span className="text-[#ADB7BE]">Pipeline stage</span>
                <span className="text-white">{stage}</span>
              </div>
            )}
            {nextAppt && (
              <div className="flex justify-between">
                <span className="text-[#ADB7BE]">Next appointment</span>
                <span className="text-white">
                  {new Date(nextAppt.startTime || nextAppt.start_time).toLocaleString()}
                </span>
              </div>
            )}
            {daysSince !== null && (
              <div className="flex justify-between">
                <span className="text-[#ADB7BE]">Days since last activity</span>
                <span className="text-white">{daysSince}</span>
              </div>
            )}
            {!stage && !nextAppt && daysSince === null && (
              <span className="text-xs text-[#666]">No live GHL data available yet.</span>
            )}
          </>
        ) : (
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#222] text-[#ADB7BE] border border-[#333]">
            Connect GoHighLevel to see live status
          </span>
        )}
      </div>
    </div>
  );
}

function CtaTile({ href, title, desc }) {
  return (
    <a
      href={href}
      className="block p-6 bg-[#ffb700]/5 border border-[#ffb700]/20 rounded-xl hover:bg-[#ffb700]/10 hover:border-[#ffb700]/40 transition"
    >
      <div className="text-white font-semibold mb-1">{title}</div>
      <div className="text-sm text-[#ADB7BE]">{desc}</div>
    </a>
  );
}
