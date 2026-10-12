import PageShell from "../components/PageShell";
import PageHero from "../components/ui/PageHero";
import SectionHeading from "../components/ui/SectionHeading";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";

// Metadata is untouched by this migration — title, description, canonical and OG all
// stay exactly as they were. A design change must never move a page's search identity.
export const metadata = {
  title: "Privacy Policy | Khamare Clarke",
  description: "How Khamare Clarke collects, uses, and protects your personal data. UK GDPR compliant.",
  alternates: { canonical: "https://khamareclarke.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Khamare Clarke",
    description: "How Khamare Clarke collects, uses, and protects your personal data.",
    url: "https://khamareclarke.com/privacy-policy",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "website",
  },
};

const notDone = [
  "Your data is not sold to any third party.",
  "Your data is not shared with advertisers.",
  "You will not be added to a marketing list without your explicit consent.",
];

const processors = [
  { name: "LeadConnector / GoHighLevel", detail: "booking and CRM" },
  { name: "Google Analytics 4", detail: "anonymised usage analytics" },
  { name: "Vercel", detail: "website hosting (data processed in transit)" },
];

const rights = [
  "Access the personal data held about you",
  "Request correction of inaccurate data",
  "Request deletion of your data",
  "Object to processing based on legitimate interest",
  "Request restriction of processing",
];

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">
          {/* size="compact" — see the note in terms/page.js: a short page title on a
              legal page is not a display title, so it does not take the hero scale. */}
          <PageHero eyebrow="Legal" size="compact" title="Privacy Policy" />

          <p className="reveal text-muted text-sm mt-6" style={{ "--rv-delay": "260ms" }}>
            Last updated: July 2025
          </p>

          <div className="mt-16 space-y-10 text-muted leading-relaxed">

            <section aria-labelledby="privacy-covers">
              <SectionHeading id="privacy-covers">Who this covers</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                This policy covers how Khamare Clarke (trading as an individual SEO and AI systems consultant,
                based in Stoke-on-Trent, England) handles personal data collected through khamareclarke.com.
                Contact: <a href="mailto:info@khamareclarke.com" className="text-primary hover:underline">info@khamareclarke.com</a>.
              </p>
            </section>

            <section aria-labelledby="privacy-collected">
              <SectionHeading id="privacy-collected">What data is collected and why</SectionHeading>

              <h3 className="text-base font-semibold text-white/90 mb-2 mt-5">Contact form</h3>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                When you submit the contact or enquiry form, your name, email address, phone number, and message
                are collected. This data is used solely to respond to your enquiry. The legal basis is legitimate
                interest: you have initiated contact about a potential business relationship.
              </p>

              <h3 className="text-base font-semibold text-white/90 mb-2 mt-5">Booking</h3>
              <p className="reveal" style={{ "--rv-delay": "280ms" }}>
                Strategy call bookings are handled through LeadConnector (GoHighLevel). When you book, your
                data is processed by LeadConnector under their own privacy policy. Booking data is used to
                schedule and follow up on your call.
              </p>

              <h3 className="text-base font-semibold text-white/90 mb-2 mt-5">Analytics</h3>
              <p className="reveal" style={{ "--rv-delay": "360ms" }}>
                Google Analytics 4 is used to understand how visitors use the site (pages viewed, time on site,
                general location, device type). IP addresses are anonymised. No cross-site tracking is performed.
                The legal basis is legitimate interest in understanding site performance.
              </p>
            </section>

            <section aria-labelledby="privacy-not-done">
              <SectionHeading id="privacy-not-done">What is not done with your data</SectionHeading>
              <ul className="list-disc list-inside space-y-1 text-muted">
                {notDone.map((item, index) => (
                  <li key={item} className="reveal" style={{ "--rv-delay": `${index * 90}ms` }}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="privacy-processors">
              <SectionHeading id="privacy-processors">Third-party processors</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>The following services process data as part of operating this site:</p>
              <ul className="list-disc list-inside space-y-1 text-muted mt-2">
                {processors.map((processor, index) => (
                  <li key={processor.name} className="reveal" style={{ "--rv-delay": `${index * 90}ms` }}>
                    <strong className="text-white">{processor.name}</strong> — {processor.detail}
                  </li>
                ))}
              </ul>
              <p className="reveal mt-3" style={{ "--rv-delay": "280ms" }}>
                Each processor operates under their own terms and privacy policies, which apply to data they hold.
              </p>
            </section>

            <section aria-labelledby="privacy-retention">
              <SectionHeading id="privacy-retention">How long data is kept</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                Enquiry and contact data is retained for as long as there is an active business relationship or
                ongoing correspondence, and for up to two years after the last contact. Analytics data is retained
                at the default GA4 retention period (14 months).
              </p>
            </section>

            <section aria-labelledby="privacy-rights">
              <SectionHeading id="privacy-rights">
                Your rights under <span className="gold-text">UK GDPR</span>
              </SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted mt-2">
                {rights.map((item, index) => (
                  <li key={item} className="reveal" style={{ "--rv-delay": `${index * 90}ms` }}>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="reveal mt-3" style={{ "--rv-delay": "280ms" }}>
                To exercise any of these rights, email{" "}
                <a href="mailto:info@khamareclarke.com" className="text-primary hover:underline">info@khamareclarke.com</a>.
                Requests will be responded to within 30 days.
              </p>
            </section>

            <section aria-labelledby="privacy-cookies">
              <SectionHeading id="privacy-cookies">Cookies</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                This site uses cookies for analytics (Google Analytics 4). No advertising or tracking cookies
                are set beyond this. You can disable cookies in your browser settings at any time.
              </p>
            </section>

            <section aria-labelledby="privacy-changes">
              <SectionHeading id="privacy-changes">Changes to this policy</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                If this policy changes materially, the "last updated" date above will be revised. Continued use
                of the site after a change constitutes acceptance of the updated policy.
              </p>
            </section>

            <section aria-labelledby="privacy-contact">
              <SectionHeading id="privacy-contact">Contact</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                For any privacy-related question or request:{" "}
                <a href="mailto:info@khamareclarke.com" className="text-primary hover:underline">info@khamareclarke.com</a>
              </p>
              <p className="reveal mt-2" style={{ "--rv-delay": "280ms" }}>
                You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO)
                at <span className="text-white/60">ico.org.uk</span> if you believe your data has been handled unlawfully.
              </p>
            </section>

          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
