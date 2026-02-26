---
title: Using Scripts
description: HAT JavaScript organization and usage
created: 2025-01-15
---

Read this to understand how JavaScript is organized and how to run accessibility tests.

---

## File Structure

```text
src/assets/scripts/
├── components/            # Component-specific interactions
├── core/                  # Third-party integrations
├── tests/                 # Site quality tests
├── utils/                 # Shared utilities (used by multiple components)
└── main.js                # Entry point
```

---

## Folders Explained

**components/** - Component-specific JavaScript. Interactions work automatically when using HAT components. Do not modify.

**core/** - Optional third-party integrations (Google Analytics, Axeptio, Netlify Identity). Activate via `site.json` configuration. See [Site Configuration Reference](../02-using/01-site-configuration-reference.md).

**tests/** - Quality tests for accessibility and other site validations.

**utils/** - Shared JavaScript functions used internally by multiple HAT components. Do not modify.

**main.js** - Entry point that initializes all interactions and integrations.

---

## Running Tests

Launch accessibility tests:

```bash
vitest run tests/accessibility.test.js
```

Tests validate WCAG 2.2 AA compliance (color contrast, focus indicators, touch targets, ARIA landmarks).

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
