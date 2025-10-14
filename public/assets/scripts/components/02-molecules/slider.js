/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Slider                                       │
   │ Range input slider with visual feedback                 │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Range slider with live value display
 * @module molecules/slider
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    SLIDER_SELECTOR: '[data-slider]',
    INPUT_SELECTOR: '[data-slider-input]',
    VALUE_SELECTOR: '[data-slider-value]',
    TRACK_SELECTOR: '[data-slider-track]',
    FILL_SELECTOR: '[data-slider-fill]'
  };
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Core Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Initialize sliders
   * @returns {void}
   */
  export function initSlider() {
    const sliders = document.querySelectorAll(CONFIG.SLIDER_SELECTOR);
    sliders.forEach(slider => setupSlider(slider));
  }
  
  /**
   * Setup slider element
   * @param {HTMLElement} slider - Slider container
   * @returns {void}
   */
  function setupSlider(slider) {
    const input = slider.querySelector(CONFIG.INPUT_SELECTOR);
    if (!input) return;
    
    const valueDisplay = slider.querySelector(CONFIG.VALUE_SELECTOR);
    const fill = slider.querySelector(CONFIG.FILL_SELECTOR);
    
    // Get configuration
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || 100;
    const step = parseFloat(input.step) || 1;
    const prefix = slider.getAttribute('data-slider-prefix') || '';
    const suffix = slider.getAttribute('data-slider-suffix') || '';
    
    // Initial update
    updateSliderUI(input, valueDisplay, fill, min, max, prefix, suffix);
    
    // Input event for real-time updates
    input.addEventListener('input', () => {
      updateSliderUI(input, valueDisplay, fill, min, max, prefix, suffix);
      
      // Dispatch custom event
      slider.dispatchEvent(new CustomEvent('slider-input', {
        detail: { value: parseFloat(input.value) },
        bubbles: true
      }));
    });
    
    // Change event for final value
    input.addEventListener('change', () => {
      slider.dispatchEvent(new CustomEvent('slider-change', {
        detail: { value: parseFloat(input.value) },
        bubbles: true
      }));
    });
    
    // Keyboard enhancements
    input.addEventListener('keydown', (e) => {
      handleSliderKeydown(e, input, min, max, step);
    });
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UI Updates
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Update slider UI
   * @param {HTMLElement} input - Input element
   * @param {HTMLElement|null} valueDisplay - Value display element
   * @param {HTMLElement|null} fill - Fill element
   * @param {number} min - Min value
   * @param {number} max - Max value
   * @param {string} prefix - Value prefix
   * @param {string} suffix - Value suffix
   * @returns {void}
   */
  function updateSliderUI(input, valueDisplay, fill, min, max, prefix, suffix) {
    const value = parseFloat(input.value);
    const percentage = ((value - min) / (max - min)) * 100;
    
    // Update value display
    if (valueDisplay) {
      valueDisplay.textContent = `${prefix}${formatValue(value)}${suffix}`;
    }
    
    // Update fill width
    if (fill) {
      fill.style.width = `${percentage}%`;
    }
    
    // Update CSS custom property for advanced styling
    input.style.setProperty('--slider-value', percentage);
    
    // Update ARIA
    input.setAttribute('aria-valuenow', value);
    input.setAttribute('aria-valuemin', min);
    input.setAttribute('aria-valuemax', max);
    input.setAttribute('aria-valuetext', `${prefix}${formatValue(value)}${suffix}`);
  }
  
  /**
   * Format value for display
   * @param {number} value - Value to format
   * @returns {string} Formatted value
   */
  function formatValue(value) {
    // Round to 2 decimals if needed
    return value % 1 === 0 ? value.toString() : value.toFixed(2);
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Keyboard Navigation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Enhanced keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   * @param {HTMLElement} input - Input element
   * @param {number} min - Min value
   * @param {number} max - Max value
   * @param {number} step - Step value
   * @returns {void}
   */
  function handleSliderKeydown(event, input, min, max, step) {
    const currentValue = parseFloat(input.value);
    let newValue = currentValue;
    
    switch (event.key) {
      case 'Home':
        event.preventDefault();
        newValue = min;
        break;
      case 'End':
        event.preventDefault();
        newValue = max;
        break;
      case 'PageUp':
        event.preventDefault();
        newValue = Math.min(max, currentValue + step * 10);
        break;
      case 'PageDown':
        event.preventDefault();
        newValue = Math.max(min, currentValue - step * 10);
        break;
    }
    
    if (newValue !== currentValue) {
      input.value = newValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Public API
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Set slider value programmatically
   * @param {HTMLElement} slider - Slider container
   * @param {number} value - New value
   * @returns {void}
   */
  export function setSliderValue(slider, value) {
    const input = slider.querySelector(CONFIG.INPUT_SELECTOR);
    if (!input) return;
    
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  
  /**
   * Get slider value
   * @param {HTMLElement} slider - Slider container
   * @returns {number|null} Current value
   */
  export function getSliderValue(slider) {
    const input = slider.querySelector(CONFIG.INPUT_SELECTOR);
    return input ? parseFloat(input.value) : null;
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // May your bugs be forever exiled to the shadow realm ✦
  // Charlotte Carpentier · 2025
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━