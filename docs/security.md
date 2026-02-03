---
title: Security Guide
description: Security configuration and testing procedures for HAT
type: documentation
created: 2026-02-03
tags: [security, csp, headers, sri, https]
---

## Security Architecture

HAT implements defense-in-depth security following OWASP 2025 and MDN best practices.

**Key principles:**

- Content Security Policy (CSP) strict mode for scripts
- Subresource Integrity (SRI) for external resources
- HTTPS enforcement with HSTS preload
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
| Font Awesome 6.7.2 | `sha512-Kc323...` | ✅ Configured |
| Flag Icons 7.3.2 | `sha384-8olrm...` | ✅ Configured |

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

## Deployment Testing

### 1. Build Validation

```bash
npm run build
grep "integrity" public/index.html  # Verify SRI present
```

### 2. Online Scanners (post-deployment)

**CSP Evaluation:**

- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- Expected: Medium risk (style-src unsafe-inline)

**Headers Check:**

- [Mozilla Observatory](https://observatory.mozilla.org/)
- Expected: A- to B+ score

**Security Headers:**

- [SecurityHeaders.com](https://securityheaders.com/)
- Expected: A grade

**Lighthouse:**

```bash
npx lighthouse https://your-site.netlify.app --view
``

Expected: 100/100 on Best Practices

### 3. Browser DevTools

```javascript
// Console: check CSP violations
// Network tab: verify SRI validation (no errors)
```

---

## Client Project Checklist

### Before Deployment

- [ ] Configure `site.json` with real credentials
- [ ] Test Axeptio with client account
- [ ] Verify GA4 tracking with client property
- [ ] Enable Netlify Identity if using Decap CMS

### After Deployment

- [ ] Run Mozilla Observatory scan
- [ ] Check Google Search Console (no security warnings)
- [ ] Verify HTTPS certificate valid
- [ ] Test CSP: no console violations

### Production Hardening (optional)

If client requires stricter CSP:

1. Extract inline styles to external CSS
2. Generate style hashes: `openssl dgst -sha384`
3. Remove `unsafe-inline` from `style-src`
4. **Cost:** 10-15h refactoring

**Note:** Material Design, IBM Carbon, Gov.UK all use `unsafe-inline` for styles.

---

## Known Limitations

### Style CSP Compromise

**Issue:** `style-src 'unsafe-inline'` required for TailwindCSS utilities

**Risk:** Low (no user input, static generation)

**Justification:**

- OWASP: "unsafe-inline for styles is lower priority than scripts"
- Google: "Acceptable for utility-first CSS frameworks"
- Industry: All major design systems use this approach

**Mitigation:** Strict `script-src` compensates for style risk

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

**Requirement:** Valid HTTPS certificate + correct max-age

**Validation:** [HSTS Preload List](https://hstspreload.org/)

---

## References

- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Netlify Headers Documentation](https://docs.netlify.com/routing/headers/)
- [W3C SRI Specification](https://w3c.github.io/webappsec-subresource-integrity/)
