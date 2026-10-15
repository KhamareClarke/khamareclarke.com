// src/app/expertise/google-ranking/page.js

import Link from "next/link";
import PageShell from "../../components/PageShell";
import PageHeroSplit from "../../components/ui/PageHeroSplit";
import AboutSection from "../../components/AboutSection";
import AchievementsSection from "../../components/AchievementsSection";
import SectionHeading from "../../components/ui/SectionHeading";
import CtaPanel from "../../components/ui/CtaPanel";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import CTAButton from "../../components/CTAButton";

export const metadata = {
  title: "Google Ranking & SEO Services UK | Khamare Clarke | Stoke-on-Trent",
  description:
    "SEO focused on improving visibility for commercially valuable searches. Priorities, deliverables and progress agreed in writing. Based in Stoke-on-Trent.",
  alternates: { canonical: "https://khamareclarke.com/expertise/google-ranking" },
  openGraph: {
    title: "Google Ranking & SEO Services UK | Khamare Clarke",
    description:
      "SEO focused on improving visibility for commercially valuable searches. Priorities, deliverables and progress agreed in writing.",
    url: "https://khamareclarke.com/expertise/google-ranking",
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
      name: "How long does SEO take to show results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The honest answer depends on the competitiveness of the keyword and the current state of the site. For a local service business targeting a town-level or borough-level keyword with low to medium competition -- 'plumber Stoke-on-Trent', 'accountant Leeds', 'solicitor Manchester' -- a new or improved site with the right technical foundation can reach the top five within 90 days and top three within six months. For more competitive regional or national terms, the timeline is longer: 6 to 18 months depending on the gap between your current authority and the competition. The priorities, deliverables and progress for a campaign are agreed in writing before work begins, and reported monthly.",
      },
    },
    {
      "@type": "Question",
      name: "What does better Google visibility mean for revenue?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Position one on Google captures approximately 27-30% of all clicks for a given search query. Position two captures around 15%. Position three captures around 11%. Below position five, click-through rates drop sharply. For a local service business, ranking first for 'service + town' queries means a significant proportion of everyone searching for that service in that area sees and clicks through to the business first. The commercial impact depends on the search volume and conversion rate, but for most UK service businesses, a first-place ranking for a core commercial keyword is worth tens of thousands of pounds in annual revenue.",
      },
    },
    {
      "@type": "Question",
      name: "Is Google ranking still worth pursuing with AI search growing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Google still handles the overwhelming majority of UK search queries, and the businesses that appear in AI Overviews and the local pack are predominantly the same businesses that rank well organically. AI search optimisation (AEO and GEO) and traditional Google ranking are not alternatives -- they are complementary. The technical work that produces Google rankings -- fast pages, structured data, authoritative content, strong entity signals -- is also the work that produces citations in ChatGPT, Gemini, Perplexity, and Google AI Overviews. Doing both from the start is more efficient than treating them as separate projects.",
      },
    },
    {
      "@type": "Question",
      name: "How do you measure SEO progress?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We agree the search priorities and work to be delivered before starting. Each month, you'll see what's been completed, how your search visibility is changing and what we're working on next. Rankings can fluctuate, so the focus is on measurable progress rather than promises of a particular position.",
      },
    },
  ],
};

export default function GoogleRankingPage() {
  return (
    <PageShell
      schema={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </>
      }
    >
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="main">
          <PageHeroSplit
            eyebrow="Expertise"
            size="feature"
            title={
              <>
                Get Found on Google.{" "}
                <span className="gold-text">Win More Business.</span>
              </>
            }
          />
        </Container>

        <Container size="narrow" className="text-center [&_p]:mx-auto">

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection dense />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            Business owners do not search for SEO. They search for a way to appear when
            their customers are looking for what they sell. This page is about that
            outcome: visibility in Google results for searches that produce revenue.
            Priorities, deliverables and progress are agreed in writing.
          </p>

        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What better Google visibility <span className="gold-text">means for your business.</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Position one on Google captures approximately 27 to 30 per cent of all
              clicks for a given search query. Position three captures around 11 per cent.
              Below position five, click-through rates drop sharply. For most UK service
              businesses, this means that the business ranking first for their core
              commercial keyword receives three times more organic traffic than the
              business in position three -- from the same pool of buyers.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The commercial impact is straightforward to calculate. If 500 people per
              month search for your service in your area, and your site converts 10 per
              cent of visitors to enquiries, and you close half of those: position one
              produces 25 new customers per month from that one keyword alone. Position
              five produces four. That gap compounds every month the difference persists.
            </p>
          </div>
        </section>

        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="how-ranking-works">
          <SectionHeading id="how-ranking-works">
            What producing strong <span className="gold-text">Google visibility requires</span>
          </SectionHeading>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Technical foundation", "A fast, crawlable, mobile-first site with correct structured data and a clean internal link structure. Without this, content and links cannot do their job."],
              ["On-page relevance", "Pages written for the searcher's intent at the query level -- not generic service descriptions, but pages that answer the specific question the buyer is asking."],
              ["Authority signals", "External links and citations from relevant sources that tell Google the site is trusted in its category and geography."],
              ["Local signals", "Google Business Profile, NAP consistency, local citations, and review volume for businesses targeting town and city-level queries."],
              ["Core Web Vitals", "Page speed, layout stability, and interactivity scores that meet Google's technical ranking signals. Measured and tracked from launch."],
              ["Structured data", "JSON-LD markup (FAQPage, LocalBusiness, Service, BreadcrumbList) that gives Google explicit signals about page content and entity relationships."],
            ].map(([title, body], index) => (
              <Card key={title} className="reveal" style={{ "--rv-delay": `${index * 110}ms` }}>
                <p className="gold-text font-semibold text-sm mb-2">{title}</p>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="timeline">
          <SectionHeading id="timeline">
            Realistic <span className="gold-text">timelines</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              For a local service business targeting a town-level keyword with low to
              medium competition -- a trades business, a professional services firm,
              a local retailer -- a site with the right technical foundation can reach
              the top five within 90 days and top three within six months. The 538 per
              cent growth in Google Business Profile interactions for a Staffordshire
              roofing business was achieved in 90 days, with more than 30 qualified
              inbound calls in the first two weeks.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              For more competitive regional or national terms, the timeline is longer:
              typically 6 to 18 months depending on the gap between the site's current
              authority and the sites holding the top positions. Priorities, deliverables
              and progress are agreed in writing before work begins, so there is no
              ambiguity about what is being worked towards.
            </p>
          </div>
        </section>

        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="q3">
          <SectionHeading id="q3">
            Google ranking <span className="gold-text">and AI search</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Google still handles the overwhelming majority of UK search queries. The
              businesses that appear in Google AI Overviews -- the AI-generated summaries
              at the top of an increasing proportion of search results -- are predominantly
              the same businesses that rank well organically. The technical work that
              produces Google rankings also produces citations in ChatGPT, Gemini,
              Perplexity, and Google AI Overviews.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              Traditional search ranking and AI search optimisation are not alternatives.
              A business that does both from the start is visible to traditional
              searchers who click through to pages, and to AI model users who receive
              a summarised answer. Both audiences convert; neither should be sacrificed
              to serve the other.
            </p>
          </div>
        </section>

        <hr aria-hidden="true" className="section-sep mt-12" />

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
              { href: "/expertise/seo", label: "SEO specialist -- the technical detail" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO -- engineered pages that scale" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation -- AEO and GEO" },
              { href: "/expertise/web-design-development", label: "Web design and development" },
              { href: "/expertise/ai-implementation", label: "AI implementation -- the full system" },
              { href: "/expertise/digital-marketing", label: "Digital marketing" },
            ].map((l, index) => (
              <li key={l.href} className="reveal" style={{ "--rv-delay": `${index * 90}ms` }}>
                <Link href={l.href} className="text-muted hover:gold-text transition-colors flex items-center gap-2 text-sm">
                  <span className="gold-text">--</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* The founder block. Placed here rather than under the hero: the
            hero already carries his portrait, and the same face again a screen
            later reads as a mistake. `showCta={false}` because CtaPanel follows. */}
        <AboutSection className="mt-16" showCta={false} />

        <CtaPanel headingLevel="h2"
          className="mt-16"
          heading={
            <>
              Ready to appear first when your <span className="gold-text">customers are searching?</span>
            </>
          }
          body="Book a free 30-minute call. We will look at your current rankings, identify the highest-value keywords you are not holding, and give you an honest picture of what closing that gap requires."
        >
          <CTAButton eventLabel="expertise_google_ranking_cta" caption="Priorities and deliverables agreed in writing.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
