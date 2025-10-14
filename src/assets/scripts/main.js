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

// Molecules
import { initTooltips } from './components/02-molecules/caption.js';

// Organisms
import { initErrorFragmentGroup } from './components/03-organisms/error-fragment-group.js';
import { initErrorLayout, initAccessibilityToggle } from './components/03-organisms/error-layout.js';
import { initMobileMenu, initContactActiveState } from './components/03-organisms/header.js';
import { initTabBar } from './components/03-organisms/tab-bar.js';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const COMPONENT_SELECTORS = {
  TAB_SECTIONS: '.tab-section-item',
  ERROR_FRAGMENTS: '[data-fragment-clickable]',
  ERROR_LAYOUT: '[data-error-layout-type="error-layout"]',
  TOOLTIPS: '.caption-container',
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
  // Site-wide components (always initialize if present)
  if (document.querySelector(COMPONENT_SELECTORS.TOOLTIPS)) {
    initTooltips();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.MOBILE_MENU)) {
    initMobileMenu();
  }
  
  if (document.querySelector(COMPONENT_SELECTORS.HEADER)) {
    initContactActiveState();
  }
  
  // Page-specific components (conditional loading)
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