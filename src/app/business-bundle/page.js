"use client";

import { useEffect, useState } from "react";
import AchievementsSection from "../components/AchievementsSection";
import CTAButton from "../components/CTAButton";
import CookieBanner from "../components/CookieBanner";
import EnquiryForm from "../components/EnquiryForm";
import OfferCard from "../components/OfferCard";
import PageShell from "../components/PageShell";
import Badge from "../components/ui/Badge";
import { Container } from "../components/ui/Container";
import CtaPanel from "../components/ui/CtaPanel";
import { Section } from "../components/ui/Section";
import SectionHeading from "../components/ui/SectionHeading";
import { BUNDLE_FAQ } from "./faq";

// Metadata lives in layout.js (server) — cannot export from a "use client" page.

// The scope, the management line and the exclusions are NOT restated here. The hero
// renders the homepage's own offer card (components/OfferCard.jsx), which carries the
// four pillars and the assurance block, so a second set on this page would state the
// same offer twice.

function BusinessBundleClientContent() {
  const [openFAQ, setOpenFAQ] = useState(null);

  // Track page view and capture UTM parameters
  useEffect(() => {
    // Capture UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utm_source: urlParams.get('utm_source') || 'direct',
      utm_medium: urlParams.get('utm_medium') || 'none',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_content: urlParams.get('utm_content') || '',
      utm_term: urlParams.get('utm_term') || ''
    };

    // Store UTM params in sessionStorage for later use
    if (utmParams.utm_source !== 'direct') {
      sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
    }

    // Track page view with UTM data
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'view_business_bundle', {
        event_category: 'page_view',
        event_label: 'business_bundle_landing',
        ...utmParams
      });
    }

    // Push to dataLayer for GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'view_business_bundle',
        page_path: '/business-bundle',
        ...utmParams
      });
    }

    // Custom booking widget event listeners
    const handleBookingEvent = (e) => {
      // Listen for custom booking widget events
      if (e.data.event && e.data.event.indexOf('booking') === 0) {
        const eventName = e.data.event;

        if (eventName === 'booking.widget_opened') {
          // User opened booking widget
          if (typeof gtag !== 'undefined') {
            gtag('event', 'booking_start', {
              event_category: 'engagement',
              event_label: 'booking_widget_opened'
            });
          }
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'booking_start',
              booking_action: 'widget_opened'
            });
          }
        } else if (eventName === 'booking.meeting_scheduled') {
          // User booked a meeting
          if (typeof gtag !== 'undefined') {
            gtag('event', 'booking_completed', {
              event_category: 'conversion',
              event_label: 'meeting_scheduled',
              value: 1
            });
          }
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'booking_completed',
              booking_action: 'meeting_scheduled',
              conversion_value: 1
            });
          }
        }
      }

      // Keep legacy Calendly support for any remaining instances
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        const eventName = e.data.event;

        if (eventName === 'calendly.event_type_viewed') {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'calendly_start', {
              event_category: 'engagement',
              event_label: 'calendly_widget_opened'
            });
          }
        } else if (eventName === 'calendly.event_scheduled') {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'calendly_booked', {
              event_category: 'conversion',
              event_label: 'meeting_scheduled',
              value: 1
            });
          }
        }
      }
    };

    window.addEventListener('message', handleBookingEvent);

    return () => {
      window.removeEventListener('message', handleBookingEvent);
    };
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    // PageShell supplies the shared Navbar, ScrollProgress and Footer, plus the site-wide
    // EnquirySection. This page renders its own enquiry form instead — it needs the
    // businessType field so /api/send files its leads as 'business-bundle' — so the
    // shell's copy is suppressed to avoid two forms on one page.
    <PageShell showEnquiryForm={false}>
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">

          {/* Hero. A duplicate of the homepage's own offer card
              (components/OfferCard.jsx), so both pages present the same £999/month service
              in the same way. The service name stays above it as the page's eyebrow; the
              card carries the price, the pillars and the CTA.

              NOT text-center, deliberately. The card's pillars and assurance lines have no
              alignment of their own, so a centred section centres them — which rendered the
              same card two different ways, left-aligned on the homepage and centred here.
              The heading block is centred by its own flex wrapper instead. */}
          <section>
            <div className="flex justify-center mb-10">
              <Badge>Managed Business Systems</Badge>
            </div>

            <OfferCard eventLabel="hero_cta" />
          </section>

          {/* The trust strip that sits under the hero on the homepage. This page's hero is
              its own section rather than a PageHero, so it takes the strip explicitly. */}
          <AchievementsSection />

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* The page's own headline and intro, moved down here from the hero, followed by
              Master Clarke's four pillars. The h1 lives in this section now — the hero
              above it is the offer card, so the page still has exactly one h1. */}
          <section id="explainer-section" className="mt-16 text-center" aria-labelledby="service-heading">
            <h1
              id="service-heading"
              className="reveal reveal-blur ds-heading-2-sm text-white"
              style={{ "--rv-delay": "60ms" }}
            >
              Your website, marketing and operations.{" "}
              <span className="gold-text">Working together.</span>
            </h1>

            <p
              className="reveal ds-lede text-muted mt-6 max-w-2xl mx-auto"
              style={{ "--rv-delay": "180ms" }}
            >
              One managed service to help your business get found, capture enquiries,
              reduce manual work and see what's producing results.
            </p>

            <p
              className="reveal ds-lede text-muted mt-4 max-w-2xl mx-auto"
              style={{ "--rv-delay": "240ms" }}
            >
              No disconnected tools. No juggling multiple providers. One system, built
              around how your business actually operates.
            </p>

          </section>

          {/* The closing call to action sits directly under the headline and intro, so the
              page asks for the call while the offer is still on screen. */}
          <CtaPanel
            className="mt-16"
            headingLevel="h2"
            heading={<>Ready to start your <span className="gold-text">build?</span></>}
            body="Thirty minutes on a call. Bring your questions and I will tell you what the build would involve for your business."
          >
            <CTAButton eventLabel="secure_spot_cta" caption="Free 30-minute introductory call.">
              Book a Consultation
            </CTAButton>
          </CtaPanel>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* FAQ. One accordion, the homepage's mechanism, fed by the same array the
              structured data uses. This page used to render two FAQ blocks with different
              questions AND different markup. */}
          <section className="mt-16 text-center" aria-labelledby="faq-heading">
            <SectionHeading id="faq-heading" align="center">
              Common <span className="gold-text">questions</span>
            </SectionHeading>

            <div className="reveal border border-white/10 rounded-lg" style={{ "--rv-delay": "280ms" }}>
              {BUNDLE_FAQ.map((faq, index) => (
                <div key={faq.question} className="border-b border-white/5 last:border-b-0">
                  <button
                    className="w-full text-left flex justify-between items-center px-5 sm:px-6 py-4 sm:py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={openFAQ === index}
                  >
                    <span className="font-semibold text-base sm:text-lg pr-4 text-white">{faq.question}</span>
                    <span className="text-primary text-2xl flex items-center flex-shrink-0" aria-hidden="true">
                      {openFAQ === index ? "−" : "+"}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${openFAQ === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-5 sm:px-6 pb-5 text-muted ds-body text-sm sm:text-base">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal mt-12 text-center" style={{ "--rv-delay": "380ms" }}>
              <CTAButton eventLabel="free_consultation_cta" caption="Free 30-minute introductory call.">
                Book a Consultation
              </CTAButton>
            </div>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* Booking form. Field names, the uncontrolled inputs and the POST to /api/send
              are unchanged: /api/send derives the stored source from `businessType`, and
              handleFormSubmit reads e.target.<name>.value. */}
          <section id="book" className="mt-16 text-center" aria-labelledby="book-heading">
            <SectionHeading
              id="book-heading"
              align="center"
              lede="Tell me about the business and I will come back to you on whether the service fits, and what it would take to get you started."
            >
              Send an <span className="gold-text">enquiry</span>
            </SectionHeading>

            <div className="bg-surface-muted border border-white/10 rounded-lg p-5 sm:p-8 max-w-2xl mx-auto">
              {/* The site's one enquiry form (components/EnquiryForm.jsx), the same
                  component the homepage renders. source="business-bundle" is not sent to
                  the server: it selects whether the businessType field is included, and
                  /api/send derives the stored source from that server-side. */}
              <EnquiryForm
                source="business-bundle"
                showHeader={false}
                submitLabel="Send Enquiry"
                eventLabel="form_submit_cta"
                footerText="Free 30-minute introductory call. No obligation."
                successTitle="Thank you"
                successBody="Your enquiry has come through and I will reply to you directly."
              />
            </div>
          </section>

        </Container>
      </Section>

      {/* Sticky mobile CTA. One bar per breakpoint: the old page had a mobile bar and an
          all-breakpoint bar both pinned to bottom-0, so on a phone they stacked. */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface border-t border-white/10 p-3 pb-safe"
        id="mobile-cta"
      >
        <CTAButton eventLabel="mobile_sticky_cta" fullWidth compact caption="Free 30-minute call.">
          Book a Consultation
        </CTAButton>
      </div>

      <style jsx global>{`
        /* Mobile safe area handling */
        .pb-safe {
          padding-bottom: max(12px, env(safe-area-inset-bottom));
        }

        /* Ensure mobile CTA doesn't overlap with browser UI */
        @media (max-width: 768px) {
          #mobile-cta {
            bottom: env(safe-area-inset-bottom, 0px);
          }
        }
      `}</style>

      {/* Sticky CTA bar, desktop only */}
      <div className="hidden md:flex fixed bottom-0 left-0 right-0 z-40 justify-center bg-surface border-t border-white/10 py-3 px-4">
        <CTAButton eventLabel="sticky_cta" compact caption="Free 30-minute call.">
          Book a Consultation
        </CTAButton>
      </div>

      {/* WhatsApp floating button. Same number as the site chat widget: this page used a
          different one, so the two disagreed about the business's own phone number. */}
      <a
        href="https://wa.me/447473255886?text=Hi%20Khamare,%20I%27m%20interested%20in%20the%20AI%20Business%20Growth%20Bundle"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
              event_category: 'engagement',
              event_label: 'floating_button'
            });
          }
        }}
        className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted border border-white/10 text-primary hover:border-primary/60 transition-colors"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      </a>

      <CookieBanner />
    </PageShell>
  );
}

export default function BusinessBundlePage() {
  return <BusinessBundleClientContent />;
}
