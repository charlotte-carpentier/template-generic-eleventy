# Template Generic Eleventy

![Preview](./preview.png)

Generic Eleventy template with TailwindCSS v4, Nunjucks, and Decap CMS.  
Designed for modularity, maintainability, and reusability across projects.  
Built on JavaScript, HTML5, and CSS3.

## Features

- Generate static sites using Eleventy
- Modular templates with Nunjucks (atoms, molecules, organisms)
- Utility-first responsive CSS with TailwindCSS
- Headless CMS integration via Decap CMS
- Automated asset scripts using Bash scripts

## Project structure

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
│   │   └── site.json             # Global/shared data
│   ├── _includes/                # Nunjucks templates
│   │   ├── 01-atoms/
│   │   ├── 02-molecules/
│   │   ├── 03-organisms/
│   │   └── 04-core/              # Layouts and core templates
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
│   │   │   ├── backgrounds/      # Project background images
│   │   │   ├── illustrations/    # Project illustrations  
│   │   │   ├── logos/            # Project logos
│   │   │   └── placeholders/     # Template demo images only
│   │   ├── scripts/              # JavaScript
│   │   │   ├── components/       # Component-specific JS (organized by OMA)
│   │   │   │   ├── 01-atoms/     # Atomic-level scripts
│   │   │   │   ├── 02-molecules/ # Molecule-level scripts
│   │   │   │   └── 03-organisms/ # Organism-level scripts
│   │   │   ├── utils/            # Reusable helper scripts (aka helpers)
│   │   │   └── main.js           # Global entry point
│   │   └── styles/               # Global CSS/Tailwind entrypoint
│   │       └── input.css         # Main stylesheet (imports + @theme + custom)
│   ├── collections/              # Decap CMS collections (blog, home, contact...)
│   ├── index.njk                 # Main index template
│   ├── input.css                 # TailwindCSS entry point
│   ├── robots.txt
│   └── sitemap.xml
├── .eleventy.js                  # Eleventy configuration
├── netlify.toml                  # Netlify / Decap deployment configuration
├── postcss.config.cjs            # PostCSS configuration
├── package.json                  # Dependencies and scripts
├── LICENSE
└── README.md
```

## Installation

### Option 1: Test or use the template directly

git clone <https://github.com/charlotte-carpentier/template-generic-eleventy.git>
cd template-generic-eleventy
npm install

### Option 2: Start a new project from the template

git clone <https://github.com/charlotte-carpentier/template-generic-eleventy.git> my-new-project
cd my-new-project
npm install

### Optional: update package.json, Decap CMS config, etc

## Usage

### Development

```bash
npm start
```

Runs Eleventy in watch mode and starts PostCSS in parallel.

### Build

```bash
npm run build
```

Creates an optimized production build (`public/`).

### CSS

```bash
npm run build:css
npm run watch:css
```

Processes `src/assets/styles/input.css` via PostCSS, TailwindCSS, Autoprefixer, and CSSNano.

### Sprite generation

```bash
npm run sprites
```

Runs the `scripts/generate-sprite.sh` script to build SVG sprites from `src/sprites/`.

## Content management with Decap CMS

This template uses Decap CMS for content management. The CMS interface is accessible at `/admin` once deployed.

### Data architecture

- **`src/_data/atoms|molecules|organisms/`**: Editable component data (unique instances)
- **`src/collections/`**: Repeatable collections (multiple instances)

For detailed Decap CMS configuration and usage, see [`docs/decap-cms.md`](./docs/decap-cms.md).

## Documentation

Detailed documentation is available in the [`/docs`](./docs) folder:

- [Eleventy config](./docs/eleventy.md)  
- [TailwindCSS setup](./docs/tailwind.md)  
- [Nunjucks templates](./docs/nunjucks.md)  
- [Decap CMS](./docs/decap-cms.md)  
- [Project structure](./docs/structure.md)  

## Troubleshooting

Common issues and fixes are tracked in [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md).

## License

MIT © Charlotte Carpentier
