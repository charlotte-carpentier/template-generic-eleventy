/* ┌─────────────────────────────────────────────────────────┐
   │ SCRIPT › Generate Image Metadata                        │
   │ Automated image metadata generation for HAT             │
   └─────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Generates responsive image metadata using Eleventy Image Plugin
 * Enriches image.json with width, height, srcset, and sizes automatically
 * Preserves source filenames and cleans obsolete properties
 * Runs during build process before Eleventy compilation
 * @module bin/generate-image-metadata
 * @requires @11ty/eleventy-img
 * @requires fs/promises
 * @requires path
 */

import Image from '@11ty/eleventy-img';
import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Constants
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JSON_PATH = resolve(__dirname, '../src/_data/atoms/image.json');
const OUTPUT_DIR = './public/img/';
const URL_PATH = '/img/';

const WIDTHS = [400, 800, 1200];
const FORMATS = ['webp'];

const VARIANT_DEFAULT = 'default';
const VARIANT_AVATAR = 'avatar';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Function
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Main execution - Generates metadata for all default variant images
 */
async function generateImageMetadata() {
  try {
    console.log('[Image Metadata] Starting generation...');

    const jsonContent = await readFile(JSON_PATH, 'utf-8');
    const data = JSON.parse(jsonContent);

    if (!data.images || !Array.isArray(data.images)) {
      throw new Error('Invalid image.json structure: missing images array');
    }

    let processedCount = 0;
    let skippedCount = 0;

    for (const image of data.images) {
      if (image.variant === VARIANT_DEFAULT && image.src) {
        await processImage(image);
        processedCount++;
      } else if (image.variant === VARIANT_AVATAR) {
        skippedCount++;
      }
    }

    await writeFile(JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`[Image Metadata] Generated metadata for ${processedCount} images`);
    console.log(`[Image Metadata] Skipped ${skippedCount} avatar images (fixed size)`);

  } catch (error) {
    console.error('[Image Metadata] Error:', error.message);
    process.exit(1);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Image Processing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Process single image and enrich with metadata
 * Cleans obsolete properties and preserves source filename
 * @param {Object} image - Image object from JSON (mutated in place)
 */
async function processImage(image) {
  try {
    const srcPath = resolve(__dirname, '..', image.src);

    const metadata = await Image(srcPath, {
      widths: WIDTHS,
      formats: FORMATS,
      outputDir: OUTPUT_DIR,
      urlPath: URL_PATH,
      filenameFormat: (id, src, width, format) => {
        const extension = extname(src);
        const name = basename(src, extension);
        return `${name}-${width}.${format}`;
      },
      cacheOptions: {
        duration: '1d',
        directory: '.cache',
        removeUrlQueryParams: false,
      },
    });

    const webpImages = metadata.webp;

    if (!webpImages || webpImages.length === 0) {
      throw new Error(`No WebP images generated for ${image.name}`);
    }

    const largestImage = webpImages[webpImages.length - 1];

    const srcset = webpImages
      .map(img => `${img.url} ${img.width}w`)
      .join(', ');

    const maxWidth = largestImage.width;
    const sizes = `(max-width: 768px) 100vw, ${maxWidth}px`;

    // Clean obsolete properties
    delete image.sources;

    // Update metadata
    image.width = largestImage.width;
    image.height = largestImage.height;
    image.srcset = srcset;
    image.sizes = sizes;

    console.log(`[Image Metadata] Processed ${image.name} (${image.width}x${image.height})`);

  } catch (error) {
    console.error(`[Image Metadata] Failed to process ${image.name}:`, error.message);
    throw error;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Execution
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

generateImageMetadata();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
