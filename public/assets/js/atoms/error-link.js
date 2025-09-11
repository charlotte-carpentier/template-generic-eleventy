/* ===========================================================
   @ATOM - ERROR-LINK
   - Navigation functionality for error page links
   - Intelligent routing: previous page or home fallback
   - ARIA accessibility and keyboard navigation support
=========================================================== */

/**
 * Navigate to previous page or home as fallback
 * Used by error page CTA links with onclick handlers
 */
function goToPreviousPageOrHome() {
  // Try to go back to previous page
  if (canGoToPreviousPage()) {
    goToPreviousPage();
  } else {
    goToHomePage();
  }
}

/**
 * Check if we can safely go to previous page
 */
function canGoToPreviousPage() {
  // Check if referrer exists and is not the current error page
  if (!document.referrer) {
    return false;
  }
  
  // Don't go back to the same error page (avoid loops)
  if (document.referrer === window.location.href) {
    return false;
  }
  
  // Don't go back to another error page (basic check)
  const currentPath = window.location.pathname;
  const referrerUrl = new URL(document.referrer);
  const referrerPath = referrerUrl.pathname;
  
  // Avoid going back to common error pages
  const errorPages = ['/404', '/500', '/maintenance'];
  if (errorPages.some(errorPage => referrerPath.includes(errorPage))) {
    return false;
  }
  
  return true;
}

/**
 * Navigate to previous page
 */
function goToPreviousPage() {
  try {
    // Use history.back() for better browser compatibility
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback if history is empty
      window.location.href = document.referrer;
    }
  } catch (error) {
    // Fallback to home if navigation fails
    console.warn('Failed to navigate back:', error);
    goToHomePage();
  }
}

/**
 * Navigate to home page
 */
function goToHomePage() {
  window.location.href = '/';
}

// =========================
// INITIALIZATION
// =========================

// Note: This script provides global functions for onclick handlers
// No DOM initialization needed as functions are called directly from HTML

// Export for potential external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    goToPreviousPageOrHome, 
    canGoToPreviousPage, 
    goToPreviousPage,
    goToHomePage
  };
}