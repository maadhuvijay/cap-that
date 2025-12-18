# Extension Load Test Verification (T011)

**Task**: T011 - Test extension loads in Chrome via "Load unpacked" without errors

**Date**: 2025-01-27  
**Status**: Ready for Testing

## Prerequisites

1. Chrome browser installed (version 88+ for Manifest V3 support)
2. Extension built successfully (`npm run build:extension`)
3. Build output exists at `build/extension/`

## Test Steps

### 1. Build Verification

- [x] Extension builds without errors
- [x] Build output directory exists: `build/extension/`
- [x] Required files present:
  - [x] `manifest.json`
  - [x] `background/service-worker.js`
  - [x] `content/content-script.js`
  - [x] `ui/side-panel.html`
  - [x] `ui/side-panel.js`
  - [x] CSS assets in `assets/` directory

### 2. Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked" button
5. Select the `build/extension/` directory
6. Click "Select Folder"

### 3. Verification Checklist

#### Extension Appears in List
- [ ] Extension appears in extensions list
- [ ] Extension name shows as "CapThat"
- [ ] Extension version shows as "0.1.0"
- [ ] Extension is enabled (toggle is ON)

#### No Console Errors
- [ ] Open Chrome DevTools (F12 or right-click → Inspect)
- [ ] Check Console tab for errors
- [ ] No red error messages
- [ ] Service worker shows "CapThat service worker loaded" message

#### Service Worker Status
- [ ] Go to `chrome://extensions/`
- [ ] Find "CapThat" extension
- [ ] Click "service worker" link (if available)
- [ ] Service worker console shows: "CapThat service worker loaded"
- [ ] No errors in service worker console

#### Manifest Validation
- [ ] No manifest errors shown in extensions page
- [ ] All permissions are listed correctly:
  - [ ] storage
  - [ ] activeTab
  - [ ] scripting
  - [ ] sidePanel

#### Content Script Injection
- [ ] Open any website (e.g., `https://example.com`)
- [ ] Open DevTools Console
- [ ] Check for content script errors
- [ ] Content script should load without errors

#### Side Panel Access
- [ ] Click extension icon in toolbar
- [ ] Side panel should open (or action button should be available)
- [ ] Side panel HTML loads without errors
- [ ] No CSP violations in console

### 4. Error Detection

Check for the following common errors:

#### Manifest Errors
- ❌ "Manifest file is missing or unreadable"
- ❌ "Invalid manifest version"
- ❌ "Permission not recognized"
- ❌ "Service worker file not found"

#### Service Worker Errors
- ❌ "Failed to load service worker"
- ❌ "Service worker registration failed"
- ❌ Syntax errors in service-worker.js
- ❌ Module import errors

#### Content Script Errors
- ❌ "Failed to load content script"
- ❌ "Content script injection failed"
- ❌ Syntax errors in content-script.js

#### Side Panel Errors
- ❌ "Failed to load side panel"
- ❌ "Resource not found" (404 errors for JS/CSS)
- ❌ CSP violations
- ❌ React/JSX errors

#### Build/Path Errors
- ❌ "File not found" errors
- ❌ Incorrect asset paths
- ❌ Missing dependencies

### 5. Expected Console Output

#### Service Worker Console
```
CapThat service worker loaded
```

#### Extension Console (if opened)
- No errors
- Optional: Installation message if first load

#### Content Script Console (on any webpage)
- No errors
- Content script should load silently

### 6. Test Results

**Test Date**: _______________  
**Tester**: _______________  
**Chrome Version**: _______________  

**Result**: 
- [ ] ✅ PASS - Extension loads without errors
- [ ] ❌ FAIL - Errors found (document below)

#### Errors Found (if any):

```
[Paste error messages here]
```

#### Notes:

```
[Any additional observations]
```

### 7. Quick Re-test After Code Changes

After making code changes:
1. Run `npm run build:extension`
2. Go to `chrome://extensions/`
3. Click reload icon (🔄) on CapThat extension
4. Verify no new errors appear

## Success Criteria

✅ **Extension loads successfully** if:
- Extension appears in `chrome://extensions/` list
- No errors in Chrome extension console
- No errors in service worker console
- No errors in content script console
- Side panel can be opened (if implemented)
- All files load correctly

## Troubleshooting

### Extension doesn't appear
- Verify `build/extension/` directory exists
- Check that `manifest.json` is in the root of `build/extension/`
- Ensure all required files are present

### Service worker errors
- Check `build/extension/background/service-worker.js` exists
- Verify file is valid JavaScript
- Check for syntax errors

### Side panel errors
- Verify `build/extension/ui/side-panel.html` exists
- Check that JS and CSS files are in correct locations
- Verify paths in HTML are correct (should start with `/` for extension root)

### Content script errors
- Check `build/extension/content/content-script.js` exists
- Verify manifest.json has correct content_scripts configuration

### Permission errors
- Verify manifest.json permissions are valid for Manifest V3
- Check that permissions match Chrome API requirements

## Next Steps

After successful load test:
- [ ] Mark T011 as complete in tasks.md
- [ ] Proceed to T012 (Verify Next.js setup exists)

