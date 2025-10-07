/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Tab Sections                                 │
   │ CSS :target navigation with accessibility               │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tab navigation system using CSS :target selector
 * @module organisms/tab-sections
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DEFAULT_HASH = '#portfolio';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Accessibility Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Create ARIA live region for section announcements
 * @returns {void}
 */
function createLiveRegion() {
  if (document.getElementById('tab-sections-live-region')) return;
  
  const liveRegion = document.createElement('div');
  liveRegion.id = 'tab-sections-live-region';
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
  const liveRegion = document.getElementById('tab-sections-live-region');
  const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  if (liveRegion) {
    liveRegion.textContent = `Section ${sectionName} activated`;
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Layout Detection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Detect active layout (sm, md, lg, xl or standalone)
 * @returns {string} Active layout identifier
 */
function getCurrentActiveLayout() {
  if (!document.querySelector('.home-layout')) return 'standalone';

  return ['sm', 'md', 'lg', 'xl'].find(layout => {
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
  
  if (activeLayout === 'sm') {
    prefix = '.home-layout__sm ';
  } else if (activeLayout === 'md') {
    prefix = '.home-layout__md ';
  } else if (activeLayout === 'lg') {
    prefix = '.home-layout__lg ';
  } else if (activeLayout === 'xl') {
    prefix = '.home-layout__xl ';
  }

  return {
    allSections: `${prefix}.tab-section-item`,
    navLinks: `${prefix}.header-navigation .link--nav, ${prefix}.header-mobile-overlay .link--tab, ${prefix}.tab-menu .link--tab, #mobile-overlay .link--tab`,
    contentContainer: `${prefix}.tab-sections-content`,
    scrollCursor: `${prefix}.tab-sections-scroll-cursor`,
    scrollThumb: `${prefix}#scroll-cursor-thumb`,
    tabNavigation: `${prefix}.tab-sections-navigation`
  };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ARIA Setup
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

  document.querySelectorAll(navLinks).forEach((link, index) => {
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
  const currentHash = window.location.hash || DEFAULT_HASH;
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
  const hash = window.location.hash || DEFAULT_HASH;
  const { allSections } = getSelectors();
  let activeSection = null;

  const sections = document.querySelectorAll(allSections);
  if (sections.length === 0) {
    console.warn('No sections found with selector:', allSections);
  }

  sections.forEach(section => {
    const isDefault = section.hasAttribute('data-default');
    const shouldShow = hash === `#${section.id}` || (isDefault && (hash === DEFAULT_HASH || !window.location.hash));
    
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
  const isDesktop = window.innerWidth >= 1024;
  
  if (isDesktop && contentOverflows) {
    cursorEl.style.opacity = '1';
    cursorEl.style.visibility = 'visible';
    cursorEl.setAttribute('aria-hidden', 'false');
  } else {
    cursorEl.style.opacity = '0';
    cursorEl.style.visibility = 'hidden';
    cursorEl.setAttribute('aria-hidden', 'true');
  }

  // Configure accessibility attributes
  thumbEl.setAttribute('tabindex', '0');
  thumbEl.setAttribute('role', 'scrollbar');
  thumbEl.setAttribute('aria-label', 'Vertical scroll bar');
  thumbEl.setAttribute('aria-orientation', 'vertical');
  
  // Calculate thumb position
  function updateThumbPosition() {
    const scrollRatio = contentEl.scrollTop / (contentEl.scrollHeight - contentEl.clientHeight);
    const trackHeight = 525;
    const thumbHeight = 56;
    const maxThumbTop = trackHeight - thumbHeight;
    
    const thumbTop = scrollRatio * maxThumbTop;
    thumbEl.style.top = `${thumbTop}px`;
    
    const percentage = Math.round(scrollRatio * 100);
    thumbEl.setAttribute('aria-valuenow', percentage);
    thumbEl.setAttribute('aria-valuemin', '0');
    thumbEl.setAttribute('aria-valuemax', '100');
    thumbEl.setAttribute('aria-valuetext', `${percentage}% scrolled`);
  }

  // Drag variables
  let isDragging = false;
  let startY = 0;
  let startThumbTop = 0;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speedMultiplier = prefersReducedMotion ? 1 : 1;
  
  thumbEl.style.cursor = 'grab';
  
  // Keyboard support
  thumbEl.addEventListener('keydown', (e) => {
    const trackHeight = 525;
    const thumbHeight = 56;
    const maxThumbTop = trackHeight - thumbHeight;
    const contentHeight = contentEl.scrollHeight - contentEl.clientHeight;
    const currentThumbTop = parseInt(thumbEl.style.top) || 0;
    
    let newThumbTop = currentThumbTop;
    
    switch(e.key) {
      case 'ArrowUp':
        newThumbTop = Math.max(0, currentThumbTop - 20);
        break;
      case 'ArrowDown':
        newThumbTop = Math.min(maxThumbTop, currentThumbTop + 20);
        break;
      case 'PageUp':
        newThumbTop = Math.max(0, currentThumbTop - 100);
        break;
      case 'PageDown':
        newThumbTop = Math.min(maxThumbTop, currentThumbTop + 100);
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
  
  thumbEl.addEventListener('mousedown', (e) => {
    isDragging = true;
    thumbEl.style.cursor = 'grabbing';
    
    startY = e.clientY;
    startThumbTop = parseInt(thumbEl.style.top) || 0;
    
    e.preventDefault();
    e.stopPropagation();
  });

  thumbEl.addEventListener('focus', () => {
    thumbEl.style.outline = '2px solid #4a7c59';
    thumbEl.style.outlineOffset = '2px';
  });

  thumbEl.addEventListener('blur', () => {
    thumbEl.style.outline = 'none';
  });

  contentEl.addEventListener('scroll', () => {
    if (!isDragging) {
      updateThumbPosition();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - startY;
    const adjustedDelta = deltaY * speedMultiplier;
    const newThumbTop = startThumbTop + adjustedDelta;
    
    const trackHeight = 525;
    const thumbHeight = 56;
    const maxThumbTop = trackHeight - thumbHeight;
    const clampedThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));
    
    thumbEl.style.top = `${clampedThumbTop}px`;
    
    const scrollRatio = clampedThumbTop / maxThumbTop;
    const contentHeight = contentEl.scrollHeight - contentEl.clientHeight;
    const newScrollTop = scrollRatio * contentHeight;
    
    contentEl.scrollTop = newScrollTop;
    updateThumbPosition();
  });

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

let resizeTimeout;

/**
 * Handle window resize with debounce
 * @returns {void}
 */
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateCurrentLinks();
    updateSections();
  }, 150);
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
  // Initialize default hash
  if (!window.location.hash) {
    window.location.hash = DEFAULT_HASH;
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

  window.addEventListener('resize', handleResize);

  console.log('Tab navigation with enhanced accessibility ready');
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━