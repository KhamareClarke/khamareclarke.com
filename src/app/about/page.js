"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutSection from "../components/AboutSection";
import AchievementsSection from "../components/AchievementsSection";
import CTAButton from "../components/CTAButton";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { motion } from "framer-motion";

export default function AboutPage() {
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
            About Khamare Clarke
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb700]">
            The UK's Leading <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">AI Business Architect</span>
          </h1>
          <p className="text-xl text-[#ADB7BE] max-w-3xl mx-auto leading-relaxed">
            Transforming businesses through AI automation, custom development, and strategic growth systems that deliver measurable results.
          </p>
        </motion.div>

        {/* About Section */}
        <AboutSection />

        {/* Achievements */}
        <AchievementsSection />

        {/* Mission & Vision */}
        <motion.div
          className="my-24 bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 rounded-3xl p-8 md:p-12 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
                My Mission
              </h2>
              <p className="text-[#ADB7BE] text-lg leading-relaxed">
                To empower UK businesses with AI-driven systems that create unfair competitive advantages. I don't just build technology-I architect leverage that multiplies your impact, automates your growth, and frees you to focus on what truly matters.
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
                My Vision
              </h2>
              <p className="text-[#ADB7BE] text-lg leading-relaxed">
                A future where every ambitious business owner has access to enterprise-level AI systems that work 24/7 to generate leads, close deals, and scale operations-without the enterprise price tag or complexity.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why Work With Me */}
        <motion.div
          className="my-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
            Why Work With Me?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "",
                title: "Results-Driven",
                description: "Every engagement is measured by rankings, calls, and enquiries. I focus on outcomes that move your business forward."
              },
              {
                icon: "",
                title: "Proven Track Record",
                description: "Documented results from real UK businesses. 100% client retention. Numbers available in the case studies below."
              },
              {
                icon: "",
                title: "True Partnership",
                description: "One person accountable for the work, the results, and the reporting. No rotating agency teams."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-[#ffb700]">{item.title}</h3>
                <p className="text-[#ADB7BE]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center my-24"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">AI-Powered Business?</span>
          </h2>
          <p className="text-xl text-[#ADB7BE] mb-8 max-w-2xl mx-auto">
            Let's discuss how AI automation can transform your business and unlock exponential growth.
          </p>
          <CTAButton caption="Designed for leaders ready to map a clear plan and execute fast.">Book Your Free Strategy Call</CTAButton>
        </motion.div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
