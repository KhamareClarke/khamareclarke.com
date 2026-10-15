// src/app/expertise/ai-consultant/page.js

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
  title: "AI Consultant UK | Khamare Clarke | Stoke-on-Trent",
  description:
    "AI consultant and AI strategy adviser based in Staffordshire. MSc Artificial Intelligence, Keele University. Practical AI adoption for UK businesses: agents, automation, and AI search.",
  alternates: { canonical: "https://khamareclarke.com/expertise/ai-consultant" },
  openGraph: {
    title: "AI Consultant UK | Khamare Clarke | Stoke-on-Trent",
    description:
      "AI consultant and AI strategy adviser based in Staffordshire. MSc Artificial Intelligence, Keele University. Practical AI adoption for UK businesses.",
    url: "https://khamareclarke.com/expertise/ai-consultant",
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
      name: "What does an AI consultant do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI consultant helps businesses identify where artificial intelligence can be applied practically, selects the right tools and approaches, and either builds the systems or oversees their implementation. For most small and medium UK businesses, this means AI agents for lead handling, automation for repetitive processes, and AI search optimisation so the business appears in ChatGPT, Gemini, and Perplexity answers. The emphasis is on outcomes that connect to revenue, not on technology for its own sake.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between an AI consultant and an AI specialist?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI specialist typically refers to someone with deep technical knowledge in a narrow area: a computer vision researcher, an NLP engineer, or a machine learning scientist. An AI consultant applies that knowledge strategically across a business: which processes to automate, which tools to use, what the integration looks like in practice. The distinction matters because most businesses need someone who can connect the technology to the business outcome, not just build the model.",
      },
    },
    {
      "@type": "Question",
      name: "What is an AI strategy consultant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI strategy consultant helps a business develop a coherent plan for adopting AI: what to automate, in what order, with what tools, and at what cost. This includes assessing current workflow gaps, identifying the highest-leverage AI applications, and building a roadmap that does not require the business to overhaul everything at once. For most UK trades and professional services businesses, the strategy starts with lead capture and response automation, then expands to SEO and AI search visibility.",
      },
    },
    {
      "@type": "Question",
      name: "How is an artificial intelligence consultant different from a digital marketing consultant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A digital marketing consultant focuses on channels: SEO, paid ads, social, email. An artificial intelligence consultant focuses on the systems that sit behind those channels: the agent that responds to enquiries, the automation that follows up leads, the AI search optimisation that makes the business appear in generative AI answers. The two disciplines are converging. A business that has both working together -- AI handling operations while SEO and AI search handle visibility -- has a compounding advantage over businesses that treat them separately.",
      },
    },
    {
      "@type": "Question",
      name: "What does Khamare Clarke offer as an AI adviser?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Khamare Clarke works as an AI adviser for UK businesses that want to adopt AI in a way that is practical, proportionate, and measurable. This covers: AI agent design and deployment (receptionists, lead qualification, follow-up systems), AI search optimisation (AEO/GEO for ChatGPT, Gemini, Perplexity, and AI Overviews), CRM and workflow automation, and strategic advisory on AI adoption order and tooling. He holds an MSc in Computer Science with Artificial Intelligence from Keele University and a BSc in Software Engineering, which means the advice is grounded in how these systems actually behave rather than in vendor marketing.",
      },
    },
  ],
};

export default function AIConsultantPage() {
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
            size="feature"
            title={
              <>
                AI Consultant{" "}
                <span className="gold-text">| Practical AI Adoption for UK Businesses</span>
              </>
            }
          />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection dense />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            Most AI consultants explain the technology. The part UK businesses need is
            someone who can connect it to revenue: which system to build first, how it
            integrates with what already exists, and what it will measurably change.
          </p>

        <section className="mt-24" aria-labelledby="q1">
          <SectionHeading id="q1">
            What does an <span className="gold-text">AI consultant</span> do?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An AI consultant helps businesses identify where artificial intelligence
              can be applied practically, selects the right tools and approaches, and
              either builds the systems or oversees their implementation. For most small
              and medium UK businesses, this means AI agents for lead handling, automation
              for repetitive back-office processes, and AI search optimisation so the
              business appears in ChatGPT, Gemini, and Perplexity answers.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The emphasis is on outcomes connected to revenue, not on technology for
              its own sake. A business does not need a sophisticated machine learning
              pipeline; it needs a system that captures leads at 11pm, follows up
              automatically, and gets reviewed on Google 24 hours after a job is complete.
              That is what AI consulting looks like at the level where it actually
              makes a difference.
            </p>
          </div>
        </section>

        <section className="mt-24" aria-labelledby="q2">
          <SectionHeading id="q2">
            What is the difference between an AI consultant and an <span className="gold-text">AI specialist</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An AI specialist typically refers to someone with deep technical knowledge
              in a narrow area: computer vision, natural language processing, or machine
              learning model training. An AI consultant applies that knowledge strategically
              across a business context: which processes to automate, which tools to use,
              and what the integration looks like when it meets real operational constraints.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The distinction matters because most businesses need someone who can
              connect the technology to the business outcome. A technically capable
              person who cannot explain the return on investment or who builds something
              the operations team cannot maintain creates a liability, not an asset. Good
              AI consulting produces systems that the business owns and understands.
            </p>
          </div>
        </section>

        <section className="mt-24" aria-labelledby="q3">
          <SectionHeading id="q3">
            What is an <span className="gold-text">AI strategy consultant</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An AI strategy consultant helps a business develop a coherent plan for
              adopting AI: what to automate, in what order, with what tools, and at what
              cost. This includes assessing current workflow gaps, identifying the
              highest-leverage AI applications, and building a roadmap that does not
              require overhauling everything at once.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              For most UK trades and professional services businesses, the strategy starts
              with front-of-funnel automation (lead capture, qualification, follow-up)
              because that is where the largest number of opportunities currently fall
              through. It then expands to SEO and AI search visibility so that the
              improved conversion system has a growing volume of leads to work with.
              These two things compound each other.
            </p>
          </div>
        </section>

        <section className="mt-24" aria-labelledby="q4">
          <SectionHeading id="q4">
            How is an artificial intelligence consultant different from a <span className="gold-text">digital marketing consultant</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              A digital marketing consultant focuses on channels: SEO, paid ads, social
              media, email. An artificial intelligence consultant focuses on the systems
              behind those channels: the agent that responds to enquiries, the automation
              that follows up leads, the AI search optimisation that makes the business
              appear in generative AI answers.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              These two disciplines are converging. A business that has both working
              together -- AI handling operations while SEO and AI search drive visibility
              -- has a structural advantage over businesses that treat them separately.
              Khamare Clarke combines both: the SEO and AI search expertise that gets a
              business found, and the AI systems expertise that ensures enquiries convert
              once they arrive.
            </p>
          </div>
        </section>

        <section className="mt-24" aria-labelledby="q5">
          <SectionHeading id="q5">
            What does <span className="gold-text">Khamare Clarke</span> offer as an AI adviser?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              The AI advisory work covers four connected areas. First, AI agent design
              and deployment: receptionists that respond to enquiries in seconds, lead
              qualification systems, and automated follow-up sequences. Second, AI search
              optimisation (AEO and GEO): structuring content and entity signals so the
              business appears in ChatGPT, Gemini, Perplexity, and Google AI Overviews
              answers. Third, CRM and workflow automation: connecting the AI systems to
              the business's existing tools so that every lead is captured and followed
              through without manual work. Fourth, strategic advisory: advising on which
              AI tools to adopt, which to avoid, and in what sequence to build.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The MSc in Computer Science with Artificial Intelligence at Keele University
              (completing 2027) and the BSc in Software Engineering ground this work in
              how these systems actually behave. The practical application is informed by
              the technical reality, which produces better outcomes than advice based
              purely on tool demos and vendor claims.
            </p>
          </div>
        </section>

        {/* AI expert / advisor synonym section */}
        <section className="mt-24" aria-labelledby="synonyms-consultant">
          <SectionHeading id="synonyms-consultant">
            <span className="gold-text">AI expert</span>, AI adviser, AI specialist: what these terms mean in practice
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Businesses searching for an AI expert, AI adviser, or AI specialist are
              typically looking for someone who can tell them what to build, help them
              build it, and be accountable for the outcome. The labels differ slightly:
              "AI expert" implies deep knowledge, "AI adviser" implies a strategic or
              consultancy relationship, "AI specialist" implies hands-on technical
              capability. In practice, a small or medium business needs all three from
              the same person.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              An artificial intelligence consultant serving a UK SME is not primarily
              a researcher or an academic. The work is applied: deploy a system that
              responds to enquiries overnight, connect it to the CRM, make the business
              visible in AI search results, and report on what changed. That is the
              scope of AI advisory work at the level where it produces measurable
              commercial results within months rather than years.
            </p>
          </div>
        </section>

        <Card as="nav" aria-label="Related expertise" className="reveal mt-16" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-agents", label: "AI agents and AI receptionists for UK businesses" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation -- AEO and GEO" },
              { href: "/expertise/seo", label: "SEO specialist" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO" },
              { href: "/about", label: "About Khamare Clarke" },
            ].map((l, index) => (
              <li key={l.href} className="reveal" style={{ "--rv-delay": `${index * 90}ms` }}>
                <Link href={l.href} className="text-muted hover:gold-text transition-colors flex items-center gap-2 text-sm">
                  <span className="gold-text">--</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <CtaPanel headingLevel="h2"
          className="mt-16"
          heading={
            <>
              Ready to talk about <span className="gold-text">AI adoption</span> for your business?
            </>
          }
          body="Book a free 30-minute strategy call. We will look at your current operations, identify where AI would have the most immediate impact, and give you an honest picture of what implementation involves."
        >
          <CTAButton eventLabel="expertise_ai_consultant_cta" caption="The question you can't get answered. Straight, once.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
