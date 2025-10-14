/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Toast                                        │
   │ Notification toast with auto-dismiss and animations     │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Toast notification system
 * @module molecules/toast
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    CONTAINER_ID: 'toast-container',
    TOAST_CLASS: 'toast',
    SHOW_CLASS: 'toast-show',
    HIDE_CLASS: 'toast-hide',
    AUTO_DISMISS: 5000,
    ANIMATION_DURATION: 300,
    MAX_TOASTS: 3,
    POSITION: 'top-right' // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
  };
  
  // Store active toasts
  const activeToasts = [];
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Core Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Initialize toast system
   * @returns {void}
   */
  export function initToast() {
    ensureContainer();
  }
  
  /**
   * Ensure toast container exists
   * @returns {HTMLElement} Toast container
   */
  function ensureContainer() {
    let container = document.getElementById(CONFIG.CONTAINER_ID);
    
    if (!container) {
      container = document.createElement('div');
      container.id = CONFIG.CONTAINER_ID;
      container.className = `toast-container toast-container-${CONFIG.POSITION}`;
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }
    
    return container;
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Toast Creation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Show toast notification
   * @param {Object} options - Toast options
   * @param {string} options.message - Toast message
   * @param {string} options.type - Toast type (success, error, warning, info)
   * @param {number} options.duration - Auto-dismiss duration (ms)
   * @param {boolean} options.dismissible - Show close button
   * @returns {HTMLElement} Toast element
   */
  export function showToast(options) {
    const {
      message = '',
      type = 'info',
      duration = CONFIG.AUTO_DISMISS,
      dismissible = true
    } = options;
    
    // Limit max toasts
    if (activeToasts.length >= CONFIG.MAX_TOASTS) {
      dismissToast(activeToasts[0]);
    }
    
    const container = ensureContainer();
    const toast = createToastElement(message, type, dismissible);
    
    container.appendChild(toast);
    activeToasts.push(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add(CONFIG.SHOW_CLASS);
    });
    
    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(toast);
      }, duration);
    }
    
    // Dispatch event
    toast.dispatchEvent(new CustomEvent('toast-show', { 
      detail: { message, type },
      bubbles: true 
    }));
    
    return toast;
  }
  
  /**
   * Create toast element
   * @param {string} message - Toast message
   * @param {string} type - Toast type
   * @param {boolean} dismissible - Show close button
   * @returns {HTMLElement} Toast element
   */
  function createToastElement(message, type, dismissible) {
    const toast = document.createElement('div');
    const toastId = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    toast.id = toastId;
    toast.className = `${CONFIG.TOAST_CLASS} toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    
    // Message
    const messageEl = document.createElement('div');
    messageEl.className = 'toast-message';
    messageEl.textContent = message;
    toast.appendChild(messageEl);
    
    // Close button
    if (dismissible) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'toast-close';
      closeBtn.setAttribute('type', 'button');
      closeBtn.setAttribute('aria-label', 'Fermer la notification');
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', () => dismissToast(toast));
      toast.appendChild(closeBtn);
    }
    
    // Pause auto-dismiss on hover
    toast.addEventListener('mouseenter', () => {
      toast.setAttribute('data-paused', 'true');
    });
    
    toast.addEventListener('mouseleave', () => {
      toast.removeAttribute('data-paused');
    });
    
    return toast;
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Dismissal
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Dismiss toast
   * @param {HTMLElement} toast - Toast element
   * @returns {void}
   */
  export function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    
    // Remove from active list
    const index = activeToasts.indexOf(toast);
    if (index > -1) {
      activeToasts.splice(index, 1);
    }
    
    // Animate out
    toast.classList.remove(CONFIG.SHOW_CLASS);
    toast.classList.add(CONFIG.HIDE_CLASS);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, CONFIG.ANIMATION_DURATION);
    
    // Dispatch event
    toast.dispatchEvent(new CustomEvent('toast-dismiss', { bubbles: true }));
  }
  
  /**
   * Dismiss all toasts
   * @returns {void}
   */
  export function dismissAllToasts() {
    [...activeToasts].forEach(toast => dismissToast(toast));
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Convenience Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Show success toast
   * @param {string} message - Message
   * @param {Object} options - Additional options
   * @returns {HTMLElement} Toast element
   */
  export function showSuccess(message, options = {}) {
    return showToast({ message, type: 'success', ...options });
  }
  
  /**
   * Show error toast
   * @param {string} message - Message
   * @param {Object} options - Additional options
   * @returns {HTMLElement} Toast element
   */
  export function showError(message, options = {}) {
    return showToast({ message, type: 'error', duration: 0, ...options });
  }
  
  /**
   * Show warning toast
   * @param {string} message - Message
   * @param {Object} options - Additional options
   * @returns {HTMLElement} Toast element
   */
  export function showWarning(message, options = {}) {
    return showToast({ message, type: 'warning', ...options });
  }
  
  /**
   * Show info toast
   * @param {string} message - Message
   * @param {Object} options - Additional options
   * @returns {HTMLElement} Toast element
   */
  export function showInfo(message, options = {}) {
    return showToast({ message, type: 'info', ...options });
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Configuration
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Set toast position
   * @param {string} position - Position (top-right, top-left, etc.)
   * @returns {void}
   */
  export function setToastPosition(position) {
    CONFIG.POSITION = position;
    
    const container = document.getElementById(CONFIG.CONTAINER_ID);
    if (container) {
      container.className = `toast-container toast-container-${position}`;
    }
  }
  
  /**
   * Set default auto-dismiss duration
   * @param {number} duration - Duration in milliseconds
   * @returns {void}
   */
  export function setToastDuration(duration) {
    CONFIG.AUTO_DISMISS = duration;
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // May your bugs be forever exiled to the shadow realm ✦
  // Charlotte Carpentier · 2025
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━