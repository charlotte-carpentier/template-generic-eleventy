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
