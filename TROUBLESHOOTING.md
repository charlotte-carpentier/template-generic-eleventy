---
title: Troubleshooting
description: Common issues and solutions for Template Generic Eleventy
type: documentation
created: 2025-01-15
tags: [troubleshooting, issues, solutions]
---

This document tracks common issues and their solutions.

---

## Eleventy

### Template not found

**Context:** Eleventy v2, `_includes/` paths

**Cause:** Incorrect folder alias in `.eleventy.js`

**Solution:**

```javascript
// Verify in .eleventy.js
return {
  dir: {
    input: "src",
    includes: "_includes",  // Check this path
    output: "public"
  }
};
```

---

## TailwindCSS

### Design token not working

**Problem:**

```html
<div class="bg-[var(--color-brand-primary-40)]">
```

Color not applied.

**Cause:** Variable not defined in `input.css`

**Solution:**

1. Check variable exists in `@theme` section of `input.css`
2. Rebuild CSS: `npm run build:css`
3. Verify output in `public/output.css`

---

### Custom CSS not loading

**Problem:** Custom styles from `error-layout.css` not applied

**Cause:** File not imported in `input.css`

**Solution:**

```css
/* In input.css, add import */
@import "./03-organisms/error-layout.css";
```

Then rebuild: `npm run build:css`

---

### Purge removing needed classes

**Problem:** Classes removed in production build

**Cause:** Templates not included in `@source` directive

**Solution:**

```css
/* In input.css, verify @source includes all templates */
@source "./src/**/*.njk";
```

Ensure all template directories are covered by the glob pattern.

---

### Browser compatibility warning

**Problem:** Console warning about `-webkit-` prefix

**Example:**

```text
'mask-position' is not supported by Chrome < 120
Add '-webkit-mask-position' to support older browsers
```

**Solution:**
Always include vendor prefixes for cutting-edge CSS properties:

```css
@keyframes halo-reveal {
  from {
    -webkit-mask-position: 0% 50%;
    mask-position: 0% 50%;
  }
}
```

---

## Netlify

### Build fails: "Build command not found"

**Context:** Netlify deployment, Eleventy build

**Cause:** Missing build configuration

**Solution:**

Configure `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "public"

[build.environment]
  NODE_VERSION = "18"
```

---

### Static assets not loading

**Problem:** Images, fonts, or icons return 404

**Cause:** Assets not copied to build output

**Solution:**

In `.eleventy.js`:

```javascript
eleventyConfig.addPassthroughCopy("src/assets");
```

Rebuild and redeploy.

---

## Decap CMS

### Admin interface not accessible

**Problem:** `/admin` returns 404

**Cause:** Admin files not in output directory

**Solution:**

```javascript
// In .eleventy.js
eleventyConfig.addPassthroughCopy("src/admin");
```

---

### Changes not saving

**Problem:** Edits in Decap CMS don't persist

**Cause:** Git Gateway not configured or authentication issue

**Solution:**

1. Verify `netlify.toml` includes identity redirect
2. Enable Git Gateway in Netlify dashboard
3. Check authentication status in Decap CMS

---

## Development

### Port already in use

**Problem:** `npm start` fails with EADDRINUSE

**Cause:** Port 8080 occupied by another process

**Solution:**

**Option A:** Kill existing process

```bash
# macOS/Linux
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Option B:** Change port in `package.json`

```json
"start": "eleventy --serve --port=8081"
```

---

### Hot reload not working

**Problem:** Changes not reflected in browser

**Cause:** Watch not configured for specific files

**Solution:**

In `.eleventy.js`:

```javascript
eleventyConfig.addWatchTarget("./src/assets/styles/");
eleventyConfig.addWatchTarget("./src/_data/");
```

---

## See Also

- [TailwindCSS Guide](./docs/tailwind.md) - TailwindCSS v4 usage
- [Configuration Guide](./docs/configuration.md) - Site configuration
- [Eleventy Setup](./docs/eleventy.md) - Eleventy configuration details
