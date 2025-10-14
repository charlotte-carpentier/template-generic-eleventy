/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Panel                                        │
   │ Accordion/collapsible panel with ARIA support           │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Accordion panel functionality
 * @module molecules/panel
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    PANEL_SELECTOR: '[data-panel]',
    TRIGGER_SELECTOR: '[data-panel-trigger]',
    CONTENT_SELECTOR: '[data-panel-content]',
    GROUP_SELECTOR: '[data-panel-group]',
    EXPANDED_CLASS: 'panel-expanded',
    COLLAPSED_CLASS: 'panel-collapsed',
    TRANSITION_DURATION: 300
  };
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Core Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Initialize panels
   * @returns {void}
   */
  export function initPanel() {
    const panels = document.querySelectorAll(CONFIG.PANEL_SELECTOR);
    panels.forEach(panel => setupPanel(panel));
  }
  
  /**
   * Setup panel element
   * @param {HTMLElement} panel - Panel element
   * @returns {void}
   */
  function setupPanel(panel) {
    const trigger = panel.querySelector(CONFIG.TRIGGER_SELECTOR);
    const content = panel.querySelector(CONFIG.CONTENT_SELECTOR);
    
    if (!trigger || !content) return;
    
    // Generate IDs if not present
    const panelId = panel.id || `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const contentId = content.id || `${panelId}-content`;
    
    panel.id = panelId;
    content.id = contentId;
    
    // Setup ARIA
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-controls', contentId);
    trigger.setAttribute('tabindex', '0');
    
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', trigger.id || `${panelId}-trigger`);
    
    if (!trigger.id) {
      trigger.id = `${panelId}-trigger`;
    }
    
    // Get initial state
    const isExpanded = panel.hasAttribute('data-panel-expanded');
    
    if (isExpanded) {
      expandPanel(panel, false);
    } else {
      collapsePanel(panel, false);
    }
    
    // Attach events
    trigger.addEventListener('click', () => togglePanel(panel));
    
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel(panel);
      }
    });
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Expand/Collapse
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Toggle panel
   * @param {HTMLElement} panel - Panel element
   * @returns {void}
   */
  export function togglePanel(panel) {
    const isExpanded = panel.classList.contains(CONFIG.EXPANDED_CLASS);
    
    if (isExpanded) {
      collapsePanel(panel);
    } else {
      expandPanel(panel);
    }
  }
  
  /**
   * Expand panel
   * @param {HTMLElement} panel - Panel element
   * @param {boolean} animated - Enable animation
   * @returns {void}
   */
  export function expandPanel(panel, animated = true) {
    const trigger = panel.querySelector(CONFIG.TRIGGER_SELECTOR);
    const content = panel.querySelector(CONFIG.CONTENT_SELECTOR);
    
    if (!trigger || !content) return;
    
    // Check if part of exclusive group
    const group = panel.closest(CONFIG.GROUP_SELECTOR);
    if (group && group.hasAttribute('data-panel-exclusive')) {
      collapseGroupPanels(group, panel);
    }
    
    // Update classes
    panel.classList.add(CONFIG.EXPANDED_CLASS);
    panel.classList.remove(CONFIG.COLLAPSED_CLASS);
    panel.setAttribute('data-panel-expanded', 'true');
    
    // Update ARIA
    trigger.setAttribute('aria-expanded', 'true');
    content.setAttribute('aria-hidden', 'false');
    
    // Animate expansion
    if (animated) {
      content.style.height = '0px';
      content.style.overflow = 'hidden';
      content.style.display = 'block';
      
      requestAnimationFrame(() => {
        const height = content.scrollHeight;
        content.style.height = `${height}px`;
        
        setTimeout(() => {
          content.style.height = '';
          content.style.overflow = '';
        }, CONFIG.TRANSITION_DURATION);
      });
    } else {
      content.style.display = 'block';
    }
    
    // Dispatch event
    panel.dispatchEvent(new CustomEvent('panel-expand', { bubbles: true }));
  }
  
  /**
   * Collapse panel
   * @param {HTMLElement} panel - Panel element
   * @param {boolean} animated - Enable animation
   * @returns {void}
   */
  export function collapsePanel(panel, animated = true) {
    const trigger = panel.querySelector(CONFIG.TRIGGER_SELECTOR);
    const content = panel.querySelector(CONFIG.CONTENT_SELECTOR);
    
    if (!trigger || !content) return;
    
    // Update classes
    panel.classList.remove(CONFIG.EXPANDED_CLASS);
    panel.classList.add(CONFIG.COLLAPSED_CLASS);
    panel.removeAttribute('data-panel-expanded');
    
    // Update ARIA
    trigger.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');
    
    // Animate collapse
    if (animated) {
      const height = content.scrollHeight;
      content.style.height = `${height}px`;
      content.style.overflow = 'hidden';
      
      requestAnimationFrame(() => {
        content.style.height = '0px';
        
        setTimeout(() => {
          content.style.display = 'none';
          content.style.height = '';
          content.style.overflow = '';
        }, CONFIG.TRANSITION_DURATION);
      });
    } else {
      content.style.display = 'none';
    }
    
    // Dispatch event
    panel.dispatchEvent(new CustomEvent('panel-collapse', { bubbles: true }));
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Group Management
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Collapse all panels in group except one
   * @param {HTMLElement} group - Panel group element
   * @param {HTMLElement} exceptPanel - Panel to keep expanded
   * @returns {void}
   */
  function collapseGroupPanels(group, exceptPanel) {
    const panels = group.querySelectorAll(CONFIG.PANEL_SELECTOR);
    panels.forEach(panel => {
      if (panel !== exceptPanel) {
        collapsePanel(panel);
      }
    });
  }
  
  /**
   * Expand all panels in group
   * @param {HTMLElement} group - Panel group element
   * @returns {void}
   */
  export function expandAllPanels(group) {
    const panels = group.querySelectorAll(CONFIG.PANEL_SELECTOR);
    panels.forEach(panel => expandPanel(panel));
  }
  
  /**
   * Collapse all panels in group
   * @param {HTMLElement} group - Panel group element
   * @returns {void}
   */
  export function collapseAllPanels(group) {
    const panels = group.querySelectorAll(CONFIG.PANEL_SELECTOR);
    panels.forEach(panel => collapsePanel(panel));
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // May your bugs be forever exiled to the shadow realm ✦
  // Charlotte Carpentier · 2025
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━