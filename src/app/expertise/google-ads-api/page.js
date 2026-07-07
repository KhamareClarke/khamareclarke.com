// src/app/expertise/google-ads-api/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA } from "../../../lib/schema";

export const metadata = {
  title: "Google Ads API Specialist UK | Khamare Clarke",
  description:
    "Google Ads API management for UK businesses. Programmatic campaign control, custom bidding logic, and automated reporting built by an engineer who understands both the API and the marketing.",
  alternates: {
    canonical: "https://khamareclarke.com/expertise/google-ads-api",
  },
  openGraph: {
    title: "Google Ads API Specialist UK | Khamare Clarke",
    description:
      "Google Ads API management for UK businesses. Programmatic campaign control, custom bidding logic, and automated reporting built by an engineer who understands both the API and the marketing.",
    url: "https://khamareclarke.com/expertise/google-ads-api",
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
      name: "What is the Google Ads API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Google Ads API is the programmatic interface that allows developers to manage Google Ads accounts directly through code, rather than through the standard web interface. It enables automated campaign creation, bid adjustments, keyword management, reporting, and budget optimisation at a level of speed and precision that is not possible through the standard Google Ads dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "Why does running ads through the API produce better results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The API removes the bottleneck of manual campaign management. Changes that would take hours to implement manually across multiple campaigns and ad groups can be executed in seconds through code. Custom bidding logic can be applied based on business-specific signals — time of day, stock availability, CRM data, weather, competitor activity — that the standard interface cannot access. Reporting can be pulled into any system the business already uses, rather than being locked in the Google Ads dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "How does ads engineering differ from a standard agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A standard agency manages campaigns through the Google Ads interface and applies changes manually. Ads engineering means writing code that manages those campaigns automatically: dynamic keyword insertion drawn from a live product feed, bid modifiers calculated from conversion data at the hour level, automatic budget reallocation between campaigns based on performance thresholds, and custom alerts when anomalies appear. The difference in output compounds over time.",
      },
    },
    {
      "@type": "Question",
      name: "What campaigns benefit most from the Ads API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any campaign with a large and frequently-changing keyword set benefits from API management: e-commerce with broad product ranges, property and recruitment, local services across multiple geographic areas, and any business running simultaneous campaigns across multiple markets. The API is also particularly valuable for lead generation campaigns where conversion data needs to feed back into bidding in near-real-time.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Ads API management cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ads API management is included in Khamare Clarke's Own The Market retainer (from £2,500/mo), which covers SEO, AI search optimisation, and paid search engineering together. For businesses that want Ads API management as a standalone service, scoped project work can be discussed based on account size and complexity. Book a strategy call to discuss your current account and what automation would achieve.",
      },
    },
  ],
};

export default function GoogleAdsAPIPage() {
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
          Google Ads via the Ads API{" "}
          <span className="text-[#ffb700]">
            — What Ads Engineering Actually Means
          </span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          Most agencies manage Google Ads through a dashboard. Ads engineering
          means writing the code that manages it automatically, at a speed and
          precision no manual process can match.
        </p>

        {/* Q1 */}
        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What is the Google Ads API?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              The Google Ads API is the programmatic interface that allows
              developers to manage Google Ads accounts directly through code,
              rather than through the standard web dashboard. It provides access
              to every element of a campaign: keywords, bids, ad copy, audience
              targeting, budget allocation, and performance data — all
              addressable through API calls that can be automated, scheduled,
              and integrated with other data sources.
            </p>
            <p>
              Google built the API for agencies and large advertisers who manage
              too much volume to operate manually. In practice, it is
              underused — most agencies do not have engineers on the team. That
              creates an advantage for businesses that do.
            </p>
          </div>
        </section>

        {/* Q2 */}
        <section className="mt-12" aria-labelledby="q2">
          <h2 id="q2" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Why does running ads through the API produce better results?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              The API removes the bottleneck of manual campaign management.
              Changes that would take hours to implement manually across
              multiple campaigns — adjusting bids by device and time of day,
              pausing underperforming keywords, pushing new ad variations for
              A/B testing — can be executed in seconds through code, running
              on a schedule or triggered by real-time data.
            </p>
            <p>
              More importantly, the API allows custom bidding logic that the
              standard interface cannot replicate. Bids can be adjusted based
              on business-specific signals: CRM data showing which customer
              segments convert at the highest value, inventory levels, weather
              data for seasonal businesses, or competitor price changes. The
              standard Google Smart Bidding system does not know about any of
              these factors. Your own code does.
            </p>
          </div>
        </section>

        {/* Q3 */}
        <section className="mt-12" aria-labelledby="q3">
          <h2 id="q3" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How does ads engineering differ from a standard agency?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              A standard agency manages campaigns through the Google Ads
              interface. Changes are made manually, during business hours, by
              an account manager who is juggling several other accounts at the
              same time. The feedback loop between seeing a performance issue
              and fixing it is measured in days.
            </p>
            <p>
              Ads engineering means writing code that manages those campaigns
              automatically: dynamic keyword insertion drawn from a live product
              or service feed, bid modifiers calculated from conversion data at
              the hour level, automatic budget reallocation between campaigns
              based on performance thresholds, and custom alert systems that
              flag anomalies the moment they appear. The output at month six
              is different from what a manually-managed account produces —
              not because of effort, but because of compounding optimisation
              cycles.
            </p>
          </div>
        </section>

        {/* Q4 */}
        <section className="mt-12" aria-labelledby="q4">
          <h2 id="q4" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What campaigns benefit most from the Ads API?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Any campaign with a large and frequently-changing keyword set
              benefits from API management: e-commerce with broad product
              ranges, property and recruitment, local services across multiple
              geographic areas, and any business running simultaneous campaigns
              across multiple markets or product lines.
            </p>
            <p>
              Lead generation campaigns benefit particularly from API
              integration because conversion data — who became a customer, at
              what value, from which keyword — can feed back into the bidding
              model in near-real-time. A standard agency passes conversion
              events from a form submission. An API-connected system can pass
              the full customer lifetime value from the CRM, so the bidding
              model optimises for the customers who actually matter, not just
              the ones who fill in a form.
            </p>
          </div>
        </section>

        {/* Q5 */}
        <section className="mt-12" aria-labelledby="q5">
          <h2 id="q5" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How much does Ads API management cost?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Ads API management is included in the{" "}
              <strong className="text-white">Own The Market</strong> retainer
              (from £2,500/mo), which brings together SEO, AI search
              optimisation, and paid search engineering as a single integrated
              system. When SEO and paid search are managed by the same person
              working from the same data, keyword and audience decisions do not
              contradict each other.
            </p>
            <p>
              For businesses that want Ads API management as a standalone
              service — for example, an existing client of a full-service agency
              that wants better technical execution on the ads side — scoped
              project work can be discussed based on account size, campaign
              count, and the level of automation required. Book a strategy call
              and bring the current account structure. That is the fastest way
              to get an accurate scope.
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
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO" },
              { href: "/expertise/ai-agents", label: "AI agents for UK businesses" },
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
            Want better performance from your Google Ads spend?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy call. Bring your current account
            and spend data. We will identify where the inefficiencies are and
            what API-level automation would change.
          </p>
          <CTAButton eventLabel="expertise_google_ads_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
