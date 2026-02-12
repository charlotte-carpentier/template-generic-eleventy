---
title: ADR-012 - CMS Content Scope Strategy
description: Define safe vs risky content for Decap CMS editorial control
created: 2026-02-12
---

Decision record for CMS content scope in HAT template.

---

## Context

HAT template must balance client autonomy (edit content without dev) vs design/SEO/accessibility preservation. Key problems:

- Clients editing CTA wording breaks conversion-optimized UX
- Form field changes risk accessibility/validation compliance
- Navigation modifications impact SEO architecture
- Hero titles without character limits break responsive layout
- Images without validation degrade Lighthouse performance

## Decision

CMS content scope follows 3-tier risk hierarchy:

**Tier 1 - Safe (IN CMS, no validation)**  
Editorial content: articles, FAQ, testimonials, about text, contact info.

**Tier 2 - Controlled (IN CMS, with validation)**  
SEO/accessibility-sensitive: hero titles, meta descriptions, page titles, images (with character limits, format validation, required alt text).

**Tier 3 - Restricted (OUT of CMS)**  
Structural elements: CTA text, forms, navigation, interactive components, layout config, design tokens.

## Rationale

**Industry consensus** (Decap CMS, Contentful, Sanity, Nielsen Norman Group): "Separate editorial content from technical structure. If changing it could break design or accessibility, keep it in code."

**Key decisions**:

- Single articles collection with type field (blog/news) avoids config duplication
- Character limits prevent responsive layout breaks
- Alt text validation ensures WCAG 2.2 compliance (1.1.1 Non-text Content)
- Forms/navigation in code per NN/g high-risk content guidelines

**Alternatives rejected**:

- Navigation with approval workflow: Complexity without template benefit
- Separate blog/news collections: Unnecessary duplication
- CTA text in CMS: Breaks conversion-optimized wording

## Consequences

**Positive**:

- Clients autonomous on editorial content without dev intervention
- Design system integrity preserved (CTA/forms/nav consistency)
- SEO/accessibility maintained via validation rules
- Single articles collection reduces maintenance

**Negative**:

- Clients must contact dev for CTA changes, navigation updates
- Validation rules add friction for title/metadata editing
- Documentation needed explaining safe vs restricted areas

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
