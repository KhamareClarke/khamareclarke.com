// src/app/expertise/seo/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA } from "../../../lib/schema";

export const metadata = {
  title: "SEO Specialist UK | Khamare Clarke — Stoke-on-Trent",
  description:
    "Khamare Clarke is an SEO specialist based in Staffordshire covering the whole of the UK. MSc AI, BSc Software Engineering, BSc Digital Marketing. Documented client results.",
  alternates: { canonical: "https://khamareclarke.com/expertise/seo" },
  openGraph: {
    title: "SEO Specialist UK | Khamare Clarke — Stoke-on-Trent",
    description:
      "Khamare Clarke is an SEO specialist based in Staffordshire covering the whole of the UK. MSc AI, BSc Software Engineering, BSc Digital Marketing. Documented client results.",
    url: "https://khamareclarke.com/expertise/seo",
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
      name: "What does an SEO specialist do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An SEO specialist audits, fixes, and grows a website's visibility in search engines. That includes technical SEO (site speed, crawlability, structured data), on-page content optimisation, link building, and local search for businesses serving a specific geography. The goal is qualified traffic: visitors who are looking for what you sell.",
      },
    },
    {
      "@type": "Question",
      name: "How is an SEO specialist different from an SEO agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An agency allocates your account to a junior executive who works from a template. A specialist does the work themselves. With a specialist you know exactly who is accountable for rankings, who is writing the copy, and who will answer when something changes in the algorithm.",
      },
    },
    {
      "@type": "Question",
      name: "How long does SEO take to show results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For local SEO with Google Business Profile optimisation, results can appear within weeks. For competitive organic rankings, three to six months is a realistic window for measurable movement. Timelines depend on domain authority, competition, and how technically sound the site is at the start.",
      },
    },
    {
      "@type": "Question",
      name: "What does local SEO involve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Local SEO targets searches tied to a geographic area: 'roofer Stoke-on-Trent', 'accountant near me'. It covers Google Business Profile optimisation, local citation building, review strategy, locally-focused on-page content, and schema markup that tells Google where a business operates.",
      },
    },
    {
      "@type": "Question",
      name: "How much does SEO cost in the UK?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Khamare Clarke's SEO services start from £495 per month for the Get Found package, rising to £1,250/mo for Run The Area and £2,500/mo for Own The Market. Pricing reflects scope, competition level, and the volume of technical and content work required.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Khamare Clarke and why does his background matter for SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Khamare Clarke holds a BSc in Software Engineering, a BSc in Digital Marketing, and is completing an MSc in Computer Science with Artificial Intelligence at Keele University. He is based in Stoke-on-Trent and serves UK businesses nationwide. The engineering background means he can fix technical issues directly rather than writing a report and waiting for a developer. The marketing background means the SEO strategy is built around conversions, not just rankings.",
      },
    },
  ],
};

export default function SEOSpecialistPage() {
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
          SEO Specialist{" "}
          <span className="text-[#ffb700]">
            — What a Specialist Does That an Agency Won't
          </span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          SEO advice is everywhere. Someone accountable for the work, the
          rankings, and the phone calls is harder to find.
        </p>

        {/* Q1 */}
        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What does an SEO specialist do?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An SEO specialist audits, fixes, and grows a website's visibility
              in search engines. That includes technical SEO (site speed,
              crawlability, structured data), on-page content optimisation,
              link building, and local search for businesses serving a specific
              geography. The goal is qualified traffic: visitors who are looking
              for exactly what you sell.
            </p>
            <p>
              The work is continuous, not a one-off project. Search algorithms
              update, competitors invest, and what worked twelve months ago may
              no longer be sufficient. A specialist monitors, adjusts, and
              reports — ideally in plain language, not a dashboard full of
              metrics that do not connect to revenue.
            </p>
          </div>
        </section>

        {/* Q2 */}
        <section className="mt-12" aria-labelledby="q2">
          <h2 id="q2" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How is an SEO specialist different from an SEO agency?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An agency allocates your account to a junior executive who works
              from a template. You may meet a senior person at the pitch, then
              never see them again. A specialist does the work themselves. You
              know exactly who is accountable for rankings, who is writing the
              copy, and who will answer when something changes in the algorithm.
            </p>
            <p>
              Agencies also tend to separate SEO from development. If a
              technical issue is found — a slow page, a crawl block, a broken
              structured data implementation — it goes on a list for another
              team. A specialist with an engineering background fixes it
              directly. That removes weeks from the feedback loop.
            </p>
          </div>
        </section>

        {/* Q3 */}
        <section className="mt-12" aria-labelledby="q3">
          <h2 id="q3" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How long does SEO take to show results?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              For local SEO with Google Business Profile work, results can
              appear within weeks. Upgrade Roofing Solutions saw a 538% increase
              in Google Business Profile interactions within 90 days, with over
              30 qualified inbound calls in the first two weeks. That is not
              typical — it reflects a strong starting position, fast technical
              improvements, and a well-managed local campaign.
            </p>
            <p>
              For competitive organic rankings, three to six months is a
              realistic window for measurable movement. Timelines depend on
              domain authority, competition, and how technically sound the site
              is at the start. Any specialist who guarantees a specific ranking
              by a specific date is either working on uncompetitive terms or
              overpromising.
            </p>
          </div>
        </section>

        {/* Q4 */}
        <section className="mt-12" aria-labelledby="q4">
          <h2 id="q4" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What does local SEO involve?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Local SEO targets searches tied to a geographic area: "roofer
              Stoke-on-Trent", "accountant near me", "plumber open now". It
              covers Google Business Profile optimisation, local citation
              building (getting the business listed consistently across
              directories), review strategy, and locally-focused on-page
              content.
            </p>
            <p>
              Schema markup is critical here. Google reads structured data to
              understand what a business does, where it operates, and which
              queries it is relevant to. Most local businesses have no schema
              at all, or outdated schema that conflicts with their current
              information. Fixing that alone can produce visible movement in
              map pack rankings within weeks.
            </p>
          </div>
        </section>

        {/* Q5 */}
        <section className="mt-12" aria-labelledby="q5">
          <h2 id="q5" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How much does SEO cost in the UK?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Khamare Clarke's SEO retainers run at three tiers:
            </p>
            <ul className="space-y-3 pl-4">
              <li className="flex items-start gap-3">
                <span className="text-[#ffb700] font-bold mt-1">—</span>
                <span>
                  <strong className="text-white">Get Found</strong> — from
                  £495/mo. Google Business Profile domination, local map pack
                  visibility, citation clean-up.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ffb700] font-bold mt-1">—</span>
                <span>
                  <strong className="text-white">Run The Area</strong> — from
                  £1,250/mo. Full local SEO plus organic content, technical
                  fixes, and competitor gap analysis.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#ffb700] font-bold mt-1">—</span>
                <span>
                  <strong className="text-white">Own The Market</strong> — from
                  £2,500/mo. Full-stack SEO, AI search optimisation, programmatic
                  content, and AI lead systems working together.
                </span>
              </li>
            </ul>
            <p>
              UK SEO agencies typically charge £1,000–£5,000/mo for
              multi-person account teams. A specialist at £495–£2,500/mo with
              direct accountability is a different proposition.
            </p>
          </div>
        </section>

        {/* Q6 */}
        <section className="mt-12" aria-labelledby="q6">
          <h2 id="q6" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Who is Khamare Clarke and why does his background matter for SEO?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Khamare Clarke is based in Stoke-on-Trent, Staffordshire. He
              holds a BSc in Software Engineering, a BSc in Digital Marketing,
              and is completing an MSc in Computer Science with Artificial
              Intelligence at Keele University (due 2027). He is certified in
              Google Ads and Google Analytics.
            </p>
            <p>
              The engineering background means he can audit and fix a site's
              technical foundation without relying on a separate developer team.
              The marketing background means strategy is built around
              conversions, not just rankings. The AI training means he
              understands how language models are built — which informs how he
              writes and structures content for both Google and AI answer
              engines like ChatGPT, Gemini, and Perplexity.
            </p>
            <p>
              Documented results: Upgrade Roofing Solutions — 538% Google
              Business Profile interaction growth in 90 days, 30+ qualified
              calls in the first two weeks. City Plaza Abu Dhabi — 5X leads
              within 60 days, scaling to approximately 20 qualified enquiries
              per day.
            </p>
          </div>
        </section>

        {/* Synonym coverage */}
        <section className="mt-12" aria-labelledby="synonyms">
          <h2 id="synonyms" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            SEO consultant, SEO expert, SEO freelancer: what these terms mean in practice
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Businesses searching for an SEO consultant, SEO expert, or SEO freelancer are looking for the same
              thing: someone accountable, doing the work themselves, with a track record they can verify. The
              distinction between those labels is mostly one of business structure. A freelancer operates independently.
              A consultant may work in a more advisory capacity. A specialist implies hands-on technical execution.
              Khamare Clarke operates as all three: strategic, technical, and directly accountable for every element
              of the work.
            </p>
            <p>
              The phrase "search engine optimisation specialist" covers the same territory as SEO specialist.
              The important differentiation is not the label but the scope of work: does the person write the
              content, fix the code, and update the schema themselves, or do they produce a report and hand it
              to someone else? The former removes weeks from the feedback loop. That is what "SEO services" should
              mean in practice: measurable progress, monthly, with one person answerable for the results.
            </p>
          </div>
        </section>

        {/* Internal links */}
        <nav className="mt-16 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8" aria-label="Related expertise">
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation — AEO and GEO" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO" },
              { href: "/expertise/ai-agents", label: "AI agents for UK businesses" },
              { href: "/expertise/google-ads-api", label: "Google Ads API" },
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
            Ready to talk about your rankings?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy call. No obligation, no sales team.
            You will get an honest assessment of where your site stands and
            what it would take to move it.
          </p>
          <CTAButton eventLabel="expertise_seo_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
