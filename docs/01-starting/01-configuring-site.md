---
title: Configuring Site
description: Quick configuration guide for site.json
created: 2025-01-15
---

Configure your site by editing `src/_data/site.json`.

---

## Minimal Configuration

Only 3 fields required to start:

```json
{
  "title": "Your Site Title",
  "description": "Your site description for SEO",
  "url": "https://yourdomain.com"
}
```

Save, run `npm start`, and your site is ready at `http://localhost:8080`.

---

## Additional Options

Beyond these 3 required fields, `site.json` supports:

- Language and locale settings (`language`, `locale`)
- Theme color for browsers (`themeColor`)
- Optional integrations: Google Fonts, Google Analytics 4, Axeptio cookie consent

For complete field documentation and integration guides, see [Site Configuration Reference](../02-using/01-site-configuration-reference.md).

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
