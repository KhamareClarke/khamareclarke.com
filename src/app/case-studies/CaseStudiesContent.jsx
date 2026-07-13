"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectsSection from "../components/ProjectsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CTAButton from "../components/CTAButton";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { motion } from "framer-motion";

export default function CaseStudiesContent() {
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
            Case Studies
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb700]">
            Real Results from <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">Real Businesses</span>
          </h1>
          <p className="text-xl text-[#ADB7BE] max-w-3xl mx-auto leading-relaxed">
            Documented results from real UK businesses. SEO, AI search, and lead response, ranked by outcome.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {[
            { number: "538%", label: "Visibility Growth" },
            { number: "5X", label: "Leads in 60 Days" },
            { number: "20/day", label: "Enquiries at Peak" },
            { number: "100%", label: "Client Retention" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 rounded-2xl p-6 text-center shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00] mb-2">
                {stat.number}
              </div>
              <div className="text-[#ADB7BE]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects Section */}
        <ProjectsSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Success Stories Detail */}
        <motion.div
          className="my-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
            Industries I&apos;ve Transformed
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏗️",
                industry: "Trades and Construction",
                result: "538% growth in Google Business Profile interactions in 90 days"
              },
              {
                icon: "🏢",
                industry: "Commercial Property",
                result: "5X leads in 60 days, reaching 20 qualified enquiries per day at peak"
              },
              {
                icon: "📈",
                industry: "Professional Services",
                result: "AI receptionist responding to enquiries within seconds, 24 hours a day"
              },
              {
                icon: "🔧",
                industry: "Local Services",
                result: "Map pack rankings and Google Business Profile driving consistent inbound calls"
              },
              {
                icon: "💻",
                industry: "Web and Tech",
                result: "Programmatic service and location pages indexed and ranking within weeks"
              },
              {
                icon: "📊",
                industry: "Marketing and Agencies",
                result: "AI search visibility in ChatGPT, Gemini, and Perplexity alongside Google"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#ffb700]">{item.industry}</h3>
                <p className="text-[#ADB7BE]">{item.result}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center my-24 bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 rounded-3xl p-12 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to become the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">next case study?</span>
          </h2>
          <p className="text-xl text-[#ADB7BE] mb-8 max-w-2xl mx-auto">
            Book a free 30-minute strategy call. You will leave with a clear picture of what AI and SEO can do for your business.
          </p>
          <CTAButton caption="No pitch deck. No obligation.">Book Your Free Strategy Call</CTAButton>
        </motion.div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
