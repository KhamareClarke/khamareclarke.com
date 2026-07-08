import { redirect } from 'next/navigation';
import OnboardingForm from './OnboardingForm';

// Interim token gate: share the link as /onboarding?token=<ONBOARDING_TOKEN>
// Replace with Supabase Auth invite flow in the portal rebuild.
export default function OnboardingPage({ searchParams }) {
  const expected = process.env.ONBOARDING_TOKEN;
  if (expected) {
    const provided = searchParams?.token;
    if (provided !== expected) redirect('/');
  }
  return <OnboardingForm />;
}
