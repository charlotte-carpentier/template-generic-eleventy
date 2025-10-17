/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Header                                       │
   │ Mobile menu and contact link active state management    │
   │ Path: src/assets/scripts/components/03-organisms/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Header navigation with mobile menu and active states
 * @module organisms/header
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  BURGER_ID: 'burger-toggle',
  OVERLAY_ID: 'mobile-overlay',
  MOBILE_BREAKPOINT: 1024,
  SMALL_BREAKPOINT: 639,
  OVERLAY_TOP_SMALL: '75px',
  OVERLAY_TOP_DEFAULT: '87px',
  TRANSITION_DURATION: '0.3s',
  LINK_SELECTOR: '.link--tab',
  NAV_LINK_SELECTORS: [
    '.header-navigation .link--nav',
    '.header-navigation .link--nav-white',
    '[href*="contact"]',
    'a[href="#contact"]'
  ],
  ACTIVE_CLASS: 'current',
  CONTACT_HASH: '#contact'
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mobile Menu
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize mobile menu functionality
 * @returns {void}
 */
export function initMobileMenu() {
  const burgerToggle = document.getElementById(CONFIG.BURGER_ID);
  const mobileOverlay = document.getElementById(CONFIG.OVERLAY_ID);
  const burgerIconOpen = burgerToggle?.querySelector('.burger-icon-open');
  const burgerIconClose = burgerToggle?.querySelector('.burger-icon-close');
  
  if (!burgerToggle || !mobileOverlay || !burgerIconOpen || !burgerIconClose) {
    return;
  }
  
  // Initialize styles
  initBurgerStyles(burgerIconOpen, burgerIconClose);
  initOverlayStyles(mobileOverlay);
  
  // Event listeners
  burgerToggle.addEventListener('click', () => toggleMobileMenu(
    burgerToggle, mobileOverlay, burgerIconOpen, burgerIconClose
  ));
  
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) {
      closeMobileMenu(burgerToggle, mobileOverlay, burgerIconOpen, burgerIconClose);
    }
  });
  
  const mobileLinks = mobileOverlay.querySelectorAll(CONFIG.LINK_SELECTOR);
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu(burgerToggle, mobileOverlay, burgerIconOpen, burgerIconClose);
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOverlay.style.opacity === '1') {
      closeMobileMenu(burgerToggle, mobileOverlay, burgerIconOpen, burgerIconClose);
    }
  });
  
  window.addEventListener('resize', () => handleResize(
    burgerToggle, mobileOverlay, burgerIconOpen, burgerIconClose
  ));
}

/**
 * Initialize burger icon styles
 * @param {HTMLElement} iconOpen - Open icon element
 * @param {HTMLElement} iconClose - Close icon element
 * @returns {void}
 */
function initBurgerStyles(iconOpen, iconClose) {
  iconOpen.style.opacity = '1';
  iconOpen.style.transition = 'none';
  iconClose.style.opacity = '0';
  iconClose.style.transition = 'none';
}

/**
 * Initialize mobile overlay styles
 * @param {HTMLElement} overlay - Overlay element
 * @returns {void}
 */
function initOverlayStyles(overlay) {
  overlay.style.display = 'none';
  overlay.style.opacity = '0';
  overlay.style.visibility = 'hidden';
  overlay.style.transform = 'translateY(-5px)';
  overlay.style.transition = `opacity ${CONFIG.TRANSITION_DURATION} ease`;
  overlay.style.zIndex = '1';
  overlay.style.top = window.innerWidth <= CONFIG.SMALL_BREAKPOINT 
    ? CONFIG.OVERLAY_TOP_SMALL 
    : CONFIG.OVERLAY_TOP_DEFAULT;
}

/**
 * Toggle mobile menu open/close
 * @param {HTMLElement} toggle - Burger toggle element
 * @param {HTMLElement} overlay - Overlay element
 * @param {HTMLElement} iconOpen - Open icon element
 * @param {HTMLElement} iconClose - Close icon element
 * @returns {void}
 */
function toggleMobileMenu(toggle, overlay, iconOpen, iconClose) {
  const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  
  if (!isExpanded) {
    openMobileMenu(toggle, overlay, iconOpen, iconClose);
  } else {
    closeMobileMenu(toggle, overlay, iconOpen, iconClose);
  }
}

/**
 * Open mobile menu
 * @param {HTMLElement} toggle - Burger toggle element
 * @param {HTMLElement} overlay - Overlay element
 * @param {HTMLElement} iconOpen - Open icon element
 * @param {HTMLElement} iconClose - Close icon element
 * @returns {void}
 */
function openMobileMenu(toggle, overlay, iconOpen, iconClose) {
  toggle.setAttribute('aria-expanded', 'true');
  iconOpen.style.opacity = '0';
  iconClose.style.opacity = '1';
  overlay.style.display = 'block';
  overlay.style.opacity = '1';
  overlay.style.visibility = 'visible';
  overlay.style.transform = 'translateY(0)';
  overlay.style.zIndex = '50';
  document.body.style.overflow = 'hidden';
}

/**
 * Close mobile menu
 * @param {HTMLElement} toggle - Burger toggle element
 * @param {HTMLElement} overlay - Overlay element
 * @param {HTMLElement} iconOpen - Open icon element
 * @param {HTMLElement} iconClose - Close icon element
 * @returns {void}
 */
function closeMobileMenu(toggle, overlay, iconOpen, iconClose) {
  toggle.setAttribute('aria-expanded', 'false');
  iconOpen.style.opacity = '1';
  iconClose.style.opacity = '0';
  overlay.style.display = 'none';
  overlay.style.opacity = '0';
  overlay.style.visibility = 'hidden';
  overlay.style.transform = 'translateY(-5px)';
  overlay.style.zIndex = '1';
  document.body.style.overflow = '';
}

/**
 * Handle window resize
 * @param {HTMLElement} toggle - Burger toggle element
 * @param {HTMLElement} overlay - Overlay element
 * @param {HTMLElement} iconOpen - Open icon element
 * @param {HTMLElement} iconClose - Close icon element
 * @returns {void}
 */
function handleResize(toggle, overlay, iconOpen, iconClose) {
  overlay.style.top = window.innerWidth <= CONFIG.SMALL_BREAKPOINT 
    ? CONFIG.OVERLAY_TOP_SMALL 
    : CONFIG.OVERLAY_TOP_DEFAULT;
  
  if (window.innerWidth >= CONFIG.MOBILE_BREAKPOINT) {
    closeMobileMenu(toggle, overlay, iconOpen, iconClose);
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Contact Link Active State
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize contact link active state management
 * @returns {void}
 */
export function initContactActiveState() {
  const contactLink = findContactLink();
  if (!contactLink) return;
  
  // Make contact link bold
  contactLink.classList.add('font-bold');
  
  let observer = null;
  
  /**
   * Check if contact section is currently active
   * @returns {boolean} True if contact is active
   */
  function isContactSectionActive() {
    const currentHash = window.location.hash;
    
    // Direct hash match
    if (currentHash === CONFIG.CONTACT_HASH) return true;
    
    // Check contact section visibility
    const contactSection = document.querySelector(CONFIG.CONTACT_HASH);
    if (contactSection) {
      const isTarget = contactSection.matches(':target');
      const isDisplayBlock = contactSection.style.display === 'block';
      const isDisplayFlex = contactSection.style.display === 'flex';
      
      if (isTarget || isDisplayBlock || isDisplayFlex) return true;
      
      // Default section with no hash
      if (contactSection.hasAttribute('data-default') && !window.location.hash) {
        return true;
      }
    }
    
    // Active tab link
    const activeTabLink = document.querySelector(
      `.tab-menu .link--tab.${CONFIG.ACTIVE_CLASS}, .tab-menu .link--tab[aria-current="page"]`
    );
    if (activeTabLink && activeTabLink.getAttribute('href') === CONFIG.CONTACT_HASH) {
      return true;
    }
    
    // URL pathname
    if (window.location.pathname.includes('contact')) return true;
    
    return false;
  }
  
  /**
   * Update contact link active state
   * @returns {void}
   */
  function updateContactActiveState() {
    const isActive = isContactSectionActive();
    
    contactLink.classList.toggle(CONFIG.ACTIVE_CLASS, isActive);
    
    if (isActive) {
      contactLink.setAttribute('aria-current', 'page');
      contactLink.classList.add('pointer-events-none');
      startObserver();
    } else {
      contactLink.removeAttribute('aria-current');
      contactLink.classList.remove('pointer-events-none');
      stopObserver();
    }
  }
  
  /**
   * Start MutationObserver for dynamic changes
   * @returns {void}
   */
  function startObserver() {
    if (observer || !window.MutationObserver) return;
    
    const contactSection = document.querySelector(CONFIG.CONTACT_HASH);
    if (!contactSection) return;
    
    observer = new MutationObserver(() => {
      setTimeout(updateContactActiveState, 10);
    });
    
    observer.observe(contactSection, { 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });
  }
  
  /**
   * Stop MutationObserver when not needed
   * @returns {void}
   */
  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
  
  // Initial check
  setTimeout(updateContactActiveState, 100);
  
  // Event listeners
  window.addEventListener('hashchange', () => {
    setTimeout(updateContactActiveState, 10);
  });
  
  document.addEventListener('click', (e) => {
    const clickedLink = e.target.closest('a[href*="#"]');
    if (clickedLink) {
      setTimeout(updateContactActiveState, 100);
    }
  });
  
  window.addEventListener('popstate', () => {
    setTimeout(updateContactActiveState, 10);
  });
  
  // Cleanup on unload
  window.addEventListener('beforeunload', stopObserver);
}

/**
 * Find contact link element
 * @returns {HTMLElement|null} Contact link or null
 */
function findContactLink() {
  for (const selector of CONFIG.NAV_LINK_SELECTORS) {
    const link = document.querySelector(selector);
    if (link) return link;
  }
  return null;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━