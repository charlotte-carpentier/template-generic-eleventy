---
title: ADR-008 - Modal Overlay Strategy
description: Native HTML5 dialog with mobile bottom sheet positioning
created: 2026-01-22
---

Decision record for modal dialog implementation strategy.

---

## Context

HAT requires modal dialogs for user confirmations and contextual information. Key questions:

- Use native `<dialog>` or custom `<div role="dialog">`?
- Mobile positioning: centered or bottom-aligned?
- Justify CSS custom in 90% Tailwind / 10% CSS architecture?
- Support older browsers (pre-2022) or target modern baseline?

## Decision

Native HTML5 `<dialog>` with adaptive positioning.

- Desktop: centered overlay (fixed + transform)
- Mobile (≤767px): bottom-aligned sheet
- CSS custom for positioning logic (impossible in Tailwind utilities)
- Target 99.4% browser coverage (Chrome 37+, Firefox 98+, Safari 15.4+, Edge 79+)

## Rationale

Native dialog provides built-in accessibility (focus trap, ESC key, backdrop, inert background). Mobile bottom sheet follows Material Design 3 ergonomics for thumb zone and natural scroll gestures. CSS custom justified for positioning logic impossible with Tailwind utilities (5% ratio acceptable).

Alternatives rejected: custom `<div role="dialog">` requires manual focus trap, ESC handling, backdrop management (~200 lines JS vs ~80 native). Centered mobile positioning obstructs content and creates awkward thumb reach. Dialog polyfill adds +12KB for 0.6% users. Swipe-to-dismiss adds +100 lines JS with scroll conflicts, four dismiss methods sufficient (backdrop, ESC, X button, cancel button).

## Consequences

**Positive**:

- WCAG 2.2 AA native compliance (focus trap, keyboard navigation)
- Minimal JavaScript (~80 lines vs 200+ custom)
- Mobile ergonomics optimized (thumb zone, natural scroll)
- Performance via native browser optimization
- CSS custom justified (positioning logic specific)

**Negative**:

- 0.6% users unsupported (Firefox <98, Safari <15.4)
- CSS custom breaks 90/10 guideline (acceptable for positioning)
- No swipe-to-dismiss mobile (four methods sufficient)

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
