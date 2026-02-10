---
title: Data Structure Guide
description: JSON data patterns and design rules for components
type: documentation
created: 2025-10-11
tags: [json, data-structure, patterns, design-system]
---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintained by**: Charlotte Carpentier

---

## Overview

This guide defines patterns for structuring component data in JSON files. Following these patterns ensures consistency, maintainability, and clarity across the design system.

---

## Variants vs Multiple Objects

When designing component data structures, choose the appropriate pattern based on what varies between instances.

### Decision Framework

**Question**: "Does the variant change ONLY the visual presentation (CSS/layout)?"

**YES** => Use `variants: ["style1", "style2"]` array
- Same data structure across all variants
- Only CSS classes or layout changes
- Single object with variant options array

**NO** => Use separate objects with `variant: "type"` property
- Different data for each variant
- Different structure or behavior
- Multiple objects in the main array

---

### Pattern 1: Variants Array

**Use for styling/layout variations only**

```json
{
  "id": "demoLock1",
  "type": "default",
  "variants": ["horizontal", "vertical", "small-horizontal"],
  "label": { "text": "Label" },
  "value": { "text": "Value" }
}
```

**When to use:**
- Same data fields across all variants
- Only visual presentation differs (CSS/layout)
- Layout or sizing variations
- No structural changes to data

**Examples from design system:**
- `lock-up`: horizontal/vertical layouts with same label/value structure
- `list-value`: default/horizontal display with same lockup items
- `segmented-control`: button variants with same structure

---

### Pattern 2: Separate Objects

**Use for data or structural variations**

```json
[
  {
    "name": "demoInfo",
    "variant": "info",
    "message": "Information message",
    "iconName": "demoInfo1"
  },
  {
    "name": "demoError",
    "variant": "error",
    "message": "Error message",
    "iconName": "demoWarn1"
  }
]
```

**When to use:**
- Different content per variant
- Variant affects data structure
- Each instance has unique data
- Different fields or behaviors per type

**Examples from design system:**
- `disclaimer`: Different messages and icons per semantic type (info/success/warning/error)
- `toast`: Unique notification content per instance
- `caption`: Different contextual labels per variant

---

## Real-World Examples

### Correct: Lock-up (Variants Array)

**Why**: Same data structure, only layout changes

```json
{
  "id": "demoLock1",
  "type": "default",
  "variants": ["horizontal", "vertical", "small-horizontal"],
  "label": { "text": "Label" },
  "value": { "text": "Value" }
}
```

All variants use the same `label` and `value` fields. Only CSS/positioning differs.

---

### Correct: Disclaimer (Separate Objects)

**Why**: Different data per semantic type

```json
[
  {
    "name": "demoDiscla1",
    "variant": "info",
    "message": "Information alert",
    "iconName": "demoInfo1"
  },
  {
    "name": "demoDiscla2",
    "variant": "success",
    "message": "Success notification",
    "iconName": "demoCheck1"
  }
]
```

Each variant has unique message content and icon. These are distinct instances, not styling variations.

---

### Incorrect: Mixed Pattern

**Don't do this:**

```json
{
  "name": "demoPanel1",
  "type": "default",
  "variants": [
    {
      "name": "simple",
      "items": [{ "text": "Label" }]
    },
    {
      "name": "multiselect",
      "items": [{ "checkboxName": "demo", "text": "Label" }]
    }
  ]
}
```

**Problem**: `variants` contains objects with different structures instead of simple strings or separate root-level objects.

**Fix**: Use separate objects at root level:

```json
[
  {
    "name": "demoPanel1",
    "type": "simple",
    "items": [{ "text": "Label" }]
  },
  {
    "name": "demoPanel2",
    "type": "multiselect",
    "items": [{ "checkboxName": "demo", "text": "Label" }]
  }
]
```

---

## Quick Reference

| Scenario | Pattern | Structure |
|----------|---------|-----------|
| Same data, different CSS | Variants Array | `variants: ["style1", "style2"]` |
| Same data, different layout | Variants Array | `variants: ["horizontal", "vertical"]` |
| Different content per type | Separate Objects | `[{variant: "type1"}, {variant: "type2"}]` |
| Different fields per type | Separate Objects | `[{variant: "type1"}, {variant: "type2"}]` |

---

## Accessibility Considerations

When using either pattern, ensure all variants maintain **WCAG 2.2 AA compliance**:

- **Contrast ratios**: 4.5:1 for text, 3:1 for UI components
- **Focus states**: 2px outline with 3:1 contrast
- **Interactive elements**: Clear hover/focus/active states
- **Screen readers**: Proper `aria-label` attributes

---

## Migration Guide

If you encounter an existing component using the wrong pattern:

1. **Identify the pattern type**: Does variant change only CSS or also data?
2. **Choose correct pattern**: Variants array or separate objects
3. **Restructure JSON**: Update data file following the correct pattern
4. **Update template**: Ensure Nunjucks macro handles new structure
5. **Test thoroughly**: Verify all variants render correctly

---

## References

- [Coding Style Guide](./coding-style.md) - Naming and formatting conventions
- [Nunjucks Guide](./nunjucks.md) - Template structure and macros
- [Examples](./examples.md) - Complete code samples
