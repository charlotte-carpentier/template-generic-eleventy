---
title: Architecture Decision Records
description: Index of all architectural decisions for HAT Design System
type: documentation
created: 2025-12-10
tags: [adr, architecture, decisions]
---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained by**: Charlotte Carpentier

## About ADR

Architecture Decision Records (ADR) document important architectural choices made in the HAT Design System. Each record captures the context, decision, and consequences of a specific choice.

ADR helps maintain clarity on why certain design patterns or technical approaches were chosen, making it easier for current and future team members to understand the system's evolution.

---

## Decision Records

| ID | Title | Status | Date |
|----|-------|--------|------|
| [001](./001-multiselect-exclusion.md) | Multiselect Exclusion | Accepted | 2025-12-10 |
| [002](./002-fluid-typography.md) | Fluid Typography | Accepted | 2026-01-09 |
| [003](./003-touch-target.md) | Touch Target Accessibility | Accepted | 2026-01-14 |
| [004](./004-breakpoints.md) | Breakpoints | Accepted | 2026-01-15 |
| [005](./005-image-responsive.md) | Image Responsive | Accepted | 2026-01-15 |
| [006](./006-link-typography.md) | Link Typography | Accepted | 2026-01-16 |
| [007](./007-form-controls-sizing.md) | Form Controls Sizing Strategy | Accepted | 2026-01-16 |
| [008](./008-modal-overlay.md) | Modal Overlay Strategy | Accepted | 2026-01-22 |
| [009](./009-spacing-tokens.md) | Spacing Tokens Architecture | Accepted | 2026-01-27 |
| [010](./010-css-units.md) | CSS Units Strategy | Accepted | 2026-01-28 |
| [011](./011-grid-tokens.md) | Grid Tokens Architecture | Accepted | 2026-01-29 |

---

## Statuses

- **Proposed**: Decision under discussion
- **Accepted**: Decision validated and implemented
- **Deprecated**: Decision no longer recommended but still in use
- **Superseded**: Decision replaced by a newer ADR

---

## Creating New ADR

1. Copy `template.md` to new file: `00X-decision-name.md`
2. Fill in all sections with relevant information
3. Update this README with new entry
4. Commit with message: `docs: Add ADR-00X [decision-name]`

---

## References

- [Michael Nygard - Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR GitHub Organization](https://adr.github.io/)
- [Gov.UK Design System Decisions](https://design-system.service.gov.uk/)

---

May your bugs be forever exiled to the shadow realm
