---
title: ADR-013 - Data Architecture (_data vs content)
description: Separate static component config (_data) from editorial content (content) using Eleventy Data Cascade
created: 2026-02-13
---

Decision record for data source separation in HAT template.

---

## Context

Need clear rules for where to store data. Without rules, risk of duplication across `_data/` and front matter, confusion where to add new data, breaking components when editing articles.

## Decision

**"Defaults + Override" strategy** based on Eleventy Data Cascade:

| Source | Role | Examples |
| ------ | ---- | -------- |
| `_data/` | Static component config | Design tokens, button variants, demo data |
| `content/articles/articles.json` | Directory defaults | `layout`, `tags`, `permalink` for all articles |
| `content/articles/*.md` | Per-article overrides | `title`, `date`, `author` |
| Props runtime | Dynamic data to macros | `{{ renderCard({ url: article.url }) }}` |

**Decision tree** - "Where do I add this data?":

- Design token/component variant => `_data/`
- Same for all articles (layout, tags) => `articles.json`
- Unique per article (title, date) => `.md` front matter
- Collection data (article.url) => Props runtime

**Macro pattern**:

```njk
{% set url = options.url | default(cardData.url) | default('#') %}
```

Runtime props override _data defaults.

## Rationale

Eleventy official pattern: "Directory data files... a fallback designed to be overridden" (Data Cascade docs). 

**DRY**: Layout/tags defined once in `articles.json`, inherited by all `.md`. No need to repeat in every article front matter.

**Collections work natively**: `article.url`, `article.data.title` available without extra config.

## Consequences

**Positive**:

- New article = minimal front matter (title, date only)
- Clear onboarding: "Static => _data, editorial => content"
- Component demos separated from real content

**Negative**:

- Must understand Eleventy Data Cascade
- Directory data files (`articles.json`) not visible in CMS

**Action**:

- Create `src/content/articles/articles.json` with layout/tags/permalink
- Remove duplicate `layout` from each `.md`

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
