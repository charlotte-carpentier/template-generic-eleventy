---
title: Roadmap
description: HAT v2 planned improvements
created: 2026-02-08
---

Read this to know what is planned for v2.

---

## Contents

- [Contents](#contents)
- [Components v2](#components-v2)
- [Accessibility](#accessibility)
- [System Evolution](#system-evolution)
- [Performance](#performance)
- [Documentation](#documentation)

---

## Components v2

**Block-grid** (High priority)

- Interactive data table with filtering and sorting
- Row selection, pagination integration
- Bulk actions toolbar

**List-accordion** (High priority)

- Expandable list sections

**Multiselect** (Medium priority)

- Molecule: dropdown with checkboxes + dismissible tags (×)
- Requires JS — justifies molecule scope over atom
- WCAG 2.2 AA: role="combobox", aria-multiselectable, keyboard nav (Enter / Backspace / Escape)
- Replaces native <select multiple> (see ADR-001)

**Drawer** (Medium priority)

- Slide-in panel component

**Pagination items-per-page select** (Medium priority)

- Native `<select>` to let user choose items per page (e.g. 10 / 25 / 50)
- Potential SSG conflict: Eleventy `pagination.size` is set at build time
- Options to evaluate:
  - Pre-generate multiple paginated sets at build time (one per size value)
  - Client-side JS filtering/slicing (bypasses Eleventy pagination entirely)
- Assess complexity vs. real client need before implementing
- **Decision: implement only if a SSG-compatible solution is found, otherwise drop**

---

## Accessibility

**WCAG 2.2 AA compliance audit** (High priority)

- Full manual audit against RGAA criteria (axe DevTools + keyboard navigation + screen reader)
- Lighthouse covers ~30% of criteria only — manual audit required for full conformance
- Produce an accessibility declaration (`déclaration d'accessibilité`) once conformance is validated
- Publish declaration on each delivered site (footer link)

**Automated accessibility tests** (High priority)

- axe-core integration
- Programmatic color contrast testing
- Focus indicators validation
- ARIA landmarks testing
- Touch targets measurement (44×44px)

**Dark mode support** (Medium priority)

- `prefers-color-scheme` implementation
- Inverted color tokens
- Component testing in dark mode

**High contrast mode** (Medium priority)

- `prefers-contrast` implementation
- Increased contrast ratios

**Dynamic touch target tokens** (Medium priority)

- CSS tokens auto-calculating padding to reach 44×44px minimum touch target
- Formula: `calc((var(--touch-min) - var(--element-height)) / 2)`
- Visual size unchanged — only interaction zone is expanded
- Element dimensions defined in `_data` JSON tokens
- Implementation TBD: Eleventy-generated CSS custom properties vs. JS injection

---

## System Evolution

**Custom CMS System** (Future)

- Replace Decap CMS dependency entirely
- Modular business interface
- Full backend control

**E-commerce System** (Future)

- Product catalog management
- Shopping cart functionality
- Payment integration
- Order management

**Error & maintenance pages** (High priority — Compatible v1)

- Bring 404, 500 and maintenance page templates up to design system standards

**Site migration** (Medium priority)

- Applies when client changes domain or URL structure (not repo/hosting rebranching)
- Configurable 301 redirect mapping via `_data` (old URLs → new URLs)
- Generated into `_redirects` or `netlify.toml` at build time
- Sitemap auto-generated with correct new URLs
- Canonical tags validation
- Duplicate content prevention during transition
- Google Search Console change of address integration
- To be researched and documented thoroughly for HAT workflow

---

## Performance

**Zoom-friendly grid** (Low priority)

- Evaluate workzone scaling at 200% zoom
- Options: fixed px vs calc() vs hybrid approach
- Project-specific decision based on project needs

---

## Documentation

**Client delivery process** (High priority)

- `03-maintaining/client-delivery.md` exists as a v1 draft
- Needs review by a legal professional before use in production
- Missing: contract template (French version of the IP clause)
- Missing: credentials handoff document template
- Missing: link from `10-deploying-projects.md` to this file

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
