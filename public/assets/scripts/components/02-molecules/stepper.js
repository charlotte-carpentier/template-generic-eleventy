/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Stepper                                      │
   │ Multi-step form navigation with progress tracking       │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Step-by-step navigation functionality
 * @module molecules/stepper
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    STEPPER_SELECTOR: '[data-stepper]',
    STEP_SELECTOR: '[data-stepper-step]',
    CONTENT_SELECTOR: '[data-stepper-content]',
    PREV_SELECTOR: '[data-stepper-prev]',
    NEXT_SELECTOR: '[data-stepper-next]',
    ACTIVE_CLASS: 'step-active',
    COMPLETED_CLASS: 'step-completed',
    DISABLED_CLASS: 'step-disabled'
  };
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Core Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Initialize steppers
   * @returns {void}
   */
  export function initStepper() {
    const steppers = document.querySelectorAll(CONFIG.STEPPER_SELECTOR);
    steppers.forEach(stepper => setupStepper(stepper));
  }
  
  /**
   * Setup stepper element
   * @param {HTMLElement} stepper - Stepper container
   * @returns {void}
   */
  function setupStepper(stepper) {
    const steps = stepper.querySelectorAll(CONFIG.STEP_SELECTOR);
    const contents = stepper.querySelectorAll(CONFIG.CONTENT_SELECTOR);
    
    if (steps.length === 0) return;
    
    // Get initial step
    const currentStep = parseInt(stepper.getAttribute('data-stepper-current')) || 1;
    const totalSteps = steps.length;
    
    // Setup ARIA
    stepper.setAttribute('role', 'group');
    stepper.setAttribute('aria-label', 'Step navigation');
    
    steps.forEach((step, index) => {
      const stepNumber = index + 1;
      const stepId = step.id || `step-${Date.now()}-${stepNumber}`;
      
      step.id = stepId;
      step.setAttribute('aria-label', `Step ${stepNumber} of ${totalSteps}`);
    });
    
    // Setup navigation buttons
    const prevBtn = stepper.querySelector(CONFIG.PREV_SELECTOR);
    const nextBtn = stepper.querySelector(CONFIG.NEXT_SELECTOR);
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToPreviousStep(stepper));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToNextStep(stepper));
    }
    
    // Setup step click navigation (optional)
    steps.forEach((step, index) => {
      const stepNumber = index + 1;
      
      step.addEventListener('click', () => {
        // Only allow going to completed steps or current step
        if (stepNumber <= currentStep) {
          goToStep(stepper, stepNumber);
        }
      });
    });
    
    // Initial render
    goToStep(stepper, currentStep, false);
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Navigation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Go to specific step
   * @param {HTMLElement} stepper - Stepper container
   * @param {number} stepNumber - Step number (1-indexed)
   * @param {boolean} dispatch - Dispatch event
   * @returns {void}
   */
  export function goToStep(stepper, stepNumber, dispatch = true) {
    const steps = stepper.querySelectorAll(CONFIG.STEP_SELECTOR);
    const contents = stepper.querySelectorAll(CONFIG.CONTENT_SELECTOR);
    const totalSteps = steps.length;
    
    if (stepNumber < 1 || stepNumber > totalSteps) return;
    
    // Update current step attribute
    stepper.setAttribute('data-stepper-current', stepNumber);
    
    // Update steps UI
    steps.forEach((step, index) => {
      const thisStepNumber = index + 1;
      
      if (thisStepNumber === stepNumber) {
        step.classList.add(CONFIG.ACTIVE_CLASS);
        step.classList.remove(CONFIG.COMPLETED_CLASS);
        step.setAttribute('aria-current', 'step');
      } else if (thisStepNumber < stepNumber) {
        step.classList.remove(CONFIG.ACTIVE_CLASS);
        step.classList.add(CONFIG.COMPLETED_CLASS);
        step.removeAttribute('aria-current');
      } else {
        step.classList.remove(CONFIG.ACTIVE_CLASS, CONFIG.COMPLETED_CLASS);
        step.removeAttribute('aria-current');
      }
    });
    
    // Update contents
    contents.forEach((content, index) => {
      const thisStepNumber = index + 1;
      
      if (thisStepNumber === stepNumber) {
        content.style.display = 'block';
        content.setAttribute('aria-hidden', 'false');
      } else {
        content.style.display = 'none';
        content.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Update navigation buttons
    updateNavigationButtons(stepper, stepNumber, totalSteps);
    
    // Dispatch event
    if (dispatch) {
      stepper.dispatchEvent(new CustomEvent('step-change', {
        detail: { step: stepNumber, totalSteps },
        bubbles: true
      }));
    }
    
    // Announce to screen readers
    announceStep(stepNumber, totalSteps);
  }
  
  /**
   * Go to next step
   * @param {HTMLElement} stepper - Stepper container
   * @returns {void}
   */
  export function goToNextStep(stepper) {
    const currentStep = parseInt(stepper.getAttribute('data-stepper-current')) || 1;
    const totalSteps = stepper.querySelectorAll(CONFIG.STEP_SELECTOR).length;
    
    if (currentStep < totalSteps) {
      // Validate current step before proceeding
      const isValid = validateStep(stepper, currentStep);
      
      if (isValid) {
        goToStep(stepper, currentStep + 1);
      }
    }
  }
  
  /**
   * Go to previous step
   * @param {HTMLElement} stepper - Stepper container
   * @returns {void}
   */
  export function goToPreviousStep(stepper) {
    const currentStep = parseInt(stepper.getAttribute('data-stepper-current')) || 1;
    
    if (currentStep > 1) {
      goToStep(stepper, currentStep - 1);
    }
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Validation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Validate current step
   * @param {HTMLElement} stepper - Stepper container
   * @param {number} stepNumber - Step to validate
   * @returns {boolean} Validation result
   */
  function validateStep(stepper, stepNumber) {
    const contents = stepper.querySelectorAll(CONFIG.CONTENT_SELECTOR);
    const currentContent = contents[stepNumber - 1];
    
    if (!currentContent) return true;
    
    // Find all required inputs in current step
    const inputs = currentContent.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    inputs.forEach(input => {
      if (!input.checkValidity()) {
        isValid = false;
        input.reportValidity();
      }
    });
    
    // Dispatch validation event
    const validationEvent = new CustomEvent('step-validate', {
      detail: { step: stepNumber, valid: isValid },
      bubbles: true,
      cancelable: true
    });
    
    stepper.dispatchEvent(validationEvent);
    
    return isValid && !validationEvent.defaultPrevented;
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UI Updates
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Update navigation buttons
   * @param {HTMLElement} stepper - Stepper container
   * @param {number} currentStep - Current step number
   * @param {number} totalSteps - Total steps
   * @returns {void}
   */
  function updateNavigationButtons(stepper, currentStep, totalSteps) {
    const prevBtn = stepper.querySelector(CONFIG.PREV_SELECTOR);
    const nextBtn = stepper.querySelector(CONFIG.NEXT_SELECTOR);
    
    // Update previous button
    if (prevBtn) {
      if (currentStep === 1) {
        prevBtn.classList.add(CONFIG.DISABLED_CLASS);
        prevBtn.setAttribute('disabled', 'true');
        prevBtn.setAttribute('aria-disabled', 'true');
      } else {
        prevBtn.classList.remove(CONFIG.DISABLED_CLASS);
        prevBtn.removeAttribute('disabled');
        prevBtn.setAttribute('aria-disabled', 'false');
      }
    }
    
    // Update next button
    if (nextBtn) {
      if (currentStep === totalSteps) {
        nextBtn.textContent = nextBtn.getAttribute('data-submit-text') || 'Terminer';
      } else {
        nextBtn.textContent = nextBtn.getAttribute('data-next-text') || 'Suivant';
      }
    }
  }
  
  /**
   * Announce step change to screen readers
   * @param {number} currentStep - Current step
   * @param {number} totalSteps - Total steps
   * @returns {void}
   */
  function announceStep(currentStep, totalSteps) {
    const announcement = `Étape ${currentStep} sur ${totalSteps}`;
    
    let liveRegion = document.getElementById('stepper-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'stepper-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // May your bugs be forever exiled to the shadow realm ✦
  // HAT · 2025
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━