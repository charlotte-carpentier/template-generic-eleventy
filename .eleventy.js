// ==========================
// Eleventy Configuration
// ==========================

export default function(eleventyConfig) {

  // --------------------------
  // Passthrough copy (static assets)
  // --------------------------
  // Anything here is copied as-is to the output folder
  [
    './src/assets/fonts',      // Project and vendor fonts
    './src/assets/icons',      // Favicons, UI icons, sprites
    './src/assets/images',     // Images (raw)
    './src/assets/downloads',  // PDFs, CVs, other downloadable files
    './src/assets/scripts',    // JS files (no bundler yet)
    './src/admin',             // Netlify CMS admin files
    './src/docs',              // Documentation files
  ].forEach(path => eleventyConfig.addPassthroughCopy(path));

  // Passthrough for single files
  ['robots.txt', 'sitemap.xml'].forEach(file => {
    eleventyConfig.addPassthroughCopy(`./src/${file}`);
  });

  // --------------------------
  // Shortcodes
  // --------------------------
  // Example: {% year %} outputs the current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // --------------------------
  // Filters
  // --------------------------

  // Check if a string ends with a specific suffix
  eleventyConfig.addFilter("endsWith", (str, suffix) => {
    if (!str || !suffix) return false;
    return str.toString().toLowerCase().endsWith(suffix.toLowerCase());
  });

  // Math filters (NEW)
  eleventyConfig.addFilter("min", (arr) => Math.min(...arr));
  eleventyConfig.addFilter("max", (arr) => Math.max(...arr));

  // Date filter for ISO 8601 format (JSON-LD structured data)
  eleventyConfig.addFilter('date', function(date, format) {
    if (format === 'iso') {
      return new Date(date).toISOString();
    }
    return date;
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Universal Filter: Find by Name/ID
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Find an item in array or nested object by name or id
   * @param {Array|Object} data - Data to search (flat array or nested object)
   * @param {string} name - Name or id to find
   * @returns {Object|null} Found item or null
   */
  eleventyConfig.addFilter("findByName", function(data, name) {
    if (!data || !name) return null;

    // Case 1: Flat array (button, image, input, checkbox, etc.)
    if (Array.isArray(data)) {
      return data.find(item => item.name === name || item.id === name);
    }

    // Case 2: Nested object with categories (icon)
    if (typeof data === 'object') {
      for (const category in data) {
        if (Array.isArray(data[category])) {
          const found = data[category].find(item => item.name === name || item.id === name);
          if (found) return found; // Stop immediately when found
        }
      }
    }

    return null;
  });

  // --------------------------
  // Directory structure
  // --------------------------
  // input: source files
  // output: build folder
  return {
    dir: {
      input: "src",
      output: "public"
    },

    markdownTemplateEngine: "njk"
  };
}
