// Canonical entity schema — must be byte-identical on every page.
// Import PERSON_SCHEMA and PROFESSIONAL_SERVICE_SCHEMA; never define them inline elsewhere.

export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://khamareclarke.com/#person",
  "name": "Khamare Clarke",
  "jobTitle": "SEO Specialist and AI Systems Engineer",
  "url": "https://khamareclarke.com",
  "image": "https://khamareclarke.com/images/hero-image.png",
  "description": "SEO specialist and AI systems engineer based in Stoke-on-Trent, Staffordshire. MSc Artificial Intelligence at Keele University (completing 2027). Ranks UK businesses on Google and in AI search engines including ChatGPT, Gemini, and Perplexity.",
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Keele University",
    "url": "https://www.keele.ac.uk"
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "degree",
      "name": "MSc Computer Science with Artificial Intelligence",
      "recognizedBy": { "@type": "CollegeOrUniversity", "name": "Keele University" },
      "dateCreated": "2027"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "degree",
      "name": "BSc (Hons) Software Engineering"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "degree",
      "name": "BSc (Hons) Digital Marketing"
    }
  ],
  "knowsAbout": [
    "SEO",
    "local SEO",
    "answer engine optimisation (AEO)",
    "generative engine optimisation (GEO)",
    "programmatic SEO",
    "AI agents",
    "AI receptionists",
    "Google Ads API",
    "Next.js",
    "CRM automation",
    "email marketing automation"
  ],
  "sameAs": [
    "https://www.linkedin.com/in/khamareclarke",
    "https://github.com/KhamareClarke",
    "https://www.instagram.com/khamareclarke",
    "https://www.tiktok.com/@khamareclarke",
    "https://www.facebook.com/khamareclarke"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Stoke-on-Trent",
    "addressRegion": "Staffordshire",
    "addressCountry": "GB"
  },
  "worksFor": { "@type": "ProfessionalService", "@id": "https://khamareclarke.com/#business" }
};

export const PROFESSIONAL_SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://khamareclarke.com/#business",
  "name": "Khamare Clarke",
  "url": "https://khamareclarke.com",
  "logo": "https://khamareclarke.com/images/logo.png",
  "image": "https://khamareclarke.com/images/hero-image.png",
  "description": "SEO, AI search optimisation (AEO/GEO), programmatic SEO, and AI systems for UK businesses. Based in Stoke-on-Trent, serving the whole of the United Kingdom.",
  "founder": { "@type": "Person", "@id": "https://khamareclarke.com/#person", "name": "Khamare Clarke" },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Stoke-on-Trent",
    "addressRegion": "Staffordshire",
    "addressCountry": "GB"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "53.0027", "longitude": "-2.1794" },
  "areaServed": { "@type": "Country", "name": "United Kingdom", "sameAs": "https://www.wikidata.org/wiki/Q145" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "SEO and AI Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Get Found",
        "description": "The full AI system for a one-person business: AI receptionist, CRM, SEO, Google Business Profile, and monthly reporting.",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "495",
          "priceCurrency": "GBP",
          "unitText": "month",
          "priceType": "https://schema.org/MinimumAdvertisedPrice"
        }
      },
      {
        "@type": "Offer",
        "name": "Run The Area",
        "description": "Get Found at 2x hours plus a new website, service and area pages, and email campaigns.",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "1250",
          "priceCurrency": "GBP",
          "unitText": "month",
          "priceType": "https://schema.org/MinimumAdvertisedPrice"
        }
      },
      {
        "@type": "Offer",
        "name": "Own The Market",
        "description": "Maximum firepower: 4x hours, Google Ads via the Ads API, custom apps and integrations, quarterly strategy session.",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "2500",
          "priceCurrency": "GBP",
          "unitText": "month",
          "priceType": "https://schema.org/MinimumAdvertisedPrice"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.linkedin.com/in/khamareclarke",
    "https://www.facebook.com/khamareclarke",
    "https://www.instagram.com/khamareclarke"
  ]
};

export function buildPageSchema(overrides = {}) {
  return [PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA, ...( overrides.additional || [])];
}
