/* ┌─────────────────────────────────────────────────────────┐
   │ UTILITY › Debounce                                      │
   │ Rate-limit function calls for performance optimization  │
   │ Path: src/assets/scripts/utils/                         │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Debounce utility for high-frequency events (resize, scroll, input)
 * Delays function execution until specified time has passed since last call
 * @module utils/debounce
 * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Debounce|MDN Debounce}
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  DEFAULT_DELAY: 300
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Creates debounced function that delays execution until quiet period
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {Function} Debounced function
 * @example
 * const handleResize = debounce(() => updateLayout(), 250);
 * window.addEventListener('resize', handleResize);
 */
export const debounce = (fn, delay = CONFIG.DEFAULT_DELAY) => {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
