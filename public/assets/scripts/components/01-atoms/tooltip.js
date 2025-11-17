/* ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Tooltip                                          │
   │ Simple tooltip with hover/focus interactions            │
   │ Path: src/assets/scripts/components/01-atoms/           │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Basic tooltip functionality for atoms
 * @module atoms/tooltip
 * @created 2025-01-15
 * @updated 2025-10-30
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  TRIGGER_SELECTOR: '[data-tooltip][aria-describedby]',
  POSITION_ATTR: 'data-tooltip-position',
  SHOW_DELAY: 200,
  HIDE_DELAY: 100,
  OFFSET: 8
};

// Store active tooltips and timeouts
const activeTooltips = new Map();
const showTimeouts = new Map();
const hideTimeouts = new Map();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize tooltips
 * @returns {void}
 */
export function initTooltip() {
  // Find all tooltip triggers
  const triggers = document.querySelectorAll(CONFIG.TRIGGER_SELECTOR);
  
  // Add event listeners to each trigger
  triggers.forEach(trigger => {
    // Basic mouse events
    trigger.addEventListener('mouseenter', handleMouseEnter);
    trigger.addEventListener('mouseleave', handleMouseLeave);
    
    // Focus events for accessibility
    trigger.addEventListener('focus', handleMouseEnter);
    trigger.addEventListener('blur', handleMouseLeave);
    
    // Escape key
    trigger.addEventListener('keydown', handleKeyDown);
    
    // Get the tooltip element
    const tooltipId = trigger.getAttribute('aria-describedby');
    if (tooltipId) {
      const tooltip = document.getElementById(tooltipId);
      if (tooltip) {
        // Add event listeners to the tooltip itself
        tooltip.addEventListener('mouseenter', () => handleTooltipMouseEnter(trigger));
        tooltip.addEventListener('mouseleave', () => handleTooltipMouseLeave(trigger));
      }
    }
  });
  
  // Hide tooltips on scroll and resize
  window.addEventListener('scroll', hideAllTooltips);
  window.addEventListener('resize', hideAllTooltips);
}

/**
 * Handle mouse enter on trigger
 * @param {Event} e - Mouse event
 */
function handleMouseEnter(e) {
  const trigger = e.currentTarget;
  
  // Clear any hide timeout
  if (hideTimeouts.has(trigger)) {
    clearTimeout(hideTimeouts.get(trigger));
    hideTimeouts.delete(trigger);
  }
  
  // Set show timeout
  const showTimeout = setTimeout(() => {
    showTooltip(trigger);
  }, CONFIG.SHOW_DELAY);
  
  showTimeouts.set(trigger, showTimeout);
}

/**
 * Handle mouse leave on trigger
 * @param {Event} e - Mouse event
 */
function handleMouseLeave(e) {
  const trigger = e.currentTarget;
  
  // Clear any show timeout
  if (showTimeouts.has(trigger)) {
    clearTimeout(showTimeouts.get(trigger));
    showTimeouts.delete(trigger);
  }
  
  // Set hide timeout
  const hideTimeout = setTimeout(() => {
    hideTooltip(trigger);
  }, CONFIG.HIDE_DELAY);
  
  hideTimeouts.set(trigger, hideTimeout);
}

/**
 * Handle mouse enter on tooltip
 * @param {HTMLElement} trigger - Trigger element
 */
function handleTooltipMouseEnter(trigger) {
  // Clear hide timeout if exists
  if (hideTimeouts.has(trigger)) {
    clearTimeout(hideTimeouts.get(trigger));
    hideTimeouts.delete(trigger);
  }
}

/**
 * Handle mouse leave on tooltip
 * @param {HTMLElement} trigger - Trigger element
 */
function handleTooltipMouseLeave(trigger) {
  // Set hide timeout
  const hideTimeout = setTimeout(() => {
    hideTooltip(trigger);
  }, CONFIG.HIDE_DELAY);
  
  hideTimeouts.set(trigger, hideTimeout);
}

/**
 * Handle key down
 * @param {Event} e - Keyboard event
 */
function handleKeyDown(e) {
  if (e.key === 'Escape') {
    hideAllTooltips();
  }
}

/**
 * Show tooltip
 * @param {HTMLElement} trigger - Trigger element
 */
function showTooltip(trigger) {
  // Hide all other tooltips first
  hideAllTooltips();
  
  // Get tooltip from aria-describedby
  const tooltipId = trigger.getAttribute('aria-describedby');
  if (!tooltipId) return;
  
  const tooltip = document.getElementById(tooltipId);
  if (!tooltip) return;
  
  // Show tooltip
  tooltip.classList.remove('hidden');
  tooltip.classList.add('block');
  
  // Store active tooltip
  activeTooltips.set(trigger, tooltip);
  
  // Position tooltip
  positionTooltip(trigger, tooltip);
}

/**
 * Hide tooltip
 * @param {HTMLElement} trigger - Trigger element
 */
function hideTooltip(trigger) {
  // Get tooltip from active tooltips
  const tooltip = activeTooltips.get(trigger);
  if (!tooltip) return;
  
  // Hide tooltip
  tooltip.classList.add('hidden');
  tooltip.classList.remove('block');
  
  // Remove from active tooltips
  activeTooltips.delete(trigger);
}

/**
 * Position tooltip
 * @param {HTMLElement} trigger - Trigger element
 * @param {HTMLElement} tooltip - Tooltip element
 */
function positionTooltip(trigger, tooltip) {
  // Get preferred placement
  const preferredPlacement = trigger.getAttribute(CONFIG.POSITION_ATTR) || 'top';
  
  // Set base styles for positioning
  tooltip.style.position = 'fixed';
  tooltip.style.zIndex = '9999';
  
  // Get measurements
  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate position based on placement
  let top, left;
  
  switch (preferredPlacement) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - CONFIG.OFFSET;
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      break;
    case 'right':
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
      left = triggerRect.right + CONFIG.OFFSET;
      break;
    case 'bottom':
      top = triggerRect.bottom + CONFIG.OFFSET;
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      break;
    case 'left':
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
      left = triggerRect.left - tooltipRect.width - CONFIG.OFFSET;
      break;
  }
  
  // Constrain to viewport edges
  top = Math.max(CONFIG.OFFSET, Math.min(viewportHeight - tooltipRect.height - CONFIG.OFFSET, top));
  left = Math.max(CONFIG.OFFSET, Math.min(viewportWidth - tooltipRect.width - CONFIG.OFFSET, left));
  
  // Set position
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}

/**
 * Hide all tooltips
 */
function hideAllTooltips() {
  // Hide all active tooltips
  activeTooltips.forEach((tooltip, trigger) => {
    hideTooltip(trigger);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━