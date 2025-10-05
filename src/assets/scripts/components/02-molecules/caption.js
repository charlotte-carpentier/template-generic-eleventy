/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Caption                                      │
   │ Desktop tooltip with smart positioning                  │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tooltip system for desktop (lg: 1024px+)
 * @module molecules/caption
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TOOLTIP_BREAKPOINT = 1024;
const VIEWPORT_MARGIN = 20;
const CURSOR_OFFSET = 15;

// Cache for DOM measurements to avoid repeated getBoundingClientRect calls
const positionCache = new WeakMap();

// Store timeout IDs to prevent accumulation
const hideTimeouts = new WeakMap();


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize tooltips for desktop devices only
 * @returns {void}
 */
function initTooltips() {
  if (window.innerWidth < TOOLTIP_BREAKPOINT) return;
  
  const captionContainers = document.querySelectorAll('.caption-container');
  
  captionContainers.forEach(container => {
    const tooltip = container.querySelector('.tooltip-popup');
    if (!tooltip) return;
    
    setupTooltipAria(tooltip, container);
    attachTooltipEvents(tooltip, container);
  });
}

/**
 * Setup ARIA attributes for accessibility
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function setupTooltipAria(tooltip, container) {
  const tooltipId = `tooltip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  tooltip.setAttribute('id', tooltipId);
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('aria-hidden', 'true');
  container.setAttribute('aria-describedby', tooltipId);
}

/**
 * Attach event listeners to tooltip
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function attachTooltipEvents(tooltip, container) {
  const isAvatarTooltip = container.classList.contains('avatar-tooltip-container');
  
  if (isAvatarTooltip) {
    container.addEventListener('mouseenter', () => showTooltip(tooltip, container));
    container.addEventListener('mouseleave', () => hideTooltip(tooltip));
    container.addEventListener('mousemove', (e) => {
      if (tooltip.style.opacity === '1') {
        trackCursorForAvatarTooltip(tooltip, e);
      }
    });
  } else {
    container.addEventListener('mouseenter', () => showTooltip(tooltip, container));
    container.addEventListener('mouseleave', () => hideTooltip(tooltip));
    container.addEventListener('focus', () => showTooltip(tooltip, container));
    container.addEventListener('blur', () => hideTooltip(tooltip));
    
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideTooltip(tooltip);
        container.blur();
      }
    });
  }
}

/**
 * Track cursor position for avatar tooltip
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {MouseEvent} event - Mouse event
 * @returns {void}
 */
function trackCursorForAvatarTooltip(tooltip, event) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const cursorX = event.clientX;
  const cursorY = event.clientY;
  
  let tooltipX = cursorX + CURSOR_OFFSET;
  let tooltipY = cursorY + CURSOR_OFFSET;
  
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // Check horizontal overflow
  if (tooltipX + tooltipRect.width > viewportWidth - VIEWPORT_MARGIN) {
    tooltipX = cursorX - tooltipRect.width - CURSOR_OFFSET;
  }
  
  // Check vertical overflow
  if (tooltipY + tooltipRect.height > viewportHeight - VIEWPORT_MARGIN) {
    tooltipY = cursorY - tooltipRect.height - CURSOR_OFFSET;
  }
  
  tooltip.style.left = tooltipX + 'px';
  tooltip.style.top = tooltipY + 'px';
  tooltip.style.transform = 'none';
}

/**
 * Show tooltip with smart positioning
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function showTooltip(tooltip, container) {
  if (window.innerWidth < TOOLTIP_BREAKPOINT) return;
  
  hideAllTooltips();
  
  tooltip.setAttribute('aria-hidden', 'false');
  
  if (tooltip.parentNode !== document.body) {
    document.body.appendChild(tooltip);
  }
  
  const isAvatarTooltip = container.classList.contains('avatar-tooltip-container');
  
  if (isAvatarTooltip) {
    tooltip.style.position = 'fixed';
    tooltip.style.zIndex = '1000';
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
  } else {
    positionRegularTooltip(tooltip, container);
  }
}

/**
 * Position regular tooltip relative to container
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function positionRegularTooltip(tooltip, container) {
  let containerRect = positionCache.get(container);
  if (!containerRect) {
    containerRect = container.getBoundingClientRect();
    positionCache.set(container, containerRect);
    setTimeout(() => positionCache.delete(container), 100);
  }
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  tooltip.style.position = 'fixed';
  tooltip.style.top = (containerRect.top + 68) + 'px';
  tooltip.style.left = (containerRect.left + containerRect.width / 2) + 'px';
  tooltip.style.transform = 'translateX(-50%)';
  tooltip.style.zIndex = '1000';
  
  tooltip.style.opacity = '1';
  tooltip.style.visibility = 'visible';
  
  requestAnimationFrame(() => {
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Check vertical overflow
    if (tooltipRect.bottom > viewportHeight - VIEWPORT_MARGIN) {
      const newTop = containerRect.top - tooltipRect.height - 4;
      tooltip.style.top = newTop + 'px';
    }
    
    // Check horizontal overflow
    if (tooltipRect.left < VIEWPORT_MARGIN) {
      tooltip.style.left = containerRect.left + 'px';
      tooltip.style.transform = 'translateX(0)';
    } else if (tooltipRect.right > viewportWidth - VIEWPORT_MARGIN) {
      tooltip.style.left = containerRect.right + 'px';
      tooltip.style.transform = 'translateX(-100%)';
    }
  });
}

/**
 * Hide all tooltips instantly
 * @returns {void}
 */
function hideAllTooltips() {
  const allTooltips = document.querySelectorAll('.tooltip-popup');
  allTooltips.forEach(tooltip => {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    tooltip.setAttribute('aria-hidden', 'true');
  });
}

/**
 * Hide tooltip and reset positioning
 * @param {HTMLElement} tooltip - Tooltip element
 * @returns {void}
 */
function hideTooltip(tooltip) {
  tooltip.style.opacity = '0';
  tooltip.style.visibility = 'hidden';
  tooltip.setAttribute('aria-hidden', 'true');
  
  const existingTimeout = hideTimeouts.get(tooltip);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }
  
  const timeoutId = setTimeout(() => {
    if (tooltip.style.opacity === '0') {
      tooltip.style.position = '';
      tooltip.style.top = '';
      tooltip.style.left = '';
      tooltip.style.right = '';
      tooltip.style.transform = '';
      tooltip.style.zIndex = '';
    }
    hideTimeouts.delete(tooltip);
  }, 300);
  
  hideTimeouts.set(tooltip, timeoutId);
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Event Handlers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle window resize
 * @returns {void}
 */
function handleTooltipResize() {
  hideAllTooltips();
  positionCache.clear();
  
  if (window.innerWidth >= TOOLTIP_BREAKPOINT) {
    initTooltips();
  }
}

/**
 * Handle scroll events
 * @returns {void}
 */
function handleTooltipScroll() {
  hideAllTooltips();
  positionCache.clear();
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', initTooltips);
window.addEventListener('resize', handleTooltipResize);
window.addEventListener('scroll', handleTooltipScroll);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initTooltips, showTooltip, hideTooltip };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━