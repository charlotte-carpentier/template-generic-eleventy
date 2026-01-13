/* ┌─────────────────────────────────────────────────────────┐
   │ UTILITY › Active Link                                   │
   │ aria-current state management for navigation            │
   │ Path: src/assets/scripts/utils/                         │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Manages aria-current="page" for SSG navigation
 * @module utils/active-link
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current|MDN aria-current}
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELECTOR_LINK = 'a[href]';
const SELECTOR_NAV = 'nav, [role="navigation"]';
const CURRENT_VALUE = 'page';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Normalize URL for comparison (handles trailing slashes)
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL without trailing slash
 */
const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url);
    // Remove trailing slash except for root
    const pathname = urlObj.pathname === '/'
      ? '/'
      : urlObj.pathname.replace(/\/$/, '');
    return `${urlObj.origin}${pathname}`;
  } catch {
    return url;
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Set active link based on current URL
 * @param {HTMLElement} container - Navigation container
 * @param {Object} options - Configuration
 * @param {string} options.currentValue - aria-current value
 * @returns {HTMLElement|null} Active link or null
 */
export const setActiveLink = (container, options = {}) => {
  const { currentValue = CURRENT_VALUE } = options;

  const links = container.querySelectorAll(SELECTOR_LINK);
  const currentUrl = normalizeUrl(window.location.href);
  let activeLink = null;

  links.forEach(link => {
    link.removeAttribute('aria-current');

    if (normalizeUrl(link.href) === currentUrl) {
      link.setAttribute('aria-current', currentValue);
      activeLink = link;
    }
  });

  return activeLink;
};

/**
 * Initialize all navigation containers
 * @param {Object} options - Configuration
 * @returns {HTMLElement[]} Array of active links
 */
export const initActiveLinks = (options = {}) => {
  const containers = document.querySelectorAll(SELECTOR_NAV);
  const activeLinks = [];

  containers.forEach(container => {
    const active = setActiveLink(container, options);
    if (active) activeLinks.push(active);
  });

  return activeLinks;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
