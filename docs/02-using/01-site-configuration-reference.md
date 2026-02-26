---
title: Site Configuration Reference
description: Complete reference for all site.json configuration fields
created: 2025-01-15
---

Read this to find the complete field reference for src/_data/site.json.

---

## Required Fields

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `title` | string | - | Site title (fallback for pages without title) |
| `description` | string | - | Site description for SEO and social sharing |
| `url` | string | - | Full site URL (e.g., `https://example.com`) |

---

## Recommended Fields

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `domain` | string | - | Domain name (used in `security.njk` for security.txt) |
| `language` | string | `"fr"` | HTML `<html lang="">` attribute |
| `locale` | string | `"fr_FR"` | OpenGraph locale metadata |
| `themeColor` | string | `"#ffffff"` | Browser theme color (mobile UI) |

---

## Optional Fields

### SEO and Metadata

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `views` | object | - | Page-specific title/description overrides |
| `socialImage` | string | - | Default Open Graph/Twitter card image path |
| `twitterHandle` | string | - | Twitter account (format: `@username`) |
| `author` | string | - | Default author name for articles |

### Favicons

All fields optional with fallback paths to `/assets/icons/favicon/`. Generate multi-format favicons with [RealFaviconGenerator](https://realfavicongenerator.net/).

| Field | Type | Dimensions | Description |
| ----- | ---- | ---------- | ----------- |
| `favicon.png16` | string | 16x16px | Browser tabs (standard) |
| `favicon.png32` | string | 32x32px | Browser tabs (retina) |
| `favicon.ico` | string | Multi-size | Legacy browsers |
| `favicon.appleTouch` | string | 180x180px | iOS home screen |
| `favicon.svg` | string | Vector | Modern browsers |

### Typography

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `fonts.primary` | string | `"Inter"` | Primary font name (documentation only) |
| `fonts.secondary` | string | `"Merriweather"` | Secondary font name (documentation only) |
| `fonts.preconnect` | boolean | `false` | Enable DNS prefetch for Google Fonts |
| `fonts.google` | string | `""` | Google Fonts stylesheet URL |

Browse fonts at [fonts.google.com](https://fonts.google.com/).

### Integrations

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `iconLibrary.fontAwesome` | boolean | `false` | Enable Font Awesome 6.7.2 (CDN with SRI) |
| `analytics.ga4` | string | `""` | Google Analytics 4 Measurement ID |
| `cookieConsent.provider` | string | `""` | Cookie consent provider (`"axeptio"`) |
| `cookieConsent.clientId` | string | `""` | Axeptio client ID |
| `cookieConsent.cookiesVersion` | string | `""` | Axeptio version (format: `domain-REGION`) |

### Performance

| Field | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `preloadImages` | array | `[]` | Critical image paths for LCP optimization |

---

## Complex Configurations

### Page-Specific Metadata (views)

Override title/description per page:

```json
{
  "views": {
    "/": {
      "title": "Home - Your Site Name",
      "description": "Homepage description"
    },
    "/about/": {
      "title": "About Us",
      "description": "Learn more"
    }
  }
}
```

### Google Fonts

Both fields must be set together. Get stylesheet URL from [fonts.google.com](https://fonts.google.com/):

```json
{
  "fonts": {
    "preconnect": true,
    "google": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
  }
}
```

**Custom fonts**: Add `@font-face` in `src/assets/styles/input.css`, leave `fonts.google` empty.

### Google Analytics 4

Get Measurement ID from [analytics.google.com](https://analytics.google.com/) ([setup guide](https://support.google.com/analytics/answer/9304153)):

```json
{
  "analytics": {
    "ga4": "G-XXXXXXXXXX"
  }
}
```

**Features**: Consent Mode v2, IP anonymization, Axeptio integration.

### Cookie Consent (Axeptio)

All three fields required. Get credentials from [admin.axeptio.eu](https://admin.axeptio.eu/) ([documentation](https://developers.axeptio.eu/)):

```json
{
  "cookieConsent": {
    "provider": "axeptio",
    "clientId": "your-id",
    "cookiesVersion": "domain-EU"
  }
}
```

---

## Complete Example

```json
{
  // Required
  "title": "Acme Corp",
  "description": "Innovative solutions",
  "url": "https://acme.com",
  
  // Recommended
  "domain": "acme.com",
  "language": "en",
  "locale": "en_US",
  "themeColor": "#3b82f6",
  
  // SEO
  "socialImage": "/assets/images/og.jpg",
  "twitterHandle": "@acme",
  "views": {
    "/": {
      "title": "Home - Acme Corp",
      "description": "Homepage"
    }
  },
  
  // Fonts (both fields together)
  "fonts": {
    "preconnect": true,
    "google": "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
  },
  
  // Analytics (all three fields for Axeptio)
  "cookieConsent": {
    "provider": "axeptio",
    "clientId": "abc123",
    "cookiesVersion": "acme-com-EU"
  },
  "analytics": {
    "ga4": "G-XXXXXXXXXX"
  }
}
```

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
