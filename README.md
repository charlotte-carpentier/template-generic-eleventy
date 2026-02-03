# Template Generic Eleventy

![Preview](./preview.png)

Generic Eleventy template with TailwindCSS v4, Nunjucks, and Decap CMS.  
Designed for modularity, maintainability, and reusability across projects.  
Built on JavaScript, HTML5, and CSS3.

## Features

- Generate static sites using Eleventy
- Modular templates with Nunjucks (atoms, molecules, organisms)
- Utility-first responsive CSS with TailwindCSS v4
- Accessibility-first (WCAG 2.2 AA compliant, Lighthouse 100/100)
- Eco-designed & performance-optimized (EcoIndex Grade A, RGESN 2024 compliant)
- Headless CMS integration via Decap CMS
- Optional integrations: Google Analytics, Axeptio, Font Awesome
- Automated asset scripts using Bash scripts

## Quick Start

### 1. Clone and install

```bash
# Option A: Test the template directly
git clone https://github.com/charlotte-carpentier/template-generic-eleventy.git
cd template-generic-eleventy
npm install

# Option B: Start a new project from the template
git clone https://github.com/charlotte-carpentier/template-generic-eleventy.git my-new-project
cd my-new-project
npm install
```

### 2. Configure your site

Edit `src/_data/site.json` to customize:

- Site title, description, and URL
- Language and theme color
- Google Fonts (optional)
- Analytics and cookie consent (optional)
- Social sharing image

See [`docs/configuration.md`](./docs/configuration.md) for detailed configuration options.

### 3. Start developing

```bash
npm start
```

Your site will be available at `http://localhost:8080`

## Project Structure

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
│   ├── _includes/                # Nunjucks templates
│   │   ├── 01-atoms/
│   │   ├── 02-molecules/
│   │   ├── 03-organisms/
│   │   └── 04-core/              # Layouts and core templates
│   │       ├── base.njk          # Base layout
│   │       └── post.njk          # Article layout (for Markdown articles)
│   ├── admin/                    # Decap CMS configuration
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
│   ├── content/                  # Decap CMS content (blog, etc.)
│   │   └── articles/             # Blog articles Markdown (uses post.njk layout)
│   │       ├── article-01.md     # Individual articles (front matter: layout: "04-core/post.njk")
│   │       ├── article-02.md
│   │       └── ...
│   ├── pages/                    # Template pages (index, blog, error pages...)
│   │   ├── index.njk             # Homepage
│   │   ├── blog.njk              # Blog listing (will add pagination: native Eleventy)
│   │   ├── article.njk           # Article template (DEPRECATED - replaced by post.njk layout)
│   │   └── contact.njk
│   ├── robots.njk                # Search engine crawling rules (generates robots.txt)
│   └── sitemap.njk               # SEO sitemap generator (generates sitemap.xml)
├── .eleventy.js                  # Eleventy configuration
├── netlify.toml                  # Netlify / Decap deployment configuration
├── postcss.config.cjs            # PostCSS configuration
├── package.json                  # Dependencies and scripts
├── LICENSE
└── README.md
```

## CSS Strategy

This template uses TailwindCSS v4 with a **utility-first approach**.

- **90% Tailwind utilities** - Applied directly in Nunjucks templates
- **10% Custom CSS** - Only for animations, `:target`, pseudo-elements

**See [`docs/tailwind.md`](./docs/tailwind.md) for complete styling guide.**

## Usage

### Development

```bash
npm start
```

Runs Eleventy in watch mode and starts PostCSS in parallel.  
Access your site at `http://localhost:8080`

### Build

```bash
npm run build
```

Creates an optimized production build in `public/`

### CSS Processing

```bash
npm run build:css    # Build CSS once
npm run watch:css    # Watch and rebuild CSS on changes
```

Processes `src/assets/styles/input.css` via PostCSS, TailwindCSS v4, Autoprefixer, and CSSNano.

### Sprite Generation

```bash
npm run sprites
```

Generates SVG sprites from `src/assets/icons/sprites/` using the custom Bash script.

## Content Management with Decap CMS

This template uses Decap CMS for content management. The CMS interface is accessible at `/admin` once deployed.

### Data Architecture

- **`src/_data/atoms|molecules|organisms/`**: Editable component data (unique instances)
- **`src/content/`**: Repeatable content (blog posts, portfolio items, etc.)

For detailed Decap CMS configuration and usage, see [`docs/decap-cms.md`](./docs/decap-cms.md).

## Documentation

Comprehensive documentation is available in the [`/docs`](./docs) folder:

- **[Configuration Guide](./docs/configuration.md)** - Site configuration, fonts, analytics, cookies
- **[Decap CMS Guide](./docs/decap-cms.md)** - Content management setup and usage
- **[Coding Style](./docs/coding-style.md)** - Naming conventions and code standards
- **[Code Examples](./docs/examples.md)** - Complete code samples for all file types
- **[Eleventy Setup](./docs/eleventy.md)** - Eleventy configuration details
- **[TailwindCSS Setup](./docs/tailwind.md)** - Tailwind v4 configuration and customization
- **[Nunjucks Templates](./docs/nunjucks.md)** - Template structure and macro usage
- **[Project Structure](./docs/structure.md)** - Detailed folder and file organization

## Optional Integrations

This template supports optional third-party integrations:

- **Google Fonts** - Custom typography via Google Fonts API
- **Font Awesome** - Icon library (v6.7.2 with SRI)
- **Axeptio** - Cookie consent management with Google Consent Mode v2
- **Google Analytics 4** - Web analytics with consent integration

All integrations are **disabled by default** and configured via `src/_data/site.json`.  
See [`docs/configuration.md`](./docs/configuration.md) for setup instructions.

## Troubleshooting

Common issues and fixes are tracked in [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md).

## Contributing

Contributions are welcome! Please ensure:

- Code follows the naming conventions in [`docs/conventions.md`](./docs/conventions.md)
- New components include proper documentation
- All changes are tested locally before submitting

## License

MIT © Charlotte Carpentier

## Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [TailwindCSS v4 Documentation](https://tailwindcss.com/docs)
- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Decap CMS Documentation](https://decapcms.org/docs/)
  