---
title: Coding Style Guide
description: Rules and conventions for code formatting and structure
type: documentation
created: 2025-01-15
tags: [coding-style, conventions, guidelines]
---

**Version**: 3.0.0  
**Last Updated**: October 2025  
**Maintained by**: Charlotte Carpentier

## Documentation

- **[Coding Style](./coding-style.md)** - Rules & conventions
- **[Examples](./examples.md)** - Complete code samples

---

> **Note**: Rules only. Complete examples in [examples.md](./examples.md)

---

## Quick Start

1. **File names**: `kebab-case` → `section-hero.json`
2. **JSON keys**: `camelCase` → `sectionHeros`
3. **Identifiers**: ≤12 characters when possible
4. **Indentation**: 2 spaces
5. **Quotes**: Single (JS/CSS), Double (JSON/HTML)
6. **Comments**: Explain "why" not "what"
7. **Footer**: Add signature to files >80 lines
8. **Accessibility**: Always include `aria-label`

---

## Naming Rules

| Context | Convention | Example | Pattern |
|---------|-----------|---------|---------|
| Files | `kebab-case` | `section-hero.json` | `[type]-[name].ext` |
| JSON keys | `camelCase` | `sectionHeros` | Plural of filename |
| References | `Name` suffix | `iconName` | `[context]Name` |

(Pattern column shows the naming logic)

---

## Component Architecture

| Level | Examples |
|-------|----------|
| Atoms | `button`, `input`, `icon` |
| Molecules | `card`, `breadcrumb` |
| Organisms | `header`, `footer`, `section-hero` |

---

## Abbreviations

| Abbr | Full | Usage | Avoid |
|------|------|-------|----------|
| `a11y` | Accessibility | W3C standard | `access`, `acc` |
| `Btn` | Button | Component refs | `But`, `Bouton` |
| `Txt` | Text | Content props | `texte`, `content` |
| `err` | Error | Error handling | `error`, `erreur` |

---

## Banner Templates

**Primary Component** (61 chars):

```javascript
/* ┌─────────────────────────────────────────────────────────┐
   │ [TYPE] › Name                                           │
   │ Description                                             │
   └─────────────────────────────────────────────────────────┘ */
```

**Utility** (61 chars):

```javascript
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   [TYPE] › Name
   Description
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
```

**Section** (45 chars):

```javascript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Section Name
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Footer** (>80 lines):

```javascript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// Charlotte Carpentier · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Full examples**: [examples.md](./examples.md)

---

## Code Style

1. **Concise JSDoc** - Brief documentation
2. **Explain "why"** - Not obvious "what"
3. **Visual grouping** - Group related config
4. **Strategic spacing** - 1 line between blocks

---

## Eleventy

**Version**: 3.0.0 (December 2024)

**Config**: See [Eleventy Docs](https://www.11ty.dev/docs/)

**Data Cascade** (highest to lowest):

1. Computed data
2. Front matter
3. Template data
4. Directory data
5. Global data

---

## Accessibility

**WCAG 2.2 AA**:

- Contrast: 4.5:1 (text), 3:1 (UI)
- Focus: 2px outline, 3:1 contrast
- Labels: Required on all inputs

**Full patterns**: [W3C ARIA APG](https://www.w3.org/WAI/ARIA/apg/)

---

## Version Control

**Format**:

```text
<type>(<scope>): <subject>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Full spec**: [Conventional Commits](https://www.conventionalcommits.org/)

---

## Cheat Sheet

### Naming

```text
FILES          JSON KEYS      REFERENCES
────────────────────────────────────────────
kebab-case     camelCase      [name]Name
────────────────────────────────────────────
button.json  → "buttons"   → "buttonName"
```

### Component Prefixes

| Type | Prefix |
|------|--------|
| Atom | `.btn-`, `.input-` |
| Molecule | `.card-`, `.form-` |
| Organism | `.header-`, `.section-` |

### Formatting

| Rule | Value |
|------|-------|
| Indentation | 2 spaces |
| Quotes | Single (JS/CSS), Double (JSON/HTML) |
| Semicolons | Always (JS) |

---

## References

**Official Docs**:

- [Eleventy](https://www.11ty.dev/docs/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [TailwindCSS v4](https://tailwindcss.com/docs)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)

**Style Guides**:

- [Google JavaScript](https://google.github.io/styleguide/jsguide.html)
- [Airbnb JavaScript](https://github.com/airbnb/javascript)
- [Atomic Design](https://atomicdesign.bradfrost.com/)

---

May your bugs be forever exiled to the shadow realm ✦
