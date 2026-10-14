// src/app/expertise/ai-search-optimisation/page.js

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
  title: "AEO and GEO Specialist UK | AI Search Optimisation | Khamare Clarke",
  description:
    "Answer engine optimisation (AEO) and generative engine optimisation (GEO) for UK businesses. Get cited by ChatGPT, Gemini, and Perplexity alongside Google rankings.",
  alternates: {
    canonical: "https://khamareclarke.com/expertise/ai-search-optimisation",
  },
  openGraph: {
    title: "AEO and GEO Specialist UK | AI Search Optimisation | Khamare Clarke",
    description:
      "Answer engine optimisation (AEO) and generative engine optimisation (GEO) for UK businesses. Get cited by ChatGPT, Gemini, and Perplexity alongside Google rankings.",
    url: "https://khamareclarke.com/expertise/ai-search-optimisation",
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
      name: "What is answer engine optimisation (AEO)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Answer engine optimisation (AEO) is the practice of structuring a website's content so that search engines and AI models surface it as a direct answer to a user's question. Where traditional SEO aims to rank a URL in a list of results, AEO aims to have the content itself quoted or summarised in featured snippets, voice search results, and AI-generated overviews.",
      },
    },
    {
      "@type": "Question",
      name: "What is generative engine optimisation (GEO)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generative engine optimisation (GEO) is the process of making a business or website more likely to be cited by large language models such as ChatGPT, Gemini, and Perplexity when they generate answers. It involves building topical authority, establishing entity recognition, structuring data with schema markup, and ensuring the content is factually precise and easily attributable.",
      },
    },
    {
      "@type": "Question",
      name: "How do ChatGPT, Gemini, and Perplexity decide which businesses to cite?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI models draw on a combination of training data, live web retrieval, and entity relationships. Businesses that appear frequently in authoritative sources, are referenced consistently across the web, have clear structured data identifying who they are and what they do, and produce content that directly answers specific questions are more likely to be cited. There is no single ranking factor — it is a question of entity authority across multiple signals.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between SEO and GEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Traditional SEO optimises pages to rank in a list of ten results. GEO optimises a business to be cited within an AI-generated answer, which may not link to a list at all. The underlying content principles overlap — clear, authoritative, well-structured writing — but GEO places far greater emphasis on entity recognition, schema markup, and topical coverage than classical keyword-focused SEO.",
      },
    },
    {
      "@type": "Question",
      name: "How do you optimise for AI Overviews in Google Search?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google's AI Overviews pull from pages that Google already trusts for a given topic. The core requirements are: demonstrating first-hand expertise through original content, using question-and-answer page structures that match the query intent, implementing structured data (FAQ, HowTo, Article schema), maintaining factual accuracy with citable sources, and building the authority signals (links, mentions, reviews) that tell Google the source is trustworthy.",
      },
    },
    {
      "@type": "Question",
      name: "How much does AI search optimisation cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For businesses that already have traditional SEO handled and want to focus specifically on AI search visibility, a scoped project can be discussed. Book a free strategy call to get an accurate assessment for your specific situation.",
      },
    },
  ],
};

export default function AISearchOptimisationPage() {
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
                AI Search Optimisation{" "}
                <span className="gold-text">— AEO and GEO Explained</span>
              </>
            }
          />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            Your customers are searching on ChatGPT, Gemini, and Perplexity as
            well as Google. If your business is not showing up there, a growing
            share of demand is going to whoever is.
          </p>

        {/* Q1 */}
        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What is <span className="gold-text">answer engine optimisation (AEO)</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Answer engine optimisation (AEO) is the practice of structuring a
              website's content so that search engines and AI models surface it
              as a direct answer to a user's question. Where traditional SEO
              aims to rank a URL in a list of results, AEO aims to have the
              content itself quoted or summarised — in featured snippets, voice
              search results, and AI-generated overviews.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The technical implementation involves question-and-answer content
              architecture, FAQ and HowTo schema markup, concise paragraph
              openings that answer the question in one or two sentences before
              expanding, and factual precision that makes the content safe for
              a model to cite. Vague, fluffy content does not get quoted.
              Precise, attributable content does.
            </p>
          </div>
        </section>

        {/* Q2 */}
        <section className="mt-12" aria-labelledby="q2">
          <SectionHeading id="q2">
            What is <span className="gold-text">generative engine optimisation (GEO)</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Generative engine optimisation (GEO) is the process of making a
              business more likely to be cited by large language models — ChatGPT,
              Gemini, Perplexity, and others — when they generate answers to
              user queries. It goes beyond keyword optimisation into entity
              recognition: teaching AI models who you are, what you do, where
              you operate, and why you are authoritative.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              GEO involves building topical authority (owning a subject across
              many related pages), establishing the business as a recognised
              entity in structured data and knowledge graphs, ensuring
              consistent name, address, and contact information across the web,
              and creating content at a level of specificity and accuracy that
              a model can safely quote without risk of error.
            </p>
          </div>
        </section>

        {/* Q3 */}
        <section className="mt-12" aria-labelledby="q3">
          <SectionHeading id="q3">
            How do <span className="gold-text">ChatGPT, Gemini, and Perplexity</span> decide which businesses to cite?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              AI models draw on a combination of training data, live web
              retrieval (in models with browsing enabled), and entity
              relationships. Businesses that appear frequently in authoritative
              sources, are referenced consistently across the web, have clear
              structured data identifying who they are and what they do, and
              produce content that directly answers specific questions are more
              likely to be cited.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              There is no single ranking factor the way there is in traditional
              SEO. It is a question of entity authority across multiple signals:
              how many times has a source been cited elsewhere, is it consistent
              with what the model knows about the topic, does the content
              demonstrate genuine expertise rather than surface-level coverage?
              The businesses that win in AI search are those that have built
              real depth on their subject, not those who have optimised for
              keyword density.
            </p>
          </div>
        </section>

        {/* Q4 */}
        <section className="mt-12" aria-labelledby="q4">
          <SectionHeading id="q4">
            What is the difference between <span className="gold-text">SEO and GEO</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Traditional SEO optimises pages to rank in a list of ten results.
              GEO optimises a business to be cited within an AI-generated
              answer, which may not link to a ranked list at all — the AI just
              tells the user what it knows. The user never sees the search
              results page.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The underlying content principles overlap: clear, authoritative,
              well-structured writing is good for both. But GEO places far
              greater emphasis on entity recognition (schema markup, knowledge
              graph presence, consistent entity mentions across the web) and
              topical coverage (owning every relevant question in your niche)
              than classical keyword-focused SEO. A page can rank on Google
              for a keyword without being cited by an AI, and a business can
              be cited by AI without ranking for keywords. The ideal is both.
            </p>
          </div>
        </section>

        {/* Q5 */}
        <section className="mt-12" aria-labelledby="q5">
          <SectionHeading id="q5">
            How do you optimise for <span className="gold-text">AI Overviews</span> in Google Search?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Google's AI Overviews pull from pages that Google already trusts
              for a given topic. The core requirements are: demonstrating
              first-hand expertise through original content that could only come
              from someone with genuine experience, using question-and-answer
              page structures that match the query intent, and implementing
              structured data — FAQ, HowTo, and Article schema — so Google
              understands the content type.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              Factual accuracy matters more here than in standard organic
              rankings. Google is putting its own reputation behind the answer
              it surfaces in an Overview, so it selects sources that are
              consistent, credible, and specific. Vague marketing copy does not
              get pulled. Precise, verifiable information written by someone
              who knows the subject does.
            </p>
          </div>
        </section>

        {/* Q6 */}
        <section className="mt-12" aria-labelledby="q6">
          <SectionHeading id="q6">
            How much does <span className="gold-text">AI search optimisation</span> cost?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Google rankings and AI search visibility are handled together,
              because separating the two produces worse results for both.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              For businesses that already have traditional SEO handled and want
              to focus specifically on AI search visibility and entity authority,
              a scoped project can be discussed. Book a strategy call and bring
              the current state of your site — that is the fastest way to get
              an accurate picture of what needs doing and what it will cost.
            </p>
          </div>
        </section>

        {/* Synonym coverage */}
        <section className="mt-12" aria-labelledby="synonyms-ai-search">
          <SectionHeading id="synonyms-ai-search">
            <span className="gold-text">AEO specialist</span>, GEO consultant, AI visibility expert: different names for the same emerging discipline
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Answer engine optimisation (AEO) and generative engine optimisation (GEO) are terms that describe the
              same practice from slightly different angles. AEO focuses on getting a business cited as the answer
              to a specific question in an AI response. GEO focuses on the broader goal of visibility across
              generative AI environments. An AEO specialist, GEO consultant, or AI visibility expert is someone who
              understands how retrieval-augmented generation works, what signals AI crawlers prioritise, and how
              to structure content and entity data so that a business becomes the source an AI engine reaches for.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              "Generative search optimisation" is another way to describe this discipline. All of these labels
              converge on the same technical reality: getting a business into the training data, crawl data, and
              retrieval index that AI engines use to construct their answers. The technical foundations are the same
              whether the query lands in ChatGPT, Gemini, Perplexity, or the AI Overviews panel at the top of a
              Google results page.
            </p>
          </div>
        </section>

        {/* Internal links */}
        <Card as="nav" aria-label="Related expertise" className="reveal mt-16" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/seo", label: "SEO specialist — what a specialist does" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO" },
              { href: "/expertise/ai-agents", label: "AI agents for UK businesses" },
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
              Find out where your business stands in <span className="gold-text">AI search.</span>
            </>
          }
          body="Book a free 30-minute strategy call. We will look at your current visibility in Google and AI engines and map out what it would take to build a presence that compounds over time."
        >
          <CTAButton eventLabel="expertise_ai_search_cta" caption="Why AI doesn't mention you.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
