import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import PerformanceOptimizer from './components/PerformanceOptimizer'
import AccessibilityEnhancer from './components/AccessibilityEnhancer'
import SimpleChatBot from './components/SimpleChatBot'
import ConditionalChatBot from './components/ConditionalChatBot'
import Preloader from './components/Preloader'
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from '../lib/schema'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Khamare Clarke | AI Implementation Specialist",
  description: "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent, Staffordshire. He implements AI across search, web, content, marketing, and automation for UK businesses, with documented results including 538% Google Business Profile growth and a 5X lead increase.",
  keywords: 'AI implementation, AI implementation specialist, AI adoption, AI readiness, AI integration strategy, AI transformation, digital marketing, digital marketing consultant, web design, UX design, custom application development, content strategy, AI content systems, content automation, Google ranking, rank number one on Google, search visibility, SEO, local SEO, AI search optimisation, AEO, GEO, Google Business Profile, AI receptionist, Google Ads API, programmatic SEO, Staffordshire, web design, digital marketing, marketing automation, AI consultant UK',
  verification: {
    google: 'FOZp3AiubuzQwsGbpopu8OBTtmjxt17FtQ2Lup2ERM4'
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
    title: "Khamare Clarke | AI Implementation Specialist",
    description: "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent. He implements AI across search, web, content, marketing, and automation for UK businesses, with documented results including 538% Google Business Profile growth and a 5X lead increase.",
    type: 'website',
    url: 'https://khamareclarke.com',
    siteName: 'Khamare Clarke',
    images: [
      {
        url: '/images/about-image.png',
        width: 1200,
        height: 630,
        alt: 'Khamare Clarke -- AI Implementation Specialist'
      }
    ],
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Khamare Clarke | AI Implementation Specialist",
    description: "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent. He implements AI across search, web, content, marketing, and automation for UK businesses, with documented results including 538% Google Business Profile growth and a 5X lead increase.",
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
        {/* Canonical entity schema — Person */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(PERSON_SCHEMA)
        }} />

        {/* Canonical entity schema — ProfessionalService */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA)
        }} />

        {/* BreadcrumbList */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://khamareclarke.com/" },
              { "@type": "ListItem", "position": 2, "name": "About", "item": "https://khamareclarke.com/about" },
              { "@type": "ListItem", "position": 3, "name": "Services", "item": "https://khamareclarke.com/services" },
              { "@type": "ListItem", "position": 4, "name": "Blog", "item": "https://khamareclarke.com/blog" }
            ]
          })
        }} />

        {/* FAQPage schema — mirrors FAQSection content */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What does an AI Implementation Specialist do?",
                "acceptedAnswer": { "@type": "Answer", "text": "An AI Implementation Specialist assesses a business's current operations, identifies where AI can be applied practically, and implements the systems -- AI agents, automation workflows, search optimisation, web builds, and content systems -- working alongside the existing team. The emphasis is on measurable outcomes: leads captured, rankings achieved, time saved, cost per acquisition reduced." }
              },
              {
                "@type": "Question",
                "name": "How long does it take to see SEO results?",
                "acceptedAnswer": { "@type": "Answer", "text": "For local SEO, meaningful movement typically appears within 60–90 days. Ranking targets are agreed at the start of every engagement. On the Get Found tier, if those agreed targets are not reached within 60 days, that month's fee is refunded in full." }
              },
              {
                "@type": "Question",
                "name": "What is AI search optimisation (AEO/GEO)?",
                "acceptedAnswer": { "@type": "Answer", "text": "AEO (Answer Engine Optimisation) and GEO (Generative Engine Optimisation) are the disciplines of making a business appear in AI-generated answers — ChatGPT, Gemini, Perplexity, and Google AI Overviews. This is separate from traditional Google ranking and requires its own structured, entity-led approach." }
              },
              {
                "@type": "Question",
                "name": "What does the Get Found package cost?",
                "acceptedAnswer": { "@type": "Answer", "text": "The Get Found tier starts at £495 per month and includes the full AI system for a one-person business: AI receptionist, CRM, SEO, Google Business Profile management, and monthly reporting." }
              },
              {
                "@type": "Question",
                "name": "Do you work with businesses outside Stoke-on-Trent?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. Most clients are UK-wide. The base is Stoke-on-Trent and I serve businesses across Staffordshire, Cheshire, the West Midlands, Greater Manchester, and the rest of the United Kingdom remotely." }
              }
            ]
          })
        }} />
      </head>
      <body className={inter.className}>
        {/* START: GA4 + GTM Scripts with GDPR Consent */}
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

        {/* Consent update helper */}
        <Script
          id="consent-update"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
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

        <Preloader />
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
