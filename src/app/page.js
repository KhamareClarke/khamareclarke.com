import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ServicesSection from "./components/ServicesSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import AchievementsSection from "./components/AchievementsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import BlogSlider from "./components/BlogSlider";
import StickyCTABar from "./components/StickyCTABar";
import { Section } from "./components/ui/Section";
import { Container } from "./components/ui/Container";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <Section className="mt-0 py-ds-4">
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
      <Footer />
      <StickyCTABar />
    </main>
  );
}
