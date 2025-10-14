/* ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Toggle                                           │
   │ Toggle switch with on/off state management              │
   │ Path: src/assets/scripts/components/01-atoms/           │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Toggle switch interactions
 * @module atoms/toggle
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    SELECTOR: '[data-toggle-type="toggle"]',
    ACTIVE_ATTR: 'data-toggle-active',
    DISABLED_ATTR: 'data-toggle-disabled'
  };
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Core Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Initialize toggle switches
   * @returns {void}
   */
  export function initToggle() {
    const toggles = document.querySelectorAll(CONFIG.SELECTOR);
    toggles.forEach(toggle => attachToggleEvents(toggle));
  }
  
  /**
   * Attach events to toggle
   * @param {HTMLElement} toggle - Toggle element
   * @returns {void}
   */
  function attachToggleEvents(toggle) {
    // Click event
    toggle.addEventListener('click', handleToggleClick);
    
    // Keyboard accessibility
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggleClick(e);
      }
    });
    
    // Set initial ARIA state
    updateAriaState(toggle);
  }
  
  /**
   * Handle toggle click
   * @param {Event} event - Click event
   * @returns {void}
   */
  function handleToggleClick(event) {
    const toggle = event.currentTarget;
    
    // Check if disabled
    if (toggle.getAttribute(CONFIG.DISABLED_ATTR) === 'true') {
      return;
    }
    
    // Toggle state
    const isActive = toggle.getAttribute(CONFIG.ACTIVE_ATTR) === 'true';
    const newState = !isActive;
    
    toggle.setAttribute(CONFIG.ACTIVE_ATTR, newState);
    updateAriaState(toggle);
    
    // Dispatch custom event for external listeners
    toggle.dispatchEvent(new CustomEvent('toggle-change', {
      detail: { active: newState },
      bubbles: true
    }));
  }
  
  /**
   * Update ARIA attributes for accessibility
   * @param {HTMLElement} toggle - Toggle element
   * @returns {void}
   */
  function updateAriaState(toggle) {
    const isActive = toggle.getAttribute(CONFIG.ACTIVE_ATTR) === 'true';
    const isDisabled = toggle.getAttribute(CONFIG.DISABLED_ATTR) === 'true';
    
    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('aria-checked', isActive);
    toggle.setAttribute('aria-disabled', isDisabled);
    
    if (!isDisabled) {
      toggle.setAttribute('tabindex', '0');
    } else {
      toggle.setAttribute('tabindex', '-1');
    }
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Public API
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Set toggle state programmatically
   * @param {HTMLElement} toggle - Toggle element
   * @param {boolean} active - New state
   * @returns {void}
   */
  export function setToggleState(toggle, active) {
    if (!toggle) return;
    
    toggle.setAttribute(CONFIG.ACTIVE_ATTR, active);
    updateAriaState(toggle);
  }
  
  /**
   * Enable/disable toggle programmatically
   * @param {HTMLElement} toggle - Toggle element
   * @param {boolean} disabled - Disabled state
   * @returns {void}
   */
  export function setToggleDisabled(toggle, disabled) {
    if (!toggle) return;
    
    toggle.setAttribute(CONFIG.DISABLED_ATTR, disabled);
    updateAriaState(toggle);
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // May your bugs be forever exiled to the shadow realm ✦
  // Charlotte Carpentier · 2025
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━