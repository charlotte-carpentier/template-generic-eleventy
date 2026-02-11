---
title: ADR-001 - Multiselect Exclusion
description: Native select multiple excluded from HAT atoms
created: 2025-12-10
---

Decision record for excluding native `<select multiple>` from HAT atoms layer.

---

## Context

HAT targets Lighthouse 100/100 and WCAG 2.2 AA. Native `<select multiple>` has critical issues:

- Desktop: Ctrl/Cmd+click non-intuitive
- Mobile: Inconsistent OS controls
- Styling: Browser shadow DOM blocks customization
- Keyboard: Conflicts with OS shortcuts (macOS Ctrl+Up/Down)

## Decision

Exclude `<select multiple>` from atoms. Single select uses native `<select>`. Multi-selection implemented as future molecule with custom UI.

## Rationale

Native multi-select documented as UX dead-end (MDN, industry sources). Browsers provide inconsistent experiences that cannot be styled. Custom implementation with checkboxes + tags + search provides consistent cross-platform behavior while maintaining WCAG 2.2 AA.

## Consequences

**Positive**:

- Consistent UX across platforms
- WCAG 2.2 AA compliance guaranteed
- No browser-specific hacks

**Negative**:

- No multi-selection in atoms (temporary)
- Future molecule requires JavaScript
- Increased complexity for multi-selection

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
