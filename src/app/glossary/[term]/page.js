import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "../../components/PageShell";
import PageHero from "../../components/ui/PageHero";
import AchievementsSection from "../../components/AchievementsSection";
import SectionHeading from "../../components/ui/SectionHeading";
import CtaPanel from "../../components/ui/CtaPanel";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";
import CTAButton from "../../components/CTAButton";

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
        <Container size="narrow">

        <nav className="flex items-center gap-2 text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/glossary" className="hover:gold-text transition-colors">Glossary</Link>
          <span>/</span>
          <span className="text-white">{term.title}</span>
        </nav>

        <PageHero eyebrow={term.badge} title={term.h1} size="compact" />

        {/* The trust strip that sits under the hero on the homepage. */}
        <AchievementsSection />

        {/* Citable definition block */}
        <div className="reveal mt-6 bg-surface-muted border border-primary/30 rounded-lg p-6 mb-12" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white text-lg leading-relaxed font-medium">{term.definition}</p>
        </div>

        {/* Why it matters */}
        <section className="mt-8" aria-labelledby="why-matters">
          <SectionHeading id="why-matters">
            Why {term.title.toLowerCase()} matters for UK businesses
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            {term.whyItMatters.map((para, i) => (
              <p key={i} className="reveal" style={{ "--rv-delay": `${200 + i * 80}ms` }}>{para}</p>
            ))}
          </div>
        </section>

        {/* How Khamare applies it */}
        <section className="mt-12" aria-labelledby="how-applied">
          <SectionHeading id="how-applied">
            How Khamare Clarke applies {term.title.toLowerCase()}
          </SectionHeading>
          <div className="space-y-4 text-muted text-lg leading-relaxed">
            {term.howKhamareApplies.map((para, i) => (
              <p key={i} className="reveal" style={{ "--rv-delay": `${200 + i * 80}ms` }}>{para}</p>
            ))}
          </div>
        </section>

        {/* FAQ sections */}
        {term.faq.map((item, i) => (
          <section key={i} className="mt-12" aria-labelledby={`faq-${i}`}>
            <SectionHeading id={`faq-${i}`}>{item.q}</SectionHeading>
            <p className="reveal text-muted text-lg leading-relaxed" style={{ "--rv-delay": "200ms" }}>{item.a}</p>
          </section>
        ))}

        {/* Related terms + expertise link */}
        <nav className="mt-16 bg-surface-muted border border-white/10 rounded-lg p-8" aria-label="Related terms">
          <p className="text-white font-bold mb-4">Related terms</p>
          <ul className="space-y-2">
            {relatedTermObjects.map((related, index) => (
              <li key={related.slug} className="reveal" style={{ "--rv-delay": `${Math.min(index, 6) * 90}ms` }}>
                <Link
                  href={`/glossary/${related.slug}`}
                  className="text-muted hover:gold-text transition-colors flex items-center gap-2 text-sm"
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
                  className="text-muted hover:gold-text transition-colors flex items-center gap-2 text-sm"
                >
                  <span className="gold-text">→</span> Related expertise
                </Link>
              </li>
            )}
            <li className="reveal" style={{ "--rv-delay": "280ms" }}>
              <Link
                href="/glossary"
                className="text-muted hover:gold-text transition-colors flex items-center gap-2 text-sm"
              >
                <span className="gold-text">→</span> Back to full glossary
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA */}
        <CtaPanel headingLevel="h2"
          className="mt-12"
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
