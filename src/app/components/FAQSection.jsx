"use client";
import React, { useState } from "react";
import CTAButton from "./CTAButton";
import { HOME_FAQS } from "../../lib/faq-data";


const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="text-white py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>
            Common FAQs
          </h2>
          <p className="reveal ds-lede text-[#ADB7BE] mx-auto" style={{ "--rv-delay": "200ms" }}>
            Honest answers about compliance, timelines, success metrics and what AI implementation looks like in practice.
          </p>
        </div>

        <div className="reveal border border-white/10 rounded-lg" style={{ "--rv-delay": "280ms" }}>
          {HOME_FAQS.map((faq, idx) => (
            <div key={idx} className="border-b border-white/5 last:border-b-0">
              <button
                className="w-full text-left flex justify-between items-center px-5 sm:px-6 py-4 sm:py-5 focus:outline-none"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={openIndex === idx}
              >
                <span className="font-semibold text-base sm:text-lg pr-4 text-white">{faq.question}</span>
                <span className="text-primary text-2xl flex items-center flex-shrink-0">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-out ${openIndex === idx ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-5 sm:px-6 pb-5 text-[#ADB7BE] leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 md:mt-16 text-center" style={{ "--rv-delay": "380ms" }}>
          <CTAButton
            href="/#contact"
            eventLabel="faq_book_consultation"
            caption="Let's answer all your questions."
          >
            Book a Consultation
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
