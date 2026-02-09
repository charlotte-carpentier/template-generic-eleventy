---
title: ADR-011 - Grid Tokens Architecture
description: Hybrid grid system with Figma tokens and Tailwind utilities
type: architecture-decision
created: 2026-01-29
status: accepted
tags: [adr, grid, tokens, layout, responsive]
---

**ADR**: 011  
**Title**: Grid Tokens Architecture  
**Date**: January 29, 2026  
**Status**: Accepted

---

## Context

HAT uses 12-column grid from HAT Figma Design (1440px viewport, 64px margins, 32px gutter). Need coherent token architecture for responsive sections while maintaining Tailwind flexibility.

---

## Problem

- Figma grid = 12 columns fixed widths, not directly compatible with Tailwind auto-fluid grids
- Design term "margins" vs CSS implementation "padding" confusion
- Content max-width constraints need to respect grid proportions
- Balance between strict grid adherence and responsive flexibility

---

## Decision

**Hybrid architecture:** Figma grid tokens for structure + Tailwind native for layouts.

**Token nomenclature:** `namespace-scope-size`

- Namespace: `grid-*` (all grid-related)
- Scope: `margin` | `workzone` | `gutter` | `col`
- Size: Responsive suffix or column count

**Implementation:**

### Tokens kept (input.css)

```css
/* Layout Grid - Primitives */
--grid-margin-mobile: 16px;   /* Grid margins (design term, CSS padding) */
--grid-margin-desktop: 64px;
--grid-gutter: 32px;

/* Layout Grid - Tokens */
--grid-workzone-mobile: calc((var(--viewport-min) * 16) - (2 * var(--grid-margin-mobile)));
--grid-workzone-desktop: calc((var(--viewport-max) * 16) - (2 * var(--grid-margin-desktop)));

/* Column widths - Desktop (12-col) */
--grid-col-12: calc((var(--grid-workzone-desktop) - (11 * var(--grid-gutter))) / 12);
--grid-col-6: calc((var(--grid-workzone-desktop) - (5 * var(--grid-gutter))) / 6);
--grid-col-4: calc((var(--grid-workzone-desktop) - (3 * var(--grid-gutter))) / 4);
--grid-col-3: calc((var(--grid-workzone-desktop) - (2 * var(--grid-gutter))) / 3);
--grid-col-2: calc((var(--grid-workzone-desktop) - (1 * var(--grid-gutter))) / 2);
--grid-col-1: var(--grid-workzone-desktop);

/* Column widths - Mobile (2-col) */
--grid-col-mobile-2: calc((var(--grid-workzone-mobile) - (1 * var(--grid-gutter))) / 2);
--grid-col-mobile-1: var(--grid-workzone-mobile);
```

### Pattern sections organisms

```njk
{# Level 1: Section - Grid margins (CSS padding) #}
{% set sectionClasses = "px-[var(--grid-margin-mobile)] md:px-[var(--grid-margin-desktop)] py-[...]" %}

{# Level 2: Container - Workzone centered #}
{% set containerClasses = "w-full max-w-[var(--grid-workzone-mobile)] md:max-w-[var(--grid-workzone-desktop)] mx-auto" %}

{# Level 3: Layout - Tailwind native grid #}
{% set gridClasses = "grid grid-cols-1 md:grid-cols-2 gap-[var(--grid-gutter)]" %}
```

### Tokens removed

```css
/* REMOVED: --spacing-section-fluid-x (replaced by --grid-margin-*) */
```

**Rationale:**

1. **Resilience:** Change 1-3 primitives => all tokens recalculate automatically
2. **Clarity:** Namespace system = clear usage intent
3. **Standards:** "Grid margins" = industry term (Material Design, USWDS)
4. **Flexibility:** Tailwind `grid-cols-X` for simple layouts, `--grid-col-*` for max-width constraints

---

## Consequences

**Positive:**

- Grid tokens respect Figma system exactly
- Zero refactoring if grid parameters change
- Clear separation: structure tokens vs layout utilities
- `max-w-[var(--grid-col-X)]` maintains grid proportions for content

**Negative:**

- "Margin" term confusing for developers unfamiliar with design systems
- Column tokens unused for most layouts (reserved for max-width)

**Mitigation:**

- Document "grid margins" convention in this ADR
- Examples show when to use column tokens vs Tailwind native

---

## Usage Patterns

| Use Case | Solution | Example |
|----------|----------|---------|
| Section margins | `--grid-margin-*` | `px-[var(--grid-margin-mobile)]` |
| Centered container | `--grid-workzone-*` | `max-w-[var(--grid-workzone-desktop)]` |
| Column gaps | `--grid-gutter` | `gap-[var(--grid-gutter)]` |
| 2-3 equal columns | Tailwind native | `grid-cols-1 md:grid-cols-2` |
| Content max-width | `--grid-col-*` | `max-w-[var(--grid-col-6)]` |
| Prose text | Tailwind native | `max-w-prose` (65ch) |

---

## Alternatives Considered

**Option A - Strict 12-col system everywhere:**

- Pros: Perfect Figma alignment
- Cons: Verbose (`grid-template-columns: var(--grid-col-6) var(--grid-col-6)`), inflexible
- Rejected: Over-engineering for simple 2-3 column layouts

**Option B - Semantic content tokens:**

- Pros: Clear intent (`--content-prose-max`, `--content-form-max`)
- Cons: Decoupled from grid, values become inconsistent if grid changes
- Rejected: Breaks single source of truth

**Option C - Rename `margin` => `padding`:**

- Pros: Technical accuracy
- Cons: Breaks design vocabulary (Figma uses "margins")
- Rejected: Industry standard uses "margins" as design term

---

## References

**Sources:**

- [Material Design - Responsive UI](https://m1.material.io/layout/responsive-ui.html)
- [USWDS - Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/)
- [MDN - CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)

**Related ADR:**

- [ADR-004: Breakpoints Strategy](./004-breakpoints.md)
- [ADR-009: Spacing Tokens Architecture](./009-spacing-tokens-architecture.md)

**Related documentation:**

- [tailwind.md](./tailwind.md) - Design tokens usage
- [coding-style.md](./coding-style.md) - Naming conventions

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
