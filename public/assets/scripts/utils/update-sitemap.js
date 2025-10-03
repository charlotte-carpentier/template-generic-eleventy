/**
 * Sitemap Update Utility
 * 
 * Automatically updates the sitemap.xml file with current dates.
 * This script is useful for keeping lastmod dates fresh without manual editing.
 * 
 * Usage: npm run update-sitemap
 * 
 * What it does:
 * - Locates the sitemap.xml file in the src directory
 * - Updates all <lastmod> tags with the current date (YYYY-MM-DD format)
 * - Saves the updated sitemap back to the original location
 * - Provides console logging for verification and debugging
 * 
 * Best practices:
 * - Run this script before deploying to update modification dates
 * - Consider adding to your build process: "prebuild": "node update-sitemap.js"
 * - Keep sitemap URLs in sync with your actual site structure
 * 
 * @version 1.0
 */

import fs from 'fs';
import path from 'path';

// Locate sitemap.xml file in src directory
const sitemapPath = path.resolve(process.cwd(), 'src/sitemap.xml');

// Log file path for verification
console.log(`Sitemap path: ${sitemapPath}`);

// Get current date in ISO 8601 format (YYYY-MM-DD) for sitemap
const currentDate = new Date().toISOString().split('T')[0];

// Read sitemap.xml file
fs.readFile(sitemapPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading sitemap.xml:', err);
    return;
  }

  // Log original content for debugging
  console.log('Original sitemap content loaded');

  // Replace all <lastmod> occurrences with current date
  const updatedData = data.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${currentDate}</lastmod>`);

  // Log updated content for verification
  console.log('Sitemap updated with current date');

  // Write modified content back to sitemap.xml
  fs.writeFile(sitemapPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error saving sitemap.xml:', err);
      return;
    }
    console.log(`✓ Sitemap updated successfully with date: ${currentDate}`);
  });
});