# Project Structure

```text
template-generic-eleventy/
├── bin/                          # Custom scripts (e.g. sprite generation)
├── docs/                         # Project documentation
├── public/                       # Build output (CSS, assets, etc.)
├── src/                          # Source files
│   ├── _data/                    # Eleventy data files
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── site.json             # Global site configuration
│   │
│   ├── _includes/                # Nunjucks templates
│   │   ├── 01-atoms/
│   │   ├── 02-molecules/
│   │   ├── 03-organisms/
│   │   └── 04-core/              # Layouts and core templates
│   │       ├── base.njk          # Base layout
│   │       └── post.njk          # Article layout (for Markdown articles)
│   │
│   ├── admin/                    # Decap CMS configuration
│   │
│   ├── assets/                   # Static assets served as-is
│   │   ├── downloads/            # Downloadable files (e.g. PDFs, CVs, whitepapers)
│   │   ├── fonts/                # Webfonts
│   │   │   ├── custom/           # Project-specific fonts
│   │   │   └── vendor/           # Third-party fonts (e.g. Google, Adobe)
│   │   ├── icons/                # Icons and sprites
│   │   │   ├── favicon/          # Favicons and app icons (per MDN spec)
│   │   │   └── sprites/          # Icon spritesheets (SVG/PNG)
│   │   ├── images/               # Raster and vector images (not icons)
│   │   │   ├── backgrounds/      # Background images
│   │   │   ├── illustrations/    # Illustrations
│   │   │   ├── logos/            # Logos
│   │   │   └── placeholders/     # Template demo images only
│   │   ├── scripts/              # JavaScript
│   │   │   ├── components/       # Component-specific JS (organized by OMA)
│   │   │   │   ├── 01-atoms/     # Atomic-level scripts
│   │   │   │   ├── 02-molecules/ # Molecule-level scripts
│   │   │   │   └── 03-organisms/ # Organism-level scripts
│   │   │   ├── tests/            # Integration tests (system-level validation)
│   │   │   ├── utils/            # Reusable helper scripts
│   │   │   └── main.js           # Global entry point
│   │   └── styles/               # Global CSS/Tailwind entrypoint
│   │       ├── input.css         # Main stylesheet (imports all components)
│   │       ├── 01-atoms/         # Custom styles for atom-level components
│   │       ├── 02-molecules/     # Custom styles for molecule-level components
│   │       └── 03-organisms/     # Custom styles for organism-level components
│   │
│   ├── content/                  # Decap CMS content (blog, etc.)
│   │   └── articles/             # Blog articles Markdown (uses post.njk layout)
│   │       ├── article-01.md     # Individual articles (front matter: layout: "04-core/post.njk")
│   │       ├── article-02.md
│   │       └── ...
│   │
│   ├── pages/                    # Template pages (index, blog, error pages...)
│   │   ├── index.njk             # Homepage
│   │   ├── blog.njk              # Blog listing (will add pagination: native Eleventy)
│   │   ├── article.njk           # Article template (DEPRECATED - replaced by post.njk layout)
│   │   └── contact.njk
│   │
│   ├── robots.njk                # Search engine crawling rules (generates robots.txt)
│   ├── security.njk              # Security contact (RFC 9116, generates /.well-known/security.txt)
│   └── sitemap.njk               # SEO sitemap generator (generates sitemap.xml)
│
├── .eleventy.js                  # Eleventy configuration
├── netlify.toml                  # Netlify / Decap deployment configuration
├── postcss.config.cjs            # PostCSS configuration
├── package.json                  # Dependencies and scripts
├── LICENSE
└── README.md
```
