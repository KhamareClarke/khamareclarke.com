// src/app/expertise/ai-agents/page.js

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
    <PageShell
      schema={
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
          />
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
                AI Agents for UK Businesses{" "}
                <span className="gold-text">— What They Do and Why They Matter</span>
              </>
            }
          />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            Every enquiry that goes unanswered for more than a few minutes is a
            lead that is comparing you to the next result. An AI agent responds
            before the comparison is made.
          </p>

        {/* Q1 */}
        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What is an <span className="gold-text">AI receptionist</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An AI receptionist is a software system that handles inbound
              enquiries — via web chat, SMS, WhatsApp, or phone — automatically
              and intelligently, without a human operator at the other end. It
              can answer questions about the business, qualify the lead by
              asking the right questions, book appointments into a calendar, and
              pass a structured summary to the business owner or CRM.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
          <SectionHeading id="q2">
            What does an <span className="gold-text">AI agent</span> actually do for a trades business?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              For a trades business — roofer, plumber, electrician, builder —
              the problem is not finding leads. The problem is responding to
              leads while you are on a roof, under a sink, or finishing a job
              at 6pm. An AI agent handles the enquiries that arrive outside
              office hours, during jobs, or when the phone is already in use.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              It captures the customer's name, contact details, job description,
              location, and preferred date, then either books a slot directly
              into the diary or flags the lead for a human callback with a full
              summary. The business owner sees a complete record of every
              enquiry, qualified and organised, rather than a voicemail they
              may not get to until tomorrow.
            </p>
            <p className="reveal" style={{ "--rv-delay": "360ms" }}>
              Upgrade Roofing Solutions generated over 30 qualified inbound
              calls in the first two weeks of their SEO and AI systems campaign.
              The AI agent ensured every one of those leads was captured and
              followed up, even outside business hours.
            </p>
          </div>
        </section>

        {/* Q3 */}
        <section className="mt-12" aria-labelledby="q3">
          <SectionHeading id="q3">
            How quickly can an <span className="gold-text">AI agent respond</span> to enquiries?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An AI agent responds within seconds of an enquiry being submitted,
              at any time of day or night. That is not a headline feature — it
              is the core commercial argument for the technology. Research
              consistently shows that lead conversion rates drop sharply when
              response time exceeds five minutes. After an hour, the
              probability of qualifying that lead drops by a factor of ten
              compared to a response in under a minute.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
          <SectionHeading id="q4">
            How does an AI agent <span className="gold-text">integrate with existing systems</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              AI agents connect to existing tools through APIs and webhooks.
              Common integrations include Google Calendar and Calendly for
              booking, HubSpot, GoHighLevel, Salesforce, or Notion for CRM,
              and WhatsApp, SMS, and email for outbound follow-up. The agent
              passes structured data — name, contact details, job description,
              date preference, qualification status — not just a raw
              conversation transcript.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
          <SectionHeading id="q5">
            What is the <span className="gold-text">return on investment</span> for an AI receptionist?
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              The return depends on average job value and the volume of leads
              currently being missed or delayed. A trades business with a £500
              average job value that was previously missing two or three leads
              per week outside business hours would see the system pay for
              itself within the first month. The agent runs continuously without
              additional staffing cost — there is no overtime, no sick day
              cover, and no cost per interaction beyond the base subscription.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
          <SectionHeading id="synonyms-agents">
            <span className="gold-text">AI systems engineer</span>, automation engineer, AI developer, AI architect: the same discipline with different labels
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              The terms AI systems engineer, automation engineer, AI developer, and AI architect describe overlapping
              roles that differ mainly in emphasis. An AI systems engineer builds and integrates the components of
              an AI system: the language model, the retrieval layer, the tools, the memory, and the channels through
              which it communicates. An automation engineer focuses on the workflow logic connecting those components
              to business processes. An AI developer writes the underlying code. An AI architect designs the overall
              structure before implementation begins.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              In practice, a single practitioner working with a small or medium business will cover all of these
              functions. The label "agentic AI specialist" is increasingly used for people who build multi-step,
              tool-using AI systems rather than simple chatbots. That is precisely the kind of system built for
              clients here: agents that reason, act, retrieve information, and integrate with real business workflows,
              not canned-response bots that fail on the third exchange.
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
              { href: "/expertise/ai-consultant", label: "AI consultant and AI strategy" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO" },
              { href: "/expertise/google-ads-api", label: "Google Ads API" },
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
              Find out how many <span className="gold-text">leads you are currently missing.</span>
            </>
          }
          body="Book a free 30-minute strategy call. We will look at your current enquiry process, identify the gaps, and map out what an AI agent would look like for your specific business."
        >
          <CTAButton eventLabel="expertise_ai_agents_cta" caption="What an agent would take off you. Hours back.">
            Book Your Free Strategy Call
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
