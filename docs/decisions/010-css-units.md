---
title: ADR-010 - CSS Units Strategy
description: Pixel, rem, and em usage rules for design tokens
type: architecture-decision
created: 2026-01-28
status: accepted
tags: [adr, css, units, tokens, accessibility]
---

**ADR**: 010  
**Title**: CSS Units Strategy  
**Date**: January 28, 2026  
**Status**: Accepted

---

## Context

HAT uses multiple CSS units (px, rem, em) in design tokens. Need clear rules on which unit to use where to ensure accessibility (WCAG 2.2 AA) and visual consistency.

---

## Problem

- When to use px vs rem vs em?
- How to maintain WCAG compliance (zoom support)?
- How to ensure visual precision where needed?

---

## Decision

**Use units based on context:**

| Context | Unit | Reason |
|---------|------|--------|
| **Typography sizes** | rem | WCAG zoom support (200%) |
| **Spacing/Layout** | px | Visual precision, consistent spacing |
| **Border radius** | px | Visual precision |
| **Letter spacing** | em | Relative to font-size |
| **Viewport (clamp)** | rem | Zoom support in fluid calculations |

**Implementation:**

```css
/* Typography - rem */
--font-size-base: 1rem;
--font-size-fluid-h1: clamp(2.25rem, ..., 3rem);

/* Spacing - px */
--spacing-4: 16px;
--grid-gutter: 32px;

/* Border radius - px */
--radius-8: 8px;

/* Letter spacing - em */
--letter-spacing-wide: 0.025em;

/* Viewport - rem */
--viewport-min: 20rem;  /* 320px base, scales with zoom */
```

---

## Consequences

**Positive:**

- WCAG 2.2 AA compliant (typography zoom)
- Predictable spacing (px precision)
- Clear usage rules

**Negative:**

- Mixed units require understanding context
- Requires team training

**Mitigation:**

- Document rules in comments
- Code review enforcement

---

## References

- [WCAG 2.2 - 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [Material Design 3 - Units](https://m3.material.io/)
- [Tailwind CSS v4 - Default Units](https://tailwindcss.com/docs)

**Related ADR:**

- [ADR-002: Fluid Typography Strategy](./002-fluid-typography.md)

---

May your bugs be forever exiled to the shadow realm ✦
