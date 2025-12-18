# T048 Verification: Test Image Detection on Common Websites

**Task**: T048 [US3] - Test image detection on common websites (e-commerce sites, social media, image galleries, verify no page layout breaks, verify no console errors)

**Date**: 2025-01-27  
**Status**: Ready for Verification

## Objective

Verify that the CapThat Chrome Extension correctly detects capturable images on common websites without breaking page layout or producing console errors. This ensures the extension works reliably across different website types and layouts.

## Prerequisites

1. ✅ Extension built successfully (`npm run build:extension`)
2. ✅ Build output exists at `build/extension/`
3. ✅ Extension loaded in Chrome (via "Load unpacked")
4. ✅ Chrome DevTools available for console inspection
5. ✅ Internet connection for accessing test websites

## Test Categories

This verification tests image detection on three categories of websites:
1. **E-commerce sites** - Product pages with multiple images
2. **Social media sites** - User-generated content with images
3. **Image galleries** - Dedicated image viewing pages

## Verification Steps

### Step 1: Prepare Testing Environment

1. Open Chrome browser
2. Open Chrome DevTools (F12 or right-click → Inspect)
3. Go to Console tab
4. Clear console (right-click → Clear console)
5. Navigate to test website

### Step 2: Test E-commerce Sites

**Test Sites** (choose 2-3):
- Amazon product page (e.g., any product with images)
- eBay listing page
- Etsy product page
- Shopify store product page

**For each e-commerce site:**

1. Navigate to a product page with multiple images
2. Wait for page to fully load (including lazy-loaded images)
3. **Verify Image Detection**:
   - ✅ Open DevTools Console
   - ✅ Check for: `CapThat content script loaded`
   - ✅ Check for: `Found X capturable images` (where X > 0)
   - ✅ Verify "Cap!" buttons appear on product images
   - ✅ Verify buttons are positioned correctly (top-right corner of images)

4. **Verify No Layout Breaks**:
   - ✅ Page layout remains intact
   - ✅ Images display correctly
   - ✅ No overlapping elements
   - ✅ No shifted content
   - ✅ Product information visible
   - ✅ Navigation/header/footer unchanged

5. **Verify No Console Errors**:
   - ✅ No red error messages
   - ✅ No yellow warnings (except acceptable deprecation warnings)
   - ✅ No CSP violations
   - ✅ No JavaScript errors
   - ✅ No content script injection errors

6. **Test Interactions**:
   - ✅ Page scrolling works normally
   - ✅ Clicking product images works (if site allows)
   - ✅ Hover effects on images work
   - ✅ Site navigation works
   - ✅ No broken functionality

**Expected Console Output**:
```
CapThat content script loaded
Initializing CapThat content script
Scanning X <img> elements for capturable images
Found Y capturable images
Injected capture control on image: [URL]...
Image detection observer set up for dynamic content
```

**Common Issues to Watch For**:
- ❌ Layout shifts when buttons appear
- ❌ Images not displaying correctly
- ❌ Buttons covering important content
- ❌ Console errors related to image detection
- ❌ Content script not loading
- ❌ Buttons not appearing on images

### Step 3: Test Social Media Sites

**Test Sites** (choose 2-3):
- Twitter/X (image posts)
- Instagram (image posts)
- Pinterest (pins)
- Reddit (image posts)
- Facebook (image posts)

**For each social media site:**

1. Navigate to a page with image posts
2. Wait for page to fully load
3. **Verify Image Detection**:
   - ✅ "Cap!" buttons appear on post images
   - ✅ Buttons work on both single images and image carousels
   - ✅ Console shows correct image count

4. **Verify No Layout Breaks**:
   - ✅ Post layout unchanged
   - ✅ Feed scrolling works
   - ✅ Image carousels work (if applicable)
   - ✅ No visual glitches
   - ✅ Buttons don't interfere with post interactions

5. **Verify No Console Errors**:
   - ✅ No errors in console
   - ✅ No warnings about image detection
   - ✅ Content script loads successfully

6. **Test Dynamic Content**:
   - ✅ Scroll down to load more posts (infinite scroll)
   - ✅ Verify new images get "Cap!" buttons
   - ✅ Console shows: `New images detected, re-scanning page`
   - ✅ No errors when new content loads

**Expected Behavior**:
- Buttons appear on all visible images
- New images get buttons as they load
- No layout disruption
- No console errors

### Step 4: Test Image Galleries

**Test Sites** (choose 2-3):
- Unsplash (photo gallery)
- Pexels (photo gallery)
- Flickr (photo gallery)
- Imgur (image gallery)
- Google Images search results

**For each image gallery:**

1. Navigate to gallery page
2. Wait for images to load
3. **Verify Image Detection**:
   - ✅ "Cap!" buttons appear on gallery images
   - ✅ Buttons work on grid layouts
   - ✅ Buttons work on masonry layouts
   - ✅ Buttons work on lightbox/modal views (if applicable)

4. **Verify No Layout Breaks**:
   - ✅ Gallery grid layout intact
   - ✅ Image spacing correct
   - ✅ No overlapping buttons
   - ✅ Gallery navigation works
   - ✅ Lightbox/modal works (if applicable)

5. **Verify No Console Errors**:
   - ✅ No errors during initial load
   - ✅ No errors when scrolling/loading more images
   - ✅ No errors when opening lightbox

6. **Test Lazy Loading**:
   - ✅ Scroll to trigger lazy-loaded images
   - ✅ Verify buttons appear on newly loaded images
   - ✅ Console shows detection of new images
   - ✅ No errors during lazy loading

**Expected Behavior**:
- All gallery images get buttons
- Layout remains stable
- Lazy-loaded images get buttons automatically
- No console errors

### Step 5: Test Edge Cases

**Test Scenarios:**

1. **Pages with No Images**:
   - Navigate to a text-only page (e.g., Wikipedia article without images)
   - ✅ Console shows: `Found 0 capturable images`
   - ✅ No errors
   - ✅ Page works normally

2. **Pages with Broken Images**:
   - Navigate to a page with broken image links
   - ✅ Broken images are skipped (not marked as capturable)
   - ✅ No errors
   - ✅ Valid images still get buttons

3. **Pages with Lazy-Loaded Images**:
   - Navigate to a page with lazy-loaded images (e.g., Pinterest)
   - ✅ Initial images get buttons
   - ✅ Scroll to load more images
   - ✅ New images get buttons automatically
   - ✅ Console shows: `New images detected, re-scanning page`
   - ✅ No errors during lazy loading

4. **Pages with SVG Images**:
   - Navigate to a page with SVG images
   - ✅ SVG images are handled appropriately (may or may not be capturable based on implementation)
   - ✅ No errors

5. **Pages with Data URLs**:
   - Navigate to a page with data: URL images
   - ✅ Data URL images are handled (if supported)
   - ✅ No errors

6. **Pages with iframes**:
   - Navigate to a page with embedded iframes
   - ✅ Content script runs in main page context
   - ✅ Images in iframes may not be detected (expected behavior)
   - ✅ No errors

## Verification Checklist

### E-commerce Sites
- [ ] Tested on 2-3 e-commerce sites
- [ ] Images detected correctly
- [ ] "Cap!" buttons appear on product images
- [ ] No layout breaks
- [ ] No console errors
- [ ] Page interactions work normally

### Social Media Sites
- [ ] Tested on 2-3 social media sites
- [ ] Images detected correctly
- [ ] "Cap!" buttons appear on post images
- [ ] Dynamic content (infinite scroll) works
- [ ] No layout breaks
- [ ] No console errors

### Image Galleries
- [ ] Tested on 2-3 image gallery sites
- [ ] Images detected correctly
- [ ] "Cap!" buttons appear on gallery images
- [ ] Lazy loading works
- [ ] No layout breaks
- [ ] No console errors

### Edge Cases
- [ ] Pages with no images handled gracefully
- [ ] Broken images skipped correctly
- [ ] Lazy-loaded images detected automatically
- [ ] No errors in edge cases

### Overall
- [ ] All test categories completed
- [ ] No layout breaks on any tested site
- [ ] No console errors on any tested site
- [ ] Image detection works reliably
- [ ] Extension functions correctly across website types

## Test Results

**Test Date**: _______________  
**Tester**: _______________  
**Chrome Version**: _______________  
**Extension Version**: 0.1.0

### E-commerce Sites Tested
- [ ] Site 1: _______________ - ✅ PASS / ❌ FAIL
- [ ] Site 2: _______________ - ✅ PASS / ❌ FAIL
- [ ] Site 3: _______________ - ✅ PASS / ❌ FAIL

**Notes**:
```
[Document any issues found]
```

### Social Media Sites Tested
- [ ] Site 1: _______________ - ✅ PASS / ❌ FAIL
- [ ] Site 2: _______________ - ✅ PASS / ❌ FAIL
- [ ] Site 3: _______________ - ✅ PASS / ❌ FAIL

**Notes**:
```
[Document any issues found]
```

### Image Galleries Tested
- [ ] Site 1: _______________ - ✅ PASS / ❌ FAIL
- [ ] Site 2: _______________ - ✅ PASS / ❌ FAIL
- [ ] Site 3: _______________ - ✅ PASS / ❌ FAIL

**Notes**:
```
[Document any issues found]
```

### Edge Cases Tested
- [ ] Pages with no images - ✅ PASS / ❌ FAIL
- [ ] Broken images - ✅ PASS / ❌ FAIL
- [ ] Lazy-loaded images - ✅ PASS / ❌ FAIL
- [ ] SVG images - ✅ PASS / ❌ FAIL
- [ ] Data URL images - ✅ PASS / ❌ FAIL
- [ ] Pages with iframes - ✅ PASS / ❌ FAIL

**Notes**:
```
[Document any issues found]
```

### Console Errors Found
- [ ] ✅ No console errors found
- [ ] ❌ Console errors found (document below)

**Errors** (if any):
```
[Paste error messages here with context and website URL]
```

### Layout Issues Found
- [ ] ✅ No layout breaks found
- [ ] ❌ Layout breaks found (document below)

**Layout Issues** (if any):
```
[Describe layout issues with website URL and screenshots if possible]
```

### Overall Result
- [ ] ✅ PASS - Image detection works on all tested sites without layout breaks or console errors
- [ ] ❌ FAIL - Issues found (document above)

## Success Criteria

✅ **T048 PASSES** if:
- Image detection works on e-commerce sites (2-3 tested)
- Image detection works on social media sites (2-3 tested)
- Image detection works on image galleries (2-3 tested)
- No page layout breaks on any tested site
- No console errors on any tested site
- Edge cases handled gracefully
- Dynamic content (lazy loading, infinite scroll) works correctly

❌ **T048 FAILS** if:
- Layout breaks occur on any tested site
- Console errors appear on any tested site
- Image detection fails on common website types
- Buttons don't appear on images
- Extension breaks page functionality
- Dynamic content not handled correctly

## Troubleshooting

### If Images Are Not Detected
1. Check console for content script loading message
2. Verify content script is injected (check `chrome://extensions/` → CapThat → Details → Content scripts)
3. Check for CSP violations in console
4. Verify images have valid src attributes
5. Check if images are in shadow DOM (may not be detected)

### If Layout Breaks Occur
1. Check button positioning code in `content-script.ts`
2. Verify buttons use absolute positioning
3. Check z-index values (should be very high: 999999)
4. Verify buttons don't interfere with page CSS
5. Check for CSS conflicts with page styles

### If Console Errors Appear
1. Check error message for specific issue
2. Verify all imports are correct
3. Check for CSP violations
4. Verify URL validation is working
5. Check for null/undefined references

### If Buttons Don't Appear
1. Verify images are detected (check console log)
2. Check if images are visible (rect.width > 0 && rect.height > 0)
3. Verify buttons are being created and appended to DOM
4. Check for CSS that might hide buttons
5. Verify isolated world is working correctly

## Next Steps

After successful verification:
- [ ] Mark T048 as complete in tasks.md
- [ ] Proceed to T049 (Handle edge cases: pages with no images, broken images, lazy-loaded images)

## Notes

- Console.log statements are intentional for debugging and do not constitute errors
- Some websites may have aggressive CSP policies that prevent content script execution (document these)
- Shadow DOM images may not be detected (this is expected behavior)
- Images in iframes are not detected (content scripts run in main page context only)
- Very small images (1x1 pixels) are intentionally skipped as they're often trackers

