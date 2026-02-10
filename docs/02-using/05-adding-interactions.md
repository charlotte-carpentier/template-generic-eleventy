---
title: Adding Interactions
description: JavaScript interactions in HAT components
created: 2025-01-15
---

HAT components include pre-built JavaScript interactions using vanilla ES6+.

---

## File Structure

```txt
src/assets/scripts/
├── components/            # HAT component interactions
├── core/                  # Optional third-party integrations
│   ├── analytics.js       # Google Analytics 4
│   ├── axeptio.js         # Cookie consent
│   └── netlify-identity.js
├── tests/                 # Site quality tests
├── utils/                 # Reusable utilities for your projects
│   ├── dismiss.js
│   ├── debounce.js
│   └── tooltip.js
└── main.js                # Entry point
```

---

## Built-in Interactions

HAT components work automatically - no setup required.

**Examples**: Modal open/close, tooltip show/hide, dismissible elements (toast, disclaimer).

---

## Available Utilities

Reusable functions you can use in your projects:

**dismiss.js** - Remove elements with animation:

```javascript
import { dismiss } from './utils/dismiss.js';
await dismiss(element);
```

**debounce.js** - Delay function execution:

```javascript
import { debounce } from './utils/debounce.js';
const search = debounce(() => console.log('Search'), 300);
```

---

## Core Integrations

Optional third-party integrations in `core/`:

- **analytics.js** - Google Analytics 4 (if `site.analytics.ga4` configured)
- **axeptio.js** - Cookie consent (if `site.cookieConsent.clientId` configured)
- **netlify-identity.js** - Netlify authentication

These activate automatically based on `site.json` configuration.

---

## Custom JavaScript

For project-specific features, create `custom/` folder:

```txt
src/assets/scripts/custom/
└── tracking.js            # Your project code
```

Import in `main.js`:

```javascript
import { initTracking } from './custom/tracking.js';
document.addEventListener('DOMContentLoaded', initTracking);
```

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
