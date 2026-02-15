---
title: ADR-014 - Data Render Pattern
description: How macros merge _data defaults with content overrides
created: 2026-02-15
---

Pattern for passing data to CMS-enabled components.

---

## Context

Components display static design config (_data/) and dynamic editorial content (content/). Need standard pattern for data fusion with clear priority rules.

## Decision

**Pattern structure**:

1. Component call

    ```njk
    {{ renderCard({ 
      name: "blogCard",
      url: article.url,
      title: article.data.title,
      excerpt: article.data.excerpt
    }) }}
    ```

2. Template logic

    ```njk
    {% macro renderCard(options) %}
      {% set defaults = molecules.card.cards | findByName(options.name) %}
      
      {% if not defaults %}
        <p class="error">Variant "{{ options.name }}" not found</p>
        {{ return }}
      {% endif %}
      
      {% set url = options.url or defaults.url or '#' %}
      {% set title = options.title or defaults.headingName or 'Sans titre' %}
      {% set excerpt = options.excerpt or defaults.excerpt or '' %}
      
      <article>
        <h3>{{ title }}</h3>
        <p>{{ excerpt }}</p>
        <a href="{{ url }}">Lire</a>
      </article>
    {% endmacro %}
    ```

3. Protection rules

Never allow CMS override for Tier 3 (ADR-012):

```njk
{% set buttonText = defaults.buttonText %}
```

Child components always from _data/:

```njk
{% set buttonConfig = atoms.button.buttons | findByName(defaults.buttonName) %}
```

**Priority**: `options.X > defaults.X > fallback`

## Rationale

Nunjucks `or` operator evaluates left-to-right. Priority explicit in code. Validation prevents silent failures. Backward compatible with defaults-only usage. Aligns with Eleventy Data Cascade.

## Consequences

Applies to components displaying CMS content (ADR-012 Tier 1-2): cards, sections, editorial content containers.

Manual `or` chains required. Tier 3 restrictions must be enforced. Validation code repeated per component.

---

May your bugs be forever exiled to the shadow realm  
HAT · 2026
