/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILITY › Sitemap Update
   Updates sitemap.xml with current dates
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * @fileoverview Automated sitemap date updater
 * @module utils/update-sitemap
 * @created 2025-01-15
 */

import fs from 'fs';
import path from 'path';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SITEMAP_PATH = path.resolve(process.cwd(), 'src/sitemap.xml');


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Update sitemap lastmod dates
 * @returns {void}
 */
function updateSitemap() {
  console.log(`Sitemap path: ${SITEMAP_PATH}`);
  
  const currentDate = new Date().toISOString().split('T')[0];
  
  fs.readFile(SITEMAP_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading sitemap.xml:', err);
      return;
    }
    
    console.log('Original sitemap content loaded');
    
    // Replace all lastmod tags with current date
    const updatedData = data.replace(
      /<lastmod>.*?<\/lastmod>/g,
      `<lastmod>${currentDate}</lastmod>`
    );
    
    console.log('Sitemap updated with current date');
    
    fs.writeFile(SITEMAP_PATH, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error saving sitemap.xml:', err);
        return;
      }
      console.log(`✓ Sitemap updated successfully with date: ${currentDate}`);
    });
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Execution
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

updateSitemap();