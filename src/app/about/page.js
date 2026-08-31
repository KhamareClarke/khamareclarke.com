// src/app/about/page.js

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import CTAButton from "../components/CTAButton";
import { PERSON_SCHEMA } from "../../lib/schema";

export const metadata = {
  title: "About Khamare Clarke | AI Implementation Specialist in Stoke-on-Trent",
  description:
    "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent, Staffordshire. He implements AI across search, web, content, marketing, and automation for UK businesses, holding a BSc in Software Engineering, a BSc in Digital Marketing, and completing an MSc in Computer Science with AI at Keele University (2027).",
  alternates: { canonical: "https://khamareclarke.com/about" },
  openGraph: {
    title: "About Khamare Clarke | AI Implementation Specialist in Stoke-on-Trent",
    description:
      "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent, Staffordshire. He implements AI across search, web, content, marketing, and automation for UK businesses, holding a BSc in Software Engineering, a BSc in Digital Marketing, and completing an MSc in Computer Science with AI at Keele University (2027).",
    url: "https://khamareclarke.com/about",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "profile",
  },
};

const schemaLD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "https://khamareclarke.com/about",
  name: "About Khamare Clarke",
  url: "https://khamareclarke.com/about",
  mainEntity: { "@id": "https://khamareclarke.com/#person" },
};

const ventures = [
  "MyApproved",
  "InBoker",
  "Upgrade Roofing Solutions",
  "Leverage Journal",
  "SEOinforce",
  "Leverage Academy",
  "Alkhemmy Naturals",
  "Flip Republic",
  "OmniWTMS",
  "UAE Private Investor",
  "Identi Marketing",
  "Ads Starter",
  "Nelly Logistics",
  "MCB Media",
  "Queens Beauty Clinic",
  "City Plaza Abu Dhabi",
];

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLD) }}
      />

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        {/* Page label */}
        <div className="flex items-center gap-4 mb-8 h-4">
          <span className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
          <p className="text-xs font-semibold tracking-[0.18em] uppercase gold-text leading-none whitespace-nowrap">
            About
          </p>
          <span className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          Khamare Clarke
        </h1>

        {/* ── Who is Khamare Clarke? ── */}
        <section className="mt-16" aria-labelledby="who-heading">
          <h2
            id="who-heading"
            className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4"
          >
            Who is Khamare Clarke?
          </h2>
          <div className="space-y-5 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Khamare Clarke is an AI Implementation Specialist based in
              Stoke-on-Trent, Staffordshire, serving businesses across the
              whole of the UK. He holds a BSc in Software Engineering, a BSc in
              Digital Marketing, and is completing an MSc in Computer Science
              with Artificial Intelligence at Keele University (due 2027). That
              combination is not common, and it shapes how he works.
            </p>
            <p>
              Most people in this space are one thing: SEO specialists who
              cannot code, AI consultants who have never shipped a production
              system, or engineers who do not understand search. Khamare does
              all three. He implements AI across search, web, content,
              marketing, and automation. Working alongside existing business
              teams rather than replacing them. The code is written here, the
              campaigns are run here, and the systems are built here. No
              outsourcing to junior team members or offshore contractors.
            </p>
            <p>
              He built his practice around a single principle: if the result
              cannot be measured and documented, it does not count. Every claim
              on this site traces back to a real client, a real campaign, and a
              real number.
            </p>
          </div>
        </section>

        {/* ── What does an AI Implementation Specialist do? ── */}
        <section className="mt-16" aria-labelledby="what-heading">
          <h2
            id="what-heading"
            className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4"
          >
            What does an AI Implementation Specialist do?
          </h2>
          <div className="space-y-5 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An AI implementation specialist assesses a business's current
              operations, identifies where AI can be applied practically, and
              implements the systems. That means AI agents and receptionists
              that handle enquiries around the clock, SEO and AI search
              optimisation that gets the business found in Google and in
              ChatGPT, Gemini, and Perplexity answers, web builds that are
              engineered to rank and convert, CRM and email automation that
              follows up every lead, and content systems that produce at scale
              without producing noise.
            </p>
            <p>
              The distinction from a standard consultant is implementation.
              An implementation specialist does not hand a strategy document
              to an internal team and leave. He connects the technology to the
              business outcome, builds the system, and is accountable for the
              result. The MSc in Computer Science with Artificial Intelligence
              at Keele University grounds this work in how these systems
              actually behave. The two BSc degrees ground it in the marketing
              and engineering disciplines that have to work together.
            </p>
            <p>
              The output is a business that is visible wherever its customers
              are searching, has AI handling the operational load that does not
              need a human, and has reporting that makes the outcome clear every
              month in plain English.
            </p>
          </div>
        </section>

        {/* ── Documented results ── */}
        <section className="mt-16" aria-labelledby="results-heading">
          <h2
            id="results-heading"
            className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4"
          >
            Documented results
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Result 1 */}
            <div className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-2xl p-8">
              <p className="text-[#ffb700] text-xs font-bold uppercase tracking-widest mb-3">
                Upgrade Roofing Solutions
              </p>
              <p className="text-white text-4xl font-extrabold mb-2">538%</p>
              <p className="text-[#ADB7BE] text-sm leading-relaxed">
                Growth in Google Business Profile interactions in 90 days.
                The campaign generated over 30 qualified inbound calls in the
                first two weeks alone.
              </p>
            </div>
            {/* Result 2 */}
            <div className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-2xl p-8">
              <p className="text-[#ffb700] text-xs font-bold uppercase tracking-widest mb-3">
                City Plaza Abu Dhabi
              </p>
              <p className="text-white text-4xl font-extrabold mb-2">5X</p>
              <p className="text-[#ADB7BE] text-sm leading-relaxed">
                Lead volume within 60 days, scaling to approximately 20
                qualified enquiries per day at peak.
              </p>
            </div>
          </div>
        </section>

        {/* ── Credentials ── */}
        <section className="mt-16" aria-labelledby="credentials-heading">
          <h2
            id="credentials-heading"
            className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4"
          >
            Credentials
          </h2>
          <ul className="space-y-3 text-[#ADB7BE] text-lg">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#ffb700] font-bold">—</span>
              <span>
                <strong className="text-white">MSc Computer Science with Artificial Intelligence</strong>,
                Keele University (completing 2027)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#ffb700] font-bold">—</span>
              <span>
                <strong className="text-white">BSc Software Engineering</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#ffb700] font-bold">—</span>
              <span>
                <strong className="text-white">BSc Digital Marketing</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#ffb700] font-bold">—</span>
              <span>
                <strong className="text-white">Level 4 Diploma in Cyber Security</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-[#ffb700] font-bold">—</span>
              <span>Certified Google Ads and Google Analytics</span>
            </li>
          </ul>
        </section>

        {/* ── Ventures and clients worked with ── */}
        <section className="mt-16" aria-labelledby="ventures-heading">
          <h2
            id="ventures-heading"
            className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4"
          >
            Ventures and clients worked with
          </h2>
          <p className="text-[#ADB7BE] text-lg mb-6">
            A selection of businesses, ventures, and projects Khamare has
            worked with across SEO, development, AI systems, and growth.
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ventures.map((v) => (
              <li
                key={v}
                className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-[#ADB7BE] text-sm"
              >
                {v}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Service area ── */}
        <section className="mt-16" aria-labelledby="area-heading">
          <h2
            id="area-heading"
            className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4"
          >
            Service area
          </h2>
          <p className="text-[#ADB7BE] text-lg leading-relaxed">
            Based in Stoke-on-Trent, Staffordshire. Khamare works with UK
            businesses remotely and, where needed, on-site. Most client work
            is delivered entirely online with no loss of quality or
            accountability.
          </p>
        </section>

        {/* ── Expertise pages ── */}
        <section className="mt-16" aria-labelledby="expertise-heading">
          <h2
            id="expertise-heading"
            className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4"
          >
            Areas of expertise
          </h2>
          <ul className="space-y-3">
            {[
              { href: "/expertise/seo", label: "SEO — what a specialist does that an agency won't" },
              {
                href: "/expertise/ai-search-optimisation",
                label: "AI search optimisation — AEO and GEO explained",
              },
              {
                href: "/expertise/programmatic-seo",
                label: "Programmatic SEO — engineered pages that scale",
              },
              {
                href: "/expertise/ai-agents",
                label: "AI agents for UK businesses",
              },
              {
                href: "/expertise/google-ads-api",
                label: "Google Ads API — what ads engineering actually means",
              },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 text-[#ADB7BE] hover:text-[#ffb700] transition-colors text-base"
                >
                  <span className="text-[#ffb700]">→</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#ADB7BE] hover:text-[#ffb700] transition-colors text-sm"
            >
              <span className="text-[#ffb700]">←</span> Back to homepage
            </Link>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="mt-20 bg-[#1a1a1a] border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Book a free 30-minute strategy call.
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            No pitch deck, no sales team. Thirty minutes to look at your
            situation and give you an honest assessment of what SEO and AI
            systems can do for your business.
          </p>
          <CTAButton eventLabel="about_strategy_cta" caption="No pitch deck. No obligation.">
            Book a Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
