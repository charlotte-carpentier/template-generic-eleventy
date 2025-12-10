---
title: ADR-001 - Multiselect Exclusion
description: Native select multiple excluded from HAT atoms
type: architecture-decision
created: 2025-12-10
status: accepted
tags: [adr, ux, accessibility]
---

**ADR**: 001  
**Title**: Native `<select multiple>` Excluded  
**Date**: December 10, 2025  
**Status**: Accepted

---

## Context

HAT targets Lighthouse 100/100 and WCAG 2.2 AA. Native `<select multiple>` conflicts with these goals.

---

## Problem

`<select multiple>` has critical UX/accessibility issues:

- Desktop: Ctrl/Cmd + click non-intuitive
- Mobile: Inconsistent OS controls
- Styling: Browser shadow DOM prevents customization
- Keyboard: Conflicts with OS shortcuts (macOS Ctrl+Up/Down)

---

## Decision

HAT excludes `<select multiple>` from atoms layer.

```txt
atoms/select.njk → Single select only (native)
molecules/multiselect.njk → Custom UI + JS (future)
```

---

## Consequences

**Trade-offs:**

- No multi-selection in atoms (temporary)
- Future molecule required (checkboxes + tags + search)

**Benefits:**

- Consistent UX across platforms
- WCAG 2.2 AA guaranteed
- No browser-specific hacks

---

## References

> "The native HTML `<select multiple>` element is a UX dead end. On desktop, it requires users to hold Ctrl or Cmd. On mobile, the experience is inconsistent. The standard solution is to mount a JavaScript-driven UI with checkboxes and tag-style tokens."

[jQuery Script - Best Multiple Select (Dec 2025)](https://www.jqueryscript.net/blog/best-multiple-select.html)

> "It is hard to get a consistent result across browsers. If you want full control, consider using a library or rolling your own with JavaScript and WAI-ARIA."

[MDN - Select Element (Nov 2025)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select)

---

May your bugs be forever exiled to the shadow realm
