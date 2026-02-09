---
title: Accessibility Standards
description: WCAG 2.2 AA requirements for HAT projects
created: 2026-02-05
---

HAT follows WCAG 2.2 Level AA standards for all projects.

---

## Core Requirements

### Touch Targets

Minimum **44×44px** for buttons, links, form controls, and icons ([WCAG 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)).

**Exceptions**: Inline paragraph links, elements with ≥44px spacing.

### Color Contrast

Minimum ratios ([WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)):

- Normal text: **4.5:1**
- Large text (≥18pt or ≥14pt bold): **3:1**
- UI components: **3:1**

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to validate.

### Text Readability

- Line length: **max 80 characters** ([WCAG 1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html))
- Line height: **≥1.5** for body text ([WCAG 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html))
- Paragraph spacing: **≥2× font size**

---

## HAT Defaults

HAT provides baseline settings that meet these standards:

- Grid system (desktop 1440px, mobile 320px)
- Fluid typography (H1-H3) + static body text (16px)
- Vertical spacing (48px mobile => 80px desktop)
- Form inputs (48px height)

All defaults are adjustable per project while maintaining WCAG compliance.

---

## Validation

1. Designer applies standards in Figma
2. Developer verifies contrast + keyboard navigation
3. WCAG 2.2 AA audit before delivery

Full technical reference: [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
