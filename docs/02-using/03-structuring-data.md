---
title: Structuring Component Data
description: How to customize JSON files for client projects
created: 2025-10-11
---

Guide for personalizing HAT component data for new projects.

---

## File Structure

Component data is organized by Atomic Design level:

```text
src/_data/
├── atoms/          # button.json, icon.json, input.json
├── molecules/      # card.json, breadcrumb.json
└── organisms/      # section-hero.json, header.json, footer.json
```

---

## JSON Anatomy

Each component file follows this structure:

```json
{
  "// Component": "Description of component",
  "_meta": {
    "component": "button",
    "type": "atom",
    "version": "1.0.0",
    "availableVariants": ["primary", "secondary", "ghost"]
  },
  "buttons": [
    {
      "name": "demoButton1",
      "text": "Label",
      "variant": "primary",
      "ariaLabel": "Button description"
    }
  ]
}
```

**Key parts**:

- `_meta.available*`: Pre-coded options in templates (variants, sizes, etc.)
- Plural array key: `button.json` => `"buttons"`, `section-hero.json` => `"sectHeros"`
- Each object needs unique `name` identifier

---

## Customizing for Projects

**Starting a new project** (ex: sophrology practice website):

1. **Keep structure intact** - don't modify keys or object shapes
2. **Change `name` values** - `demo...` => project-specific names
3. **Update content** - text, icons, aria labels
4. **Select variants** - choose from `_meta.available*` options

**Example - Customizing button.json**:

```json
"buttons": [
  {
    "name": "ctaHero",
    "text": "Book a session",
    "variant": "primary",
    "ariaLabel": "Book your first sophrology session"
  }
]
```

---

## Component References

Components reference each other using `[componentType]Name` pattern:

```json
// section-hero.json
{
  "name": "homeHero",
  "headingName": "heroTitle",
  "primaryButtonName": "ctaHero"
}
```

**How it works**:

- `buttonName` => looks up button with `name: "ctaHero"` in `button.json`
- `headingName` => looks up heading with `name: "heroTitle"` in `heading.json`
- System uses `findByName` filter to resolve references

---

## What You Can Change

**Customizable per project**:

- All `name` identifiers
- All text content
- Icon references (`iconName`)
- Variant selection from available options
- Tags arrays
- Content fields

**Do NOT modify**:

- JSON structure (keys, object shapes)
- `_meta` objects and available options
- Reference pattern `[type]Name`
- Component architecture (atoms/molecules/organisms)

---

## Adding New Variants

To add a new variant (ex: `"tertiary"` button):

1. Update template in `src/_includes/[level]/[component].njk`
2. Add CSS styles for new variant
3. Add option to `_meta.availableVariants`

This is **template development**, not project customization.

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
