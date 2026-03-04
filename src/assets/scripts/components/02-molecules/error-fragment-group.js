/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Error Fragment Group                         │
   │ Clickable fragment navigation for error pages           │
   │ Path: src/assets/scripts/components/03-organisms/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Interactive fragment navigation with accessibility
 * @module organisms/error-fragment-group
 * @created 2025-09-15
 */

import { goToPreviousPageOrHome } from '../../utils/navigation.js';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  SELECTOR: '[data-fragment-clickable]',
  FOCUS_OUTLINE: '2px solid var(--cc-green-dark)',
  FOCUS_OFFSET: '2px'
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize error fragment group navigation
 * @returns {void}
 */
export function initErrorFragmentGroup() {
  const clickableFragments = document.querySelectorAll(CONFIG.SELECTOR);

  clickableFragments.forEach(fragment => {
    makeFragmentInteractive(fragment);
  });
}

/**
 * Make a fragment clickable and accessible
 * @param {HTMLElement} fragment - Fragment element to make interactive
 * @returns {void}
 */
function makeFragmentInteractive(fragment) {
  fragment.style.cursor = 'pointer';

  // Click navigation
  fragment.addEventListener('click', handleFragmentNavigation);

  // Keyboard navigation
  fragment.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFragmentNavigation(e);
    }
  });

  // Focus styles
  fragment.addEventListener('focus', () => {
    fragment.style.outline = CONFIG.FOCUS_OUTLINE;
    fragment.style.outlineOffset = CONFIG.FOCUS_OFFSET;
  });

  fragment.addEventListener('blur', () => {
    fragment.style.outline = '';
    fragment.style.outlineOffset = '';
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Event Handlers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle navigation when fragment is clicked
 * @param {Event} event - Click or keyboard event
 * @returns {void}
 */
function handleFragmentNavigation(event) {
  event.preventDefault();
  goToPreviousPageOrHome();
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
