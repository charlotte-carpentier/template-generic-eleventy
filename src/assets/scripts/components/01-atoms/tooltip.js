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
  TRIGGER_SELECTOR: '[aria-describedby]',
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
  trigger.addEventListener('mouseenter', () => scheduleShow(trigger));
  trigger.addEventListener('mouseleave', () => scheduleHide(trigger));
  trigger.addEventListener('focus', () => scheduleShow(trigger));
  trigger.addEventListener('blur', () => scheduleHide(trigger));
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
  const hideTimeout = hideTimeouts.get(trigger);
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeouts.delete(trigger);
  }
  
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
  const showTimeout = showTimeouts.get(trigger);
  if (showTimeout) {
    clearTimeout(showTimeout);
    showTimeouts.delete(trigger);
  }
  
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
  const tooltipId = trigger.getAttribute('aria-describedby');
  if (!tooltipId) return;
  
  const tooltip = document.getElementById(tooltipId);
  if (!tooltip) return;
  
  tooltip.classList.remove('hidden');
  tooltip.classList.add('block');
  
  activeTooltips.set(trigger, tooltip);
  
  requestAnimationFrame(() => {
    positionTooltip(trigger, tooltip);
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
  
  tooltip.classList.add('hidden');
  tooltip.classList.remove('block');
  
  activeTooltips.delete(trigger);
}

/**
 * Position tooltip using adaptive placement algorithm
 * @param {HTMLElement} trigger - Trigger element
 * @param {HTMLElement} tooltip - Tooltip element
 * @returns {void}
 */
function positionTooltip(trigger, tooltip) {
  // Get preferred placement
  const preferredPlacement = trigger.getAttribute(CONFIG.POSITION_ATTR) || 'top';
  
  // Make tooltip visible but not affecting layout for measurement
  tooltip.style.visibility = 'hidden';
  tooltip.style.display = 'block';
  
  // Set base styles
  tooltip.style.position = 'fixed';
  tooltip.style.zIndex = '9999';
  
  // Get measurements
  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate available space in each direction
  const space = {
    top: triggerRect.top,
    right: viewportWidth - triggerRect.right,
    bottom: viewportHeight - triggerRect.bottom,
    left: triggerRect.left
  };
  
  // Determine best placement (preferred or fallback)
  let placement = preferredPlacement;
  
  // Check if preferred placement works
  if (
    (placement === 'top' && space.top < tooltipRect.height + CONFIG.OFFSET) ||
    (placement === 'right' && space.right < tooltipRect.width + CONFIG.OFFSET) ||
    (placement === 'bottom' && space.bottom < tooltipRect.height + CONFIG.OFFSET) ||
    (placement === 'left' && space.left < tooltipRect.width + CONFIG.OFFSET)
  ) {
    // Find fallback with most space
    const sorted = Object.entries(space).sort((a, b) => b[1] - a[1]);
    placement = sorted[0][0];
  }
  
  // Calculate position based on final placement
  let top, left;
  
  switch (placement) {
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
  const constrainedLeft = Math.max(CONFIG.OFFSET, Math.min(viewportWidth - tooltipRect.width - CONFIG.OFFSET, left));
  const constrainedTop = Math.max(CONFIG.OFFSET, Math.min(viewportHeight - tooltipRect.height - CONFIG.OFFSET, top));
  
  // Set final position
  tooltip.style.top = `${constrainedTop}px`;
  tooltip.style.left = `${constrainedLeft}px`;
  tooltip.style.visibility = 'visible';
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