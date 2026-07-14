"use client";
import React, { useState, useEffect } from "react";
import CTAButton from "./CTAButton";
import { motion } from "framer-motion";

const FAQ_DATA = [
  {
    question: "What does AI implementation involve in practice?",
    answer: "It is a hands-on, end-to-end process. I audit your existing workflows, identify where capacity or hours are being lost, build and integrate custom AI systems (such as search visibility engines, enquiry handlers, or CRM automations) alongside your teams, train your staff, and provide complete plain-English documentation so your business owns the capability permanently."
  },
  {
    question: "Will this displace existing staff?",
    answer: "No. The objective is capacity recovery, not headcount reduction. I work alongside your existing developers, marketing teams, and agencies. The people you already trust with your operations gain advanced technical capabilities and automation tools that eliminate repetitive administrative work, allowing them to focus on higher-value activities."
  },
  {
    question: "How is the work delivered around our compliance and data protection requirements?",
    answer: "Security and data sovereignty are prioritized. Every system is built in alignment with your organizational policies, GDPR, and data protection requirements. I ensure that data is routed securely, private business information is never used to train public models, and API-based integrations operate within strict security parameters."
  },
  {
    question: "What is the timeline, and what happens in the first month?",
    answer: "The first week is dedicated to a thorough operational and technical assessment. By the end of week two, we review the findings and agree on a prioritized roadmap. Within the first month, the first high-impact systems—such as visibility engines or primary automations—are configured, tested, and running in production alongside your team."
  },
  {
    question: "How is success measured and reported?",
    answer: "Through tangible, board-level metrics: qualified enquiries received, administrative hours recovered, rankings in AI search, and reduction in lead-response times. You receive one plain-English report each month tracking these metrics, with zero agency jargon or vanity stats."
  },
  {
    question: "What if AI is not the right answer for our organisation?",
    answer: "Every engagement begins with an operational assessment. If the audit reveals that your current systems are sufficient, or if a particular problem cannot be solved effectively with AI, I will say so directly. An honest assessment is part of my professional commitment."
  }
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
              QUESTIONS
            </motion.span>
          ) : (
            <span className="inline-block border border-[#ffb700] text-[#ffb700] text-xs font-bold px-4 py-1 rounded-full mb-6 tracking-widest uppercase relative bg-black/30 shadow-sm">
              QUESTIONS
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00] relative inline-block mx-auto whitespace-normal md:whitespace-nowrap">
            Common Questions
            <motion.span
              className="absolute inset-x-0 bottom-0 h-1 w-full rounded-full bg-gradient-to-r from-[#ffb700] to-[#ff8c00]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.3 }}
            />
          </h2>
          <div className="text-[#ADB7BE] max-w-2xl mx-auto text-base font-normal">Honest answers about compliance, timelines, success metrics, and what AI implementation looks like in practice.</div>
        </div>
        <ul className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
          {FAQ_DATA.map((faq, idx) => (
            <li key={idx}>
              <button
                className="w-full text-left flex justify-between items-center bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 px-4 sm:px-6 py-3 sm:py-4 rounded-lg focus:outline-none hover:bg-[#1a1a1a] transition-all duration-300 shadow-lg"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={openIndex === idx}
              >
                <span className="font-semibold text-base sm:text-lg pr-4">{faq.question}</span>
                <motion.span
                  className="text-[#ffb700] text-2xl flex items-center flex-shrink-0"
                  animate={openIndex === idx ? { rotate: 90, scale: 1.25, filter: 'drop-shadow(0 0 8px #ffb700)' } : { rotate: 0, scale: 1, filter: 'none' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {openIndex === idx ? "-" : "+"}
                </motion.span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="bg-[#0f0f0f]/50 backdrop-blur-sm px-6 pb-4 pt-2 rounded-b-lg text-[#ADB7BE] font-medium border-2 border-t-0 border-[#ffb700]/20 leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-12 md:mt-16">
          <CTAButton
            icon="bolt"
            eventLabel="faq_book_consultation"
            className="px-8 py-3 text-lg"
            caption="30 minutes. An honest assessment of where AI applies to your operation."
          >
            Book a Consultation
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
