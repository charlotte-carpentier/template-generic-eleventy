/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Error Layout                                 │
   │ Halo reveal system with CSS mask and accessibility      │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Interactive halo reveal system for error pages
 * @module organisms/error-layout
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DESKTOP_BREAKPOINT = 1024;
const INITIAL_MOUSE_POSITION = '-200px';
const INITIAL_SCROLL_POSITION = '20%';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Halo System
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize error layout halo system
 * @returns {void}
 */
function initErrorLayout() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (!container) return;

  if (window.innerWidth >= DESKTOP_BREAKPOINT) {
    initDesktopHalo(container);
  } else {
    initMobileHalo(container);
  }
}

/**
 * Initialize desktop halo (mouse tracking)
 * @param {HTMLElement} container - Error layout container
 * @returns {void}
 */
function initDesktopHalo(container) {
  container.style.setProperty('--mouse-x', INITIAL_MOUSE_POSITION);
  container.style.setProperty('--mouse-y', INITIAL_MOUSE_POSITION);

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    container.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
    container.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
  });

  container.addEventListener('mouseleave', () => {
    container.style.setProperty('--mouse-x', INITIAL_MOUSE_POSITION);
    container.style.setProperty('--mouse-y', INITIAL_MOUSE_POSITION);
  });
}

/**
 * Initialize mobile halo (scroll tracking)
 * @param {HTMLElement} container - Error layout container
 * @returns {void}
 */
function initMobileHalo(container) {
  const mobileContainer = container.querySelector('.error-layout-mobile');
  if (!mobileContainer) return;

  container.style.setProperty('--scroll-y', INITIAL_SCROLL_POSITION);

  mobileContainer.addEventListener('scroll', () => {
    const scrollTop = mobileContainer.scrollTop;
    const scrollHeight = mobileContainer.scrollHeight - mobileContainer.clientHeight;
    const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    const scrollY = 20 + (scrollPercent * 60);
    
    container.style.setProperty('--scroll-y', scrollY + '%');
    
    revealFragmentsProgressively(mobileContainer, scrollPercent);
  });
}

/**
 * Reveal fragments based on scroll position
 * @param {HTMLElement} mobileContainer - Mobile container element
 * @param {number} scrollPercent - Current scroll percentage (0-1)
 * @returns {void}
 */
function revealFragmentsProgressively(mobileContainer, scrollPercent) {
  const fragments = mobileContainer.querySelectorAll('.error-layout-fragment-placeholder');
  fragments.forEach((fragment, index) => {
    const threshold = 0.1 + (index / (fragments.length - 1)) * 0.7;
    fragment.style.opacity = scrollPercent >= threshold ? '1' : '0';
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Accessibility Toggle
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize accessibility toggle functionality
 * @returns {void}
 */
function initAccessibilityToggle() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (!container) return;

  const buttons = container.querySelectorAll('[data-button="button-reveal-all"], [data-button="button-hide-all"]');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => toggleMaskVisibility(container, button));
  });
}

/**
 * Toggle mask visibility and update content
 * @param {HTMLElement} container - Error layout container
 * @param {HTMLElement} button - Button that was clicked
 * @returns {void}
 */
function toggleMaskVisibility(container, button) {
  const isRevealing = button.getAttribute('data-button') === 'button-reveal-all';
  
  if (isRevealing) {
    container.classList.add('error-layout--no-mask');
    updateAccessibilityContent(container, 'hidden');
    
    if (window.innerWidth < DESKTOP_BREAKPOINT) {
      container.querySelectorAll('.error-layout-fragment-placeholder').forEach(f => {
        f.style.opacity = '1';
      });
    }
  } else {
    container.classList.remove('error-layout--no-mask');
    updateAccessibilityContent(container, 'visible');
  }
}

/**
 * Update accessibility text and button
 * @param {HTMLElement} container - Error layout container
 * @param {string} state - Current state ('hidden' or 'visible')
 * @returns {void}
 */
function updateAccessibilityContent(container, state) {
  const textElements = container.querySelectorAll('.error-layout-accessibility-text p');
  const buttons = container.querySelectorAll('.error-layout-accessibility-button button');
  
  if (state === 'hidden') {
    textElements.forEach(text => {
      text.textContent = 'Pour invisibiliser les contenus révélés :';
    });
    buttons.forEach(btn => {
      btn.textContent = 'Masquer tout';
      btn.setAttribute('data-button', 'button-hide-all');
      btn.setAttribute('aria-label', 'Masquer tous les contenus révélés');
    });
  } else {
    textElements.forEach(text => {
      text.textContent = 'Pour rendre visibles les contenus cachés :';
    });
    buttons.forEach(btn => {
      btn.textContent = 'Afficher tout';
      btn.setAttribute('data-button', 'button-reveal-all');
      btn.setAttribute('aria-label', 'Afficher tous les contenus cachés');
    });
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Resize Handler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle window resize to reinitialize if needed
 * @returns {void}
 */
function handleResize() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (!container) return;

  container.style.removeProperty('--mouse-x');
  container.style.removeProperty('--mouse-y');
  container.style.removeProperty('--scroll-y');
  
  initErrorLayout();
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initialization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
  initErrorLayout();
  initAccessibilityToggle();
});

window.addEventListener('resize', handleResize);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initErrorLayout,
    initAccessibilityToggle,
    toggleMaskVisibility,
    handleResize
  };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━