/**
 * Generate PNG icons from SVG sources
 * Converts SVG icon files to PNG format for Chrome extension manifest
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const iconSizes = [16, 48, 128];

async function generateIcons() {
  console.log('Generating PNG icons from SVG sources...');
  
  for (const size of iconSizes) {
    const svgPath = join(__dirname, `icon-${size}.svg`);
    const pngPath = join(__dirname, `icon-${size}.png`);
    
    try {
      const svgBuffer = readFileSync(svgPath);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      
      console.log(`✓ Generated icon-${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to generate icon-${size}.png:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('All icons generated successfully!');
}

generateIcons().catch((error) => {
  console.error('Error generating icons:', error);
  process.exit(1);
});

