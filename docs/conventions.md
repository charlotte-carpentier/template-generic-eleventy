# Design System Conventions

## File and Content Naming

### File Names

- **Convention**: `kebab-case`
- **Examples**: `error-fragment-group.json`, `list-content.json`, `section-hero.json`

### JSON Content

- **Convention**: `camelCase`
- **Examples**: `errorFragmentGroups`, `listContents`, `sectionHeros`

### Object Keys Alignment

JSON object keys must align with their corresponding file names:

- `error-item.json` → `errorItems`
- `chip-multiselect.json` → `chipMultiselects`
- `progress-bar.json` → `progressBars`

## Identifier Length Limits

### Standard Rule

**Maximum 12 characters** for all business identifiers, regardless of component level.

```json
// Good
"err404Icon1": "...",
"layout404": "...",
"a11yShowBtn": "..."

// Bad
"errorLayout404": "...",
"accessibilityShowButton": "..."
```

### Exceptions

Technical property names may exceed 12 characters when clarity is essential:

- `textTypographyName` (18 chars) - acceptable for component composition
- `titleTypographyName` (20 chars) - acceptable for technical references

## Component Architecture

### Atomic Design Structure

- **15 Atoms**: Basic UI elements (`button`, `input`, `icon`)
- **14 Molecules**: Component compositions (`card`, `breadcrumb`, `toast`)
- **16 Organisms**: Complex layouts (`header`, `footer`, `section-hero`)
- **1 Configuration**: Site-level settings (`site.json`)

### Reference Patterns

Molecules and organisms reference lower-level components using consistent suffixes:

```json
// Molecules
"iconName": "iconReference",
"buttonName": "buttonReference"

// Organisms  
"linkName": "linkReference",
"headingName": "headingReference"
```

## Naming Conventions

### Error Components

- **Contexts**: `err404`, `err500`, `errMaint`
- **Types**: `Icon1`, `Text1`, `Icon2`
- **Groups**: `errGroup404`, `errGroupMntT`
- **Layouts**: `layout404`, `layoutMntT`

### Standard Abbreviations

- `Mnt` - Maintenance
- `Tot` - Total  
- `Part` - Partial
- `a11y` - Accessibility (W3C standard)
- `Btn` - Button
- `Txt` - Text

### Reference Chains

Components maintain strict reference integrity:

```text
error-item.json (atoms)
  ↓ referenced by
error-fragment.json (molecules) 
  ↓ referenced by
error-fragment-group.json (organisms)
  ↓ referenced by
error-layout.json (organisms)
```

## Quality Standards

### Consistency Requirements

- No mixing of naming conventions within files
- All component data follows the same structural patterns
- Reference names must match exactly between components

### Professional Standards

Based on industry style guides:

- **Google JavaScript Style Guide**: Consistent naming patterns
- **Airbnb Style Guide**: Clear, searchable identifiers  
- **Clean Code principles**: Meaningful names without arbitrary complexity

### Template Structure

Every component template includes:

- Complete property coverage (all optional properties visible)
- Generic placeholder data (no specific business content)
- Proper variant/reference structure
- camelCase property names throughout