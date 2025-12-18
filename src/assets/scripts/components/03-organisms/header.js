/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Header                                       │
   │ Mobile menu toggle management                           │
   │ Path: src/assets/scripts/components/03-organisms/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Header mobile menu functionality
 * @module organisms/header
 * @created 2025-01-15
 * @updated 2025-12-18
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

  burgerToggle.addEventListener('click', () => {
    const isOpen = burgerToggle.getAttribute('aria-expanded') === 'true';
    toggleMenu(isOpen);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu(true);
    }
  });

  const handleResize = debounce(() => {
    if (window.innerWidth >= MOBILE_BREAKPOINT) {
      toggleMenu(true);
    }
  }, RESIZE_DEBOUNCE_DELAY);

  window.addEventListener('resize', handleResize);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
