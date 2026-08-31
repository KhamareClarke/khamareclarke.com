"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServicesSection from "../components/ServicesSection";
import PricingSection from "../components/PricingSection";
import CTAButton from "../components/CTAButton";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Navbar />

      <Section className="py-ds-6 relative z-10">
        <Container size="main">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6 h-4">
            <span className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
            <p className="text-xs font-semibold tracking-[0.18em] uppercase gold-text leading-none whitespace-nowrap">
              Services
            </p>
            <span className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white">
            AI-Powered <span className="gold-text">Business Solutions</span>
          </h1>
          <p className="text-xl text-[#ADB7BE] max-w-3xl mx-auto leading-relaxed">
            Transform your business with custom AI systems, automation, and development that deliver measurable ROI and sustainable growth.
          </p>
        </motion.div>

        {/* Services Overview */}
        <ServicesSection />

        {/* Detailed Services */}
        <motion.div
          className="my-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-[#ffb700]">
            What You Get
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "AI Automation & Chatbots",
                features: [
                  "24/7 AI customer support agents",
                  "Lead qualification & booking automation",
                  "Custom workflow automation",
                  "CRM & tool integrations",
                  "Voice AI & phone automation"
                ]
              },
              {
                title: "Web & App Development",
                features: [
                  "High-converting websites",
                  "Mobile & web applications",
                  "E-commerce platforms",
                  "Custom dashboards & portals",
                  "API development & integrations"
                ]
              },
              {
                title: "Digital Marketing",
                features: [
                  "Paid ads (Google, Meta, LinkedIn)",
                  "SEO & content strategy",
                  "Email marketing automation",
                  "Funnel design & optimization",
                  "Analytics & conversion tracking"
                ]
              },
              {
                title: "Business Growth Systems",
                features: [
                  "CRM setup & automation",
                  "Sales pipeline optimization",
                  "Customer retention systems",
                  "Performance dashboards",
                  "Strategic consulting & roadmaps"
                ]
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a1a] border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-6 text-[#ffb700]">
                  {service.title}
                </h3>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#ADB7BE]">
                      <span className="text-[#ffb700] mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process */}
        <motion.div
          className="my-24 bg-[#1a1a1a] border-2 border-[#ffb700]/20 rounded-3xl p-8 md:p-12 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-[#ffb700]">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery Call", desc: "We discuss your goals, challenges, and vision" },
              { step: "02", title: "Strategy & Proposal", desc: "Custom roadmap with clear deliverables and ROI" },
              { step: "03", title: "Build & Implement", desc: "Agile development with regular updates" },
              { step: "04", title: "Launch & Optimize", desc: "Go live with ongoing support and optimization" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-black text-[#ffb700] mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#ADB7BE]">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing */}
        <PricingSection />

        {/* CTA Section */}
        <motion.div
          className="text-center my-24"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to <span className="gold-text">Transform Your Business?</span>
          </h2>
          <p className="text-xl text-[#ADB7BE] mb-8 max-w-2xl mx-auto">
            Book a free strategy call and see where AI would make the biggest difference in your business.
          </p>
          <CTAButton caption="Designed for teams ready to simplify delivery and scale intelligently.">Book Your Free Strategy Call</CTAButton>
        </motion.div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
