/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Segmented Control                            │
   │ Button group switcher with keyboard navigation          │
   └─────────────────────────────────────────────────────────┘ */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELECTOR_CONTROL = '[data-segmented-type="segmented-control"]';
const SELECTOR_SEGMENT = 'button';
const CLASS_ACTIVE = 'segment-active';
const CLASS_DISABLED = 'segment-disabled';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize segmented controls
 * @returns {void}
 */
export const initSegmentedControl = () => {
  document.querySelectorAll(SELECTOR_CONTROL).forEach(setupSegmentedControl);
};

/**
 * Setup segmented control
 * @param {HTMLElement} control - Segmented control element
 * @returns {void}
 */
const setupSegmentedControl = (control) => {
  const segments = control.querySelectorAll(SELECTOR_SEGMENT);

  control.setAttribute('role', 'group');
  control.setAttribute('aria-label', control.getAttribute('aria-label') ?? 'Segmented control');

  segments.forEach((segment, index) => {
    const { id: segmentId = `segment-${Date.now()}-${index}` } = segment;
    const isDisabled = segment.disabled;

    segment.id = segmentId;

    if (!isDisabled) {
      segment.addEventListener('click', () => selectSegment(control, segment));
    }
  });

  const initialSegment = control.querySelector(`.${CLASS_ACTIVE}`) ||
                         control.querySelector(`${SELECTOR_SEGMENT}:not(:disabled)`);

  if (initialSegment) {
    selectSegment(control, initialSegment, false);
  }

  control.addEventListener('keydown', (e) => handleSegmentKeydown(e, control));
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Selection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Select segment
 * @param {HTMLElement} control - Segmented control element
 * @param {HTMLElement} segment - Segment to select
 * @param {boolean} dispatch - Dispatch change event
 * @returns {void}
 */
const selectSegment = (control, segment, dispatch = true) => {
  if (segment.disabled) return;

  const segments = control.querySelectorAll(SELECTOR_SEGMENT);
  const value = segment.dataset.segmentValue ?? segment.textContent.trim();

  segments.forEach(seg => {
    const isSelected = seg === segment;
    seg.classList.toggle(CLASS_ACTIVE, isSelected);
    seg.setAttribute('aria-pressed', isSelected);
  });

  segment.focus();

  if (dispatch) {
    control.dispatchEvent(new CustomEvent('segment-change', {
      detail: { value, segment },
      bubbles: true
    }));
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Keyboard Navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 * @param {HTMLElement} control - Segmented control element
 * @returns {void}
 */
const handleSegmentKeydown = (event, control) => {
  const segments = Array.from(control.querySelectorAll(SELECTOR_SEGMENT));
  const enabledSegments = segments.filter(seg => !seg.disabled);
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
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Public API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Set active segment by value
 * @param {HTMLElement} control - Segmented control element
 * @param {string} value - Segment value
 * @returns {void}
 */
export const setActiveSegment = (control, value) => {
  const segment = control.querySelector(`${SELECTOR_SEGMENT}[data-segment-value="${value}"]`);
  if (segment) {
    selectSegment(control, segment);
  }
};

/**
 * Get active segment value
 * @param {HTMLElement} control - Segmented control element
 * @returns {string|null} Active segment value
 */
export const getActiveSegment = (control) => {
  const activeSegment = control.querySelector(`.${CLASS_ACTIVE}`);
  return activeSegment?.dataset.segmentValue ?? activeSegment?.textContent.trim() ?? null;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
