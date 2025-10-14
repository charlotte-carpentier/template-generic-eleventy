/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Segmented Control                            │
   │ Tab-like switcher with keyboard navigation              │
   │ Path: src/assets/scripts/components/02-molecules/       │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Segmented control switch functionality
 * @module molecules/segmented-control
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CONFIG = {
    CONTROL_SELECTOR: '[data-segmented-control]',
    SEGMENT_SELECTOR: '[data-segment]',
    ACTIVE_CLASS: 'segment-active',
    DISABLED_CLASS: 'segment-disabled'
  };
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Core Functions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Initialize segmented controls
   * @returns {void}
   */
  export function initSegmentedControl() {
    const controls = document.querySelectorAll(CONFIG.CONTROL_SELECTOR);
    controls.forEach(control => setupSegmentedControl(control));
  }
  
  /**
   * Setup segmented control
   * @param {HTMLElement} control - Segmented control element
   * @returns {void}
   */
  function setupSegmentedControl(control) {
    const segments = control.querySelectorAll(CONFIG.SEGMENT_SELECTOR);
    
    // Setup ARIA
    control.setAttribute('role', 'tablist');
    control.setAttribute('aria-label', control.getAttribute('aria-label') || 'Segmented control');
    
    segments.forEach((segment, index) => {
      const segmentId = segment.id || `segment-${Date.now()}-${index}`;
      const value = segment.getAttribute('data-segment');
      const isDisabled = segment.hasAttribute('data-segment-disabled');
      
      segment.id = segmentId;
      segment.setAttribute('role', 'tab');
      segment.setAttribute('aria-selected', 'false');
      
      if (isDisabled) {
        segment.classList.add(CONFIG.DISABLED_CLASS);
        segment.setAttribute('aria-disabled', 'true');
        segment.setAttribute('tabindex', '-1');
      } else {
        segment.setAttribute('tabindex', '-1');
        
        // Click event
        segment.addEventListener('click', () => {
          selectSegment(control, segment);
        });
      }
    });
    
    // Set initial active segment
    const initialSegment = control.querySelector(`${CONFIG.SEGMENT_SELECTOR}.${CONFIG.ACTIVE_CLASS}`) ||
                           control.querySelector(`${CONFIG.SEGMENT_SELECTOR}:not([data-segment-disabled])`);
    
    if (initialSegment) {
      selectSegment(control, initialSegment, false);
    }
    
    // Keyboard navigation
    control.addEventListener('keydown', (e) => {
      handleSegmentKeydown(e, control);
    });
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Selection
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Select segment
   * @param {HTMLElement} control - Segmented control element
   * @param {HTMLElement} segment - Segment to select
   * @param {boolean} dispatch - Dispatch change event
   * @returns {void}
   */
  function selectSegment(control, segment, dispatch = true) {
    if (segment.hasAttribute('data-segment-disabled')) return;
    
    const segments = control.querySelectorAll(CONFIG.SEGMENT_SELECTOR);
    const value = segment.getAttribute('data-segment');
    
    // Update all segments
    segments.forEach(seg => {
      const isSelected = seg === segment;
      
      seg.classList.toggle(CONFIG.ACTIVE_CLASS, isSelected);
      seg.setAttribute('aria-selected', isSelected);
      seg.setAttribute('tabindex', isSelected ? '0' : '-1');
    });
    
    // Focus selected segment
    segment.focus();
    
    // Dispatch event
    if (dispatch) {
      control.dispatchEvent(new CustomEvent('segment-change', {
        detail: { value, segment },
        bubbles: true
      }));
    }
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Keyboard Navigation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   * @param {HTMLElement} control - Segmented control element
   * @returns {void}
   */
  function handleSegmentKeydown(event, control) {
    const segments = Array.from(control.querySelectorAll(CONFIG.SEGMENT_SELECTOR));
    const enabledSegments = segments.filter(seg => !seg.hasAttribute('data-segment-disabled'));
    const currentIndex = enabledSegments.findIndex(seg => seg === document.activeElement);
    
    if (currentIndex === -1) return;
    
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : enabledSegments.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < enabledSegments.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = enabledSegments.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectSegment(control, enabledSegments[currentIndex]);
        return;
    }
    
    if (newIndex !== currentIndex) {
      selectSegment(control, enabledSegments[newIndex]);
    }
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Public API
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  /**
   * Set active segment by value
   * @param {HTMLElement} control - Segmented control element
   * @param {string} value - Segment value
   * @returns {void}
   */
  export function setActiveSegment(control, value) {
    const segment = control.querySelector(`${CONFIG.SEGMENT_SELECTOR}[data-segment="${value}"]`);
    if (segment) {
      selectSegment(control, segment);
    }
  }
  
  /**
   * Get active segment value
   * @param {HTMLElement} control - Segmented control element
   * @returns {string|null} Active segment value
   */
  export function getActiveSegment(control) {
    const activeSegment = control.querySelector(`.${CONFIG.ACTIVE_CLASS}`);
    return activeSegment ? activeSegment.getAttribute('data-segment') : null;
  }
  
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // May your bugs be forever exiled to the shadow realm ✦
  // Charlotte Carpentier · 2025
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━