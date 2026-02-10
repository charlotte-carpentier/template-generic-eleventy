---
title: Eleventy Guide
description: Guide for working with Eleventy static site generator
type: documentation
created: 2025-01-15
tags: [eleventy, ssg, build]
---

## Version

**Eleventy 3.0.0** (December 2024)

---

## Data Loading

### File Structure

```text
src/_data/
├── atoms/
│   ├── button.json
│   └── chip-notification.json
├── molecules/
└── site.json
```

### Accessing Data

**Without hyphens:**

```njk
{{ atoms.button.buttons }}
{{ molecules.card.cards }}
```

**With hyphens (use bracket notation):**

```njk
{{ atoms["chip-notification"].chipNotifs }}
{{ organisms["section-hero"].sections }}
```

---

## Data Priority

1. Computed data (highest)
2. Front matter
3. Template data
4. Directory data
5. Global data (lowest)

---

## References

- [Official Documentation](https://www.11ty.dev/docs/)
- [Data Cascade](https://www.11ty.dev/docs/data-cascade/)
