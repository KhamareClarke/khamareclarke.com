// src/app/expertise/digital-marketing/page.js

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
  title: "Digital Marketing Consultant UK | Khamare Clarke | Stoke-on-Trent",
  description:
    "Digital marketing for UK businesses: search, paid, email, content, and automation -- all AI-enhanced. Working alongside your existing team. Based in Stoke-on-Trent, serving the whole of the UK.",
  alternates: { canonical: "https://khamareclarke.com/expertise/digital-marketing" },
  openGraph: {
    title: "Digital Marketing Consultant UK | Khamare Clarke",
    description:
      "Digital marketing for UK businesses: search, paid, email, content, and automation -- all AI-enhanced.",
    url: "https://khamareclarke.com/expertise/digital-marketing",
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
      name: "What does a digital marketing consultant do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A digital marketing consultant develops and executes strategy across the channels that drive revenue for a business: search (SEO and AI search), paid advertising, email, content, and automation. The emphasis is on the channels that match the business model and budget -- not the channels that are fashionable. For most UK small and medium businesses, this means local SEO and Google Business Profile as the foundation, with paid search for immediate volume, email automation for follow-up, and AI search optimisation for the growing proportion of searches answered by ChatGPT, Gemini, and Perplexity.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a digital marketing consultant and a digital marketing agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A digital marketing agency allocates your account to an account manager who coordinates between separate SEO, PPC, content, and social teams. A consultant does the work themselves or directs a small, specialist team. The practical difference is coherence and accountability: with a consultant, the strategy and the execution are held by the same person, which removes the translation layer where agency campaigns lose nuance and speed.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI change digital marketing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI changes digital marketing in two directions simultaneously. On the visibility side, search is shifting from ten blue links to AI-generated answers in ChatGPT, Gemini, Perplexity, and Google AI Overviews. Businesses that are not optimised for these answers are invisible to a growing proportion of searchers. On the operations side, AI agents can handle lead response, qualification, follow-up, and CRM updates that previously required staff time. The businesses that combine both -- AI-enhanced visibility and AI-handled operations -- have a compounding advantage over those that do not.",
      },
    },
    {
      "@type": "Question",
      name: "What digital marketing services are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Services cover: SEO and local SEO (Google rankings and Google Business Profile management), AI search optimisation (AEO and GEO for ChatGPT, Gemini, Perplexity, and AI Overviews), Google Ads managed via the Ads API, email marketing automation and lead nurturing, CRM setup and automation, content strategy and AI-assisted content production, web development, and AI agent deployment for lead handling. These are available individually or as an integrated retainer across all channels.",
      },
    },
  ],
};

export default function DigitalMarketingPage() {
  return (
    <PageShell
      schema={
        <>
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
                Digital Marketing{" "}
                <span className="gold-text">| All Channels, AI-Enhanced</span>
              </>
            }
          />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            Digital marketing works when the channels compound each other. SEO builds the
            organic base. Paid search adds volume. Email and CRM automation converts leads
            that would otherwise go cold. AI search optimisation covers the growing share
            of searches answered before anyone clicks. This is the full system, not a
            single-channel agency retainer.
          </p>

        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What a <span className="gold-text">digital marketing consultant</span> does
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              A digital marketing consultant develops and executes strategy across the
              channels that drive revenue for a specific business: search, paid
              advertising, email, content, and automation. The emphasis is on the
              channels that match the business model and budget, not the ones that are
              fashionable. For most UK small and medium businesses, that means local SEO
              and Google Business Profile as the foundation, with paid search for
              immediate volume, email automation for follow-up, and AI search
              optimisation for the growing proportion of searches answered by ChatGPT,
              Gemini, and Perplexity.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The difference from a digital marketing agency is coherence and
              accountability. With a consultant, the strategy and the execution are held
              by the same person. There is no account manager translating between the
              brief and the delivery team. Work moves faster, strategy stays coherent,
              and the person responsible for results is the person doing the work.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="channels-heading">
          <SectionHeading id="channels-heading">
            Channels <span className="gold-text">covered</span>
          </SectionHeading>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["SEO and local SEO", "Technical SEO, Google Business Profile, local citations, programmatic location pages. The foundation of organic visibility."],
              ["AI search optimisation", "AEO and GEO: entity signals and structured content that get cited in ChatGPT, Gemini, Perplexity, and AI Overviews."],
              ["Paid search", "Google Ads managed through the Ads API -- programmatic control, custom bidding, lower cost per lead."],
              ["Email and lead nurturing", "Automated sequences that follow up every enquiry until the prospect books or declines."],
              ["CRM automation", "Capture, qualify, route, and report on every lead without manual intervention."],
              ["Content and AI content", "Content strategy and AI-assisted production structured for search intent and AI search visibility."],
            ].map(([title, body], index) => (
              <Card key={title} className="reveal" style={{ "--rv-delay": `${index * 110}ms` }}>
                <p className="gold-text font-semibold text-sm mb-2">{title}</p>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q3">
          <SectionHeading id="q3">
            How <span className="gold-text">AI changes digital marketing</span>
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              AI changes digital marketing in two directions simultaneously. On the
              visibility side, search is shifting from ten blue links to AI-generated
              answers in ChatGPT, Gemini, Perplexity, and Google AI Overviews.
              Businesses that are not structured for these answers are invisible to a
              growing proportion of searchers, regardless of their traditional Google
              rankings.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              On the operations side, AI agents can handle lead response,
              qualification, follow-up, and CRM updates that previously required staff
              time. The businesses that combine both -- AI-enhanced visibility and
              AI-handled operations -- have a compounding advantage over those that
              treat them separately or ignore one entirely.
            </p>
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
              { href: "/expertise/ai-implementation", label: "AI implementation -- the full system" },
              { href: "/expertise/seo", label: "SEO specialist" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation -- AEO and GEO" },
              { href: "/expertise/google-ads-api", label: "Google Ads API" },
              { href: "/expertise/marketing-automation", label: "CRM and marketing automation" },
              { href: "/expertise/ai-content-systems", label: "AI content systems" },
              { href: "/expertise/google-ranking", label: "Google Ranking & SEO Services" },
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
          className="mt-12"
          heading={
            <>
              Ready to build the full <span className="gold-text">digital marketing system?</span>
            </>
          }
          body="Book a free 30-minute strategy call. We will identify which channels matter most for your business right now and what a coherent multi-channel system looks like in practice."
        >
          <CTAButton eventLabel="expertise_digital_marketing_cta" caption="Which channel is paying off.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
