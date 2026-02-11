---
title: ADR-003 - Touch Target Accessibility Strategy
description: Mandatory 44px minimum for all interactive elements (WCAG 2.2 AA)
created: 2026-01-14
---

Decision record for touch target minimum size across all interactive components.

---

## Context

HAT targets showcase sites with 65% mobile traffic. Need guaranteed tap accuracy for users with motor/visual impairments. Key questions:

- Minimum interactive size for WCAG 2.2 AA compliance?
- Apply uniformly or allow exceptions?
- How to enforce across 46 components without repetition?

## Decision

All interactive elements use 44×44px minimum (WCAG 2.5.5 Level AA). Applies to buttons, isolated links, form controls, icons, and navigation items. Exceptions allowed for inline links within text, targets with ≥44px spacing between centers, and native browser controls.

## Rationale

44px is WCAG 2.2 AA mandatory (2023), Apple iOS standard (2007), and matches average finger pad 40-46px (MIT Touch Lab 2003). Global token ensures consistency and easy maintenance.

Alternatives rejected: 24×24px (AAA) too small for average fingers and not mandatory. 48×48px (Material Design) better but overkill for web, 44px is established standard. No standard creates inconsistent experience and fails accessibility audits.

## Consequences

**Positive**:

- WCAG 2.2 AA compliant (mandatory French public sector)
- Reduced tap errors improves conversion
- Single token enables easy updates
- Consistent experience across 46 components

**Negative**:

- Dense UIs require more spacing
- Small screens may need vertical stacking
- Exceptions must be documented with accessibility review

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
