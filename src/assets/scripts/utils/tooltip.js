/* ┌─────────────────────────────────────────────────────────┐
   │ UTILITY › Tooltip                                       │
   │ Smart positioning & keyboard navigation for tooltips    │
   │ Path: src/assets/scripts/utils/                         │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tooltip positioning utility with WCAG 2.2 AA compliance
 * @module utils/tooltip
 * @see {@link https://www.w3.org/WAI/WCAG22/quickref/#content-on-hover-or-focus|WCAG 1.4.13}
 * @see {@link https://m3.material.io/components/tooltips|Material Design 3}
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELECTOR_TRIGGER = '[aria-describedby^="tooltip-"]';
const BREAKPOINT = 1024;
const DELAY_SHOW = 150;
const DELAY_HIDE = 100;
const OFFSET = 8;
const VIEWPORT_MARGIN = 16;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// State Management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const activeTooltips = new WeakMap();
const showTimeouts = new WeakMap();
const hideTimeouts = new WeakMap();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Extract tooltip ID from aria-describedby attribute
 * @param {HTMLElement} trigger - Trigger element
 * @returns {string|null} Tooltip ID or null
 */
const getTooltipId = (trigger) => {
  const describedBy = trigger.getAttribute('aria-describedby');
  return describedBy?.startsWith('tooltip-') ? describedBy : null;
};

/**
 * Calculate optimal tooltip position with collision detection
 * @param {HTMLElement} trigger - Trigger element
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {string} preferredPlacement - Preferred placement (top/bottom/left/right)
 * @returns {Object} Position object {x, y, placement}
 */
const calculatePosition = (trigger, tooltip, preferredPlacement = 'top') => {
  const triggerRect = trigger.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const positions = {
    top: {
      x: triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2),
      y: triggerRect.top - tooltipRect.height - OFFSET
    },
    bottom: {
      x: triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2),
      y: triggerRect.bottom + OFFSET
    },
    left: {
      x: triggerRect.left - tooltipRect.width - OFFSET,
      y: triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
    },
    right: {
      x: triggerRect.right + OFFSET,
      y: triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2)
    }
  };

  // Check if preferred placement fits in viewport
  const checkFit = (placement) => {
    const pos = positions[placement];
    return (
      pos.x >= VIEWPORT_MARGIN &&
      pos.x + tooltipRect.width <= viewport.width - VIEWPORT_MARGIN &&
      pos.y >= VIEWPORT_MARGIN &&
      pos.y + tooltipRect.height <= viewport.height - VIEWPORT_MARGIN
    );
  };

  // Try preferred placement first
  if (checkFit(preferredPlacement)) {
    return { ...positions[preferredPlacement], placement: preferredPlacement };
  }

  // Auto-flip to opposite placement
  const opposites = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  };

  const oppositePlacement = opposites[preferredPlacement];
  if (checkFit(oppositePlacement)) {
    return { ...positions[oppositePlacement], placement: oppositePlacement };
  }

  // Fallback: try all placements
  for (const placement of ['top', 'bottom', 'left', 'right']) {
    if (checkFit(placement)) {
      return { ...positions[placement], placement };
    }
  }

  // Last resort: use preferred placement and constrain to viewport
  const pos = positions[preferredPlacement];
  return {
    x: Math.max(VIEWPORT_MARGIN, Math.min(pos.x, viewport.width - tooltipRect.width - VIEWPORT_MARGIN)),
    y: Math.max(VIEWPORT_MARGIN, Math.min(pos.y, viewport.height - tooltipRect.height - VIEWPORT_MARGIN)),
    placement: preferredPlacement
  };
};

/**
 * Position tooltip in viewport
 * @param {HTMLElement} trigger - Trigger element
 * @param {HTMLElement} tooltip - Tooltip element
 * @returns {void}
 */
const positionTooltip = (trigger, tooltip) => {
  const { x, y } = calculatePosition(trigger, tooltip);

  tooltip.style.position = 'fixed';
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
};

/**
 * Show tooltip with delay
 * @param {HTMLElement} trigger - Trigger element
 * @param {HTMLElement} tooltip - Tooltip element
 * @returns {void}
 */
const showTooltip = (trigger, tooltip) => {
  // Clear any pending hide
  const hideTimeout = hideTimeouts.get(tooltip);
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeouts.delete(tooltip);
  }

  // Set show delay
  const showTimeout = setTimeout(() => {
    tooltip.classList.remove('hidden');
    tooltip.setAttribute('aria-hidden', 'false');
    positionTooltip(trigger, tooltip);
    activeTooltips.set(trigger, tooltip);
  }, DELAY_SHOW);

  showTimeouts.set(tooltip, showTimeout);
};

/**
 * Hide tooltip with delay
 * @param {HTMLElement} trigger - Trigger element
 * @param {HTMLElement} tooltip - Tooltip element
 * @returns {void}
 */
const hideTooltip = (trigger, tooltip) => {
  // Clear any pending show
  const showTimeout = showTimeouts.get(tooltip);
  if (showTimeout) {
    clearTimeout(showTimeout);
    showTimeouts.delete(tooltip);
  }

  // Set hide delay
  const hideTimeout = setTimeout(() => {
    tooltip.classList.add('hidden');
    tooltip.setAttribute('aria-hidden', 'true');
    activeTooltips.delete(trigger);
  }, DELAY_HIDE);

  hideTimeouts.set(tooltip, hideTimeout);
};

/**
 * Dismiss tooltip immediately (ESC key)
 * @param {HTMLElement} tooltip - Tooltip element
 * @returns {void}
 */
const dismissTooltip = (tooltip) => {
  // Clear all timeouts
  const showTimeout = showTimeouts.get(tooltip);
  const hideTimeout = hideTimeouts.get(tooltip);

  if (showTimeout) clearTimeout(showTimeout);
  if (hideTimeout) clearTimeout(hideTimeout);

  tooltip.classList.add('hidden');
  tooltip.setAttribute('aria-hidden', 'true');

  // Find and remove from active tooltips
  for (const [trigger, activeTooltip] of activeTooltips.entries()) {
    if (activeTooltip === tooltip) {
      activeTooltips.delete(trigger);
      break;
    }
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Attach tooltip behavior to trigger element
 * @param {HTMLElement} trigger - Trigger element
 * @returns {Function|null} Cleanup function or null
 */
export const attachTooltip = (trigger) => {
  const tooltipId = getTooltipId(trigger);
  if (!tooltipId) return null;

  const tooltip = document.getElementById(tooltipId);
  if (!tooltip) {
    console.warn(`Tooltip not found: ${tooltipId}`);
    return null;
  }

  // Event handlers
  const handleShow = () => showTooltip(trigger, tooltip);
  const handleHide = () => hideTooltip(trigger, tooltip);

  const handleTooltipEnter = () => {
    // Keep tooltip visible when hovering over it (WCAG 1.4.13)
    const hideTimeout = hideTimeouts.get(tooltip);
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeouts.delete(tooltip);
    }
  };

  const handleTooltipLeave = () => hideTooltip(trigger, tooltip);

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      dismissTooltip(tooltip);
    }
  };

  // Attach event listeners
  trigger.addEventListener('mouseenter', handleShow);
  trigger.addEventListener('mouseleave', handleHide);
  trigger.addEventListener('focus', handleShow);
  trigger.addEventListener('blur', handleHide);

  tooltip.addEventListener('mouseenter', handleTooltipEnter);
  tooltip.addEventListener('mouseleave', handleTooltipLeave);

  document.addEventListener('keydown', handleEscape);

  // Return cleanup function
  return () => {
    trigger.removeEventListener('mouseenter', handleShow);
    trigger.removeEventListener('mouseleave', handleHide);
    trigger.removeEventListener('focus', handleShow);
    trigger.removeEventListener('blur', handleHide);

    tooltip.removeEventListener('mouseenter', handleTooltipEnter);
    tooltip.removeEventListener('mouseleave', handleTooltipLeave);

    document.removeEventListener('keydown', handleEscape);

    // Clear any pending timeouts
    const showTimeout = showTimeouts.get(tooltip);
    const hideTimeout = hideTimeouts.get(tooltip);
    if (showTimeout) clearTimeout(showTimeout);
    if (hideTimeout) clearTimeout(hideTimeout);
  };
};

/**
 * Initialize all tooltips on page (desktop only)
 * @param {HTMLElement} container - Container to search for tooltips
 * @returns {Array<HTMLElement>} Array of initialized triggers
 */
export const initTooltips = (container = document) => {
  // Desktop only
  if (window.innerWidth < BREAKPOINT) return [];

  const triggers = container.querySelectorAll(SELECTOR_TRIGGER);
  const initialized = [];

  triggers.forEach(trigger => {
    const cleanup = attachTooltip(trigger);
    if (cleanup) {
      initialized.push(trigger);
    }
  });

  return initialized;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
