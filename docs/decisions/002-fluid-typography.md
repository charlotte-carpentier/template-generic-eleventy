---
title: ADR-002 - Fluid Typography Strategy
description: Atomic token architecture with selective fluid scaling for H1-H3
type: architecture-decision
created: 2026-01-09
updated: 2026-01-14
status: accepted
tags: [adr, typography, responsive, accessibility, design-tokens]
---

**ADR**: 002  
**Title**: Fluid Typography Strategy  
**Date**: January 14, 2026  
**Status**: Accepted

---

## Context

HAT targets showcase sites and blogs. Need modern 2026 typography standards with guaranteed UX/accessibility within defined bounds.

---

## Problem

- Desktop H1 size: 36px, 48px, or 56px?
- Viewport range for WCAG 2.2 AA compliance?
- Separate font family from sizing for maintainability?
- Which headings scale fluidly vs static?

---

## Decision

**Architecture**: Atomic token separation (family vs size)

```txt
Family/style tokens (no size)
├── --typo-heading
├── --typo-heading-bold
└── --typo-body

Size tokens separated
├── Fluid: --font-size-fluid-h1/h2/h3
└── Static: --font-size-h4/h5/h6/body
```

**Responsive strategy**: Mixed fluid/static

- **H1-H3** → `clamp()` fluid (max visual impact)
- **H4-H6, body** → Static (consistent readability)

**Desktop values**: H1 48px

**Viewport bounds**: 320px-1440px

**Rationale**:

Desktop 48px: Gov.UK Design System standard, Tailwind Typography 36-48px prose, Material Design 3 baseline.

Bounds 320-1440px: iPhone SE minimum, 65% desktop traffic (StatCounter 2025).

Atomic separation: W3C Design Tokens spec (stable 2025), composition `<h1 class="font-heading-bold text-fluid-h1">`.

**Implementation**:

```css
/* Family tokens (no size) */
--typo-heading: var(--font-weight-semibold) / var(--line-height-snug) var(--font-family-sans);
--typo-body: var(--font-weight-normal) / var(--line-height-normal) var(--font-family-sans);

/* Fluid sizes */
--font-size-fluid-h1: clamp(2.25rem, 1.607rem + 2.009vw, 3rem);    /* 36px→48px */
--font-size-fluid-h2: clamp(1.75rem, 1.321rem + 1.339vw, 2.25rem); /* 28px→36px */
--font-size-fluid-h3: clamp(1.375rem, 1.286rem + 0.279vw, 1.5rem);/* 22px→24px */

/* Static sizes */
--font-size-h4: 1.25rem;  /* 20px */
--font-size-h5: 1.125rem; /* 18px */
--font-size-h6: 1rem;     /* 16px */
--font-size-body: 1rem;   /* 16px */

/* Atomic utilities */
@utility font-heading { font: var(--typo-heading); }
@utility text-fluid-h1 { font-size: var(--font-size-fluid-h1); }
@utility text-h4 { font-size: var(--font-size-h4); }
```

---

### Formula

Viewport: 320px (20rem) → 1440px (90rem)

**Change viewport:**

1. Convert new bounds to rem (divide by 16)
2. Calculate new range (maxRem - minRem)
3. Replace `20rem` and `70rem` in `input.css`

**Example - Change to 375px → 1920px:**

- Min: 375px ÷ 16 = 23.44rem → Replace `20rem`
- Max: 1920px ÷ 16 = 120rem (not used in formula)
- Range: (1920 - 375) ÷ 16 = 96.56rem → Replace `70rem`

Sources: [Smashing Magazine](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/), [Utopia](https://utopia.fyi/type/calculator/)

---

## Consequences

**Positive**:

- Modern 2026 standards (Gov.UK, Tailwind aligned)
- Atomic composition: max maintainability
- Clear compatibility contract
- WCAG 2.2 AA compliant (rem + zoom 200%)
- Performance optimized

**Negative**:

- Dense UIs must use fixed `--font-size-*` primitives
- Ultra-wide >1440px requires manual adaptation
- Smartwatches <320px out of scope

**Mitigation**:

- Static primitives `--font-size-xs` to `--font-size-6xl` available
- Test range 320-1440px only
- Edge cases documented

---

## Alternatives Considered

**All fluid (H1-H6 + body)**: Performance hit, layout instability. Rejected: overkill for showcase sites.

**H1 56px desktop**: Layout breaks, Gov.UK uses 48px. Rejected: too aggressive.

**Bundled tokens (family+size)**: Cannot vary independently. Rejected: anti-pattern 2026.

---

## References

- [W3C Design Tokens Spec](https://www.w3.org/community/design-tokens/)
- [WCAG 2.2 - 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [Gov.UK Typography](https://design-system.service.gov.uk/styles/typography/)
- [USWDS Design Tokens](https://designsystem.digital.gov/design-tokens/)
- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [StatCounter Screen Resolution](https://gs.statcounter.com/screen-resolution-stats)

---

May your bugs be forever exiled to the shadow realm
