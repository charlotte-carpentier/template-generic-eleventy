/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Slider                                       │
   │ Custom range slider with drag handles                   │
   └─────────────────────────────────────────────────────────┘ */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const SELECTOR_SLIDER = '[data-slider-name]';
const SELECTOR_TRACK = '[data-slider-track]';
const SELECTOR_FILL = '[data-slider-fill]';
const SELECTOR_HANDLE = '[data-slider-handle]';
const SELECTOR_INDICATOR = '[data-slider-indicator]';

const EVENT_CHANGE = 'slider-change';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize all sliders
 * @returns {void}
 */
export const initSlider = () => {
  document.querySelectorAll(SELECTOR_SLIDER).forEach(setupSlider);
};

/**
 * Setup single slider
 * @param {HTMLElement} slider - Slider container
 * @returns {void}
 */
const setupSlider = (slider) => {
  const { sliderType: type, sliderMin, sliderMax, sliderStep } = slider.dataset;
  const min = parseFloat(sliderMin);
  const max = parseFloat(sliderMax);
  const step = parseFloat(sliderStep);

  let initialValues;
  if (type === 'single') {
    const valueStr = slider.dataset.sliderValue;
    initialValues = valueStr ? [parseFloat(valueStr)] : [min];
  } else {
    const minStr = slider.dataset.sliderValueMin;
    const maxStr = slider.dataset.sliderValueMax;
    initialValues = [
      minStr ? parseFloat(minStr) : min,
      maxStr ? parseFloat(maxStr) : max
    ];
  }

  const track = slider.querySelector(SELECTOR_TRACK);
  const fill = slider.querySelector(SELECTOR_FILL);
  const handles = slider.querySelectorAll(SELECTOR_HANDLE);

  if (!track || !fill || handles.length === 0) return;

  const state = {
    type,
    min,
    max,
    step,
    values: initialValues,
    isDragging: false,
    activeHandle: null
  };

  handles.forEach((handle, index) => {
    handle.addEventListener('mousedown', (e) => startDrag(e, index, slider, track, fill, handles, state));
    handle.addEventListener('touchstart', (e) => startDrag(e, index, slider, track, fill, handles, state), { passive: false });
    handle.addEventListener('keydown', (e) => handleKeyboard(e, index, slider, track, fill, handles, state));
  });

  updateSliderUI(slider, track, fill, handles, state);
};

/**
 * Start drag operation
 * @param {Event} e - Mouse/touch event
 * @param {number} handleIndex - Handle index
 * @param {HTMLElement} slider - Slider container
 * @param {HTMLElement} track - Track element
 * @param {HTMLElement} fill - Fill element
 * @param {NodeList} handles - Handle elements
 * @param {Object} state - Slider state
 * @returns {void}
 */
const startDrag = (e, handleIndex, slider, track, fill, handles, state) => {
  e.preventDefault();
  state.isDragging = true;
  state.activeHandle = handleIndex;

  const moveHandler = (moveEvent) => onDrag(moveEvent, handleIndex, slider, track, fill, handles, state);
  const endHandler = () => {
    state.isDragging = false;
    state.activeHandle = null;
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', endHandler);
    document.removeEventListener('touchmove', moveHandler);
    document.removeEventListener('touchend', endHandler);
  };

  document.addEventListener('mousemove', moveHandler);
  document.addEventListener('mouseup', endHandler);
  document.addEventListener('touchmove', moveHandler, { passive: false });
  document.addEventListener('touchend', endHandler);
};

/**
 * Handle drag movement
 * @param {Event} e - Mouse/touch event
 * @param {number} handleIndex - Handle index
 * @param {HTMLElement} slider - Slider container
 * @param {HTMLElement} track - Track element
 * @param {HTMLElement} fill - Fill element
 * @param {NodeList} handles - Handle elements
 * @param {Object} state - Slider state
 * @returns {void}
 */
const onDrag = (e, handleIndex, slider, track, fill, handles, state) => {
  const clientX = e.touches?.[0]?.clientX ?? e.clientX;
  const rect = track.getBoundingClientRect();
  const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));

  let newValue = state.min + (percentage / 100) * (state.max - state.min);
  newValue = Math.round(newValue / state.step) * state.step;

  if (state.type === 'range') {
    newValue = handleIndex === 0
      ? Math.min(newValue, state.values[1])
      : Math.max(newValue, state.values[0]);
  }

  state.values[handleIndex] = newValue;
  updateSliderUI(slider, track, fill, handles, state);

  slider.dispatchEvent(new CustomEvent(EVENT_CHANGE, {
    detail: {
      value: state.type === 'single' ? state.values[0] : state.values,
      handleIndex
    },
    bubbles: true
  }));
};

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} e - Keyboard event
 * @param {number} handleIndex - Handle index
 * @param {HTMLElement} slider - Slider container
 * @param {HTMLElement} track - Track element
 * @param {HTMLElement} fill - Fill element
 * @param {NodeList} handles - Handle elements
 * @param {Object} state - Slider state
 * @returns {void}
 */
const handleKeyboard = (e, handleIndex, slider, track, fill, handles, state) => {
  const currentValue = state.values[handleIndex];
  let newValue = currentValue;

  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      e.preventDefault();
      newValue = Math.max(state.min, currentValue - state.step);
      break;
    case 'ArrowRight':
    case 'ArrowUp':
      e.preventDefault();
      newValue = Math.min(state.max, currentValue + state.step);
      break;
    case 'Home':
      e.preventDefault();
      newValue = state.min;
      break;
    case 'End':
      e.preventDefault();
      newValue = state.max;
      break;
    case 'PageUp':
      e.preventDefault();
      newValue = Math.min(state.max, currentValue + state.step * 10);
      break;
    case 'PageDown':
      e.preventDefault();
      newValue = Math.max(state.min, currentValue - state.step * 10);
      break;
    default:
      return;
  }

  if (state.type === 'range') {
    newValue = handleIndex === 0
      ? Math.min(newValue, state.values[1])
      : Math.max(newValue, state.values[0]);
  }

  state.values[handleIndex] = newValue;
  updateSliderUI(slider, track, fill, handles, state);

  slider.dispatchEvent(new CustomEvent(EVENT_CHANGE, {
    detail: {
      value: state.type === 'single' ? state.values[0] : state.values,
      handleIndex
    },
    bubbles: true
  }));
};

/**
 * Update slider UI
 * @param {HTMLElement} slider - Slider container
 * @param {HTMLElement} track - Track element
 * @param {HTMLElement} fill - Fill element
 * @param {NodeList} handles - Handle elements
 * @param {Object} state - Slider state
 * @returns {void}
 */
const updateSliderUI = (slider, track, fill, handles, state) => {
  const { min, max, values, type } = state;

  const percent1 = ((values[0] - min) / (max - min)) * 100;
  const percent2 = type === 'range' ? ((values[1] - min) / (max - min)) * 100 : 0;

  if (type === 'single') {
    fill.style.left = '0%';
    fill.style.width = `${percent1}%`;
  } else {
    fill.style.left = `${percent1}%`;
    fill.style.width = `${percent2 - percent1}%`;
  }

  handles.forEach((handle, index) => {
    const percent = index === 0 ? percent1 : percent2;
    const value = values[index];

    handle.style.left = `${percent}%`;
    handle.setAttribute('aria-valuenow', value);

    const indicator = handle.querySelector(SELECTOR_INDICATOR);
    if (indicator) {
      indicator.textContent = value;
    }
  });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Public API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Set slider value programmatically
 * @param {HTMLElement} slider - Slider container
 * @param {number|number[]} value - New value(s)
 * @returns {void}
 */
export const setSliderValue = (slider, value) => {
  const { sliderType: type, sliderMin, sliderMax, sliderStep } = slider.dataset;
  const track = slider.querySelector(SELECTOR_TRACK);
  const fill = slider.querySelector(SELECTOR_FILL);
  const handles = slider.querySelectorAll(SELECTOR_HANDLE);

  if (!track || !fill || handles.length === 0) return;

  const state = {
    type,
    min: parseFloat(sliderMin),
    max: parseFloat(sliderMax),
    step: parseFloat(sliderStep),
    values: Array.isArray(value) ? value : [value]
  };

  updateSliderUI(slider, track, fill, handles, state);
};

/**
 * Get slider value
 * @param {HTMLElement} slider - Slider container
 * @returns {number|number[]|null} Current value(s)
 */
export const getSliderValue = (slider) => {
  const { sliderType: type } = slider.dataset;
  const handles = slider.querySelectorAll(SELECTOR_HANDLE);

  if (handles.length === 0) return null;

  const values = Array.from(handles).map(handle =>
    parseFloat(handle.getAttribute('aria-valuenow'))
  );

  return type === 'single' ? values[0] : values;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
