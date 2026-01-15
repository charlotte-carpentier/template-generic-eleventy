---
title: ADR-004 - Breakpoints Strategy
description: Responsive breakpoints and container queries implementation strategy
type: architecture-decision
created: 2026-01-15
updated: 2026-01-15
status: accepted
tags: [adr, responsive, breakpoints, container-queries]
---

**ADR**: 004  
**Title**: Breakpoints Strategy  
**Date**: January 15, 2026  
**Status**: Accepted

---

## Context

HAT Design System requires responsive strategy combining media queries with container queries. Container queries achieved baseline browser support in 2023. Decision needed on breakpoint count, container query usage criteria, and fallback strategy.

---

## Problem

- Mobile-first or desktop-first approach?
- Content-driven or device-specific breakpoints?
- Optimal breakpoint count for maintainability?
- When to use media queries vs container queries?
- Naming conventions for containers?
- Fallback strategy for older browsers?

---

## Decision

Hybrid strategy: mobile-first with content-driven breakpoints and selective container queries.

**Rationale:**

Mobile-first reduces code. Content-driven breakpoints ensure layout adapts where it actually breaks, not arbitrary device widths. Container queries only where needed. Tailwind native breakpoints require zero config. Fluid design between breakpoints handles edge cases (foldables, large tablets).

**Implementation:**

**Breakpoints (minimum 3, add more only if layout requires):**

- Mobile: Base (no prefix)
- Tablet: 768px+ (`md:`)
- Desktop: 1024px+ (`lg:`)

**Add breakpoints where content breaks, not where devices exist.**

Test method: Resize browser slowly → identify where layout breaks → add breakpoint at that width.

```html
<div class="flex-col md:flex-row lg:grid lg:grid-cols-3">
```

**Fluid between breakpoints:** Use `clamp()`, `%`, `rem` so design adapts smoothly between breakpoints for edge cases.

**Container queries (only if 2+ criteria met):**

1. Component reused in multiple contexts with different widths
2. Internal layout changes based on container space
3. Same viewport needs different layouts in different containers

```css
/* Component or wrapper defines container */
.card {
  container-type: inline-size;
  container-name: card;
  min-width: 0; /* Prevent collapse in flex/grid */
}

/* ALWAYS wrap in @supports */
@supports (container-type: inline-size) {
  @container card (min-width: 400px) {
    .card { grid-template-columns: 200px 1fr; }
  }
}
```

**Naming:** Container name = component name. Wrapper = `[component]-wrapper` if needed.

**Container units:** `cqi`, `cqw`, `cqh`, `cqb` available for fluid sizing relative to container.

```css
.card h2 { font-size: clamp(1.25rem, 4cqi, 2rem); }
```

---

## Consequences

**Positive:**

- Content-driven breakpoints future-proof against new devices
- Clear decision framework prevents over-engineering
- Minimum 3 breakpoints reduce maintenance
- Container queries enable context-independent components
- `@supports` maintains universal compatibility
- Zero Tailwind configuration
- Fluid units ensure adaptation between breakpoints (foldables, large tablets)

**Negative:**

- Container queries may require wrapper elements
- Team learning curve for 2+ criteria
- `@supports` increases CSS verbosity
- 3 breakpoints = baseline, may need more if content requires

**Mitigation:**

- Document 2+ criteria with examples
- Test resize browser to identify real layout breakage points
- Start with pilot components
- Code reviews enforce `@supports` pattern
- `min-width: 0` prevents container collapse in flex/grid

---

## References

- [Can I Use - CSS Container Queries](https://caniuse.com/css-container-queries)
- [MDN - CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries)
- [MDN - Container Type](https://developer.mozilla.org/en-US/docs/Web/CSS/container-type#inline-size)
- [Web.dev - Container Queries in Action](https://web.dev/articles/baseline-in-action-container-queries)
- [Tailwind CSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [BrowserStack - Content-Driven Breakpoints](https://www.browserstack.com/guide/responsive-design-breakpoints)
- [LogRocket - CSS Breakpoints 2026](https://blog.logrocket.com/css-breakpoints-responsive-design/)

**Related ADR:**

- [ADR-002: Fluid Typography Strategy](./002-fluid-typography.md)
- [ADR-003: Touch Target Accessibility](./003-touch-target-strategy.md)

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
