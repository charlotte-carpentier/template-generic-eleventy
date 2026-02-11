---
title: ADR-007 - Form Controls Sizing Strategy
description: Static 48px height for all form inputs (select, text, textarea)
created: 2026-01-16
---

Decision record for form controls sizing strategy.

---

## Context

HAT targets WCAG 2.2 AA compliance. Form controls initially planned with `small` (40px) and `default` (48px) variants. Key questions:

- Should form controls vary size or stay static like body text (ADR-002)?
- Does `small` variant provide value or add complexity?
- What do industry leaders recommend in 2026?

## Decision

All form controls use 48px height across all viewports.

- Applies to select, text input, textarea (min-height)
- Single size for all contexts
- Remove size property from component JSON

## Rationale

48px is Material Design 3 standard, exceeds WCAG 2.5.5 minimum (44px), and aligns with Apple HIG (44pt). Single size reduces cognitive load (Gov.UK research) and simplifies maintenance while guaranteeing accessibility.

Alternatives rejected: responsive breakpoints (40px mobile, 48px desktop) contradicts WCAG 2.5.5 as mobile needs larger targets. Keep `small` variant (40px) fails WCAG 2.5.5 minimum (44px). 44px compromise valid but 48px provides clearer industry standard alignment.

## Consequences

**Positive**:

- WCAG 2.5.5 AA automatic compliance
- Aligned with Material Design 3, Gov.UK, Apple HIG
- Consistent with ADR-002 and ADR-006 static strategies
- Simplified testing (1 size vs 2)
- Better mobile UX (48px > 40px finger target)

**Negative**:

- Less vertical density on desktop
- No `small` variant for dense layouts
- Dense UIs like data tables require custom organisms (outside HAT core scope)

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
