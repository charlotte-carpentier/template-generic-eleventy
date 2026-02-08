---
title: Security Guide
description: Security configuration and testing procedures for HAT
type: documentation
created: 2026-02-03
updated: 2026-02-05
tags: [security, csp, headers, sri, https, forms, owasp]
---

## Security Architecture

HAT implements defense-in-depth security following OWASP 2026 and MDN best practices.

**Key principles:**

- Content Security Policy (CSP) strict mode for scripts
- Subresource Integrity (SRI) for external resources
- HTTPS enforcement with HSTS preload
- Form validation and file upload hardening
- Anti-clickjacking headers

---

## Configuration Files

### netlify.toml

Security headers configured in `[[headers]]` sections:

```toml
Content-Security-Policy: "script-src 'self' [CDN whitelist]"
Strict-Transport-Security: "max-age=63072000; includeSubDomains; preload"
X-Content-Type-Options: "nosniff"
X-Frame-Options: "DENY"
```

**CSP directives:**

- `script-src 'self'` - No inline scripts (externalized to `core/`)
- `style-src 'unsafe-inline'` - Required for TailwindCSS utilities
- `frame-ancestors 'none'` - Prevent clickjacking

### Core Scripts (base.njk)

External scripts with data attributes:

```html
<script src="/assets/scripts/core/axeptio.js"
  data-client-id="{{ site.cookieConsent.clientId }}">
</script>
```

**Benefits:**

- CSP strict mode without `unsafe-inline`
- Separation of code and configuration
- Cacheable JavaScript files

---

## Subresource Integrity (SRI)

### Current CDN Resources

| Resource | Integrity | Status |
|----------|-----------|--------|
| Font Awesome 6.7.2 | `sha512-Kc323...` | Configured |
| Flag Icons 7.3.2 | `sha384-8olrm...` | Configured |

### Update Procedure

When updating CDN version:

```bash
# Generate new hash
curl -s https://cdn.example.com/file.css | \
  openssl dgst -sha384 -binary | \
  openssl base64 -A

# Update base.njk with new integrity value
integrity="sha384-NEW_HASH_HERE"
```

**Sources:**

- [MDN SRI](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity)
- [W3C SRI Spec](https://w3c.github.io/webappsec-subresource-integrity/)

---

## Form Security

### Netlify Forms Protection

**Configuration** (`section-contact.njk`):

```html
<form method="POST" name="contact" 
  data-netlify="true" 
  data-netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />
  <input type="hidden" name="bot-field" />
</form>
```

**Built-in security:**

- Honeypot spam filtering
- Rate limiting (10 req/min per IP)
- Akismet spam detection

### HTML5 Validation (WCAG 1.3.5)

**Pattern validation** (`input.json`):

- Email: RFC 5322 format
- Phone: E.164 international format
- Text: Unicode-safe patterns

**Autocomplete attributes:**

```json
{
  "autocomplete": "email",     // email fields
  "autocomplete": "tel",        // phone fields
  "autocomplete": "name",       // name fields
  "autocomplete": "organization" // company fields
}
```

### File Upload Security (OWASP)

**Magic numbers validation** (`block-drag-and-drop.js`):

```javascript
// Validates first bytes to prevent MIME spoofing
const MAGIC_NUMBERS = {
  'jpg': [0xFF, 0xD8, 0xFF],
  'png': [0x89, 0x50, 0x4E, 0x47],
  'pdf': [0x25, 0x50, 0x44, 0x46]
};
```

**Additional protections:**

- Filename sanitization (path traversal prevention)
- Extension whitelist + size limits
- Browser-side validation only (Netlify handles server-side)

---

## Security Contact (RFC 9116)

HAT includes `/.well-known/security.txt` for vulnerability disclosure.

**File:** `src/security.njk`

**Annual maintenance:** Update expiration date (see `MAINTENANCE.md`)

---

## Deployment Testing

### 1. Build Validation

```bash
npm run build
grep "integrity" public/index.html  # Verify SRI
cat public/.well-known/security.txt # Verify generation
```

### 2. Online Scanners (post-deployment)

**Headers Check:**

- [Mozilla Observatory](https://observatory.mozilla.org/) - Expected: A-/B+
- [SecurityHeaders.com](https://securityheaders.com/) - Expected: A

**CSP Evaluation:**

- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/) - Expected: Medium risk (style-src)

**Lighthouse:**

```bash
npx lighthouse https://your-site.netlify.app --view
```

Expected: 100/100 Best Practices + Accessibility

### 3. Browser DevTools

```javascript
// Console: check CSP violations (should be 0)
// Network tab: verify SRI validation (no errors)
```

---

## Client Project Checklist

### Before Deployment

- [ ] Configure `site.json` (title, url, domain, analytics)
- [ ] Test Axeptio with client account
- [ ] Verify GA4 tracking
- [ ] Enable Netlify Identity if using Decap CMS
- [ ] Test form submission (Netlify Forms)

### After Deployment

- [ ] Run Mozilla Observatory scan
- [ ] Verify HTTPS certificate valid
- [ ] Test CSP: no console violations
- [ ] Check Netlify Forms inbox (spam filter working)

### Production Hardening (optional)

**Remove `style-src 'unsafe-inline'`:**

1. Extract inline styles to external CSS
2. Generate style hashes: `openssl dgst -sha384`
3. Update CSP with hashes

**Cost:** 10-15h refactoring

**Note:** Material Design, IBM Carbon, Gov.UK all use `unsafe-inline` for styles.

---

## Known Limitations

### Style CSP Compromise

**Issue:** `style-src 'unsafe-inline'` required for TailwindCSS utilities

**Risk:** Low (no user input, static generation)

**Justification:**

- OWASP: "unsafe-inline for styles is lower priority than scripts"
- Google: "Acceptable for utility-first CSS frameworks"

**Mitigation:** Strict `script-src` compensates

---

## Troubleshooting

### CSP Violation Errors

```txt
Refused to load script from 'https://example.com/script.js'
```

**Solution:** Add domain to `script-src` in `netlify.toml`

### SRI Hash Mismatch

```txt
Failed to find a valid digest in 'integrity' attribute
```

**Solution:** Regenerate hash with updated file version

### HSTS Preload Issues

**Validation:** [HSTS Preload List](https://hstspreload.org/)

**Requirement:** Valid HTTPS + correct max-age

---

## Standards Compliance

| Standard | Status | Reference |
|----------|--------|-----------|
| WCAG 2.2 AA | Done | W3C TR/WCAG22 |
| OWASP 2026 | Done | OWASP Cheat Sheets |
| CSP Level 3 | Done | W3C CSP Spec |
| RFC 5322 (Email) | Done | IETF RFC 5322 |
| RFC 9116 (security.txt) | Done | IETF RFC 9116 |
| E.164 (Phone) | Done | ITU-T E.164 |

---

## References

- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)
- [W3C SRI Specification](https://w3c.github.io/webappsec-subresource-integrity/)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
