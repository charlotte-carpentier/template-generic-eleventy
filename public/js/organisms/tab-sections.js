/* ============================================================
   @ORGANISM - TAB-SECTIONS
   - CSS :target navigation system with accessibility enhancements
   - Scroll cursor management and layout detection
   - ARIA live regions and focus management for screen readers
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const defaultHash = '#portfolio';

  // Create ARIA live region for section announcements
  function createLiveRegion() {
    if (document.getElementById('tab-sections-live-region')) return;
    
    const liveRegion = document.createElement('div');
    liveRegion.id = 'tab-sections-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only absolute -left-[10000px] w-1 h-1 overflow-hidden';
    document.body.appendChild(liveRegion);
  }

  // Announce section changes to screen readers
  function announceSection(sectionId) {
    const liveRegion = document.getElementById('tab-sections-live-region');
    const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    if (liveRegion) {
      liveRegion.textContent = `Section ${sectionName} activated`;
    }
  }

  // Detect active layout (sm, md, lg, xl or standalone)
  function getCurrentActiveLayout() {
    if (!document.querySelector('.home-layout')) return 'standalone';

    return ['sm', 'md', 'lg', 'xl'].find(layout => {
      const el = document.querySelector(`.home-layout__${layout}`);
      return el && window.getComputedStyle(el).display !== 'none';
    }) || 'standalone';
  }

  // Get selectors adapted to active layout
  function getSelectors() {
    const activeLayout = getCurrentActiveLayout();
    let prefix = '';
    
    // Layout-specific context
    if (activeLayout === 'sm') {
      prefix = '.home-layout__sm ';
    } else if (activeLayout === 'md') {
      prefix = '.home-layout__md ';
    } else if (activeLayout === 'lg') {
      prefix = '.home-layout__lg ';
    } else if (activeLayout === 'xl') {
      prefix = '.home-layout__xl ';
    }
    // standalone keeps empty prefix

    return {
      allSections: `${prefix}.tab-section-item`,
      navLinks: `${prefix}.header-navigation .link--nav, ${prefix}.header-mobile-overlay .link--tab, ${prefix}.tab-menu .link--tab, #mobile-overlay .link--tab`,
      contentContainer: `${prefix}.tab-sections-content`,
      scrollCursor: `${prefix}.tab-sections-scroll-cursor`,
      scrollThumb: `${prefix}#scroll-cursor-thumb`,
      tabNavigation: `${prefix}.tab-sections-navigation`
    };
  }

  // Setup ARIA attributes for tab navigation
  function setupTabAria() {
    const { navLinks, tabNavigation } = getSelectors();
    
    // Set role="tablist" on navigation container
    const navContainer = document.querySelector(tabNavigation);
    if (navContainer) {
      navContainer.setAttribute('role', 'tablist');
      navContainer.setAttribute('aria-label', 'Navigation sections');
    }

    // Set role="tab" on navigation links
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

  // Setup ARIA attributes for sections
  function setupSectionAria() {
    const { allSections } = getSelectors();
    
    document.querySelectorAll(allSections).forEach(section => {
      section.setAttribute('role', 'tabpanel');
      section.setAttribute('tabindex', '0');
      section.setAttribute('aria-labelledby', `tab-${section.id}`);
    });
  }

  // Update links to reflect active hash
  function updateCurrentLinks() {
    const currentHash = window.location.hash || defaultHash;
    const { navLinks } = getSelectors();

    document.querySelectorAll(navLinks).forEach(link => {
      const isActive = link.getAttribute('href') === currentHash;
      
      // Visual current state
      link.classList.toggle('current', isActive);
      
      // ARIA selected state
      link.setAttribute('aria-selected', isActive ? 'true' : 'false');
      link.setAttribute('tabindex', isActive ? '0' : '-1');
    });
  }

  // Show corresponding section, hide others
  function updateSections() {
    const hash = window.location.hash || defaultHash;
    const { allSections } = getSelectors();
    let activeSection = null;

    const sections = document.querySelectorAll(allSections);
    if (sections.length === 0) {
      console.warn('No sections found with selector:', allSections);
    }

    sections.forEach(section => {
      const isDefault = section.hasAttribute('data-default');
      const shouldShow = hash === `#${section.id}` || (isDefault && (hash === defaultHash || !window.location.hash));
      
      if (shouldShow) {
        section.style.display = 'block';
        section.setAttribute('aria-hidden', 'false');
        activeSection = section;
      } else {
        section.style.display = 'none';
        section.setAttribute('aria-hidden', 'true');
      }
    });

    // Focus management and announcement
    if (activeSection) {
      // Announce to screen readers
      announceSection(activeSection.id);
      
      // Focus without scroll for keyboard users
      setTimeout(() => {
        activeSection.focus({ preventScroll: true });
      }, 100);
    }

    // Update scroll cursor after section change
    updateScrollCursor();
  }

  // Add keyboard navigation for tabs
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

  // Manage scroll cursor with accessibility
  function updateScrollCursor() {
    const { contentContainer, scrollCursor, scrollThumb } = getSelectors();
    
    const contentEl = document.querySelector(contentContainer);
    const cursorEl = document.querySelector(scrollCursor);
    const thumbEl = document.querySelector(scrollThumb);

    if (!contentEl || !cursorEl || !thumbEl) return;

    // Check if content overflows
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
      
      // Update aria-valuenow
      const percentage = Math.round(scrollRatio * 100);
      thumbEl.setAttribute('aria-valuenow', percentage);
      thumbEl.setAttribute('aria-valuemin', '0');
      thumbEl.setAttribute('aria-valuemax', '100');
      thumbEl.setAttribute('aria-valuetext', `${percentage}% scrolled`);
    }

    // Variables for drag
    let isDragging = false;
    let startY = 0;
    let startThumbTop = 0;
    
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speedMultiplier = prefersReducedMotion ? 1 : 1;
    
    // Default cursor
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
          newThumbTop = Math.max(0, currentThumbTop - 20); // Small increment
          break;
        case 'ArrowDown':
          newThumbTop = Math.min(maxThumbTop, currentThumbTop + 20); // Small increment
          break;
        case 'PageUp':
          newThumbTop = Math.max(0, currentThumbTop - 100); // Large increment
          break;
        case 'PageDown':
          newThumbTop = Math.min(maxThumbTop, currentThumbTop + 100); // Large increment
          break;
        case 'Home':
          newThumbTop = 0; // Top
          break;
        case 'End':
          newThumbTop = maxThumbTop; // Bottom
          break;
        default:
          return; // Ignore other keys
      }
      
      e.preventDefault();
      
      // Apply new scroll
      thumbEl.style.top = `${newThumbTop}px`;
      const scrollRatio = newThumbTop / maxThumbTop;
      contentEl.scrollTop = scrollRatio * contentHeight;
      updateThumbPosition(); // Update aria-valuenow
    });
    
    thumbEl.addEventListener('mousedown', (e) => {
      isDragging = true;
      thumbEl.style.cursor = 'grabbing';
      
      // Store starting position
      startY = e.clientY;
      startThumbTop = parseInt(thumbEl.style.top) || 0;
      
      e.preventDefault();
      e.stopPropagation();
    });

    // Focus management
    thumbEl.addEventListener('focus', () => {
      thumbEl.style.outline = '2px solid #4a7c59';
      thumbEl.style.outlineOffset = '2px';
    });

    thumbEl.addEventListener('blur', () => {
      thumbEl.style.outline = 'none';
    });

    // Listen to content scroll (without conflict with drag)
    contentEl.addEventListener('scroll', () => {
      if (!isDragging) { // Only if not dragging
        updateThumbPosition();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // Calculate movement from drag start
      const deltaY = e.clientY - startY;
      const adjustedDelta = deltaY * speedMultiplier;
      const newThumbTop = startThumbTop + adjustedDelta;
      
      // Constraints
      const trackHeight = 525;
      const thumbHeight = 56;
      const maxThumbTop = trackHeight - thumbHeight;
      const clampedThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));
      
      // Update thumb position
      thumbEl.style.top = `${clampedThumbTop}px`;
      
      // Calculate and apply corresponding scroll
      const scrollRatio = clampedThumbTop / maxThumbTop;
      const contentHeight = contentEl.scrollHeight - contentEl.clientHeight;
      const newScrollTop = scrollRatio * contentHeight;
      
      contentEl.scrollTop = newScrollTop;
      updateThumbPosition(); // Update aria-valuenow
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        thumbEl.style.cursor = 'grab';
      }
    });

    // Initial position
    updateThumbPosition();
  }

  // Debounced resize handler for performance
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCurrentLinks();
      updateSections();
    }, 150);
  }

  // Initialize default hash
  if (!window.location.hash) {
    window.location.hash = defaultHash;
  }

  // Create live region for announcements
  createLiveRegion();

  // Setup ARIA attributes
  setupTabAria();
  setupSectionAria();

  // Add keyboard navigation
  addTabKeyboardNavigation();

  // Initialize on load
  updateCurrentLinks();
  updateSections();

  // Update on hash change
  window.addEventListener('hashchange', () => {
    updateCurrentLinks();
    updateSections();
  });

  // Reinitialize on resize (layout can change)
  window.addEventListener('resize', handleResize);

  console.log('Tab navigation with enhanced accessibility ready');
});