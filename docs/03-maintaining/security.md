---
title: Security Architecture
description: Security features and design decisions in HAT
created: 2026-02-03
---

Read this to understand the security architecture and how to maintain it.

---

## Security Principles

HAT implements defense-in-depth security following OWASP 2026 and MDN best practices:

- Content Security Policy (CSP) strict mode for scripts
- Subresource Integrity (SRI) for external resources
- HTTPS enforcement with HSTS preload
- Form validation and file upload hardening
- Anti-clickjacking headers

---

## CSP Configuration

**Location**: `netlify.toml` in `[[headers]]` sections

```toml
Content-Security-Policy: "script-src 'self' [CDN whitelist]"
Strict-Transport-Security: "max-age=63072000; includeSubDomains; preload"
X-Content-Type-Options: "nosniff"
X-Frame-Options: "DENY"
```

**Key directives**:

- `script-src 'self'` - No inline scripts (externalized to `core/`)
- `style-src 'unsafe-inline'` - Required for TailwindCSS utilities
- `frame-ancestors 'none'` - Prevent clickjacking

**Core scripts pattern** (`base.njk`):

```html
<script src="/assets/scripts/core/axeptio.js"
  data-client-id="{{ site.cookieConsent.clientId }}">
</script>
```

Benefits: CSP strict mode without `unsafe-inline`, separation of code/config, cacheable files.

---

## SRI Maintenance

**Current CDN resources**:

- Font Awesome 6.7.2: `sha512-Kc323...`
- Flag Icons 7.3.2: `sha384-8olrm...`

**Update procedure when upgrading CDN version**:

```bash
# Generate new hash
curl -s https://cdn.example.com/file.css | \
  openssl dgst -sha384 -binary | \
  openssl base64 -A

# Update base.njk with new integrity value
integrity="sha384-NEW_HASH_HERE"
```

Reference: [MDN SRI](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity)

---

## Architecture Decisions

### Style CSP Compromise

**Decision**: `style-src 'unsafe-inline'` required for TailwindCSS utilities

**Rationale**:

- OWASP: "unsafe-inline for styles is lower priority than scripts"
- Google: "Acceptable for utility-first CSS frameworks"
- Major design systems (Material Design, IBM Carbon, Gov.UK) use same approach

**Risk**: Low (no user input, static generation)

**Mitigation**: Strict `script-src` compensates

**Optional hardening**: Extract inline styles to external CSS, generate hashes (~10-15h refactoring)

### Form Security Strategy

**Netlify Forms protection**:

- Honeypot spam filtering
- Rate limiting (10 req/min per IP)
- Akismet spam detection

**Client-side validation**:

- HTML5 pattern validation (RFC 5322 email, E.164 phone)
- Magic numbers file validation (`block-drag-and-drop.js`)
- Filename sanitization, extension whitelist, size limits

**Browser-only**: Netlify handles server-side validation.

---

## Standards Compliance

| Standard | Status |
| -------- | ------ |
| WCAG 2.2 AA | ✓ |
| OWASP 2026 | ✓ |
| CSP Level 3 | ✓ |
| RFC 9116 (security.txt) | ✓ |

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
