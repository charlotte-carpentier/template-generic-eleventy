# Decap CMS

This template uses Decap CMS as a headless content management system. Decap CMS allows content editors to modify site content through an admin interface (`/admin`) without touching the codebase.

## Overview

Decap CMS is configured to work with this template's atomic design structure (atoms, molecules, organisms). The configuration file is located at `src/admin/config.yml`.

## Data architecture

### Two types of content

#### 1. Unique components (files collections)

**Location:** `src/_data/atoms/`, `src/_data/molecules/`, `src/_data/organisms/`

**Purpose:** Content that exists as a single instance (hero section, navigation menu, footer, etc.).

**File example:** `src/_data/molecules/hero.json`

```json
{
  "title": "Welcome to our site",
  "subtitle": "Discover our services",
  "image": "/assets/images/hero.jpg"
}
```

**config.yml configuration:**

```yaml
collections:
  - name: "molecules"
    label: "Molecule Components"
    files:
      - label: "Hero Section"
        name: "hero"
        file: "src/_data/molecules/hero.json"
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Subtitle", name: "subtitle", widget: "text"}
          - {label: "Image", name: "image", widget: "image"}
```

**Template usage:**

```njk
<h1>{{ molecules.hero.title }}</h1>
<p>{{ molecules.hero.subtitle }}</p>
```

#### 2. Repeatable collections (folder collections)

**Location:** `src/collections/[collection-name]/`

**Purpose:** Content with multiple instances (blog posts, products, testimonials, etc.).

**Example:** `src/collections/blog/post-1.md`

**config.yml configuration:**

```yaml
collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "src/collections/blog"
    create: true                      # Allow creating new entries
    delete: true                      # Allow deleting entries
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Body", name: "body", widget: "markdown"}
```

**Template usage:**

```njk
{% for post in collections.blog %}
  <h2>{{ post.data.title }}</h2>
  <time>{{ post.data.date }}</time>
  {{ post.templateContent | safe }}
{% endfor %}
```

## Adding a new editable component

### 1. Create the JSON file

```bash
# Create file with minimum valid JSON object
echo '{}' > src/_data/molecules/new-component.json
```

### 2. Configure the component in config.yml

Open `src/admin/config.yml` and uncomment the relevant section, then add your component:

```yaml
collections:
  - name: "molecules"
    files:
      # ... other components
      - label: "New Component"
        name: "new-component"
        file: "src/_data/molecules/new-component.json"
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Content", name: "content", widget: "text"}
```

### 3. Use in template

```njk
{# src/_includes/02-molecules/new-component.njk #}
<section>
  <h2>{{ molecules["new-component"].title }}</h2>
  <p>{{ molecules["new-component"].content }}</p>
</section>
```

## Adding a new collection

### 1. Create the folder

```bash
mkdir -p src/collections/new-collection
```

### 2. Configure the collection in config.yml

Open `src/admin/config.yml` and add your collection configuration:

```yaml
collections:
  - name: "new-collection"
    label: "New Collection"
    folder: "src/collections/new-collection"
    create: true
    delete: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Content", name: "body", widget: "markdown"}
```

### 3. Configure collection in .eleventy.js

```js
// .eleventy.js
eleventyConfig.addCollection("newCollection", function(collectionApi) {
  return collectionApi.getFilteredByGlob("src/collections/new-collection/*.md");
});
```

### 4. Use in template

```njk
{% for item in collections.newCollection %}
  <article>
    <h3>{{ item.data.title }}</h3>
    {{ item.templateContent | safe }}
  </article>
{% endfor %}
```

## Available widgets

Decap CMS provides various widget types for form fields:

| Widget | Usage | Example |
|--------|-------|---------|
| `string` | Short text | Title, name |
| `text` | Long text | Description, subtitle |
| `markdown` | Rich content | Article body, page content |
| `number` | Number | Price, quantity |
| `boolean` | True/False | Show/hide toggle |
| `datetime` | Date and time | Publication date |
| `image` | Image upload | Photo, illustration |
| `file` | File upload | PDF, document |
| `select` | Dropdown | Categories |
| `list` | Repeatable items | Menu items, features |
| `object` | Structured group | Field grouping |
| `relation` | Collection reference | Post category |

### list widget example

```yaml
fields:
  - label: "Features"
    name: "features"
    widget: "list"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Icon", name: "icon", widget: "string"}
```

## Best practices

### 1. Always initialize JSON files

Files in `files` collections must exist with at minimum `{}`:

```bash
echo '{}' > src/_data/molecules/hero.json
```

### 2. Use kebab-case for filenames

```text
✅ hero-section.json
✅ contact-form.json
❌ heroSection.json
❌ ContactForm.json
```

### 3. Use descriptive labels

```yaml
# ❌ Not clear
- {label: "T", name: "title", widget: "string"}

# ✅ Clear
- {label: "Main Title", name: "title", widget: "string"}
```

### 4. Group related fields with object

```yaml
fields:
  - label: "Hero Section"
    name: "hero"
    widget: "object"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Subtitle", name: "subtitle", widget: "text"}
      - {label: "Image", name: "image", widget: "image"}
```

## Admin interface access

- **Local URL:** <http://localhost:8080/admin>
- **Production URL:** <https://your-site.com/admin>

## Configuration skeleton

This template includes a **modular configuration skeleton** at `src/admin/config.yml`. The file contains:

- Complete configuration structure with detailed comments
- Examples for atoms, molecules, and organisms
- Examples for common repeatable collections (blog, portfolio, testimonials)
- All sections are **commented out** by default

### Using the skeleton

1. Open `src/admin/config.yml`
2. Uncomment the collections you need
3. Adapt field names and widgets to your project
4. Create corresponding data files:
   - For `files` collections: create JSON files in `src/_data/[atoms|molecules|organisms]/`
   - For `folder` collections: create folders in `src/collections/[collection-name]/`
5. Remember: JSON files must contain at minimum `{}` to be valid

### Quick start example

To enable a hero section and blog:

```yaml
collections:
  - name: "molecules"
    label: "Molecule Components"
    files:
      - label: "Hero Section"
        name: "hero"
        file: "src/_data/molecules/hero.json"
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Subtitle", name: "subtitle", widget: "text"}

  - name: "blog"
    label: "Blog Posts"
    folder: "src/collections/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Body", name: "body", widget: "markdown"}
```

Then create the files:

```bash
echo '{}' > src/_data/molecules/hero.json
mkdir -p src/collections/blog
```

## Resources

- [Official Decap CMS documentation](https://decapcms.org/docs/)
- [Available widgets](https://decapcms.org/docs/widgets/)
- [Configuration options](https://decapcms.org/docs/configuration-options/)
- [File collections](https://decapcms.org/docs/collection-file/)
- [Folder collections](https://decapcms.org/docs/collection-folder/)
