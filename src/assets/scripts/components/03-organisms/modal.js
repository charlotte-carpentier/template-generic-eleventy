/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Modal                                        │
   │ Native HTML5 dialog with minimal JavaScript            │
   │ Path: src/assets/scripts/components/03-organisms/      │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Native HTML5 dialog functionality
 * @module organisms/modal
 * @created 2025-01-15
 * @updated 2025-12-12 (HTML5 dialog native)
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  MODAL_SELECTOR: '[data-modal-type="modal"]',
  FOOTER_SELECTOR: '[data-modal-footer]'
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize modal functionality
 * @returns {void}
 */
export const initModal = () => {
  const modals = document.querySelectorAll(CONFIG.MODAL_SELECTOR);

  modals.forEach(modal => {
    attachButtonListeners(modal);
    attachBackdropListener(modal);
  });
};

/**
 * Attach button listeners to modal
 * @param {HTMLDialogElement} modal - Dialog element
 * @returns {void}
 */
const attachButtonListeners = (modal) => {
  const footer = modal.querySelector(CONFIG.FOOTER_SELECTOR);
  if (!footer) return;

  const buttons = footer.querySelectorAll('button');
  if (buttons.length === 0) return;

  // Primary button (first) = Execute action + close
  const primaryBtn = buttons[0];
  primaryBtn?.addEventListener('click', () => {
    // Dispatch custom event for app-specific actions
    modal.dispatchEvent(new CustomEvent('modal-primary-action', {
      bubbles: true,
      detail: {
        modalName: modal.dataset.modalName,
        modal
      }
    }));

    // Close modal after action dispatch
    modal.close();
  });

  // Secondary button (last) = Cancel/Close
  const secondaryBtn = buttons[buttons.length - 1];
  secondaryBtn?.addEventListener('click', () => {
    modal.close();
  });
};

/**
 * Attach backdrop click listener (light dismiss)
 * @param {HTMLDialogElement} modal - Dialog element
 * @returns {void}
 */
const attachBackdropListener = (modal) => {
  modal.addEventListener('click', (e) => {
    // Close if click on backdrop (outside dialog content)
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Public API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Open modal
 * @param {HTMLDialogElement|string} modalOrId - Dialog element or ID
 * @returns {void}
 */
export const openModal = (modalOrId) => {
  const modal = typeof modalOrId === 'string'
    ? document.getElementById(modalOrId)
    : modalOrId;

  if (!modal) return;

  // Native showModal() method
  modal.showModal();

  // Dispatch custom event
  modal.dispatchEvent(new CustomEvent('modal-open', { bubbles: true }));
};

/**
 * Close modal
 * @param {HTMLDialogElement|string} modalOrId - Dialog element or ID
 * @returns {void}
 */
export const closeModal = (modalOrId) => {
  const modal = typeof modalOrId === 'string'
    ? document.getElementById(modalOrId)
    : modalOrId;

  if (!modal) return;

  // Native close() method
  modal.close();

  // Dispatch custom event
  modal.dispatchEvent(new CustomEvent('modal-close', { bubbles: true }));
};

/**
 * Toggle modal
 * @param {HTMLDialogElement|string} modalOrId - Dialog element or ID
 * @returns {void}
 */
export const toggleModal = (modalOrId) => {
  const modal = typeof modalOrId === 'string'
    ? document.getElementById(modalOrId)
    : modalOrId;

  if (!modal) return;

  if (modal.open) {
    closeModal(modal);
  } else {
    openModal(modal);
  }
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
