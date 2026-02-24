/* ┌──────────────────────────────────────────────────────────┐
   │ SCRIPT › Sync Image Sizes                                │
   │ Extracts width/height dimensions for HAT image components│
   └──────────────────────────────────────────────────────────┘ */

/**
 * @fileoverview Extracts and syncs width/height dimensions into image.json
 * No file generation — image optimization is handled by
 * eleventyImageTransformPlugin at build time
 * @module bin/sync-image-sizes
 * @requires @11ty/eleventy-img
 * @requires fs/promises
 * @requires path
 */

import Image from '@11ty/eleventy-img';
import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Constants
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JSON_PATH = resolve(__dirname, '../src/_data/atoms/image.json');

const VARIANT_DEFAULT = 'default';
const VARIANT_AVATAR = 'avatar';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Function
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

async function syncImageSizes() {
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

    console.log(`[Image Metadata] Processed ${processedCount} images`);
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
 * Retrieve width/height from image file — no file generation
 * eleventyImageTransformPlugin handles optimization at build time
 * @param {Object} image - Image object from JSON (mutated in place)
 */
async function processImage(image) {
  try {
    const srcPath = resolve(__dirname, '..', 'src', image.src.slice(1));

    // statsOnly: true — reads dimensions without generating any file
    const metadata = await Image(srcPath, {
      statsOnly: true,
      formats: ['jpeg'],  // required by statsOnly, no file written
      widths: ['auto'],
    });

    // Get original dimensions from any available format
    const formatKey = Object.keys(metadata)[0];
    const original = metadata[formatKey][metadata[formatKey].length - 1];

    if (!original) {
      throw new Error(`No metadata retrieved for ${image.name}`);
    }

    // Store dimensions only — srcset/sources no longer needed
    image.width = original.width;
    image.height = original.height;

    // Clean obsolete properties from previous pipeline
    delete image.srcset;
    delete image.sources;
    delete image.sizes;

    console.log(`[Image Metadata] Dimensions retrieved: ${image.name} (${image.width}x${image.height})`);

  } catch (error) {
    console.error(`[Image Metadata] Failed to process ${image.name}:`, error.message);
    throw error;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// Execution
// ━━━━━━━━━━━━━━━━━━━━━━━━━━

syncImageSizes();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━
// May your bugs be forever exiled to the shadow realm ✦
// HAT · 2026
// ━━━━━━━━━━━━━━━━━━━━━━━━━━
