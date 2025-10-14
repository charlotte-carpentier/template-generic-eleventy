/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Modal                                        │
   │ Dialog modal with backdrop and accessibility            │
   │ Path: src/assets/scripts/components/03-organisms/      │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Modal dialog functionality with focus trap
 * @module organisms/modal
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  MODAL_SELECTOR: '[data-modal]',
  TRIGGER_SELECTOR: '[data-modal-trigger]',
  CLOSE_SELECTOR: '[data-modal-close]',
  BACKDROP_CLASS: 'modal-backdrop',
  OPEN_CLASS: 'modal-open',
  BODY_LOCK_CLASS: 'modal-active'
};

// Store active modal and focus element
let activeModal = null;
let previousFocus = null;
let focusableElements = [];


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize modal functionality
 * @returns {void}
 */
export function initModal() {
  // Attach triggers
  const triggers = document.querySelectorAll(CONFIG.TRIGGER_SELECTOR);
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-trigger');
      const modal = document.getElementById(modalId);
      if (modal) openModal(modal);
    });
  });
  
  // Attach close buttons
  const closeButtons = document.querySelectorAll(CONFIG.CLOSE_SELECTOR);
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest(CONFIG.MODAL_SELECTOR);
      if (modal) closeModal(modal);
    });
  });
  
  // Setup modals
  const modals = document.querySelectorAll(CONFIG.MODAL_SELECTOR);
  modals.forEach(modal => setupModal(modal));
}

/**
 * Setup modal element
 * @param {HTMLElement} modal - Modal element
 * @returns {void}
 */
function setupModal(modal) {
  // ARIA attributes
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  
  // Create backdrop if not exists
  if (!modal.querySelector(`.${CONFIG.BACKDROP_CLASS}`)) {
    const backdrop = document.createElement('div');
    backdrop.className = CONFIG.BACKDROP_CLASS;
    backdrop.addEventListener('click', () => closeModal(modal));
    modal.appendChild(backdrop);
  }
  
  // Initial state
  modal.style.display = 'none';
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Open/Close
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Open modal
 * @param {HTMLElement} modal - Modal element
 * @returns {void}
 */
export function openModal(modal) {
  if (!modal || activeModal === modal) return;
  
  // Close any open modal first
  if (activeModal) {
    closeModal(activeModal);
  }
  
  // Store current focus
  previousFocus = document.activeElement;
  
  // Show modal
  modal.style.display = 'flex';
  modal.classList.add(CONFIG.OPEN_CLASS);
  modal.setAttribute('aria-hidden', 'false');
  
  // Lock body scroll
  document.body.classList.add(CONFIG.BODY_LOCK_CLASS);
  
  // Set active modal
  activeModal = modal;
  
  // Setup focus trap
  setupFocusTrap(modal);
  
  // Focus first focusable element
  requestAnimationFrame(() => {
    const firstFocusable = getFocusableElements(modal)[0];
    if (firstFocusable) {
      firstFocusable.focus();
    }
  });
  
  // Add keyboard listener
  document.addEventListener('keydown', handleModalKeydown);
  
  // Dispatch custom event
  modal.dispatchEvent(new CustomEvent('modal-open', { bubbles: true }));
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element
 * @returns {void}
 */
export function closeModal(modal) {
  if (!modal || activeModal !== modal) return;
  
  // Hide modal
  modal.classList.remove(CONFIG.OPEN_CLASS);
  modal.setAttribute('aria-hidden', 'true');
  
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
  
  // Unlock body scroll
  document.body.classList.remove(CONFIG.BODY_LOCK_CLASS);
  
  // Restore focus
  if (previousFocus) {
    previousFocus.focus();
    previousFocus = null;
  }
  
  // Remove keyboard listener
  document.removeEventListener('keydown', handleModalKeydown);
  
  // Clear active modal
  activeModal = null;
  focusableElements = [];
  
  // Dispatch custom event
  modal.dispatchEvent(new CustomEvent('modal-close', { bubbles: true }));
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Focus Management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Setup focus trap
 * @param {HTMLElement} modal - Modal element
 * @returns {void}
 */
function setupFocusTrap(modal) {
  focusableElements = getFocusableElements(modal);
}

/**
 * Get focusable elements in modal
 * @param {HTMLElement} modal - Modal element
 * @returns {Array<HTMLElement>} Focusable elements
 */
function getFocusableElements(modal) {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];
  
  return Array.from(modal.querySelectorAll(selectors.join(',')));
}

/**
 * Handle modal keyboard events
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {void}
 */
function handleModalKeydown(event) {
  if (!activeModal) return;
  
  // Close on Escape
  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal(activeModal);
    return;
  }
  
  // Focus trap on Tab
  if (event.key === 'Tab') {
    trapFocus(event);
  }
}

/**
 * Trap focus within modal
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {void}
 */
function trapFocus(event) {
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Public API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Toggle modal
 * @param {HTMLElement} modal - Modal element
 * @returns {void}
 */
export function toggleModal(modal) {
  if (activeModal === modal) {
    closeModal(modal);
  } else {
    openModal(modal);
  }
}

/**
 * Close all modals
 * @returns {void}
 */
export function closeAllModals() {
  if (activeModal) {
    closeModal(activeModal);
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━