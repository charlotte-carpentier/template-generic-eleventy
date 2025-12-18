/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Toast                                        │
   │ Auto-dismiss toast notifications with queue management  │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Auto-dismiss system for toast notifications
 * @module components/toast
 * @created 2025-12-18
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELECTOR_TOAST = '[data-toast-type="toast"]';
const MAX_TOASTS = 3;
const DEFAULT_DURATION = 5000;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// State
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const activeToasts = new Set();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize auto-dismiss for visible toasts
 * @returns {void}
 */
export const initToast = () => {
  const toasts = document.querySelectorAll(SELECTOR_TOAST);

  toasts.forEach(toast => {
    const duration = parseInt(toast.dataset.toastDuration) || DEFAULT_DURATION;

    if (duration > 0) {
      setupAutoDismiss(toast, duration);
    }
  });
};

/**
 * Setup auto-dismiss with pause on hover
 * @param {HTMLElement} toast
 * @param {number} duration
 * @returns {void}
 */
const setupAutoDismiss = (toast, duration) => {
  if (activeToasts.has(toast)) return;

  if (activeToasts.size >= MAX_TOASTS) {
    const oldest = activeToasts.values().next().value;
    hideToast(oldest);
  }

  activeToasts.add(toast);

  let timerId;
  let remaining = duration;
  let start = Date.now();

  const startTimer = () => {
    start = Date.now();
    timerId = setTimeout(() => hideToast(toast), remaining);
  };

  const pauseTimer = () => {
    clearTimeout(timerId);
    remaining -= Date.now() - start;
  };

  toast.addEventListener('mouseenter', pauseTimer);
  toast.addEventListener('mouseleave', startTimer);

  startTimer();
};

/**
 * Hide toast
 * @param {HTMLElement} toast
 * @returns {void}
 */
const hideToast = (toast) => {
  if (!toast || !toast.isConnected) return;

  activeToasts.delete(toast);
  toast.style.display = 'none';
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
