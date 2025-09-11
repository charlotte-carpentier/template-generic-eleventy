# Troubleshooting – Template Generic Eleventy

Historique des problèmes rencontrés et solutions appliquées.

---

## Eleventy

### Erreur : "Template not found"

- **Contexte** : Eleventy v2, chemins `_includes/`
- **Cause** : mauvais alias de dossier dans `.eleventy.js`
- **Solution** : vérifier que `addPassthroughCopy` et `dir.includes` pointent sur `_includes`

---

## Tailwind

### Classe personnalisée non appliquée

- **Contexte** : Tailwind v4, usage de `@theme`
- **Cause** : variable non déclarée dans `input.css`
- **Solution** : déclarer dans `@theme` avant utilisation, rebuild

---

## Netlify

### Déploiement échoue : "Build command not found"

- **Contexte** : Netlify, build Eleventy
- **Solution** : configurer `build = "npm run build"` dans `netlify.toml`
