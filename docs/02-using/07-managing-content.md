---
title: Managing Content
description: Editing content with admin interface
created: 2025-01-15
---

HAT uses Decap CMS for content editing via browser interface.

---

## Admin Interface

Access content editor:

- Local: `http://localhost:8080/admin`
- Production: `https://yoursite.com/admin`

Your edits commit automatically to Git.

**First-time setup**: Requires authentication configuration. See Decap CMS [authentication docs](https://decapcms.org/docs/choosing-a-backend/).

---

## Content Location

**CMS-editable content** => `src/content/`

- Blog posts (markdown)
- Portfolio items (markdown)
- Collection data (JSON if configured)

Edit via admin interface at `/admin` or directly in code editor.

**HAT component data** => `src/_data/components/`

NOT content data - this is edited directly in code only.
Separates design system structure from project content.

---

## Editing Workflows

**Via admin interface**:

```bash
npm start
# Navigate to http://localhost:8080/admin
# Edit content, save => auto-commits to Git
```

**Direct file editing**:

```bash
# Edit files in src/content/ with code editor
# Commit via Git as normal
```

Both methods write to same repository.

---

## What Content is Editable?

**Client can edit via CMS**:

- Article titles, body text, metadata (with character limits)
- Hero titles and subtitles (with validation)
- About/Services section text
- Testimonials, FAQ
- Contact info, social links
- Images (with alt text required)

**Developer controls (hardcoded)**:

- CTA button text ("Prendre rendez-vous", "En savoir plus")
- Form labels ("Votre nom", "Votre email")
- Navigation menu items
- Error messages, tooltips
- Component configuration

**Why?** Editorial content (optimizable for SEO) belongs in CMS. Interface text (tested for UX/conversion) stays in code.

---

## Content Field Hints

When editing content via Decap CMS, some fields have strict requirements to preserve SEO, accessibility, or responsive design.

Pre-written hint messages for `config.yml`:

**SEO**:

- `"Important pour le référencement : affiché dans les résultats de recherche Google."`
- `"Important pour le référencement : respectez les limites de caractères indiquées."`

**Accessibility**:

- `"Obligatoire : permet aux personnes malvoyantes de comprendre l'image."`
- `"Obligatoire : décrivez le contenu de l'image en quelques mots."`

**Design**:

- `"Attention : un texte trop long peut casser la mise en page sur mobile."`
- `"Attention : image trop lourde = site lent. Respectez la limite de taille."`

**Combined**:

- `"Important pour le référencement et l'accessibilité : titre unique de la page."`

---

## Customizing CMS

Make additional content editable by configuring `src/admin/config.yml`.

**Example**: Add boats listing or carousel data

1. Create `src/content/boats.json`
2. Configure collection in `config.yml`
3. Edit via admin interface

See Decap CMS [configuration docs](https://decapcms.org/docs/configuration-options/).

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
