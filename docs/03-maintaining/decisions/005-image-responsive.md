---
title: ADR-005 - Image Responsive Strategy
description: Build-time metadata generation for responsive images
created: 2026-01-15
---

Decision record for automated responsive images with build-time metadata generation.

---

## Context

HAT targets Lighthouse 100/100. Images represent 50%+ page weight and impact Core Web Vitals (LCP, CLS). Key problems:

- Manual `width`/`height` in JSON creates maintenance burden and CLS risk
- No `srcset` means mobile downloads desktop images
- Nunjucks macros are sync-only, cannot call async Eleventy Image shortcodes

## Decision

Build script generates metadata, component consumes enriched JSON.

- Workflow: `build:images` generates metadata → enriches JSON → Nunjucks renders
- Widths: 400w, 800w, 1200w (mobile, tablet, desktop)
- Format: WebP only (97%+ browser support)
- Auto-enrichment adds `width`, `height`, `srcset`, `sizes` to JSON
- Component renders with explicit dimensions and responsive attributes

## Rationale

Build-time generation eliminates manual maintenance while ensuring CLS prevention with explicit dimensions. WebP provides 60-80% weight reduction. Sync Nunjucks macros work with pre-generated metadata.

Alternatives rejected: async shortcode in templates incompatible with sync Nunjucks macros. Manual srcset creates maintenance burden and CLS risk. Container queries don't solve resolution switching or CLS prevention.

## Consequences

**Positive**:

- Lighthouse 100/100 (CLS = 0, optimal LCP)
- 60-80% image weight reduction
- Zero manual maintenance
- WCAG 2.2 AA compliant

**Negative**:

- Build time +10-30s first run (cached <5s after)
- Dependency on `@11ty/eleventy-img`
- JSON mutated during build process

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
