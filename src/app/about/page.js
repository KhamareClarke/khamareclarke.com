// src/app/about/page.js

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import CTAButton from "../components/CTAButton";
import { PERSON_SCHEMA } from "../../lib/schema";

export const metadata = {
  title: "About Khamare Clarke | SEO Specialist and AI Systems Engineer",
  description:
    "Khamare Clarke is an SEO specialist and AI systems engineer based in Stoke-on-Trent. MSc AI at Keele University. He writes the code, runs the campaigns, and builds the systems.",
  alternates: { canonical: "https://khamareclarke.com/about" },
  openGraph: {
    title: "About Khamare Clarke | SEO Specialist and AI Systems Engineer",
    description:
      "Khamare Clarke is an SEO specialist and AI systems engineer based in Stoke-on-Trent. MSc AI at Keele University. He writes the code, runs the campaigns, and builds the systems.",
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
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLD) }}
      />

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl gradient-blob" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#ff8c00]/4 blur-3xl gradient-blob-b" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        {/* Page label */}
        <p className="inline-block bg-[#ffb700] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full mb-8">
          About
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          Khamare Clarke{" "}
          <span className="text-[#ffb700]">
            — SEO Specialist and AI Systems Engineer
          </span>
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
              Khamare Clarke is an SEO specialist and AI systems engineer based
              in Stoke-on-Trent, Staffordshire, serving businesses across the
              whole of the UK. He holds a BSc in Software Engineering, a BSc in
              Digital Marketing, and is completing an MSc in Computer Science
              with Artificial Intelligence at Keele University (due 2027). That
              combination is not common, and it shapes how he works.
            </p>
            <p>
              Most people who call themselves SEO consultants either understand
              the marketing or understand the technology. Khamare does both. He
              writes the code, runs the campaigns, and builds the systems
              — including AI agents, CRM automations, and Google Ads API
              integrations — himself. There is no outsourcing to junior team
              members or offshore contractors.
            </p>
            <p>
              He built his practice around a single principle: if the result
              cannot be measured and documented, it does not count. Every claim
              on this site traces back to a real client, a real campaign, and a
              real number.
            </p>
          </div>
        </section>

        {/* ── What does an AI SEO specialist do? ── */}
        <section className="mt-16" aria-labelledby="what-heading">
          <h2
            id="what-heading"
            className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4"
          >
            What does an AI SEO specialist do?
          </h2>
          <div className="space-y-5 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An AI SEO specialist optimises a business to rank in both
              traditional search engines (Google, Bing) and AI-powered answer
              engines (ChatGPT, Gemini, Perplexity). Getting a business cited
              by an AI model requires a different technical approach to getting
              it ranked in a list of ten blue links, and most agencies only
              know how to do one or the other.
            </p>
            <p>
              Khamare works across both simultaneously. That means structured
              data, entity-based content, technical site architecture, Google
              Business Profile management, link authority, and the schema markup
              that teaches AI models what a business does and where it operates.
              The output is visibility wherever a potential customer is
              searching.
            </p>
            <p>
              Beyond search, he integrates AI systems that act on that
              visibility: automated lead qualification, AI receptionists that
              respond to enquiries within seconds, and CRM workflows that turn
              a website visitor into a booked appointment without human
              intervention at every step.
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
