/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Header                                       │
   │ Mobile menu toggle management                           │
   │ Path: src/assets/scripts/components/03-organisms/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Header mobile menu functionality
 * @module organisms/header
 * @created 2025-01-15
 * @updated 2025-12-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Imports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { debounce } from '../../utils/debounce.js';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  BURGER_ID: 'burger-toggle',
  OVERLAY_ID: 'mobile-overlay',
  MOBILE_BREAKPOINT: 1024,
  RESIZE_DEBOUNCE_DELAY: 150
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mobile Menu
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize mobile menu functionality
 * @returns {void}
 */
export const initMobileMenu = () => {
  const burgerToggle = document.getElementById(CONFIG.BURGER_ID);
  const mobileOverlay = document.getElementById(CONFIG.OVERLAY_ID);

  if (!burgerToggle || !mobileOverlay) {
    return;
  }

  // Cache icon elements
  const iconOpen = burgerToggle.querySelector('[data-burger-icon="open"]');
  const iconClose = burgerToggle.querySelector('[data-burger-icon="close"]');

  if (!iconOpen || !iconClose) {
    return;
  }

  /**
   * Toggle menu state
   * @param {boolean} isOpen - Current open state
   * @returns {void}
   */
  const toggleMenu = (isOpen) => {
    burgerToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileOverlay.classList.toggle('hidden', isOpen);
    iconOpen.classList.toggle('hidden', !isOpen);
    iconClose.classList.toggle('hidden', isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  };

  // Toggle menu on burger click
  burgerToggle.addEventListener('click', () => {
    const isOpen = burgerToggle.getAttribute('aria-expanded') === 'true';
    toggleMenu(isOpen);
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu(true);
    }
  });

  // Close menu on desktop resize (debounced)
  const handleResize = debounce(() => {
    if (window.innerWidth >= CONFIG.MOBILE_BREAKPOINT) {
      toggleMenu(true);
    }
  }, CONFIG.RESIZE_DEBOUNCE_DELAY);

  window.addEventListener('resize', handleResize);
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
