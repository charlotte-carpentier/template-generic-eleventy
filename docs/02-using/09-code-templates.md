---
title: Code Examples
description: Complete code examples following the coding style guide
type: documentation
created: 2025-01-15
tags: [examples, style-guide, conventions]
---

**Companion to**: [coding-style.md](./coding-style.md)  
**Version**: 3.0.0

Complete code examples following the coding style guide.

---

## JavaScript

```javascript
/* ┌─────────────────────────────────────────────────────────┐
   │ MOLECULE › Caption                                      │
   │ Desktop tooltip with smart positioning                  │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Tooltip system for desktop (lg: 1024px+)
 * @module molecules/caption
 * @created 2025-01-15
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TOOLTIP = {
  BREAKPOINT: 1024,
  MARGIN:     20,
  OFFSET:     15
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Initialize tooltip system
 * @returns {void}
 */
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(tooltip => attachTooltip(tooltip));
}

export { initTooltips };


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Nunjucks

```njk
{# ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Button                                           │
   │ Interactive button with variants and states             │
   └─────────────────────────────────────────────────────────┘ #}

{#
  Props:
    - option.name (string): Button identifier
    - option.datas (array): Button configurations
    - option.disabled (boolean): Override disabled state
  
  Usage — Summon HAT Components Wisely:
    {% from "01-atoms/button.njk" import renderButton %}
    {{ renderButton({ name: "demo", datas: atoms.button.buttons }) }}
  
  @created 2025-01-15
#}

{% macro renderButton(option) %}
  {% set buttonData = option.datas | findByName(option.name) %}
  
  {% if buttonData %}
    <button
      type="{{ buttonData.type | default('button') }}"
      class="btn btn-{{ buttonData.variant | default('primary') }}"
      {% if option.disabled or buttonData.disabled %}disabled{% endif %}
      {% if buttonData.ariaLabel %}aria-label="{{ buttonData.ariaLabel }}"{% endif %}
    >
      {{ buttonData.label }}
    </button>
  {% endif %}
{% endmacro %}
```

---

## CSS

```css
/* ┌─────────────────────────────────────────────────────────┐
   │ ATOM › Button                                           │
   │ Interactive button styles                               │
   └─────────────────────────────────────────────────────────┘ */

/*
 * Component: button
 * Type: atom
 * Dependencies: TailwindCSS v4.x
 * @created 2025-01-15
 */

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## JSON

```json
{
  "// Component": "Button - Interactive button with variants and states",
  
  "_meta": {
    "component": "button",
    "type": "atom",
    "version": "1.0.0",
    "created": "2025-01-15"
  },
  
  "buttons": [
    {
      "name": "primaryCta",
      "type": "button",
      "variant": "primary",
      "label": "Get Started",
      "ariaLabel": "Start your journey"
    }
  ]
}
```

---

## Markdown

```markdown
---
title: Button Component
description: Interactive button with variants and states
type: documentation
created: 2025-01-15
tags: [component, atom]
---

Interactive element following WCAG 2.2 AA guidelines.
```

---

## Usage Guide Template

```javascript
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Usage Guide
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Import:  import { initTooltips } from './caption.js';
Call:    initTooltips();
Notes:   Desktop only (lg: 1024px+)

May your bugs be forever exiled to the shadow realm ✦
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
```

---

**May your bugs be forever exiled to the shadow realm ✦**  
HAT · 2026
