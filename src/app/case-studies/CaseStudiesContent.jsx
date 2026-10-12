"use client";
import ProjectsSection from "../components/ProjectsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CTAButton from "../components/CTAButton";
import PageHero from "../components/ui/PageHero";
import SectionHeading from "../components/ui/SectionHeading";
import CtaPanel from "../components/ui/CtaPanel";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import Card from "../components/ui/Card";

const stats = [
  { number: "538%", label: "Visibility Growth" },
  { number: "5X", label: "Leads in 60 Days" },
  { number: "20/day", label: "Enquiries at Peak" },
  { number: "100%", label: "Client Retention" }
];

const industries = [
  {
    industry: "Trades and Construction",
    result: "538% growth in Google Business Profile interactions in 90 days"
  },
  {
    industry: "Commercial Property",
    result: "5X leads in 60 days, reaching 20 qualified enquiries per day at peak"
  },
  {
    industry: "Professional Services",
    result: "AI receptionist responding to enquiries within seconds, 24 hours a day"
  },
  {
    industry: "Local Services",
    result: "Map pack rankings and Google Business Profile driving consistent inbound calls"
  },
  {
    industry: "Web and Tech",
    result: "Programmatic service and location pages indexed and ranking within weeks"
  },
  {
    industry: "Marketing and Agencies",
    result: "AI search visibility in ChatGPT, Gemini, and Perplexity alongside Google"
  }
];

export default function CaseStudiesContent() {
  return (
    <Section className="mt-0 pb-ds-4 page-top">
      <Container size="main">
        <PageHero
          eyebrow="Case Studies"
          size="compact"
          title={
            <>
              Real Results from <span className="gold-text">Real Businesses</span>
            </>
          }
          lede="Documented results from real UK businesses. SEO, AI search, and lead response, ranked by outcome."
        />

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mt-16 mb-24">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="reveal text-center"
              style={{ "--rv-delay": `${index * 110}ms` }}
            >
              <div className="ds-numeric text-4xl font-black text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Projects Section */}
        <ProjectsSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Success Stories Detail */}
        <div className="my-24">
          <SectionHeading id="industries" align="center">
            Industries I&apos;ve <span className="gold-text">Transformed</span>
          </SectionHeading>
          <div className="grid md:grid-cols-3 gap-8">
            {industries.map((item, index) => (
              <Card
                key={item.industry}
                className="reveal text-center"
                style={{ "--rv-delay": `${index * 110}ms` }}
              >
                <h3 className="text-xl font-bold mb-3 text-primary">{item.industry}</h3>
                <p className="text-muted">{item.result}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <CtaPanel headingLevel="h2"
          className="my-24"
          heading={
            <>
              Ready to become the <span className="gold-text">next case study?</span>
            </>
          }
          body="Book a 30-minute consultation. We will discuss where AI applies to your operation and identify potential efficiency gains."
        >
          <CTAButton caption="How each one was built. Start to finish.">Book a Consultation</CTAButton>
        </CtaPanel>
      </Container>
    </Section>
  );
}
