/* ===========================================================
   @ORGANISMS - ERROR-LAYOUT
   - Halo reveal system using CSS mask
   - Desktop: Fixed halo + cursor halo (2 halos)
   - Mobile/Tablet: Single halo following scroll
   - Accessibility toggle to show/hide all content
=========================================================== */

/**
 * Initialize error layout halo system
 */
function initErrorLayout() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (!container) return;

  if (window.innerWidth >= 1024) {
    // Desktop: mouse tracking
    container.style.setProperty('--mouse-x', '-200px');
    container.style.setProperty('--mouse-y', '-200px');

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      container.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      container.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });

    container.addEventListener('mouseleave', () => {
      container.style.setProperty('--mouse-x', '-200px');
      container.style.setProperty('--mouse-y', '-200px');
    });
  } else {
    // Mobile/Tablet: scroll tracking
    const mobileContainer = container.querySelector('.error-layout-mobile');
    if (!mobileContainer) return;

    container.style.setProperty('--scroll-y', '20%');

    mobileContainer.addEventListener('scroll', () => {
      const scrollTop = mobileContainer.scrollTop;
      const scrollHeight = mobileContainer.scrollHeight - mobileContainer.clientHeight;
      const scrollPercent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      const scrollY = 20 + (scrollPercent * 60);
      
      container.style.setProperty('--scroll-y', scrollY + '%');
      
      // Reveal fragments progressively
      const fragments = mobileContainer.querySelectorAll('.error-layout-fragment-placeholder');
      fragments.forEach((fragment, index) => {
        const threshold = 0.1 + (index / (fragments.length - 1)) * 0.7;
        fragment.style.opacity = scrollPercent >= threshold ? '1' : '0';
      });
    });
  }
}

/**
 * Initialize accessibility toggle functionality
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
 */
function toggleMaskVisibility(container, button) {
  const isRevealing = button.getAttribute('data-button') === 'button-reveal-all';
  
  if (isRevealing) {
    container.classList.add('error-layout--no-mask');
    updateAccessibilityContent(container, 'hidden');
    // Reveal all fragments on mobile/tablet
    if (window.innerWidth < 1024) {
      container.querySelectorAll('.error-layout-fragment-placeholder').forEach(f => f.style.opacity = '1');
    }
  } else {
    container.classList.remove('error-layout--no-mask');
    updateAccessibilityContent(container, 'visible');
  }
}

/**
 * Update accessibility text and button
 */
function updateAccessibilityContent(container, state) {
  const textElements = container.querySelectorAll('.error-layout-accessibility-text p');
  const buttons = container.querySelectorAll('.error-layout-accessibility-button button');
  
  if (state === 'hidden') {
    textElements.forEach(text => text.textContent = 'Pour invisibiliser les contenus révélés :');
    buttons.forEach(btn => {
      btn.textContent = 'Masquer tout';
      btn.setAttribute('data-button', 'button-hide-all');
      btn.setAttribute('aria-label', 'Masquer tous les contenus révélés');
    });
  } else {
    textElements.forEach(text => text.textContent = 'Pour rendre visibles les contenus cachés :');
    buttons.forEach(btn => {
      btn.textContent = 'Afficher tout';
      btn.setAttribute('data-button', 'button-reveal-all');
      btn.setAttribute('aria-label', 'Afficher tous les contenus cachés');
    });
  }
}

/**
 * Handle window resize to reinitialize if needed
 */
function handleResize() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (!container) return;

  // Reset CSS properties and reinitialize
  container.style.removeProperty('--mouse-x');
  container.style.removeProperty('--mouse-y');
  container.style.removeProperty('--scroll-y');
  
  initErrorLayout();
}

// Initialize error layout when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initErrorLayout();
  initAccessibilityToggle();
});

// Handle window resize
window.addEventListener('resize', handleResize);

// Export for potential external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initErrorLayout,
    initAccessibilityToggle,
    toggleMaskVisibility,
    handleResize
  };
}