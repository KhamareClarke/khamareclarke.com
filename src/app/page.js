import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import FAQSection from "./components/FAQSection";
import AchievementsSection from "./components/AchievementsSection";
import TestimonialsSection from "./components/TestimonialsSection";
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
    <PageShell
      stickyCta
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
          <ServicesSection />
          <ProjectsSection />
          <TestimonialsSection />
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
