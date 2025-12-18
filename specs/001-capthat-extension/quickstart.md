# Quickstart: CapThat Chrome Extension

**Feature**: 001-capthat-extension  
**Date**: 2025-01-27  
**Status**: Test Scenarios

## Overview

This document provides test scenarios for validating the CapThat Chrome Extension implementation. Each scenario maps to user stories and can be executed independently to verify functionality.

## Prerequisites

1. Extension built and ready to load
2. Chrome browser with developer mode enabled
3. Test pages with images (e.g., e-commerce sites, image galleries)

## Setup

### Load Extension

1. Run build command: `npm run build:extension`
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `extension/dist` directory (or build output directory)
6. Verify extension appears in extensions list with name "CapThat" and icon

**Expected Result**: Extension loads without errors, appears in extensions list

---

## Test Scenarios

### Scenario 1: Load Extension (User Story 1)

**Goal**: Verify extension loads successfully in Chrome

**Steps**:
1. Run build command
2. Open `chrome://extensions`
3. Enable Developer mode
4. Click "Load unpacked"
5. Select extension build output directory
6. Verify extension appears in list

**Expected Results**:
- ✅ Extension loads without console errors
- ✅ Extension shows name "CapThat" in extensions list
- ✅ Extension shows icon in extensions list
- ✅ Reloading extension after code changes reflects updates

**Independent Test**: Extension loads in Chrome via "Load unpacked" without errors

---

### Scenario 2: Open CapThat Panel (User Story 2)

**Goal**: Verify panel UI displays correctly

**Steps**:
1. Load extension (from Scenario 1)
2. Click extension action button (or open side panel)
3. Observe panel interface

**Expected Results**:
- ✅ Panel opens within 1 second
- ✅ Title "CapThat!" is visible
- ✅ Empty grid with N slots (e.g., 10) is visible
- ✅ Placeholder text appears: "Click Cap! to capture images"
- ✅ Action buttons are visible: Clear, Export JSON, Export CapBoard, Export Individual Caps
- ✅ UI is styled with Tailwind CSS
- ✅ UI is usable at desktop width (1024px+)

**Independent Test**: Panel opens and displays complete UI within 1 second

---

### Scenario 3: Detect Images on Page (User Story 3)

**Goal**: Verify extension detects capturable images

**Steps**:
1. Load extension
2. Navigate to a page with images (e.g., e-commerce product page)
3. Observe page behavior
4. Check browser console for errors

**Expected Results**:
- ✅ Extension injects capture controls or enables capture mode
- ✅ Images with valid `<img>` sources are marked as capturable
- ✅ Page layout is not broken
- ✅ Page interactions work normally
- ✅ No console errors on common websites

**Test Pages**:
- E-commerce site (product images)
- Image gallery
- Social media feed
- News article with images

**Independent Test**: Extension detects images without breaking page functionality

---

### Scenario 4: Capture Image (User Story 4)

**Goal**: Verify image capture functionality

**Steps**:
1. Load extension and open panel
2. Navigate to page with images
3. Click "Cap!" button on an image tile
4. Observe panel for new item
5. Check item metadata

**Expected Results**:
- ✅ Item appears in panel within 2 seconds
- ✅ Item includes image reference (URL or blob)
- ✅ Item includes source page URL
- ✅ Item includes captured timestamp
- ✅ Toast notification appears: "Captured"

**Duplicate Handling**:
- Capture same image twice (same content hash)
- Verify either duplicate is prevented OR already-captured indicator shows

**Board Limits**:
- Capture 80 items → Warning message appears
- Capture 100 items → Capture blocked, "Board is full" message shown

**Independent Test**: Image appears in panel within 2 seconds with all metadata

---

### Scenario 5: View Captured Items in Grid (User Story 5)

**Goal**: Verify grid display and persistence

**Steps**:
1. Capture multiple items (Scenario 4)
2. View grid in panel
3. Verify thumbnails render
4. Close and reopen panel
5. Restart browser and reopen panel

**Expected Results**:
- ✅ Empty slots show placeholders when no items
- ✅ Captured items render as thumbnails in grid slots
- ✅ Grid cells show thumbnail and optional metadata (title/domain)
- ✅ Virtual scrolling works for 100+ items (fixed slots, content scrolls)
- ✅ Board state persists after panel close/reopen
- ✅ Board state persists after browser restart

**Independent Test**: Items display correctly and persist across sessions

---

### Scenario 6: Remove Individual Item (User Story 6)

**Goal**: Verify item removal functionality

**Steps**:
1. Capture 3+ items
2. Click remove control (X button) on one item
3. Verify item disappears
4. Verify other items remain
5. Check storage (via DevTools) to confirm removal

**Expected Results**:
- ✅ Item disappears immediately from UI
- ✅ Item is removed from storage
- ✅ Other items remain on board
- ✅ No unintended side effects

**Independent Test**: Item removal works without affecting other items

---

### Scenario 7: Clear Entire Board (User Story 7)

**Goal**: Verify board clearing functionality

**Steps**:
1. Capture multiple items
2. Click "Clear Cap Board" button
3. Confirm action in confirmation dialog
4. Verify all items removed
5. Check storage to confirm deletion

**Expected Results**:
- ✅ Confirmation step appears (modal or confirm prompt)
- ✅ All items removed from UI after confirmation
- ✅ All items deleted from storage
- ✅ Board is empty

**Independent Test**: Board clearing requires confirmation and removes all items

---

### Scenario 8: Persist Board (User Story 8)

**Goal**: Verify board persistence

**Steps**:
1. Capture items
2. Close panel
3. Reopen panel
4. Verify items load automatically
5. Simulate storage error (if possible via DevTools)

**Expected Results**:
- ✅ Items load automatically when panel reopens
- ✅ Board metadata persisted in chrome.storage.local
- ✅ Image blobs stored in IndexedDB (if applicable)
- ✅ Storage errors handled gracefully with non-blocking message

**Independent Test**: Board persists and loads automatically after restart

---

### Scenario 9: Export JSON (User Story 9)

**Goal**: Verify JSON export functionality

**Steps**:
1. Capture 3-5 items with various metadata
2. Click "Export JSON"
3. Verify file downloads
4. Open downloaded JSON file
5. Validate JSON structure

**Expected Results**:
- ✅ `.json` file downloads
- ✅ JSON includes for each item:
  - `id`
  - `imageUrl` (or filename reference)
  - `sourceUrl`
  - `timestamp`
  - Optional metadata fields
- ✅ JSON validates (no circular refs, valid UTF-8)
- ✅ Toast notification: "Exported successfully"

**Independent Test**: Valid JSON file downloads with all required metadata

---

### Scenario 10: Export Individual Images (User Story 10)

**Goal**: Verify individual image export

**Steps**:
1. Capture multiple items
2. Click "Export Individual Caps"
3. Verify multiple files download
4. Check filenames
5. Test with CORS-blocked image

**Expected Results**:
- ✅ Multiple image files download
- ✅ Filenames are consistent and unique (e.g., `cap-<timestamp>-<id>.png`)
- ✅ CORS-blocked images are skipped and reported in summary
- ✅ Export completes successfully

**Independent Test**: Individual images export with consistent filenames

---

### Scenario 11: Export CapBoard as ZIP (User Story 11)

**Goal**: Verify ZIP export functionality

**Steps**:
1. Capture 5-10 items (stay within 50 item limit for v1)
2. Click "Export CapBoard"
3. Verify ZIP file downloads
4. Extract ZIP file
5. Verify contents

**Expected Results**:
- ✅ Single `.zip` file downloads
- ✅ ZIP contains:
  - `/images/` folder with images (if available)
  - `board.json` manifest referencing those images
- ✅ Export completes without crashing
- ✅ Toast notification: "Exported successfully"

**Independent Test**: ZIP export completes successfully for boards up to 50 items

---

### Scenario 12: Handle CORS-Blocked Images (User Story 12)

**Goal**: Verify CORS fallback handling

**Steps**:
1. Navigate to page with CORS-blocked images
2. Attempt to capture CORS-blocked image
3. Verify fallback mechanism works
4. Check item quality indicator

**Expected Results**:
- ✅ System tries capture in order: URL storage → blob fetch → fallback
- ✅ Item is added to board even when fallback used
- ✅ Item has usable thumbnail
- ✅ User is informed via badge/tooltip if lower-quality fallback used

**Test Pages**:
- Sites with strict CORS policies
- Sites with no-cors images

**Independent Test**: CORS-blocked images are captured using fallback mechanisms

---

### Scenario 13: Status Feedback (User Story 13)

**Goal**: Verify user feedback for actions

**Steps**:
1. Capture image → Verify "Captured" toast
2. Export data → Verify "Exported successfully" message
3. Trigger error (e.g., storage full) → Verify error toast with retry button
4. Click retry button → Verify retry functionality
5. Attempt clear board → Verify confirmation dialog (only blocking alert)

**Expected Results**:
- ✅ Capture shows "Captured" toast
- ✅ Export shows "Exported successfully" message
- ✅ Errors show toast with clear message and retry button
- ✅ Retry button allows retry of failed action
- ✅ Only "Clear board confirmation" shows blocking alert
- ✅ All other feedback is non-blocking

**Independent Test**: Appropriate feedback appears for all actions

---

### Scenario 14: Next.js API Integration (User Story 14 - Phase 2)

**Goal**: Verify local Next.js app integration (optional Phase 2)

**Prerequisites**: Next.js app running on `http://localhost:3000`

**Steps**:
1. Start Next.js app: `npm run dev`
2. Capture item in extension
3. Verify item posted to `/api/capture`
4. Stop Next.js app
5. Capture another item
6. Verify fallback to extension-only storage

**Expected Results**:
- ✅ Items posted to `http://localhost:3000/api/capture` when app running
- ✅ Items stored in Next.js app
- ✅ Falls back to extension-only storage when app not running
- ✅ "Local app not detected" message shown when app unavailable (non-blocking)
- ✅ Extension functions normally regardless of app availability

**Independent Test**: Integration works when app available, gracefully degrades when not

---

## Edge Case Scenarios

### Edge Case 1: No Images on Page

**Steps**: Navigate to page with no images  
**Expected**: Extension does not break, no errors, panel still functional

### Edge Case 2: Storage Quota Exceeded

**Steps**: Fill storage quota, attempt capture  
**Expected**: Graceful error handling, non-blocking error message

### Edge Case 3: Very Large Images

**Steps**: Attempt to capture image > 10MB or > 10MP  
**Expected**: Image rejected or resized, appropriate error message

### Edge Case 4: Export Empty Board

**Steps**: Attempt export with no captured items  
**Expected**: Appropriate message or empty export, no errors

### Edge Case 5: Multiple Tabs Capturing

**Steps**: Open multiple tabs, capture simultaneously  
**Expected**: No conflicts, all captures work correctly

---

## Performance Validation

### Performance Targets

- Panel opens: < 1 second
- Capture appears in panel: < 2 seconds
- Export (50 items): < 30 seconds
- Virtual scrolling: Smooth (60fps) for 100+ items

### Load Testing

1. Capture 100 items (board limit)
2. Verify virtual scrolling performance
3. Verify export performance with 50 items
4. Monitor memory usage during large exports

---

## Security Validation

### Security Checks

1. **CSP**: Verify no `eval()` or inline scripts
2. **Permissions**: Verify minimal permissions (activeTab over *://*/*)
3. **URL Validation**: Test with malicious URLs (`javascript:`, `data:` schemes)
4. **Filename Sanitization**: Test export with path traversal characters
5. **Error Messages**: Verify no internal paths exposed

See `checklists/security.md` for comprehensive security testing requirements.

---

## Regression Testing

After each implementation phase, re-run all scenarios to ensure no regressions:

- Phase 1: Scenarios 1-2 (Extension load, Panel UI)
- Phase 2: Scenarios 1-8 (Foundation + Core features)
- Phase 3: Scenarios 1-13 (All core features)
- Phase 4: Scenarios 1-14 (Including Phase 2 integration)

---

## Success Criteria Validation

Each scenario validates corresponding success criteria from `spec.md`:

- SC-001: Scenario 1
- SC-002: Scenario 2
- SC-003: Scenario 3
- SC-004: Scenario 4
- SC-005: Scenario 5
- SC-006: Scenario 6
- SC-007: Scenario 7
- SC-008: Scenario 8
- SC-009: Scenario 9
- SC-010: Scenario 10
- SC-011: Scenario 11
- SC-012: Scenario 12
- SC-013: Scenario 13
- SC-014: Scenario 14

---

## Notes

- All scenarios should be executable independently
- Each scenario maps to specific user stories and acceptance criteria
- Edge cases supplement core scenarios
- Performance and security validations are ongoing
- Regression testing ensures stability across phases
