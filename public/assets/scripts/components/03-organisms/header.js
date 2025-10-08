/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Header                                       │
   │ Mobile menu and contact link active state management   │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Header navigation with mobile menu and active states
 * @module organisms/header
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mobile Menu
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize mobile menu functionality
 * @returns {void}
 */
function initMobileMenu() {
  const burgerToggle = document.getElementById('burger-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const burgerIconOpen = burgerToggle?.querySelector('.burger-icon-open');
  const burgerIconClose = burgerToggle?.querySelector('.burger-icon-close');
  
  if (!burgerToggle || !mobileOverlay || !burgerIconOpen || !burgerIconClose) {
    console.warn('Header: Mobile menu elements not found');
    return;
  }
  
  // Initialize burger icons styles
  function initBurgerStyles() {
    burgerIconOpen.style.opacity = '1';
    burgerIconOpen.style.transition = 'none';
    
    burgerIconClose.style.opacity = '0';
    burgerIconClose.style.transition = 'none';
  }
  
  // Initialize mobile overlay styles
  function initOverlayStyles() {
    mobileOverlay.style.display = 'none';
    mobileOverlay.style.opacity = '0';
    mobileOverlay.style.visibility = 'hidden';
    mobileOverlay.style.transform = 'translateY(-5px)';
    mobileOverlay.style.transition = 'opacity 0.3s ease';
    mobileOverlay.style.zIndex = '1';
    
    // Responsive positioning
    if (window.innerWidth <= 639) {
      mobileOverlay.style.top = '75px';
    } else {
      mobileOverlay.style.top = '87px';
    }
  }
  
  // Toggle mobile menu
  function toggleMobileMenu() {
    const isExpanded = burgerToggle.getAttribute('aria-expanded') === 'true';
    burgerToggle.setAttribute('aria-expanded', !isExpanded);
    
    if (!isExpanded) {
      burgerIconOpen.style.opacity = '0';
      burgerIconClose.style.opacity = '1';
    } else {
      burgerIconOpen.style.opacity = '1';
      burgerIconClose.style.opacity = '0';
    }
    
    if (!isExpanded) {
      mobileOverlay.style.display = 'block';
      mobileOverlay.style.opacity = '1';
      mobileOverlay.style.visibility = 'visible';
      mobileOverlay.style.transform = 'translateY(0)';
      mobileOverlay.style.zIndex = '50';
      document.body.style.overflow = 'hidden';
    } else {
      closeMobileMenu();
    }
  }
  
  // Close mobile menu
  function closeMobileMenu() {
    burgerToggle.setAttribute('aria-expanded', 'false');
    
    burgerIconOpen.style.opacity = '1';
    burgerIconClose.style.opacity = '0';
    
    mobileOverlay.style.display = 'none';
    mobileOverlay.style.opacity = '0';
    mobileOverlay.style.visibility = 'hidden';
    mobileOverlay.style.transform = 'translateY(-5px)';
    mobileOverlay.style.zIndex = '1';
    document.body.style.overflow = '';
  }
  
  // Handle window resize
  function handleResize() {
    if (window.innerWidth <= 639) {
      mobileOverlay.style.top = '75px';
    } else {
      mobileOverlay.style.top = '87px';
    }
    
    if (window.innerWidth >= 1025) {
      closeMobileMenu();
    }
  }
  
  // Initialize styles
  initBurgerStyles();
  initOverlayStyles();
  
  // Event listeners
  burgerToggle.addEventListener('click', toggleMobileMenu);
  
  mobileOverlay.addEventListener('click', function(e) {
    if (e.target === mobileOverlay) {
      closeMobileMenu();
    }
  });
  
  const mobileLinks = mobileOverlay.querySelectorAll('.link--tab');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMobileMenu();
    });
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileOverlay.style.opacity === '1') {
      closeMobileMenu();
    }
  });
  
  window.addEventListener('resize', handleResize);
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Contact Link Active State
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize contact link active state management
 * @returns {void}
 */
function initContactActiveState() {
  const contactLink = document.querySelector('.header-navigation .link--nav') ||
                    document.querySelector('.header-navigation .link--nav-white') ||
                    document.querySelector('[href*="contact"]') ||
                    document.querySelector('a[href="#contact"]');
  
  let observer = null;
  
  if (!contactLink) {
    console.warn('Header: Contact link not found with any selector');
    return;
  }
  
  console.log('Header: Contact link found:', contactLink);
  
  // Always make contact link bold
  contactLink.style.fontWeight = 'bold';
  
  // Enhanced detection function
  function isContactSectionActive() {
    const currentHash = window.location.hash;
    
    // Method 1: Hash detection
    if (currentHash === '#contact') return true;
    
    // Method 2: Check tab sections system
    const contactTabSection = document.querySelector('#contact');
    if (contactTabSection) {
      const isTarget = contactTabSection.matches(':target');
      const hasDisplayBlock = contactTabSection.style.display === 'block';
      const hasDisplayFlex = contactTabSection.style.display === 'flex';
      
      if (isTarget || hasDisplayBlock || hasDisplayFlex) return true;
      
      if (contactTabSection.hasAttribute('data-default') && !window.location.hash) {
        return true;
      }
    }
    
    // Method 3: Check active tab in tab menu
    const activeTabLink = document.querySelector('.tab-menu .link--tab.current, .tab-menu .link--tab[aria-current="page"]');
    if (activeTabLink && activeTabLink.getAttribute('href') === '#contact') {
      return true;
    }
    
    // Method 4: Check URL pathname for contact page
    if (window.location.pathname.includes('contact')) return true;
    
    return false;
  }
  
  // Update contact link active state
  function updateContactActiveState() {
    const isActive = isContactSectionActive();
    
    console.log('Header: Contact section active?', isActive);
    
    if (isActive) {
      contactLink.classList.add('current');
      contactLink.setAttribute('aria-current', 'page');
      contactLink.style.pointerEvents = 'none';
      startObserver();
    } else {
      contactLink.classList.remove('current');
      contactLink.removeAttribute('aria-current');
      contactLink.style.pointerEvents = '';
      stopObserver();
    }
  }
  
  // Start MutationObserver for dynamic changes
  function startObserver() {
    if (observer || !window.MutationObserver) return;
    
    const contactSection = document.querySelector('#contact');
    if (!contactSection) return;
    
    observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          setTimeout(updateContactActiveState, 10);
        }
      });
    });
    
    observer.observe(contactSection, { 
      attributes: true, 
      attributeFilter: ['style', 'class'] 
    });
  }
  
  // Stop MutationObserver when not needed
  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
  
  // Initial check with delay
  setTimeout(updateContactActiveState, 100);
  
  // Listen for hash changes
  window.addEventListener('hashchange', function() {
    setTimeout(updateContactActiveState, 10);
  });
  
  // Listen for tab menu clicks
  document.addEventListener('click', function(e) {
    const clickedLink = e.target.closest('a[href*="#"]');
    if (clickedLink) {
      setTimeout(updateContactActiveState, 100);
    }
  });
  
  // Listen for popstate
  window.addEventListener('popstate', function() {
    setTimeout(updateContactActiveState, 10);
  });
  
  // Periodic check as fallback
  setInterval(updateContactActiveState, 2000);
  
  // Cleanup on unload
  window.addEventListener('beforeunload', stopObserver);
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initContactActiveState();
  console.log('Header organism initialized successfully');
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━