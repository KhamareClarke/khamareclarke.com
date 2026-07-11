// src/app/expertise/ai-agents/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA } from "../../../lib/schema";

export const metadata = {
  title: "AI Agents and AI Receptionist UK | Khamare Clarke",
  description:
    "AI receptionists and AI agents for UK trades and small businesses. Respond to enquiries in seconds, qualify leads automatically, and integrate with your existing CRM.",
  alternates: {
    canonical: "https://khamareclarke.com/expertise/ai-agents",
  },
  openGraph: {
    title: "AI Agents and AI Receptionist UK | Khamare Clarke",
    description:
      "AI receptionists and AI agents for UK trades and small businesses. Respond to enquiries in seconds, qualify leads automatically, and integrate with your existing CRM.",
    url: "https://khamareclarke.com/expertise/ai-agents",
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
      name: "What is an AI receptionist?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI receptionist is a software system that handles inbound enquiries — via web chat, SMS, WhatsApp, or phone — automatically and intelligently, without a human operator. It can answer questions about the business, qualify the lead by asking the right questions, book appointments into a calendar, and pass a summary to the owner or CRM. It operates 24 hours a day, seven days a week, with no additional cost per interaction.",
      },
    },
    {
      "@type": "Question",
      name: "What does an AI agent actually do for a trades business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For a trades business — roofer, plumber, electrician, builder — an AI agent handles the enquiries that come in outside office hours, during jobs, or when the phone is busy. It captures the customer's name, contact details, job description, and preferred date, then either books a slot directly into the diary or flags the lead for a human callback. No missed calls, no lost jobs.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can an AI agent respond to enquiries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI agent can respond within seconds of an enquiry being submitted, at any time of day or night. Research consistently shows that lead conversion rates drop sharply when response time exceeds five minutes. A human-staffed business physically cannot match a sub-second response rate across every channel at all hours. An AI agent can.",
      },
    },
    {
      "@type": "Question",
      name: "How does an AI agent integrate with existing systems?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI agents can be integrated with most CRM systems, calendar tools, and communication platforms through APIs and webhooks. Common integrations include Google Calendar, Calendly, HubSpot, GoHighLevel, Salesforce, and Notion. For businesses without an existing CRM, a lightweight system can be set up as part of the build. The agent passes structured data — not just a conversation log — into the downstream system.",
      },
    },
    {
      "@type": "Question",
      name: "What is the return on investment for an AI receptionist?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The return depends on average job value and lead volume. A trades business with a £500 average job value that was previously missing two or three leads per week outside business hours would recover that in weeks. The system runs continuously without additional staffing cost. The primary financial argument is not the technology cost — it is the cost of every missed enquiry that currently goes to a competitor who picks up.",
      },
    },
  ],
};

export default function AIAgentsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl gradient-blob" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#ff8c00]/4 blur-3xl gradient-blob-b" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        <p className="inline-block bg-[#ffb700] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full mb-8">
          Expertise
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          AI Agents for UK Businesses{" "}
          <span className="text-[#ffb700]">— What They Do and Why They Matter</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          Every enquiry that goes unanswered for more than a few minutes is a
          lead that is comparing you to the next result. An AI agent responds
          before the comparison is made.
        </p>

        {/* Q1 */}
        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What is an AI receptionist?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An AI receptionist is a software system that handles inbound
              enquiries — via web chat, SMS, WhatsApp, or phone — automatically
              and intelligently, without a human operator at the other end. It
              can answer questions about the business, qualify the lead by
              asking the right questions, book appointments into a calendar, and
              pass a structured summary to the business owner or CRM.
            </p>
            <p>
              It is not a chatbot in the traditional sense. A traditional chatbot
              follows a script and fails the moment a user says something
              unexpected. An AI receptionist built on a large language model
              understands natural language, handles variations, and can conduct
              a genuine back-and-forth conversation. The output is a qualified
              lead with the information needed to take the next step.
            </p>
          </div>
        </section>

        {/* Q2 */}
        <section className="mt-12" aria-labelledby="q2">
          <h2 id="q2" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What does an AI agent actually do for a trades business?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              For a trades business — roofer, plumber, electrician, builder —
              the problem is not finding leads. The problem is responding to
              leads while you are on a roof, under a sink, or finishing a job
              at 6pm. An AI agent handles the enquiries that arrive outside
              office hours, during jobs, or when the phone is already in use.
            </p>
            <p>
              It captures the customer's name, contact details, job description,
              location, and preferred date, then either books a slot directly
              into the diary or flags the lead for a human callback with a full
              summary. The business owner sees a complete record of every
              enquiry, qualified and organised, rather than a voicemail they
              may not get to until tomorrow.
            </p>
            <p>
              Upgrade Roofing Solutions generated over 30 qualified inbound
              calls in the first two weeks of their SEO and AI systems campaign.
              The AI agent ensured every one of those leads was captured and
              followed up, even outside business hours.
            </p>
          </div>
        </section>

        {/* Q3 */}
        <section className="mt-12" aria-labelledby="q3">
          <h2 id="q3" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How quickly can an AI agent respond to enquiries?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An AI agent responds within seconds of an enquiry being submitted,
              at any time of day or night. That is not a headline feature — it
              is the core commercial argument for the technology. Research
              consistently shows that lead conversion rates drop sharply when
              response time exceeds five minutes. After an hour, the
              probability of qualifying that lead drops by a factor of ten
              compared to a response in under a minute.
            </p>
            <p>
              A human-staffed business physically cannot match a sub-second
              response rate across every channel at all hours. An AI agent can.
              This is particularly important for trades businesses, professional
              services, and anyone where the owner is the service provider —
              you cannot simultaneously deliver the work and answer every
              enquiry the moment it arrives.
            </p>
          </div>
        </section>

        {/* Q4 */}
        <section className="mt-12" aria-labelledby="q4">
          <h2 id="q4" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How does an AI agent integrate with existing systems?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              AI agents connect to existing tools through APIs and webhooks.
              Common integrations include Google Calendar and Calendly for
              booking, HubSpot, GoHighLevel, Salesforce, or Notion for CRM,
              and WhatsApp, SMS, and email for outbound follow-up. The agent
              passes structured data — name, contact details, job description,
              date preference, qualification status — not just a raw
              conversation transcript.
            </p>
            <p>
              For businesses without an existing CRM, a lightweight system can
              be set up as part of the build. The goal is that no data lives
              only in a chat window that someone has to scroll back through.
              Every interaction creates a record that integrates with the
              business's existing workflow.
            </p>
          </div>
        </section>

        {/* Q5 */}
        <section className="mt-12" aria-labelledby="q5">
          <h2 id="q5" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What is the return on investment for an AI receptionist?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              The return depends on average job value and the volume of leads
              currently being missed or delayed. A trades business with a £500
              average job value that was previously missing two or three leads
              per week outside business hours would see the system pay for
              itself within the first month. The agent runs continuously without
              additional staffing cost — there is no overtime, no sick day
              cover, and no cost per interaction beyond the base subscription.
            </p>
            <p>
              The primary financial argument is not the technology cost. It is
              the cost of every missed enquiry that currently goes to a
              competitor who picks up. That cost is invisible in most business
              accounting because missed calls do not appear on any report. The
              AI agent makes the cost visible by ensuring every lead is
              captured, and then makes it disappear by ensuring none of them
              are lost.
            </p>
          </div>
        </section>

        {/* Synonym coverage */}
        <section className="mt-12" aria-labelledby="synonyms-agents">
          <h2 id="synonyms-agents" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            AI systems engineer, automation engineer, AI developer, AI architect: the same discipline with different labels
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              The terms AI systems engineer, automation engineer, AI developer, and AI architect describe overlapping
              roles that differ mainly in emphasis. An AI systems engineer builds and integrates the components of
              an AI system: the language model, the retrieval layer, the tools, the memory, and the channels through
              which it communicates. An automation engineer focuses on the workflow logic connecting those components
              to business processes. An AI developer writes the underlying code. An AI architect designs the overall
              structure before implementation begins.
            </p>
            <p>
              In practice, a single practitioner working with a small or medium business will cover all of these
              functions. The label "agentic AI specialist" is increasingly used for people who build multi-step,
              tool-using AI systems rather than simple chatbots. That is precisely the kind of system built for
              clients here: agents that reason, act, retrieve information, and integrate with real business workflows,
              not canned-response bots that fail on the third exchange.
            </p>
          </div>
        </section>

        {/* Internal links */}
        <nav className="mt-16 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8" aria-label="Related expertise">
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/seo", label: "SEO specialist — what a specialist does" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation — AEO and GEO" },
              { href: "/expertise/ai-consultant", label: "AI consultant and AI strategy" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO" },
              { href: "/expertise/google-ads-api", label: "Google Ads API" },
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

        {/* CTA */}
        <div className="mt-12 bg-[#1a1a1a] border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Find out how many leads you are currently missing.
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy call. We will look at your current
            enquiry process, identify the gaps, and map out what an AI agent
            would look like for your specific business.
          </p>
          <CTAButton eventLabel="expertise_ai_agents_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
