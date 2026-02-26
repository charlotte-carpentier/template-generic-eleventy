---
title: Troubleshooting
description: Common issues and solutions when using HAT
created: 2025-01-15
---

Read this to find solutions to common issues.

---

## Contents

- [Contents](#contents)
- [Colors or design tokens not applied](#colors-or-design-tokens-not-applied)
- [Custom styles not appearing](#custom-styles-not-appearing)
- [Fonts not displaying](#fonts-not-displaying)
- [Analytics not tracking](#analytics-not-tracking)
- [Cookie consent widget not showing](#cookie-consent-widget-not-showing)
- [Cannot start development server](#cannot-start-development-server)
- [Changes not reflected in browser](#changes-not-reflected-in-browser)
- [CSP violation errors](#csp-violation-errors)
- [SRI hash mismatch](#sri-hash-mismatch)
- [HSTS preload issues](#hsts-preload-issues)

---

## Colors or design tokens not applied

Design token classes like `bg-[var(--color-brand-primary-40)]` not rendering colors.

**Causes**:

- Variable not defined in `input.css`
- CSS not rebuilt after changes
- Typo in variable name

**Solution**:

1. Check variable exists in `@theme` section of `src/assets/styles/input.css`
2. Rebuild CSS: `npm run build:css`
3. Verify output in `public/output.css`
4. Clear browser cache (Ctrl+Shift+R)

---

## Custom styles not appearing

Custom CSS from your `.css` file not applied to components.

**Causes**:

- File not imported in `input.css`
- Import path incorrect
- CSS not rebuilt

**Solution**:

1. Add import in `src/assets/styles/input.css`:

    ```css
      @import "./03-organisms/your-custom.css";
    ```

2. Rebuild CSS: `npm run build:css`
3. Restart dev server: `npm start`

---

## Fonts not displaying

Google Fonts not appearing on site.

**Causes**:

- Incomplete configuration
- Invalid stylesheet URL
- Browser cache
- `preconnect` not enabled

**Solution**:

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
4. Restart dev server: `npm start`

See [Site Configuration Reference](./01-site-configuration-reference.md).

---

## Analytics not tracking

Google Analytics not receiving data.

**Causes**:

- Invalid Measurement ID format
- Cookie consent not granted
- Browser ad blocker
- Script not loaded

**Solution**:

1. Verify format in `site.json`: `"ga4": "G-XXXXXXXXXX"`
2. Check browser console for errors
3. Use [Google Tag Assistant](https://tagassistant.google.com/) to debug
4. If using Axeptio: ensure cookie consent granted
5. Test in incognito mode without ad blockers

---

## Cookie consent widget not showing

Axeptio cookie consent interface not appearing.

**Causes**:

- Incomplete configuration
- Axeptio project unpublished
- Wrong client ID or version
- Browser blocking script

**Solution**:

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
3. Ensure Axeptio project published at [admin.axeptio.eu](https://admin.axeptio.eu/)
4. Test in incognito mode
5. Verify client ID matches Axeptio dashboard

---

## Cannot start development server

`npm start` fails with EADDRINUSE error.

**Causes**:

- Port 8080 already in use by another process
- Previous server not properly stopped

**Solution**:

**Option A - Kill existing process**:

```bash
# macOS/Linux
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Option B - Change port**:
Edit `package.json`:

```json
"start": "eleventy --serve --port=8081"
```

Then run `npm start` again.

---

## Changes not reflected in browser

Code changes not appearing automatically in browser.

**Causes**:

- Hot reload not watching modified files
- Browser cache
- CSS changes require manual rebuild

**Solution**:

1. For `input.css` changes: Always run `npm run build:css` then refresh browser
2. For other changes: Stop server (Ctrl+C), restart `npm start`
3. Clear browser cache (Ctrl+Shift+R)
4. Check browser console for errors
5. Manually refresh (Ctrl+R or F5)

---

## CSP violation errors

Browser console shows: `Refused to load script from 'https://example.com/script.js'`

**Causes**:

- Script domain not whitelisted in CSP
- Inline script without hash
- Missing `'self'` for local scripts

**Solution**:

1. Add domain to `script-src` in `netlify.toml`:

    ```toml
      Content-Security-Policy = "script-src 'self' https://example.com"
    ```

2. Rebuild and redeploy
3. Clear browser cache
4. Verify in browser console (no errors)

---

## SRI hash mismatch

Browser console shows: `Failed to find a valid digest in 'integrity' attribute`

**Causes**:

- CDN file updated but hash not regenerated
- Typo in integrity attribute
- CDN serving different version

**Solution**:

1. Regenerate hash with current CDN file:

    ```bash
      curl -s https://cdn.example.com/file.css | \
        openssl dgst -sha384 -binary | \
        openssl base64 -A
    ```

2. Update `base.njk` with new integrity value
3. Rebuild: `npm run build`
4. Verify in browser Network tab (resource loads successfully)

---

## HSTS preload issues

Site not appearing in HSTS preload list or browser warnings about HSTS.

**Causes**:

- HTTPS certificate invalid
- Incorrect `max-age` value
- Missing `includeSubDomains` or `preload`

**Solution**:

1. Verify HTTPS certificate valid in browser
2. Check `netlify.toml` header:

    ```toml
      Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
    ```

3. Test with [HSTS Preload List](https://hstspreload.org/)
4. Ensure `max-age` ≥ 31536000 (1 year minimum)

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
