// src/app/expertise/google-ranking/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../../lib/schema";

export const metadata = {
  title: "Rank Number One on Google UK | Khamare Clarke -- Stoke-on-Trent",
  description:
    "Rank number one on Google for searches that produce revenue. Not vanity keywords -- commercial queries with buyer intent. UK businesses, all industries. Based in Stoke-on-Trent with a ranked-or-refunded guarantee.",
  alternates: { canonical: "https://khamareclarke.com/expertise/google-ranking" },
  openGraph: {
    title: "Rank Number One on Google UK | Khamare Clarke",
    description:
      "Rank number one on Google for searches that produce revenue. Not vanity keywords -- commercial queries with buyer intent.",
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
      name: "How long does it take to rank number one on Google?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The honest answer depends on the competitiveness of the keyword and the current state of the site. For a local service business targeting a town-level or borough-level keyword with low to medium competition -- 'plumber Stoke-on-Trent', 'accountant Leeds', 'solicitor Manchester' -- a new or improved site with the right technical foundation can reach the top five within 90 days and top three within six months. For more competitive regional or national terms, the timeline is longer: 6 to 18 months depending on the gap between your current authority and the competition. The ranked-or-refunded guarantee applies to agreed target keywords on agreed timelines.",
      },
    },
    {
      "@type": "Question",
      name: "What does ranking number one on Google actually mean for revenue?",
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
      name: "What is the ranked-or-refunded guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The ranked-or-refunded guarantee means that on all retainer tiers, agreed target search terms come with a ranking guarantee: if those specific terms are not ranked to the agreed position within the agreed timeframe, the retainer continues without charge until they are. The target keywords and positions are agreed in writing before work begins, so there is no ambiguity about what the guarantee covers. This guarantee is not offered by most agencies because most agencies do not have enough confidence in their own technical work to back it commercially.",
      },
    },
  ],
};

export default function GoogleRankingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
          Rank Number One on Google{" "}
          <span className="text-[#ffb700]">-- The Outcome, Not the Process</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          Business owners do not search for SEO. They search for a way to appear first
          when their customers are looking for what they sell. This page is about that
          outcome: the first position in Google results for searches that produce revenue
          -- with a ranked-or-refunded guarantee on agreed target terms.
        </p>

        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What ranking number one actually changes
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Position one on Google captures approximately 27 to 30 per cent of all
              clicks for a given search query. Position three captures around 11 per cent.
              Below position five, click-through rates drop sharply. For most UK service
              businesses, this means that the business ranking first for their core
              commercial keyword receives three times more organic traffic than the
              business in position three -- from the same pool of buyers.
            </p>
            <p>
              The commercial impact is straightforward to calculate. If 500 people per
              month search for your service in your area, and your site converts 10 per
              cent of visitors to enquiries, and you close half of those: position one
              produces 25 new customers per month from that one keyword alone. Position
              five produces four. That gap compounds every month the difference persists.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="how-ranking-works">
          <h2 id="how-ranking-works" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What producing a first-place ranking requires
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Technical foundation", "A fast, crawlable, mobile-first site with correct structured data and a clean internal link structure. Without this, content and links cannot do their job."],
              ["On-page relevance", "Pages written for the searcher's intent at the query level -- not generic service descriptions, but pages that answer the specific question the buyer is asking."],
              ["Authority signals", "External links and citations from relevant sources that tell Google the site is trusted in its category and geography."],
              ["Local signals", "Google Business Profile, NAP consistency, local citations, and review volume for businesses targeting town and city-level queries."],
              ["Core Web Vitals", "Page speed, layout stability, and interactivity scores that meet Google's technical ranking signals. Measured and tracked from launch."],
              ["Structured data", "JSON-LD markup (FAQPage, LocalBusiness, Service, BreadcrumbList) that gives Google explicit signals about page content and entity relationships."],
            ].map(([title, body]) => (
              <div key={title} className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-xl p-5">
                <p className="text-[#ffb700] font-semibold text-sm mb-2">{title}</p>
                <p className="text-[#ADB7BE] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="timeline">
          <h2 id="timeline" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Realistic timelines
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              For a local service business targeting a town-level keyword with low to
              medium competition -- a trades business, a professional services firm,
              a local retailer -- a site with the right technical foundation can reach
              the top five within 90 days and top three within six months. The 538 per
              cent growth in Google Business Profile interactions for a Staffordshire
              roofing business was achieved in 90 days, with more than 30 qualified
              inbound calls in the first two weeks.
            </p>
            <p>
              For more competitive regional or national terms, the timeline is longer:
              typically 6 to 18 months depending on the gap between the site's current
              authority and the sites holding the top positions. The ranked-or-refunded
              guarantee applies to agreed target keywords on agreed timelines -- agreed
              before work begins, in writing, with no ambiguity about what is being
              guaranteed.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q3">
          <h2 id="q3" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Google ranking and AI search
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Google still handles the overwhelming majority of UK search queries. The
              businesses that appear in Google AI Overviews -- the AI-generated summaries
              at the top of an increasing proportion of search results -- are predominantly
              the same businesses that rank well organically. The technical work that
              produces Google rankings also produces citations in ChatGPT, Gemini,
              Perplexity, and Google AI Overviews.
            </p>
            <p>
              Traditional search ranking and AI search optimisation are not alternatives.
              A business that does both from the start is visible to traditional
              searchers who click through to pages, and to AI model users who receive
              a summarised answer. Both audiences convert; neither should be sacrificed
              to serve the other.
            </p>
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
              { href: "/expertise/seo", label: "SEO specialist -- the technical detail" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO -- engineered pages that scale" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation -- AEO and GEO" },
              { href: "/expertise/web-design-development", label: "Web design and development" },
              { href: "/expertise/ai-implementation", label: "AI implementation -- the full system" },
              { href: "/expertise/digital-marketing", label: "Digital marketing" },
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
            Ready to appear first when your customers are searching?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute call. We will look at your current rankings,
            identify the highest-value keywords you are not holding, and give you
            an honest picture of what closing that gap requires.
          </p>
          <CTAButton eventLabel="expertise_google_ranking_cta" caption="Ranked-or-refunded guarantee on agreed terms.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
