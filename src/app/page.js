import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
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
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden">
      {/* Background Effects - matching business-bundle */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-white/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 md:h-[600px] md:w-[600px] rounded-full bg-[#ffb700]/3 blur-[100px]" />
      </div>

      <Navbar />
      <Section className="mt-0 py-ds-4">
        <Container size="main">
          <HeroSection />
          <hr aria-hidden="true" className="section-sep" />
          <AchievementsSection />
          <AboutSection />
          <hr aria-hidden="true" className="section-sep" />
          <ServicesSection />
          <ProjectsSection />
          <TestimonialsSection />
          <hr aria-hidden="true" className="section-sep" />
          <FAQSection />
          <PricingSection />
          <hr aria-hidden="true" className="section-sep" />
          <BlogSlider />
          <EmailSection />
        </Container>
      </Section>
      <Footer />
      <StickyCTABar />
    </main>
  );
}
