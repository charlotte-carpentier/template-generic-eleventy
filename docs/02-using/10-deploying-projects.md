---
title: Deploying Projects
description: Build and deploy HAT-based projects
created: 2025-01-09
---

Guide for deploying HAT-based projects to production.

---

## Building for Production

Generate production-ready files:

```bash
npm run build
```

Output: `public/` folder (upload this to Netlify).

---

## Pre-Deployment Checklist

### Configuration

- [ ] Update `src/_data/site.json` (title, url, domain)
- [ ] Configure analytics if needed (GA4)
- [ ] Configure cookie consent if needed (Axeptio)
- [ ] Test Axeptio with client account
- [ ] Configure GitHub OAuth for Decap CMS => See [Client Delivery](../03-maintaining/client-delivery.md)

### Testing

```bash
npm run build          # Must succeed
npm start              # Test locally
```

Verify:

- [ ] All pages load correctly
- [ ] Forms work (if applicable)
- [ ] CMS login works at `/admin` (if applicable)
- [ ] No console errors

---

## Deployment

HAT projects deploy to [Netlify](https://www.netlify.com/).

**Configuration**:

- Build command: `npm run build`
- Publish directory: `public`

See [Netlify Eleventy documentation](https://docs.netlify.com/frameworks/eleventy/) for setup.

---

## Post-Deployment Verification

### Basic Checks

- [ ] Site accessible via HTTPS
- [ ] Forms submit correctly (check Netlify Forms inbox)
- [ ] CMS accessible at `/admin` (if using Decap)
- [ ] No browser console errors

### Security Testing

**Headers validation**:

```bash
# Check SRI integrity
grep "integrity" public/index.html

# Verify security.txt generation
cat public/.well-known/security.txt
```

**Online scanners**:

- [Mozilla Observatory](https://observatory.mozilla.org/) - Expected: A-/B+
- [SecurityHeaders.com](https://securityheaders.com/) - Expected: A
- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/) - Expected: Medium risk (style-src)

**Browser DevTools**:

- Console: Check CSP violations (should be 0)
- Network tab: Verify SRI validation (no errors)

### Performance Testing

**Lighthouse**:

```bash
npx lighthouse https://your-site.netlify.app --view
```

Expected: 100/100 Best Practices + Accessibility

**Tools**:

- **EcoIndex**: [ecoindex.fr](https://www.ecoindex.fr/) - Environmental impact (target: Grade A)
- **WebPageTest**: [webpagetest.org](https://www.webpagetest.org/) - Load performance
- **Google Search Console**: [search.google.com](https://search.google.com/search-console) - Real user metrics

HAT targets: Lighthouse 100/100, WCAG 2.2 AA, EcoIndex Grade A.

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
