import ServicesSection from "../components/ServicesSection";
import PricingSection from "../components/PricingSection";
import CTAButton from "../components/CTAButton";
import PageShell from "../components/PageShell";
import PageHero from "../components/ui/PageHero";
import SectionHeading from "../components/ui/SectionHeading";
import CtaPanel from "../components/ui/CtaPanel";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import Card from "../components/ui/Card";

const capabilityGroups = [
  {
    title: "AI Automation & Chatbots",
    features: [
      "24/7 AI customer support agents",
      "Lead qualification & booking automation",
      "Custom workflow automation",
      "CRM & tool integrations",
      "Voice AI & phone automation",
    ],
  },
  {
    title: "Web & App Development",
    features: [
      "High-converting websites",
      "Mobile & web applications",
      "E-commerce platforms",
      "Custom dashboards & portals",
      "API development & integrations",
    ],
  },
  {
    title: "Digital Marketing",
    features: [
      "Paid ads (Google, Meta, LinkedIn)",
      "SEO & content strategy",
      "Email marketing automation",
      "Funnel design & optimization",
      "Analytics & conversion tracking",
    ],
  },
  {
    title: "Business Growth Systems",
    features: [
      "CRM setup & automation",
      "Sales pipeline optimization",
      "Customer retention systems",
      "Performance dashboards",
      "Strategic consulting & roadmaps",
    ],
  },
];

const processSteps = [
  { step: "01", title: "Discovery Call", desc: "We discuss your goals, challenges, and vision" },
  { step: "02", title: "Strategy & Proposal", desc: "Custom roadmap with clear deliverables and ROI" },
  { step: "03", title: "Build & Implement", desc: "Agile development with regular updates" },
  { step: "04", title: "Launch & Optimize", desc: "Go live with ongoing support and optimization" },
];

export default function ServicesPage() {
  return (
    <PageShell>
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="main">
          {/* Hero Section */}
          <PageHero
            eyebrow="Services"
            title={
              <>
                AI-Powered <span className="gold-text">Business Solutions</span>
              </>
            }
            size="compact"
          />
          <p
            className="reveal mt-6 mb-16 text-xl text-muted max-w-3xl leading-relaxed"
            style={{ "--rv-delay": "200ms" }}
          >
            Transform your business with custom AI systems, automation, and development that deliver measurable ROI and sustainable growth.
          </p>

          {/* Services Overview */}
          <ServicesSection />

          {/* Detailed Services */}
          <section className="my-24" aria-labelledby="what-you-get">
            <SectionHeading id="what-you-get" align="center">
              What You <span className="gold-text">Get</span>
            </SectionHeading>
            <div className="grid md:grid-cols-2 gap-8">
              {capabilityGroups.map((service, index) => (
                <Card
                  key={service.title}
                  className="reveal"
                  style={{ "--rv-delay": `${index * 110}ms` }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-primary">
                    {service.title}
                  </h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted">
                        <span className="text-primary mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* Process */}
          <section className="my-24 bg-surface-muted border border-white/10 rounded-lg p-8 md:p-12" aria-labelledby="how-it-works">
            <SectionHeading id="how-it-works" align="center">
              How It <span className="gold-text">Works</span>
            </SectionHeading>
            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((item, index) => (
                <div
                  key={item.step}
                  className="reveal text-center"
                  style={{ "--rv-delay": `${index * 110}ms` }}
                >
                  <div className="text-5xl font-black text-primary mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <PricingSection />

          {/* CTA Section */}
          <CtaPanel
            className="my-24"
            heading={
              <>
                Ready to <span className="gold-text">Transform Your Business?</span>
              </>
            }
            body="Book a free strategy call and see where AI would make the biggest difference in your business."
          >
            <CTAButton caption="Which of these you need. Nothing you don't.">
              Book Your Free Strategy Call
            </CTAButton>
          </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
