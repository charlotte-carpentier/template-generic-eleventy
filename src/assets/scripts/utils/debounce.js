/* ┌─────────────────────────────────────────────────────────┐
   │ UTILITY › Debounce                                      │
   │ Debounce function calls for performance optimization    │
   │ Path: src/assets/scripts/utils/                        │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Debounce utility function
 * @module utils/debounce
 * @created 2025-12-12
 */

/**
 * Debounce function execution
 * Delays execution until delay milliseconds have passed since last call
 *
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 *
 * @example
 * const handleResize = debounce(() => {
 *   console.log('Window resized');
 * }, 150);
 *
 * window.addEventListener('resize', handleResize);
 */
export const debounce = (fn, delay) => {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
