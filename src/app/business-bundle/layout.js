import { BUNDLE_FAQ } from "./faq";
import { OFFER_SCHEMA_DESCRIPTION } from "../../lib/offer-data";

export const metadata = {
  title: "Managed Business Systems | £999 per Month | Khamare Clarke",
  description:
    "One managed service for UK businesses: website, local SEO, AI search visibility, enquiry capture, CRM and workflow automation. £999 per month.",
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
    title: "Managed Business Systems | £999 per Month | Khamare Clarke",
    description:
      "One managed service for UK businesses: website, local SEO, AI search visibility, enquiry capture, CRM and workflow automation. £999 per month.",
    url: "https://khamareclarke.com/business-bundle",
    siteName: "Khamare Clarke",
    // The site default. This page previously pointed at three business-bundle images that
    // do not exist on disk, so every social share of it rendered a broken card.
    images: [
      {
        url: "/images/about-image.png",
        width: 1200,
        height: 630,
        alt: "Khamare Clarke | AI Implementation Specialist",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Managed Business Systems | £999 per Month | Khamare Clarke",
    description:
      "One managed service for UK businesses: website, local SEO, AI search visibility, enquiry capture, CRM and workflow automation. £999 per month.",
    creator: "@khamareclarke",
    images: ["/images/about-image.png"],
  },
  other: {
    "price:amount": "999",
    "price:currency": "GBP",
    "product:availability": "instock",
    "business:contact_data:locality": "Stoke-on-Trent",
    "business:contact_data:region": "Staffordshire",
    "business:contact_data:country_name": "United Kingdom",
  },
};

export default function BusinessBundleLayout({ children }) {
  return (
    <>
      {/* Organization. The contactPoint carries the number the footer already publishes
          (tel:+447473255886). The previous value here was +44-7123-456789, a
          placeholder-shaped number that was being published into structured data. */}
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
              "telephone": "+44-7473-255886",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          })
        }}
      />

      {/* Service. One service at one price, matching the page and the metadata.
          No priceValidUntil: that is a date, and no offer deadline has been approved. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Managed Business Systems",
            // The same string lib/schema.js uses for the offer catalogue, from lib/offer-data.js.
            // It used to be a second, independently worded description of the same service.
            "description": OFFER_SCHEMA_DESCRIPTION,
            "provider": {
              "@type": "Organization",
              "name": "Khamare Clarke"
            },
            "areaServed": "GB",
            "serviceType": "Business Growth Consulting",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "GBP",
              "price": "999",
              "availability": "https://schema.org/InStock",
              "url": "https://khamareclarke.com/business-bundle"
            }
          })
        }}
      />

      {/* FAQPage, built from the same array the visible accordion renders.
          This page used to emit TWO conflicting FAQPage blocks (one here, one inline in
          page.js) with different questions, plus a Product block carrying a 5-star
          Review by an author named "Verified UK Client" — a fabricated rating published
          to Google, which the claims standard bans outright. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": BUNDLE_FAQ.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      {children}
    </>
  );
}
