import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import PerformanceOptimizer from './components/PerformanceOptimizer'
import AccessibilityEnhancer from './components/AccessibilityEnhancer'
import SimpleChatBot from './components/SimpleChatBot'
import ConditionalChatBot from './components/ConditionalChatBot'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Khamare Clarke | The SEO Specialist with a Master's in AI",
  description: "I rank UK businesses on Google and in AI search. MSc Artificial Intelligence, Keele University. Documented client results.",
  keywords: 'SEO specialist UK, AI search visibility, Google Business Profile optimisation, local SEO UK, AI lead response, digital marketing specialist, UK business growth, Stoke-on-Trent SEO',
  verification: {
    google: 'your-google-verification-code-here'
  },
  authors: [{ name: 'Khamare Clarke' }],
  creator: 'Khamare Clarke',
  publisher: 'Khamare Clarke',
  icons: {
    icon: '/images/logo.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://khamareclarke.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Khamare Clarke | The SEO Specialist with a Master's in AI",
    description: "I rank UK businesses on Google and in AI search. MSc Artificial Intelligence, Keele University. Documented client results.",
    type: 'website',
    url: 'https://khamareclarke.com',
    siteName: 'Khamare Clarke',
    images: [
      {
        url: '/images/about-image.png',
        width: 1200,
        height: 630,
        alt: 'Khamare Clarke - AI Automation Expert'
      }
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Khamare Clarke | The SEO Specialist with a Master's in AI",
    description: "I rank UK businesses on Google and in AI search. MSc Artificial Intelligence, Keele University. Documented client results.",
    creator: '@khamareclarke',
    images: ['/images/about-image.png'],
  },
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* START: Windsurf optimisation - Font Preloading */}
        {/* END: Windsurf optimisation */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Organization", "LocalBusiness"],
            "name": "Khamare Clarke",
            "alternateName": "Khamare Clarke - AI Business Growth Specialist",
            "url": "https://khamareclarke.com",
            "logo": "https://khamareclarke.com/images/about-image.png",
            "image": "https://khamareclarke.com/images/about-image.png",
          "sameAs": [
              "https://linkedin.com/in/khamareclarke",
              "https://github.com/KhamareClarke",
              "https://www.instagram.com/khamareclarke",
              "https://www.facebook.com/khamareclarke",
              "https://www.tiktok.com/@khamareclarke",
              "https://share.google.com/nCZLWoig2FssXE2Hj"
          ],
          "description": "AI Automation, Web & App Development, and Digital Growth for real businesses. Specializing in custom AI solutions, business automation, and measurable growth strategies.",
          "founder": {
            "@type": "Person",
              "name": "Khamare Clarke",
              "jobTitle": "AI Business Growth Specialist",
              "url": "https://khamareclarke.com"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Stoke-on-Trent",
              "addressRegion": "Staffordshire",
              "addressCountry": "GB",
              "postalCode": "UK"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "53.0027",
              "longitude": "-2.1794"
            },
            "priceRange": "££-£££",
            "openingHours": "Mo-Fr 09:00-18:00",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "47",
              "bestRating": "5",
              "worstRating": "1"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+44-7545-207-215",
              "contactType": "customer service",
              "email": "systems@khamare.com",
              "availableLanguage": "English"
            },
            "areaServed": "GB",
            "serviceArea": {
              "@type": "Country",
              "name": "United Kingdom"
            }
          })
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://khamareclarke.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Services",
                "item": "https://khamareclarke.com/#services"
              }
            ]
          })
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "AI Automation, Web & App Development, Digital Marketing",
          "provider": {
            "@type": "Person",
            "name": "Khamare Clarke",
            "url": "https://khamareclarke.com/",
            "jobTitle": "AI Business Growth Specialist",
            "worksFor": {
              "@type": "Organization",
              "name": "Khamare Clarke"
            }
          },
          "areaServed": {
            "@type": "Country",
            "name": "United Kingdom"
          },
          "url": "https://khamareclarke.com/#services",
          "description": "AI automation, web/app development, digital marketing, lead generation, and business growth for UK businesses.",
          "offers": [
            {
              "@type": "Offer",
              "name": "AI Automation Services",
              "description": "Custom AI solutions and business automation"
            },
            {
              "@type": "Offer", 
              "name": "Web & App Development",
              "description": "Custom websites and mobile applications"
            },
            {
              "@type": "Offer",
              "name": "Digital Marketing",
              "description": "Lead generation and growth strategies"
            }
          ]
          })
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Khamare Clarke",
          "jobTitle": "AI Business Growth Specialist",
          "url": "https://khamareclarke.com",
          "image": "https://khamareclarke.com/images/about-image.png",
          "sameAs": [
            "https://linkedin.com/in/khamareclarke",
            "https://github.com/KhamareClarke",
            "https://www.instagram.com/khamareclarke"
          ],
          "knowsAbout": [
            "Artificial Intelligence",
            "Web Development",
            "Digital Marketing",
            "Lead Generation"
          ],
          "hasOccupation": {
            "@type": "Occupation",
            "name": "SEO Specialist",
            "occupationLocation": {
              "@type": "City",
              "name": "Stoke-on-Trent"
            }
          }
          })
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What services do you offer?",
              "acceptedAnswer": { "@type": "Answer", "text": "I provide AI automation, web & app development, digital marketing, CRM systems, product development, analytics, UI/UX optimization, and business growth consulting. Every service is tailored to deliver measurable results and real business value." }
            },
            {
              "@type": "Question",
              "name": "How do I get started?",
                "acceptedAnswer": { "@type": "Answer", "text": "Just fill out the contact form below or book a free strategy call. We'll discuss your goals, challenges, and how I can help. You'll receive a personalized roadmap within 24 hours." }
            },
            {
              "@type": "Question",
              "name": "Do you work with startups or only established businesses?",
                "acceptedAnswer": { "@type": "Answer", "text": "I work with both startups and established businesses. Whether you're launching your first product or scaling an enterprise, I tailor solutions to your needs and growth stage." }
            },
            {
              "@type": "Question",
              "name": "What is your process?",
              "acceptedAnswer": { "@type": "Answer", "text": "My process starts with a discovery call to understand your needs. Then I create a strategy, implement solutions, and provide ongoing optimization and support. The focus is always on ROI and sustainable growth." }
            },
            {
              "@type": "Question",
              "name": "Can you integrate AI into my existing systems?",
              "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. I specialize in integrating AI agents, automations, and analytics into your current workflows, CRMs, and platforms-seamlessly and securely, with minimal disruption to your business." }
            }
          ]
          })
        }} />
      </head>
      <body className={inter.className}>
        {/* START: GA4 + GTM Scripts with GDPR Consent */}
        {/* Google Analytics 4 with Consent Mode */}
        {/* Google Analytics 4 with Consent Mode */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID || 'G-PLACEHOLDER'}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              // GDPR Consent Mode - Default to denied
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 500,
              });
              
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID || 'G-PLACEHOLDER'}', {
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure',
                page_title: document.title,
                page_location: window.location.href
              });
              
              // Enhanced ecommerce and conversion tracking
              gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                content_group1: 'Portfolio Site'
              });
            `,
          }}
        />
        
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PLACEHOLDER'}');
            `,
          }}
        />
        
        {/* GTM NoScript Fallback */}
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PLACEHOLDER'}`}
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        
        {/* Consent Update Function - Call this when user accepts cookies */}
        <Script
          id="consent-update"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Function to update consent when user accepts
              window.updateConsent = function(consentType) {
                if (typeof gtag !== 'undefined') {
                  gtag('consent', 'update', {
                    'ad_storage': consentType,
                    'analytics_storage': consentType,
                    'functionality_storage': consentType,
                    'personalization_storage': consentType
                  });
                }
              };
            `,
          }}
        />
        {/* END: GA4 + GTM Scripts with GDPR Consent */}
        
        <PerformanceOptimizer />
        <AccessibilityEnhancer />
        
        <main id="main-content">
          {children}
        </main>
        
        <ConditionalChatBot />
      </body>
  </html>
  )
}
