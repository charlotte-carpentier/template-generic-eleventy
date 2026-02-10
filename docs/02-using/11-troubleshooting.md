---
title: Troubleshooting
description: Common issues and solutions for Template Generic Eleventy
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

## Configuration (site.json)

### Fonts not loading

**Problem:** Google Fonts not appearing on site

**Cause:** Incomplete configuration or invalid URL

**Solution:**

1. Verify both fields set together in `site.json`:
```json
   {
     "fonts": {
       "preconnect": true,
       "google": "https://fonts.googleapis.com/css2?family=..."
     }
   }
```
2. Test URL in browser (should return CSS)
3. Clear browser cache (Ctrl+Shift+R)

---

### Analytics not tracking

**Problem:** Google Analytics not receiving data

**Cause:** Invalid Measurement ID or consent issues

**Solution:**

1. Verify format in `site.json`: `"ga4": "G-XXXXXXXXXX"`
2. Check browser console for errors
3. Use [Google Tag Assistant](https://tagassistant.google.com/)
4. If using Axeptio: ensure cookie consent granted

---

### Cookie consent not appearing

**Problem:** Axeptio widget not showing

**Cause:** Incomplete configuration or unpublished project

**Solution:**

1. Verify all three fields in `site.json`:
```json
   {
     "cookieConsent": {
       "provider": "axeptio",
       "clientId": "your-client-id",
       "cookiesVersion": "domain-REGION"
     }
   }
```
2. Check browser console for errors
3. Ensure Axeptio project is published
4. Test in incognito mode

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

### Dismiss buttons not working

**Problem:** Click on close button (×) doesn't remove element

**Cause:** Individual event listeners attached incorrectly with `forEach()` loop

**Solution:**

Use event delegation pattern in `main.js`:
```javascript
// Event delegation for dismiss pattern
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-dismiss]')) {
    const target = e.target.closest('[data-dismissible]');
    if (target) {
      dismiss(target);
    }
  }
});
```

**Why:** Single listener on `document` captures all clicks via event bubbling. Works for dynamic elements automatically.

---

## References

- [Site Configuration Reference](./01-site-configuration-reference.md)
- [Styling Components](./05-styling-components.md)
- [Managing Content](./07-managing-content.md)

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026

## Template Error: Filter Not Found

**Symptom**: `Error: filter not found: selectattr`

**Cause**: Using non-native Nunjucks filters.

**Solution**: Use only native Nunjucks filters:
- `default('value')` - Fallback value
- `safe` - Render HTML without escaping
- `escape` - Escape HTML
- `length` - Array/string length

Avoid filters like `selectattr`, `map`, `reject` unless explicitly added to `.eleventy.js`.
