// src/app/expertise/ai-content-systems/page.js

import Link from "next/link";
import PageShell from "../../components/PageShell";
import PageHero from "../../components/ui/PageHero";
import SectionHeading from "../../components/ui/SectionHeading";
import CtaPanel from "../../components/ui/CtaPanel";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../../lib/schema";

export const metadata = {
  title: "AI Content Systems UK | Khamare Clarke | Stoke-on-Trent",
  description:
    "AI-assisted content strategy and production at scale for UK businesses. Content built for search intent and AI search visibility, not just volume. Stoke-on-Trent, serving the whole of the UK.",
  alternates: { canonical: "https://khamareclarke.com/expertise/ai-content-systems" },
  openGraph: {
    title: "AI Content Systems UK | Khamare Clarke",
    description:
      "AI-assisted content strategy and production at scale. Built for search intent and AI search visibility.",
    url: "https://khamareclarke.com/expertise/ai-content-systems",
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
      name: "What is an AI content system?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI content system is a structured pipeline for producing content at scale using AI assistance, without sacrificing accuracy, brand voice, or search intent alignment. It combines a content strategy (which topics, in what order, targeting which search queries and AI model citation patterns) with a production process (research, drafting, editing, structured data, publishing) that uses AI to reduce the time cost of output while keeping a human in control of accuracy and relevance. The result is more content, produced faster, structured for both Google and AI search -- without producing noise.",
      },
    },
    {
      "@type": "Question",
      name: "How is AI-assisted content different from AI-generated content?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI-generated content is produced by an AI model with minimal human input and often minimal editorial oversight. The output volume is high; the accuracy and relevance are inconsistent. AI-assisted content uses AI as a production tool within a structured editorial process: the strategy is set by a human, the briefs are written by a human, the output is reviewed and edited by a human before publication. The AI handles the structural drafting that would otherwise make scale prohibitively time-consuming. The difference in quality -- and in search performance -- is significant.",
      },
    },
    {
      "@type": "Question",
      name: "What types of content are produced?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Content produced includes: service and location pages for programmatic SEO (hundreds of unique, accurate pages from structured data), long-form expertise and FAQ pages targeting informational and commercial queries, blog posts targeting search intent with FAQPage and Article structured data, glossary pages for entity signals and AI search citation, and email campaigns for lead nurturing. All content is written in UK English, structured for crawlability, and marked up with JSON-LD structured data for both traditional search and AI model citation.",
      },
    },
    {
      "@type": "Question",
      name: "How does content connect to AI search optimisation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI models -- ChatGPT, Gemini, Perplexity, Google AI Overviews -- cite content that states facts clearly, is structured for easy extraction, and comes from sources they have indexed as authoritative. An AI content system is built from the start with these citation patterns in mind: FAQPage schema on every relevant page, DefinedTerm schema on glossary entries, clear topic clusters that signal expertise on a subject, and entity consistency across pages so AI models can build a reliable picture of what the business does and who it serves.",
      },
    },
  ],
};

export default function AIContentSystemsPage() {
  return (
    <PageShell
      schema={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
                AI Content Systems{" "}
                <span className="gold-text">| Scale Without Noise</span>
              </>
            }
          />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            Content volume without strategic structure produces noise: pages that do not
            rank, do not convert, and are not cited by AI models. An AI content system
            is the opposite: a structured pipeline that produces accurate, search-intent-aligned
            content at a pace no manual process can match -- and structured from the first
            page for both Google and AI search visibility.
          </p>

        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What an <span className="gold-text">AI content system</span> is
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An AI content system is a structured pipeline for producing content at
              scale, using AI assistance to reduce the time cost of output without
              sacrificing accuracy, brand voice, or intent alignment. It is not a
              prompt-and-publish process. It combines a content strategy -- which
              topics, in what order, targeting which search queries and AI model
              citation patterns -- with a production process that keeps a human in
              control of accuracy and relevance.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The distinction from raw AI-generated content is significant. AI-generated
              content produces volume; AI-assisted content within a structured editorial
              process produces output that ranks, converts, and gets cited. The AI
              handles drafting. The strategy, the brief, the review, and the structured
              data markup are done by a person who understands what the page needs to do.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="content-types">
          <SectionHeading id="content-types">
            Content <span className="gold-text">types produced</span>
          </SectionHeading>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Service and location pages", "Programmatic pages at scale: accurate, unique content for every service-by-location combination. Built to rank for local commercial queries."],
              ["Expertise and FAQ pages", "Long-form pages targeting informational and commercial queries with FAQPage structured data for AI Overviews and AI model citation."],
              ["Glossary and definition pages", "DefinedTerm schema pages that build entity signals and get cited by AI models as authoritative definitions of specialist terms."],
              ["Blog and editorial content", "Search-intent-led posts with Article schema, structured for both traditional ranking and AI search visibility."],
              ["Email and nurture content", "Follow-up sequences and campaign copy that converts warm leads without requiring manual writing for every send."],
              ["Structured data markup", "JSON-LD implementation across all content types: FAQPage, Article, DefinedTerm, BreadcrumbList, WebPage."],
            ].map(([title, body], index) => (
              <Card key={title} className="reveal" style={{ "--rv-delay": `${index * 110}ms` }}>
                <p className="text-primary font-semibold text-sm mb-2">{title}</p>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q4">
          <SectionHeading id="q4">
            Content and <span className="gold-text">AI search visibility</span>
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              AI models cite content that states facts clearly, is structured for easy
              extraction, and comes from sources they have indexed as authoritative.
              An AI content system is built from the start with these citation patterns
              in mind. FAQPage schema on every relevant page. DefinedTerm schema on
              glossary entries. Topic clusters that signal expertise on a subject.
              Entity consistency across pages so AI models can build a reliable picture
              of what the business does and who it serves.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The growing proportion of searches answered by AI-generated summaries --
              in ChatGPT, Gemini, Perplexity, and Google AI Overviews -- means that
              content not structured for these patterns is invisible to a segment that
              is expanding every quarter. Content strategy now has two audiences:
              traditional search users who click through to pages, and AI models that
              summarise and cite. Both can be served by the same content if it is
              structured correctly.
            </p>
          </div>
        </section>

        <Card as="nav" aria-label="Related expertise" className="reveal mt-16" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-implementation", label: "AI implementation -- the full system" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation -- AEO and GEO" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO -- engineered pages that scale" },
              { href: "/expertise/seo", label: "SEO specialist" },
              { href: "/expertise/digital-marketing", label: "Digital marketing" },
              { href: "/expertise/web-design-development", label: "Web design and development" },
            ].map((l, index) => (
              <li key={l.href} className="reveal" style={{ "--rv-delay": `${index * 90}ms` }}>
                <Link href={l.href} className="text-muted hover:text-primary transition-colors flex items-center gap-2 text-sm">
                  <span className="text-primary">--</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <CtaPanel headingLevel="h2"
          className="mt-12"
          heading={
            <>
              Ready to build a <span className="gold-text">content system</span> that actually ranks?
            </>
          }
          body="Book a free 30-minute call. We will look at your current content, identify the highest-priority gaps, and outline what a structured AI content system would produce for your business."
        >
          <CTAButton eventLabel="expertise_ai_content_systems_cta" caption="The content you can't keep up with. What to automate.">
            Book Your Free Strategy Call
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
