/* ┌─────────────────────────────────────────────────────────┐
   │ CORE › Main Entry Point                                 │
   │ Global initialization and site-wide functionality       │
   │ Path: src/assets/scripts/main.js                        │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Main JavaScript entry point for site-wide functionality
 * @module core/main
 * @created 2025-01-15
 * @updated 2025-12-18
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component Imports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Atoms
import { initInput } from './components/01-atoms/input.js';
import { initErrorLinks } from './components/01-atoms/error-link.js';

// Molecules
import { initBlockDragAndDrop } from './components/02-molecules/block-drag-and-drop.js';
import { initPanel } from './components/02-molecules/panel.js';
import { initSegmentedControl } from './components/02-molecules/segmented-control.js';
import { initSlider } from './components/02-molecules/slider.js';
import { initToast } from './components/02-molecules/toast.js';

// Organisms
import { initMobileMenu } from './components/03-organisms/header.js';
import { initModal, openModal } from './components/03-organisms/modal.js';
import { initErrorFragmentGroup } from './components/03-organisms/error-fragment-group.js';
import { initErrorLayout, initAccessibilityToggle } from './components/03-organisms/error-layout.js';

// Utils
import { initActiveLinks } from './utils/active-link.js';
import { dismiss } from './utils/dismiss.js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Event Delegation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Global event delegation for dismiss pattern
 * @returns {void}
 */
function initEventDelegation() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-dismiss]')) {
      const target = e.target.closest('[data-dismissible]');
      if (target) {
        dismiss(target);
      }
    }
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Conditional Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize components based on page context
 * @returns {void}
 */
function initComponents() {
  // Atoms
  if (document.querySelector('[data-input-type="input"]')) {
    initInput();
  }

  if (document.querySelector('[data-error-link]')) {
    initErrorLinks();
  }

  // Molecules
  if (document.querySelector('[data-modal-type="modal"]')) {
    initModal();
    initModalTriggers();
  }

  if (document.querySelector('[data-drag-drop]')) {
    initBlockDragAndDrop();
  }

  if (document.querySelector('[data-panel-type]')) {
    initPanel();
  }

  if (document.querySelector('[data-segmented-control]')) {
    initSegmentedControl();
  }

  if (document.querySelector('[data-slider]')) {
    initSlider();
  }

  if (document.querySelector('[data-toast-type="toast"]')) {
    initToast();
  }

  // Organisms
  if (document.querySelector('#burger-toggle')) {
    initMobileMenu();
  }

  if (document.querySelector('[data-fragment-clickable]')) {
    initErrorFragmentGroup();
  }

  if (document.querySelector('[data-error-layout-type="error-layout"]')) {
    initErrorLayout();
    initAccessibilityToggle();
  }

  // Utils - Active links for navigation
  initActiveLinks();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Modal Triggers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize modal trigger buttons
 * @returns {void}
 */
function initModalTriggers() {
  const openBtn = document.getElementById('open-modal-btn');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      openModal('demoModal1');
    });
  }

  document.addEventListener('modal-primary-action', (e) => {
    console.log('Modal primary action:', e.detail.modalName);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Global Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize site-wide functionality
 * @returns {void}
 */
function initSite() {
  initEventDelegation();
  initComponents();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bootstrap
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', initSite);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
