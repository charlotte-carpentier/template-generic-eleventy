/* ===========================================================
   @ORGANISM - AVATAR-CARD
   - Event-driven avatar button management with accessibility
   - Mobile buttons interaction and desktop tooltip behavior
   - Performance optimized with duplicate listener prevention
=========================================================== */

// Initialize avatar button functionality
function initAvatarButtons() {
  // Get all avatar button containers (mobile only)
  const avatarButtonContainers = document.querySelectorAll('.avatar-card-mobile .avatar-card-button');
  
  console.log(`Avatar Card: Found ${avatarButtonContainers.length} button containers`);
  
  avatarButtonContainers.forEach(container => {
    const buttonId = container.getAttribute('data-button');
    const actualButton = container.querySelector('button');
    
    console.log(`Setting up button container: ${buttonId}`, { hasButton: !!actualButton });
    
    if (buttonId && actualButton && !actualButton.hasAttribute('data-initialized')) {
      // Mark button as initialized to prevent duplicate listeners
      actualButton.setAttribute('data-initialized', 'true');
      
      // Enhanced accessibility attributes
      actualButton.setAttribute('aria-describedby', 'skills-announcement');
      actualButton.setAttribute('aria-expanded', 'false');
      
      // Set appropriate aria-label based on button type
      const buttonLabels = {
        'button_languages': 'Show languages skills',
        'button_hard_skills': 'Show technical skills',
        'button_soft_skills': 'Show soft skills',
        'button_interests': 'Show interests and hobbies'
      };
      
      if (buttonLabels[buttonId]) {
        actualButton.setAttribute('aria-label', buttonLabels[buttonId]);
      }
      
      actualButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log(`Avatar Card: Button clicked - ${buttonId}`);
        
        // Update aria-expanded state
        const isExpanded = actualButton.getAttribute('aria-expanded') === 'true';
        actualButton.setAttribute('aria-expanded', (!isExpanded).toString());
        
        // Announce action to screen readers
        const announcement = document.getElementById('skills-announcement');
        if (announcement) {
          const actionText = !isExpanded ? 'opened' : 'closed';
          const skillType = buttonLabels[buttonId] ? buttonLabels[buttonId].replace('Show ', '') : 'skills';
          announcement.textContent = `${skillType} section ${actionText}`;
        }
        
        // Emit custom event for skills card to listen
        const skillsToggleEvent = new CustomEvent('avatar:skillsToggle', {
          detail: { buttonId: buttonId },
          bubbles: true
        });
        
        document.dispatchEvent(skillsToggleEvent);
        console.log(`Event dispatched: avatar:skillsToggle with buttonId: ${buttonId}`);
      });
      
      // Enhanced keyboard navigation
      actualButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          actualButton.click();
        }
      });
    } else if (!actualButton) {
      console.warn(`Button container problem:`, { buttonId, hasButton: !!actualButton });
    }
  });
}

// Initialize tooltip accessibility for desktop
function initTooltipAccessibility() {
  const tooltipTrigger = document.querySelector('.avatar-tooltip-container');
  const tooltip = document.getElementById('tooltip-avatar-desktop');
  
  if (tooltipTrigger && tooltip) {
    tooltipTrigger.addEventListener('mouseenter', function() {
      tooltip.setAttribute('aria-hidden', 'false');
    });
    
    tooltipTrigger.addEventListener('mouseleave', function() {
      tooltip.setAttribute('aria-hidden', 'true');
    });
    
    tooltipTrigger.addEventListener('focus', function() {
      tooltip.setAttribute('aria-hidden', 'false');
    });
    
    tooltipTrigger.addEventListener('blur', function() {
      tooltip.setAttribute('aria-hidden', 'true');
    });
    
    // Keyboard navigation for tooltip
    tooltipTrigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isVisible = tooltip.getAttribute('aria-hidden') === 'false';
        tooltip.setAttribute('aria-hidden', (!isVisible).toString());
      }
    });
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  console.log('Avatar Card: Initializing...');
  
  // DEBUG: Check if avatar container exists
  const avatarContainer = document.querySelector('.avatar-card-mobile');
  console.log('Avatar mobile container found:', !!avatarContainer);
  
  if (avatarContainer) {
    const buttonContainers = avatarContainer.querySelectorAll('.avatar-card-button');
    console.log('Button containers found:', buttonContainers.length);
    
    buttonContainers.forEach((container, index) => {
      const dataButton = container.getAttribute('data-button');
      const actualButton = container.querySelector('button');
      console.log(`  ${index + 1}. data-button="${dataButton}", has button: ${!!actualButton}`);
    });
  }
  
  // Initialize button functionality with accessibility
  initAvatarButtons();
  
  // Initialize tooltip accessibility for desktop
  initTooltipAccessibility();
  
  console.log('Avatar Card: Fully initialized with accessibility enhancements');
});