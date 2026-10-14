// src/app/expertise/programmatic-seo/page.js

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
                Programmatic SEO{" "}
                <span className="gold-text">— Engineered Pages That Scale</span>
              </>
            }
          />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            When there are hundreds of keywords worth owning and no time to write
            each page by hand, programmatic SEO is the answer. Provided it is
            built by someone who can write the code and understand the search
            implications at the same time.
          </p>

        {/* Q1 */}
        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What is <span className="gold-text">programmatic SEO</span>?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Programmatic SEO is the practice of building large numbers of
              search-optimised pages from a structured data source — a database,
              a spreadsheet, or an API — rather than writing each page manually.
              A single well-engineered template can generate hundreds or
              thousands of unique, indexable URLs, each targeting a specific
              keyword variation, location, or product category.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
          <SectionHeading id="q2">
            When does <span className="gold-text">programmatic SEO</span> make sense for a business?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Programmatic SEO makes sense when a business has a large,
              structured inventory that maps naturally to search demand: property
              listings, job boards, product catalogues, service-area pages, or
              comparison tools. It also makes sense for any business that needs
              to own a large number of location-specific queries — for example,
              a national trades company that wants to rank in every UK city and
              town for its service.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
          <SectionHeading id="q3">
            What is the difference between a <span className="gold-text">programmatic page</span> and a doorway page?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              A doorway page is a low-quality page created solely to rank for a
              keyword, with no genuine value for the user. Google penalises
              these explicitly. A programmatic page, done correctly, provides
              genuinely useful, unique information for each URL — different data,
              different context, different utility for the person who lands on
              it.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
          <SectionHeading id="q4">
            How does an engineer approach <span className="gold-text">programmatic SEO</span> differently?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An engineer builds the data pipeline, the template logic, and the
              deployment infrastructure themselves. That means the content is
              generated from real structured data rather than thin rewrites, the
              page rendering is optimised for Core Web Vitals from the outset,
              the URL structure is clean and crawlable, and the schema markup
              is applied at scale programmatically — not added manually to each
              page after the fact.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
          <SectionHeading id="q5">
            What <span className="gold-text">results</span> can programmatic SEO deliver?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              At scale, a well-executed programmatic SEO build can produce
              thousands of ranking pages targeting long-tail queries that a
              business would never have the resource to write manually. The
              cumulative traffic from those pages — each individually
              low-volume but collectively significant — compounds over time
              in a way that a handful of high-competition pages cannot.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The key metric is not page count but indexed, ranking, converting
              URLs. A build that generates 5,000 pages and gets 200 of them
              indexed and ranking for relevant terms is more valuable than a
              build that produces 500 thin pages that Google ignores. The
              engineering rigour is what determines which outcome you get.
            </p>
          </div>
        </section>

        {/* Internal links */}
        <Card as="nav" aria-label="Related expertise" className="reveal mt-16" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/seo", label: "SEO specialist — what a specialist does" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation — AEO and GEO" },
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
              Want to know whether <span className="gold-text">programmatic SEO</span> fits your business?
            </>
          }
          body="Book a free 30-minute strategy call. Bring your current keyword targets and site structure and we will assess whether a programmatic build makes sense, what the data requirements are, and what the projected output looks like."
        >
          <CTAButton eventLabel="expertise_programmatic_seo_cta" caption="How many pages you actually need.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
