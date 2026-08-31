// src/app/expertise/ai-consultant/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA } from "../../../lib/schema";

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
    <main className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
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
          AI Consultant{" "}
          <span className="gold-text">| Practical AI Adoption for UK Businesses</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          Most AI consultants explain the technology. The part UK businesses need is
          someone who can connect it to revenue: which system to build first, how it
          integrates with what already exists, and what it will measurably change.
        </p>

        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What does an AI consultant do?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An AI consultant helps businesses identify where artificial intelligence
              can be applied practically, selects the right tools and approaches, and
              either builds the systems or oversees their implementation. For most small
              and medium UK businesses, this means AI agents for lead handling, automation
              for repetitive back-office processes, and AI search optimisation so the
              business appears in ChatGPT, Gemini, and Perplexity answers.
            </p>
            <p>
              The emphasis is on outcomes connected to revenue, not on technology for
              its own sake. A business does not need a sophisticated machine learning
              pipeline; it needs a system that captures leads at 11pm, follows up
              automatically, and gets reviewed on Google 24 hours after a job is complete.
              That is what AI consulting looks like at the level where it actually
              makes a difference.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q2">
          <h2 id="q2" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What is the difference between an AI consultant and an AI specialist?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An AI specialist typically refers to someone with deep technical knowledge
              in a narrow area: computer vision, natural language processing, or machine
              learning model training. An AI consultant applies that knowledge strategically
              across a business context: which processes to automate, which tools to use,
              and what the integration looks like when it meets real operational constraints.
            </p>
            <p>
              The distinction matters because most businesses need someone who can
              connect the technology to the business outcome. A technically capable
              person who cannot explain the return on investment or who builds something
              the operations team cannot maintain creates a liability, not an asset. Good
              AI consulting produces systems that the business owns and understands.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q3">
          <h2 id="q3" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What is an AI strategy consultant?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An AI strategy consultant helps a business develop a coherent plan for
              adopting AI: what to automate, in what order, with what tools, and at what
              cost. This includes assessing current workflow gaps, identifying the
              highest-leverage AI applications, and building a roadmap that does not
              require overhauling everything at once.
            </p>
            <p>
              For most UK trades and professional services businesses, the strategy starts
              with front-of-funnel automation (lead capture, qualification, follow-up)
              because that is where the largest number of opportunities currently fall
              through. It then expands to SEO and AI search visibility so that the
              improved conversion system has a growing volume of leads to work with.
              These two things compound each other.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q4">
          <h2 id="q4" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How is an artificial intelligence consultant different from a digital marketing consultant?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              A digital marketing consultant focuses on channels: SEO, paid ads, social
              media, email. An artificial intelligence consultant focuses on the systems
              behind those channels: the agent that responds to enquiries, the automation
              that follows up leads, the AI search optimisation that makes the business
              appear in generative AI answers.
            </p>
            <p>
              These two disciplines are converging. A business that has both working
              together -- AI handling operations while SEO and AI search drive visibility
              -- has a structural advantage over businesses that treat them separately.
              Khamare Clarke combines both: the SEO and AI search expertise that gets a
              business found, and the AI systems expertise that ensures enquiries convert
              once they arrive.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q5">
          <h2 id="q5" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What does Khamare Clarke offer as an AI adviser?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
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
            <p>
              The MSc in Computer Science with Artificial Intelligence at Keele University
              (completing 2027) and the BSc in Software Engineering ground this work in
              how these systems actually behave. The practical application is informed by
              the technical reality, which produces better outcomes than advice based
              purely on tool demos and vendor claims.
            </p>
          </div>
        </section>

        {/* AI expert / advisor synonym section */}
        <section className="mt-12" aria-labelledby="synonyms-consultant">
          <h2 id="synonyms-consultant" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            AI expert, AI adviser, AI specialist: what these terms mean in practice
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Businesses searching for an AI expert, AI adviser, or AI specialist are
              typically looking for someone who can tell them what to build, help them
              build it, and be accountable for the outcome. The labels differ slightly:
              "AI expert" implies deep knowledge, "AI adviser" implies a strategic or
              consultancy relationship, "AI specialist" implies hands-on technical
              capability. In practice, a small or medium business needs all three from
              the same person.
            </p>
            <p>
              An artificial intelligence consultant serving a UK SME is not primarily
              a researcher or an academic. The work is applied: deploy a system that
              responds to enquiries overnight, connect it to the CRM, make the business
              visible in AI search results, and report on what changed. That is the
              scope of AI advisory work at the level where it produces measurable
              commercial results within months rather than years.
            </p>
          </div>
        </section>

        <nav className="mt-16 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8" aria-label="Related expertise">
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-agents", label: "AI agents and AI receptionists for UK businesses" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation -- AEO and GEO" },
              { href: "/expertise/seo", label: "SEO specialist" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO" },
              { href: "/about", label: "About Khamare Clarke" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors flex items-center gap-2 text-sm">
                  <span className="text-[#ffb700]">--</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 bg-[#1a1a1a] border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to talk about AI adoption for your business?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy call. We will look at your current
            operations, identify where AI would have the most immediate impact,
            and give you an honest picture of what implementation involves.
          </p>
          <CTAButton eventLabel="expertise_ai_consultant_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
