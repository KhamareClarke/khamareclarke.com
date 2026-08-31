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
          <span className="inline-block bg-[#ffb700] text-[#222] font-bold py-2 px-4 rounded-full text-sm uppercase tracking-wider shadow-lg mb-6">
            Case Studies
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white">
            Real Results from <span className="text-[#ffb700]">Real Businesses</span>
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
              className="bg-[#1a1a1a] border-2 border-[#ffb700]/20 rounded-2xl p-6 text-center shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-black text-[#ffb700] mb-2">
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-[#ffb700]">
            Industries I&apos;ve Transformed
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a1a] border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-3 text-[#ffb700]">{item.industry}</h3>
                <p className="text-[#ADB7BE]">{item.result}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center my-24 bg-[#1a1a1a] border-2 border-[#ffb700]/20 rounded-3xl p-12 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to become the <span className="text-[#ffb700]">next case study?</span>
          </h2>
          <p className="text-xl text-[#ADB7BE] mb-8 max-w-2xl mx-auto">
            Book a 30-minute consultation. We will discuss where AI applies to your operation and identify potential efficiency gains.
          </p>
          <CTAButton caption="No pitch deck. No obligation.">Book a Consultation</CTAButton>
        </motion.div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
