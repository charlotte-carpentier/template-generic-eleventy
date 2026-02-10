---
title: TODO - Remaining Components
description: Tracking list for components to implement after Phase 9
type: documentation
created: 2025-12-28
tags: [todo, roadmap, components, phases]
---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained by**: Charlotte Carpentier

---

## Overview

Components and features to implement after template finalization (Phase 9 completed).

---

## Phase 10: Missing Organisms

### Block Grid

**Status**: Not started  
**Priority**: High  
**Design**: Figma complete  
**Dependencies**: pagination, button, icon, select, radio-button, checkbox, list-control

**Files to create**:

- `src/_data/03-organisms/block-grid.json`
- `src/_includes/03-organisms/block-grid.njk`
- `src/assets/scripts/components/03-organisms/block-grid.js`

**Features**:

- Client-side filtering (quick + advanced)
- Column sorting
- Row selection (checkboxes)
- Pagination integration
- Bulk actions toolbar (optional)

---

### List Accordion

**Status**: Not started  
**Priority**: TBD  
**Design**: TBD  
**Dependencies**: TBD

**Files to create**:

- `src/_data/03-organisms/list-accordion.json`
- `src/_includes/03-organisms/list-accordion.njk`
- `src/assets/scripts/components/03-organisms/list-accordion.js`

**Features**:

- TBD

---

### Drawer

**Status**: Not started  
**Priority**: TBD  
**Design**: TBD  
**Dependencies**: TBD

**Files to create**:

- `src/_data/03-organisms/drawer.json`
- `src/_includes/03-organisms/drawer.njk`
- `src/assets/scripts/components/03-organisms/drawer.js`

**Features**:

- TBD

---

## Phase 11: Missing Utilities

### Animate.js

**Status**: Removed (Phase 6b)  
**Priority**: Low  
**Decision**: Re-evaluate if needed for future animations

### Keyboard Navigation (Tab)

**Status**: Removed (Phase 6b)  
**Priority**: Low  
**Decision**: Re-evaluate if needed for custom tab navigation

---

## Phase 12: Enhancements

### Component Extensions

- [ ] Additional button variants
- [ ] Additional icon sets
- [ ] Additional form components (if needed)

### Documentation

- [ ] Component usage examples
- [ ] Best practices guide
- [ ] Migration guide

---

## Phase 13: Post-Production

### Custom Error Pages

**Status**: Postponed - After production deployment  
**Files**: error-layout organism + custom CSS

**To finalize**:

- `src/_includes/03-organisms/error-layout.njk`
- `src/assets/styles/03-organisms/error-layout.css`
- Custom error pages (404, 500, etc.)

---

## Phase 14: Accessibility & Performance Audit

### Contrast Testing

**Status**: Not started  
**Priority**: Critical (WCAG 2.2 AA mandatory)  
**Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**To test**:

- [ ] All text/background pairs in `input.css` (primitives + tokens)
- [ ] Button states (default, hover, active, disabled)
- [ ] Form controls (input, select, checkbox, radio)
- [ ] Links (default, hover, visited, focus)
- [ ] Semantic colors (success, warning, error, info)

**Target ratios**:

- Normal text: ≥4.5:1
- Large text / UI: ≥3:1

---

### Automated Accessibility Tests

**Status**: In progress (scaffolding complete)  
**Priority**: High (WCAG 2.2 AA validation)  
**File**: `src/assets/scripts/tests/accessibility.test.js`

**To implement**:

- [ ] Axe-core integration for component validation
- [ ] Programmatic color contrast testing
- [ ] Focus visible indicators validation
- [ ] ARIA landmarks structure testing
- [ ] Touch targets measurement (44×44px)

**Dependencies**: vitest, jsdom, axe-core  
**Launch**: `npm run test:run` (automatic in build)

---

### Dark Mode Support

**Status**: Not started  
**Priority**: High (client demand 2026)  
**Standard**: [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

**Implementation**:

```css
@media (prefers-color-scheme: dark) {
  @theme {
    /* Invert color tokens */
    --color-global-default: var(--color-neutral-white);
    --color-global-heading: var(--color-neutral-95);
    /* ... */
  }
}
```

**To do**:

- [ ] Define dark palette (inverse neutral scale)
- [ ] Test all components dark mode
- [ ] Document toggle implementation (optional user switch)

---

### High Contrast Mode

**Status**: Not started  
**Priority**: Medium (accessibility niche)  
**Standard**: [prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)

**Implementation**:

```css
@media (prefers-contrast: high) {
  @theme {
    /* Increase contrast ratios */
    --color-button-primary: var(--color-neutral-black);
    /* ... */
  }
}
```

---

### Grid Workzone Zoom Review

**Status**: Not started  
**Priority**: Low (design choice vs strict WCAG)  
**Issue**: Current `--grid-workzone-*` fixed in px, doesn't scale with zoom 200%

**Options**:

1. Keep fixed (showcase sites = acceptable trade-off)
2. Switch to `calc(100vw - ...)` for zoom-friendly
3. Hybrid: max-width in px, padding in rem

**Decision needed**: Discuss with client per project

---

## Notes

- Block-grid postponed due to complexity
- Error pages postponed until after production deployment
- Focus on template finalization first
- Components added based on real project needs
- Follow existing patterns (coding-style.md, data-structure.md)

---

## Phase 15: Developer Documentation

### Contributing & Development Guide

**Status**: Not started  
**Priority**: Medium  
**Target**: Q2 2026

**Objective**: Create comprehensive documentation for HAT contributors and developers (creating/modifying components, not using them).

**To create**:

- [ ] Component Development Guide (Nunjucks patterns, macro structure, validation)
- [ ] JavaScript Development Guide (module patterns, event system, utilities creation)
- [ ] CSS Development Guide (TailwindCSS integration, custom CSS guidelines, BEM)
- [ ] Testing Guide (writing tests, running tests, coverage requirements)
- [ ] Architecture Decisions Records (ADR updates)

**Source**: Refactor "archived" MD files (old building-components.md, styling-components.md, adding-interactions.md) following current documentation principles: simple, readable, functional.

**Format**: Same structure as user documentation (`docs/04-contributing/` folder)

---

May your bugs be forever exiled to the shadow realm ✦
