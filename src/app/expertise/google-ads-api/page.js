// src/app/expertise/google-ads-api/page.js

import Link from "next/link";
import PageShell from "../../components/PageShell";
import PageHero from "../../components/ui/PageHero";
import AchievementsSection from "../../components/AchievementsSection";
import SectionHeading from "../../components/ui/SectionHeading";
import CtaPanel from "../../components/ui/CtaPanel";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import CTAButton from "../../components/CTAButton";

export const metadata = {
  title: "Google Ads API Specialist UK | Khamare Clarke",
  description:
    "Google Ads API management for UK businesses. Programmatic campaign control, custom bidding logic, and automated reporting built by an engineer who understands both the API and the marketing.",
  alternates: {
    canonical: "https://khamareclarke.com/expertise/google-ads-api",
  },
  openGraph: {
    title: "Google Ads API Specialist UK | Khamare Clarke",
    description:
      "Google Ads API management for UK businesses. Programmatic campaign control, custom bidding logic, and automated reporting built by an engineer who understands both the API and the marketing.",
    url: "https://khamareclarke.com/expertise/google-ads-api",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "article",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Google Ads API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Google Ads API is the programmatic interface that allows developers to manage Google Ads accounts directly through code, rather than through the standard web interface. It enables automated campaign creation, bid adjustments, keyword management, reporting, and budget optimisation at a level of speed and precision that is not possible through the standard Google Ads dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "Why does running ads through the API produce better results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The API removes the bottleneck of manual campaign management. Changes that would take hours to implement manually across multiple campaigns and ad groups can be executed in seconds through code. Custom bidding logic can be applied based on business-specific signals — time of day, stock availability, CRM data, weather, competitor activity — that the standard interface cannot access. Reporting can be pulled into any system the business already uses, rather than being locked in the Google Ads dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "How does ads engineering differ from a standard agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A standard agency manages campaigns through the Google Ads interface and applies changes manually. Ads engineering means writing code that manages those campaigns automatically: dynamic keyword insertion drawn from a live product feed, bid modifiers calculated from conversion data at the hour level, automatic budget reallocation between campaigns based on performance thresholds, and custom alerts when anomalies appear. The difference in output compounds over time.",
      },
    },
    {
      "@type": "Question",
      name: "What campaigns benefit most from the Ads API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any campaign with a large and frequently-changing keyword set benefits from API management: e-commerce with broad product ranges, property and recruitment, local services across multiple geographic areas, and any business running simultaneous campaigns across multiple markets. The API is also particularly valuable for lead generation campaigns where conversion data needs to feed back into bidding in near-real-time.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Ads API management cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ads API management covers SEO, AI search optimisation, and paid search engineering together. For businesses that want Ads API management as a standalone service, scoped project work can be discussed based on account size and complexity. Book a strategy call to discuss your current account and what automation would achieve.",
      },
    },
  ],
};

export default function GoogleAdsAPIPage() {
  return (
    <PageShell
      schema={
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        </>
      }
    >
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">
          <PageHero
            eyebrow="Expertise"
            size="compact"
            title={
              <>
                Google Ads via the Ads API{" "}
                <span className="gold-text">
                  — What Ads Engineering Actually Means
                </span>
              </>
            }
          />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            Most agencies manage Google Ads through a dashboard. Ads engineering
            means writing the code that manages it automatically, at a speed and
            precision no manual process can match.
          </p>

        {/* Q1 */}
        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What is the <span className="gold-text">Google Ads API</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              The Google Ads API is the programmatic interface that allows
              developers to manage Google Ads accounts directly through code,
              rather than through the standard web dashboard. It provides access
              to every element of a campaign: keywords, bids, ad copy, audience
              targeting, budget allocation, and performance data — all
              addressable through API calls that can be automated, scheduled,
              and integrated with other data sources.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              Google built the API for agencies and large advertisers who manage
              too much volume to operate manually. In practice, it is
              underused — most agencies do not have engineers on the team. That
              creates an advantage for businesses that do.
            </p>
          </div>
        </section>

        {/* Q2 */}
        <section className="mt-12" aria-labelledby="q2">
          <SectionHeading id="q2">
            Why does running ads through the API <span className="gold-text">produce better results</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              The API removes the bottleneck of manual campaign management.
              Changes that would take hours to implement manually across
              multiple campaigns — adjusting bids by device and time of day,
              pausing underperforming keywords, pushing new ad variations for
              A/B testing — can be executed in seconds through code, running
              on a schedule or triggered by real-time data.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              More importantly, the API allows custom bidding logic that the
              standard interface cannot replicate. Bids can be adjusted based
              on business-specific signals: CRM data showing which customer
              segments convert at the highest value, inventory levels, weather
              data for seasonal businesses, or competitor price changes. The
              standard Google Smart Bidding system does not know about any of
              these factors. Your own code does.
            </p>
          </div>
        </section>

        {/* Q3 */}
        <section className="mt-12" aria-labelledby="q3">
          <SectionHeading id="q3">
            How does <span className="gold-text">ads engineering</span> differ from a standard agency?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              A standard agency manages campaigns through the Google Ads
              interface. Changes are made manually, during business hours, by
              an account manager who is juggling several other accounts at the
              same time. The feedback loop between seeing a performance issue
              and fixing it is measured in days.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              Ads engineering means writing code that manages those campaigns
              automatically: dynamic keyword insertion drawn from a live product
              or service feed, bid modifiers calculated from conversion data at
              the hour level, automatic budget reallocation between campaigns
              based on performance thresholds, and custom alert systems that
              flag anomalies the moment they appear. The output at month six
              is different from what a manually-managed account produces —
              not because of effort, but because of compounding optimisation
              cycles.
            </p>
          </div>
        </section>

        {/* Q4 */}
        <section className="mt-12" aria-labelledby="q4">
          <SectionHeading id="q4">
            What campaigns benefit most from the <span className="gold-text">Ads API</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Any campaign with a large and frequently-changing keyword set
              benefits from API management: e-commerce with broad product
              ranges, property and recruitment, local services across multiple
              geographic areas, and any business running simultaneous campaigns
              across multiple markets or product lines.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              Lead generation campaigns benefit particularly from API
              integration because conversion data — who became a customer, at
              what value, from which keyword — can feed back into the bidding
              model in near-real-time. A standard agency passes conversion
              events from a form submission. An API-connected system can pass
              the full customer lifetime value from the CRM, so the bidding
              model optimises for the customers who actually matter, not just
              the ones who fill in a form.
            </p>
          </div>
        </section>

        {/* Q5 */}
        <section className="mt-12" aria-labelledby="q5">
          <SectionHeading id="q5">
            How much does <span className="gold-text">Ads API management</span> cost?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Ads API management brings together SEO, AI search optimisation,
              and paid search engineering as a single integrated system. When
              SEO and paid search are managed by the same person
              working from the same data, keyword and audience decisions do not
              contradict each other.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              For businesses that want Ads API management as a standalone
              service — for example, an existing client of a full-service agency
              that wants better technical execution on the ads side — scoped
              project work can be discussed based on account size, campaign
              count, and the level of automation required. Book a strategy call
              and bring the current account structure. That is the fastest way
              to get an accurate scope.
            </p>
          </div>
        </section>

        {/* Internal links */}
        <Card as="nav" aria-label="Related expertise" className="reveal mt-16" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/seo", label: "SEO specialist — what a specialist does" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation — AEO and GEO" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO" },
              { href: "/expertise/ai-agents", label: "AI agents for UK businesses" },
              { href: "/about", label: "About Khamare Clarke" },
            ].map((l, index) => (
              <li key={l.href} className="reveal" style={{ "--rv-delay": `${index * 90}ms` }}>
                <Link href={l.href} className="text-muted hover:gold-text transition-colors flex items-center gap-2 text-sm">
                  <span className="gold-text">→</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* CTA */}
        <CtaPanel headingLevel="h2"
          className="mt-12"
          heading={
            <>
              Want better performance from your <span className="gold-text">Google Ads spend?</span>
            </>
          }
          body="Book a free 30-minute strategy call. Bring your current account and spend data. We will identify where the inefficiencies are and what API-level automation would change."
        >
          <CTAButton eventLabel="expertise_google_ads_cta" caption="The ad account, and what's being wasted.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
