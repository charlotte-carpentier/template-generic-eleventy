/* ===========================================================
   @ORGANISMS - ERROR-FRAGMENT-GROUP
   - Navigation functionality for fragment 6 (go back or home)
   - Click and keyboard navigation support
   - ARIA accessibility compliance
   - Works on both desktop and mobile layouts
=========================================================== */

/**
 * Initialize error fragment group navigation functionality
 */
function initErrorFragmentGroup() {
  // Find ALL clickable fragments on the page (desktop AND mobile)
  const clickableFragments = document.querySelectorAll('.error-fragment-clickable');
  
  clickableFragments.forEach(clickableFragment => {
    makeFragmentInteractive(clickableFragment);
  });
}

/**
 * Make a fragment clickable and accessible
 */
function makeFragmentInteractive(fragmentElement) {
  // Add cursor pointer (visual feedback only)
  fragmentElement.style.cursor = 'pointer';
  
  // Add click handler
  fragmentElement.addEventListener('click', handleFragmentNavigation);
  
  // Add keyboard accessibility (Enter and Space)
  fragmentElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFragmentNavigation(e);
    }
  });
  
  // Add focus styles for better accessibility
  fragmentElement.addEventListener('focus', () => {
    fragmentElement.style.outline = '2px solid var(--cc-green-dark)';
    fragmentElement.style.outlineOffset = '2px';
  });
  
  fragmentElement.addEventListener('blur', () => {
    fragmentElement.style.outline = '';
    fragmentElement.style.outlineOffset = '';
  });
}

/**
 * Handle navigation when fragment 6 is clicked
 */
function handleFragmentNavigation(event) {
  event.preventDefault();
  
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

// Initialize error fragment group when DOM is ready
document.addEventListener('DOMContentLoaded', initErrorFragmentGroup);

// Export for potential external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initErrorFragmentGroup, 
    handleFragmentNavigation, 
    canGoToPreviousPage 
  };
}