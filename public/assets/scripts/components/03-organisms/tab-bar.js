/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Tab Bar                                      │
   │ ARIA tabs navigation with keyboard support              │
   │ Path: src/assets/scripts/components/03-organisms/      │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tab bar navigation with ARIA pattern
 * @module organisms/tab-bar
 * @created 2025-01-15
 * @updated 2025-12-12 (Refacto 2025 best practices)
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Imports
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { debounce } from '../../utils/debounce.js';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  TABLIST_SELECTOR: '[role="tablist"]',
  TAB_SELECTOR: '[role="tab"]',
  RESIZE_DEBOUNCE: 150
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Tab State Management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Update aria-selected for all tabs
 * @param {HTMLElement} activeTab - Tab to set as active
 * @param {HTMLElement[]} allTabs - All tab elements
 * @returns {void}
 */
const updateTabStates = (activeTab, allTabs) => {
  allTabs.forEach(tab => {
    const isActive = tab === activeTab;
    tab.setAttribute('aria-selected', String(isActive));
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
  });
};

/**
 * Activate a tab (follow link href)
 * @param {HTMLElement} tab - Tab element to activate
 * @param {HTMLElement[]} allTabs - All tab elements
 * @returns {void}
 */
const activateTab = (tab, allTabs) => {
  updateTabStates(tab, allTabs);

  // Follow href if exists (native navigation)
  const href = tab.getAttribute('href');
  if (href) {
    window.location.href = href;
  }
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Keyboard Navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle keyboard navigation in tablist
 * @param {KeyboardEvent} e - Keyboard event
 * @param {HTMLElement[]} tabs - All tab elements
 * @returns {void}
 */
const handleKeyboardNav = (e, tabs) => {
  const currentIndex = tabs.findIndex(tab => tab === document.activeElement);
  if (currentIndex === -1) return;

  let newIndex = currentIndex;

  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      e.preventDefault();
      break;

    case 'ArrowRight':
    case 'ArrowDown':
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      e.preventDefault();
      break;

    case 'Home':
      newIndex = 0;
      e.preventDefault();
      break;

    case 'End':
      newIndex = tabs.length - 1;
      e.preventDefault();
      break;

    case 'Enter':
    case ' ':
      activateTab(tabs[currentIndex], tabs);
      e.preventDefault();
      return;

    default:
      return;
  }

  if (newIndex !== currentIndex) {
    tabs[newIndex].focus();
  }
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Setup single tablist
 * @param {HTMLElement} tablist - Tablist element
 * @returns {void}
 */
const setupTablist = (tablist) => {
  const tabs = Array.from(tablist.querySelectorAll(CONFIG.TAB_SELECTOR));

  if (tabs.length === 0) return;

  // Find active tab or default to first
  const activeTab = tabs.find(tab =>
    tab.getAttribute('aria-selected') === 'true'
  ) || tabs[0];

  // Initialize states
  updateTabStates(activeTab, tabs);

  // Click handlers
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab(tab, tabs);
    });
  });

  // Keyboard navigation
  tablist.addEventListener('keydown', (e) => {
    handleKeyboardNav(e, tabs);
  });
};

/**
 * Initialize all tablists on page
 * @returns {void}
 */
export const initTabBar = () => {
  const tablists = document.querySelectorAll(CONFIG.TABLIST_SELECTOR);

  tablists.forEach(tablist => {
    setupTablist(tablist);
  });

  // Reinitialize on resize (responsive layouts)
  window.addEventListener('resize', debounce(() => {
    tablists.forEach(tablist => {
      const tabs = Array.from(tablist.querySelectorAll(CONFIG.TAB_SELECTOR));
      const activeTab = tabs.find(tab =>
        tab.getAttribute('aria-selected') === 'true'
      );
      if (activeTab) {
        updateTabStates(activeTab, tabs);
      }
    });
  }, CONFIG.RESIZE_DEBOUNCE));
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
