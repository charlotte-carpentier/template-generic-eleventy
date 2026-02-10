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
