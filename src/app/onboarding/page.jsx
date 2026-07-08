import OnboardingForm from './OnboardingForm';

/**
 * Public onboarding form — lead-gen tool. Anyone can submit; entries land in
 * onboarding_clients (no user_id). Authenticated clients use /portal/onboarding
 * which associates the submission with their user_id.
 */
export default function OnboardingPage() {
  return <OnboardingForm />;
}
