# Configuration Guide

This guide explains how to configure your site using `src/_data/site.json` and the base template (`src/_includes/04-core/base.njk`).

## Table of Contents

- [Configuration Guide](#configuration-guide)
  - [Table of Contents](#table-of-contents)
  - [Basic Configuration](#basic-configuration)
    - [Minimum Required Fields](#minimum-required-fields)
  - [SEO and Metadata](#seo-and-metadata)
    - [Page-Specific Metadata](#page-specific-metadata)
    - [Social Sharing Image](#social-sharing-image)
    - [Theme Color](#theme-color)
  - [Favicons](#favicons)
  - [Typography](#typography)
    - [Font Configuration](#font-configuration)
    - [Using Google Fonts](#using-google-fonts)
    - [Using Custom Fonts](#using-custom-fonts)
  - [Optional Integrations](#optional-integrations)
    - [Google Fonts](#google-fonts)
    - [Font Awesome](#font-awesome)
    - [Google Analytics](#google-analytics)
    - [Cookie Consent (Axeptio)](#cookie-consent-axeptio)
  - [Performance Optimization](#performance-optimization)
    - [Image Preloading](#image-preloading)
    - [Icon Sprite Preloading](#icon-sprite-preloading)
  - [Complete Configuration Example](#complete-configuration-example)
  - [Troubleshooting](#troubleshooting)
    - [Fonts not loading](#fonts-not-loading)
    - [Analytics not tracking](#analytics-not-tracking)
    - [Cookie consent not appearing](#cookie-consent-not-appearing)
  - [Next Steps](#next-steps)

---

## Basic Configuration

### Minimum Required Fields

Edit `src/_data/site.json`:

```json
{
  "title": "Your Site Title",
  "description": "Your site description for SEO",
  "url": "https://yourdomain.com",
  "language": "en"
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | Required | Site title (fallback for pages without title) |
| `description` | `string` | Required | Site description for SEO and social sharing |
| `url` | `string` | Required | Full site URL (e.g., `https://example.com`) |
| `language` | `string` | `"en"` | Language code for `<html lang="">` attribute |

---

## SEO and Metadata

### Page-Specific Metadata

Configure metadata for specific pages using the `views` object:

```json
{
  "views": {
    "/": {
      "title": "Home - Your Site Name",
      "description": "Homepage description"
    },
    "/about/": {
      "title": "About Us - Your Site Name",
      "description": "Learn more about us"
    },
    "/contact/": {
      "title": "Contact - Your Site Name",
      "description": "Get in touch with our team"
    }
  }
}
```

Page-specific titles and descriptions override the global `title` and `description`.

### Social Sharing Image

Set the default image for social media sharing (Open Graph and Twitter Cards):

```json
{
  "socialImage": "/assets/images/social-share.jpg"
}
```

**Recommended dimensions:** 1200x630px (2:1 ratio)

### Theme Color

Set the browser theme color (affects mobile browser UI):

```json
{
  "themeColor": "#3b82f6"
}
```

---

## Favicons

Configure favicon files in the `favicon` object:

```json
{
  "favicon": {
    "png16": "/assets/icons/favicon/favicon-16x16.png",
    "png32": "/assets/icons/favicon/favicon-32x32.png",
    "ico": "/assets/icons/favicon/favicon.ico",
    "appleTouch": "/assets/icons/favicon/apple-touch-icon.png",
    "svg": "/assets/icons/favicon/favicon.svg"
  }
}
```

| File | Dimensions | Required | Usage |
|------|------------|----------|-------|
| `png16` | 16x16px | ✅ Yes | Browser tabs (standard) |
| `png32` | 32x32px | ✅ Yes | Browser tabs (retina) |
| `ico` | Multi-size | ✅ Yes | Legacy browsers |
| `appleTouch` | 180x180px | ⚠️ Recommended | iOS home screen |
| `svg` | Vector | ⚠️ Optional | Modern browsers |

**Tools:**

- [Favicon Generator](https://realfavicongenerator.net/)
- [MDN Favicon Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML#adding_custom_icons_to_your_site)

---

## Typography

### Font Configuration

Configure your site's typography in the `fonts` object:

```json
{
  "fonts": {
    "primary": "Inter",
    "secondary": "Merriweather",
    "preconnect": false,
    "google": ""
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `primary` | `string` | `"Inter"` | Primary font name (for documentation) |
| `secondary` | `string` | `"Merriweather"` | Secondary font name (for documentation) |
| `preconnect` | `boolean` | `false` | Enable DNS prefetch for Google Fonts |
| `google` | `string` | `""` | Google Fonts stylesheet URL |

### Using Google Fonts

1. Go to [Google Fonts](https://fonts.google.com/)
2. Select your fonts and weights
3. Copy the stylesheet URL
4. Configure in `site.json`:

```json
{
  "fonts": {
    "primary": "Inter",
    "secondary": "Merriweather",
    "preconnect": true,
    "google": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:wght@400;700&display=swap"
  }
}
```

### Using Custom Fonts

For self-hosted fonts:

1. Place font files in `src/assets/fonts/custom/`
2. Add `@font-face` declarations in `src/assets/styles/input.css`:

   ```css
   @font-face {
     font-family: 'CustomFont';
     src: url('/assets/fonts/custom/CustomFont-Regular.woff2') format('woff2');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```

3. Leave `fonts.google` empty in `site.json`

---

## Optional Integrations

All third-party integrations are **disabled by default**. Enable them by configuring the appropriate fields in `site.json`.

### Google Fonts

**Enable:** Set `fonts.preconnect` to `true` and provide `fonts.google` URL

```json
{
  "fonts": {
    "preconnect": true,
    "google": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
  }
}
```

**Disable:** Leave `fonts.google` empty or set `fonts.preconnect` to `false`

```json
{
  "fonts": {
    "preconnect": false,
    "google": ""
  }
}
```

---

### Font Awesome

**Enable:** Set `iconLibrary.fontAwesome` to `true`

```json
{
  "iconLibrary": {
    "fontAwesome": true
  }
}
```

**Disable:** Set to `false` (default)

```json
{
  "iconLibrary": {
    "fontAwesome": false
  }
}
```

**Version:** Font Awesome 6.7.2 (loaded from cdnjs with SRI integrity check)

**Alternative:** Consider using SVG sprites (`src/assets/icons/sprites/`) for better performance and customization.

---

### Google Analytics

**Enable:** Set `analytics.ga4` to your Measurement ID

```json
{
  "analytics": {
    "ga4": "G-XXXXXXXXXX"
  }
}
```

**Disable:** Leave empty (default)

```json
{
  "analytics": {
    "ga4": ""
  }
}
```

**Setup:**

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com/)
2. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add it to `site.json`

**Features:**

- Google Consent Mode v2 compliant
- IP anonymization enabled
- Cookie flags configured for security (`SameSite=None;Secure`)
- Integrates with Axeptio cookie consent

**Resources:**

- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [Google Consent Mode](https://developers.google.com/tag-platform/devguides/consent)

---

### Cookie Consent (Axeptio)

**Enable:** Configure `cookieConsent` object

```json
{
  "cookieConsent": {
    "provider": "axeptio",
    "clientId": "your-client-id-here",
    "cookiesVersion": "yourdomain-com-REGION"
  }
}
```

**Disable:** Leave fields empty (default)

```json
{
  "cookieConsent": {
    "provider": "",
    "clientId": "",
    "cookiesVersion": ""
  }
}
```

**Setup:**

1. Create an Axeptio account at [admin.axeptio.eu](https://admin.axeptio.eu/)
2. Configure your cookie consent project
3. Copy your Client ID
4. Set your cookies version (format: `domain-REGION`, e.g., `example-com-EU`)
5. Add credentials to `site.json`

**Features:**

- Google Consent Mode v2 integration
- GDPR/CCPA compliance
- Automatic consent storage
- User preference management

**Resources:**

- [Axeptio Documentation](https://developers.axeptio.eu/)
- [Google Consent Mode Integration](https://developers.axeptio.eu/google-consent-mode/)

---

## Performance Optimization

### Image Preloading

Preload critical images (hero images, above-the-fold content) to improve Largest Contentful Paint (LCP):

```json
{
  "preloadImages": [
    "/assets/images/hero.jpg",
    "/assets/images/logo.svg"
  ]
}
```

**Best practices:**

- Only preload 1-2 critical images
- Prioritize above-the-fold content
- Use for LCP elements only

**Resources:**

- [Preload Critical Assets](https://web.dev/preload-critical-assets/)
- [Optimize LCP](https://web.dev/optimize-lcp/)

### Icon Sprite Preloading

The template automatically preloads the icon sprite for instant display:

```html
<link rel="preload" href="/assets/icons/sprite.svg" as="image" type="image/svg+xml">
```

No configuration needed - this is enabled by default in `base.njk`.

---

## Complete Configuration Example

Here's a fully configured `site.json` example:

```json
{
  "title": "Acme Corporation",
  "description": "We build innovative solutions for modern businesses",
  "url": "https://acme.com",
  "language": "en",
  "themeColor": "#3b82f6",
  "socialImage": "/assets/images/social-share.jpg",
  "views": {
    "/": {
      "title": "Home - Acme Corporation",
      "description": "Innovative solutions for modern businesses"
    },
    "/about/": {
      "title": "About Us - Acme Corporation",
      "description": "Learn about our mission and team"
    },
    "/contact/": {
      "title": "Contact - Acme Corporation",
      "description": "Get in touch with our team"
    }
  },
  "favicon": {
    "png16": "/assets/icons/favicon/favicon-16x16.png",
    "png32": "/assets/icons/favicon/favicon-32x32.png",
    "ico": "/assets/icons/favicon/favicon.ico",
    "appleTouch": "/assets/icons/favicon/apple-touch-icon.png",
    "svg": "/assets/icons/favicon/favicon.svg"
  },
  "fonts": {
    "primary": "Inter",
    "secondary": "Merriweather",
    "preconnect": true,
    "google": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Merriweather:wght@400;700&display=swap"
  },
  "iconLibrary": {
    "fontAwesome": false
  },
  "preloadImages": [
    "/assets/images/hero.jpg"
  ],
  "cookieConsent": {
    "provider": "axeptio",
    "clientId": "abc123def456",
    "cookiesVersion": "acme-com-EU"
  },
  "analytics": {
    "ga4": "G-ABC123XYZ"
  }
}
```

---

## Troubleshooting

### Fonts not loading

**Issue:** Google Fonts not appearing on the site

**Solutions:**

1. Verify `fonts.preconnect` is set to `true`
2. Check that `fonts.google` URL is valid
3. Test URL in browser to ensure it returns CSS
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Analytics not tracking

**Issue:** Google Analytics not receiving data

**Solutions:**

1. Verify Measurement ID format: `G-XXXXXXXXXX`
2. Check browser console for errors
3. Use [Google Tag Assistant](https://tagassistant.google.com/) to debug
4. Ensure cookie consent is granted (if using Axeptio)

### Cookie consent not appearing

**Issue:** Axeptio widget not showing

**Solutions:**

1. Verify all three fields are filled: `provider`, `clientId`, `cookiesVersion`
2. Check browser console for JavaScript errors
3. Ensure Axeptio project is published
4. Test in incognito/private mode

---

## Next Steps

- Configure your site settings in `src/_data/site.json`
- Set up content management with [Decap CMS](./decap-cms.md)
- Customize styling with [TailwindCSS](./tailwind.md)
- Learn about [naming conventions](./conventions.md)
