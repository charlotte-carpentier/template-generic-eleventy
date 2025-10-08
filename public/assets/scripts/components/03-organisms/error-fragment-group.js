/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Error Fragment Group                         │
   │ Clickable fragment navigation for error pages           │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Interactive fragment navigation with accessibility
 * @module organisms/error-fragment-group
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ERROR_PAGES = ['/404', '/500', '/maintenance'];
const FOCUS_OUTLINE = '2px solid var(--cc-green-dark)';
const FOCUS_OFFSET = '2px';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize error fragment group navigation
 * @returns {void}
 */
function initErrorFragmentGroup() {
  const clickableFragments = document.querySelectorAll('.error-fragment-clickable');
  
  clickableFragments.forEach(clickableFragment => {
    makeFragmentInteractive(clickableFragment);
  });
}

/**
 * Make a fragment clickable and accessible
 * @param {HTMLElement} fragmentElement - Fragment element to make interactive
 * @returns {void}
 */
function makeFragmentInteractive(fragmentElement) {
  fragmentElement.style.cursor = 'pointer';
  
  fragmentElement.addEventListener('click', handleFragmentNavigation);
  
  fragmentElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFragmentNavigation(e);
    }
  });
  
  fragmentElement.addEventListener('focus', () => {
    fragmentElement.style.outline = FOCUS_OUTLINE;
    fragmentElement.style.outlineOffset = FOCUS_OFFSET;
  });
  
  fragmentElement.addEventListener('blur', () => {
    fragmentElement.style.outline = '';
    fragmentElement.style.outlineOffset = '';
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Navigation Logic
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle navigation when fragment is clicked
 * @param {Event} event - Click or keyboard event
 * @returns {void}
 */
function handleFragmentNavigation(event) {
  event.preventDefault();
  
  if (canGoToPreviousPage()) {
    goToPreviousPage();
  } else {
    goToHomePage();
  }
}

/**
 * Check if we can safely go to previous page
 * @returns {boolean} True if safe to navigate back
 */
function canGoToPreviousPage() {
  if (!document.referrer) return false;
  
  if (document.referrer === window.location.href) return false;
  
  const referrerUrl = new URL(document.referrer);
  const referrerPath = referrerUrl.pathname;
  
  if (ERROR_PAGES.some(errorPage => referrerPath.includes(errorPage))) {
    return false;
  }
  
  return true;
}

/**
 * Navigate to previous page
 * @returns {void}
 */
function goToPreviousPage() {
  try {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = document.referrer;
    }
  } catch (error) {
    console.warn('Failed to navigate back:', error);
    goToHomePage();
  }
}

/**
 * Navigate to home page
 * @returns {void}
 */
function goToHomePage() {
  window.location.href = '/';
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', initErrorFragmentGroup);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initErrorFragmentGroup, 
    handleFragmentNavigation, 
    canGoToPreviousPage 
  };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━