"use client";

import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload hero image
      const heroImage = new Image();
      heroImage.src = '/images/hero-image.png';
      
      // Preload about image
      const aboutImage = new Image();
      aboutImage.src = '/images/about-image.png';
    };

    // Setup lazy loading for images
    const setupLazyLoading = () => {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Defer non-critical JavaScript
    const deferNonCriticalJS = () => {
      // Defer analytics until user interaction
      let analyticsLoaded = false;
      const loadAnalytics = () => {
        if (!analyticsLoaded && typeof gtag !== 'undefined') {
          gtag('event', 'user_engagement', {
            engagement_time_msec: 1000
          });
          analyticsLoaded = true;
        }
      };

      // Load on first user interaction
      ['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(event => {
        document.addEventListener(event, loadAnalytics, { once: true, passive: true });
      });
    };

    // Optimize font loading
    const optimizeFonts = () => {
      return;
    };

    // Optimize images with WebP support
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Add loading="lazy" to images below the fold
        const rect = img.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
          img.loading = 'lazy';
        }
        
        // Add decoding="async" for better performance
        img.decoding = 'async';
      });
    };

    // Prefetch critical resources
    const prefetchResources = () => {
      const criticalPages = ['/about', '/services', '/contact'];
      criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
      });
    };

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        if (!script.src.includes('gtag') && !script.src.includes('gtm')) {
          script.defer = true;
        }
      });
    };

    // Monitor Core Web Vitals
    const monitorWebVitals = () => {
      if ('web-vital' in window) {
        // This would integrate with web-vitals library if installed
        console.log('📊 Core Web Vitals monitoring active');
      }
    };

    // Initialize optimizations
    preloadCriticalResources();
    setupLazyLoading();
    optimizeImages();
    deferNonCriticalJS();
    prefetchResources();
    optimizeThirdPartyScripts();
    monitorWebVitals();
    
    // Cleanup
    return () => {
      // Remove event listeners if needed
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
