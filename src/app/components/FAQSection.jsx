"use client";
import React, { useState, useEffect } from "react";
import CTAButton from "./CTAButton";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_DATA = [
  {
    question: "What does an AI SEO specialist do differently from a standard agency?",
    answer: "I optimise for Google and AI search engines simultaneously. That means your business gets found in traditional results and in ChatGPT, Gemini, and Perplexity answers. Most agencies do not do this yet.",
  },
  {
    question: "How quickly can you start and what does the first week look like?",
    answer: "I can start within a week of the strategy call. The first week covers a full technical audit, keyword research, and a prioritised action plan delivered in plain English before any work begins.",
  },
  {
    question: "Do you only work with large businesses or do SMEs qualify?",
    answer: "SMEs are the majority of my clients. If you have a local customer base, a trades business, or a service you want to rank in your area, you qualify. Budget starts at £495 for an audit.",
  },
  {
    question: "How do you measure success and report back?",
    answer: "Monthly plain-English reports: rankings, Google Business Profile calls, enquiry volumes, and AI search visibility. No jargon. If numbers are not moving, I tell you why and what changes.",
  },
  {
    question: "What makes your approach better than hiring a typical SEO agency?",
    answer: "I combine technical SEO, content, and AI search in one engagement. You get one person accountable for results, not a rotating team. All work is done on live campaigns, not theoretical frameworks.",
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
          <div className="text-[#ADB7BE] max-w-2xl mx-auto text-base font-normal">Honest answers about SEO, AI, and what working together actually looks like.</div>
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
            caption="30-minute strategy call. No obligation."
          >
            Book Free Call
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
