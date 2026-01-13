/* ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Input                                            │
   │ Password toggle + Textarea counter                      │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Input UX enhancements (password toggle + textarea counter)
 * @module atoms/input
 * @created 2025-01-15
 * @updated 2025-12-18
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELECTOR_PASSWORD_TOGGLE = '[data-password-toggle]';
const SELECTOR_TEXTAREA_COUNTER = '[data-input-type="textarea"][maxlength]';

const ICON_EYE = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 5C5 5 1.73 8.11 1 10C1.73 11.89 5 15 10 15C15 15 18.27 11.89 19 10C18.27 8.11 15 5 10 5ZM10 13C8.34 13 7 11.66 7 10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10C13 11.66 11.66 13 10 13ZM10 8.5C9.17 8.5 8.5 9.17 8.5 10C8.5 10.83 9.17 11.5 10 11.5C10.83 11.5 11.5 10.83 11.5 10C11.5 9.17 10.83 8.5 10 8.5Z" fill="currentColor"/>
</svg>`;

const ICON_EYE_SLASH = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 5C5 5 1.73 8.11 1 10C1.73 11.89 5 15 10 15C15 15 18.27 11.89 19 10C18.27 8.11 15 5 10 5ZM10 13C8.34 13 7 11.66 7 10C7 8.34 8.34 7 10 7C11.66 7 13 8.34 13 10C13 11.66 11.66 13 10 13Z" fill="currentColor"/>
  <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
</svg>`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initialize
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize input UX enhancements
 * @returns {void}
 */
export const initInput = () => {
  document.querySelectorAll(SELECTOR_PASSWORD_TOGGLE).forEach(attachPasswordToggle);
  document.querySelectorAll(SELECTOR_TEXTAREA_COUNTER).forEach(attachTextareaCounter);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Password Toggle
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Attach password toggle functionality
 * @param {HTMLElement} btn - Toggle button element
 * @returns {void}
 */
const attachPasswordToggle = (btn) => {
  const inputId = btn.dataset.passwordToggle;
  const input = document.getElementById(inputId);

  if (!input) return;

  btn.innerHTML = ICON_EYE;

  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';

    input.type = isPassword ? 'text' : 'password';
    btn.setAttribute('aria-pressed', (!isPassword).toString());
    btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    btn.innerHTML = isPassword ? ICON_EYE_SLASH : ICON_EYE;
  });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Textarea Counter
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Attach textarea character counter
 * @param {HTMLElement} textarea - Textarea element
 * @returns {void}
 */
const attachTextareaCounter = (textarea) => {
  const counterId = `${textarea.id}-count`;
  const counter = document.getElementById(counterId);

  if (!counter) return;

  const maxLength = parseInt(textarea.maxLength, 10);

  const updateCounter = () => {
    counter.textContent = `${textarea.value.length}/${maxLength}`;
  };

  updateCounter();
  textarea.addEventListener('input', updateCounter);
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
