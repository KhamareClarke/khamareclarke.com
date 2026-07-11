export const metadata = {
  title: "AI Business Growth Bundle | Khamare Clarke",
  description:
    "Accelerate business growth with AI-powered websites, ads, and CRM. Book a free consultation today.",
  keywords: "AI website builder, business automation, lead generation, chatbot, UK web developer, custom website, AI employee, business bundle, conversion optimization",
  alternates: { canonical: "/business-bundle" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Business Bundle £699 | AI-Powered Website + Lead Generation",
    description:
      "Complete AI-powered business system delivered in 7 days. Custom website, lead capture, chatbot automation, and analytics. Limited spots available.",
    url: "https://khamareclarke.com/business-bundle",
    siteName: "Khamare Clarke",
    images: [
      {
        url: "https://khamareclarke.com/images/business-bundle-og.jpg",
        width: 1200,
        height: 630,
        alt: "Business Bundle - AI-Powered Website and Lead Generation System",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Bundle £699 | AI-Powered Website + Lead Generation",
    description: "Complete AI-powered business system delivered in 7 days. Custom website, lead capture, chatbot automation, and analytics.",
    creator: "@khamareclarke",
    images: ["https://khamareclarke.com/images/business-bundle-twitter.jpg"],
  },
  other: {
    "price:amount": "699",
    "price:currency": "GBP",
    "product:availability": "limited",
    "business:contact_data:locality": "London",
    "business:contact_data:region": "England",
    "business:contact_data:country_name": "United Kingdom",
  },
};

export default function BusinessBundleLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Khamare Clarke",
            "url": "https://khamareclarke.com",
            "logo": "https://khamareclarke.com/images/logo.png",
            "description": "AI Business Growth Specialist",
            "founder": {
              "@type": "Person",
              "name": "Khamare Clarke"
            },
            "areaServed": "GB",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+44-7123-456789",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "AI Business Growth Bundle",
            "description": "Done-for-you websites, ads, and AI systems that deliver predictable growth for UK businesses",
            "provider": {
              "@type": "Organization",
              "name": "Khamare Clarke"
            },
            "areaServed": "GB",
            "serviceType": "Business Growth Consulting",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "GBP",
              "price": "750",
              "priceValidUntil": "2025-12-31",
              "availability": "https://schema.org/InStock",
              "url": "https://khamareclarke.com/business-bundle"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What's included in the Business Bundle?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Business Bundle includes a custom AI-powered website, AI chatbot and voice agent, Google Business Profile setup, social media launch with 8 posts, 1 year hosting, 7-day delivery guarantee, and 30 days after-launch support."
                }
              },
              {
                "@type": "Question",
                "name": "How fast will I see leads?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We guarantee leads within 30 days of launch, or we work free until you do. Most clients see qualified leads within the first 2 weeks after going live."
                }
              },
              {
                "@type": "Question",
                "name": "Is it completely done for me?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, this is a 100% done-for-you service. We handle design, development, content creation, AI integration, and setup. You simply provide your business information and approve the final result."
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
