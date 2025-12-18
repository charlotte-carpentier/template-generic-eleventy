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
// Imports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

import { dismiss } from '../../utils/dismiss.js';

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
 * Duration of 0 disables auto-dismiss (persistent toast)
 * @returns {void}
 */
export const initToast = () => {
  const toasts = document.querySelectorAll(SELECTOR_TOAST);

  Array.from(toasts).forEach((toast, index) => {
    // Remove excess toasts immediately
    if (index >= MAX_TOASTS) {
      toast.remove();
      return;
    }

    // Setup visible toasts with auto-dismiss
    const duration = parseInt(toast.dataset.toastDuration ?? DEFAULT_DURATION, 10);

    if (duration > 0) {
      toast.classList.add('is-visible');
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
 * Hide toast with animation
 * @param {HTMLElement} toast
 * @returns {Promise<void>}
 */
const hideToast = async (toast) => {
  if (!toast?.isConnected) return;

  activeToasts.delete(toast);
  await dismiss(toast, { duration: 300 });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
