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

// Fix HTML paths to use relative paths for Chrome extension compatibility
const sidePanelHtmlPath = path.join(buildDir, 'ui', 'side-panel.html');
if (fs.existsSync(sidePanelHtmlPath)) {
  let htmlContent = fs.readFileSync(sidePanelHtmlPath, 'utf8');
  
  // Fix script path: should be relative to HTML file location
  htmlContent = htmlContent.replace(
    /src=["']([^"']*\/)?ui\/side-panel\.js["']/g,
    'src="./side-panel.js"'
  );
  
  // Fix CSS path: should be relative to HTML file location (one level up, then assets)
  htmlContent = htmlContent.replace(
    /href=["']([^"']*\/)?assets\/([^"']+)["']/g,
    'href="../assets/$2"'
  );
  
  fs.writeFileSync(sidePanelHtmlPath, htmlContent, 'utf8');
  console.log('✓ Fixed HTML paths for Chrome extension compatibility');
}

console.log('Extension assets copied successfully');

