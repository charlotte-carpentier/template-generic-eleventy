/* ┌─────────────────────────────────────────────────────────┐
   │ UTILITY › Dismiss                                       │
   │ Universal dismiss pattern for closeable components      │
   │ Path: src/assets/scripts/utils/                         │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Reusable dismiss/close button pattern
 * @module utils/dismiss
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELECTOR_CLOSE = '[data-dismiss]';
const CLASS_HIDE = 'is-hidden';
const ANIMATION_DURATION = 300;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Attach dismiss handler to element
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Configuration options
 * @returns {Function} Cleanup function
 */
export const attachDismiss = (element, options = {}) => {
  const closeSelector = options.closeSelector || SELECTOR_CLOSE;
  const hideClass = options.hideClass || CLASS_HIDE;
  const duration = options.duration || ANIMATION_DURATION;
  const remove = options.remove !== undefined ? options.remove : true;
  const onDismiss = options.onDismiss;

  const closeBtn = element.querySelector(closeSelector);

  if (!closeBtn) return () => {};

  const handler = () => dismiss(element, { hideClass, duration, remove, onDismiss });
  closeBtn.addEventListener('click', handler);

  return () => closeBtn.removeEventListener('click', handler);
};

/**
 * Dismiss element with animation
 * @param {HTMLElement} element - Element to dismiss
 * @param {Object} options - Dismiss options
 * @returns {Promise<void>}
 */
export const dismiss = async (element, options = {}) => {
  if (!element || !element.isConnected) return;

  const hideClass = options.hideClass || CLASS_HIDE;
  const duration = options.duration || ANIMATION_DURATION;
  const remove = options.remove !== undefined ? options.remove : true;
  const onDismiss = options.onDismiss;

  onDismiss?.(element);

  element.dispatchEvent(new Event('dismiss', { bubbles: true }));

  await animateOut(element, hideClass, duration);

  if (remove) {
    element.remove();
  }
};

/**
 * Dismiss multiple elements
 * @param {HTMLElement[]} elements - Elements array
 * @param {Object} options - Dismiss options
 * @returns {Promise<void[]>}
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
 * Animate element out
 * @param {HTMLElement} element - Element to animate
 * @param {string} hideClass - CSS class for hide state
 * @param {number} duration - Animation duration (ms)
 * @returns {Promise<void>}
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
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
