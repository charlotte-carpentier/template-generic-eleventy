/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Tab Bar                                      │
   │ CSS :target navigation with accessibility               │
   │ Path: src/assets/scripts/components/03-organisms/      │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tab navigation system using CSS :target selector
 * @module organisms/tab-bar
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  DEFAULT_HASH: '#portfolio',
  DESKTOP_BREAKPOINT: 1024,
  LIVE_REGION_ID: 'tab-sections-live-region',
  RESIZE_DEBOUNCE: 150,
  SCROLL_CURSOR: {
    TRACK_HEIGHT: 525,
    THUMB_HEIGHT: 56,
    KEYBOARD_STEP: 20,
    KEYBOARD_PAGE_STEP: 100
  },
  SELECTORS: {
    HOME_LAYOUT: '.home-layout',
    TAB_SECTION: '.tab-section-item',
    CONTENT: '.tab-sections-content',
    CURSOR: '.tab-sections-scroll-cursor',
    THUMB: '#scroll-cursor-thumb',
    NAV: '.tab-sections-navigation'
  },
  LAYOUTS: ['sm', 'md', 'lg', 'xl']
};


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
// Layout Detection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Detect active layout (sm, md, lg, xl or standalone)
 * @returns {string} Active layout identifier
 */
function getCurrentActiveLayout() {
  if (!document.querySelector(CONFIG.SELECTORS.HOME_LAYOUT)) {
    return 'standalone';
  }

  return CONFIG.LAYOUTS.find(layout => {
    const el = document.querySelector(`.home-layout__${layout}`);
    return el && window.getComputedStyle(el).display !== 'none';
  }) || 'standalone';
}

/**
 * Get selectors adapted to active layout
 * @returns {Object} Selectors object
 */
function getSelectors() {
  const activeLayout = getCurrentActiveLayout();
  let prefix = '';
  
  if (activeLayout !== 'standalone') {
    prefix = `.home-layout__${activeLayout} `;
  }

  return {
    allSections: `${prefix}${CONFIG.SELECTORS.TAB_SECTION}`,
    navLinks: `${prefix}.header-navigation .link--nav, ${prefix}.header-mobile-overlay .link--tab, ${prefix}.tab-menu .link--tab, #mobile-overlay .link--tab`,
    contentContainer: `${prefix}${CONFIG.SELECTORS.CONTENT}`,
    scrollCursor: `${prefix}${CONFIG.SELECTORS.CURSOR}`,
    scrollThumb: `${prefix}${CONFIG.SELECTORS.THUMB}`,
    tabNavigation: `${prefix}${CONFIG.SELECTORS.NAV}`
  };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Accessibility
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Create ARIA live region for section announcements
 * @returns {void}
 */
function createLiveRegion() {
  if (document.getElementById(CONFIG.LIVE_REGION_ID)) return;
  
  const liveRegion = document.createElement('div');
  liveRegion.id = CONFIG.LIVE_REGION_ID;
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only absolute -left-[10000px] w-1 h-1 overflow-hidden';
  document.body.appendChild(liveRegion);
}

/**
 * Announce section changes to screen readers
 * @param {string} sectionId - Section identifier
 * @returns {void}
 */
function announceSection(sectionId) {
  const liveRegion = document.getElementById(CONFIG.LIVE_REGION_ID);
  if (liveRegion) {
    const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    liveRegion.textContent = `Section ${sectionName} activated`;
  }
}

/**
 * Setup ARIA attributes for tab navigation
 * @returns {void}
 */
function setupTabAria() {
  const { navLinks, tabNavigation } = getSelectors();
  
  const navContainer = document.querySelector(tabNavigation);
  if (navContainer) {
    navContainer.setAttribute('role', 'tablist');
    navContainer.setAttribute('aria-label', 'Navigation sections');
  }

  document.querySelectorAll(navLinks).forEach(link => {
    link.setAttribute('role', 'tab');
    link.setAttribute('aria-selected', 'false');
    link.setAttribute('tabindex', '-1');
    
    const href = link.getAttribute('href');
    if (href) {
      const targetId = href.replace('#', '');
      link.setAttribute('aria-controls', targetId);
      link.setAttribute('id', `tab-${targetId}`);
    }
  });
}

/**
 * Setup ARIA attributes for sections
 * @returns {void}
 */
function setupSectionAria() {
  const { allSections } = getSelectors();
  
  document.querySelectorAll(allSections).forEach(section => {
    section.setAttribute('role', 'tabpanel');
    section.setAttribute('tabindex', '0');
    section.setAttribute('aria-labelledby', `tab-${section.id}`);
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Navigation State
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Update links to reflect active hash
 * @returns {void}
 */
function updateCurrentLinks() {
  const currentHash = window.location.hash || CONFIG.DEFAULT_HASH;
  const { navLinks } = getSelectors();

  document.querySelectorAll(navLinks).forEach(link => {
    const isActive = link.getAttribute('href') === currentHash;
    
    link.classList.toggle('current', isActive);
    link.setAttribute('aria-selected', isActive ? 'true' : 'false');
    link.setAttribute('tabindex', isActive ? '0' : '-1');
  });
}

/**
 * Show corresponding section, hide others
 * @returns {void}
 */
function updateSections() {
  const hash = window.location.hash || CONFIG.DEFAULT_HASH;
  const { allSections } = getSelectors();
  let activeSection = null;

  const sections = document.querySelectorAll(allSections);

  sections.forEach(section => {
    const isDefault = section.hasAttribute('data-default');
    const shouldShow = hash === `#${section.id}` || 
                      (isDefault && (hash === CONFIG.DEFAULT_HASH || !window.location.hash));
    
    if (shouldShow) {
      section.style.display = 'block';
      section.setAttribute('aria-hidden', 'false');
      activeSection = section;
    } else {
      section.style.display = 'none';
      section.setAttribute('aria-hidden', 'true');
    }
  });

  if (activeSection) {
    announceSection(activeSection.id);
    
    setTimeout(() => {
      activeSection.focus({ preventScroll: true });
    }, 100);
  }

  updateScrollCursor();
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Keyboard Navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Add keyboard navigation for tabs
 * @returns {void}
 */
function addTabKeyboardNavigation() {
  const { navLinks } = getSelectors();
  
  document.addEventListener('keydown', (e) => {
    const links = Array.from(document.querySelectorAll(navLinks));
    const currentIndex = links.findIndex(link => link === document.activeElement);
    
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    
    switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
        e.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        newIndex = links.length - 1;
        e.preventDefault();
        break;
    }
    
    if (newIndex !== currentIndex) {
      links[newIndex].focus();
    }
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Scroll Cursor
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Manage scroll cursor with accessibility
 * @returns {void}
 */
function updateScrollCursor() {
  const { contentContainer, scrollCursor, scrollThumb } = getSelectors();
  
  const contentEl = document.querySelector(contentContainer);
  const cursorEl = document.querySelector(scrollCursor);
  const thumbEl = document.querySelector(scrollThumb);

  if (!contentEl || !cursorEl || !thumbEl) return;

  const contentOverflows = contentEl.scrollHeight > contentEl.clientHeight;
  const isDesktop = window.innerWidth >= CONFIG.DESKTOP_BREAKPOINT;
  
  if (isDesktop && contentOverflows) {
    cursorEl.style.opacity = '1';
    cursorEl.style.visibility = 'visible';
    cursorEl.setAttribute('aria-hidden', 'false');
  } else {
    cursorEl.style.opacity = '0';
    cursorEl.style.visibility = 'hidden';
    cursorEl.setAttribute('aria-hidden', 'true');
    return;
  }

  // Configure accessibility attributes
  thumbEl.setAttribute('tabindex', '0');
  thumbEl.setAttribute('role', 'scrollbar');
  thumbEl.setAttribute('aria-label', 'Vertical scroll bar');
  thumbEl.setAttribute('aria-orientation', 'vertical');
  
  // Calculate thumb position
  function updateThumbPosition() {
    const scrollRatio = contentEl.scrollTop / (contentEl.scrollHeight - contentEl.clientHeight);
    const maxThumbTop = CONFIG.SCROLL_CURSOR.TRACK_HEIGHT - CONFIG.SCROLL_CURSOR.THUMB_HEIGHT;
    
    const thumbTop = scrollRatio * maxThumbTop;
    thumbEl.style.top = `${thumbTop}px`;
    
    const percentage = Math.round(scrollRatio * 100);
    thumbEl.setAttribute('aria-valuenow', percentage);
    thumbEl.setAttribute('aria-valuemin', '0');
    thumbEl.setAttribute('aria-valuemax', '100');
    thumbEl.setAttribute('aria-valuetext', `${percentage}% scrolled`);
  }

  // Drag state
  let isDragging = false;
  let startY = 0;
  let startThumbTop = 0;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speedMultiplier = prefersReducedMotion ? 0.5 : 1;
  
  thumbEl.style.cursor = 'grab';
  
  // Keyboard support
  thumbEl.addEventListener('keydown', (e) => {
    const maxThumbTop = CONFIG.SCROLL_CURSOR.TRACK_HEIGHT - CONFIG.SCROLL_CURSOR.THUMB_HEIGHT;
    const contentHeight = contentEl.scrollHeight - contentEl.clientHeight;
    const currentThumbTop = parseInt(thumbEl.style.top) || 0;
    
    let newThumbTop = currentThumbTop;
    
    switch(e.key) {
      case 'ArrowUp':
        newThumbTop = Math.max(0, currentThumbTop - CONFIG.SCROLL_CURSOR.KEYBOARD_STEP);
        break;
      case 'ArrowDown':
        newThumbTop = Math.min(maxThumbTop, currentThumbTop + CONFIG.SCROLL_CURSOR.KEYBOARD_STEP);
        break;
      case 'PageUp':
        newThumbTop = Math.max(0, currentThumbTop - CONFIG.SCROLL_CURSOR.KEYBOARD_PAGE_STEP);
        break;
      case 'PageDown':
        newThumbTop = Math.min(maxThumbTop, currentThumbTop + CONFIG.SCROLL_CURSOR.KEYBOARD_PAGE_STEP);
        break;
      case 'Home':
        newThumbTop = 0;
        break;
      case 'End':
        newThumbTop = maxThumbTop;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    
    thumbEl.style.top = `${newThumbTop}px`;
    const scrollRatio = newThumbTop / maxThumbTop;
    contentEl.scrollTop = scrollRatio * contentHeight;
    updateThumbPosition();
  });
  
  // Mouse drag
  thumbEl.addEventListener('mousedown', (e) => {
    isDragging = true;
    thumbEl.style.cursor = 'grabbing';
    
    startY = e.clientY;
    startThumbTop = parseInt(thumbEl.style.top) || 0;
    
    e.preventDefault();
    e.stopPropagation();
  });

  // Focus styles
  thumbEl.addEventListener('focus', () => {
    thumbEl.style.outline = '2px solid #4a7c59';
    thumbEl.style.outlineOffset = '2px';
  });

  thumbEl.addEventListener('blur', () => {
    thumbEl.style.outline = 'none';
  });

  // Content scroll sync
  contentEl.addEventListener('scroll', () => {
    if (!isDragging) {
      updateThumbPosition();
    }
  }, { passive: true });

  // Document mouse move
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - startY;
    const adjustedDelta = deltaY * speedMultiplier;
    const newThumbTop = startThumbTop + adjustedDelta;
    
    const maxThumbTop = CONFIG.SCROLL_CURSOR.TRACK_HEIGHT - CONFIG.SCROLL_CURSOR.THUMB_HEIGHT;
    const clampedThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));
    
    thumbEl.style.top = `${clampedThumbTop}px`;
    
    const scrollRatio = clampedThumbTop / maxThumbTop;
    const contentHeight = contentEl.scrollHeight - contentEl.clientHeight;
    const newScrollTop = scrollRatio * contentHeight;
    
    contentEl.scrollTop = newScrollTop;
    updateThumbPosition();
  });

  // Document mouse up
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      thumbEl.style.cursor = 'grab';
    }
  });

  updateThumbPosition();
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Resize Handler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle window resize with debounce
 * @returns {void}
 */
function handleResize() {
  updateCurrentLinks();
  updateSections();
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize tab bar navigation system
 * @returns {void}
 */
export function initTabBar() {
  // Initialize default hash
  if (!window.location.hash) {
    window.location.hash = CONFIG.DEFAULT_HASH;
  }

  createLiveRegion();
  setupTabAria();
  setupSectionAria();
  addTabKeyboardNavigation();

  updateCurrentLinks();
  updateSections();

  window.addEventListener('hashchange', () => {
    updateCurrentLinks();
    updateSections();
  });

  window.addEventListener('resize', debounce(handleResize, CONFIG.RESIZE_DEBOUNCE));
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━