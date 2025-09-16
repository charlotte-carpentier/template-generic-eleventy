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

  // --------------------------
  // Directory structure
  // --------------------------
  // input: source files
  // output: build folder
  return {
    dir: {
      input: "src",
      output: "public"
    }
  };
}