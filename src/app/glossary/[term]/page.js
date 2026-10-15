import { notFound } from "next/navigation";
import { Fragment } from "react";
import Link from "next/link";
import PageShell from "../../components/PageShell";
import PageHeroSplit from "../../components/ui/PageHeroSplit";
import AboutSection from "../../components/AboutSection";
import AchievementsSection from "../../components/AchievementsSection";
import SectionHeading from "../../components/ui/SectionHeading";
import CtaPanel from "../../components/ui/CtaPanel";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";
import CTAButton from "../../components/CTAButton";
import { splitHeroTitle, splitHeroTitleThree } from "../../../lib/hero-title";
import { GLOSSARY_HERO_LINES } from "../../../lib/glossary-hero-lines";

import { GLOSSARY_TERMS, GLOSSARY_BY_SLUG } from "../../../lib/glossary-data";

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ term: t.slug }));
}

export function generateMetadata({ params }) {
  const term = GLOSSARY_BY_SLUG[params.term];
  if (!term) return {};
  return {
    title: term.metaTitle,
    description: term.metaDescription,
    alternates: { canonical: `https://khamareclarke.com/glossary/${term.slug}` },
    openGraph: {
      title: term.metaTitle,
      description: term.metaDescription,
      url: `https://khamareclarke.com/glossary/${term.slug}`,
      siteName: "Khamare Clarke",
      locale: "en_GB",
      type: "article",
      images: [
        {
          url: "/images/about-image.png",
          width: 1200,
          height: 630,
          alt: `${term.title} | Khamare Clarke Glossary`,
        },
      ],
    },
  };
}

export default function GlossaryTermPage({ params }) {
  const term = GLOSSARY_BY_SLUG[params.term];
  if (!term) return notFound();

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `https://khamareclarke.com/glossary/${term.slug}#term`,
    "name": term.abbr ? `${term.title} (${term.abbr})` : term.title,
    "description": term.definition,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Khamare Clarke Digital Marketing and AI Glossary",
      "url": "https://khamareclarke.com/glossary",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: term.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const relatedTermObjects = term.relatedTerms
    .map((slug) => GLOSSARY_BY_SLUG[slug])
    .filter(Boolean);

  const displayTitle = term.abbr ? `${term.title} (${term.abbr})` : term.title;

  // The heading split into its plain and gold parts. Every one of the 72 glossary
  // headings contains a colon, so the term itself stays white and the clause after
  // it carries the gold. `joinHeroTitle` of the two is asserted to equal `term.h1`
  // exactly — the h1 is the primary on-page signal on these pages, so the split
  // only adds markup around text that was already there.
  const termTitle = splitHeroTitle(term.h1);
  const termTitle3 = splitHeroTitleThree(term.h1);

  // The two lines under the headline. Written per term in lib/glossary-hero-lines.js, because a
  // rule only produced a good split on 14 of the 72 titles. The automatic split stays as the
  // fallback so a term added to glossary-data.js renders before anyone writes its lines. */
  const heroLines = GLOSSARY_HERO_LINES[term.slug];

  // The headline alone, final word gold — the homepage's "Khamare <gold>Clarke</gold>" treatment.
  // The colon stays with the gold word so the heading's text is unchanged.
  const headline = termTitle3.term.trim();
  const headlineWords = headline.split(" ");
  // Half white, half gold: split at the word boundary closest to the character midpoint.
  // Taking only the final word made the gold a third of a long term and half of a short one;
  // this holds it near 50/50 on all 72. The colon stays with the gold half, so the heading's
  // text is unchanged.
  let splitAt = 1, bestDiff = Infinity, counted = 0;
  for (let i = 0; i < headlineWords.length - 1; i++) {
    counted += headlineWords[i].length + 1;
    const diff = Math.abs(counted - headline.length / 2);
    if (diff < bestDiff) { bestDiff = diff; splitAt = i + 1; }
  }
  const headlineLead = headlineWords.length === 1 ? "" : headlineWords.slice(0, splitAt).join(" ");
  const headlineGold = headlineWords.length === 1 ? headline : headlineWords.slice(splitAt).join(" ");

  return (
    <PageShell
      schema={
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        </>
      }
    >
      <Section className="mt-0 pb-ds-4 page-top">
        {/* The hero takes its own container so the portrait has room beside the
            headline. `--measure-hero` pins the text column to the exact 848px the
            heading tiers were tuned against — including the 56px `term` tier that
            was ceilinged specifically so the longest heading here sits on three
            lines — so no title on these 72 pages rewraps. */}
        <Container size="main">

        <nav className="flex items-center gap-2 text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/glossary" className="hover:gold-text transition-colors">Glossary</Link>
          <span>/</span>
          <span className="text-white">{term.title}</span>
        </nav>

        {/* The title was plain white. The gold goes on the clause after the colon,
            so the term stays white and the description carries the gradient. */}
        {/* NOTE for whoever edits this next: there is NO `term` tier in PageHero's size map —
            it holds only home / hero / feature / compact, and it resolves as
            `titleSizes[size] || titleSizes.hero`, so an unrecognised size silently renders at
            the 111px hero tier instead of failing. Pass a real key. */}
        {/* THE HOMEPAGE HERO, WITH THIS PAGE'S WORDS. Same three-element structure, same
            classes, same sizes, same spacing — because each part is its own element, exactly as
            the homepage has them:
              h1         the term, display size, final word gold   = "Khamare Clarke"
              gold line  "What It Is"                               = "MSc Computer Science & AI"
              lede       "and Why It Matters"                       = the intro sentence
            A previous attempt styled these three as spans INSIDE the h1. That clipped: an h1
            carrying `leading-none` gives a body-size span no line box to sit in. Separate
            elements cannot do that.

            SEO NOTE: the clause now sits outside the h1, so the heading contains the term alone
            rather than the full phrase. Requested knowingly — the look is the requirement. */}
        <PageHeroSplit
          eyebrow={term.badge}
          /* `feature` (78px). Stepped down twice at the client's request — home 128px, then hero
             111px, now this. It is the next real tier on the scale; below it is `compact` (44px),
             which would sit at the same size as nothing else in the hero and read as body text. */
          size="feature"
          title={
            <>
              {headlineLead}{" "}
              <span className="gold-text">{headlineGold}</span>
            </>
          }
          credential={heroLines?.label ?? termTitle3.mid}
          lede={heroLines?.lede ?? termTitle3.last}
        />
        </Container>

        <Container size="narrow" className="text-center [&_p]:mx-auto">

        {/* The trust strip that sits under the hero on the homepage. */}
        <AchievementsSection dense />

        {/* Citable definition block */}
        <div className="reveal mt-6 bg-surface-muted border border-primary/30 rounded-lg p-6 mb-6" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white ds-body-lg font-medium">{term.definition}</p>
        </div>

        <hr aria-hidden="true" className="section-sep mt-8" />
        {/* Why it matters */}
        <section className="mt-4" aria-labelledby="why-matters">
          <SectionHeading id="why-matters">
            Why {term.title.toLowerCase()} matters for UK businesses
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            {term.whyItMatters.map((para, i) => (
              <p key={i} className="reveal" style={{ "--rv-delay": `${200 + i * 80}ms` }}>{para}</p>
            ))}
          </div>
        </section>

        {/* How Khamare applies it */}
        <hr aria-hidden="true" className="section-sep mt-6" />

        <section className="mt-6" aria-labelledby="how-applied">
          <SectionHeading id="how-applied">
            How Khamare Clarke applies {term.title.toLowerCase()}
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            {term.howKhamareApplies.map((para, i) => (
              <p key={i} className="reveal" style={{ "--rv-delay": `${200 + i * 80}ms` }}>{para}</p>
            ))}
          </div>
        </section>

        {/* FAQ sections. Each one carries its own section rule, so the fragment is
            needed to give the map a single keyed element to return — an <hr> and a
            <section> side by side is not valid JSX. */}
        {term.faq.map((item, i) => (
          <Fragment key={i}>
            <hr aria-hidden="true" className="section-sep mt-6" />

            <section className="mt-6" aria-labelledby={`faq-${i}`}>
              <SectionHeading id={`faq-${i}`}>{item.q}</SectionHeading>
              <p className="reveal text-muted ds-body-lg" style={{ "--rv-delay": "200ms" }}>{item.a}</p>
            </section>
          </Fragment>
        ))}

        {/* Related terms + expertise link */}
        <nav className="mt-16 bg-surface-muted border border-white/10 rounded-lg p-8" aria-label="Related terms">
          <p className="text-white font-bold mb-4">Related terms</p>
          <ul className="space-y-2 [&>li]:text-center">
            {relatedTermObjects.map((related, index) => (
              <li key={related.slug} className="reveal" style={{ "--rv-delay": `${Math.min(index, 6) * 90}ms` }}>
                <Link
                  href={`/glossary/${related.slug}`}
                  className="text-muted hover:gold-text transition-colors inline-flex items-center gap-2 text-sm"
                >
                  <span className="gold-text">→</span>{" "}
                  {related.abbr ? `${related.title} (${related.abbr})` : related.title}
                </Link>
              </li>
            ))}
            {term.expertisePage && (
              <li className="reveal" style={{ "--rv-delay": "200ms" }}>
                <Link
                  href={term.expertisePage}
                  className="text-muted hover:gold-text transition-colors inline-flex items-center gap-2 text-sm"
                >
                  <span className="gold-text">→</span> Related expertise
                </Link>
              </li>
            )}
            <li className="reveal" style={{ "--rv-delay": "280ms" }}>
              <Link
                href="/glossary"
                className="text-muted hover:gold-text transition-colors inline-flex items-center gap-2 text-sm"
              >
                <span className="gold-text">→</span> Back to full glossary
              </Link>
            </li>
          </ul>
        </nav>

        {/* The founder block. Placed here rather than under the hero: the hero
            already carries his portrait, and the same face again a screen later
            reads as a mistake. `showCta={false}` because CtaPanel follows. */}
        <AboutSection className="mt-16" showCta={false} />

        {/* CTA */}
        <CtaPanel headingLevel="h2"
          className="mt-16"
          heading={<>Apply {displayTitle} to your business</>}
          body="Book a free 30-minute strategy call. No obligation, no sales team. You will get an honest assessment of where your business stands and what this would change."
        >
          <CTAButton
            eventLabel={`glossary_${term.slug}_cta`}
            caption="How this applies to your business."
          >
            Book a Consultation
          </CTAButton>
        </CtaPanel>

        </Container>
      </Section>
    </PageShell>
  );
}
