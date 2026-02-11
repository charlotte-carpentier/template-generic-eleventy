---
title: ADR-006 - Link Typography Strategy
description: Static typography for links (16px all viewports)
created: 2026-01-16
---

Decision record for link typography sizing strategy.

---

## Context

Links initially planned with mobile (14px) vs desktop (16px) variation. Industry standards evolved 2024 with Gov.UK eliminating size variations for body-level elements.

## Decision

Links use 16px static across all viewports, matching body text.

- Single size for all viewports (no responsive breakpoints)
- Remove size property from link.json
- Links inherit body text sizing strategy

## Rationale

Gov.UK 2024 eliminated mobile variations, prioritizing "as large as comfortable" over "smaller variant". ADR-002 established body-level typography as static. WCAG 2.2 considers 16px optimal with no size variation requirement. Single size reduces maintenance overhead.

Alternatives rejected: responsive breakpoints (`text-helper md:text-body`) contradicts ADR-002 static body strategy. JSON sizes (`small/default`) requires manual management without CSS responsive benefits.

## Consequences

**Positive**:

- Aligns with Gov.UK 2024 and ADR-002
- Better mobile readability (16px vs 14px)
- Simplified maintenance

**Negative**:

- No size differentiation between mobile/desktop
- Less vertical density on mobile (+2px)
- Differentiation relies on underline and color only

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
