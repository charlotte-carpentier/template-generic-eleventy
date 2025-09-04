/* ===========================================================
   @MOLECULES - ERROR-FOOTER
   - Toggle functionality between visible/hidden states
   - Button text and info text switch on click
   - ARIA accessibility and keyboard navigation support
=========================================================== */

/**
 * Initialize error footer toggle functionality
 */
function initErrorFooter() {
  const errorFooters = document.querySelectorAll('.error-footer--toggle');
  
  errorFooters.forEach(footer => {
    const button = footer.querySelector('.error-footer-button button');
    const infoText = footer.querySelector('.error-footer-info');
    
    if (!button || !infoText) return;
    
    // Store initial state data
    let isVisible = true; // Start with "visible" state
    
    // Setup click handler
    button.addEventListener('click', () => toggleErrorFooterState(footer, button, infoText));
    
    // Keyboard accessibility
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleErrorFooterState(footer, button, infoText);
      }
    });
  });
}

/**
 * Toggle between visible and hidden states
 */
function toggleErrorFooterState(footer, button, infoText) {
  // Check current state based on button text content
  const currentButtonText = button.textContent.trim();
  const isCurrentlyVisible = currentButtonText === 'Afficher tout';
  
  if (isCurrentlyVisible) {
    // Switch to "hidden" state
    updateErrorFooterContent(infoText, 'footer-info-hidden');
    updateErrorFooterButton(button, 'button-hide-all');
    
    // Update ARIA label for accessibility
    button.setAttribute('aria-label', 'Masquer tous les contenus révélés');
    
    // Dispatch custom event for potential page-wide listeners
    footer.dispatchEvent(new CustomEvent('errorFooter:hide', {
      bubbles: true,
      detail: { action: 'hide' }
    }));
    
  } else {
    // Switch to "visible" state  
    updateErrorFooterContent(infoText, 'footer-info-visible');
    updateErrorFooterButton(button, 'button-reveal-all');
    
    // Update ARIA label for accessibility
    button.setAttribute('aria-label', 'Afficher tous les contenus cachés');
    
    // Dispatch custom event for potential page-wide listeners
    footer.dispatchEvent(new CustomEvent('errorFooter:show', {
      bubbles: true,
      detail: { action: 'show' }
    }));
  }
}

/**
 * Update footer info text content
 */
function updateErrorFooterContent(infoElement, typographyName) {
  // Map typography names to actual text content
  const textContent = {
    'footer-info-visible': 'Pour rendre visibles les contenus cachés :',
    'footer-info-hidden': 'Pour invisibiliser les contenus révélés :'
  };
  
  const newText = textContent[typographyName];
  if (newText && infoElement) {
    infoElement.innerHTML = `<p class="text-p max-w-prose leading-relaxed">${newText}</p>`;
  }
}

/**
 * Update button text content
 */
function updateErrorFooterButton(button, buttonName) {
  // Map button names to actual text content
  const buttonContent = {
    'button-reveal-all': 'Afficher tout',
    'button-hide-all': 'Masquer tout'
  };
  
  const newText = buttonContent[buttonName];
  if (newText && button) {
    button.textContent = newText;
    button.setAttribute('data-button', buttonName);
  }
}

// =========================
// INITIALIZATION
// =========================

// Initialize error footer when DOM is ready
document.addEventListener('DOMContentLoaded', initErrorFooter);

// Export for potential external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initErrorFooter, toggleErrorFooterState };
}