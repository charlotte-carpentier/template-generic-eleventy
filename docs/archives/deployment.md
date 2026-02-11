---
title: Deployment Guide
description: Build, test, and deploy HAT sites
type: documentation
created: 2025-01-09
tags: [deployment, performance, testing]
---

## Build

```bash
npm run build  # Production build (minified CSS, optimized images)
```

Output: `public/` folder (upload to host)

---

## Testing

### EcoIndex (Eco-design)

**URL:** <https://www.ecoindex.fr/>  
**Target:** Grade A (>75/100)  
**Criteria:** DOM x3, requests x2, page weight x1

### WebPageTest (Performance)

**URL:** <https://www.webpagetest.org/>  
**Target:** LCP <2.5s, INP <200ms, CLS <0.1  
**Config:** Test location + 3G/4G connection

### Google Search Console (Real users)

**URL:** <https://search.google.com/search-console>  
**When:** 48-72h after deployment  
**Data:** Core Web Vitals from real traffic

---

## Server Config

### Netlify/Vercel

Auto-configured (gzip enabled by default)

### Nginx

```nginx
gzip on;
gzip_vary on;
gzip_types text/css application/javascript image/svg+xml;
gzip_comp_level 6;
```

### Apache

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/css application/javascript
</IfModule>
```

---

## Checklist

### Pre-deployment

- [ ] `npm run build` completed
- [ ] No console errors
- [ ] All links tested
- [ ] Mobile responsive

### Post-deployment

- [ ] Test EcoIndex (target Grade A)
- [ ] Test WebPageTest (Core Web Vitals)
- [ ] Verify gzip enabled (check response headers)
- [ ] Submit sitemap to Search Console

### Monitoring (weekly/monthly)

- [ ] Check Core Web Vitals report
- [ ] Re-test EcoIndex after updates

---

## Resources

- [EcoIndex](https://www.ecoindex.fr/) - Environmental scoring
- [WebPageTest](https://www.webpagetest.org/) - Performance testing
- [Core Web Vitals](https://web.dev/vitals/) - Google metrics guide
- [RGESN](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/) - French eco-design standard

---

May your bugs be forever exiled to the shadow realm ✦
