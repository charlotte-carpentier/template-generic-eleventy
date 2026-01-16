---
title: ADR-006 - Link Typography Strategy
description: Static typography for links (16px all viewports)
type: architecture-decision
created: 2026-01-16
status: accepted
tags: [adr, typography, links, responsive]
---

**ADR**: 006  
**Title**: Link Typography Strategy  
**Date**: January 16, 2026  
**Status**: Accepted

---

## Context

Links initially planned with mobile (14px) vs desktop (16px) variation. Industry standards evolved 2024: Gov.UK eliminated size variations, static body text all viewports.

---

## Problem

Should links vary size mobile/desktop or stay static like body text?

---

## Decision

**Links = 16px static all viewports (matches body text).**

**Rationale:**

- Gov.UK 2024: Eliminated mobile variations, "as large as comfortable" mobile > "smaller variant"
- ADR-002: Body-level typography = static
- WCAG 2.2: 16px optimal, no size variation required
- Maintenance: Single size > multiple breakpoints

**Implementation:**

```nunjucks
{# link.njk - Add text-body to baseClasses, remove sizeMap #}
{% set baseClasses = "touch-target inline-flex items-center gap-[var(--spacing-inline-small)] font-medium text-body text-[var(--color-form)] ..." %}
```

```json
// link.json - Remove size property from all links
{
  "_meta": { "availableSizes": ["default"] },
  "links": [{ "name": "demo", "href": "/", "text": "Label" }]
}
```

---

## Consequences

**Positive:**

- Aligns Gov.UK 2024 + ADR-002
- Better mobile readability (16px vs 14px)
- Simplified maintenance

**Negative:**

- No size differentiation mobile/desktop
- Less vertical density mobile (+2px)

**Mitigation:**

- Differentiation via underline + color
- Density via spacing tokens

---

## Alternatives Considered

**Responsive breakpoints (`text-helper md:text-body`)**: Contradicts ADR-002, maintenance overhead. Rejected.

**JSON sizes (`small/default`)**: Manual management, no CSS responsive. Rejected (current broken state).

---

## References

- [Gov.UK Type Scale 2024](https://design-system.service.gov.uk/styles/type-scale/)
- [Gov.UK Issue #2289](https://github.com/alphagov/govuk-design-system/issues/2289)
- [WCAG 2.2 SC 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)

**Related ADR:**

- [ADR-002: Fluid Typography Strategy](./002-fluid-typography.md)

---

May your bugs be forever exiled to the shadow realm ✦
