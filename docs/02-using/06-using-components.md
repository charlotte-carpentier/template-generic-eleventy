---
title: Using Components
description: How to use HAT components in your pages
created: 2025-01-15
---

Guide for using HAT components to build pages.

---

## Importing Components

Import macros at the top of your page:

```njk
{% from "01-atoms/button.njk" import renderButton %}
{% from "01-atoms/heading.njk" import renderHeading %}
{% from "02-molecules/card.njk" import renderCard %}
{% from "03-organisms/section-hero.njk" import renderSectionHero %}
```

---

## Basic Usage

Each component requires two props:

- `name`: Identifier from JSON file
- `datas`: Array of component data

**Button example**:

```njk
{{ renderButton({
    name: "ctaHero",
    datas: atoms.button.buttons
}) }}
```

This renders the button with `name: "ctaHero"` from `button.json`.

---

## Accessing Data

HAT provides data through global objects:

- `atoms.*` - Atom components
- `molecules.*` - Molecule components  
- `organisms.*` - Organism components

**File to data path**:

- `atoms/button.json` => `atoms.button.buttons`
- `molecules/card.json` => `molecules.card.cards`
- `organisms/section-hero.json` => `organisms["section-hero"].sectHeros`

Note: Use bracket notation for hyphenated names.

---

## Components with Dependencies

Molecules and organisms need sub-component data:

```njk
{{ renderCard({
    name: "serviceCard1",
    datas: molecules.card.cards,
    headingDatas: atoms.heading.headings,
    buttonDatas: atoms.button.buttons,
    iconDatas: atoms.icon.icons
}) }}
```

**Required dependencies** are listed in each component's header under "Props".

---

## Page Example

Complete hero section:

```njk
{# Import components #}
{% from "03-organisms/section-hero.njk" import renderSectionHero %}

{# Render hero #}
{{ renderSectionHero({
    name: "homeHero",
    datas: organisms["section-hero"].sectHeros,
    headingDatas: atoms.heading.headings,
    imageDatas: atoms.image.images,
    buttonDatas: atoms.button.buttons,
    iconDatas: atoms.icon.icons
}) }}
```

This renders a complete hero section with heading, image, and CTA buttons.

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
