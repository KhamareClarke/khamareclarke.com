import './globals.css'
import localFont from 'next/font/local'
import Script from 'next/script'
import PerformanceOptimizer from './components/PerformanceOptimizer'
import AccessibilityEnhancer from './components/AccessibilityEnhancer'
import ConditionalChatBot from './components/ConditionalChatBot'
import Preloader from './components/Preloader'
import MotionProvider from './components/MotionProvider'
// CinematicLayer is disabled — see the note at its usage below. The file is kept so
// restoring the film layer is a one-line change.
// import CinematicLayer from './components/CinematicLayer'
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from '../lib/schema'

// The same Inter, the same file, bundled from inside the repo.
//
// This was `Inter({ subsets: ['latin'] })` from `next/font/google`, which downloads the
// woff2 from fonts.gstatic.com at BUILD time. When that fetch failed — which it did,
// transiently — the build either failed outright or, worse, emitted @font-face rules
// pointing at files that were never written. The site then rendered in a system fallback
// font with no error visible on the page. The homepage and /services were both affected.
//
// `./fonts/Inter-latin-variable.woff2` is the exact latin subset file Google serves for
// this family, at `font-weight: 100 900`, so the rendering is identical: the variable
// axis still drives every weight from 400 to 900. Nothing renders differently; the build
// simply no longer needs the network.
//
// `variable` publishes the family as a CSS custom property so Tailwind's `font-sans` (and
// therefore its Preflight `html` rule) resolve to the same face as the body class, instead
// of silently falling back to the system stack.
const inter = localFont({
  src: './fonts/Inter-latin-variable.woff2',
  weight: '100 900',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: "Khamare Clarke | AI Implementation Specialist",
  description: "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent, Staffordshire. He implements AI across search, web, content, marketing, and automation for UK businesses, with documented results including a 538% Google Business Profile interaction increase for Upgrade Roofing Solutions and a 5X lead increase for City Plaza Abu Dhabi.",
  keywords: 'AI implementation, AI implementation specialist, AI adoption, AI readiness, AI integration strategy, AI transformation, digital marketing, digital marketing consultant, web design, UX design, custom application development, content strategy, AI content systems, content automation, Google ranking, search visibility, SEO, local SEO, AI search optimisation, AEO, GEO, Google Business Profile, AI receptionist, Google Ads API, programmatic SEO, Staffordshire, web design, digital marketing, marketing automation, AI consultant UK',
  verification: {
    google: 'FOZp3AiubuzQwsGbpopu8OBTtmjxt17FtQ2Lup2ERM4'
  },
  authors: [{ name: 'Khamare Clarke' }],
  creator: 'Khamare Clarke',
  publisher: 'Khamare Clarke',
  // The vector mark leads the list deliberately. The circuit-lion is a dense thin-line
  // drawing, and the raster favicons were downscaled from the 768px source, which turns
  // it to mush at 16/32/48px. Browsers that can take an SVG (Chrome, Firefox, Edge) now
  // get a crisp one; the PNGs and the .ico stay behind it as fallbacks, and `.ico` is
  // listed LAST because `sizes: 'any'` makes it compete with the SVG if it comes first.
  icons: {
    icon: [
      { url: '/images/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
    description: "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent. He implements AI across search, web, content, marketing, and automation for UK businesses, with documented results including a 538% Google Business Profile interaction increase for Upgrade Roofing Solutions and a 5X lead increase for City Plaza Abu Dhabi.",
    type: 'website',
    url: 'https://khamareclarke.com',
    siteName: 'Khamare Clarke',
    images: [
      {
        url: '/images/about-image.png',
        width: 1200,
        height: 630,
        alt: 'Khamare Clarke | AI Implementation Specialist'
      }
    ],
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Khamare Clarke | AI Implementation Specialist",
    description: "Khamare Clarke is an AI Implementation Specialist based in Stoke-on-Trent. He implements AI across search, web, content, marketing, and automation for UK businesses, with documented results including a 538% Google Business Profile interaction increase for Upgrade Roofing Solutions and a 5X lead increase for City Plaza Abu Dhabi.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Preloader gate. Runs before first paint, so the overlay is decided before the
          page can flash. Without this the page paints first and the preloader appears
          afterwards, because the overlay only exists once React hydrates.
          Sets data-kc-preload="skip" only for /presentation, where a brand overlay in
          front of a live deck is dead air while presenting. It no longer skips
          returning visitors: Master Clarke wants the preloader on every page, so the
          overlay now runs on each navigation, not once per session.
        */}
        {/*
          Motion gate. Adds .motion-ready before first paint ONLY when JavaScript runs
          and the visitor has not asked for reduced motion. The reveal system's hidden
          state is scoped to that class, so content is never hidden by the server HTML
          or when JS is unavailable.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('motion-ready')}catch(e){}})();`,
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p==='/presentation'||p.indexOf('/presentation/')===0){document.documentElement.setAttribute('data-kc-preload','skip')}}catch(e){}})();`,
          }}
        />

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

              </head>
      <body className={`${inter.variable} ${inter.className}`}>
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

        {/* Not a <main>. Every route already renders its own, and this wrapper
            sat *outside* it — so the page had two main landmarks, one nested in
            the other, which the HTML spec forbids. Worse, the site nav is the
            first thing inside the page's main, so the "skip to main content"
            link (which targets #main-content) landed on the nav it is meant to
            skip. The page's own <main> now carries that id and holds only
            content. AccessibilityEnhancer assigns #main-content to the first
            <main> if a route ever ships without one. */}
        <div>
          <MotionProvider>{children}</MotionProvider>
        </div>

        {/* Decorative film layer: colour grade, vignette, grain. DISABLED on
            Master Clarke's instruction so the black is one flat black across the
            whole page — the grade was washing gold over the top of the frame and
            blue over the bottom, which made the header and hero read a lighter
            black than the sections below (measured rgb 12-14 at the top against
            rgb 10 elsewhere). To restore it, uncomment the import at the top of
            this file and the element below; the component and all its CSS are
            still in place. */}
        {/* <CinematicLayer /> */}

        <ConditionalChatBot />
      </body>
    </html>
  )
}
