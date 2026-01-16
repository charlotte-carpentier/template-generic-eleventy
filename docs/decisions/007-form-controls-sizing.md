---
title: ADR-007 - Form Controls Sizing Strategy
description: Static 48px height for all form inputs (select, text, textarea)
type: architecture-decision
created: 2026-01-16
status: accepted
tags: [adr, forms, accessibility, responsive, wcag]
---

**ADR**: 007  
**Title**: Form Controls Sizing Strategy  
**Date**: January 16, 2026  
**Status**: Accepted

---

## Context

HAT targets showcase sites with WCAG 2.2 AA compliance. Form controls initially planned with `small` (40px) / `default` (48px) variants.

---

## Problem

- Should form controls vary size or stay static like body text (ADR-002)?
- Does `small` variant provide value or add complexity?
- What do industry leaders recommend in 2026?

---

## Decision

All form controls = 48px height (all viewports)

Applies to: `select.njk`, `input.njk` (min-height)

**Rationale:**

48px = Material Design 3 standard, exceeds WCAG 2.5.5 minimum (44px), aligns Apple HIG (44pt). Single size reduces cognitive load (Gov.UK research), simplifies maintenance, guarantees accessibility.

**Implementation:**

```nunjucks
{# select.njk - Remove sizeMap, use static height #}
{% set baseClasses = "h-12 px-[var(--spacing-inset-small)] py-[var(--spacing-inset-tight)] pr-[var(--spacing-inset-large)] text-body ..." %}
```

```json
// select.json - Remove size property
{
  "_meta": { "availableSizes": ["default"] },
  "selects": [{ "name": "demo", "id": "demo1" }]
}
```

---

## Consequences

**Positive:**

- WCAG 2.5.5 AA automatic compliance
- Aligned Material Design 3, Gov.UK, Apple HIG
- Consistent with ADR-002 (body static), ADR-006 (links static)
- Simplified testing (1 size vs 2)
- Better mobile UX (48px > 40px finger target)

**Negative:**

- Less vertical density on desktop
- No `small` variant for dense layouts

**Mitigation:**

- Spacing tokens control vertical rhythm
- Dense UIs (data tables) = custom organisms if needed (outside HAT core scope)

---

## Alternatives Considered

**Responsive breakpoints (40px mobile, 48px desktop):** Mobile needs larger targets, not smaller. Rejected: contradicts WCAG 2.5.5.

**Keep `small` variant (40px):** Below WCAG 2.5.5 minimum (44px). Rejected: accessibility fail.

**44px compromise:** Valid but Material Design 3 uses 48px. Rejected: 48px = clearer standard.

---

## References

- [Material Design 3 - Text Fields](https://m3.material.io/components/text-fields/specs) - 48px standard
- [Carbon Design System - Select](https://carbondesignsystem.com/components/select/usage/) - Default 40px, compact = data tables only
- [Gov.UK - Form Elements](https://design-system.service.gov.uk/components/) - 44px minimum, no variations
- [Apple HIG - Controls](https://developer.apple.com/design/human-interface-guidelines/controls) - 44pt minimum
- [WCAG 2.5.5 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)

**Related ADR:**

- [ADR-002: Fluid Typography Strategy](./002-fluid-typography.md)
- [ADR-003: Touch Target Accessibility](./003-touch-target-strategy.md)
- [ADR-006: Link Typography Strategy](./006-link-typography.md)

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
