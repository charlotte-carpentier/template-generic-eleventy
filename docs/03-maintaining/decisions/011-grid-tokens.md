---
title: ADR-011 - Grid Tokens Architecture
description: Hybrid grid system with Figma tokens and Tailwind utilities
created: 2026-01-29
---

Decision record for grid tokens architecture strategy.

---

## Context

HAT uses 12-column grid from HAT Figma Design (1440px viewport, 64px margins, 32px gutter). Key problems:

- Figma grid uses fixed widths, not directly compatible with Tailwind auto-fluid grids
- Design term "margins" vs CSS implementation "padding" confusion
- Content max-width constraints need to respect grid proportions
- Balance between strict grid adherence and responsive flexibility

## Decision

Hybrid architecture using Figma grid tokens for structure and Tailwind native for layouts.

- Token nomenclature: `grid-[scope]-[size]` (margin, workzone, gutter, col)
- Grid margins (design term, CSS padding): 16px mobile, 64px desktop
- Workzone: calculated from viewport minus margins
- Column widths: 12-col desktop, 2-col mobile with gutter spacing
- Pattern: Section uses grid margins → Container uses workzone max-width → Layout uses Tailwind native grid

## Rationale

Grid tokens respect Figma system exactly. Change 1-3 primitives and all tokens recalculate automatically. "Grid margins" is industry standard term (Material Design, USWDS). Tailwind `grid-cols-X` handles simple layouts, `--grid-col-*` tokens provide max-width constraints respecting grid proportions.

Alternatives rejected: strict 12-col system everywhere over-engineers simple 2-3 column layouts with verbose `grid-template-columns`. Semantic content tokens (`--content-prose-max`) decouple from grid, breaking single source of truth if grid changes. Rename `margin` to `padding` breaks design vocabulary where Figma and industry standards use "margins".

## Consequences

**Positive**:

- Grid tokens respect Figma system exactly
- Zero refactoring if grid parameters change
- Clear separation: structure tokens vs layout utilities
- Column tokens maintain grid proportions for content max-width

**Negative**:

- "Margin" term confusing for developers unfamiliar with design systems
- Column tokens unused for most layouts (reserved for max-width constraints)
- Documentation needed for "grid margins" convention

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
