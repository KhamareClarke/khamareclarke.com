// src/app/about/page.js

import Link from "next/link";
import PageShell from "../components/PageShell";
import PageHero from "../components/ui/PageHero";
import AchievementsSection from "../components/AchievementsSection";
import SectionHeading from "../components/ui/SectionHeading";
import CtaPanel from "../components/ui/CtaPanel";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import Card from "../components/ui/Card";
import CTAButton from "../components/CTAButton";

// Metadata is untouched by this migration — title, description, canonical and OG all
// stay exactly as they were. A design change must never move a page's search identity.
export const metadata = {
  title: "About Khamare Clarke | AI Implementation Specialist in Stoke-on-Trent",
  description:
    "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent, Staffordshire. He implements AI across search, web, content, marketing, and automation for UK businesses, holding a BSc in Software Engineering, a BSc in Digital Marketing, and completing an MSc in Computer Science with AI at Keele University (2027).",
  alternates: { canonical: "https://khamareclarke.com/about" },
  openGraph: {
    title: "About Khamare Clarke | AI Implementation Specialist in Stoke-on-Trent",
    description:
      "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent, Staffordshire. He implements AI across search, web, content, marketing, and automation for UK businesses, holding a BSc in Software Engineering, a BSc in Digital Marketing, and completing an MSc in Computer Science with AI at Keele University (2027).",
    url: "https://khamareclarke.com/about",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "profile",
  },
};

const schemaLD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://khamareclarke.com/about",
  name: "About Khamare Clarke",
  url: "https://khamareclarke.com/about",
  mainEntity: { "@id": "https://khamareclarke.com/#person" },
};

const ventures = [
  "MyApproved",
  "InBoker",
  "Upgrade Roofing Solutions",
  "Leverage Journal",
  "SEOinforce",
  "Leverage Academy",
  "Alkhemmy Naturals",
  "Flip Republic",
  "OmniWTMS",
  "UAE Private Investor",
  "Identi Marketing",
  "Ads Starter",
  "Nelly Logistics",
  "MCB Media",
  "Queens Beauty Clinic",
  "City Plaza Abu Dhabi",
];

const documentedResults = [
  {
    client: "Upgrade Roofing Solutions",
    metric: "538%",
    body: "Growth in Google Business Profile interactions in 90 days. The campaign generated over 30 qualified inbound calls in the first two weeks alone.",
  },
  {
    client: "City Plaza Abu Dhabi",
    metric: "5X",
    body: "Lead volume within 60 days, scaling to approximately 20 qualified enquiries per day at peak.",
  },
];

const credentials = [
  { strong: "MSc Computer Science with Artificial Intelligence", rest: ", Keele University (completing 2027)" },
  { strong: "BSc Software Engineering", rest: "" },
  { strong: "BSc Digital Marketing", rest: "" },
  { strong: "Level 4 Diploma in Cyber Security", rest: "" },
];

const expertiseLinks = [
  { href: "/expertise/seo", label: "SEO — what a specialist does that an agency won't" },
  { href: "/expertise/ai-search-optimisation", label: "AI search optimisation — AEO and GEO explained" },
  { href: "/expertise/programmatic-seo", label: "Programmatic SEO — engineered pages that scale" },
  { href: "/expertise/ai-agents", label: "AI agents for UK businesses" },
  { href: "/expertise/google-ads-api", label: "Google Ads API — what ads engineering actually means" },
];

export default function AboutPage() {
  return (
    <PageShell
      schema={
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLD) }}
          />
        </>
      }
    >
      {/* Same wrapper the homepage uses for its own content: one Section, one Container.
          `narrow` (896px) rather than the homepage's `main` (1200px) because this is a
          prose page — and it is the homepage's own choice for prose too, which is the
          width its FAQ section uses. */}
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">
          <PageHero eyebrow="About" title="Khamare Clarke" />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection />

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* ── Who is Khamare Clarke? ── */}
          <section className="mt-16" aria-labelledby="who-heading">
            <SectionHeading id="who-heading">
              Who is <span className="gold-text">Khamare Clarke</span>?
            </SectionHeading>
            <div className="space-y-5 text-muted text-lg leading-relaxed">
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                Khamare Clarke is an AI Implementation Specialist based in
                Stoke-on-Trent, Staffordshire, serving businesses across the
                whole of the UK. He holds a BSc in Software Engineering, a BSc in
                Digital Marketing, and is completing an MSc in Computer Science
                with Artificial Intelligence at Keele University (due 2027). That
                combination is not common, and it shapes how he works.
              </p>
              <p className="reveal" style={{ "--rv-delay": "280ms" }}>
                Most people in this space are one thing: SEO specialists who
                cannot code, AI consultants who have never shipped a production
                system, or engineers who do not understand search. Khamare does
                all three. He implements AI across search, web, content,
                marketing, and automation. Working alongside existing business
                teams rather than replacing them. The code is written here, the
                campaigns are run here, and the systems are built here. No
                outsourcing to junior team members or offshore contractors.
              </p>
              <p className="reveal" style={{ "--rv-delay": "360ms" }}>
                He built his practice around a single principle: if the result
                cannot be measured and documented, it does not count. Every claim
                on this site traces back to a real client, a real campaign, and a
                real number.
              </p>
            </div>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* ── What does an AI Implementation Specialist do? ── */}
          <section className="mt-16" aria-labelledby="what-heading">
            <SectionHeading id="what-heading">
              What does an <span className="gold-text">AI Implementation Specialist</span> do?
            </SectionHeading>
            <div className="space-y-5 text-muted text-lg leading-relaxed">
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                An AI implementation specialist assesses a business's current
                operations, identifies where AI can be applied practically, and
                implements the systems. That means AI agents and receptionists
                that handle enquiries around the clock, SEO and AI search
                optimisation that gets the business found in Google and in
                ChatGPT, Gemini, and Perplexity answers, web builds that are
                engineered to rank and convert, CRM and email automation that
                follows up every lead, and content systems that produce at scale
                without producing noise.
              </p>
              <p className="reveal" style={{ "--rv-delay": "280ms" }}>
                The distinction from a standard consultant is implementation.
                An implementation specialist does not hand a strategy document
                to an internal team and leave. He connects the technology to the
                business outcome, builds the system, and is accountable for the
                result. The MSc in Computer Science with Artificial Intelligence
                at Keele University grounds this work in how these systems
                actually behave. The two BSc degrees ground it in the marketing
                and engineering disciplines that have to work together.
              </p>
              <p className="reveal" style={{ "--rv-delay": "360ms" }}>
                The output is a business that is visible wherever its customers
                are searching, has AI handling the operational load that does not
                need a human, and has reporting that makes the outcome clear every
                month in plain English.
              </p>
            </div>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* ── Documented results ── */}
          <section className="mt-16" aria-labelledby="results-heading">
            <SectionHeading id="results-heading">
              Documented <span className="gold-text">results</span>
            </SectionHeading>
            <div className="grid sm:grid-cols-2 gap-6">
              {documentedResults.map((result, index) => (
                <Card
                  key={result.client}
                  className="reveal"
                  style={{ "--rv-delay": `${index * 110}ms` }}
                >
                  <p className="gold-text text-xs font-bold uppercase tracking-widest mb-3">
                    {result.client}
                  </p>
                  <p className="ds-numeric text-white text-4xl font-extrabold mb-2">
                    {result.metric}
                  </p>
                  <p className="text-muted text-sm leading-relaxed">{result.body}</p>
                </Card>
              ))}
            </div>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* ── Credentials ── */}
          <section className="mt-16" aria-labelledby="credentials-heading">
            <SectionHeading id="credentials-heading">Credentials</SectionHeading>
            <ul className="space-y-3 text-muted text-lg">
              {credentials.map((item, index) => (
                <li
                  key={item.strong || item.rest}
                  className="reveal flex items-start gap-3"
                  style={{ "--rv-delay": `${index * 90}ms` }}
                >
                  <span className="mt-1 gold-text font-bold" aria-hidden="true">—</span>
                  <span>
                    {item.strong ? (
                      <strong className="text-white">{item.strong}</strong>
                    ) : null}
                    {item.rest}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* ── Ventures and clients worked with ── */}
          <section className="mt-16" aria-labelledby="ventures-heading">
            <SectionHeading
              id="ventures-heading"
              lede="A selection of businesses, ventures, and projects Khamare has worked with across SEO, development, AI systems, and growth."
            >
              Ventures and <span className="gold-text">clients worked with</span>
            </SectionHeading>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ventures.map((v, index) => (
                <li
                  key={v}
                  className="reveal bg-surface-muted border border-white/10 rounded-lg px-4 py-3 text-muted text-sm"
                  style={{ "--rv-delay": `${Math.min(index, 6) * 70}ms` }}
                >
                  {v}
                </li>
              ))}
            </ul>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* ── Service area ── */}
          <section className="mt-16" aria-labelledby="area-heading">
            <SectionHeading id="area-heading">Service area</SectionHeading>
            <p
              className="reveal text-muted text-lg leading-relaxed"
              style={{ "--rv-delay": "200ms" }}
            >
              Based in Stoke-on-Trent, Staffordshire. Khamare works with UK
              businesses remotely and, where needed, on-site. Most client work
              is delivered entirely online with no loss of quality or
              accountability.
            </p>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* ── Expertise pages ── */}
          <section className="mt-16" aria-labelledby="expertise-heading">
            <SectionHeading id="expertise-heading">
              Areas of <span className="gold-text">expertise</span>
            </SectionHeading>
            <ul className="space-y-3">
              {expertiseLinks.map((link, index) => (
                <li key={link.href} className="reveal" style={{ "--rv-delay": `${index * 90}ms` }}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-muted hover:gold-text transition-colors text-base"
                  >
                    <span className="gold-text" aria-hidden="true">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted hover:gold-text transition-colors text-sm"
              >
                <span className="gold-text" aria-hidden="true">←</span> Back to homepage
              </Link>
            </div>
          </section>

          {/* ── CTA ── */}
          <CtaPanel
            className="mt-20"
            headingLevel="h2"
            heading={
              <>
                Book a free <span className="gold-text">30-minute strategy call.</span>
              </>
            }
            body="No pitch deck, no sales team. Thirty minutes to look at your situation and give you an honest assessment of what SEO and AI systems can do for your business."
          >
            <CTAButton
              eventLabel="about_strategy_cta"
              caption="How I work, and what a build involves."
            >
              Book a Consultation
            </CTAButton>
          </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
