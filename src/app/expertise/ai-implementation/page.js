// src/app/expertise/ai-implementation/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../../lib/schema";

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
        text: "Implementation is delivered across three retainer tiers. The Get Found tier (from £495 per month, rolling monthly) covers AI receptionist, CRM, SEO, and Google Business Profile management. The Run The Area tier (from £1,250 per month) adds a new website, programmatic service and location pages, and email campaigns. The Own The Market tier (from £2,500 per month) adds Google Ads via the Ads API, custom AI applications, and quarterly strategy sessions. All tiers include a ranked-or-refunded guarantee on agreed search targets.",
      },
    },
  ],
};

export default function AIImplementationPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        <div className="flex items-center gap-4 mb-8 h-4">
          <span className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
          <p className="text-xs font-semibold tracking-[0.18em] uppercase gold-text leading-none whitespace-nowrap">
            Expertise
          </p>
          <span className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          AI Implementation{" "}
          <span className="gold-text">| Built and Running</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          Strategy without implementation is just documentation. The work here is
          identifying the highest-leverage AI applications for your business, building
          them, and handing over something that works. With the team trained to use it
          and the results documented.
        </p>

        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What is AI implementation?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              AI implementation is the process of identifying where artificial
              intelligence can produce a measurable business outcome, selecting
              the right systems, building and deploying them, training the team
              to use them, and providing the documentation and ongoing support
              that keeps them running.
            </p>
            <p>
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
          <h2 id="q2" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What an AI implementation specialist does
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              The scope covers the full cycle. Operational audit: mapping current
              workflows, identifying where time and leads are lost, and
              prioritising the highest-leverage AI applications. Implementation
              plan: a clear sequence of what gets built, in what order, at what
              cost, with what expected outcome. Build: the systems are implemented
              on agreed timelines. Handover: staff training and documentation so
              the business owns and understands what has been built. Ongoing
              support: monitoring, iteration, and expansion as the business grows.
            </p>
            <p>
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
          <h2 id="q3" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            The five-stage implementation method
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <ol className="space-y-6 list-none">
              {[
                ["Operational audit", "Mapping current workflows, identifying where time and leads are lost, and ranking AI applications by commercial impact. The audit produces a prioritised action list, not a 200-page report."],
                ["Implementation plan", "A clear sequence of what gets built, in what order, at what cost, with what expected outcome. Agreed before any build work begins."],
                ["Build", "The systems are implemented (AI agents, automations, web pages, content systems, search optimisation) on agreed timelines. The code is written here. Nothing is outsourced."],
                ["Handover", "Staff training and plain-English documentation. The business owns what has been built and understands how to use it."],
                ["Ongoing support", "Monitoring, iteration, and expansion. Monthly reporting in plain English: what moved, what changed, what is next."],
              ].map(([title, body], i) => (
                <li key={i} className="flex gap-5">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#ffb700]/20 border border-[#ffb700]/40 flex items-center justify-center text-[#ffb700] font-bold text-sm">{i + 1}</span>
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
          <h2 id="q4" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How AI implementation is different from AI consultancy
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An AI consultant typically produces a strategy document or roadmap.
              An AI implementation specialist builds the systems that the strategy
              describes. The distinction matters commercially: a strategy that has
              not been implemented produces nothing. Implementation produces a
              live system, a measurable outcome, and a team that understands how
              to use it.
            </p>
            <p>
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
          <h2 id="q5" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What AI implementation covers across your business
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            {[
              ["Search and AI search", "SEO, local SEO, AEO, GEO: ranked in Google and cited in ChatGPT, Gemini, Perplexity."],
              ["AI agents and receptionists", "Enquiry response, lead qualification, appointment booking, 24 hours a day."],
              ["Web and custom apps", "Performance-first websites and custom applications engineered to rank and convert."],
              ["CRM and marketing automation", "Every lead captured, followed up, and reported on without manual intervention."],
              ["Content systems", "Content strategy and AI-assisted production at scale, structured for search and AI visibility."],
              ["Google Ads", "Paid search managed through the Ads API, not a dashboard. Lower cost per lead, full transparency."],
            ].map(([title, body]) => (
              <div key={title} className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-xl p-5">
                <p className="text-[#ffb700] font-semibold text-sm mb-2">{title}</p>
                <p className="text-[#ADB7BE] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="results-heading">
          <h2 id="results-heading" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Documented results
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-2xl p-8">
              <p className="text-[#ffb700] text-xs font-bold uppercase tracking-widest mb-3">Upgrade Roofing Solutions</p>
              <p className="text-white text-4xl font-extrabold mb-2">538%</p>
              <p className="text-[#ADB7BE] text-sm leading-relaxed">Growth in Google Business Profile interactions in 90 days. More than 30 qualified inbound calls in the first two weeks.</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-2xl p-8">
              <p className="text-[#ffb700] text-xs font-bold uppercase tracking-widest mb-3">City Plaza Abu Dhabi</p>
              <p className="text-white text-4xl font-extrabold mb-2">5X</p>
              <p className="text-[#ADB7BE] text-sm leading-relaxed">Lead volume within 60 days, scaling to approximately 20 qualified enquiries per day at peak.</p>
            </div>
          </div>
        </section>

        <nav className="mt-16 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8" aria-label="Related expertise">
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
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors flex items-center gap-2 text-sm">
                  <span className="text-[#ffb700]">→</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 bg-[#1a1a1a] border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to implement?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy call. We will audit your current
            operations, identify the highest-leverage AI applications, and give
            you an honest picture of what implementation involves and what it
            will measurably change.
          </p>
          <CTAButton eventLabel="expertise_ai_implementation_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
