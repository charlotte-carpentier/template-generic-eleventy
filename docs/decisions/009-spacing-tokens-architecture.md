---
title: ADR-009 - Spacing Tokens Architecture
description: Migration from abstract tokens (inset/stack/inline) to contextual system (micro/UI/Layout)
type: architecture-decision
created: 2026-01-27
status: accepted
tags: [adr, spacing, tokens, design-system]
---

**ADR**: 009  
**Title**: Spacing Tokens Architecture  
**Date**: January 27, 2026  
**Status**: Accepted

---

## Context

Previous spacing system used abstract semantic tokens (`inset`, `stack`, `inline`) that didn't match actual component usage patterns. Template uses Eleventy, Nunjucks, TailwindCSS v4 with organism-level sections requiring clear internal vs external spacing distinction.

---

## Problem

- Abstract tokens (`--spacing-inset-small`) didn't communicate usage context
- 34 tokens created decision paralysis
- No clear separation between component-internal and layout-external spacing
- Violated Internal ≤ External spacing principle (organism sections)

---

## Decision

Implement `namespace-scope-size` pattern with 3 scopes:

**Architecture:**

```css
/* Micro (internal edge cases: 2-4px) */
--spacing-micro-minimal: 2px
--spacing-micro-default: 4px

/* UI (component internal: 8-32px) */
--spacing-ui-minimal: 8px
--spacing-ui-compact: 12px
--spacing-ui-default: 16px
--spacing-ui-comfortable: 24px
--spacing-ui-maximal: 32px

/* Layout (component external: 40-96px) */
--spacing-section-minimal: 40px
--spacing-section-compact: 48px
--spacing-section-default: 64px
--spacing-section-comfortable: 80px
--spacing-section-maximal: 96px

/* Fluid responsive variants */
--spacing-ui-fluid-default: clamp(16px, ..., 24px)
--spacing-ui-fluid-comfortable: clamp(24px, ..., 32px)
--spacing-section-fluid-default: clamp(64px, ..., 80px)
--spacing-section-fluid-comfortable: clamp(80px, ..., 96px)
```

**Rationale:**

- Clear usage intent: micro (icons/badges) vs UI (atoms/molecules) vs Layout (organisms/sections)
- Respects Internal ≤ External principle: UI max (32px) < Layout min (40px)
- Symmetric T-shirt sizing (minimal/compact/default/comfortable/maximal)
- Micro separated to prevent UX/accessibility misuse (WCAG 2.5.8: 24px minimum touch targets)

**Total:** 16 tokens (2 micro + 5 UI + 5 Layout + 4 Fluid)

---

## Consequences

**Positive:**

- Reduced from 34 to 16 tokens
- Clear usage context eliminates guesswork
- Enforces accessibility (micro tokens clearly limited scope)
- Aligns with industry standards (Atlassian 21 tokens, Red Hat 12 tokens, USWDS 19 tokens)

**Negative:**

- Requires migration of all existing components (atoms/molecules/organisms)
- Two separate categories (micro + UI) for internal spacing adds slight complexity

**Mitigation:**

- Systematic migration process with equivalence table
- Micro tokens documented as edge-case only (icons, badges, tight spacing)

---

## Alternatives Considered

**Option A - Keep inset/stack/inline:**

- Pros: No migration needed
- Cons: Abstract names don't communicate usage, no Internal ≤ External enforcement
- Rejected: Doesn't solve root problem

**Option B - Single UI scale (2-96px):**

- Pros: Simpler, fewer categories
- Cons: No clear internal/external separation, violates accessibility separation for 2-4px
- Rejected: Loses architectural clarity

**Option C - Geometric progression only (2-4-8-16-32-64):**

- Pros: Mathematical consistency
- Cons: Missing granular steps needed for design (12px, 24px, 48px, 80px)
- Rejected: Too rigid for real-world use

---

## References

**Sources:**

- [Atlassian Design System - Spacing](https://atlassian.design/foundations/spacing/)
- [USWDS Spacing Units](https://designsystem.digital.gov/design-tokens/spacing-units/)
- [Red Hat Spacing](https://ux.redhat.com/foundations/spacing/)
- [WCAG 2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Netguru Token Naming Best Practices](https://www.netguru.com/blog/design-token-naming-best-practices)
- [Cieden Internal ≤ External Rule](https://cieden.com/book/sub-atomic/spacing/spacing-best-practices)

**Related documentation:**

- [tailwind.md](./tailwind.md) - Design tokens usage
- [coding-style.md](./coding-style.md) - Naming conventions

---

May your bugs be forever exiled to the shadow realm ✦
