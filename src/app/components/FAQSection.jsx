"use client";
import React, { useState, useEffect } from "react";
import CTAButton from "./CTAButton";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_DATA = [
  {
    question: "What services do you offer?",
    answer: "I provide AI automation, web & app development, digital marketing, CRM systems, product development, analytics, UI/UX optimization, and business growth consulting. Every service is tailored to deliver measurable results and real business value.",
  },
  {
    question: "How do I get started?",
    answer: "Just fill out the contact form below or book a free strategy call. We’ll discuss your goals, challenges, and how I can help. You’ll receive a personalized roadmap within 24 hours.",
  },
  {
    question: "Do you work with startups or only established businesses?",
    answer: "I work with both startups and established businesses. Whether you’re launching your first product or scaling an enterprise, I tailor solutions to your needs and growth stage.",
  },
  {
    question: "What is your process?",
    answer: "My process starts with a discovery call to understand your needs. Then I create a strategy, implement solutions, and provide ongoing optimization and support. The focus is always on ROI and sustainable growth.",
  },
  {
    question: "Can you integrate AI into my existing systems?",
    answer: "Absolutely. I specialize in integrating AI agents, automations, and analytics into your current workflows, CRMs, and platforms-seamlessly and securely, with minimal disruption to your business.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="text-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="flex flex-col items-center mb-10 mt-4 w-full text-center">
          {mounted ? (
            <motion.span
              className="inline-block border border-[#ffb700] text-[#ffb700] text-xs font-bold px-4 py-1 rounded-full mb-4 tracking-widest uppercase relative bg-black/30 shadow-sm"
              initial={{ y: 0 }}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, repeatType: "loop" }}
            >
              COMMON QUESTIONS
            </motion.span>
          ) : (
            <span className="inline-block border border-[#ffb700] text-[#ffb700] text-xs font-bold px-4 py-1 rounded-full mb-6 tracking-widest uppercase relative bg-black/30 shadow-sm">
              COMMON QUESTIONS
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00] relative inline-block mx-auto whitespace-normal md:whitespace-nowrap">
            Frequently Asked Questions
            <motion.span
              className="absolute inset-x-0 bottom-0 h-1 w-full rounded-full bg-gradient-to-r from-[#ffb700] to-[#ff8c00]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.3 }}
            />
          </h2>
          <div className="text-[#ADB7BE] max-w-2xl mx-auto text-base font-normal">Answers to the most common questions about AI, automation, and business growth for UK companies.</div>
        </div>
        {/* Floating sparkle accent above FAQ list */}
        <motion.span
          className="flex justify-center mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffb700"><circle cx="12" cy="12" r="3"/><g opacity="0.6"><circle cx="4" cy="12" r="1.3"/><circle cx="20" cy="12" r="1.3"/><circle cx="12" cy="4" r="1.3"/><circle cx="12" cy="20" r="1.3"/></g></svg>
        </motion.span>
        <ul className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-14">
          {FAQ_DATA.map((faq, idx) => (
            <motion.li
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.18 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full text-left flex justify-between items-center bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 px-4 sm:px-6 py-3 sm:py-4 rounded-lg focus:outline-none hover:bg-[#1a1a1a] transition-all duration-300 shadow-lg"
                onClick={() => toggleFAQ(idx)}
              >
                <span className="font-semibold text-base sm:text-lg pr-4">{faq.question}</span>
                <motion.span
                  className="text-[#ffb700] text-2xl flex items-center"
                  animate={openIndex === idx ? { rotate: 90, scale: 1.25, filter: 'drop-shadow(0 0 8px #ffb700)' } : { rotate: 0, scale: 1, filter: 'none' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {openIndex === idx ? "-" : "+"}
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    className="bg-[#0f0f0f]/50 backdrop-blur-sm px-6 pb-4 pt-2 rounded-b-lg text-[#ADB7BE] font-light border-2 border-t-0 border-[#ffb700]/20"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
        <motion.div
          className="flex justify-center mt-12 md:mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          viewport={{ once: true }}
        >
          <CTAButton 
            icon="bolt"
            eventLabel="faq_book_free_call"
            className="px-8 py-3 text-lg"
            caption="Designed for decision-makers who want a clear recommendation in one call."
          >
            Still Have Questions? Book a Free Call
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
