---
title: Design Constraints - UX/Accessibility
description: Non-negotiable standards for HAT template designs
type: documentation
created: 2026-02-05
tags: [ux, accessibility, wcag, standards]
---

**Version**: 1.0.0  
**Maintained by**: Charlotte Carpentier

---

## Mandatory Standards (WCAG 2.2 AA)

### 1. Touch Targets - Minimum 44×44px

**Elements**: Buttons, isolated links, form controls, clickable icons  
**Source**: [WCAG 2.5.5 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)  
**Rationale**: Mandatory for French public sector + covers 95% adult finger sizes (MIT Touch Lab 2003)

**Allowed exceptions**:

- Inline links within paragraphs
- Elements with ≥44px spacing between centers

---

### 2. Color Contrast

**Source**: [WCAG 1.4.3 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)  
**Rationale**: Readability for visually impaired, dyslexia, variable lighting conditions

**Minimum ratios**:

- Normal text: **4.5:1**
- Large text (≥18pt or ≥14pt bold): **3:1**
- UI components (borders, icons): **3:1**

**Tool**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

### 3. Line Length - Maximum 80 characters

**Source**: [WCAG 1.4.8 Visual Presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)  
**Rationale**: Eye strain + dyslexia readability

**Figma application**:

- Optimal: **50-75 characters**
- Desktop text blocks: **max ~960px** (= ~65-75 characters depending on font)

---

### 4. Adjustable Text Spacing

**Source**: [WCAG 1.4.12 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)  
**Rationale**: Dyslexia and visual impairment support

**Minimums**:

- Body line-height: **≥1.5**
- Paragraph spacing: **≥2× font-size**

---

## HAT Recommendations (Adjustable)

### Grid

```txt
Desktop (1440px)
├─ Margins: 64px
├─ Gutter: 32px
└─ Workzone: 1312px

Mobile (320px)
├─ Margins: 16px
├─ Gutter: 32px
└─ Workzone: 288px
```

**Adjustable**: Desktop 1280-1920px, Mobile 375px based on project stats

---

### Typography

**Fluid headings**:

- H1: 36px mobile → 48px desktop
- H2: 28px → 36px
- H3: 22px → 24px

**Static body**:

- Body: 16px
- Helper: 14px
- Caption: 12px

**Adjustable**: Body 14-18px based on project density

---

### Section Spacing

**Vertical**: 48px mobile → 80px desktop (fluid)

**Adjustable**: 40-96px based on desired density

---

### Forms

**Input height**: 48px (all viewports)

**Adjustable**: Minimum 44px (WCAG), can decrease if critical density

---

## Validation Process

1. **Design**: Designer follows mandatory standards
2. **Dev**: Verify contrast + keyboard navigation accessibility
3. **Audit**: WCAG 2.2 AA testing before delivery

---

## Resources

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Gov.UK Design System](https://design-system.service.gov.uk/)

---

May your bugs be forever exiled to the shadow realm ✦
