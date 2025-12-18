#!/usr/bin/env node

/**
 * Extension Validation Script
 * Validates that the built extension has all required files and structure
 * for loading in Chrome via "Load unpacked"
 * 
 * Usage: node scripts/validate-extension.js
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build', 'extension');
const errors = [];
const warnings = [];

console.log('🔍 Validating CapThat Extension Build...\n');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory not found:', buildDir);
  console.error('   Run: npm run build:extension');
  process.exit(1);
}

console.log('✓ Build directory exists:', buildDir);

// Required files
const requiredFiles = [
  'manifest.json',
  'background/service-worker.js',
  'content/content-script.js',
  'ui/side-panel.html',
  'ui/side-panel.js',
];

// Check required files
console.log('\n📋 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > 0) {
      console.log(`  ✓ ${file} (${stats.size} bytes)`);
    } else {
      warnings.push(`${file} exists but is empty`);
      console.log(`  ⚠ ${file} (empty file)`);
    }
  } else {
    errors.push(`Required file missing: ${file}`);
    console.log(`  ❌ ${file} (missing)`);
  }
});

// Check manifest.json structure
console.log('\n📄 Validating manifest.json...');
const manifestPath = path.join(buildDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Check manifest version
    if (manifest.manifest_version !== 3) {
      errors.push('manifest.json: manifest_version must be 3');
      console.log('  ❌ manifest_version must be 3');
    } else {
      console.log('  ✓ manifest_version: 3');
    }
    
    // Check required fields
    const requiredFields = ['name', 'version', 'background', 'content_scripts'];
    requiredFields.forEach(field => {
      if (manifest[field]) {
        console.log(`  ✓ ${field}: present`);
      } else {
        errors.push(`manifest.json: missing required field '${field}'`);
        console.log(`  ❌ ${field}: missing`);
      }
    });
    
    // Check service worker path
    if (manifest.background?.service_worker) {
      const swPath = path.join(buildDir, manifest.background.service_worker);
      if (fs.existsSync(swPath)) {
        console.log(`  ✓ service_worker: ${manifest.background.service_worker} (exists)`);
      } else {
        errors.push(`manifest.json: service_worker file not found: ${manifest.background.service_worker}`);
        console.log(`  ❌ service_worker: ${manifest.background.service_worker} (not found)`);
      }
    }
    
    // Check content scripts
    if (manifest.content_scripts && manifest.content_scripts.length > 0) {
      manifest.content_scripts.forEach((cs, idx) => {
        if (cs.js && cs.js.length > 0) {
          cs.js.forEach(jsFile => {
            const jsPath = path.join(buildDir, jsFile);
            if (fs.existsSync(jsPath)) {
              console.log(`  ✓ content_script[${idx}]: ${jsFile} (exists)`);
            } else {
              errors.push(`manifest.json: content_script file not found: ${jsFile}`);
              console.log(`  ❌ content_script[${idx}]: ${jsFile} (not found)`);
            }
          });
        }
      });
    }
    
    // Check side panel
    if (manifest.side_panel?.default_path) {
      const sidePanelPath = path.join(buildDir, manifest.side_panel.default_path);
      if (fs.existsSync(sidePanelPath)) {
        console.log(`  ✓ side_panel: ${manifest.side_panel.default_path} (exists)`);
      } else {
        warnings.push(`manifest.json: side_panel file not found: ${manifest.side_panel.default_path}`);
        console.log(`  ⚠ side_panel: ${manifest.side_panel.default_path} (not found)`);
      }
    }
    
    // Check permissions
    if (manifest.permissions && manifest.permissions.length > 0) {
      console.log(`  ✓ permissions: ${manifest.permissions.join(', ')}`);
    }
    
    // Check CSP
    if (manifest.content_security_policy) {
      console.log('  ✓ content_security_policy: present');
    }
    
  } catch (e) {
    errors.push(`manifest.json: Invalid JSON - ${e.message}`);
    console.log(`  ❌ manifest.json: Invalid JSON - ${e.message}`);
  }
} else {
  errors.push('manifest.json not found');
}

// Check for CSS assets
console.log('\n🎨 Checking CSS assets...');
const assetsDir = path.join(buildDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    console.log(`  ✓ Found ${cssFiles.length} CSS file(s)`);
    cssFiles.forEach(file => {
      const filePath = path.join(assetsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`    - ${file} (${stats.size} bytes)`);
    });
  } else {
    warnings.push('No CSS files found in assets directory');
    console.log('  ⚠ No CSS files found');
  }
} else {
  warnings.push('Assets directory not found (may be OK if no CSS)');
  console.log('  ⚠ Assets directory not found');
}

// Check side panel HTML references
console.log('\n🔗 Checking side panel HTML references...');
const sidePanelPath = path.join(buildDir, 'ui', 'side-panel.html');
if (fs.existsSync(sidePanelPath)) {
  const html = fs.readFileSync(sidePanelPath, 'utf8');
  
  // Check for JS reference
  const jsMatch = html.match(/src=["']([^"']+\.js)["']/);
  if (jsMatch) {
    const jsPath = jsMatch[1];
    // Paths in HTML should start with / for extension root
    if (jsPath.startsWith('/')) {
      const relativePath = jsPath.substring(1); // Remove leading /
      const fullPath = path.join(buildDir, relativePath);
      if (fs.existsSync(fullPath)) {
        console.log(`  ✓ JS reference: ${jsPath} (resolves to existing file)`);
      } else {
        errors.push(`side-panel.html: JS file not found: ${jsPath}`);
        console.log(`  ❌ JS reference: ${jsPath} (file not found)`);
      }
    } else {
      // Relative path - check if it exists relative to HTML location
      const htmlDir = path.dirname(sidePanelPath);
      const relativePath = path.join(htmlDir, jsPath);
      if (fs.existsSync(relativePath)) {
        console.log(`  ✓ JS reference: ${jsPath} (relative path exists)`);
      } else {
        errors.push(`side-panel.html: JS file not found: ${jsPath}`);
        console.log(`  ❌ JS reference: ${jsPath} (file not found)`);
      }
    }
  }
  
  // Check for CSS reference
  const cssMatch = html.match(/href=["']([^"']+\.css)["']/);
  if (cssMatch) {
    const cssPath = cssMatch[1];
    if (cssPath.startsWith('/')) {
      const relativePath = cssPath.substring(1);
      const fullPath = path.join(buildDir, relativePath);
      if (fs.existsSync(fullPath)) {
        console.log(`  ✓ CSS reference: ${cssPath} (resolves to existing file)`);
      } else {
        warnings.push(`side-panel.html: CSS file not found: ${cssPath}`);
        console.log(`  ⚠ CSS reference: ${cssPath} (file not found)`);
      }
    } else {
      const htmlDir = path.dirname(sidePanelPath);
      const relativePath = path.join(htmlDir, cssPath);
      if (fs.existsSync(relativePath)) {
        console.log(`  ✓ CSS reference: ${cssPath} (relative path exists)`);
      } else {
        warnings.push(`side-panel.html: CSS file not found: ${cssPath}`);
        console.log(`  ⚠ CSS reference: ${cssPath} (file not found)`);
      }
    }
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Validation Summary\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Extension is ready to load in Chrome.');
  console.log('\n📝 Next steps:');
  console.log('   1. Open Chrome and go to chrome://extensions/');
  console.log('   2. Enable "Developer mode"');
  console.log('   3. Click "Load unpacked"');
  console.log('   4. Select:', buildDir);
  console.log('   5. Verify extension loads without errors');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`❌ Found ${errors.length} error(s):\n`);
    errors.forEach((error, idx) => {
      console.log(`   ${idx + 1}. ${error}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  Found ${warnings.length} warning(s):\n`);
    warnings.forEach((warning, idx) => {
      console.log(`   ${idx + 1}. ${warning}`);
    });
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Extension validation failed. Fix errors before loading in Chrome.');
    process.exit(1);
  } else {
    console.log('\n⚠️  Extension has warnings but may still load. Review warnings above.');
    process.exit(0);
  }
}

