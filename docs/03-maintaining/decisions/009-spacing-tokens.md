---
title: ADR-009 - Spacing Tokens Architecture
description: Migration from abstract tokens (inset/stack/inline) to contextual system (micro/UI/Layout)
created: 2026-01-27
---

Decision record for spacing tokens architecture migration.

---

## Context

Previous spacing system used abstract semantic tokens (`inset`, `stack`, `inline`) that didn't match actual component usage patterns. Key problems:

- Abstract tokens didn't communicate usage context
- 34 tokens created decision paralysis
- No clear separation between component-internal and layout-external spacing
- Violated Internal ≤ External spacing principle (organism sections)

## Decision

Implement `namespace-scope-size` pattern with 3 scopes.

- Micro (internal edge cases: 2-4px)
- UI (component internal: 8-32px)
- Layout (component external: 40-96px)
- Symmetric T-shirt sizing (minimal/compact/default/comfortable/maximal)
- Fluid responsive variants for UI and Layout
- Total: 16 tokens (reduced from 34)

## Rationale

Clear usage intent: micro for icons/badges, UI for atoms/molecules, Layout for organisms/sections. Respects Internal ≤ External principle with UI max (32px) < Layout min (40px). Micro separated to prevent UX/accessibility misuse (WCAG 2.5.8: 24px minimum touch targets). Aligns with industry standards (Atlassian 21 tokens, Red Hat 12 tokens, USWDS 19 tokens).

Alternatives rejected: keep inset/stack/inline doesn't solve root problem of unclear usage context. Single UI scale (2-96px) loses architectural clarity and violates accessibility separation for 2-4px. Geometric progression only (2-4-8-16-32-64) too rigid, missing granular steps needed (12px, 24px, 48px, 80px).

## Consequences

**Positive**:

- Reduced from 34 to 16 tokens
- Clear usage context eliminates guesswork
- Enforces accessibility (micro tokens clearly limited scope)
- Aligns with industry standards

**Negative**:

- Requires migration of all existing components
- Two separate categories (micro + UI) for internal spacing adds slight complexity
- Systematic migration process with equivalence table needed

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
