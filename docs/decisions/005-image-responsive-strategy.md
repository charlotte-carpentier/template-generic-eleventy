---
title: ADR-005 - Image Responsive Strategy
description: Native srcset + Eleventy Image Plugin for performance optimization
type: architecture-decision
created: 2026-01-15
status: accepted
tags: [adr, images, responsive, performance, wcag]
---

**ADR**: 005  
**Title**: Image Responsive Strategy  
**Date**: January 15, 2026  
**Status**: Accepted

---

## Context

HAT targets showcase sites and blogs with Lighthouse 100/100 requirement. Images represent 50%+ page weight and directly impact Core Web Vitals (LCP, CLS). Need automated solution for responsive images without manual maintenance burden.

---

## Problem

- Manual `width`/`height` in JSON = maintenance burden, human error risk
- No `srcset` support = mobile users download desktop images
- No modern formats (WebP) = larger file sizes
- CLS occurs without proper dimensions (Lighthouse penalty)
- Custom CSS variants (`landscape`, `wide`, `square`) don't follow W3C/MDN standards

---

## Decision

**Use native HTML `srcset` + Eleventy Image Plugin integrated in component**

```txt
Variants:
├── avatar (fixed 44×44px UI element)
└── default (plugin-powered responsive)

Plugin Integration:
├── Component calls plugin for default variant
├── Plugin generates srcset, WebP, dimensions automatically
└── Avatar bypasses plugin (fixed size)
```

**Rationale:**

Native `srcset` = W3C/MDN standard for responsive images. Eleventy Image Plugin extracts dimensions from files, generates multiple resolutions (400w-1600w) and formats (WebP + JPEG fallback) automatically. Component wrapper maintains accessibility and consistent API.

**Implementation:**

```javascript
// .eleventy.js
eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", async (src, alt, sizes) => {
  let metadata = await Image(src, {
    widths: [400, 800, 1200, 1600],
    formats: ["webp", "jpeg"],
    outputDir: "./public/img/",
  });
  return Image.generateHTML(metadata, { alt, sizes, loading: "lazy", decoding: "async" });
});
```

```nunjucks
{# image.njk #}
{% if imageVariant == 'avatar' %}
  <img src="{{ imageSrc }}" width="44" height="44" ... />
{% else %}
  {% responsiveImage imageSrc, imageAlt, imageSizes %}
{% endif %}
```

```json
// image.json - Simple data structure
{
  "name": "heroImage",
  "src": "./src/assets/images/hero.jpg",
  "alt": "Hero image",
  "variant": "default"
}
```

---

## Consequences

**Positive:**

- Lighthouse 100/100: automatic CLS prevention, optimal LCP
- Performance: 60-80% image weight reduction (WebP + responsive sizes)
- Zero maintenance: plugin extracts dimensions, generates srcset, formats
- Standards-compliant: W3C/MDN/WCAG 2.2 AA aligned
- Component API unchanged: JSON + renderImage macro

**Negative:**

- Build time: +30s first generation (then cached <5s)
- Dependency: requires `@11ty/eleventy-img` package
- Learning curve: team must understand plugin workflow

**Mitigation:**

- Cache ensures fast subsequent builds
- Plugin is official Eleventy tool, actively maintained
- Component abstracts plugin complexity, simple JSON usage

---

## Alternatives Considered

**Manual srcset in JSON**: Full control but high maintenance, no format optimization, CLS risk. Rejected: maintenance cost too high.

**CSS Container Queries**: Modern but doesn't solve resolution switching or CLS, adds complexity. Rejected: over-engineering for showcase sites.

**Keep CSS Variants**: Non-standard, no performance gain, magic numbers hardcoded. Rejected: conflicts with 2026 standards.

---

## References

- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [Eleventy Image Plugin](https://www.11ty.dev/docs/plugins/image/)
- [Web.dev - Optimize CLS](https://web.dev/optimize-cls/)
- [WCAG 2.2 - Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)

**Related ADR:**

- [ADR-002: Fluid Typography Strategy](./002-fluid-typography.md)
- [ADR-004: Breakpoints Strategy](./004-breakpoints-strategy.md)

---

May your bugs be forever exiled to the shadow realm ✦
