/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Error Fragment Group                         │
   │ Clickable fragment navigation for error pages           │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Interactive fragment navigation with accessibility
 * @module molecules/error-fragment-group
 * @created 2025-09-15
 */

import { goToPreviousPageOrHome } from '../../utils/navigation.js';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  SELECTOR: '[data-fragment-clickable]'
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
 * Make a fragment clickable and keyboard accessible
 * @param {HTMLElement} fragment - Fragment element to make interactive
 * @returns {void}
 */
function makeFragmentInteractive(fragment) {
  fragment.addEventListener('click', handleFragmentNavigation);
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Event Handlers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle navigation when fragment is clicked or activated by keyboard
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
