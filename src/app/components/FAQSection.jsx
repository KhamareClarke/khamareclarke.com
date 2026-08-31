"use client";
import React, { useState } from "react";
import CTAButton from "./CTAButton";
import { Badge } from "./ui/Badge";

const FAQ_DATA = [
  {
    question: "What does AI implementation involve in practice?",
    answer: "I audit your workflows, find where the hours are being lost, then build and integrate the specific systems alongside your team, from search visibility and enquiry handling to document processing and CRM automation. I train them, document everything in plain English, and the capability stays with your business."
  },
  {
    question: "Will this displace existing staff?",
    answer: "No. The objective is capacity recovery, not headcount reduction. I work alongside your existing developers, marketing teams, and agencies. The people you already trust with your operations gain technical capability and automation that removes repetitive admin, letting them focus on higher-value work."
  },
  {
    question: "How is the work delivered around our compliance and data protection requirements?",
    answer: "Every system is built in alignment with your organisational policies, GDPR, and data protection requirements. Data is routed securely, private business information is never used to train public models, and API based integrations operate within strict security parameters."
  },
  {
    question: "What is the timeline, and what happens in the first month?",
    answer: "The first week is a thorough operational and technical assessment. By the end of week two we review the findings and agree on a prioritised roadmap. Within the first month, the first high impact systems, such as visibility engines or primary automations, are configured, tested, and running in production alongside your team."
  },
  {
    question: "How is success measured and reported?",
    answer: "Through board level metrics, qualified enquiries received, administrative hours recovered, rankings in AI search, and lead response times. One plain English report each month, with zero agency jargon or vanity stats."
  },
  {
    question: "What if AI is not the right answer for our organisation?",
    answer: "Every engagement begins with an operational assessment. If the audit shows your current systems are sufficient, or a problem cannot be solved effectively with AI, I will say so directly."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="text-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-6">Common FAQs</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 text-white leading-tight">
            Common FAQs
          </h2>
          <p className="text-[#ADB7BE] max-w-2xl mx-auto">
            Honest answers about compliance, timelines, success metrics, and what AI implementation looks like in practice.
          </p>
        </div>

        <div className="border border-white/10 rounded-lg">
          {FAQ_DATA.map((faq, idx) => (
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
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-5 sm:px-6 pb-5 text-[#ADB7BE] leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <CTAButton
            href="/#contact"
            eventLabel="faq_book_consultation"
            caption="An honest look at where AI fits."
          >
            Book a Consultation
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
