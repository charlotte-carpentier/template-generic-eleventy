/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILITY › Navigation
   Shared navigation logic for error pages
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * @fileoverview Centralized navigation utilities for error pages
 * @module utils/navigation
 * @created 2025-01-15
 * @updated 2025-10-17
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ERROR_PAGES = ['/404', '/500', '/maintenance'];
const HOME_PATH = '/';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Check if we can safely navigate to previous page
 * @returns {boolean} True if safe to navigate back
 */
export function canGoToPreviousPage() {
  // No referrer available
  if (!document.referrer) return false;
  
  // Avoid navigation loops
  if (document.referrer === window.location.href) return false;
  
  // Avoid going back to error pages
  try {
    const referrerUrl = new URL(document.referrer);
    const referrerPath = referrerUrl.pathname;
    
    return !ERROR_PAGES.some(errorPage => referrerPath.includes(errorPage));
  } catch (error) {
    console.warn('Navigation: Invalid referrer URL', error);
    return false;
  }
}

/**
 * Navigate to previous page
 * @returns {void}
 */
export function goToPreviousPage() {
  try {
    if (window.history.length > 1) {
      window.history.back();
    } else if (document.referrer) {
      window.location.href = document.referrer;
    } else {
      goToHomePage();
    }
  } catch (error) {
    console.warn('Navigation: Failed to go back', error);
    goToHomePage();
  }
}

/**
 * Navigate to home page
 * @returns {void}
 */
export function goToHomePage() {
  window.location.href = HOME_PATH;
}

/**
 * Navigate to previous page or home as fallback
 * Main entry point for error page navigation
 * @returns {void}
 */
export function goToPreviousPageOrHome() {
  if (canGoToPreviousPage()) {
    goToPreviousPage();
  } else {
    goToHomePage();
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━