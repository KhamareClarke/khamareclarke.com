"use client";

import { useEffect } from 'react';

const AccessibilityEnhancer = () => {
  useEffect(() => {
    // Skip to main content link
    const addSkipLink = () => {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#ffb700] focus:text-black focus:px-4 focus:py-2 focus:rounded';
      skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.cssText = `
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 50;
          background-color: #ffb700;
          color: black;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          text-decoration: none;
          font-weight: 600;
        `;
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.cssText = `
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        `;
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    };

    // Enhance focus management
    const enhanceFocusManagement = () => {
      // Add focus indicators for keyboard navigation
      const style = document.createElement('style');
      style.textContent = `
        .focus-visible:focus {
          outline: 2px solid #ffb700 !important;
          outline-offset: 2px !important;
        }
        
        button:focus-visible,
        a:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        select:focus-visible {
          outline: 2px solid #ffb700 !important;
          outline-offset: 2px !important;
        }
      `;
      document.head.appendChild(style);
    };

    // Add ARIA labels where missing
    const enhanceARIA = () => {
      // Add ARIA labels to buttons without text
      const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      buttons.forEach(button => {
        if (!button.textContent.trim()) {
          const icon = button.querySelector('svg');
          if (icon) {
            button.setAttribute('aria-label', 'Button');
          }
        }
      });

      // Add ARIA labels to links without text
      const links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
      links.forEach(link => {
        if (!link.textContent.trim()) {
          const icon = link.querySelector('svg');
          if (icon) {
            link.setAttribute('aria-label', 'Link');
          }
        }
      });

      // Ensure form inputs have labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && input.placeholder) {
          input.setAttribute('aria-label', input.placeholder);
        }
      });
    };

    // Add keyboard navigation support
    const enhanceKeyboardNavigation = () => {
      // Trap focus in modals
      const trapFocusInModal = (modal) => {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          }
          
          if (e.key === 'Escape') {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
          }
        });
      };

      // Apply to existing modals
      const modals = document.querySelectorAll('[role="dialog"], .modal');
      modals.forEach(trapFocusInModal);
    };

    // Color contrast checker and accessibility audit
    const runAccessibilityAudit = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🎨 Accessibility Audit Results:');
        
        // Check for missing alt text
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        if (imagesWithoutAlt.length > 0) {
          console.warn(`⚠️ Found ${imagesWithoutAlt.length} images without alt text`);
        }
        
        // Check for buttons without accessible names
        const buttonsWithoutNames = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        const problematicButtons = Array.from(buttonsWithoutNames).filter(btn => !btn.textContent.trim());
        if (problematicButtons.length > 0) {
          console.warn(`⚠️ Found ${problematicButtons.length} buttons without accessible names`);
        }
        
        // Check for form inputs without labels
        const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        const problematicInputs = Array.from(inputsWithoutLabels).filter(input => {
          return !document.querySelector(`label[for="${input.id}"]`) && !input.placeholder;
        });
        if (problematicInputs.length > 0) {
          console.warn(`⚠️ Found ${problematicInputs.length} form inputs without labels`);
        }
        
        // Check heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        let headingIssues = 0;
        headings.forEach(heading => {
          const currentLevel = parseInt(heading.tagName.charAt(1));
          if (currentLevel > previousLevel + 1) {
            headingIssues++;
          }
          previousLevel = currentLevel;
        });
        if (headingIssues > 0) {
          console.warn(`⚠️ Found ${headingIssues} heading hierarchy issues`);
        }
        
        console.log('✅ Color contrast: Ensure ratios meet WCAG AA (4.5:1 normal, 3:1 large text)');
        console.log('✅ Keyboard navigation: Tab through all interactive elements');
        console.log('✅ Screen reader: Test with NVDA, JAWS, or VoiceOver');
      }
    };

    // Initialize accessibility enhancements
    addSkipLink();
    enhanceFocusManagement();
    enhanceARIA();
    enhanceKeyboardNavigation();
    runAccessibilityAudit();

    // Add main content landmark if missing
    if (!document.getElementById('main-content')) {
      const main = document.querySelector('main');
      if (main) {
        main.id = 'main-content';
      }
    }

  }, []);

  return null;
};

export default AccessibilityEnhancer;
