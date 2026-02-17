---
title: Roadmap
description: HAT v2 planned improvements
created: 2026-02-08
---

Planned features and improvements for HAT v2.

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

**Drawer** (Medium priority)

- Slide-in panel component

---

## Accessibility

**Dark mode support** (Medium priority)

- `prefers-color-scheme` implementation
- Inverted color tokens
- Component testing in dark mode

**High contrast mode** (Medium priority)

- `prefers-contrast` implementation
- Increased contrast ratios

**Automated accessibility tests** (High priority)

- axe-core integration
- Programmatic color contrast testing
- Focus indicators validation
- ARIA landmarks testing
- Touch targets measurement (44×44px)

---

## System Evolution

**CMS integration** (High priority)

- Migrate from Decap CMS to Sveltia CMS + DecapBridge
- Validate setup on first real client project
- Document final config in `10-deploying-projects.md`

**Custom CMS System** (Future)

- Replace Decap/Sveltia CMS dependency entirely
- Modular business interface
- Full backend control

**E-commerce System** (Future)

- Product catalog management
- Shopping cart functionality
- Payment integration
- Order management

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
