// Canonical entity schema — must be byte-identical on every page.
// Import PERSON_SCHEMA and PROFESSIONAL_SERVICE_SCHEMA; never define them inline elsewhere.

export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://khamareclarke.com/#person",
  "name": "Khamare Clarke",
  "jobTitle": "AI Implementation Specialist",
  "url": "https://khamareclarke.com",
  "image": {
    "@type": "ImageObject",
    "@id": "https://khamareclarke.com/images/hero-image.png",
    "url": "https://khamareclarke.com/images/hero-image.png",
    "contentUrl": "https://khamareclarke.com/images/hero-image.png",
    "name": "Khamare Clarke, AI Implementation Specialist",
    "description": "Portrait of Khamare Clarke, AI Implementation Specialist based in Stoke-on-Trent, Staffordshire",
    "width": 550,
    "height": 550
  },
  "description": "An AI implementation specialist based in Stoke-on-Trent, Staffordshire, working alongside existing business teams to implement AI across search, web, content, marketing, and automation. MSc Computer Science with Artificial Intelligence, Keele (completing 2027); documented results include 538% Google Business Profile growth and 5X lead increase.",
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
    "AI implementation",
    "AI implementation specialist",
    "AI adoption",
    "AI readiness",
    "AI integration strategy",
    "AI transformation",
    "digital marketing",
    "digital marketing consultant",
    "web design",
    "UX design",
    "custom application development",
    "content strategy",
    "AI content systems",
    "content automation",
    "Google ranking",
    "rank number one on Google",
    "search visibility",
    "search engine optimisation (SEO)",
    "local SEO",
    "technical SEO",
    "on-page SEO",
    "off-page SEO",
    "programmatic SEO",
    "e-commerce SEO",
    "international SEO",
    "SEO audit",
    "keyword research",
    "link building",
    "Core Web Vitals",
    "schema markup",
    "structured data",
    "E-E-A-T",
    "SERP",
    "Google Business Profile optimisation",
    "local pack ranking",
    "citations and NAP consistency",
    "canonical URLs",
    "crawl budget management",
    "indexing",
    "answer engine optimisation (AEO)",
    "generative engine optimisation (GEO)",
    "AI search visibility",
    "LLM optimisation",
    "AI citations",
    "llms.txt",
    "AI Overviews optimisation",
    "zero-click search",
    "entity SEO",
    "knowledge graph optimisation",
    "AI agents",
    "AI receptionists",
    "conversational AI",
    "AI chatbots",
    "business process automation",
    "workflow automation",
    "AI lead response",
    "CRM automation",
    "marketing automation",
    "AI consulting",
    "machine learning",
    "large language models",
    "prompt engineering",
    "retrieval-augmented generation (RAG)",
    "AI integration",
    "API integration",
    "PPC (pay-per-click advertising)",
    "Google Ads API",
    "cost per lead optimisation",
    "conversion rate optimisation (CRO)",
    "landing page optimisation",
    "email marketing automation",
    "lead generation",
    "marketing funnel design",
    "retargeting",
    "SEO consultant",
    "SEO freelancer",
    "AI systems engineer",
    "AI developer",
    "automation engineer",
    "AEO specialist",
    "GEO consultant",
    "AI visibility expert",
    "AI strategy consultant",
    "artificial intelligence consultant"
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
  "serviceType": [
    "SEO",
    "Local SEO",
    "AI search optimisation",
    "Programmatic SEO",
    "AI implementation",
    "AI agents",
    "AI receptionist",
    "Business automation",
    "CRM automation",
    "Email marketing automation",
    "Web development",
    "Web design",
    "Digital marketing",
    "Content systems",
    "Google Ads"
  ],
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
