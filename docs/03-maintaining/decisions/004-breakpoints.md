---
title: ADR-004 - Breakpoints Strategy
description: Responsive breakpoints and container queries implementation strategy
created: 2026-01-15
---

Decision record for responsive strategy combining media queries with container queries.

---

## Context

HAT requires responsive strategy for showcase sites. Container queries achieved baseline browser support in 2023. Key questions:

- Mobile-first or desktop-first?
- Content-driven or device-specific breakpoints?
- When to use media queries vs container queries?
- Fallback strategy for older browsers?

## Decision

Hybrid strategy: mobile-first with content-driven breakpoints and selective container queries.

- Minimum 3 breakpoints: mobile base, tablet 768px, desktop 1024px
- Add breakpoints where content breaks, not where devices exist
- Container queries only if component meets 2+ criteria: reused in multiple contexts, internal layout changes based on container space, same viewport needs different layouts
- Always wrap container queries in `@supports`

## Rationale

Mobile-first reduces code. Content-driven breakpoints future-proof against new devices. Tailwind native breakpoints require zero config. Fluid design (`clamp()`, `%`, `rem`) handles edge cases between breakpoints.

Container queries enable context-independent components but add complexity. 2+ criteria framework prevents over-engineering. `@supports` maintains universal compatibility.

Alternatives rejected: desktop-first requires more overrides, device-specific breakpoints break with new devices, always using container queries over-complicates simple layouts.

## Consequences

**Positive**:

- Content-driven approach future-proofs against new devices
- Clear 2+ criteria framework prevents over-engineering
- Minimum 3 breakpoints reduce maintenance
- Zero Tailwind configuration

**Negative**:

- Container queries may require wrapper elements
- Team learning curve for 2+ criteria
- `@supports` increases CSS verbosity
- 3 breakpoints baseline may need expansion

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
