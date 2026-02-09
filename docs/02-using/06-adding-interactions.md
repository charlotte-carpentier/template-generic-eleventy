---
title: JavaScript Guide
description: Guide for working with JavaScript in HAT
type: documentation
created: 2025-01-15
tags: [javascript, es6, modules]
---

## Version

**ES6+ Modern JavaScript** (2025 Standards)

---

## Module System

### File Structure

```text
src/assets/scripts/
├── main.js
├── components/
│   ├── 01-atoms/
│   │   ├── input.js
│   │   └── tooltip.js
│   ├── 02-molecules/
│   │   ├── toast.js
│   │   └── panel.js
│   └── 03-organisms/
│       ├── header.js
│       └── modal.js
└── utils/
    ├── dismiss.js
    ├── debounce.js
    └── active-link.js
```

### Import/Export Patterns

**Named exports (preferred):**

```javascript
// utils/dismiss.js
export const attachDismiss = (element, options) => {};
export const dismiss = (element, options) => {};

// main.js
import { attachDismiss, dismiss } from './utils/dismiss.js';
```

**Default exports (components only):**

```javascript
// components/02-molecules/toast.js
export function initToast() {}
export default initToast;

// main.js
import { initToast } from './components/02-molecules/toast.js';
```

## Configuration Pattern

### Constants Organization (2025 Standard)

**Always use top-level constants:**

```javascript
// GOOD: Top-level constants
const SELECTOR_MODAL = '[data-modal-type="modal"]';
const SELECTOR_FOOTER = '[data-modal-footer]';
const MAX_TOASTS = 3;
const DEFAULT_DURATION = 5000;
```

**Avoid function-scoped constants:**

```javascript
// BAD: Constants inside functions (wrong scope)
function initModal() {
  const SELECTOR_MODAL = '[data-modal-type="modal"]'; // ← Inaccessible outside
  const modals = document.querySelectorAll(SELECTOR_MODAL);
}

// GOOD: Top-level (accessible everywhere in module)
const SELECTOR_MODAL = '[data-modal-type="modal"]';

function initModal() {
  const modals = document.querySelectorAll(SELECTOR_MODAL);
}
```

**Naming Convention:**

- Selectors: `SELECTOR_*` (e.g., `SELECTOR_BUTTON`)
- Classes: `CLASS_*` (e.g., `CLASS_ACTIVE`)
- Events: `EVENT_*` (e.g., `EVENT_CHANGE`)
- Values: Direct uppercase (e.g., `MAX_ITEMS`, `DEFAULT_DELAY`)

**Usage:**

```javascript
const modals = document.querySelectorAll(SELECTOR_MODAL);
element.classList.add(CLASS_ACTIVE);
```

---

## Initialization Pattern

### Conditional Loading

Components initialize only if DOM elements exist:

```javascript
// main.js
function initComponents() {
  if (document.querySelector('[data-tooltip]')) {
    initTooltip();
  }
  
  if (document.querySelector('[data-modal]')) {
    initModal();
  }
}

document.addEventListener('DOMContentLoaded', initComponents);
```

### Data Attributes

All components use `data-*` attributes for JavaScript hooks:

```html
<!-- Good: Semantic data attributes -->
<button data-dismiss>Close</button>
<div data-modal-name="confirm">...</div>

<!-- Bad: Class-based selectors -->
<button class="js-close">Close</button>
```

---

## Modern ES6+ Syntax

### Required Standards

```javascript
// const/let (never var)
const CONFIG = { duration: 300 };
let isActive = false;

// Arrow functions
const dismiss = (element) => element.remove();

// Template literals
const id = `toast-${Date.now()}`;

// Destructuring (with fallbacks for robustness)
const { duration, variant = 'default' } = options;

// Optional chaining
config.onDismiss?.(element);

// Nullish coalescing
const delay = duration ?? 300;

// Async/await
await dismiss(element);
```

**Destructuring best practices:**

```javascript
// BAD: No fallback, value can be undefined
const { panelVariant: variant } = panel.dataset;

// GOOD: Explicit fallback with OR operator
const variant = panel.dataset.panelVariant || 'simple';
```

---

## Event System

### Native Events

Use `Event` for simple notifications:

```javascript
element.dispatchEvent(new Event('dismiss', { bubbles: true }));
```

### Custom Events (avoid)

Only use `CustomEvent` if complex payload required:

```javascript
// Rarely needed - prefer simple Events
element.dispatchEvent(
  new CustomEvent('toast-show', { 
    detail: { message, type },
    bubbles: true 
  })
);
```

---

## Event Delegation Pattern

### When to Use

Use event delegation for utilities that handle multiple similar elements:

```javascript
// GOOD: Event delegation for utilities
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-dismiss]')) {
    const target = e.target.closest('[data-dismissible]');
    if (target) dismiss(target);
  }
});
```

**Benefits:**

- Single listener vs hundreds
- Works with dynamic content automatically
- Better performance and memory usage
- Industry standard pattern (2025)

### When NOT to Use

Use direct binding for component-specific logic:

```javascript
// GOOD: Direct binding for single element with complex state
const slider = document.querySelector('[data-slider]');
slider.addEventListener('input', handleSliderChange);
```

**Use direct binding when:**

- Single element only
- Complex state management required
- Performance-critical interactions (60fps animations)
- Component-specific logic

### Pattern Guidelines

**Utilities:** Event delegation on `document`  
**Components:** Direct binding on specific elements

---

## Animation Patterns

### Web Animations API

Use native `element.animate()` with Promises:

```javascript
const animateOut = async (element) => {
  element.classList.add('is-hidden');
  
  const animations = element.getAnimations();
  if (animations.length > 0) {
    await Promise.all(animations.map(a => a.finished));
  } else {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};
```

---

## Utilities vs Components

### When to create a utility

**Create utility if:**

- Used by 3+ components
- Standard industry pattern (dismiss, debounce, sort, filter)
- Logic independent of HTML structure

**Keep as component-specific if:**

- Tightly coupled to component structure
- Unique interaction pattern
- Complex DOM manipulation specific to one component

### Example: dismiss.js utility

```javascript
// Reusable across: chip-notification, tag, disclaimer, list-group, toast
import { dismiss } from '@utils/dismiss';

await dismiss(element, { 
  hideClass: 'fade-out',
  duration: 500 
});
```

---

## References

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [ES6+ Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
