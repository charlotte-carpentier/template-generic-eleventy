---
title: ADR-008 - Modal Overlay Strategy
description: Native HTML5 dialog with mobile bottom sheet positioning
type: architecture-decision
created: 2026-01-22
status: accepted
tags: [adr, modal, dialog, overlay, accessibility, mobile-ux]
---

**ADR**: 008  
**Title**: Modal Overlay Strategy  
**Date**: January 22, 2026  
**Status**: Accepted

---

## Context

HAT requires modal dialogs for user confirmations and contextual information. Need modern accessible solution with optimal mobile UX and minimal JavaScript.

---

## Problem

- Use native `<dialog>` or custom `<div role="dialog">`?
- Mobile positioning: centered or bottom-aligned?
- Justify CSS custom in 90% Tailwind / 10% CSS architecture?
- Support older browsers (pre-2022) or target modern baseline?

---

## Decision

**Native HTML5 `<dialog>` with adaptive positioning:**

- **Desktop**: Centered overlay (`fixed` + `transform` centering)
- **Mobile** (≤767px): Bottom-aligned sheet (`inset: auto 0 0`)

**Rationale:**

Native dialog provides built-in accessibility (focus trap, ESC key, backdrop, inert background). Mobile bottom sheet follows Material Design 3 ergonomics (thumb zone, natural scroll gesture). CSS custom justified for positioning logic impossible in Tailwind utilities.

**Implementation:**

```css
/* modal.css - Mobile bottom positioning */
@media @media (width <= 767px) {
  dialog[data-modal-type="modal"] {
    inset: auto 0 0;              /* Bottom-aligned */
    max-height: calc(100dvh - 2rem); /* Viewport height minus spacing */
    overflow-y: auto;             /* Scroll if content long */
  }
}

/* Page scroll lock */
html:has(dialog[open]) {
  overflow: hidden;
  scrollbar-gutter: stable;       /* Prevent layout shift */
}
```text
```nunjucks
{# Desktop centered via Tailwind #}
md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
```

**Browser Support:**

- Chrome 37+ (2014)
- Firefox 98+ (2022)
- Safari 15.4+ (2022)
- Edge 79+ (2020)

Coverage: 99.4% users (Jan 2026). No polyfill for HAT target audience.

---

## Consequences

**Positive:**

- WCAG 2.2 AA native compliance (focus trap, keyboard navigation)
- Minimal JavaScript (~80 lines vs 200+ custom solution)
- Mobile ergonomics (thumb zone, scroll natural)
- Performance (native browser optimization)
- CSS custom justified (5% ratio, positioning logic specific)

**Negative:**

- 0.6% users unsupported (Firefox <98, Safari <15.4)
- CSS custom breaks 90/10 guideline (acceptable: positioning impossible Tailwind)
- No swipe-to-dismiss mobile (backdrop/ESC/button sufficient)

**Mitigation:**

- Target modern browsers (HAT 2026 baseline)
- Document compatibility requirement
- Four dismiss methods cover user needs

---

## Alternatives Considered

**Custom `<div role="dialog">`:**

Rejected. Requires manual focus trap, ESC handling, backdrop management (~200 lines JS). Native dialog superior accessibility and maintenance.

**Centered mobile positioning:**

Rejected. Material Design 3 recommends bottom sheets mobile (thumb zone ergonomics, content visibility). Centered = finger obstruction + awkward reach.

**Dialog polyfill for old browsers:**

Rejected. +12KB dependency, 0.6% impact not worth complexity. HAT targets 2024+ devices.

**Swipe-to-dismiss gesture:**

Rejected. +100 lines JS, edge cases (scroll conflicts), testing overhead. Four dismiss methods sufficient (backdrop, ESC, X button, cancel button).

---

## References

- [MDN - `<dialog>` Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [WHATWG HTML Standard - Dialog](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)
- [Material Design 3 - Bottom Sheets](https://m3.material.io/components/bottom-sheets/overview)
- [WCAG 2.2 - Modal Dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Can I Use - Dialog Element](https://caniuse.com/dialog)

**Related ADR:**

- [ADR-003: Touch Target Accessibility](./003-touch-target.md)
- [ADR-004: Breakpoints Strategy](./004-breakpoints.md)

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
