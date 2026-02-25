---
title: Managing Content
description: Content architecture, CMS configuration, and editing workflows
created: 2025-01-15
updated: 2026-02-18
---

HAT uses Decap CMS for content editing via browser interface.

---

## Content Architecture

**CMS-editable content** => `src/content/`

- Blog posts (Markdown)
- Portfolio items (Markdown)
- Collection data (JSON if configured)

**HAT component data** => `src/_data/components/`

- Design system structure (atoms, molecules, organisms)
- Edited directly in code only

**Why this separation?** Editorial content belongs in CMS for client editing. Design system configuration stays in code for version control and consistency.

---

## Customizing CMS

Configure editable collections in `src/admin/config.yml`.

**Example**: Add a services collection

```yaml
collections:
  - name: "services"
    label: "Services"
    folder: "src/content/services"
    create: true
    delete: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "body", widget: "markdown"}
```

**Field validation hints** (SEO/A11y):

- SEO: `"Important pour le référencement : affiché dans les résultats de recherche Google."`
- A11y: `"Obligatoire : permet aux personnes malvoyantes de comprendre l'image."`
- Design: `"Attention : un texte trop long peut casser la mise en page sur mobile."`

See [Decap CMS configuration docs](https://decapcms.org/docs/configuration-options/).

---

## Accessing the CMS

**URLs**:

- Local: `http://localhost:8080/admin`
- Production: `https://yoursite.com/admin`

**Authentication**: Click "Login with GitHub" and authorize with GitHub credentials.

Edits commit automatically to Git.

**First-time setup**: OAuth configuration required. See [Client Delivery](../03-maintaining/client-delivery.md) for setup instructions.

---

## Editing Content

**Via admin interface**:

```bash
npm start
# Navigate to http://localhost:8080/admin
# Edit => Save => Auto-commit to Git
```

**Direct file editing**:

```bash
# Edit files in src/content/ with code editor
# Commit via Git
```

Both methods write to the same repository.

**What clients can edit**:

- Article text, metadata, images (with validation)
- Hero titles/subtitles
- About/Services sections
- Contact info, social links

**What stays in code** (developer-controlled):

- CTA button text
- Form labels, error messages
- Navigation menu items
- Component configuration

**Why?** Editorial content (SEO-optimized) belongs in CMS. Interface text (UX-tested) stays in code.

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
