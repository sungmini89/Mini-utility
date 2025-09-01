const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const src = path.resolve(__dirname, '..', 'logo.png');
  const out192 = path.resolve(__dirname, '..', 'pwa-192x192.png');
  const out512 = path.resolve(__dirname, '..', 'pwa-512x512.png');
  if (!fs.existsSync(src)) {
    console.error('Source logo.png not found at', src);
    process.exit(1);
  }
  try {
    await sharp(src)
      .resize(192, 192, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(out192);
    await sharp(src)
      .resize(512, 512, { fit: 'cover' })
      .png({ compressionLevel: 9 })
      .toFile(out512);
    console.log('Generated pwa-192x192.png and pwa-512x512.png');
  } catch (e) {
    console.error('Failed to generate icons:', e);
    process.exit(1);
  }
}

main();
