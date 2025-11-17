/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Caption                                      │
   │ Desktop tooltip with smart positioning                  │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tooltip system for desktop (lg: 1024px+)
 * @module molecules/caption
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  BREAKPOINT: 1024,
  VIEWPORT_MARGIN: 20,
  CURSOR_OFFSET: 15,
  CONTAINER_SELECTOR: '.caption-container',
  TOOLTIP_SELECTOR: '.tooltip-popup',
  AVATAR_CLASS: 'avatar-tooltip-container',
  TOOLTIP_OFFSET_Y: 68,
  TOOLTIP_OFFSET_ABOVE: 4,
  HIDE_TRANSITION_DELAY: 300,
  CACHE_TTL: 100,
  RESIZE_DEBOUNCE: 150
};

// Cache for DOM measurements
const positionCache = new WeakMap();
const hideTimeouts = new WeakMap();


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Debounce function calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize tooltips for desktop devices only
 * @returns {void}
 */
export function initTooltips() {
  if (window.innerWidth < CONFIG.BREAKPOINT) return;
  
  const captionContainers = document.querySelectorAll(CONFIG.CONTAINER_SELECTOR);
  
  captionContainers.forEach(container => {
    const tooltip = container.querySelector(CONFIG.TOOLTIP_SELECTOR);
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
  const isAvatarTooltip = container.classList.contains(CONFIG.AVATAR_CLASS);
  
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
  
  let tooltipX = cursorX + CONFIG.CURSOR_OFFSET;
  let tooltipY = cursorY + CONFIG.CURSOR_OFFSET;
  
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // Check horizontal overflow
  if (tooltipX + tooltipRect.width > viewportWidth - CONFIG.VIEWPORT_MARGIN) {
    tooltipX = cursorX - tooltipRect.width - CONFIG.CURSOR_OFFSET;
  }
  
  // Check vertical overflow
  if (tooltipY + tooltipRect.height > viewportHeight - CONFIG.VIEWPORT_MARGIN) {
    tooltipY = cursorY - tooltipRect.height - CONFIG.CURSOR_OFFSET;
  }
  
  tooltip.style.left = `${tooltipX}px`;
  tooltip.style.top = `${tooltipY}px`;
  tooltip.style.transform = 'none';
}

/**
 * Show tooltip with smart positioning
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function showTooltip(tooltip, container) {
  if (window.innerWidth < CONFIG.BREAKPOINT) return;
  
  hideAllTooltips();
  
  tooltip.setAttribute('aria-hidden', 'false');
  
  if (tooltip.parentNode !== document.body) {
    document.body.appendChild(tooltip);
  }
  
  const isAvatarTooltip = container.classList.contains(CONFIG.AVATAR_CLASS);
  
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
    setTimeout(() => positionCache.delete(container), CONFIG.CACHE_TTL);
  }
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  tooltip.style.position = 'fixed';
  tooltip.style.top = `${containerRect.top + CONFIG.TOOLTIP_OFFSET_Y}px`;
  tooltip.style.left = `${containerRect.left + containerRect.width / 2}px`;
  tooltip.style.transform = 'translateX(-50%)';
  tooltip.style.zIndex = '1000';
  
  tooltip.style.opacity = '1';
  tooltip.style.visibility = 'visible';
  
  requestAnimationFrame(() => {
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Check vertical overflow
    if (tooltipRect.bottom > viewportHeight - CONFIG.VIEWPORT_MARGIN) {
      const newTop = containerRect.top - tooltipRect.height - CONFIG.TOOLTIP_OFFSET_ABOVE;
      tooltip.style.top = `${newTop}px`;
    }
    
    // Check horizontal overflow
    if (tooltipRect.left < CONFIG.VIEWPORT_MARGIN) {
      tooltip.style.left = `${containerRect.left}px`;
      tooltip.style.transform = 'translateX(0)';
    } else if (tooltipRect.right > viewportWidth - CONFIG.VIEWPORT_MARGIN) {
      tooltip.style.left = `${containerRect.right}px`;
      tooltip.style.transform = 'translateX(-100%)';
    }
  });
}

/**
 * Hide all tooltips instantly
 * @returns {void}
 */
function hideAllTooltips() {
  const allTooltips = document.querySelectorAll(CONFIG.TOOLTIP_SELECTOR);
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
  }, CONFIG.HIDE_TRANSITION_DELAY);
  
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
  // WeakMap has no clear() method - cache will auto-cleanup
  
  if (window.innerWidth >= CONFIG.BREAKPOINT) {
    initTooltips();
  }
}

/**
 * Handle scroll events
 * @returns {void}
 */
function handleTooltipScroll() {
  hideAllTooltips();
  // WeakMap has no clear() method - cache will auto-cleanup
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', initTooltips);
window.addEventListener('resize', debounce(handleTooltipResize, CONFIG.RESIZE_DEBOUNCE));
window.addEventListener('scroll', handleTooltipScroll, { passive: true });


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━