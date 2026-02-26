---
title: Styling Components
description: Customizing design tokens for client projects
created: 2025-01-15
---

Read this to know how to customize the visual style of a client project — from design tokens to component templates.

---

## File Structure

```text
src/assets/styles/
├── 01-atoms/              # Custom CSS when needed
├── 02-molecules/
├── 03-organisms/
└── input.css              # Entry point + @theme tokens, modify this for your project
```

Most components have no CSS file - styling done with Tailwind in `.njk` templates.

---

## Component Styling Rules

**CRITICAL**: When modifying component styles (primitives, tokens, or templates), verify compliance with [Accessibility Standards](../01-starting/03-accessibility-standards.md) - contrast ratios, touch targets, and text readability.

| Level | Handles | Does NOT Handle |
| ----- | ------- | --------------- |
| **Atoms** | Padding, colors, variants, states | External margin |
| **Molecules** | Internal layout (flex/grid), gap between atoms | External margin |
| **Organisms** | Section layouts, responsive, spacing between molecules | External margin |

**Key principle**: Components manage internal spacing (padding), never external spacing (margin). Parent controls spacing with `gap`.

---

## Customization Workflow

HAT uses a 3-level token system: **Primitives** => **Tokens** => **Components**

Customize from left to right: modify primitives first, then tokens if needed, then templates rarely.

### Level 1: Modify Primitives

**Always start here** - Change base values in `src/assets/styles/input.css` under `@theme`:

```css
/* Colors */
--color-brand-primary-30: #6D6755; /* <= Change this */

/* Spacing */
--spacing-16: 64px; /* <= Change this */

/* Typography */
--font-family-sans: system-ui, sans-serif; /* <= Change this */
```

Tokens using these primitives update automatically.

**Example - Sophrology project**:

```css
--color-brand-primary-30: #4A7C59; /* Calm green */
--spacing-section-default: 80px; /* More spacious */
```

### Level 2: Adjust Tokens (Optional)

**If primitives alone aren't enough** - Reassign tokens:

```css
/* Use different primitive shade */
--color-button-primary: var(--color-brand-primary-40);

/* Or different semantic color */
--color-button-primary: var(--color-semantic-success-20);
```

### Level 3: Modify Templates (Optional)

**When tokens need project-specific adjustments** - Modify Tailwind classes in `.njk`:

```njk
{# Use Tailwind native class #}
{% set baseClasses = "bg-white text-gray-900" %}

{# Or different token #}
{% set baseClasses = "bg-[var(--color-semantic-information-40)]" %}
```

---

## Custom CSS (Rare)

Only create custom CSS when Tailwind insufficient (animations, pseudo-elements, advanced selectors).

**BEM naming**:

```css
.error-layout { }              /* Block */
.error-layout__header { }      /* Element */
.error-layout--dark { }        /* Modifier */
```

Import in `input.css`:

```css
@import "./03-organisms/modal.css";
```

---

## Build Commands

After modifying `input.css`:

```bash
npm run build:css    # Build once
npm run watch:css    # Watch mode
```

Output: `public/output.css` (auto-included in pages).

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
