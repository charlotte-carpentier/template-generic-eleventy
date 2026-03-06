# Présentation HAT Design System
**Format : Live demo navigateur — ~20 min + questions**

---

## PARTIE 1 — Pourquoi HAT existe (5 min)
*Objectif : poser le problème avant de montrer la solution*

### Introduction
> "Livrer des sites cousus main, sans dette technique, à un prix qui concurrence le no-code — sans brader notre expertise, ni nos valeurs."

### Le problème

1. **La promesse du no-code, low-code et de l'IA** : vite, pas cher, sans technicien. La réalité : des sites qui ne respectent pas les standards d'accessibilité et d'éco-conception — dont la sécurité est hors de contrôle et dont la maintenance a un coût caché.

2. **Les exigences de 2026** : un site ne peut plus ignorer la performance UX, le SEO technique, la sécurité, l'accessibilité (obligation légale en France depuis juin 2025) et l'éco-conception. Ce sont des obligations, pas des options.

3. **La question** : Comment vendre notre savoir-faire à un prix concurrentiel ?

### Notre solution HAT
- Un **design system conçu en équipe dev + graphiste**
- Un **squelette de site modulaire**, artisanal et réutilisable
- Des **garanties d'excellence dès le départ** : Lighthouse 100/100, WCAG 2.2 AA, EcoIndex Grade A

> 💬 *"Ce n'est pas un thème. C'est une fondation technique qu'on habille à chaque projet."*

### Les 4 piliers non négociables

| Pilier | Ce que ça garantit |
|---|---|
| 🎯 **UX & SEO technique** | Navigation fluide, structure sémantique, performances maximales |
| ♿ **Accessibilité** | WCAG 2.2 AA — lisible et utilisable par tous, légalement conforme |
| 🔒 **Sécurité** | CSP headers, SRI, aucune dépendance inutile |
| 🌱 **Éco-conception** | EcoIndex Grade A, RGESN 2024 — empreinte minimale |

> 💬 *"Ces 4 points ne sont pas des options qu'on active si le client demande. Ils sont là par défaut, dès le premier commit."*

---

## PARTIE 2 — Comment ça fonctionne (8 min)
*Objectif : expliquer la logique sans noyer dans le code*

### 2.1 — L'Atomic Design : construire comme des Lego

Expliquer visuellement (montrer le preview wireframe) :

```txt
Atomes => Molécules => Organismes => Pages
bouton     carte         hero          home
label      nav item      footer        blog
image      form field    gallery       contact
```

> 💬 *"On part des plus petits éléments pour composer des blocs, puis des pages entières.
> Changer un atome, ça se répercute partout — sans tout rebâtir."*

**Chiffres à citer :** 46 composants — 14 atomes / 19 molécules / 13 organismes

### 2.2 — Les tokens de design : le pont entre Figma et le code

> 💬 *"Le/la graphiste définit les couleurs, les espacements, la typo dans Figma.
> Ces décisions deviennent directement des variables dans le code.
> Zéro retraduction manuelle, zéro perte en route."*

- Les tokens = source de vérité partagée entre le/la graphiste et le dev

### 2.3 — Un CMS sur mesure, pas une boîte noire

> 💬 *"On ne livre pas un CMS générique avec 500 options dont le client n'a besoin que de 3. On configure exactement ce qu'il peut modifier — et on sécurise le reste."*

- **Périmètre défini ensemble** : ce qui est éditable est décidé en amont entre techniciens et client
- **Protection contre la casse** : les zones sensibles sont verrouillées ou signalées — le client est prévenu du risque avant d'agir

### 2.4 — Les métriques : pas du marketing, du contractuel

| Critère | Résultat | Ce que ça veut dire |
|---|---|---|
| Lighthouse | 100/100 | Perf + accessibilité + SEO au maximum |
| WCAG 2.2 AA | Conforme | Légalement sécurisé, référencement amélioré |
| EcoIndex | Grade A | Empreinte carbone minimale |

> Pour le SEO : *"Un site HAT part en pole position — la technique ne sera jamais un frein au référencement."*

---

## PARTIE 3 — La démo live (7 min)
*Objectif : montrer le squelette*

### Ordre de navigation recommandé

1. **Ouvrir le preview wireframe** (screenshot ou localhost)
   > *"Ce que vous voyez là, c'est le squelette neutre. Pas de couleur, pas de typo client. Juste la structure."*

2. **Montrer les différents layouts** (desktop => tablette => mobile)
   > *"Le responsive est intégré dès la conception, pas rajouté après."*

3. **Montrer une page blog avec pagination**
   > *"La pagination, les articles, les catégories — tout est géré nativement."*

4. **Ouvrir l'interface Decap CMS** (si dispo)
   > *"Voilà ce que voit le client. Il édite, il publie. Nous, on n'intervient pas."*

5. **Montrer un Lighthouse audit** (capture ou live)
   > *"100. Pas 98, pas 95. 100. C'est systématique, pas un coup de chance."*

---

## Conclusion — Ce que ça change concrètement (1 min)

> *"HAT nous permet de livrer des sites plus rapides à produire, plus solides techniquement,
> et plus simples à maintenir. Pour le client, c'est invisible — et c'est exactement l'objectif."*

**Pour les graphistes :** bases UX et accessibilité déjà optimisées — le focus est sur le design.
**Pour le SEO :** performances, structure sémantique et accessibilité intégrées nativement — le terrain est prêt.
**Pour les devs :** zéro configuration à répéter — le focus est sur le projet client.

---

## Adaptations selon l'audience

| Public | Insister sur | Alléger |
|---|---|---|
| **Raphaël (co-créateur)** | Décisions d'archi, ce qui a évolué, roadmap | La base — il la connaît |
| **Graphistes** | Tokens Figma ↔ code, wireframe neutre à habiller | Stack technique |
| **Responsable SEO** | Lighthouse 100, WCAG, EcoIndex, perf = SEO | Atomic Design |

---

## Checklist avant la démo

- [ ] localhost:8080 lancé et fonctionnel
- [ ] Capture Lighthouse 100 prête (au cas où la démo live bugue)
- [ ] Preview wireframe visible (screenshot en backup)
- [ ] Interface Decap CMS accessible
- [ ] Mode mobile DevTools prêt pour le responsive
