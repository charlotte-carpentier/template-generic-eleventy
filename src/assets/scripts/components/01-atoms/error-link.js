/* ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Error Link                                       │
   │ Navigation for error page links with event delegation   │
   │ Path: src/assets/scripts/components/01-atoms/           │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Intelligent routing for error page navigation
 * @module atoms/error-link
 * @created 2025-09-15
 */

import { goToPreviousPageOrHome } from '../../utils/navigation.js';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  SELECTOR: '[data-error-link]',
  ACTION_ATTRIBUTE: 'data-error-link'
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize error link navigation with event delegation
 * @returns {void}
 */
export function initErrorLinks() {
  document.addEventListener('click', handleErrorLinkClick);
}

/**
 * Handle clicks on error navigation links
 * @param {Event} event - Click event
 * @returns {void}
 */
function handleErrorLinkClick(event) {
  const errorLink = event.target.closest(CONFIG.SELECTOR);

  if (!errorLink) return;

  event.preventDefault();

  const action = errorLink.getAttribute(CONFIG.ACTION_ATTRIBUTE);

  if (action === 'back-or-home') {
    goToPreviousPageOrHome();
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
