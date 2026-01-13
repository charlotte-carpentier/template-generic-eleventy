/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Error Layout                                 │
   │ Halo reveal system with CSS mask and accessibility      │
   │ Path: src/assets/scripts/components/03-organisms/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Interactive halo reveal system for error pages
 * @module organisms/error-layout
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  DESKTOP_BREAKPOINT: 1024,
  INITIAL_MOUSE_POSITION: '-200px',
  INITIAL_SCROLL_POSITION: '20%',
  SCROLL_Y_BASE: 20,
  SCROLL_Y_RANGE: 60,
  REVEAL_START_THRESHOLD: 0.1,
  REVEAL_END_THRESHOLD: 0.7,
  RESIZE_DEBOUNCE: 150,
  CONTAINER_SELECTOR: '.error-layout--cross-layout',
  MOBILE_CONTAINER_SELECTOR: '.error-layout-mobile',
  FRAGMENT_SELECTOR: '.error-layout-fragment-placeholder',
  TEXT_SELECTOR: '.error-layout-accessibility-text p',
  BUTTON_SELECTOR: '.error-layout-accessibility-button button',
  NO_MASK_CLASS: 'error-layout--no-mask'
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
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Halo System
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize error layout halo system
 * @returns {void}
 */
export function initErrorLayout() {
  const container = document.querySelector(CONFIG.CONTAINER_SELECTOR);
  if (!container) return;

  if (window.innerWidth >= CONFIG.DESKTOP_BREAKPOINT) {
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
  container.style.setProperty('--mouse-x', CONFIG.INITIAL_MOUSE_POSITION);
  container.style.setProperty('--mouse-y', CONFIG.INITIAL_MOUSE_POSITION);

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    container.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    container.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });

  container.addEventListener('mouseleave', () => {
    container.style.setProperty('--mouse-x', CONFIG.INITIAL_MOUSE_POSITION);
    container.style.setProperty('--mouse-y', CONFIG.INITIAL_MOUSE_POSITION);
  });
}

/**
 * Initialize mobile halo (scroll tracking with IntersectionObserver)
 * @param {HTMLElement} container - Error layout container
 * @returns {void}
 */
function initMobileHalo(container) {
  const mobileContainer = container.querySelector(CONFIG.MOBILE_CONTAINER_SELECTOR);
  if (!mobileContainer) return;

  container.style.setProperty('--scroll-y', CONFIG.INITIAL_SCROLL_POSITION);

  // Scroll position tracking
  mobileContainer.addEventListener('scroll', () => {
    const scrollTop = mobileContainer.scrollTop;
    const scrollHeight = mobileContainer.scrollHeight - mobileContainer.clientHeight;
    const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    const scrollY = CONFIG.SCROLL_Y_BASE + (scrollPercent * CONFIG.SCROLL_Y_RANGE);

    container.style.setProperty('--scroll-y', `${scrollY}%`);
  }, { passive: true });

  // Progressive reveal with IntersectionObserver
  initFragmentReveal(mobileContainer);
}

/**
 * Initialize fragment reveal with IntersectionObserver
 * @param {HTMLElement} mobileContainer - Mobile container element
 * @returns {void}
 */
function initFragmentReveal(mobileContainer) {
  const fragments = mobileContainer.querySelectorAll(CONFIG.FRAGMENT_SELECTOR);

  const observerOptions = {
    root: mobileContainer,
    threshold: [0, 0.25, 0.5, 0.75, 1]
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
      }
    });
  }, observerOptions);

  fragments.forEach(fragment => {
    fragment.style.opacity = '0';
    fragment.style.transition = 'opacity 0.3s ease';
    observer.observe(fragment);
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Accessibility Toggle
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize accessibility toggle functionality
 * @returns {void}
 */
export function initAccessibilityToggle() {
  const container = document.querySelector(CONFIG.CONTAINER_SELECTOR);
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
    container.classList.add(CONFIG.NO_MASK_CLASS);
    updateAccessibilityContent(container, 'hidden');

    if (window.innerWidth < CONFIG.DESKTOP_BREAKPOINT) {
      container.querySelectorAll(CONFIG.FRAGMENT_SELECTOR).forEach(f => {
        f.style.opacity = '1';
      });
    }
  } else {
    container.classList.remove(CONFIG.NO_MASK_CLASS);
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
  const textElements = container.querySelectorAll(CONFIG.TEXT_SELECTOR);
  const buttons = container.querySelectorAll(CONFIG.BUTTON_SELECTOR);

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
  const container = document.querySelector(CONFIG.CONTAINER_SELECTOR);
  if (!container) return;

  container.style.removeProperty('--mouse-x');
  container.style.removeProperty('--mouse-y');
  container.style.removeProperty('--scroll-y');

  initErrorLayout();


  window.addEventListener('resize', debounce(handleResize, CONFIG.RESIZE_DEBOUNCE));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
