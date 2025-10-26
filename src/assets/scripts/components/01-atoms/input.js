/* ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Input                                            │
   │ Input validation using Constraint Validation API        │
   │ Path: src/assets/scripts/components/01-atoms/          │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Input validation with Constraint Validation API
 * @module atoms/input
 * @created 2025-01-15
 * @updated 2025-10-26
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
  SELECTOR: '[data-input-type="input"], [data-input-type="textarea"], [data-input-type="select"], [data-input-type="date"], [data-input-type="phone"], [data-input-type="panel"]',
  PHONE_SELECTOR: '[data-input-format="phone"]',
  DATE_SELECTOR: '[data-input-format="date"]',
  ERROR_MESSAGE_CLASS: 'input-error-message'
};

// Validation patterns
const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_FR: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/
};

// Error icon SVG
const ERROR_ICON_SVG = `<svg class="flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8.8 12H7.2V10.4H8.8V12ZM8.8 8.8H7.2V4H8.8V8.8Z" fill="var(--color-semantic-critical)"/>
</svg>`;


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize input validation
 * @returns {void}
 */
export function initInput() {
  const inputs = document.querySelectorAll(CONFIG.SELECTOR);
  inputs.forEach(input => attachInputEvents(input));
  
  // Special formatting for phone inputs
  const phoneInputs = document.querySelectorAll(CONFIG.PHONE_SELECTOR);
  phoneInputs.forEach(input => attachPhoneFormatting(input));
  
  // Date input helpers
  const dateInputs = document.querySelectorAll(CONFIG.DATE_SELECTOR);
  dateInputs.forEach(input => attachDateHelpers(input));
}

/**
 * Attach events to input
 * @param {HTMLElement} input - Input element
 * @returns {void}
 */
function attachInputEvents(input) {
  // Clear custom error on input
  input.addEventListener('input', () => {
    input.setCustomValidity('');
    clearInputError(input);
  });
  
  // Validate on blur
  input.addEventListener('blur', () => validateInput(input));
  
  // Clear error on focus
  input.addEventListener('focus', () => clearInputError(input));
  
  // Native invalid event
  input.addEventListener('invalid', (e) => {
    e.preventDefault();
    showInputError(input);
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Validation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Validate input field
 * @param {HTMLElement} input - Input element
 * @returns {boolean} Validation result
 */
function validateInput(input) {
  const value = input.value.trim();
  const type = input.type;
  const required = input.hasAttribute('required');
  
  // Clear previous custom validity
  input.setCustomValidity('');
  
  // Empty check
  if (required && !value) {
    setInputError(input, getErrorMessage(input));
    return false;
  }
  
  // Skip validation if empty and not required
  if (!value && !required) {
    clearInputError(input);
    return true;
  }
  
  // Type-specific validation
  let customError = '';
  
  switch (type) {
    case 'email':
      if (!PATTERNS.EMAIL.test(value)) {
        customError = getErrorMessage(input);
      }
      break;
    case 'tel':
      if (!PATTERNS.PHONE_FR.test(value)) {
        customError = getErrorMessage(input);
      }
      break;
    case 'date':
      if (!PATTERNS.DATE_ISO.test(value) || !isValidDate(value)) {
        customError = getErrorMessage(input);
      }
      break;
    case 'url':
      if (!isValidUrl(value)) {
        customError = getErrorMessage(input);
      }
      break;
    case 'number':
      const min = input.getAttribute('min');
      const max = input.getAttribute('max');
      if (!isValidNumber(value, min, max)) {
        customError = getErrorMessage(input);
      }
      break;
  }
  
  // Set custom validity if error
  if (customError) {
    setInputError(input, customError);
    return false;
  }
  
  // Check native validity
  if (!input.checkValidity()) {
    setInputError(input, getErrorMessage(input));
    return false;
  }
  
  // Valid
  clearInputError(input);
  return true;
}

/**
 * Get error message from JSON data
 * @param {HTMLElement} input - Input element
 * @returns {string} Error message
 */
function getErrorMessage(input) {
  return input.getAttribute('data-error-message') || 'Champ invalide';
}

/**
 * Check if date is valid
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {boolean} Valid date
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Check if URL is valid
 * @param {string} url - URL string
 * @returns {boolean} Valid URL
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if number is valid
 * @param {string} value - Number value
 * @param {string|null} min - Min value
 * @param {string|null} max - Max value
 * @returns {boolean} Valid number
 */
function isValidNumber(value, min, max) {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  
  if (min !== null && num < parseFloat(min)) return false;
  if (max !== null && num > parseFloat(max)) return false;
  
  return true;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Error Handling
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Set input error state
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 * @returns {void}
 */
function setInputError(input, message) {
  input.setCustomValidity(message);
  input.classList.add('!border-[var(--color-semantic-critical)]');
  showInputError(input);
}

/**
 * Show input error message
 * @param {HTMLElement} input - Input element
 * @returns {void}
 */
function showInputError(input) {
  const errorMessage = input.validationMessage || getErrorMessage(input);
  
  // Create or update error message element
  let errorEl = input.parentElement?.querySelector(`.${CONFIG.ERROR_MESSAGE_CLASS}`);
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = CONFIG.ERROR_MESSAGE_CLASS;
    errorEl.id = `${input.id}-error`;
    errorEl.setAttribute('aria-live', 'polite');
    
    // Tailwind classes
    errorEl.classList.add(
      'flex',
      'items-start',
      'gap-2',
      'mt-1.5',
      'text-sm',
      'text-[var(--color-semantic-critical)]'
    );
    
    input.parentElement?.appendChild(errorEl);
  }
  
  // Update content with icon + message
  errorEl.innerHTML = `${ERROR_ICON_SVG}<span>${errorMessage}</span>`;
}

/**
 * Clear input error
 * @param {HTMLElement} input - Input element
 * @returns {void}
 */
function clearInputError(input) {
  input.setCustomValidity('');
  input.classList.remove('!border-[var(--color-semantic-critical)]');
  
  const errorEl = input.parentElement?.querySelector(`.${CONFIG.ERROR_MESSAGE_CLASS}`);
  if (errorEl) {
    errorEl.remove();
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Phone Formatting
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Attach phone formatting
 * @param {HTMLElement} input - Phone input element
 * @returns {void}
 */
function attachPhoneFormatting(input) {
  input.addEventListener('input', (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = formatPhoneNumber(value);
    e.target.value = formatted;
  });
}

/**
 * Format phone number
 * @param {string} value - Raw phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(value) {
  if (!value) return '';
  
  // French mobile: 06 12 34 56 78
  if (value.length <= 10) {
    return value.match(/.{1,2}/g)?.join(' ') || value;
  }
  
  // International
  return value;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Date Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Attach date helpers
 * @param {HTMLElement} input - Date input element
 * @returns {void}
 */
function attachDateHelpers(input) {
  // Set today as max if needed
  if (input.hasAttribute('data-date-max-today')) {
    const today = new Date().toISOString().split('T')[0];
    input.setAttribute('max', today);
  }
  
  // Set today as min if needed
  if (input.hasAttribute('data-date-min-today')) {
    const today = new Date().toISOString().split('T')[0];
    input.setAttribute('min', today);
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Public API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Validate form inputs
 * @param {HTMLElement} form - Form element
 * @returns {boolean} All inputs valid
 */
export function validateForm(form) {
  const inputs = form.querySelectorAll(CONFIG.SELECTOR);
  let allValid = true;
  
  inputs.forEach(input => {
    if (!validateInput(input)) {
      allValid = false;
    }
  });
  
  return allValid;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━