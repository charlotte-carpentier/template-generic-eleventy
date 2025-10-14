/* ┌─────────────────────────────────────────────────────────┐
   │ CORE › Main Entry Point                                 │
   │ Global initialization and site-wide functionality       │
   │ Path: src/assets/scripts/main.js                        │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Main JavaScript entry point for site-wide functionality
 * @module core/main
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component Imports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Atoms
import { initToggle } from './components/01-atoms/toggle.js';
import { initTooltip } from './components/01-atoms/tooltip.js';
import { initInput } from './components/01-atoms/input.js';

// Molecules
import { initTooltips } from './components/02-molecules/caption.js';
import { initBlockDragAndDrop } from './components/02-molecules/block-drag-and-drop.js';
import { initPagination } from './components/02-molecules/pagination.js';
import { initPanel } from './components/02-molecules/panel.js';
import { initSegmentedControl } from './components/02-molecules/segmented-control.js';
import { initSlider } from './components/02-molecules/slider.js';
import { initStepper } from './components/02-molecules/stepper.js';
import { initToast } from './components/02-molecules/toast.js';

// Organisms
import { initModal } from './components/03-organisms/modal.js';
import { initErrorFragmentGroup } from './components/03-organisms/error-fragment-group.js';
import { initErrorLayout, initAccessibilityToggle } from './components/03-organisms/error-layout.js';
import { initMobileMenu, initContactActiveState } from './components/03-organisms/header.js';
import { initTabBar } from './components/03-organisms/tab-bar.js';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const COMPONENT_SELECTORS = {
  // Atoms
  TOGGLE: '[data-toggle-type="toggle"]',
  TOOLTIP: '[data-tooltip]',
  INPUT: '[data-input-type="input"]',
  
  // Molecules
  CAPTION: '.caption-container',
  MODAL: '[data-modal]',
  DRAG_DROP: '[data-drag-drop]',
  PAGINATION: '[data-pagination]',
  PANEL: '[data-panel]',
  SEGMENTED_CONTROL: '[data-segmented-control]',
  SLIDER: '[data-slider]',
  STEPPER: '[data-stepper]',
  
  // Organisms
  TAB_SECTIONS: '.tab-section-item',
  ERROR_FRAGMENTS: '[data-fragment-clickable]',
  ERROR_LAYOUT: '[data-error-layout-type="error-layout"]',
  HEADER: 'header',
  MOBILE_MENU: '#burger-toggle'
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Conditional Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize components based on page context
 * Only loads and initializes components that exist on the page
 * @returns {void}
 */
function initComponents() {
  // Atoms
  if (document.querySelector(COMPONENT_SELECTORS.TOGGLE)) {
    initToggle();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.TOOLTIP)) {
    initTooltip();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.INPUT)) {
    initInput();
  }
  
  // Molecules
  if (document.querySelector(COMPONENT_SELECTORS.CAPTION)) {
    initTooltips();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.MODAL)) {
    initModal();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.DRAG_DROP)) {
    initBlockDragAndDrop();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.PAGINATION)) {
    initPagination();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.PANEL)) {
    initPanel();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.SEGMENTED_CONTROL)) {
    initSegmentedControl();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.SLIDER)) {
    initSlider();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.STEPPER)) {
    initStepper();
  }
  
  // Toast system (always initialize - can be called programmatically)
  initToast();
  
  // Organisms
  if (document.querySelector(COMPONENT_SELECTORS.MOBILE_MENU)) {
    initMobileMenu();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.HEADER)) {
    initContactActiveState();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.TAB_SECTIONS)) {
    initTabBar();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.ERROR_FRAGMENTS)) {
    initErrorFragmentGroup();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.ERROR_LAYOUT)) {
    initErrorLayout();
    initAccessibilityToggle();
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Global Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize site-wide functionality
 * @returns {void}
 */
function initSite() {
  // Initialize all components conditionally
  initComponents();
  
  // TODO: Add global initialization code here
  // - Feature detection (Intersection Observer, etc.)
  // - Global event delegation patterns
  // - Performance monitoring
  // - Error tracking
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bootstrap
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', initSite);


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━