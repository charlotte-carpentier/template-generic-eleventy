---
title: Quick Reference
description: Essential conventions and commands cheat sheet
created: 2025-01-15
---

Quick reference for common HAT conventions and workflows.

---

## Naming Conventions

| Context | Convention | Example |
| ------- | ---------- | ------- |
| Files | `kebab-case` | `section-hero.json` |
| JSON keys | `camelCase` plural | `sectionHeros` |
| Component refs | `[type]Name` | `buttonName`, `headingName` |

See [Structuring Data](./03-structuring-data.md) for complete guidelines.

---

## Common Commands

```bash
# Development
npm start                    # Start dev server (localhost:8080)

# Building
npm run build:css            # Build styles once
npm run watch:css            # Watch styles

# Testing
vitest run tests/accessibility.test.js    # Run WCAG tests
```

See [Using Scripts](./05-using-scripts.md) for details.

---

## Git Commits

**Format**:

```text
[emoji] [type]: [Subject with capital letter]
```

**Types**:

- ✨ `feat` - New feature
- 🐛 `fix` - Bug fix
- ♻️ `refactor` - Code restructure
- 📝 `docs` - Documentation
- 💄 `style` - Visual changes (HTML/CSS)
- 🔧 `chore` - Config, setup tasks

**Example**:

```bash
git commit -m "✨ feat: Add sophrology practice hero section"
```

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
