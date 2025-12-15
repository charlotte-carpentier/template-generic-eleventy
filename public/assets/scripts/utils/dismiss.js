/* ┌─────────────────────────────────────────────────────────┐
   │ UTILITY › Dismiss                                       │
   │ Universal dismiss pattern for closeable components      │
   │ Path: src/assets/scripts/utils/                         │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Reusable dismiss/close button pattern with animations
 * Handles close button clicks, animations, and DOM cleanup
 * @module utils/dismiss
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  CLOSE_SELECTOR: '[data-dismiss]',
  HIDE_CLASS: 'is-hidden',
  ANIMATION_DURATION: 300
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Attach dismiss handler to element
 * @param {HTMLElement} element - Target element to dismiss
 * @param {Object} options - Configuration options
 * @param {string} options.closeSelector - Close button selector
 * @param {string} options.hideClass - CSS class for hidden state
 * @param {number} options.duration - Animation duration (ms)
 * @param {boolean} options.remove - Remove from DOM after animation
 * @param {Function} options.onDismiss - Callback before dismiss
 * @returns {Function} Cleanup function
 */
export const attachDismiss = (element, options = {}) => {
  const config = { ...CONFIG, remove: true, ...options };
  const closeBtn = element.querySelector(config.closeSelector);

  if (!closeBtn) return () => {};

  const handler = () => dismiss(element, config);
  closeBtn.addEventListener('click', handler);

  return () => closeBtn.removeEventListener('click', handler);
};

/**
 * Dismiss element with animation
 * @param {HTMLElement} element - Element to dismiss
 * @param {Object} options - Dismiss options
 * @returns {Promise<void>} Resolves after animation/removal
 */
export const dismiss = async (element, options = {}) => {
  if (!element || !element.isConnected) return;

  const config = { ...CONFIG, remove: true, ...options };

  config.onDismiss?.(element);

  element.dispatchEvent(new Event('dismiss', { bubbles: true }));

  await animateOut(element, config.hideClass, config.duration);

  if (config.remove) {
    element.remove();
  }
};

/**
 * Dismiss multiple elements
 * @param {HTMLElement[]} elements - Elements array
 * @param {Object} options - Dismiss options
 * @returns {Promise<void[]>} Resolves when all dismissed
 */
export const dismissAll = (elements, options = {}) => {
  return Promise.all(
    Array.from(elements).map(el => dismiss(el, options))
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Animate element out with Web Animations API
 * @param {HTMLElement} element - Element to animate
 * @param {string} hideClass - CSS class for hide state
 * @param {number} duration - Animation duration (ms)
 * @returns {Promise<void>} Animation complete
 */
const animateOut = async (element, hideClass, duration) => {
  element.classList.add(hideClass);

  const animations = element.getAnimations();

  if (animations.length > 0) {
    await Promise.all(animations.map(a => a.finished));
  } else {
    await new Promise(resolve => setTimeout(resolve, duration));
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
