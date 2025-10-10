---
title: Nunjucks Guide
description: Guide for using Nunjucks templating with Eleventy
type: documentation
created: 2025-01-15
tags: [nunjucks, templates, templating]
---

## Macro Pattern

### Standard Structure

```njk
{% macro renderComponent(options) %}
  {# Validate required props #}
  {% if not options.datas %}
    <span class="error">Error: Missing required prop (datas)</span>
  {% elif not options.name %}
    <span class="error">Error: Missing required prop (name)</span>
  {% else %}
    {# Find by name #}
    {% set componentData = null %}
    {% for item in options.datas %}
      {% if item.name == options.name %}
        {% set componentData = item %}
      {% endif %}
    {% endfor %}
    
    {# Render or error #}
    {% if not componentData %}
      <span class="error">Component not found: {{ options.name }}</span>
    {% else %}
      <element data-component-name="{{ componentData.name }}">
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
data-button-type="{{ buttonType }}"
data-checkbox-id="{{ checkbox.id }}"
```

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
3. Search in data array
4. Render or show error

```njk
{% if not options.datas %}
  <span class="error">Error: Missing required prop (datas)</span>
{% elif not options.name %}
  <span class="error">Error: Missing required prop (name)</span>
{% else %}
  {# Process #}
{% endif %}
```

---

## Search Pattern

### Find Item by Name

```njk
{% set componentData = null %}
{% for item in options.datas %}
  {% if item.name == options.name %}
    {% set componentData = item %}
  {% endif %}
{% endfor %}

{% if not componentData %}
  <span class="error">Component not found: {{ options.name }}</span>
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
