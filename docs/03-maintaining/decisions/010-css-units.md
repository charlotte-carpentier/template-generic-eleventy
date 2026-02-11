---
title: ADR-010 - CSS Units Strategy
description: Pixel, rem, and em usage rules for design tokens
created: 2026-01-28
---

Decision record for CSS units usage across design tokens.

---

## Context

HAT uses multiple CSS units (px, rem, em) in design tokens. Key questions:

- When to use px vs rem vs em?
- How to maintain WCAG compliance (zoom support)?
- How to ensure visual precision where needed?

## Decision

Use units based on context.

- Typography sizes: rem (WCAG zoom support 200%)
- Spacing/Layout: px (visual precision, consistent spacing)
- Border radius: px (visual precision)
- Letter spacing: em (relative to font-size)
- Viewport (clamp): rem (zoom support in fluid calculations)

## Rationale

Typography requires rem for WCAG 2.2 AA zoom compliance (200%). Spacing and border radius use px for visual precision and predictable layouts. Letter spacing uses em to scale with font-size changes. Viewport calculations use rem to maintain zoom support in fluid responsive design.

Alternatives considered but rejected: all-rem approach creates unpredictable spacing when users change default font-size. All-px approach fails WCAG zoom requirements for typography. All-em approach creates cascade complexity with nested elements.

## Consequences

**Positive**:

- WCAG 2.2 AA compliant (typography zoom)
- Predictable spacing (px precision)
- Clear usage rules per context

**Negative**:

- Mixed units require understanding context
- Team learning curve for unit selection
- Documentation and code review enforcement needed

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
