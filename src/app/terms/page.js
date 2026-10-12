import PageShell from "../components/PageShell";
import PageHero from "../components/ui/PageHero";
import SectionHeading from "../components/ui/SectionHeading";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";

// Metadata is untouched by this migration — title, description, canonical and OG all
// stay exactly as they were. A design change must never move a page's search identity.
export const metadata = {
  title: "Terms of Service | Khamare Clarke",
  description: "Terms governing services provided by Khamare Clarke: SEO, AI search, and digital systems.",
  alternates: { canonical: "https://khamareclarke.com/terms" },
  openGraph: {
    title: "Terms of Service | Khamare Clarke",
    description: "Terms governing services provided by Khamare Clarke.",
    url: "https://khamareclarke.com/terms",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <PageShell>
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">
          <PageHero eyebrow="Legal" title="Terms of Service" />

          <p className="reveal text-muted text-sm mt-6" style={{ "--rv-delay": "260ms" }}>
            Last updated: July 2025
          </p>

          <div className="mt-16 space-y-10 text-muted leading-relaxed">

            <section aria-labelledby="terms-applies">
              <SectionHeading id="terms-applies">Who these terms apply to</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                These terms govern services provided by Khamare Clarke (individual consultant, Stoke-on-Trent,
                England) to clients who have agreed to a service engagement. By engaging Khamare Clarke, you
                accept these terms. Questions:{" "}
                <a href="mailto:info@khamareclarke.com" className="text-primary hover:underline">info@khamareclarke.com</a>.
              </p>
            </section>

            <section aria-labelledby="terms-services">
              <SectionHeading id="terms-services">Services</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                Services include but are not limited to: local SEO, AI search optimisation, Google Business
                Profile management, AI receptionist and lead response systems, Google Ads management, website
                development, and CRM and email marketing. The exact scope of each engagement is confirmed in a
                written agreement before work begins.
              </p>
            </section>

            <section aria-labelledby="terms-payment">
              <SectionHeading id="terms-payment">Contract terms and payment</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                <strong className="text-white">Get Found</strong> packages operate on a rolling monthly basis
                from day one. <strong className="text-white">Run The Area</strong> and{" "}
                <strong className="text-white">Own The Market</strong> packages have a six-month initial term,
                after which they continue on a rolling monthly basis. Prices shown on this site are starting
                prices; the exact figure for your engagement is confirmed in your quote.
              </p>
              <p className="reveal mt-3" style={{ "--rv-delay": "280ms" }}>
                Payment terms, invoicing schedules, and cancellation conditions are set out in the individual
                client agreement. Invoices are due on the date stated. Late payment may result in work being
                paused until the account is settled.
              </p>
            </section>

            <section aria-labelledby="terms-guarantee">
              <SectionHeading id="terms-guarantee">
                The ranked-or-refunded <span className="gold-text">guarantee</span>
              </SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                The guarantee referenced on this site applies where explicitly included in the written client
                agreement. The full conditions, qualifying criteria, timeframes, and remedy are set out in that
                agreement. The guarantee does not apply to services not explicitly covered, to results outside
                agreed scope, or where a client has not fulfilled their obligations (such as providing required
                access, content, or approvals).
              </p>
            </section>

            <section aria-labelledby="terms-responsibilities">
              <SectionHeading id="terms-responsibilities">Client responsibilities</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                You agree to provide timely access, logins, content, and approvals as reasonably required.
                Delays caused by your side may affect timelines. You are responsible for ensuring that any
                information or assets you provide do not infringe third-party rights.
              </p>
            </section>

            <section aria-labelledby="terms-ip">
              <SectionHeading id="terms-ip">Intellectual property</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                Content, strategies, and systems created during an engagement remain the property of Khamare
                Clarke until full payment is received, at which point ownership of deliverables agreed in
                writing transfers to you. This does not include underlying tools, frameworks, or proprietary
                systems developed independently. Websites built as part of a package are transferred to client
                ownership on completion of the agreed term, as stated in the individual agreement.
              </p>
            </section>

            <section aria-labelledby="terms-liability">
              <SectionHeading id="terms-liability">Results and liability</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                SEO, AI search, and digital marketing involve third-party platforms (Google, OpenAI, and others)
                that change their algorithms and policies. Outcomes cannot be guaranteed beyond what is explicitly
                stated in a signed agreement. Khamare Clarke is not liable for algorithm changes, platform policy
                updates, or factors outside direct control.
              </p>
              <p className="reveal mt-3" style={{ "--rv-delay": "280ms" }}>
                Liability is limited to the total fees paid in the three months preceding any claim. Khamare
                Clarke is not liable for indirect or consequential losses (lost revenue, lost contracts, lost
                data) arising from the services or the use of this website.
              </p>
            </section>

            <section aria-labelledby="terms-confidentiality">
              <SectionHeading id="terms-confidentiality">Confidentiality</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                Both parties agree to keep confidential any non-public information shared during the engagement.
                This does not prevent Khamare Clarke from using anonymised results or metrics in case studies,
                unless the client has requested otherwise in writing.
              </p>
            </section>

            <section aria-labelledby="terms-termination">
              <SectionHeading id="terms-termination">Termination</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                Either party may terminate a rolling monthly engagement by giving notice as specified in the
                client agreement (typically 30 days). Fixed-term agreements (six-month initial terms) may be
                terminated early only as stated in the agreement. Fees accrued up to the termination date remain
                payable.
              </p>
            </section>

            <section aria-labelledby="terms-law">
              <SectionHeading id="terms-law">Governing law</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                These terms and any disputes arising from them are governed by the law of England and Wales.
                Both parties agree to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section aria-labelledby="terms-changes">
              <SectionHeading id="terms-changes">Changes to these terms</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                These terms may be updated from time to time. The version in force at the time your engagement
                begins is the one that applies to that engagement, unless both parties agree in writing to adopt
                a later version.
              </p>
            </section>

            <section aria-labelledby="terms-contact">
              <SectionHeading id="terms-contact">Contact</SectionHeading>
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                <a href="mailto:info@khamareclarke.com" className="text-primary hover:underline">info@khamareclarke.com</a>
              </p>
            </section>

          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
