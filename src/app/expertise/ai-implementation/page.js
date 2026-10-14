// src/app/expertise/ai-implementation/page.js

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
  title: "AI Implementation Specialist UK | Khamare Clarke | Stoke-on-Trent",
  description:
    "AI implementation for UK businesses. End-to-end: operational audit, system build, staff handover, ongoing support. MSc Computer Science with AI, Keele University. Serving the whole of the UK from Stoke-on-Trent.",
  alternates: { canonical: "https://khamareclarke.com/expertise/ai-implementation" },
  openGraph: {
    title: "AI Implementation Specialist UK | Khamare Clarke",
    description:
      "AI implementation for UK businesses. End-to-end: operational audit, system build, staff handover, ongoing support.",
    url: "https://khamareclarke.com/expertise/ai-implementation",
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
      name: "What is AI implementation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI implementation is the process of identifying where artificial intelligence can produce a measurable business outcome, selecting the right systems, building and deploying them, training the team to use them, and providing the documentation and ongoing support that keeps them running. It is distinct from AI consultancy (which stops at strategy) and from AI research (which does not connect to operational reality). Implementation produces a live, working system with a documented result.",
      },
    },
    {
      "@type": "Question",
      name: "What does an AI implementation specialist do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI implementation specialist works across the full cycle: operational audit, prioritised implementation plan, system build, integration with existing tools, staff training, documentation, and ongoing support. For a UK business, this typically covers AI agents for lead handling and enquiry response, search optimisation for both Google and AI-powered answer engines, web builds that are engineered for ranking and conversion, CRM and email automation that follows up every lead, and content systems that produce at scale.",
      },
    },
    {
      "@type": "Question",
      name: "How is AI implementation different from AI consultancy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI consultant typically produces a strategy document or roadmap. An AI implementation specialist builds the systems that the strategy describes. The distinction matters commercially: a strategy that has not been implemented produces nothing. Implementation produces a live system, a measurable outcome, and a team that understands how to use it. Most UK businesses need implementation, not another consultant.",
      },
    },
    {
      "@type": "Question",
      name: "What does the AI implementation process look like?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The process has five stages. First, the operational audit: mapping current workflows, identifying where time and leads are lost, and prioritising the highest-leverage AI applications. Second, the implementation plan: a clear sequence of what gets built, in what order, at what cost, with what expected outcome. Third, the build: the systems are implemented (AI agents, automations, web pages, content systems, search optimisation) on agreed timelines. Fourth, handover: staff training and documentation so the business owns and understands what has been built. Fifth, ongoing support: monitoring, iteration, and expansion as the business grows.",
      },
    },
    {
      "@type": "Question",
      name: "What does AI implementation cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on the scope of the work and what needs building. Priorities and deliverables are agreed in writing before work begins, and a free 30-minute introductory call gives an accurate picture for your specific situation.",
      },
    },
  ],
};

export default function AIImplementationPage() {
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
                AI Implementation{" "}
                <span className="gold-text">| Built and Running</span>
              </>
            }
          />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            Strategy without implementation is just documentation. The work here is
            identifying the highest-leverage AI applications for your business, building
            them, and handing over something that works. With the team trained to use it
            and the results documented.
          </p>

        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What is <span className="gold-text">AI implementation</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              AI implementation is the process of identifying where artificial
              intelligence can produce a measurable business outcome, selecting
              the right systems, building and deploying them, training the team
              to use them, and providing the documentation and ongoing support
              that keeps them running.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              It is distinct from AI consultancy, which stops at strategy, and
              from AI research, which does not connect to operational reality.
              Implementation produces a live, working system with a documented
              result. The question is not whether your business could use AI.
              The question is which systems, in what order, and what they will
              measurably change.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q2">
          <SectionHeading id="q2">
            What an <span className="gold-text">AI implementation specialist</span> does
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              The scope covers the full cycle. Operational audit: mapping current
              workflows, identifying where time and leads are lost, and
              prioritising the highest-leverage AI applications. Implementation
              plan: a clear sequence of what gets built, in what order, at what
              cost, with what expected outcome. Build: the systems are implemented
              on agreed timelines. Handover: staff training and documentation so
              the business owns and understands what has been built. Ongoing
              support: monitoring, iteration, and expansion as the business grows.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              For a UK business, this typically covers AI agents for lead handling
              and enquiry response, search optimisation for both Google and
              AI-powered answer engines, web builds engineered for ranking and
              conversion, CRM and email automation that follows up every lead,
              and content systems that produce at scale without producing noise.
              These are not separate projects. They are components of the same
              system, and they compound each other.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q3">
          <SectionHeading id="q3">
            The <span className="gold-text">five-stage implementation method</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <ol className="space-y-6 list-none">
              {[
                ["Operational audit", "Mapping current workflows, identifying where time and leads are lost, and ranking AI applications by commercial impact. The audit produces a prioritised action list, not a 200-page report."],
                ["Implementation plan", "A clear sequence of what gets built, in what order, at what cost, with what expected outcome. Agreed before any build work begins."],
                ["Build", "The systems are implemented (AI agents, automations, web pages, content systems, search optimisation) on agreed timelines. The code is written here. Nothing is outsourced."],
                ["Handover", "Staff training and plain-English documentation. The business owns what has been built and understands how to use it."],
                ["Ongoing support", "Monitoring, iteration, and expansion. Monthly reporting in plain English: what moved, what changed, what is next."],
              ].map(([title, body], i) => (
                <li key={i} className="reveal flex gap-5" style={{ "--rv-delay": `${i * 90}ms` }}>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center gold-text font-bold text-sm">{i + 1}</span>
                  <div>
                    <p className="text-white font-semibold mb-1">{title}</p>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q4">
          <SectionHeading id="q4">
            How <span className="gold-text">AI implementation</span> is different from AI consultancy
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An AI consultant typically produces a strategy document or roadmap.
              An AI implementation specialist builds the systems that the strategy
              describes. The distinction matters commercially: a strategy that has
              not been implemented produces nothing. Implementation produces a
              live system, a measurable outcome, and a team that understands how
              to use it.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The MSc in Computer Science with Artificial Intelligence at Keele
              University (completing 2027) and the BSc in Software Engineering
              ground the build in how these systems actually behave. The BSc in
              Digital Marketing grounds the implementation in commercial context:
              the right system is the one that connects to revenue, not the most
              technically impressive one.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q5">
          <SectionHeading id="q5">
            What <span className="gold-text">AI implementation</span> covers across your business
          </SectionHeading>
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            {[
              ["Search and AI search", "SEO, local SEO, AEO, GEO: ranked in Google and cited in ChatGPT, Gemini, Perplexity."],
              ["AI agents and receptionists", "Enquiry response, lead qualification, appointment booking, 24 hours a day."],
              ["Web and custom apps", "Performance-first websites and custom applications engineered to rank and convert."],
              ["CRM and marketing automation", "Every lead captured, followed up, and reported on without manual intervention."],
              ["Content systems", "Content strategy and AI-assisted production at scale, structured for search and AI visibility."],
              ["Google Ads", "Paid search managed through the Ads API, not a dashboard. Lower cost per lead, full transparency."],
            ].map(([title, body], index) => (
              <Card key={title} className="reveal" style={{ "--rv-delay": `${index * 110}ms` }}>
                <p className="gold-text font-semibold text-sm mb-2">{title}</p>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="results-heading">
          <SectionHeading id="results-heading">
            Documented <span className="gold-text">results</span>
          </SectionHeading>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="reveal" style={{ "--rv-delay": "0ms" }}>
              <p className="gold-text text-xs font-bold uppercase tracking-widest mb-3">Upgrade Roofing Solutions</p>
              <p className="ds-numeric text-white text-4xl font-extrabold mb-2">538%</p>
              <p className="text-muted text-sm leading-relaxed">Growth in Google Business Profile interactions in 90 days. More than 30 qualified inbound calls in the first two weeks.</p>
            </Card>
            <Card className="reveal" style={{ "--rv-delay": "110ms" }}>
              <p className="gold-text text-xs font-bold uppercase tracking-widest mb-3">City Plaza Abu Dhabi</p>
              <p className="ds-numeric text-white text-4xl font-extrabold mb-2">5X</p>
              <p className="text-muted text-sm leading-relaxed">Lead volume within 60 days, scaling to approximately 20 qualified enquiries per day at peak.</p>
            </Card>
          </div>
        </section>

        <Card as="nav" aria-label="Related expertise" className="reveal mt-16" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-agents", label: "AI agents and AI receptionists for UK businesses" },
              { href: "/expertise/ai-consultant", label: "AI consultant and AI strategy" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation: AEO and GEO" },
              { href: "/expertise/seo", label: "SEO specialist" },
              { href: "/expertise/web-design-development", label: "Web design and development" },
              { href: "/expertise/digital-marketing", label: "Digital marketing" },
              { href: "/expertise/marketing-automation", label: "CRM and marketing automation" },
              { href: "/expertise/ai-content-systems", label: "AI content systems" },
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

        <CtaPanel headingLevel="h2"
          className="mt-12"
          heading={
            <>
              Ready to <span className="gold-text">implement?</span>
            </>
          }
          body="Book a free 30-minute strategy call. We will audit your current operations, identify the highest-leverage AI applications, and give you an honest picture of what implementation involves and what it will measurably change."
        >
          <CTAButton eventLabel="expertise_ai_implementation_cta" caption="What AI can take off you.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
