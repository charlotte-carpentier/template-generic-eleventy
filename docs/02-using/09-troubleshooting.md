---
title: Troubleshooting
description: Common issues and solutions when using HAT
created: 2025-01-15
---

Common issues and solutions for HAT project development.

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

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
