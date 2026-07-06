/**
 * Analytics Event Tracking Module
 * 
 * This module provides functions to track user interactions and events
 * for Google Analytics 4 and Google Tag Manager.
 * 
 * TODO: Insert GA4 event tracking here after IDs are added.
 */

/**
 * Track button clicks
 * @param {string} buttonName - Name of the button clicked
 * @param {string} location - Location where the button was clicked
 */
export const trackButtonClick = (buttonName, location) => {
  // TODO: Insert GA4 event tracking here after IDs are added
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', 'button_click', {
  //     button_name: buttonName,
  //     location: location,
  //     timestamp: new Date().toISOString(),
  //   });
  // }
  
  console.log(`[Analytics] Button Click: ${buttonName} at ${location}`);
};

/**
 * Track CTA button clicks (Book Strategy Call, View Services)
 * @param {string} ctaType - Type of CTA ('strategy_call' or 'view_services')
 */
export const trackCTAClick = (ctaType) => {
  // TODO: Insert GA4 event tracking here after IDs are added
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', 'cta_click', {
  //     cta_type: ctaType,
  //     timestamp: new Date().toISOString(),
  //   });
  // }
  
  console.log(`[Analytics] CTA Click: ${ctaType}`);
};

/**
 * Track form submissions
 * @param {string} formName - Name of the form submitted
 * @param {boolean} success - Whether the submission was successful
 */
export const trackFormSubmission = (formName, success = true) => {
  // TODO: Insert GA4 event tracking here after IDs are added
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', 'form_submission', {
  //     form_name: formName,
  //     success: success,
  //     timestamp: new Date().toISOString(),
  //   });
  // }
  
  console.log(`[Analytics] Form Submission: ${formName} - Success: ${success}`);
};

/**
 * Track scroll depth
 * @param {number} percentage - Scroll depth percentage (25, 50, 75, 100)
 */
export const trackScrollDepth = (percentage) => {
  // TODO: Insert GA4 event tracking here after IDs are added
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', 'scroll_depth', {
  //     percentage: percentage,
  //     timestamp: new Date().toISOString(),
  //   });
  // }
  
  console.log(`[Analytics] Scroll Depth: ${percentage}%`);
};

/**
 * Track page views
 * @param {string} pagePath - Path of the page viewed
 * @param {string} pageTitle - Title of the page
 */
export const trackPageView = (pagePath, pageTitle) => {
  // TODO: Insert GA4 event tracking here after IDs are added
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', 'page_view', {
  //     page_path: pagePath,
  //     page_title: pageTitle,
  //     timestamp: new Date().toISOString(),
  //   });
  // }
  
  console.log(`[Analytics] Page View: ${pagePath} - ${pageTitle}`);
};

/**
 * Track video plays
 * @param {string} videoName - Name of the video played
 */
export const trackVideoPlay = (videoName) => {
  // TODO: Insert GA4 event tracking here after IDs are added
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', 'video_play', {
  //     video_name: videoName,
  //     timestamp: new Date().toISOString(),
  //   });
  // }
  
  console.log(`[Analytics] Video Play: ${videoName}`);
};

/**
 * Track outbound link clicks
 * @param {string} url - URL of the outbound link
 * @param {string} linkText - Text of the link clicked
 */
export const trackOutboundLink = (url, linkText) => {
  // TODO: Insert GA4 event tracking here after IDs are added
  // Example:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', 'outbound_link', {
  //     url: url,
  //     link_text: linkText,
  //     timestamp: new Date().toISOString(),
  //   });
  // }
  
  console.log(`[Analytics] Outbound Link: ${url} - ${linkText}`);
};

/**
 * Initialize scroll depth tracking
 * Call this function once when the page loads
 */
export const initScrollTracking = () => {
  if (typeof window === 'undefined') return;
  
  const scrollDepths = [25, 50, 75, 100];
  const trackedDepths = new Set();
  
  const handleScroll = () => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    scrollDepths.forEach((depth) => {
      if (scrollPercentage >= depth && !trackedDepths.has(depth)) {
        trackedDepths.add(depth);
        trackScrollDepth(depth);
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// Export all tracking functions
const analytics = {
  trackButtonClick,
  trackCTAClick,
  trackFormSubmission,
  trackScrollDepth,
  trackPageView,
  trackVideoPlay,
  trackOutboundLink,
  initScrollTracking,
};

export default analytics;
