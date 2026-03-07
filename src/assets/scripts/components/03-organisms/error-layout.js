/* ┌─────────────────────────────────────────────────────────┐
   │ ORGANISM › Error Layout                                 │
   │ Halo reveal system with CSS mask and accessibility      │
   │ Path: src/assets/scripts/components/03-organisms/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Interactive halo reveal system for error pages
 * @module organisms/error-layout
 * @created 2025-09-15
 * @updated 2026-03-04 - Migrated selectors to data-* attributes
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
  CONTAINER_SELECTOR: '[data-error-layout-type="error-layout"]',
  MOBILE_CONTAINER_SELECTOR: '[data-error-layout-mobile]',
  TEXT_SELECTOR: '[data-a11y-text] :first-child',
  BUTTON_SELECTOR: '[data-a11y-button] button',
  NO_MASK_ATTR: 'data-error-layout-no-mask'
};


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
 * Initialize mobile halo (scroll tracking)
 * @param {HTMLElement} container - Error layout container
 * @returns {void}
 */
function initMobileHalo(container) {
  const mobileContainer = container.querySelector(CONFIG.MOBILE_CONTAINER_SELECTOR);
  if (!mobileContainer) return;

  container.style.setProperty('--scroll-y', CONFIG.INITIAL_SCROLL_POSITION);

  mobileContainer.addEventListener('scroll', () => {
    const scrollTop = mobileContainer.scrollTop;
    const scrollHeight = mobileContainer.scrollHeight - mobileContainer.clientHeight;
    const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    const scrollY = CONFIG.SCROLL_Y_BASE + (scrollPercent * CONFIG.SCROLL_Y_RANGE);

    container.style.setProperty('--scroll-y', `${scrollY}%`);
  }, { passive: true });
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

  const buttons = container.querySelectorAll(CONFIG.BUTTON_SELECTOR);

  buttons.forEach(button => {
    button.addEventListener('click', () => toggleMaskVisibility(container));
  });
}

/**
 * Toggle mask visibility and update content
 * @param {HTMLElement} container - Error layout container
 * @param {HTMLElement} button - Button that was clicked
 * @returns {void}
 */
function toggleMaskVisibility(container) {
  const isRevealed = container.hasAttribute(CONFIG.NO_MASK_ATTR);
  container.toggleAttribute(CONFIG.NO_MASK_ATTR, !isRevealed);
  updateAccessibilityContent(container, isRevealed ? 'visible' : 'hidden');
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

  const content = state === 'hidden'
    ? { text: 'Pour invisibiliser les contenus révélés :', label: 'Masquer tout', ariaLabel: 'Masquer tous les contenus révélés', btnAttr: 'button-hide-all' }
    : { text: 'Pour rendre visibles les contenus cachés :', label: 'Afficher tout', ariaLabel: 'Afficher tous les contenus cachés', btnAttr: 'button-reveal-all' };

  textElements.forEach(el => { el.textContent = content.text; });
  buttons.forEach(btn => {
    btn.textContent = content.label;
    btn.setAttribute('data-button', content.btnAttr);
    btn.setAttribute('aria-label', content.ariaLabel);
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
