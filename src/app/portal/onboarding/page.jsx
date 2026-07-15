import { redirect } from 'next/navigation';
import { getSessionAndProfile } from '@/lib/supabase-server';
import OnboardingForm from '../../onboarding/OnboardingForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Authenticated onboarding for logged-in portal clients.
 * Reuses the public OnboardingForm but POSTs to /api/portal/onboarding,
 * which stamps the submission with the user's Supabase user_id.
 */
export default async function PortalOnboardingPage() {
  const { user, profile, supabase } = await getSessionAndProfile();
  if (!user || !supabase) redirect('/login?callbackUrl=/portal/onboarding');

  // Prefill with the most recent submission for this user (if any).
  let initialData = null;
  try {
    const { data: rows } = await supabase
      .from('onboarding_clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    const last = rows && rows[0];
    if (last) {
      initialData = {
        contactName: last.contact_name || profile?.full_name || '',
        email: last.email || user.email || '',
        phone: last.phone || '',
        companyName: last.company_name || profile?.company || '',
        website: last.website || '',
        businessType: last.business_type || '',
        industry: last.industry || '',
        currentChallenges: last.current_challenges || '',
        goals: last.goals || '',
        timeline: last.timeline || '',
        budget: last.budget || '',
      };
    }
  } catch {
    // ignore prefetch failure
  }

  if (!initialData) {
    initialData = {
      contactName: profile?.full_name || '',
      email: user.email || '',
      companyName: profile?.company || '',
    };
  }

  return (
    <OnboardingForm
      userId={user.id}
      endpoint="/api/portal/onboarding"
      initialData={initialData}
      successHref="/portal"
      successLabel="Back to Portal"
    />
  );
}
