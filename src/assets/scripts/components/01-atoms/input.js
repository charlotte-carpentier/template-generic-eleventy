/* ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Input                                            │
   │ Input validation and formatting (date, phone, etc.)     │
   │ Path: src/assets/scripts/components/01-atoms/          │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Input field validation and formatting
 * @module atoms/input
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    SELECTOR: '[data-input-type="input"]',
    PHONE_SELECTOR: '[data-input-format="phone"]',
    DATE_SELECTOR: '[data-input-format="date"]',
    ERROR_CLASS: 'input-error',
    VALID_CLASS: 'input-valid'
  };
  
  // Validation patterns
  const PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_FR: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
    DATE_ISO: /^\d{4}-\d{2}-\d{2}$/
  };
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Core Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Initialize input validation and formatting
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
    // Real-time validation on input
    input.addEventListener('input', () => validateInput(input));
    
    // Final validation on blur
    input.addEventListener('blur', () => validateInput(input, true));
    
    // Clear error on focus
    input.addEventListener('focus', () => clearInputError(input));
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Validation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Validate input field
   * @param {HTMLElement} input - Input element
   * @param {boolean} showError - Show error message
   * @returns {boolean} Validation result
   */
  function validateInput(input, showError = false) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    
    // Empty check
    if (required && !value) {
      if (showError) {
        setInputError(input, 'Ce champ est requis');
      }
      return false;
    }
    
    // Skip validation if empty and not required
    if (!value && !required) {
      clearInputError(input);
      return true;
    }
    
    // Type-specific validation
    let isValid = true;
    let errorMessage = '';
    
    switch (type) {
      case 'email':
        isValid = PATTERNS.EMAIL.test(value);
        errorMessage = 'Email invalide';
        break;
      case 'tel':
        isValid = PATTERNS.PHONE_FR.test(value);
        errorMessage = 'Numéro de téléphone invalide';
        break;
      case 'date':
        isValid = PATTERNS.DATE_ISO.test(value) && isValidDate(value);
        errorMessage = 'Date invalide';
        break;
      case 'url':
        isValid = isValidUrl(value);
        errorMessage = 'URL invalide';
        break;
      case 'number':
        const min = input.getAttribute('min');
        const max = input.getAttribute('max');
        isValid = isValidNumber(value, min, max);
        errorMessage = 'Nombre invalide';
        break;
    }
    
    if (!isValid && showError) {
      setInputError(input, errorMessage);
    } else if (isValid) {
      setInputValid(input);
    }
    
    return isValid;
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
    input.classList.add(CONFIG.ERROR_CLASS);
    input.classList.remove(CONFIG.VALID_CLASS);
    input.setAttribute('aria-invalid', 'true');
    
    // Create or update error message
    let errorEl = input.parentElement?.querySelector('.input-error-message');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'input-error-message';
      errorEl.setAttribute('role', 'alert');
      input.parentElement?.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }
  
  /**
   * Set input valid state
   * @param {HTMLElement} input - Input element
   * @returns {void}
   */
  function setInputValid(input) {
    input.classList.remove(CONFIG.ERROR_CLASS);
    input.classList.add(CONFIG.VALID_CLASS);
    input.setAttribute('aria-invalid', 'false');
    clearInputError(input);
  }
  
  /**
   * Clear input error
   * @param {HTMLElement} input - Input element
   * @returns {void}
   */
  function clearInputError(input) {
    input.classList.remove(CONFIG.ERROR_CLASS);
    input.removeAttribute('aria-invalid');
    
    const errorEl = input.parentElement?.querySelector('.input-error-message');
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
   * Format phone number (French format)
   * @param {string} value - Raw phone number
   * @returns {string} Formatted phone number
   */
  function formatPhoneNumber(value) {
    if (!value) return '';
    
    // French mobile: 06 12 34 56 78
    if (value.length <= 10) {
      return value.match(/.{1,2}/g)?.join(' ') || value;
    }
    
    // International: +33 6 12 34 56 78
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
      if (!validateInput(input, true)) {
        allValid = false;
      }
    });
    
    return allValid;
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // May your bugs be forever exiled to the shadow realm ✦
  // Charlotte Carpentier · 2025
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━