---
title: Introduction
description: Mental model for working with HAT Design System Starter
created: 2026-02-25
---

Read this before anything else — it explains how the system is structured and how to work with it.

---

## How the system works

```text
src/_data/          => Component config and content defaults (JSON)
src/_includes/      => Nunjucks templates (Atomic Design components)
src/assets/styles/  => Design tokens and CSS (input.css)
src/content/        => Editorial content (CMS-managed Markdown)
```

---

## How components are organized

Components follow Atomic Design — 3 levels, each referencing the level below by name:

- **Atoms** — button, icon, input, heading
- **Molecules** — card, form field (composed of atoms)
- **Organisms** — header, hero, footer (composed of molecules)

Change an atom once, it updates everywhere it's referenced.

---

## How to customize a project

Work in this order — from global to specific:

1. `src/_data/site.json` — site title, URL, analytics, fonts, CMS config
2. `src/assets/styles/input.css` — design tokens (colors, spacing, typography)
3. `src/_data/atoms|molecules|organisms/*.json` — component content and variants
4. `src/_includes/` — Tailwind classes in `.njk` for project-specific adjustments
5. `src/admin/config.yml` — CMS collections configuration
6. `netlify.toml` — deployment and security headers

See [Styling Components](../02-using/04-styling-components.md) for the full styling workflow.

---

## Where content lives

| Type | Location | Editable by |
| ---- | -------- | ----------- |
| Component config | `src/_data/` | Developer |
| Design tokens | `src/assets/styles/input.css` | Developer |
| Editorial content | `src/content/` | Client via CMS |

Editorial content overrides `_data` defaults at runtime. See [ADR-013](../03-maintaining/decisions/013-data-architecture.md).

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
