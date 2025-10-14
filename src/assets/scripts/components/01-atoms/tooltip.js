/* ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Tooltip                                          │
   │ Simple tooltip with hover/focus interactions            │
   │ Path: src/assets/scripts/components/01-atoms/           │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Basic tooltip functionality for atoms
 * @module atoms/tooltip
 * @created 2025-01-15
 * @note For complex tooltips, see molecules/caption.js
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    TRIGGER_SELECTOR: '[data-tooltip]',
    CONTENT_ATTR: 'data-tooltip',
    POSITION_ATTR: 'data-tooltip-position',
    SHOW_DELAY: 200,
    HIDE_DELAY: 100,
    OFFSET: 8
  };
  
  // Store active tooltips
  const activeTooltips = new WeakMap();
  const showTimeouts = new WeakMap();
  const hideTimeouts = new WeakMap();
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Core Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Initialize tooltips
   * @returns {void}
   */
  export function initTooltip() {
    const triggers = document.querySelectorAll(CONFIG.TRIGGER_SELECTOR);
    triggers.forEach(trigger => attachTooltipEvents(trigger));
  }
  
  /**
   * Attach events to tooltip trigger
   * @param {HTMLElement} trigger - Trigger element
   * @returns {void}
   */
  function attachTooltipEvents(trigger) {
    // Mouse events
    trigger.addEventListener('mouseenter', () => scheduleShow(trigger));
    trigger.addEventListener('mouseleave', () => scheduleHide(trigger));
    
    // Focus events for accessibility
    trigger.addEventListener('focus', () => scheduleShow(trigger));
    trigger.addEventListener('blur', () => scheduleHide(trigger));
    
    // Escape key to hide
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideTooltip(trigger);
      }
    });
  }
  
  /**
   * Schedule tooltip show with delay
   * @param {HTMLElement} trigger - Trigger element
   * @returns {void}
   */
  function scheduleShow(trigger) {
    // Cancel any pending hide
    const hideTimeout = hideTimeouts.get(trigger);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeouts.delete(trigger);
    }
    
    // Schedule show
    const showTimeout = setTimeout(() => {
      showTooltip(trigger);
      showTimeouts.delete(trigger);
    }, CONFIG.SHOW_DELAY);
    
    showTimeouts.set(trigger, showTimeout);
  }
  
  /**
   * Schedule tooltip hide with delay
   * @param {HTMLElement} trigger - Trigger element
   * @returns {void}
   */
  function scheduleHide(trigger) {
    // Cancel any pending show
    const showTimeout = showTimeouts.get(trigger);
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeouts.delete(trigger);
    }
    
    // Schedule hide
    const hideTimeout = setTimeout(() => {
      hideTooltip(trigger);
      hideTimeouts.delete(trigger);
    }, CONFIG.HIDE_DELAY);
    
    hideTimeouts.set(trigger, hideTimeout);
  }
  
  /**
   * Show tooltip
   * @param {HTMLElement} trigger - Trigger element
   * @returns {void}
   */
  function showTooltip(trigger) {
    const content = trigger.getAttribute(CONFIG.CONTENT_ATTR);
    if (!content) return;
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = content;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('id', `tooltip-${Date.now()}`);
    
    document.body.appendChild(tooltip);
    activeTooltips.set(trigger, tooltip);
    
    // Set ARIA
    trigger.setAttribute('aria-describedby', tooltip.id);
    
    // Position tooltip
    requestAnimationFrame(() => {
      positionTooltip(trigger, tooltip);
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    });
  }
  
  /**
   * Hide tooltip
   * @param {HTMLElement} trigger - Trigger element
   * @returns {void}
   */
  function hideTooltip(trigger) {
    const tooltip = activeTooltips.get(trigger);
    if (!tooltip) return;
    
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
      activeTooltips.delete(trigger);
      trigger.removeAttribute('aria-describedby');
    }, 150);
  }
  
  /**
   * Position tooltip relative to trigger
   * @param {HTMLElement} trigger - Trigger element
   * @param {HTMLElement} tooltip - Tooltip element
   * @returns {void}
   */
  function positionTooltip(trigger, tooltip) {
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const position = trigger.getAttribute(CONFIG.POSITION_ATTR) || 'top';
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top, left;
    
    switch (position) {
      case 'bottom':
        top = triggerRect.bottom + CONFIG.OFFSET;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - CONFIG.OFFSET;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + CONFIG.OFFSET;
        break;
      case 'top':
      default:
        top = triggerRect.top - tooltipRect.height - CONFIG.OFFSET;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
    }
    
    // Viewport bounds check
    if (left < CONFIG.OFFSET) {
      left = CONFIG.OFFSET;
    } else if (left + tooltipRect.width > viewportWidth - CONFIG.OFFSET) {
      left = viewportWidth - tooltipRect.width - CONFIG.OFFSET;
    }
    
    if (top < CONFIG.OFFSET) {
      top = triggerRect.bottom + CONFIG.OFFSET;
    } else if (top + tooltipRect.height > viewportHeight - CONFIG.OFFSET) {
      top = triggerRect.top - tooltipRect.height - CONFIG.OFFSET;
    }
    
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.zIndex = '9999';
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Cleanup
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Hide all tooltips on scroll/resize
   * @returns {void}
   */
  function hideAllTooltips() {
    document.querySelectorAll(CONFIG.TRIGGER_SELECTOR).forEach(trigger => {
      hideTooltip(trigger);
    });
  }
  
  window.addEventListener('scroll', hideAllTooltips, { passive: true });
  window.addEventListener('resize', hideAllTooltips);
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // May your bugs be forever exiled to the shadow realm ✦
  // Charlotte Carpentier · 2025
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━