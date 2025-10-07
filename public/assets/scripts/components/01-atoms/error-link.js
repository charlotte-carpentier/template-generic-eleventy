/* ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Error Link                                       │
   │ Navigation for error page links with fallback           │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Intelligent routing for error page navigation
 * @module atoms/error-link
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Navigate to previous page or home as fallback
 * Used by error page CTA links with onclick handlers
 * @returns {void}
 */
function goToPreviousPageOrHome() {
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
  // Check if referrer exists and is not current error page
  if (!document.referrer) return false;
  
  // Avoid navigation loops
  if (document.referrer === window.location.href) return false;
  
  // Avoid going back to other error pages
  const referrerUrl = new URL(document.referrer);
  const referrerPath = referrerUrl.pathname;
  
  const errorPages = ['/404', '/500', '/maintenance'];
  if (errorPages.some(errorPage => referrerPath.includes(errorPage))) {
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
// Export
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Export for external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    goToPreviousPageOrHome, 
    canGoToPreviousPage, 
    goToPreviousPage,
    goToHomePage
  };
}