---
title: ADR-002 - Fluid Typography Strategy
description: Atomic token architecture with selective fluid scaling for H1-H3
created: 2026-01-09
---

Decision record for fluid typography implementation with atomic token separation.

---

## Context

HAT targets showcase sites and blogs with modern typography standards. Key questions:

- Desktop H1 size (36px, 48px, or 56px)?
- Viewport range for WCAG 2.2 AA compliance?
- Separate font family from sizing for maintainability?
- Which headings scale fluidly vs static?

## Decision

Architecture uses atomic token separation (family vs size). H1-H3 scale fluidly with `clamp()` for visual impact. H4-H6 and body text use static sizes for consistent readability. Desktop H1 is 48px. Viewport bounds are 320px-1440px.

## Rationale

Desktop 48px aligns with Gov.UK Design System, Tailwind Typography, and Material Design 3. Viewport 320-1440px covers iPhone SE minimum and 65% desktop traffic (StatCounter 2025). Atomic separation follows W3C Design Tokens spec, enabling composition like `<h1 class="font-heading-bold text-fluid-h1">`.

Alternatives rejected: all-fluid approach (H1-H6 + body) creates performance hit and layout instability for showcase sites. H1 56px desktop breaks layouts and exceeds Gov.UK standard. Bundled tokens (family+size) prevent independent variation (anti-pattern 2026).

## Consequences

**Positive**:

- Modern 2026 standards aligned (Gov.UK, Tailwind)
- Maximum maintainability via atomic composition
- WCAG 2.2 AA compliant (rem + 200% zoom)
- Performance optimized for showcase sites

**Negative**:

- Dense UIs must use fixed primitives
- Ultra-wide >1440px requires manual adaptation
- Smartwatches <320px out of scope
- Static primitives (`--font-size-xs` to `--font-size-6xl`) available for edge cases

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
