// src/app/expertise/programmatic-seo/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA } from "../../../lib/schema";

export const metadata = {
  title: "Programmatic SEO Expert UK | Khamare Clarke",
  description:
    "Programmatic SEO for UK businesses: engineered page templates that scale to thousands of URLs without doorway page risk. Built and deployed by Khamare Clarke, Stoke-on-Trent.",
  alternates: {
    canonical: "https://khamareclarke.com/expertise/programmatic-seo",
  },
  openGraph: {
    title: "Programmatic SEO Expert UK | Khamare Clarke",
    description:
      "Programmatic SEO for UK businesses: engineered page templates that scale to thousands of URLs without doorway page risk. Built and deployed by Khamare Clarke, Stoke-on-Trent.",
    url: "https://khamareclarke.com/expertise/programmatic-seo",
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
      name: "What is programmatic SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Programmatic SEO is the practice of building large numbers of search-optimised pages from a structured data source — a database, a spreadsheet, or an API — rather than writing each page manually. A single well-engineered template can generate hundreds or thousands of unique, indexable URLs, each targeting a specific keyword variation, location, or product category.",
      },
    },
    {
      "@type": "Question",
      name: "When does programmatic SEO make sense for a business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Programmatic SEO makes sense when a business has a large, structured inventory that maps naturally to search demand: property listings, job boards, product catalogues, service-area pages, or comparison tools. It also makes sense for any business that needs to own a large number of location-specific queries — for example, a national trades company that wants to rank in every UK city and town.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a programmatic page and a doorway page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A doorway page is a low-quality page created solely to rank for a keyword, with no genuine value for the user. Google penalises these. A programmatic page, done correctly, provides genuinely useful, unique information for each URL — different data, different context, different utility. The distinction is in the quality and uniqueness of the content, not the method of generation.",
      },
    },
    {
      "@type": "Question",
      name: "How does an engineer approach programmatic SEO differently?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An engineer builds the data pipeline, the template logic, and the deployment infrastructure themselves. That means the content is generated from real structured data rather than thin rewrites, the page rendering is optimised for Core Web Vitals from the start, the URL structure is clean and crawlable, and the schema markup is applied at scale programmatically. An SEO-only practitioner would need a developer to handle all of this separately — adding cost, time, and the risk of implementation errors.",
      },
    },
    {
      "@type": "Question",
      name: "What results can programmatic SEO deliver?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At scale, a well-executed programmatic SEO build can produce thousands of ranking pages targeting long-tail queries that a business would never have the resource to write manually. The cumulative traffic from those pages — each individually low-volume but collectively significant — compounds over time. The key metric is not page count but indexed, ranking, converting URLs.",
      },
    },
  ],
};

export default function ProgrammaticSEOPage() {
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
          Programmatic SEO{" "}
          <span className="text-[#ffb700]">— Engineered Pages That Scale</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          When there are hundreds of keywords worth owning and no time to write
          each page by hand, programmatic SEO is the answer. Provided it is
          built by someone who can write the code and understand the search
          implications at the same time.
        </p>

        {/* Q1 */}
        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What is programmatic SEO?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Programmatic SEO is the practice of building large numbers of
              search-optimised pages from a structured data source — a database,
              a spreadsheet, or an API — rather than writing each page manually.
              A single well-engineered template can generate hundreds or
              thousands of unique, indexable URLs, each targeting a specific
              keyword variation, location, or product category.
            </p>
            <p>
              The approach is used by marketplaces, directories, job boards,
              property platforms, and any business with a structured inventory
              that maps to real search demand. The companies that scale fastest
              in search are often doing this, whether or not they call it by
              the name.
            </p>
          </div>
        </section>

        {/* Q2 */}
        <section className="mt-12" aria-labelledby="q2">
          <h2 id="q2" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            When does programmatic SEO make sense for a business?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Programmatic SEO makes sense when a business has a large,
              structured inventory that maps naturally to search demand: property
              listings, job boards, product catalogues, service-area pages, or
              comparison tools. It also makes sense for any business that needs
              to own a large number of location-specific queries — for example,
              a national trades company that wants to rank in every UK city and
              town for its service.
            </p>
            <p>
              It does not make sense when the keyword set is small, when the
              data does not vary meaningfully between pages, or when a business
              does not have the domain authority to get a large number of new
              pages indexed and ranked in a reasonable timeframe. Programmatic
              SEO amplifies an existing SEO foundation — it does not replace one.
            </p>
          </div>
        </section>

        {/* Q3 */}
        <section className="mt-12" aria-labelledby="q3">
          <h2 id="q3" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What is the difference between a programmatic page and a doorway page?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              A doorway page is a low-quality page created solely to rank for a
              keyword, with no genuine value for the user. Google penalises
              these explicitly. A programmatic page, done correctly, provides
              genuinely useful, unique information for each URL — different data,
              different context, different utility for the person who lands on
              it.
            </p>
            <p>
              The distinction is in the quality and uniqueness of the content,
              not the method of generation. A page listing real service
              availability in a specific postcode, with accurate local data and
              a genuine call to action, is useful. A page that substitutes a
              city name into a template and calls it done is not. The
              engineering challenge is building templates that produce the
              former at scale.
            </p>
          </div>
        </section>

        {/* Q4 */}
        <section className="mt-12" aria-labelledby="q4">
          <h2 id="q4" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How does an engineer approach programmatic SEO differently?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              An engineer builds the data pipeline, the template logic, and the
              deployment infrastructure themselves. That means the content is
              generated from real structured data rather than thin rewrites, the
              page rendering is optimised for Core Web Vitals from the outset,
              the URL structure is clean and crawlable, and the schema markup
              is applied at scale programmatically — not added manually to each
              page after the fact.
            </p>
            <p>
              Khamare builds programmatic SEO projects in Next.js, which gives
              full control over rendering strategy (static generation,
              incremental static regeneration, or server rendering depending on
              data freshness requirements), metadata generation, and structured
              data. An SEO-only practitioner would need a developer to handle
              all of this separately, adding cost, time, and the risk of
              implementation errors between the SEO strategy and the code.
            </p>
          </div>
        </section>

        {/* Q5 */}
        <section className="mt-12" aria-labelledby="q5">
          <h2 id="q5" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What results can programmatic SEO deliver?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              At scale, a well-executed programmatic SEO build can produce
              thousands of ranking pages targeting long-tail queries that a
              business would never have the resource to write manually. The
              cumulative traffic from those pages — each individually
              low-volume but collectively significant — compounds over time
              in a way that a handful of high-competition pages cannot.
            </p>
            <p>
              The key metric is not page count but indexed, ranking, converting
              URLs. A build that generates 5,000 pages and gets 200 of them
              indexed and ranking for relevant terms is more valuable than a
              build that produces 500 thin pages that Google ignores. The
              engineering rigour is what determines which outcome you get.
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
            Want to know whether programmatic SEO fits your business?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy call. Bring your current keyword
            targets and site structure and we will assess whether a programmatic
            build makes sense, what the data requirements are, and what the
            projected output looks like.
          </p>
          <CTAButton eventLabel="expertise_programmatic_seo_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
