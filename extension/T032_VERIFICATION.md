# T032 Verification: Extension Reload Functionality

**Task**: T032 [US1] - Test extension reload functionality (make code change, rebuild, reload extension, verify changes appear)

**Date**: 2025-01-27  
**Status**: Ready for Verification

## Objective

Verify that the CapThat Chrome Extension can be reloaded after code changes and rebuilds, ensuring that modifications to the extension code are properly reflected in Chrome after reloading. This is critical for development workflow and ensures the build process works correctly.

## Prerequisites

1. ✅ Extension built successfully (`npm run build:extension`)
2. ✅ Build output exists at `build/extension/`
3. ✅ Extension loaded in Chrome via "Load unpacked" (from T031)
4. ✅ Chrome browser installed (version 88+ for Manifest V3 support)
5. ✅ Developer mode enabled in Chrome
6. ✅ Code editor available for making test changes

## Verification Steps

### Step 1: Initial State Verification

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Find "CapThat" extension in the list
4. Note the current extension version (should be 0.1.0)
5. Open the side panel by clicking the extension icon
6. **Verify**: Side panel shows "CapThat" heading and placeholder text
7. Open service worker console (click "service worker" link on chrome://extensions/)
8. **Verify**: Console shows "CapThat service worker loaded"

**Expected Initial State**:
- Extension version: 0.1.0
- Side panel shows: "CapThat" heading
- Service worker console shows: "CapThat service worker loaded"

### Step 2: Make a Test Code Change

We'll make a visible change to verify reload works. Choose one of the following test changes:

#### Option A: Change Service Worker Console Message

1. Open `extension/background/service-worker.ts` in your code editor
2. Find the line: `console.log('CapThat service worker loaded');`
3. Change it to: `console.log('CapThat service worker loaded - RELOAD TEST v1');`
4. Save the file

#### Option B: Change Side Panel Text

1. Open `extension/ui/side-panel.tsx` in your code editor
2. Find the line: `<h1>CapThat</h1>`
3. Change it to: `<h1>CapThat - Reload Test v1</h1>`
4. Save the file

#### Option C: Change Extension Version (Advanced)

1. Open `extension/manifest.json` in your code editor
2. Find the line: `"version": "0.1.0"`
3. Change it to: `"version": "0.1.1"`
4. Save the file

**Note**: For this test, we recommend Option A or B as they provide immediate visual feedback.

### Step 3: Rebuild Extension

1. Open terminal/command prompt in the project root directory
2. Run the build command:
   ```bash
   npm run build:extension
   ```
3. **Verify**: Build completes without errors
4. **Verify**: Build output exists at `build/extension/`
5. **Verify**: Modified files are present in build output:
   - For Option A: `build/extension/background/service-worker.js` should contain the new console.log message
   - For Option B: `build/extension/ui/side-panel.js` should contain the new heading text
   - For Option C: `build/extension/manifest.json` should show the new version

**Expected Build Output**:
```
✓ built in XXXms
```

**Common Build Errors**:
- ❌ TypeScript compilation errors
- ❌ Missing dependencies
- ❌ File path errors
- ❌ Vite build errors

### Step 4: Reload Extension in Chrome

1. Navigate to `chrome://extensions/` (if not already there)
2. Find "CapThat" extension in the list
3. Click the **reload icon** (circular arrow) next to the extension
   - OR click the toggle to disable, then enable the extension
   - OR remove and re-add the extension via "Load unpacked"
4. **Verify**: Extension reloads without errors
5. **Verify**: Extension status shows as "Enabled" (green toggle)

**Expected Behavior**:
- Extension reloads successfully
- No error messages appear
- Extension remains enabled

**Common Reload Issues**:
- ❌ Extension fails to reload (error message appears)
- ❌ Extension becomes disabled after reload
- ❌ Service worker fails to start
- ❌ Manifest errors prevent reload

### Step 5: Verify Changes Appear

#### For Option A (Service Worker Change):

1. On `chrome://extensions/`, click the "service worker" link for CapThat
2. Open the Console tab in DevTools
3. **Verify**: Console shows the new message: `CapThat service worker loaded - RELOAD TEST v1`
4. If the message doesn't appear, refresh the service worker console or wait a few seconds

**Expected Output**:
```
CapThat service worker loaded - RELOAD TEST v1
```

#### For Option B (Side Panel Change):

1. Click the CapThat extension icon in the Chrome toolbar
2. Side panel should open
3. **Verify**: Heading shows "CapThat - Reload Test v1" instead of "CapThat"
4. If the change doesn't appear:
   - Close and reopen the side panel
   - Refresh the side panel (right-click → Inspect → refresh)

**Expected Output**:
- Side panel heading: "CapThat - Reload Test v1"

#### For Option C (Version Change):

1. On `chrome://extensions/`, find "CapThat" extension
2. **Verify**: Extension version shows "0.1.1" instead of "0.1.0"
3. Click "Details" to see full manifest
4. **Verify**: Manifest shows version "0.1.1"

**Expected Output**:
- Extension version: 0.1.1

### Step 6: Test Multiple Reload Cycles

To ensure reload functionality is robust, test multiple reload cycles:

1. Make another change (e.g., change "v1" to "v2" in the test change)
2. Rebuild extension: `npm run build:extension`
3. Reload extension in Chrome
4. Verify the new change appears
5. Repeat 2-3 more times

**Expected Behavior**:
- Each reload cycle works correctly
- Changes appear consistently after each reload
- No errors accumulate over multiple reloads

### Step 7: Test Different Change Types

Test reload with different types of changes:

#### Test 7a: TypeScript Code Changes
- Make a change to service worker logic
- Rebuild and reload
- Verify change works

#### Test 7b: UI Component Changes
- Make a change to side panel component
- Rebuild and reload
- Verify change appears in UI

#### Test 7c: Manifest Changes
- Make a change to manifest.json (e.g., description)
- Rebuild and reload
- Verify change is reflected

#### Test 7d: Content Script Changes
- Make a change to content script
- Rebuild and reload
- Navigate to a webpage
- Verify content script change is active

**Expected Behavior**:
- All change types reload correctly
- No errors during reload
- Changes are immediately visible

## Verification Checklist

### Build Process
- [ ] Code changes are saved correctly
- [ ] Build command completes without errors
- [ ] Build output includes modified files
- [ ] Build output is valid JavaScript/JSON

### Reload Process
- [ ] Extension reloads successfully in Chrome
- [ ] No error messages during reload
- [ ] Extension remains enabled after reload
- [ ] Service worker restarts correctly

### Change Verification
- [ ] Code changes appear in reloaded extension
- [ ] Changes are visible in appropriate contexts (console, UI, etc.)
- [ ] No stale code from previous build
- [ ] Multiple reload cycles work correctly

### Different Change Types
- [ ] TypeScript code changes reload correctly
- [ ] UI component changes reload correctly
- [ ] Manifest changes reload correctly
- [ ] Content script changes reload correctly

## Test Results

**Test Date**: _______________  
**Tester**: _______________  
**Chrome Version**: _______________  
**Extension Version**: 0.1.0 (or modified version)

### Build Test
- [ ] ✅ PASS - Build completes successfully
- [ ] ❌ FAIL - Build errors (document below)

### Reload Test
- [ ] ✅ PASS - Extension reloads successfully
- [ ] ❌ FAIL - Reload fails (document below)

### Change Verification Test
- [ ] ✅ PASS - Changes appear after reload
- [ ] ❌ FAIL - Changes do not appear (document below)

### Multiple Reload Cycles Test
- [ ] ✅ PASS - Multiple reloads work correctly
- [ ] ❌ FAIL - Issues with multiple reloads (document below)

### Different Change Types Test
- [ ] ✅ PASS - All change types reload correctly
- [ ] ❌ FAIL - Some change types fail (document below)

### Overall Result
- [ ] ✅ PASS - Extension reload functionality works correctly
- [ ] ❌ FAIL - Reload functionality has issues

### Issues Found (if any):

```
[Document any issues encountered during testing]
```

### Screenshots (if issues found):
- [ ] Build error screenshot
- [ ] Reload error screenshot
- [ ] Before/after change comparison

## Success Criteria

✅ **T032 PASSES** if:
- Code changes can be made successfully
- Extension rebuilds without errors
- Extension reloads in Chrome without errors
- Changes appear correctly after reload
- Multiple reload cycles work correctly
- Different change types (code, UI, manifest, content script) reload correctly

❌ **T032 FAILS** if:
- Build fails after code changes
- Extension fails to reload in Chrome
- Changes do not appear after reload
- Errors occur during reload process
- Multiple reload cycles cause issues
- Some change types do not reload correctly

## Troubleshooting

### If Build Fails

1. **Check TypeScript Errors**:
   - Review TypeScript compilation errors
   - Fix syntax errors or type errors
   - Ensure all imports are correct

2. **Check Vite Configuration**:
   - Verify `extension/vite.config.ts` is correct
   - Check build output paths
   - Verify entry points are correct

3. **Check Dependencies**:
   - Run `npm install` to ensure dependencies are installed
   - Check for missing dependencies
   - Verify package.json scripts are correct

4. **Check File Paths**:
   - Verify all file paths in manifest.json are correct
   - Check that source files exist
   - Verify build output directory structure

### If Reload Fails

1. **Check Extension Status**:
   - Verify extension is enabled
   - Check for manifest errors
   - Review chrome://extensions/ error messages

2. **Check Service Worker**:
   - Open service worker console
   - Look for error messages
   - Verify service worker file exists in build output

3. **Check Build Output**:
   - Verify build output directory exists
   - Check that all required files are present
   - Verify file permissions are correct

4. **Try Manual Reload**:
   - Disable extension
   - Enable extension
   - Or remove and re-add extension

### If Changes Don't Appear

1. **Verify Build Output**:
   - Check that modified files are in build output
   - Verify changes are present in built files
   - Check file timestamps (should be recent)

2. **Clear Extension Cache**:
   - Close all extension-related DevTools windows
   - Reload extension
   - Open fresh DevTools console

3. **Check Context**:
   - Service worker changes: Check service worker console
   - UI changes: Check side panel (may need to close/reopen)
   - Content script changes: Navigate to a new page

4. **Verify File Paths**:
   - Check that manifest.json points to correct files
   - Verify build output structure matches manifest
   - Check for case sensitivity issues

5. **Hard Reload**:
   - Remove extension completely
   - Re-add extension via "Load unpacked"
   - This ensures no cached files are used

## Development Workflow Tips

### Recommended Workflow

1. **Make Code Changes**: Edit source files in `extension/`
2. **Rebuild**: Run `npm run build:extension`
3. **Reload**: Click reload icon in chrome://extensions/
4. **Verify**: Check that changes appear
5. **Repeat**: Continue development cycle

### Watch Mode (Optional)

For faster development, consider using watch mode:

```bash
npm run build:extension:watch
```

This will automatically rebuild when files change. You still need to manually reload the extension in Chrome.

### Hot Reload (Future Enhancement)

Currently, Chrome extensions don't support true hot reload. Each code change requires:
1. Rebuild
2. Manual reload in Chrome

Future enhancements could include:
- Browser extension for auto-reload
- Development script that watches files and triggers reload
- Integration with Chrome Extension API for programmatic reload

## Next Steps

After successful verification:
- [ ] Mark T032 as complete in tasks.md
- [ ] Proceed to T033 (Verify extension appears in chrome://extensions list with correct name and icon)
- [ ] Document any workflow improvements discovered during testing

## Notes

- Extension reload is manual - Chrome does not auto-reload extensions
- Service worker changes require explicit reload (service worker doesn't auto-update)
- UI changes may require closing and reopening the side panel
- Content script changes require navigating to a new page (or refreshing current page)
- Manifest changes always require full extension reload
- Build output should be verified before reload to catch build errors early
- Multiple rapid reloads may cause temporary issues - wait a few seconds between reloads if needed

