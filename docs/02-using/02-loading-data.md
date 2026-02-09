---
title: Loading Data
description: How Eleventy loads and accesses data files
created: 2025-01-15
---

Eleventy loads data from JSON files in `src/_data/` and makes it globally accessible in templates.

---

## File Structure

```text
src/_data/
├── atoms/
│   ├── button.json
│   └── chip-notification.json
├── molecules/
└── site.json
```

---

## Accessing Data

**Files without hyphens:**

```njk
{{ atoms.button.buttons }}
{{ molecules.card.cards }}
```

**Files with hyphens (use bracket notation):**

```njk
{{ atoms["chip-notification"].chipNotifs }}
{{ organisms["section-hero"].sections }}
```

---

## Data Priority

When multiple sources define the same key, Eleventy uses this order (highest to lowest):

1. Computed data
2. Front matter
3. Template data
4. Directory data
5. Global data

See [Eleventy Data Cascade](https://www.11ty.dev/docs/data-cascade/) for detailed examples.

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
