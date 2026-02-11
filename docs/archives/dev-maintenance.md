---
title: Maintaining HAT Template
description: Maintenance tasks for HAT design system
created: 2026-02-05
---

Guide for maintaining HAT design system over time.

---

## Annual Tasks

### Update Dependencies

```bash
npm audit
npm audit fix
npm outdated
npm update
```

Test after updates: `npm start` and verify all components.

### Update security.txt

Update year in `src/security.njk`:

```nunjucks
Expires: 2028-12-31T23:59:59Z  # Change year
```

Verify: `npm run build && cat public/.well-known/security.txt`

### Review CDN Versions

Check updates:

- Font Awesome: [cdnjs.com/libraries/font-awesome](https://cdnjs.com/libraries/font-awesome)
- Flag Icons: [cdn.jsdelivr.net/gh/lipis/flag-icons](https://cdn.jsdelivr.net/gh/lipis/flag-icons)

Regenerate SRI if updated:

```bash
curl -s https://cdn.example.com/file.css | openssl dgst -sha384 -binary | openssl base64 -A
```

Update in `src/_includes/04-core/base.njk`

---

## Quarterly Tasks

### Test HAT Template

```bash
npm run build
npm start
vitest run tests/accessibility.test.js
```

### Review Security Advisories

- [GitHub Security Advisories](https://github.com/advisories)
- [Snyk Vulnerability Database](https://security.snyk.io/)

---

## Version Upgrades

### Eleventy

```bash
npm install @11ty/eleventy@latest
npm test
npm run build
```

Review [Eleventy Upgrade Guide](https://www.11ty.dev/docs/upgrade-guide/)

### TailwindCSS

```bash
npm install tailwindcss@latest
npm run build:css
```

### Node.js LTS

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

## Deprecation Timeline

Review at [endoflife.date](https://endoflife.date/):

| Dependency | Current | EOL | Action |
| ---------- | ------- | --- | ------ |
| Node 18 | Hydrogen | 2025-04-30 | Upgrade to Node 20 |
| Eleventy 3.x | 3.0.0 | TBD | Monitor releases |
| TailwindCSS v4 | 4.0.0 | TBD | Stable |

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
