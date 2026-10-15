import Link from "next/link";
import Image from "next/image";
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

/* Preview the citable definition without cutting a word in half.
 *
 * `line-clamp-2` clips at the end of the second line box and appends its own
 * ellipsis, which lands mid-word whenever that line happens to fill up — the
 * rendered page read "…online presence to appear i…" and "…architecture, and
 * serv…". The clamp stays as the safety net, but the string handed to it ends on
 * a word boundary with our own ellipsis, so the visible cut always falls between
 * words.
 *
 * The budget is set by the NARROWEST rendered preview box, not the widest, or the
 * clamp would start cutting again on small screens. Measured capacity for two
 * lines at 16px/26px: 60 characters at 375px, 62 at 768px, 76 at 1440px. 56
 * leaves headroom for wide glyphs and the ellipsis inside the 60-character floor.
 *
 * Display only. No definition text is changed. */
const PREVIEW_CHARS = 56;

const previewDefinition = (definition) => {
  const firstSentence = definition.split(".")[0].trim();

  if (firstSentence.length <= PREVIEW_CHARS) {
    return `${firstSentence}.`;
  }

  const clipped = firstSentence.slice(0, PREVIEW_CHARS);
  const lastSpace = clipped.lastIndexOf(" ");
  const safe = lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped;

  return `${safe.replace(/[,;:]$/, "")}…`;
};

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
        {/* The wider container, because the hero now carries a portrait. The homepage's hero
            splits twelve columns into eight of text and four of portrait, and that needs the
            wider track: at the narrow width the title would break over three lines. The body
            below shares this container, so the hero text and the family headings stay on the
            same left edge — which is the rule the whole site follows. */}
        <Container size="main">

        {/* Hero at the site's hero scale, not the compact one. The page was passing
            size="compact" (a 44px title) while the family headings below rendered at 60px, so
            "SEO" outranked the page's own name. PageHero's own notes reserve the compact size
            for long keyword-led titles; "SEO and AI Glossary" is four words and belongs at the
            hero scale, which is what the homepage uses.

            The lede is passed into the hero rather than sitting after the trust strip, so the
            order matches the homepage: eyebrow, title, lede, then the badges and the CTA. */}
        {/* The portrait sits beside the text on the same twelve-column split the homepage hero
        uses — eight columns of text, four of portrait, both centred in their track — so the
        two heroes are the same composition rather than two different openings. The image is
        the homepage's own, at its own reveal delay, with the same treatment (cover, full
        height of the row). Below 1024px the portrait drops beneath the text, as it does on
        the homepage, rather than squeezing the title. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-8">
            {/* PageHero supplies the eyebrow and the title. The three lines below it — the gold
                credential line, the lede and the CTA with its caption — are rendered here with
                the homepage hero's own class strings, because PageHero stops at the lede and the
                client asked for this hero to carry the button and the homepage's structure:
                title, gold line, lede, CTA. The delays match the homepage's own stagger
                (340 / 460 / 600ms) so the reveal marches in the same order.

                NOTE: PageHero.jsx is held uncommitted by another session and its notes list this
                page among the sixteen they will not touch, so this stays in this file rather
                than going into the shared component, where it would edit over their work. */}
            <PageHero
              eyebrow="Glossary"
              title={
                <>
                  SEO and AI <span className="gold-text">Glossary</span>
                </>
              }
            />

            <p className="reveal reveal-blur text-sm sm:text-base font-semibold tracking-[0.1em] uppercase gold-text leading-none m-0 -mt-4" style={{ "--rv-delay": "340ms" }}>
              MSc Computer Science &amp; AI
            </p>

            {/* A lede that speaks to the reader's situation, not about the page. An earlier
                version described what the glossary is, which no visitor arrives wanting to
                read. This one says why the words matter to someone being quoted for the work,
                which is the reason a business owner opens a glossary at all. */}
            <p className="reveal reveal-blur mt-4 sm:mt-6 text-xl lg:text-2xl max-w-3xl text-muted leading-relaxed" style={{ "--rv-delay": "460ms" }}>
              Most SEO and AI work is quoted in words you did not choose. Knowing them is what
              lets you question the quote.
            </p>

            <div className="reveal mt-5 sm:mt-7" style={{ "--rv-delay": "600ms" }}>
              <CTAButton
                eventLabel="glossary_hero_cta"
                caption="30 minutes. An honest look at where AI fits."
              >
                Book a Consultation
              </CTAButton>
            </div>
          </div>

          <div
            className="relative isolate reveal-img reveal-blur lg:col-span-4 self-stretch"
            style={{ "--rv-delay": "320ms", "--rv-blur": "16px" }}
          >
            <Image
              src="/images/hero-image.png"
              alt="Khamare Clarke, AI Implementation Specialist"
              className="w-full h-full object-cover"
              width={550}
              height={550}
              priority
            />
          </div>
        </div>

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
                      {previewDefinition(term.definition)}
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
