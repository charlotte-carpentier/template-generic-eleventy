/* ============================================================
   @ORGANISMS - SKILLS-CARD
   - Event-driven skills cards management + Close buttons + Full autonomy
============================================================ */

// Button to Card mapping - UTILISE data-skills POST-MIGRATION
const SKILLS_MAPPING = {
  'button_languages': 'languages_card',
  'button_hard_skills': 'hard_skills_card',
  'button_soft_skills': 'soft_skills_card',
  'button_interests': 'interests_card'
};

// Cached DOM containers for performance
let skillsContainersCache = null;

// Get all skills card containers - UTILISE data-skills
function getSkillsContainers() {
  if (!skillsContainersCache) {
    skillsContainersCache = Object.values(SKILLS_MAPPING)
      .map(skillsName => document.querySelector(`[data-skills="${skillsName}"]`))
      .filter(Boolean);
  }
  return skillsContainersCache;
}

// Hide all skills cards
function hideAllSkillsCards() {
  getSkillsContainers().forEach(container => {
    container.classList.add('hidden');
    container.classList.remove('block', 'visible');
    container.setAttribute('aria-hidden', 'true');
  });
}

// Show specific skills card - UTILISE data-skills
function showSkillsCard(skillsName) {
  const container = document.querySelector(`[data-skills="${skillsName}"]`);
  if (container) {
    container.classList.remove('hidden');
    container.classList.add('block', 'visible');
    container.setAttribute('aria-hidden', 'false');
  }
}

// Check if skills card is visible - UTILISE data-skills
function isSkillsCardVisible(skillsName) {
  const container = document.querySelector(`[data-skills="${skillsName}"]`);
  return container ? !container.classList.contains('hidden') : null;
}

// Show all skills cards (for desktop/tablet)
function showAllSkillsCards() {
  getSkillsContainers().forEach(container => {
    container.classList.remove('hidden');
    container.classList.add('block', 'visible');
    container.setAttribute('aria-hidden', 'false');
  });
}

// Initialize mobile state based on screen size
function initializeResponsiveState() {
  if (window.innerWidth < 640) {
    // Mobile - hide all initially
    hideAllSkillsCards();
  } else {
    // Desktop/Tablet - show all
    showAllSkillsCards();
  }
}

// Handle responsive changes - SIMPLIFIE : seulement pour les vrais changements d'ecran
function handleSkillsResize() {
  // Sur mobile, on ne touche JAMAIS aux cartes via resize
  if (window.innerWidth < 640) {
    return; // On fait rien sur mobile
  }
  
  // Desktop/Tablet - show all
  showAllSkillsCards();
}

// EVENT LISTENERS - Listen to avatar events - UTILISE data-skills
document.addEventListener('avatar:skillsToggle', function(e) {
  const { buttonId } = e.detail;
  const skillsName = SKILLS_MAPPING[buttonId];
  
  console.log(`Skills Card: Received event for ${buttonId} -> ${skillsName}`);
  
  if (skillsName) {
    const isCurrentlyVisible = isSkillsCardVisible(skillsName);
    
    // Hide all cards first
    hideAllSkillsCards();
    
    // If current card wasn't visible, show it
    if (!isCurrentlyVisible) {
      showSkillsCard(skillsName);
      console.log(`Showing ${skillsName}`);
    } else {
      console.log(`Was visible, now hidden`);
    }
  }
});

document.addEventListener('avatar:hideAllSkills', function(e) {
  hideAllSkillsCards();
  console.log('Skills Card: Hidden all cards');
});

document.addEventListener('avatar:showAllSkills', function(e) {
  showAllSkillsCards();
  console.log('Skills Card: Shown all cards');
});

// Close button functionality - MIGRE depuis home-layout
function initCloseButtons() {
  getSkillsContainers().forEach(container => {
    const closeButton = container.querySelector('.skills-card-close');
    if (closeButton) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        container.classList.add('hidden');
        container.classList.remove('block', 'visible');
        container.setAttribute('aria-hidden', 'true');
        
        const skillsName = container.getAttribute('data-skills');
        console.log(`Skills Card: Closed ${skillsName} via close button`);
        
        // Focus management after close
        const firstVisibleCard = getSkillsContainers().find(c => !c.classList.contains('hidden'));
        if (firstVisibleCard) {
          firstVisibleCard.focus();
        }
      });
      
      // Keyboard accessibility for close button
      closeButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          closeButton.click();
        }
      });
    }
  });
}

// Fonction globale pour fermeture externe (maintenue pour compatibilite)
function closeSkillsCard(cardName) {
  const container = document.querySelector(`[data-skills="${cardName}"]`);
  if (container) {
    container.classList.add('hidden');
    container.classList.remove('block', 'visible');
    container.setAttribute('aria-hidden', 'true');
    
    console.log(`Skills Card: Closed ${cardName} via external call`);
  }
}

// Export pour utilisation globale (maintenu pour compatibilite)
window.closeSkillsCard = closeSkillsCard;

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  
  // Setup close buttons
  initCloseButtons();
  
  // Initialize responsive state
  initializeResponsiveState();
  
  // Handle window resize - ULTRA SIMPLE
  window.addEventListener('resize', handleSkillsResize);
  
  console.log('Skills Card: Fully autonomous system initialized');
});