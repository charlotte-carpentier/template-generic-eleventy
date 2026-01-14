---
title: ADR-003 - Touch Target Accessibility Strategy
description: Mandatory 44px minimum for all interactive elements (WCAG 2.2 AA)
type: architecture-decision
created: 2026-01-14
status: accepted
tags: [adr, accessibility, wcag, touch-target, mobile]
---

**ADR**: 003  
**Title**: Touch Target Accessibility Strategy  
**Date**: January 14, 2026  
**Status**: Accepted

---

## Context

HAT targets showcase sites with 65% mobile traffic. Need guaranteed tap accuracy for users with motor/visual impairments and average touch interaction quality.

---

## Problem

- Minimum interactive size for WCAG 2.2 AA compliance?
- Apply uniformly or allow exceptions?
- How to enforce across 46 components without repetition?

---

## Decision

**Standard**: 44×44px minimum (WCAG 2.5.5 Level AA)

```css
/* Token */
--touch-target-min: 44px;

/* Utility */
@utility touch-target {
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
}
```

**Scope**: All buttons, isolated links, form controls, icons, navigation items

**Exceptions** (WCAG compliant):

- Inline links (within paragraph text)
- Targets with ≥44px spacing between centers
- Native browser controls

**Rationale:**

44px = WCAG 2.2 AA mandatory (2023), Apple iOS standard (2007), matches average finger pad 40-46px (MIT Touch Lab 2003). Global token ensures consistency and easy maintenance.

---

## Consequences

**Positive:**

- WCAG 2.2 AA compliant (mandatory French public sector)
- Reduced tap errors, improved conversion
- Single token = easy updates

**Negative:**

- Dense UIs need more spacing
- Small screens may require vertical stacking

**Mitigation:**

- Use spacing tokens for groups
- Document exceptions with accessibility review
- Test on real devices

---

## Alternatives Considered

**24×24px (AAA)**: Too small for average fingers, not mandatory. Rejected.

**48×48px (Material)**: Better but overkill for web. Rejected: 44px is standard.

**No standard**: Inconsistent, fails audits. Rejected.

---

## References

- [WCAG 2.5.5 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
- [Apple HIG Touch Targets](https://developer.apple.com/design/human-interface-guidelines/touchscreen-gestures)
- [MIT Touch Lab Research](https://touchlab.mit.edu/publications/2003_009.pdf)

**Related ADR:**

- ADR-002: Fluid Typography Strategy

---

May your bugs be forever exiled to the shadow realm ✦
