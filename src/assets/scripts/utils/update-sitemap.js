/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILITY › Sitemap Update
   Updates sitemap.xml with current dates
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * @fileoverview Automated sitemap date updater for build process
 * @module utils/update-sitemap
 * @created 2025-01-15
 * @updated 2025-10-17
 */

import { readFile, writeFile } from 'fs/promises';
import path from 'path';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DEFAULT_SITEMAP_PATH = 'src/sitemap.xml';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Core Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Update sitemap lastmod dates to current date
 * @param {string} [sitemapPath] - Path to sitemap file
 * @returns {Promise<void>}
 */
export async function updateSitemap(sitemapPath = DEFAULT_SITEMAP_PATH) {
  const fullPath = path.resolve(process.cwd(), sitemapPath);
  const currentDate = new Date().toISOString().split('T')[0];
  
  console.log(`Updating sitemap: ${fullPath}`);
  
  try {
    const data = await readFile(fullPath, 'utf8');
    console.log('✓ Sitemap file loaded');
    
    const updatedData = data.replace(
      /<lastmod>.*?<\/lastmod>/g,
      `<lastmod>${currentDate}</lastmod>`
    );
    
    await writeFile(fullPath, updatedData, 'utf8');
    console.log(`✓ Sitemap updated: ${currentDate}`);
    
  } catch (error) {
    console.error('✗ Error updating sitemap:', error.message);
    throw error;
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Execution
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (import.meta.url === `file://${process.argv[1]}`) {
  updateSitemap().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━