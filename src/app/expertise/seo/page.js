// src/app/expertise/seo/page.js

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
        text: "Pricing depends on the scope of the work, the competition in your market, and the volume of technical and content work required. A free 30-minute strategy call gives an accurate picture for your specific situation.",
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
        <Container size="main">
          <PageHeroSplit
            eyebrow="Expertise"
            size="feature"
            title={
              <>
                SEO Specialist{" "}
                <span className="gold-text">
                  — What a Specialist Does That an Agency Won't
                </span>
              </>
            }
          />
        </Container>

        <Container size="narrow" className="text-center [&_p]:mx-auto">

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection dense />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            SEO advice is everywhere. Someone accountable for the work, the
            rankings, and the phone calls is harder to find.
          </p>

        {/* Q1 */}
        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What does an <span className="gold-text">SEO specialist do?</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An SEO specialist audits, fixes, and grows a website's visibility
              in search engines. That includes technical SEO (site speed,
              crawlability, structured data), on-page content optimisation,
              link building, and local search for businesses serving a specific
              geography. The goal is qualified traffic: visitors who are looking
              for exactly what you sell.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The work is continuous, not a one-off project. Search algorithms
              update, competitors invest, and what worked twelve months ago may
              no longer be sufficient. A specialist monitors, adjusts, and
              reports, ideally in plain language, not a dashboard full of
              metrics that do not connect to revenue.
            </p>
          </div>
        </section>

        {/* Q2 */}
        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="q2">
          <SectionHeading id="q2">
            How is an SEO specialist <span className="gold-text">different from an SEO agency?</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              An agency allocates your account to a junior executive who works
              from a template. You may meet a senior person at the pitch, then
              never see them again. A specialist does the work themselves. You
              know exactly who is accountable for rankings, who is writing the
              copy, and who will answer when something changes in the algorithm.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              Agencies also tend to separate SEO from development. If a
              technical issue is found, whether a slow page, a crawl block, a broken
              structured data implementation, it goes on a list for another
              team. A specialist with an engineering background fixes it
              directly. That removes weeks from the feedback loop.
            </p>
          </div>
        </section>

        {/* Q3 */}
        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="q3">
          <SectionHeading id="q3">
            How long does SEO take <span className="gold-text">to show results?</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              For local SEO with Google Business Profile work, results can
              appear within weeks. Upgrade Roofing Solutions saw a 538% increase
              in Google Business Profile interactions within 90 days, with over
              30 qualified inbound calls in the first two weeks. That is not
              typical. It reflects a strong starting position, fast technical
              improvements, and a well-managed local campaign.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="q4">
          <SectionHeading id="q4">
            What does <span className="gold-text">local SEO involve?</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Local SEO targets searches tied to a geographic area: "roofer
              Stoke-on-Trent", "accountant near me", "plumber open now". It
              covers Google Business Profile optimisation, local citation
              building (getting the business listed consistently across
              directories), review strategy, and locally-focused on-page
              content.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="q5">
          <SectionHeading id="q5">
            How much does SEO <span className="gold-text">cost in the UK?</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Pricing depends on the scope of the work, the competition in your
              market, and the volume of technical and content work required. A
              free 30-minute strategy call gives an accurate picture for your
              specific situation.
            </p>
          </div>
        </section>

        {/* Q6 */}
        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="q6">
          <SectionHeading id="q6">
            Who is Khamare Clarke and why does <span className="gold-text">his background matter for SEO?</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Khamare Clarke is based in Stoke-on-Trent, Staffordshire. He
              holds a BSc in Software Engineering, a BSc in Digital Marketing,
              and is completing an MSc in Computer Science with Artificial
              Intelligence at Keele University (due 2027).
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The engineering background means he can audit and fix a site's
              technical foundation without relying on a separate developer team.
              The marketing background means strategy is built around
              conversions, not just rankings. The AI training means he
              understands how language models are built, which informs how he
              writes and structures content for both Google and AI answer
              engines like ChatGPT, Gemini, and Perplexity.
            </p>
            <p className="reveal" style={{ "--rv-delay": "360ms" }}>
              Documented results: Upgrade Roofing Solutions, 538% Google
              Business Profile interaction growth in 90 days, 30+ qualified
              calls in the first two weeks. City Plaza Abu Dhabi, 5X leads
              within 60 days, scaling to approximately 20 qualified enquiries
              per day.
            </p>
          </div>
        </section>

        {/* Synonym coverage */}
        <hr aria-hidden="true" className="section-sep mt-12" />

        <section className="mt-12" aria-labelledby="synonyms">
          <SectionHeading id="synonyms">
            SEO consultant, SEO expert, SEO freelancer: <span className="gold-text">what these terms mean in practice</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Businesses searching for an SEO consultant, SEO expert, or SEO freelancer are looking for the same
              thing: someone accountable, doing the work themselves, with a track record they can verify. The
              distinction between those labels is mostly one of business structure. A freelancer operates independently.
              A consultant may work in a more advisory capacity. A specialist implies hands-on technical execution.
              Khamare Clarke operates as all three: strategic, technical, and directly accountable for every element
              of the work.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The phrase "search engine optimisation specialist" covers the same territory as SEO specialist.
              The important differentiation is not the label but the scope of work: does the person write the
              content, fix the code, and update the schema themselves, or do they produce a report and hand it
              to someone else? The former removes weeks from the feedback loop. That is what "SEO services" should
              mean in practice: measurable progress, monthly, with one person answerable for the results.
            </p>
          </div>
        </section>

        <Card as="nav" aria-label="Related expertise" className="reveal mt-16" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation (AEO and GEO)" },
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

        {/* The founder block. Placed here rather than under the hero: the
            hero already carries his portrait, and the same face again a screen
            later reads as a mistake. `showCta={false}` because CtaPanel follows. */}
        <AboutSection className="mt-16" showCta={false} />

        {/* CTA */}
        <CtaPanel headingLevel="h2"
          className="mt-16"
          heading={
            <>
              Ready to talk about your <span className="gold-text">rankings?</span>
            </>
          }
          body="Book a free 30-minute strategy call. No obligation, no sales team. You will get an honest assessment of where your site stands and what it would take to move it."
        >
          <CTAButton eventLabel="expertise_seo_cta" caption="Why the page isn't ranking. The actual cause.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
