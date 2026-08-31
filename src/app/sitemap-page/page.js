"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import { motion } from "framer-motion";

export default function SitemapPage() {
  const sitemapSections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
        { name: "Services", url: "/services" },
        { name: "Case Studies", url: "/case-studies" },
        { name: "Blog", url: "/blog" },
      ]
    },
    {
      title: "Special Offers",
      links: [
        { name: "Business Bundle", url: "/business-bundle" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "AI Chatbots for UK Trades", url: "/blog/ai-chatbots-save-uk-trades" },
        { name: "ROI-Driven Websites for SMEs", url: "/blog/roi-websites-uk-smes" },
      ]
    },
    {
      title: "Legal & Info",
      links: [
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms of Service", url: "/terms" },
        { name: "Cookie Policy", url: "/cookies" },
        { name: "Sitemap", url: "/sitemap-page" },
      ]
    }
  ];

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
              Sitemap
            </p>
            <span className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white">
            Site <span className="gold-text">Navigation</span>
          </h1>
          <p className="text-xl text-[#ADB7BE] max-w-3xl mx-auto leading-relaxed">
            Quick access to all pages and resources on khamareclarke.com
          </p>
        </motion.div>

        {/* Sitemap Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {sitemapSections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-[#1a1a1a] border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 rounded-2xl p-6 shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6 text-[#ffb700]">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.url}
                      className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="text-[#ffb700] group-hover:translate-x-1 transition-transform duration-300">→</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          className="mt-16 text-center bg-[#1a1a1a] border-2 border-[#ffb700]/20 rounded-3xl p-8 md:p-12 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Need Help Finding Something?
          </h2>
          <p className="text-xl text-[#ADB7BE] mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Get in touch and I'll help you out.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center bg-[#ffb700] hover:bg-[#ff8c00] text-[#222] font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-[#ffb700]"
          >
            Contact Me →
          </Link>
        </motion.div>

        {/* XML Sitemap Link */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-[#ADB7BE] mb-4">
            Looking for the XML sitemap for search engines?
          </p>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ffb700] hover:text-[#ff8c00] transition-colors duration-300 underline"
          >
            View XML Sitemap
          </a>
        </motion.div>
        </Container>
      </Section>

      <Footer />
    </main>
  );
}
