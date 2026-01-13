/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Header                                       │
   │ Mobile menu toggle management                           │
   │ Path: src/assets/scripts/components/03-organisms/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Header mobile menu functionality
 * @module organisms/header
 * @created 2025-01-15
 * @updated 2025-01-06 (WCAG 2.2 AA compliant)
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Imports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { debounce } from '../../utils/debounce.js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BURGER_ID = 'burger-toggle';
const OVERLAY_ID = 'mobile-overlay';
const MOBILE_BREAKPOINT = 1024;
const RESIZE_DEBOUNCE_DELAY = 150;
const FOCUSABLE_ELEMENTS = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mobile Menu
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize mobile menu functionality
 * @returns {void}
 */
export const initMobileMenu = () => {
  const burgerToggle = document.getElementById(BURGER_ID);
  const mobileOverlay = document.getElementById(OVERLAY_ID);

  if (!burgerToggle || !mobileOverlay) {
    return;
  }

  const iconOpen = burgerToggle.querySelector('[data-burger-icon="open"]');
  const iconClose = burgerToggle.querySelector('[data-burger-icon="close"]');

  if (!iconOpen || !iconClose) {
    return;
  }

  // Get all focusable elements in overlay for focus trap
  const getFocusableElements = () => {
    return Array.from(mobileOverlay.querySelectorAll(FOCUSABLE_ELEMENTS));
  };

  /**
   * Toggle menu state with focus management
   * @param {boolean} isOpen - Current open state
   * @returns {void}
   */
  const toggleMenu = (isOpen) => {
    const shouldOpen = !isOpen;

    // Update ARIA states
    burgerToggle.setAttribute('aria-expanded', String(shouldOpen));

    // Toggle visibility
    mobileOverlay.classList.toggle('hidden', isOpen);
    iconOpen.classList.toggle('hidden', !isOpen);
    iconClose.classList.toggle('hidden', isOpen);

    // Lock body scroll
    document.body.style.overflow = isOpen ? '' : 'hidden';

    // Focus management (WCAG 2.4.3 Focus Order)
    if (shouldOpen) {
      // Move focus to first focusable element in overlay
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    } else {
      // Return focus to burger button
      burgerToggle.focus();
    }
  };

  /**
   * Handle Tab key for focus trap (WCAG 2.1.2 No Keyboard Trap)
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {void}
   */
  const handleFocusTrap = (e) => {
    if (e.key !== 'Tab') return;
    if (burgerToggle.getAttribute('aria-expanded') !== 'true') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Trap focus: cycle between first and last elements
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  // Burger click handler
  burgerToggle.addEventListener('click', () => {
    const isOpen = burgerToggle.getAttribute('aria-expanded') === 'true';
    toggleMenu(isOpen);
  });

  // Escape key handler (WCAG 2.1.1 Keyboard)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu(true);
    }
  });

  // Focus trap handler
  document.addEventListener('keydown', handleFocusTrap);

  // Resize handler
  const handleResize = debounce(() => {
    if (window.innerWidth >= MOBILE_BREAKPOINT) {
      toggleMenu(true);
    }
  }, RESIZE_DEBOUNCE_DELAY);

  window.addEventListener('resize', handleResize);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
