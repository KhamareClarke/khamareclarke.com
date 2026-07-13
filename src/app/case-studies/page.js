import CaseStudiesContent from "./CaseStudiesContent";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../lib/schema";

export const metadata = {
  title: "Case Studies | SEO and AI Results for UK Businesses | Khamare Clarke",
  description:
    "Documented SEO and AI results from real UK businesses. 538% Google Business Profile growth for a Staffordshire roofer. 5X leads in 60 days for a commercial property client. Khamare Clarke, Stoke-on-Trent.",
  alternates: { canonical: "https://khamareclarke.com/case-studies" },
  openGraph: {
    title: "Case Studies | SEO and AI Results for UK Businesses | Khamare Clarke",
    description:
      "Documented SEO and AI results from real UK businesses. 538% Google Business Profile growth. 5X leads in 60 days. Khamare Clarke.",
    url: "https://khamareclarke.com/case-studies",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/about-image.png",
        width: 1200,
        height: 630,
        alt: "Khamare Clarke — documented SEO and AI results for UK businesses",
      },
    ],
  },
};

const caseStudiesSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://khamareclarke.com/case-studies",
  "name": "Case Studies — SEO and AI Results for UK Businesses",
  "url": "https://khamareclarke.com/case-studies",
  "author": { "@type": "Person", "@id": "https://khamareclarke.com/#person" },
  "about": [
    {
      "@type": "ItemList",
      "name": "Documented client results",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Upgrade Roofing Solutions — 538% Google Business Profile interaction growth in 90 days"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "City Plaza Abu Dhabi — 5X leads in 60 days, reaching approximately 20 enquiries per day at peak"
        }
      ]
    }
  ]
};

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudiesSchema) }}
      />
      <CaseStudiesContent />
    </>
  );
}
