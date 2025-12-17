# Feature Specification: CapThat Chrome Extension

**Feature Branch**: `001-capthat-extension`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Epic 1: Extension Setup & Basic UI US-1: Load the extension locally in Chrome"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Load Extension in Chrome (Priority: P1)

As a developer, I want to load the CapThat extension in Chrome (local) so that I can test capture features during development.

**Why this priority**: This is the foundational requirement - without the ability to load the extension, no other functionality can be tested or used. It's the entry point for all development and user testing.

**Independent Test**: Can be fully tested by running the build command, opening chrome://extensions, and successfully loading the unpacked extension. The extension appears in the extensions list with an icon and name, and reloading reflects code changes after rebuild.

**Acceptance Scenarios**:

1. **Given** I have run the build command, **When** I open chrome://extensions and click "Load unpacked", **Then** the extension loads without errors
2. **Given** the extension is loaded, **When** I view the extensions list, **Then** the extension shows an icon and name "CapThat"
3. **Given** I have made code changes and rebuilt, **When** I reload the extension, **Then** the changes are reflected in the extension behavior

---

### User Story 2 - Show CapThat Panel UI (Priority: P1)

As a user, I want to open the CapThat panel so that I can view captured items and export them.

**Why this priority**: The panel is the primary interface for users to interact with captured content. Without it, users cannot see or manage their captures, making the extension non-functional from a user perspective.

**Independent Test**: Can be fully tested by opening the extension panel (via action button, side panel, or injected overlay), verifying the UI displays correctly with title, grid, and action buttons, and confirming it's styled and usable at desktop widths.

**Acceptance Scenarios**:

1. **Given** the extension is loaded, **When** I click the extension action button (or open side panel/overlay), **Then** the CapThat panel opens
2. **Given** the panel is open, **When** I view the interface, **Then** I see:
   - Title "CapThat!"
   - Empty grid with N slots (e.g., 10)
   - Buttons: Clear, Export JSON, Export CapBoard, Export Individual Caps
3. **Given** the panel is open, **When** I view it on a typical desktop width, **Then** the UI is styled with Tailwind and is usable

---

### User Story 3 - Detect Capturable Images on Page (Priority: P2)

As a user, I want CapThat to identify images on the page so that I can capture them quickly.

**Why this priority**: Image detection enables the core capture functionality. Without it, users cannot identify what can be captured, making the extension's primary purpose unavailable.

**Independent Test**: Can be fully tested by visiting a page with images and verifying that the extension injects capture controls or enables capture mode without breaking page layout or producing console errors.

**Acceptance Scenarios**:

1. **Given** I visit a page with images, **When** the extension loads, **Then** it injects capture controls or enables capture mode
2. **Given** the page contains `<img>` elements with valid sources, **When** the extension scans the page, **Then** these images are marked as capturable
3. **Given** the extension is active, **When** I interact with the page normally, **Then** the page layout is not broken and page interactions work normally
4. **Given** the extension is active on common websites, **When** I check the browser console, **Then** no errors are produced

---

### User Story 4 - Capture Image Using "Cap!" Button (Priority: P2)

As a user, I want to click "Cap!" on an image tile so that it gets added to my Cap Board.

**Why this priority**: This is the core user action that delivers the primary value - capturing images. Without this, the extension cannot fulfill its main purpose.

**Independent Test**: Can be fully tested by clicking "Cap!" on an image and verifying it appears in the CapThat panel within 2 seconds with all required metadata, and duplicate captures are handled appropriately.

**Acceptance Scenarios**:

1. **Given** I see a capturable image with a "Cap!" button, **When** I click "Cap!", **Then** the item appears in the CapThat panel within 2 seconds
2. **Given** I capture an image, **When** I view the captured item, **Then** it includes:
   - Image reference (URL or blob)
   - Source page URL
   - Captured timestamp
3. **Given** I have already captured an image, **When** I attempt to capture the same image again, **Then** the system either prevents duplicates OR indicates it's already captured (consistent behavior)

---

### User Story 5 - View Captured Items in Grid (Priority: P2)

As a user, I want to see captured items in a grid so that I can review what I collected.

**Why this priority**: The grid view is essential for users to see and manage their captures. Without it, users cannot review their collection or verify captures were successful.

**Independent Test**: Can be fully tested by capturing multiple items and verifying they render as thumbnails in grid slots with metadata, and the board state persists across refreshes and browser restarts.

**Acceptance Scenarios**:

1. **Given** I have captured items, **When** I open the CapThat panel, **Then** captured items render as thumbnails inside grid slots
2. **Given** I view a captured item in the grid, **When** I examine it, **Then** each grid cell shows:
   - Thumbnail
   - Optional metadata (title/domain) if available
3. **Given** I have captured more than N items, **When** I view the grid, **Then** the grid either scrolls OR paginates (consistent behavior)
4. **Given** I have captured items, **When** I refresh the page or restart the browser, **Then** the board state persists and items are still visible

---

### User Story 6 - Remove a Captured Item (Priority: P3)

As a user, I want to remove a captured item so that I can clean up my board.

**Why this priority**: Item removal is important for board management but is secondary to the core capture and view functionality. Users need this to maintain their board, but the extension is functional without it.

**Independent Test**: Can be fully tested by removing an individual item and verifying it disappears immediately, is removed from storage, and other items remain intact.

**Acceptance Scenarios**:

1. **Given** I have captured items in the grid, **When** I click the remove control (e.g., X button) on an item, **Then** the item disappears immediately
2. **Given** I remove an item, **When** I check storage, **Then** the item is removed from extension storage
3. **Given** I have multiple items, **When** I remove one item, **Then** the other items remain on the board

---

### User Story 7 - Clear the Entire Cap Board (Priority: P3)

As a user, I want to clear the board so that I can start fresh.

**Why this priority**: Board clearing is a convenience feature for managing the board but is not essential for core functionality. Users can manually remove items if needed.

**Independent Test**: Can be fully tested by clicking "Clear Cap Board", confirming the action, and verifying all items are removed from UI and storage.

**Acceptance Scenarios**:

1. **Given** I have captured items, **When** I click "Clear Cap Board", **Then** I see a confirmation step (modal or confirm prompt)
2. **Given** I confirm clearing the board, **When** the action completes, **Then** all items are removed from the UI
3. **Given** I clear the board, **When** I check storage, **Then** all stored items are deleted from extension storage

---

### User Story 8 - Persist Board Using Extension Storage (Priority: P2)

As a user, I want my board saved automatically so that I don't lose captures.

**Why this priority**: Persistence is critical for user trust and data retention. Without it, users lose their captures on browser restart, making the extension unreliable for its primary use case.

**Independent Test**: Can be fully tested by capturing items, closing and reopening the panel, and verifying items load automatically. Storage errors should be handled gracefully.

**Acceptance Scenarios**:

1. **Given** I have captured items, **When** the extension saves data, **Then** board metadata is persisted using chrome.storage.local
2. **Given** images are stored as blobs, **When** the extension saves data, **Then** blobs are stored in IndexedDB (or chosen mechanism)
3. **Given** I have previously captured items, **When** I reopen the panel, **Then** previously captured items load automatically
4. **Given** a storage error occurs, **When** the extension handles it, **Then** a non-blocking error message is shown to the user

---

### User Story 9 - Export Board Metadata as JSON (Priority: P3)

As a user, I want to export JSON so that I can reuse the captured data elsewhere.

**Why this priority**: Export functionality extends the value of captures but is not essential for the core capture experience. Users can still use the extension effectively without exports.

**Independent Test**: Can be fully tested by clicking "Export JSON" and verifying a valid JSON file downloads with all required metadata fields for each item.

**Acceptance Scenarios**:

1. **Given** I have captured items, **When** I click "Export JSON", **Then** a .json file downloads
2. **Given** I open the exported JSON file, **When** I examine it, **Then** it includes for each item:
   - id
   - image URL (or filename reference)
   - source page URL
   - captured timestamp
   - optional metadata fields (title, product link, etc.)
3. **Given** I validate the exported JSON, **When** I check it, **Then** it validates (no circular refs, valid UTF-8)

---

### User Story 10 - Export Individual Captured Images (Priority: P3)

As a user, I want to export each captured image so that I can use them separately.

**Why this priority**: Individual image export provides flexibility but is not essential for core functionality. Users can still view and manage captures without this feature.

**Independent Test**: Can be fully tested by clicking "Export Individual Caps" and verifying multiple image files download with consistent, unique filenames, and CORS-blocked images are handled appropriately.

**Acceptance Scenarios**:

1. **Given** I have captured items, **When** I click "Export Individual Caps", **Then** images download as multiple files
2. **Given** images are exported, **When** I check filenames, **Then** they are consistent and unique (e.g., cap-<timestamp>-<id>.png)
3. **Given** an image cannot be downloaded due to CORS or permissions, **When** export completes, **Then** it is skipped and reported in a summary message

---

### User Story 11 - Export Full Cap Board as ZIP (Priority: P3)

As a user, I want one export that contains everything so that I can share/archive the board.

**Why this priority**: ZIP export provides convenience for sharing but is not essential for core functionality. Users can still use individual exports if needed.

**Independent Test**: Can be fully tested by clicking "Export CapBoard" and verifying a ZIP file downloads containing images folder and board.json manifest, completing successfully for boards up to 50 items.

**Acceptance Scenarios**:

1. **Given** I have captured items, **When** I click "Export CapBoard", **Then** a single .zip file downloads
2. **Given** I extract the ZIP file, **When** I examine contents, **Then** it contains:
   - /images/ folder with images (if available)
   - board.json manifest referencing those images
3. **Given** I have a board with up to 50 items, **When** I export the CapBoard, **Then** export completes without crashing

---

### User Story 12 - Handle CORS-Blocked Images with Fallback (Priority: P2)

As a user, I want CapThat to still capture images even if direct download fails so that it works across many sites.

**Why this priority**: CORS handling is critical for cross-site functionality. Without fallbacks, the extension would fail on many websites, significantly limiting its usefulness.

**Independent Test**: Can be fully tested by attempting to capture CORS-blocked images and verifying fallback mechanisms work, items are still added to the board, and users are informed about fallback usage.

**Acceptance Scenarios**:

1. **Given** I encounter a CORS-blocked image, **When** I attempt to capture it, **Then** the system tries capture in order:
   - Store URL
   - Attempt fetch blob
   - Fallback to visible tab capture (optional v2)
2. **Given** a fallback is used, **When** the image is captured, **Then** the item is still added to the board with a usable thumbnail
3. **Given** a lower-quality fallback was used, **When** I view the captured item, **Then** I am informed via a small badge or tooltip

---

### User Story 13 - Show Status Feedback for Actions (Priority: P3)

As a user, I want confirmation and errors so that I know what happened.

**Why this priority**: Status feedback improves user experience but is not essential for core functionality. The extension can function without explicit feedback, though user experience would be degraded.

**Independent Test**: Can be fully tested by performing various actions (capture, export, clear) and verifying appropriate feedback messages appear without blocking user interaction except for clear confirmation.

**Acceptance Scenarios**:

1. **Given** I click "Cap!" on an image, **When** the capture completes, **Then** a small toast appears: "Captured"
2. **Given** I export data successfully, **When** export completes, **Then** I see "Exported successfully"
3. **Given** an action fails, **When** the error occurs, **Then** I see a clear message with reason category (permission/CORS/storage)
4. **Given** I perform actions, **When** feedback appears, **Then** no blocking alerts are shown except for "Clear board confirmation"

---

### User Story 14 - Send Captured Items to Local Next.js API (Priority: P4 - Optional Phase 2)

As a user, I want captured items saved into my local CapThat app so that I can keep everything outside the extension.

**Why this priority**: This is an optional enhancement for Phase 2. The extension is fully functional without this feature, which provides integration with a local Next.js application.

**Independent Test**: Can be fully tested by capturing items and verifying they are posted to the local Next.js API when available, with appropriate fallback behavior when the app is not running.

**Acceptance Scenarios**:

1. **Given** the local Next.js app is running, **When** I capture an item, **Then** the extension posts captured payload to http://localhost:3000/api/capture
2. **Given** the local app is not running, **When** I capture an item, **Then** the extension falls back to extension-only storage
3. **Given** the local app is not detected, **When** I attempt to use the feature, **Then** I see "Local app not detected" message
4. **Given** items are sent to the Next.js app, **When** I view the board page, **Then** received items are stored and displayed

---

### Edge Cases

- What happens when a page has no images?
- How does the system handle images that fail to load or are broken?
- What happens when storage quota is exceeded?
- How does the system handle very large images (memory/performance)?
- What happens when multiple tabs try to capture simultaneously?
- How does the system handle network failures during export?
- What happens when a captured image URL becomes invalid after capture?
- How does the system handle pages with hundreds or thousands of images?
- What happens when the extension is disabled or uninstalled (data retention)?
- How does the system handle invalid or malformed image data?
- What happens when export is attempted with no captured items?
- How does the system handle duplicate captures across different pages?
- What happens when browser storage is cleared by user or browser?
- How does the system handle CORS policies that change after capture?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow loading the extension in Chrome via "Load unpacked" without errors
- **FR-002**: Extension MUST display an icon and name "CapThat" in the Chrome extensions list
- **FR-003**: Extension MUST reflect code changes after rebuild when reloaded
- **FR-004**: System MUST provide a CapThat panel accessible via extension action button, side panel, or injected overlay
- **FR-005**: Panel MUST display title "CapThat!", empty grid with N slots (e.g., 10), and action buttons (Clear, Export JSON, Export CapBoard, Export Individual Caps)
- **FR-006**: Panel UI MUST be styled with Tailwind and usable at typical desktop widths
- **FR-007**: System MUST detect and mark capturable images on pages, including `<img>` elements with valid sources
- **FR-008**: System MUST NOT break page layout or block page interactions when active
- **FR-009**: System MUST NOT produce console errors on common websites
- **FR-010**: System MUST allow users to capture images by clicking "Cap!" button on image tiles
- **FR-011**: System MUST add captured items to the CapThat panel within 2 seconds of capture action
- **FR-012**: Captured items MUST include image reference (URL or blob), source page URL, and captured timestamp
- **FR-013**: System MUST handle duplicate captures consistently (either prevent duplicates OR indicate already captured)
- **FR-014**: System MUST render captured items as thumbnails in grid slots
- **FR-015**: Grid cells MUST display thumbnail and optional metadata (title/domain) if available
- **FR-016**: System MUST handle more than N items via scrolling OR pagination (consistent behavior)
- **FR-017**: Board state MUST persist across page refreshes and browser restarts
- **FR-018**: System MUST provide remove control (e.g., X button) for each captured item
- **FR-019**: System MUST remove items from UI immediately when remove control is clicked
- **FR-020**: System MUST remove items from storage when removed from UI
- **FR-021**: Removing one item MUST NOT clear the entire board
- **FR-022**: System MUST provide "Clear Cap Board" functionality
- **FR-023**: System MUST show confirmation step (modal or confirm prompt) before clearing board
- **FR-024**: System MUST remove all items from UI when board is cleared
- **FR-025**: System MUST delete all stored items from extension storage when board is cleared
- **FR-026**: System MUST persist board metadata using chrome.storage.local
- **FR-027**: System MUST store image blobs in IndexedDB (or chosen mechanism) when blobs are used
- **FR-028**: System MUST automatically load previously captured items when panel is reopened
- **FR-029**: System MUST handle storage errors gracefully with non-blocking error messages
- **FR-030**: System MUST allow export of board metadata as JSON file
- **FR-031**: Exported JSON MUST include for each item: id, image URL (or filename reference), source page URL, captured timestamp, and optional metadata fields
- **FR-032**: Exported JSON MUST validate (no circular refs, valid UTF-8)
- **FR-033**: System MUST allow export of individual captured images as multiple files
- **FR-034**: Exported image filenames MUST be consistent and unique (e.g., cap-<timestamp>-<id>.png)
- **FR-035**: System MUST skip and report images that cannot be downloaded due to CORS or permissions
- **FR-036**: System MUST allow export of full Cap Board as single ZIP file
- **FR-037**: Exported ZIP MUST contain /images/ folder with images (if available) and board.json manifest
- **FR-038**: System MUST complete export for boards up to 50 items without crashing
- **FR-039**: System MUST attempt capture in order: store URL, attempt fetch blob, fallback to visible tab capture (optional v2)
- **FR-040**: System MUST add items to board with usable thumbnail even when fallback is used
- **FR-041**: System MUST inform users when lower-quality fallback was used (small badge or tooltip)
- **FR-042**: System MUST show toast notification "Captured" when "Cap!" is clicked
- **FR-043**: System MUST show "Exported successfully" message on export success
- **FR-044**: System MUST show clear error message with reason category (permission/CORS/storage) on failure
- **FR-045**: System MUST NOT show blocking alerts except for "Clear board confirmation"
- **FR-046**: System MUST post captured payload to http://localhost:3000/api/capture when local Next.js app is running (Phase 2)
- **FR-047**: System MUST fall back to extension-only storage when local app is not running (Phase 2)
- **FR-048**: System MUST show "Local app not detected" message when local app is not available (Phase 2)

### Key Entities *(include if feature involves data)*

- **Captured Item**: Represents a single image capture, containing image reference (URL or blob), source page URL, captured timestamp, optional metadata (title, domain, product link), unique identifier, and capture quality indicator (if fallback was used)

- **Cap Board**: Represents the collection of captured items, containing array of captured items, board metadata (creation date, last modified), grid configuration (number of slots, layout), and export history

- **Image Reference**: Represents the captured image data, containing either image URL (string) or blob reference, thumbnail data for grid display, original dimensions (if available), and fallback indicator (if lower-quality capture was used)

- **Export Manifest**: Represents exported board data, containing board metadata, array of item references with file mappings, export timestamp, and export format version

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can load the extension in Chrome and see it in the extensions list within 30 seconds of running the build command
- **SC-002**: Users can open the CapThat panel and see the complete UI (title, grid, buttons) within 1 second of clicking the extension action
- **SC-003**: Extension successfully detects and marks capturable images on 95% of common websites without breaking page functionality
- **SC-004**: Users can capture an image and see it appear in the panel within 2 seconds of clicking "Cap!" on 100% of attempts
- **SC-005**: Captured items persist and are visible after browser restart for 100% of captured items
- **SC-006**: Users can remove individual items without affecting other items in 100% of removal actions
- **SC-007**: Board clearing requires confirmation and successfully removes all items in 100% of confirmed clear actions
- **SC-008**: Storage operations complete successfully for 99% of capture and removal operations, with graceful error handling for the remaining 1%
- **SC-009**: JSON export generates valid, parseable JSON files for 100% of export attempts
- **SC-010**: Individual image export successfully downloads at least 90% of capturable images (accounting for CORS restrictions)
- **SC-011**: ZIP export completes successfully for boards containing up to 50 items in 100% of export attempts
- **SC-012**: Extension successfully captures images using fallback mechanisms on 80% of CORS-blocked image attempts
- **SC-013**: Users receive status feedback (toast/notification) for 100% of capture, export, and error actions
- **SC-014**: Extension successfully integrates with local Next.js API when available, with fallback to extension storage in 100% of integration attempts (Phase 2)

## Assumptions

- Extension will be built using standard Chrome Extension Manifest V3 architecture
- Tailwind CSS will be used for styling the panel UI
- Grid will display a default of 10 slots (configurable)
- Duplicate detection will be based on image URL comparison
- Storage will use chrome.storage.local for metadata and IndexedDB for blob storage
- Export filenames will use format: cap-<timestamp>-<id>.png for individual images
- ZIP export will support boards up to 50 items as a reasonable limit
- CORS fallback will attempt URL storage first, then blob fetch, then optional tab capture
- Status feedback will use non-blocking toast notifications
- Local Next.js integration is optional Phase 2 functionality
- Extension will work on typical desktop browser widths (minimum 1024px assumed)
- Common websites include major e-commerce, social media, and content sites
- Extension will handle standard image formats (JPEG, PNG, GIF, WebP)
