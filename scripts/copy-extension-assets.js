const fs = require('fs');
const path = require('path');

const extensionDir = path.join(__dirname, '..', 'extension');
const buildDir = path.join(__dirname, '..', 'build', 'extension');

// Copy manifest.json
const manifestSrc = path.join(extensionDir, 'manifest.json');
const manifestDest = path.join(buildDir, 'manifest.json');
if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log('✓ Copied manifest.json');
}

// Copy icons directory if it exists
const iconsSrc = path.join(extensionDir, 'icons');
const iconsDest = path.join(buildDir, 'icons');
if (fs.existsSync(iconsSrc)) {
  if (!fs.existsSync(iconsDest)) {
    fs.mkdirSync(iconsDest, { recursive: true });
  }
  const iconFiles = fs.readdirSync(iconsSrc);
  iconFiles.forEach(file => {
    fs.copyFileSync(
      path.join(iconsSrc, file),
      path.join(iconsDest, file)
    );
  });
  console.log('✓ Copied icons');
} else {
  console.log('⚠ Icons directory not found - extension will use default icons');
}

console.log('Extension assets copied successfully');

