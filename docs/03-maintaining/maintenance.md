---
title: Maintenance Guide
description: Periodic maintenance tasks for HAT template
type: documentation
created: 2026-02-05
tags: [maintenance, security, dependencies, updates]
---

## Annual Tasks (Every January)

### 1. Update security.txt expiration

**File:** `src/security.njk`

```nunjucks
Expires: 2028-12-31T23:59:59Z  # Update year
```

**Verify:**

```bash
npm run build
cat public/.well-known/security.txt
```

### 2. Audit npm dependencies

```bash
npm audit
npm audit fix
npm outdated
```

**If high/critical vulnerabilities:**

```bash
npm audit fix --force
npm test  # Verify no breaking changes
```

### 3. Review CDN versions

**Font Awesome:** <https://cdnjs.com/libraries/font-awesome>

**Flag Icons:** <https://cdn.jsdelivr.net/gh/lipis/flag-icons>

**If updated, regenerate SRI:**

```bash
curl -s https://cdn.example.com/file.css | \
  openssl dgst -sha384 -binary | \
  openssl base64 -A
```

Update `src/_includes/04-core/base.njk`

---

## Quarterly Tasks

### Security scans (post-deployment)

- [ ] [Mozilla Observatory](https://observatory.mozilla.org/)
- [ ] [SecurityHeaders.com](https://securityheaders.com/)
- [ ] Lighthouse audit: `npx lighthouse https://site.com --view`

**Expected scores:**

- Observatory: A-/B+
- SecurityHeaders: A
- Lighthouse: 100/100 (Performance, Accessibility, Best Practices, SEO)

---

## Before Client Deployment

### Configuration

- [ ] Update `src/_data/site.json`:
  - `title`, `description`
  - `url`, `domain`
  - `analytics.ga4` (if applicable)
  - `cookieConsent.clientId` (Axeptio)
- [ ] Remove placeholder images (`src/assets/images/placeholders/`)
- [ ] Update `README.md` with client project name

### Testing

- [ ] Build: `npm run build`
- [ ] Test forms: Submit contact form via Netlify
- [ ] Test analytics: Verify GA4 events
- [ ] Test Decap CMS: Login to `/admin`
- [ ] Full Lighthouse audit

### Deployment

- [ ] Connect Netlify to Git repository
- [ ] Configure custom domain DNS
- [ ] Enable HTTPS (automatic)
- [ ] Verify `/.well-known/security.txt` accessible

---

## After Client Deployment

### Verification checklist

- [ ] Run Mozilla Observatory scan
- [ ] Check Google Search Console (no security warnings)
- [ ] Verify HTTPS certificate valid
- [ ] Test CSP: No console violations
- [ ] Verify Netlify Forms: Check spam folder

### Handoff to client

- [ ] Provide Decap CMS login credentials
- [ ] Document content editing workflow
- [ ] Configure Netlify email notifications
- [ ] Set up backup schedule (Netlify handles automatically)

---

## Emergency Procedures

### Security vulnerability disclosed

1. Check `/.well-known/security.txt` for reporter contact
2. Assess severity (CVSS score)
3. If critical: Disable affected feature immediately
4. Apply patch or workaround
5. Test thoroughly before redeployment
6. Notify affected clients

### CDN compromise (SRI mismatch)

```text
Failed to find a valid digest in 'integrity' attribute
```

**Immediate action:**

1. Check CDN status: <https://status.cloudflare.com>
2. If CDN compromised: Remove CDN link from `base.njk`
3. Self-host resource temporarily
4. Monitor CDN vendor security advisory

---

## Version Upgrade Guide

### Eleventy major version

```bash
npm outdated @11ty/eleventy
npm install @11ty/eleventy@latest
npm test
npm run build  # Check for breaking changes
```

**Review:** <https://www.11ty.dev/docs/upgrade-guide/>

### TailwindCSS v5 (when released)

```bash
npm install tailwindcss@latest
npm run build:css
```

**Review:** Breaking changes in Tailwind migration guide

### Node.js LTS upgrade

**Current:** Node 18 LTS (Hydrogen)

**Next LTS:** Node 20+ (2026)

**Update:**

```bash
nvm install 20
nvm use 20
npm ci
npm test
```

Update `package.json`:

```json
"engines": {
  "node": ">=20.0.0"
}
```

---

## Monitoring Recommendations

### Automated checks (optional)

**GitHub Actions workflow** (`.github/workflows/audit.yml`):

```yaml
name: Security Audit
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit
```

### Manual checks (monthly)

- Check Netlify deploy logs for errors
- Review Netlify Forms spam rate
- Monitor Google Analytics anomalies
- Check HTTPS certificate expiration (30 days before)

---

## Deprecation Timeline

**Review quarterly:** <https://endoflife.date/>

| Dependency | Current | EOL | Action |
|------------|---------|-----|--------|
| Node 18 | Hydrogen | 2025-04-30 | Upgrade to Node 20 |
| Eleventy 3.x | 3.0.0 | TBD | Monitor release notes |
| TailwindCSS v4 | 4.0.0 | TBD | Stable, no action |

---

## Support Resources

**Template issues:** <https://github.com/charlotte-carpentier/template-generic-eleventy/issues>

**Eleventy:** <https://www.11ty.dev/docs/>

**Netlify:** <https://docs.netlify.com/>

**Security advisories:**

- [GitHub Security Advisories](https://github.com/advisories)
- [Snyk Vulnerability Database](https://security.snyk.io/)
