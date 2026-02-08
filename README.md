# Template Generic Eleventy

![Preview](./preview.png)

Generic Eleventy template with TailwindCSS v4, Nunjucks, and Decap CMS.  
Designed for modularity, maintainability, and reusability across projects.

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/charlotte-carpentier/template-generic-eleventy.git
cd template-generic-eleventy
npm install
```

### 2. Configure your site

Edit `src/_data/site.json` to customize site title, description, and URL.  
See [Site Configuration](./docs/01-starting/site-configuration.md) for details.

### 3. Start developing

```bash
npm start  # http://localhost:8080
```

## Features

- Static site generation with Eleventy 3.0
- Atomic Design components (Nunjucks macros)
- TailwindCSS v4 utility-first styling
- WCAG 2.2 AA compliant (Lighthouse 100/100)
- Eco-designed (EcoIndex Grade A, RGESN 2024)
- Decap CMS for content management
- Optional integrations: Google Fonts, Font Awesome, GA4, Axeptio

## Project Structure

```text
template-generic-eleventy/
├── docs/          # Documentation
├── src/
│   ├── _data/     # Component data (JSON)
│   ├── _includes/ # Nunjucks templates
│   ├── assets/    # Styles, scripts, images
│   └── pages/     # Site pages
└── public/        # Build output
```

See [Project Structure](./docs/02-using/project-structure.md) for complete organization.

## Documentation

HAT documentation is organized in 3 sections:

### 📚 Getting Started

- [Site Configuration](./docs/01-starting/site-configuration.md)
- [Accessibility Standards](./docs/01-starting/accessibility-standards.md)

### 🛠️ Daily Usage

- [Building Components](./docs/02-using/building-components.md)
- [Styling Components](./docs/02-using/styling-components.md)
- [Adding Interactions](./docs/02-using/adding-interactions.md)
- [Loading Data](./docs/02-using/loading-data.md)
- [Structuring Data](./docs/02-using/structuring-data.md)
- [Managing Content](./docs/02-using/managing-content.md)
- [Code Conventions](./docs/02-using/code-conventions.md)
- [Code Templates](./docs/02-using/code-templates.md)
- [Testing](./docs/02-using/testing.md)
- [Troubleshooting](./docs/02-using/troubleshooting.md)

### 🔧 Maintenance

- [Deployment](./docs/03-maintaining/deployment.md)
- [Maintenance](./docs/03-maintaining/maintenance.md)
- [Security](./docs/03-maintaining/security.md)
- [Roadmap](./docs/03-maintaining/roadmap.md)
- [ADR](./docs/03-maintaining/adr/)

## Contributing

Contributions are welcome! Please follow the [code conventions](./docs/02-using/code-conventions.md) and test locally before submitting.

## License

MIT © HAT Design System Contributors  
See [LICENSE](./LICENSE) for details.

## Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [TailwindCSS v4 Documentation](https://tailwindcss.com/docs)
- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Decap CMS Documentation](https://decapcms.org/docs/)
