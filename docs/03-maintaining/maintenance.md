---
title: Maintaining Projects
description: Essential checklist for HAT-based projects
created: 2026-02-05
---

Read this to know what to check before and after deploying a client project.

---

## Before Deployment

### Configuration

Update `src/_data/site.json`:

```json
{
  "title": "Your Site Title",
  "description": "Your site description",
  "url": "https://yourdomain.com",
  "domain": "yourdomain.com"
}
```

Add analytics/cookie consent only if needed.

### Testing

```bash
npm run build          # Must succeed
npm start              # Test locally
```

Verify:

- All pages load
- Forms work
- CMS login works at `/admin`

---

## After Deployment

### Verify Site Works

- [ ] Site accessible via HTTPS
- [ ] Forms submit correctly
- [ ] CMS accessible at `/admin`
- [ ] No console errors

---

## Annual Maintenance

### Update Dependencies

```bash
npm audit              # Check security issues
npm audit fix          # Fix if needed
```

### Update security.txt

Change year in `src/security.njk`:

```nunjucks
Expires: 2028-12-31T23:59:59Z  # Update year
```

Rebuild: `npm run build`

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
