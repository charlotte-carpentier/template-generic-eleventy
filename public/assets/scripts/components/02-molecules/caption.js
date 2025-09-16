
/* ===========================================================
   @MOLECULES - CAPTION
   - Desktop tooltip logic with smart positioning (lg/xl only)
   - ARIA accessibility and keyboard navigation support
   - Performance optimized with caching and cleanup
=========================================================== */

/**
 * Initialize tooltips for desktop devices only (lg: 1024px+)
 */
function initTooltips() {
  // Only initialize on desktop devices
  if (window.innerWidth < 1024) return;
  
  const captionContainers = document.querySelectorAll('.caption-container');
  
  captionContainers.forEach(container => {
    const tooltip = container.querySelector('.tooltip-popup');
    if (!tooltip) return;
    
    // Setup ARIA attributes for accessibility
    const tooltipId = `tooltip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    tooltip.setAttribute('id', tooltipId);
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    container.setAttribute('aria-describedby', tooltipId);
    
    // Special handling for avatar tooltip
    const isAvatarTooltip = container.classList.contains('avatar-tooltip-container');
    
    if (isAvatarTooltip) {
      // Avatar tooltip: use the special hover zone with cursor tracking
      container.addEventListener('mouseenter', () => showTooltip(tooltip, container));
      container.addEventListener('mouseleave', () => hideTooltip(tooltip));
      
      // Add cursor tracking for avatar tooltip
      container.addEventListener('mousemove', (e) => {
        if (tooltip.style.opacity === '1') {
          trackCursorForAvatarTooltip(tooltip, e);
        }
      });
    } else {
      // Regular caption tooltips: standard event listeners
      container.addEventListener('mouseenter', () => showTooltip(tooltip, container));
      container.addEventListener('mouseleave', () => hideTooltip(tooltip));
      container.addEventListener('focus', () => showTooltip(tooltip, container));
      container.addEventListener('blur', () => hideTooltip(tooltip));
      
      // Keyboard accessibility - close on Escape key
      container.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          hideTooltip(tooltip);
          container.blur();
        }
      });
    }
  });
}

/**
 * Track cursor position for avatar tooltip
 */
function trackCursorForAvatarTooltip(tooltip, event) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const margin = 20; // Safety margin from viewport edges
  
  // Position tooltip relative to cursor
  const cursorX = event.clientX;
  const cursorY = event.clientY;
  
  // Default position: to the right and below cursor
  let tooltipX = cursorX + 15; // 15px offset from cursor
  let tooltipY = cursorY + 15;
  
  // Get tooltip dimensions (it should be visible at this point)
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // Check horizontal overflow
  if (tooltipX + tooltipRect.width > viewportWidth - margin) {
    tooltipX = cursorX - tooltipRect.width - 15; // Move to left of cursor
  }
  
  // Check vertical overflow
  if (tooltipY + tooltipRect.height > viewportHeight - margin) {
    tooltipY = cursorY - tooltipRect.height - 15; // Move above cursor
  }
  
  // Apply the new position
  tooltip.style.left = tooltipX + 'px';
  tooltip.style.top = tooltipY + 'px';
  tooltip.style.transform = 'none'; // Remove any existing transform
}

// Cache for DOM measurements to avoid repeated getBoundingClientRect calls
const positionCache = new WeakMap();

/**
 * Show tooltip with smart positioning for desktop only
 */
function showTooltip(tooltip, container) {
  // Only show tooltips on desktop (lg: 1024px+)
  if (window.innerWidth < 1024) return;
  
  // Hide all other tooltips first to avoid overlap
  hideAllTooltips();
  
  // Update ARIA state
  tooltip.setAttribute('aria-hidden', 'false');
  
  // Move tooltip to body to escape any stacking context (only if not already there)
  if (tooltip.parentNode !== document.body) {
    document.body.appendChild(tooltip);
  }
  
  // Check if this is an avatar tooltip
  const isAvatarTooltip = container.classList.contains('avatar-tooltip-container');
  
  if (isAvatarTooltip) {
    // Avatar tooltip: position will be managed by cursor tracking
    tooltip.style.position = 'fixed';
    tooltip.style.zIndex = '1000';
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
    // Initial position will be set by first mousemove event
  } else {
    // Regular tooltip: static positioning logic
    let containerRect = positionCache.get(container);
    if (!containerRect) {
      containerRect = container.getBoundingClientRect();
      positionCache.set(container, containerRect);
      // Clear cache after a short delay to handle dynamic content
      setTimeout(() => positionCache.delete(container), 100);
    }
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20; // Safety margin from viewport edges
    
    // Position tooltip relative to viewport (fixed positioning)
    tooltip.style.position = 'fixed';
    tooltip.style.top = (containerRect.top + 68) + 'px';
    tooltip.style.left = (containerRect.left + containerRect.width / 2) + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.zIndex = '1000';
    
    // Show tooltip to measure its dimensions
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
    
    // Check position after rendering and adjust if needed
    requestAnimationFrame(() => {
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Check vertical overflow - move above icon if no space below
      if (tooltipRect.bottom > viewportHeight - margin) {
        const newTop = containerRect.top - tooltipRect.height - 4; // Above icon with 4px margin
        tooltip.style.top = newTop + 'px';
      }
      
      // Check horizontal overflow and adjust alignment
      if (tooltipRect.left < margin) {
        // Overflows left edge - align tooltip to left
        tooltip.style.left = containerRect.left + 'px';
        tooltip.style.transform = 'translateX(0)';
      } else if (tooltipRect.right > viewportWidth - margin) {
        // Overflows right edge - align tooltip to right  
        tooltip.style.left = containerRect.right + 'px';
        tooltip.style.transform = 'translateX(-100%)';
      }
    });
  }
}

/**
 * Hide all tooltips instantly
 */
function hideAllTooltips() {
  const allTooltips = document.querySelectorAll('.tooltip-popup');
  allTooltips.forEach(tooltip => {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    tooltip.setAttribute('aria-hidden', 'true');
  });
}

// Store timeout IDs to prevent accumulation
const hideTimeouts = new WeakMap();

/**
 * Hide tooltip and reset positioning
 */
function hideTooltip(tooltip) {
  tooltip.style.opacity = '0';
  tooltip.style.visibility = 'hidden';
  tooltip.setAttribute('aria-hidden', 'true');
  
  // Clear any existing timeout for this tooltip
  const existingTimeout = hideTimeouts.get(tooltip);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }
  
  // Reset position styles after transition
  const timeoutId = setTimeout(() => {
    if (tooltip.style.opacity === '0') {
      // Reset all positioning styles
      tooltip.style.position = '';
      tooltip.style.top = '';
      tooltip.style.left = '';
      tooltip.style.right = '';
      tooltip.style.transform = '';
      tooltip.style.zIndex = '';
    }
    hideTimeouts.delete(tooltip);
  }, 300); // Wait for transition to complete
  
  hideTimeouts.set(tooltip, timeoutId);
}

/**
 * Handle window resize - reinitialize or cleanup based on viewport
 */
function handleTooltipResize() {
  // Hide any open tooltips
  hideAllTooltips();
  
  // Clear position cache
  positionCache.clear();
  
  // Reinitialize if now on desktop, cleanup if on mobile/tablet
  if (window.innerWidth >= 1024) {
    initTooltips();
  }
}

/**
 * Handle scroll events - hide any open tooltips
 */
function handleTooltipScroll() {
  // Hide any open tooltips when scrolling
  hideAllTooltips();
  
  // Clear position cache as positions may have changed
  positionCache.clear();
}

// =========================
// INITIALIZATION
// =========================

// Initialize tooltips when DOM is ready
document.addEventListener('DOMContentLoaded', initTooltips);

// Handle resize events
window.addEventListener('resize', handleTooltipResize);

// Handle scroll events - hide tooltips when scrolling
window.addEventListener('scroll', handleTooltipScroll);

// Export for potential external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initTooltips, showTooltip, hideTooltip };
}