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
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-white/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 md:h-[600px] md:w-[600px] rounded-full bg-[#ffb700]/3 blur-[100px]" />
      </div>

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
          <span className="inline-block bg-[#ffb700] text-[#222] font-bold py-2 px-4 rounded-full text-sm uppercase tracking-wider shadow-lg mb-6">
            Services
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb700]">
            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">Business Solutions</span>
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
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
                className="bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 rounded-2xl p-8 transition-all duration-300 hover:scale-105 shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
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
          className="my-24 bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 rounded-3xl p-8 md:p-12 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
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
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00] mb-4">
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
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">Transform Your Business?</span>
          </h2>
          <p className="text-xl text-[#ADB7BE] mb-8 max-w-2xl mx-auto">
            Book a free strategy call and discover how AI can unlock exponential growth for your business.
          </p>
          <CTAButton caption="Designed for teams ready to simplify delivery and scale intelligently.">Book Your Free Strategy Call</CTAButton>
        </motion.div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
