---
title: ADR-005 - Image Responsive Strategy
description: Build-time metadata generation for responsive images
type: architecture-decision
created: 2026-01-15
updated: 2026-01-15
status: accepted
tags: [adr, images, responsive, performance, wcag]
---

**ADR**: 005  
**Title**: Image Responsive Strategy  
**Date**: January 15, 2026  
**Status**: Accepted

---

## Context

HAT targets Lighthouse 100/100. Images = 50%+ page weight, impact Core Web Vitals (LCP, CLS). Need automated responsive images without manual maintenance.

---

## Problem

- Manual `width`/`height` in JSON = maintenance burden, CLS risk
- No `srcset` = mobile downloads desktop images
- Nunjucks macros = sync only, cannot call async Eleventy Image shortcodes

---

## Decision

Build script generates metadata, component consumes enriched JSON.

```txt
bin/generate-image-metadata.js → enriches image.json → image.njk renders
```

**Workflow:**

```bash
npm run build
# 1. test:run
# 2. build:images (generates metadata)
# 3. build:css
# 4. eleventy
```

**Config:**

- Widths: 400w, 800w, 1200w (mobile, tablet, desktop)
- Format: WebP only (97%+ browser support)
- Filenames: `{source}-{width}.webp` (preserves source name)

**Implementation:**

```javascript
// bin/generate-image-metadata.js
const metadata = await Image(src, {
  widths: [400, 800, 1200],
  formats: ['webp'],
  filenameFormat: (id, src, width, format) => `${basename(src, extname(src))}-${width}.${format}`
});

image.width = largestImage.width;
image.height = largestImage.height;
image.srcset = '...';
image.sizes = '(max-width: 768px) 100vw, 1200px';
delete image.sources; // Clean obsolete
```

```json
// Before build
{ "name": "hero", "src": "...", "alt": "...", "variant": "default" }

// After build (auto-enriched)
{
  "name": "hero",
  "src": "...",
  "alt": "...",
  "variant": "default",
  "width": 1200,
  "height": 800,
  "srcset": "/img/hero-400.webp 400w, /img/hero-800.webp 800w, /img/hero-1200.webp 1200w",
  "sizes": "(max-width: 768px) 100vw, 1200px"
}
```

```nunjucks
{# image.njk - sync macro #}
<img 
  src="{{ imageSrc }}"
  width="{{ imageWidth }}"
  height="{{ imageHeight }}"
  srcset="{{ imageSrcset }}"
  sizes="{{ imageSizes }}"
  class="block max-w-full h-auto object-cover w-full"
  loading="lazy"
  decoding="async"
/>
```

---

## Consequences

**Positive:**

- Lighthouse 100/100 (CLS = 0, optimal LCP)
- 60-80% image weight reduction (WebP + responsive)
- Zero manual maintenance
- W3C/MDN/WCAG 2.2 AA compliant

**Negative:**

- Build time +10-30s first run (cached <5s after)
- Dependency: `@11ty/eleventy-img`
- JSON mutated during build

**Mitigation:**

- Cache ensures fast rebuilds
- Build pipeline automated

---

## Alternatives Considered

**Async shortcode in templates:** Rejected (Nunjucks macros sync-only)

**Manual srcset:** Rejected (maintenance burden, CLS risk)

**Container queries:** Rejected (doesn't solve resolution switching or CLS)

---

## References

- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Eleventy Image Plugin](https://www.11ty.dev/docs/plugins/image/)
- [Web.dev - Optimize CLS](https://web.dev/optimize-cls/)

**Related ADR:**

- [ADR-002: Fluid Typography](./002-fluid-typography.md)
- [ADR-004: Breakpoints Strategy](./004-breakpoints-strategy.md)

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
