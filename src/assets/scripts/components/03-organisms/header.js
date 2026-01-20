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
const BACKDROP_ID = 'mobile-backdrop';
const MOBILE_BREAKPOINT = 768;
const RESIZE_DEBOUNCE_DELAY = 150;
const FOCUSABLE_ELEMENTS = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mobile Menu
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Update overlay position below header (dynamic height)
 * @returns {void}
 */
const updateOverlayPosition = () => {
  const header = document.getElementById('main-header');
  const overlay = document.getElementById(OVERLAY_ID);

  if (!header || !overlay) return;

  overlay.style.top = `${header.offsetHeight}px`;
};

/**
 * Initialize mobile menu functionality
 * @returns {void}
 */
export const initMobileMenu = () => {
  const burgerToggle = document.getElementById(BURGER_ID);
  const mobileOverlay = document.getElementById(OVERLAY_ID);
  const mobileBackdrop = document.getElementById(BACKDROP_ID);

  if (!burgerToggle || !mobileOverlay || !mobileBackdrop) {
    return;
  }

  const iconOpen = burgerToggle.querySelector('[data-burger-icon="open"]');
  const iconClose = burgerToggle.querySelector('[data-burger-icon="close"]');

  if (!iconOpen || !iconClose) {
    return;
  }

  // Update overlay position on mount
  updateOverlayPosition();

  // Get all focusable elements in overlay for focus trap
  const getFocusableElements = () => {
    return Array.from(mobileOverlay.querySelectorAll(FOCUSABLE_ELEMENTS));
  };

  /**
   * Toggle menu state
   * @param {boolean} isOpen - Current open state
   * @returns {void}
   */
  const toggleMenu = (isOpen) => {
    const shouldOpen = !isOpen;

    // Update ARIA states
    burgerToggle.setAttribute('aria-expanded', String(shouldOpen));

    // Toggle visibility (backdrop + drawer)
    mobileBackdrop.classList.toggle('hidden', isOpen);
    mobileOverlay.classList.toggle('hidden', isOpen);

    // Slide animation (remove translate when open)
    mobileOverlay.classList.toggle('-translate-x-full', isOpen);

    // Toggle burger icons
    iconOpen.classList.toggle('hidden', !isOpen);
    iconClose.classList.toggle('hidden', isOpen);

    // Lock body scroll
    document.body.style.overflow = isOpen ? '' : 'hidden';
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

  // Backdrop click handler
  mobileBackdrop.addEventListener('click', () => {
    const isOpen = burgerToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      toggleMenu(true);
    }
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
    // Update overlay position on resize
    updateOverlayPosition();
  }, RESIZE_DEBOUNCE_DELAY);

  window.addEventListener('resize', handleResize);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
