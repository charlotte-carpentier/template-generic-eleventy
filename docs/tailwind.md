---
title: TailwindCSS Guide
description: Guide for using TailwindCSS v4 with this project
type: documentation
created: 2025-01-15
tags: [tailwind, css, styling]
---

This project uses **TailwindCSS v4** with a **utility-first approach** combined with minimal custom CSS for edge cases.

---

## Architecture

### Hybrid Strategy: 90% Tailwind / 10% Custom CSS

**Default: Use Tailwind utilities directly in Nunjucks templates.**

Custom CSS only when Tailwind is insufficient:

- Complex keyframe animations (`@keyframes`)
- CSS `:target` navigation
- Pseudo-elements (`::-webkit-scrollbar`, `::before`, `::after`)
- Advanced selectors (`:has()`, `:not()`, combinators)

---

## File Structure

```text

## Component Styling Responsibilities

Define clear boundaries for styling at each component level:

| Level | Responsibilities | Does NOT Handle |
|-------|-----------------|-----------------|
| **Atoms** | Intrinsic appearance (colors, typography, padding), states (hover, focus, disabled), variants (primary, secondary, outline) | External margin, positioning relative to other components |
| **Molecules** | Internal layout (flexbox, grid), spacing between child atoms (gap, mb-*), container padding | External margin of the molecule itself |
| **Organisms** | Complex section layouts, spacing between child molecules, responsive breakpoints (md:, lg:) | External margin of the organism itself |

**Key principle**: Components manage their internal spacing (padding), but never their external spacing (margin). The parent component controls spacing between children using `gap`, `flex`, or `grid` utilities.

**Workflow**: Define design tokens in `input.css` first, then apply them to components. This ensures consistency and maintainability.

---
src/assets/styles/
├── input.css                    # Entry point + @theme design tokens
├── 01-atoms/                    # Empty (use Tailwind)
├── 02-molecules/                # Empty (use Tailwind)
└── 03-organisms/
    └── error-layout.css         # Custom CSS (only when necessary)
```

**input.css** contains:

1. TailwindCSS import
2. @source directive (watched templates)
3. Minimal reset + focus styles
4. @theme (design tokens)
5. Custom imports (rare)

---

## Design Tokens

All design tokens are defined in `input.css` under `@theme` and accessible via CSS variables.

### Usage in Tailwind

Use Tailwind's arbitrary value syntax:

```html
<!-- Colors -->
<div class="bg-[var(--color-brand-primary-40)]">

<!-- Typography -->
<h1 class="text-[var(--font-size-4xl)] font-[var(--font-weight-bold)]">

<!-- Spacing & Layout -->
<div class="p-[var(--spacing-component-padding)] rounded-[var(--radius-card)]">

<!-- Elevation -->
<div class="shadow-[var(--elevation-card)]">
```

### Available Tokens

**Typography:** `--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*`, `--letter-spacing-*`

**Colors:** `--color-brand-*`, `--color-neutral-*`, `--color-semantic-*`, `--color-global-*`, `--color-button-*`

**Layout:** `--spacing-*`, `--radius-*`, `--elevation-*`, `--z-*`

See `input.css` for complete list.

---

## Common Patterns

### Buttons with Design Tokens

```html
<button class="inline-flex items-center px-6 py-3 font-semibold rounded-lg 
               bg-[var(--color-button-primary)] 
               hover:bg-[var(--color-button-primary-hover)] 
               text-white transition-colors">
  Click me
</button>
```

For more examples, see [`examples.md`](./examples.md).

---

## Custom CSS (When Necessary)

### Decision Tree

- Can I do this with Tailwind utilities? → **Use Tailwind**
- Needs `@keyframes` animations? → **Custom CSS**
- Needs CSS `:target`? → **Custom CSS**
- Needs `::-webkit-scrollbar`? → **Custom CSS**

### BEM Naming Convention

```css
.error-layout { }              /* Block */
.error-layout__header { }      /* Element */
.error-layout--dark { }        /* Modifier */
```

### Example

**File:** `src/assets/styles/03-organisms/error-layout.css`

```css
/* Animation required for mask reveal (impossible with Tailwind) */
@keyframes halo-reveal {
  from {
    -webkit-mask-position: 0% 50%;
    mask-position: 0% 50%;
  }
  to {
    -webkit-mask-position: 100% 50%;
    mask-position: 100% 50%;
  }
}

.error-layout__halo {
  animation: halo-reveal 2s ease-in-out;
}
```

See [`examples.md`](./examples.md) for complete CSS file structure.

---

## Development Workflow

### Building CSS

```bash
npm run build:css    # Build once
npm run watch:css    # Watch mode
```

Output: `public/output.css` (auto-included in `base.njk`)

---

## Best Practices

1. **Utility-first mindset** - Use Tailwind classes directly in templates
2. **Use design tokens** - `bg-[var(--color-*)]` instead of hex colors
3. **Minimize custom CSS** - Only when Tailwind truly insufficient
4. **Follow BEM** - For custom classes (`.block__element--modifier`)
5. **Comment why** - Explain why custom CSS was necessary

---

## CSS Integration Conventions

### Strategy Overview

**90% Tailwind utilities** applied directly in `.njk` templates  
**10% Custom CSS** only when Tailwind is insufficient

### Component Structure

Each component follows the OMA pattern:

```txt
Component Example: button
├── src/_data/atoms/button.json          # Content data
├── src/_includes/01-atoms/button.njk    # Presentation (macro with Tailwind classes)
├── src/assets/scripts/components/01-atoms/button.js    # Interactions (optional)
└── src/assets/styles/01-atoms/button.css               # Custom CSS (rare, only if needed)
```

### Class Organization in Templates

**Use Nunjucks variables for common classes:**

```njk
{% macro renderButton(label, variant) %}
  {% set baseClasses = "inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-colors" %}
  {% set variantClasses = "" %}
  
  {% if variant == 'primary' %}
    {% set variantClasses = "bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-white" %}
  {% elif variant == 'secondary' %}
    {% set variantClasses = "bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)] text-white" %}
  {% endif %}
  
  <button class="{{ baseClasses }} {{ variantClasses }}">
    {{ label }}
  </button>
{% endmacro %}
```

### Class Order Standard

For readability and maintainability, follow this order:

1. **Layout** - `flex`, `grid`, `block`, `inline-flex`
2. **Positioning** - `absolute`, `relative`, `top-*`, `left-*`
3. **Sizing** - `w-*`, `h-*`, `min-*`, `max-*`
4. **Spacing** - `p-*`, `m-*`, `gap-*`
5. **Typography** - `text-*`, `font-*`, `leading-*`
6. **Colors** - `bg-*`, `text-*`, `border-color-*`
7. **Borders** - `border-*`, `rounded-*`
8. **Effects** - `shadow-*`, `opacity-*`, `transition-*`
9. **Responsive** - `md:*`, `lg:*`, `xl:*`
10. **States** - `hover:*`, `focus:*`, `active:*`, `disabled:*`

**Example:**

```html
<button class="inline-flex items-center px-6 py-3 font-semibold text-white bg-[var(--color-button-primary)] rounded-lg shadow-md transition-colors md:px-8 hover:bg-[var(--color-button-primary-hover)] focus:ring-2">
```

**Automation:** Use Prettier with `prettier-plugin-tailwindcss` to auto-sort classes.

### Variant Management

**JSON (data)** - Store variant type only:

```json
{
  "buttons": [{
    "name": "cta",
    "label": "Get Started",
    "variant": "primary"
  }]
}
```

**Macro (presentation)** - Map variants to classes:

```njk
{% if variant == 'primary' %}
  {% set variantClasses = "bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)]" %}
{% elif variant == 'secondary' %}
  {% set variantClasses = "bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)]" %}
{% endif %}
```

**Never** pass CSS classes as data in JSON.

### Custom CSS (Rare Cases)

Only create custom CSS when Tailwind utilities are insufficient:

- Complex `@keyframes` animations
- CSS `:target` navigation
- Pseudo-elements (`::-webkit-scrollbar`, `::before`, `::after`)
- Advanced selectors impossible with Tailwind

**File structure:**

```txt
src/assets/styles/
├── input.css                           # Main entry (imports components)
├── 01-atoms/
│   └── custom-scrollbar.css           # Only if needed
├── 02-molecules/
│   └── card-animation.css             # Only if needed
└── 03-organisms/
    └── error-layout.css               # Only if needed
```

**Import in `input.css`:**

```css
/* Custom Styles - Import individually by component */

/* Organisms */
@import "./03-organisms/error-layout.css";

/* Molecules */
@import "./02-molecules/card-animation.css";

/* Atoms */
@import "./01-atoms/custom-scrollbar.css";
```

**Use BEM naming:**

```css
/* error-layout.css */
.error-layout { }
.error-layout__header { }
.error-layout__section--active { }
```

### Design Tokens Usage

Always use design tokens from `@theme`:

```html
<!-- Colors -->
<div class="bg-[var(--color-button-primary)]">

<!-- Spacing -->
<div class="p-[var(--spacing-component-padding)]">

<!-- Border radius -->
<div class="rounded-[var(--radius-button)]">

<!-- Shadows -->
<div class="shadow-[var(--elevation-card)]">
```

### Tools Setup

Install Prettier plugin for automatic class sorting:

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

`.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

**See also:**

- [Coding Style Guide](./coding-style.md) - General conventions
- [Code Examples](./examples.md) - Complete component examples

---

## TailwindCSS v4 Key Features

**New in v4:**

- `@theme` directive (replaces config file)
- CSS-first configuration (all in `input.css`)
- No `tailwind.config.js` needed
- `@source` directive (replaces `content` array)

---

## Troubleshooting

For common issues and solutions, see [`TROUBLESHOOTING.md`](../TROUBLESHOOTING.md).

---

## Resources

- [TailwindCSS v4 Documentation](https://tailwindcss.com/docs)
- [CSS Variables in Tailwind](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [Arbitrary Values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)

---

## See Also

- [Coding Style Guide](./coding-style.md) - CSS conventions and BEM naming
- [Code Examples](./examples.md) - Complete code samples with file structure
- [Configuration Guide](./configuration.md) - Site configuration
