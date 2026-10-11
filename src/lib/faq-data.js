/**
 * Single source of truth for the homepage FAQs.
 *
 * Both the visible FAQ (components/FAQSection.jsx) and the FAQPage structured data
 * (app/page.js) read from this file, so the markup Google receives can never drift out
 * of step with what a visitor reads on the page. Previously the schema lived in layout.js
 * with five entirely different questions, none of which appeared on the site, while the
 * code comment claimed it mirrored the visible FAQ.
 *
 * Answers are the homepage copy verbatim. Nothing here is invented.
 */
export const HOME_FAQS = [
  {
    question: "What does AI implementation involve in practice?",
    answer:
      "I go through your workflows and find where the hours are going. Then I build the systems that fix it, working alongside your team: search visibility, enquiry handling, document processing, CRM automation. I train your people and document everything in plain English, so the capability stays with your business.",
  },
  {
    question: "Will this displace existing staff?",
    answer:
      "No. It gives your existing team more capacity. I work alongside your developers, your marketing people and your agencies. They learn to run the automation themselves, which takes the repetitive admin off them.",
  },
  {
    question: "How is the work delivered around our compliance and data protection requirements?",
    answer:
      "Every system is built to follow your own policies, GDPR and your data protection requirements. Data is routed securely. Your private business information is never used to train public models and any integration through an API runs inside tight security limits.",
  },
  {
    question: "What is the timeline and what happens in the first month?",
    answer:
      "The first week is an assessment of your operations and the systems you already run. By the end of week two we go through the findings and agree what to do first. Within the first month the initial systems, usually search visibility or the main automation, are built, tested and live alongside your team.",
  },
  {
    question: "How is success measured and reported?",
    answer:
      "Board-level numbers: qualified enquiries, admin hours recovered, where you rank in AI search and how fast leads get answered. One report each month, in plain English. No agency jargon, no vanity stats.",
  },
  {
    question: "What if AI is not the right answer for our organisation?",
    answer:
      "Every engagement starts with an assessment. If your current systems are already doing the job, or AI is not the right tool for the problem, I will tell you straight.",
  },
];

/** FAQPage JSON-LD built from the same data the visitor sees. */
export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
