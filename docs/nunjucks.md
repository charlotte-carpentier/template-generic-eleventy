---
title: Nunjucks Guide
description: Guide for using Nunjucks templating with Eleventy
type: documentation
created: 2025-01-15
updated: 2025-10-10
tags: [nunjucks, templates, templating]
---

## Macro Pattern

### Standard Structure

```njk
{% macro renderComponent(options) %}
  {# Validate required props #}
  {% if not options.datas %}
    <span class="error" role="alert">Error: Missing required prop (datas)</span>
  {% elif not options.name %}
    <span class="error" role="alert">Error: Missing required prop (name)</span>
  {% else %}
    {# Find component using universal filter #}
    {% set componentData = options.datas | findByName(options.name) %}
    
    {# Render or error #}
    {% if not componentData %}
      <span class="error" role="alert">Component not found: {{ options.name }}</span>
    {% else %}
      <element 
        data-component-name="{{ componentData.name }}"
        data-component-type="component"
      >
        {{ componentData.text }}
      </element>
    {% endif %}
  {% endif %}
{% endmacro %}
```

### Usage

```njk
{% from "01-atoms/button.njk" import renderButton %}

{{ renderButton({
    name: "demoButton1",
    datas: atoms.button.buttons
}) }}
```

---

## Component Navigation

### Pattern

```njk
{# ━━━━━━━━━━━━━━━━━━━━━━━━━━
  3. Tailwind Classes
  Index:
  3.1 Base Classes
  3.2 Size Classes
  3.3 Variant Classes
  3.4 Icon Classes
━━━━━━━━━━━━━━━━━━━━━━━━━ #}

{# --------------------------
    3.1 Base Classes
    Description: Layout, typography, transition, focus states
--------------------------#}
{% set baseClasses = "inline-flex items-center ..." %}
```

### Standard Sections

1. Validate Props
2. Compute Final Values
3. Tailwind Classes (with index if >3 subsections)
4. Render HTML

---

## Default Values

### Pattern bis

Apply `| default()` once at variable initialization, then use variable in conditions:

```njk
{# Section 2: Compute Final Values #}
{% set buttonSize = buttonData.size | default('medium') %}
{% set buttonVariant = buttonData.variant | default('primary') %}

{# Section 3: Use variables in conditions #}
{% if buttonSize == 'small' %}
  {% set sizeClasses = "..." %}
{% elif buttonSize == 'medium' %}
  {% set sizeClasses = "..." %}
{% endif %}
```

**Never duplicate code in `{% else %}`** - maintain single source of truth.

---

## Universal Filter

**Since Phase 3**, all components use the `findByName` custom filter for optimal performance.

### Configuration (.eleventy.js)

```javascript
eleventyConfig.addFilter("findByName", function(data, name) {
  if (!data || !name) return null;
  
  // Case 1: Flat array (button, image, input, etc.)
  if (Array.isArray(data)) {
    return data.find(item => item.name === name || item.id === name);
  }
  
  // Case 2: Nested object with categories (icon)
  if (typeof data === 'object') {
    for (const category in data) {
      if (Array.isArray(data[category])) {
        const found = data[category].find(item => item.name === name || item.id === name);
        if (found) return found; // Stop immediately when found
      }
    }
  }
  
  return null;
});
```

### Benefits

- ✅ **Performance**: JavaScript `.find()` stops immediately when found
- ✅ **Zero loop risk**: Native method guarantees return
- ✅ **Universal**: Works for flat arrays AND nested objects
- ✅ **DRY**: Single filter for all components

---

## Naming Conventions

### Parameters

Always use `options` (never `option`)

```njk
{% macro renderButton(options) %}
```

### Data Attributes

Pattern: `data-{component}-{property}="value"`

```njk
data-button-name="{{ buttonData.name }}"
data-button-type="button"
data-checkbox-id="{{ checkbox.id }}"
data-checkbox-type="checkbox"
```

---

## Error Messages

**WCAG 2.2 AA Compliance** - All error messages follow accessibility guidelines:

### Standard Pattern

```njk
{# Props validation errors #}
<span class="error" role="alert">Error: Missing required prop (datas)</span>
<span class="error" role="alert">Error: Missing required prop (name)</span>

{# Component not found errors #}
<span class="error" role="alert">Button not found: {{ options.name }}</span>
<span class="error" role="alert">Icon not found: {{ options.name }}</span>

{# Type errors (input only) #}
<span class="error" role="alert">Unsupported input type: {{ inputType }}</span>
```

### Key Points

- ✅ Always include `role="alert"` for screen reader announcement
- ✅ Clear, descriptive text
- ✅ Component name in message
- ✅ Uniform pattern across all atoms

---

## Nested Data Structures

### Reading Sub-components

Figma design system may have nested structures:

```njk
{% set boxData = checkbox.box | default({}) %}
{% set isChecked = boxData.checked | default(false) %}
{% set checkboxValue = boxData.value | default(checkbox.id) %}
```

### Fallback Cascade

```njk
{% set finalTag = options.tag | default(headingData.tag) | default('p') %}
```

---

## Validation Pattern

### Props Validation Order

1. Check `options.datas`
2. Check `options.name` or `options.id`
3. Find using universal filter
4. Render or show error

```njk
{% if not options.datas %}
  <span class="error" role="alert">Error: Missing required prop (datas)</span>
{% elif not options.name %}
  <span class="error" role="alert">Error: Missing required prop (name)</span>
{% else %}
  {% set componentData = options.datas | findByName(options.name) %}
  {# Process #}
{% endif %}
```

---

## Native Filters

```njk
{{ value | default('fallback') }}
{{ text | safe }}
{{ text | escape }}
{{ number | length }}
```

Avoid non-native filters like `selectattr`.

---

## Header Format

```njk
{#
  Props:
    - options.name (string): Component identifier
    - options.datas (array): Component configuration

  Usage — Summon HAT Components Wisely:
    {% from "01-atoms/component.njk" import renderComponent %}
    {{ renderComponent({ name: "demo", datas: atoms.component.items }) }}

  @created 2025-01-15
#}
```

Never remove "Summon HAT Components Wisely:" from headers.

---

## References

- [Official Documentation](https://mozilla.github.io/nunjucks/)
- [Template Syntax](https://mozilla.github.io/nunjucks/templating.html)
- [WCAG 2.2 Error Messages](https://www.w3.org/WAI/tutorials/forms/notifications/)
