/**
 * Main JavaScript file that imports all required components
 */

// Main initialization code
document.addEventListener('DOMContentLoaded', () => {
  console.log('HAT Dynamic Template initialized');
  
  // Initialize Caption tooltips if function exists
  if (typeof initTooltips === 'function') {
    initTooltips();
    console.log('Caption tooltips initialized');
  }
  
  // Header will be initialized by its own script
  console.log('Header organism script loaded separately');
});