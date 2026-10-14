import Image from "next/image";
import HeroSection from "./components/HeroSection";
import CTAButton from "./components/CTAButton";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import FAQSection from "./components/FAQSection";
import AchievementsSection from "./components/AchievementsSection";
import PricingSection from "./components/PricingSection";
import BlogSlider from "./components/BlogSlider";
import PageShell from "./components/PageShell";
import { Section } from "./components/ui/Section";
import { Container } from "./components/ui/Container";
import { buildFaqSchema } from "../lib/faq-data";

export default function Home() {
  return (
    // The homepage renders the extracted PageShell rather than its own copy of the
    // chrome. It is the same markup in the same order — <main>, the schema script,
    // ScrollProgress, Navbar, the Section, Footer, StickyCTABar — so the output is
    // unchanged, and this is what guarantees PageShell can never drift away from the
    // homepage it was taken from. `stickyCta` is the homepage's own mobile CTA bar.
    // `showEnquiryForm={false}` because EmailSection below renders the enquiry form
    // itself, inside its own card with the contact image and heading — suppressing the
    // shell's copy keeps the homepage exactly as it is while every other page gains the
    // form from PageShell.
    <PageShell
      stickyCta
      showEnquiryForm={false}
      schema={
        /* FAQPage structured data, built from the same data the visitor reads below.
           Scoped to the homepage because that is the only page carrying these FAQs. */
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
        />
      }
    >
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="main">
          <HeroSection />
          <hr aria-hidden="true" className="section-sep" />
          <AchievementsSection />
          <hr aria-hidden="true" className="section-sep" />

          {/* Restored at the client's request. This is ServicesSection, which came off the
              homepage — the heading, the paragraph, the portrait and the CTA are back, in
              the same position and the same markup as before. Only the six capability cards
              that sat between the portrait and the CTA are not restored.

              The portrait and the CTA below were copied line for line from the old
              components/ServicesSection.jsx, including the reveal delays. That component
              had been unimported since this block replaced it, so it was deleted rather
              than left to drift; this block is now the only copy. If you need the six
              capability cards that used to sit between the portrait and the CTA, they are
              in git at cdbd3e3f:src/app/components/ServicesSection.jsx. */}
          <div className="mb-10 text-center">
            <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>
              Khamare <span className="gold-text">Clarke</span>
            </h2>

            <p className="reveal ds-lede text-[#ADB7BE] mx-auto" style={{ "--rv-delay": "200ms" }}>
              Twelve years in software engineering, artificial intelligence and machine
              learning. I have worked as an AI Solution Architect and a Google Cloud
              Engineer, and I train AI models. I now apply that same architecture to SMEs,
              using practical AI as a productive tool, not a novelty toy like vibe coders do
              nowadays. A structured audit quickly exposes exactly where a business is
              leaking, and the fix follows fast, not the months manual implementation used
              to take.
            </p>
          </div>

          <div className="reveal-img mx-auto mb-12 max-w-md" style={{ "--rv-delay": "120ms" }}>
            <div className="bg-surface-muted border border-white/10 rounded-lg p-2">
              <Image
                src="/images/about-image.png"
                width={400}
                height={400}
                alt="Khamare Clarke, AI Implementation Specialist"
                className="rounded-lg w-full h-auto aspect-square object-cover"
              />
            </div>
          </div>

          <div className="reveal mt-10 text-center" style={{ "--rv-delay": "420ms" }}>
            <CTAButton
              href="/#contact"
              eventLabel="capability_cta"
              caption="An honest look at where AI is needed."
            >
              Book a Consultation
            </CTAButton>
          </div>

          <hr aria-hidden="true" className="section-sep" />
          <ProjectsSection />
          <hr aria-hidden="true" className="section-sep" />
          <PricingSection />
          <hr aria-hidden="true" className="section-sep" />
          <BlogSlider />
          <hr aria-hidden="true" className="section-sep" />
          <FAQSection />
          <EmailSection />
        </Container>
      </Section>
    </PageShell>
  );
}
