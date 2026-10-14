import Link from "next/link";
import PageShell from "../components/PageShell";
import PageHero from "../components/ui/PageHero";
import AchievementsSection from "../components/AchievementsSection";
import SectionHeading from "../components/ui/SectionHeading";
import CtaPanel from "../components/ui/CtaPanel";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import Card from "../components/ui/Card";
import CTAButton from "../components/CTAButton";

import { GLOSSARY_TERMS, GLOSSARY_FAMILIES } from "../../lib/glossary-data";

export const metadata = {
  title: "SEO and AI Glossary | Khamare Clarke",
  description:
    "Plain-English definitions of SEO, AI search, AI systems, and digital marketing terms. Every definition written for UK businesses by Khamare Clarke, an AI Implementation Specialist with an MSc in Computer Science with AI.",
  alternates: { canonical: "https://khamareclarke.com/glossary" },
  openGraph: {
    title: "SEO and AI Glossary | Khamare Clarke",
    description:
      "Plain-English definitions of SEO, AI search, AI systems, and marketing terms. Written for UK businesses by an AI Implementation Specialist.",
    url: "https://khamareclarke.com/glossary",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/about-image.png",
        width: 1200,
        height: 630,
        alt: "Khamare Clarke SEO and AI Glossary",
      },
    ],
  },
};

const definedTermSetSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": "https://khamareclarke.com/glossary#termset",
  "name": "Khamare Clarke Digital Marketing and AI Glossary",
  "description":
    "Plain-English definitions of SEO, AI search, AI systems, and digital marketing terms for UK businesses.",
  "url": "https://khamareclarke.com/glossary",
  "author": { "@type": "Person", "@id": "https://khamareclarke.com/#person" },
};

export default function GlossaryHubPage() {
  const termsByFamily = GLOSSARY_FAMILIES.map((family) => ({
    ...family,
    terms: GLOSSARY_TERMS.filter((t) => t.family === family.id),
  }));

  return (
    <PageShell
      schema={
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
          />
        </>
      }
    >
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">

        {/* Hero at the site's hero scale, not the compact one. The page was passing
            size="compact" (a 44px title) while the family headings below rendered at 60px, so
            "SEO" outranked the page's own name. PageHero's own notes reserve the compact size
            for long keyword-led titles; "SEO and AI Glossary" is four words and belongs at the
            hero scale, which is what the homepage uses.

            The lede is passed into the hero rather than sitting after the trust strip, so the
            order matches the homepage: eyebrow, title, lede, then the badges and the CTA. */}
        <PageHero
          eyebrow="Glossary"
          title={
            <>
              SEO and AI <span className="gold-text">Glossary</span>
            </>
          }
          lede="Plain-English definitions of every term a UK business owner, marketer, or fellow professional might encounter. Each page gives you the citable definition in the first two sentences, then explains why it matters and how it is applied in practice."
        />

        {/* The trust strip that sits under the hero on the homepage. */}
        <AchievementsSection />

        {termsByFamily.map((family) => (
          <section key={family.id} className="mb-16" aria-labelledby={`family-${family.id}`}>
            <SectionHeading id={`family-${family.id}`}>{family.label}</SectionHeading>
            {family.description && (
              <p className="reveal ds-body text-muted mb-6" style={{ "--rv-delay": "200ms" }}>{family.description}</p>
            )}

            <ul className="grid sm:grid-cols-2 gap-4">
              {family.terms.map((term, index) => (
                <li key={term.slug}>
                  <Card
                    as={Link}
                    href={`/glossary/${term.slug}`}
                    className="group flex flex-col h-full hover:border-primary/30 transition-colors reveal"
                    style={{ "--rv-delay": `${Math.min(index, 6) * 110}ms` }}
                  >
                    {/* Title and preview at the sizes the rest of the site uses for card copy:
                        18px bold for the title and 16px for the body. They were 14px and 12px,
                        and the preview was clamped to a single line, so every definition was
                        cut off mid-sentence on a page with room to spare. Two lines now. */}
                    <span className="text-white font-bold text-lg tracking-[-0.01em] group-hover:gold-text transition-colors">
                      {term.abbr ? `${term.title} (${term.abbr})` : term.title}
                    </span>
                    <span className="text-muted ds-body mt-1 line-clamp-2">
                      {term.definition.split(".")[0]}.
                    </span>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <CtaPanel headingLevel="h2"
          className="mt-16"
          heading={<>Not sure which of these applies to <span className="gold-text">your business</span>?</>}
          body="Book a free 30-minute call. You will get a straight answer on which discipline matters most for your growth trajectory right now."
        >
          <CTAButton eventLabel="glossary_hub_cta" caption="What these mean for you, in plain English.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>

        </Container>
      </Section>
    </PageShell>
  );
}
