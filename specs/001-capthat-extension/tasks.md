---
description: "Task list for CapThat Chrome Extension implementation"
---

# Tasks: CapThat Chrome Extension

**Input**: Design documents from `/specs/001-capthat-extension/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/, research.md  
**Feature Branch**: `001-capthat-extension`  
**Generated**: 2025-01-27  
**Status**: Ready for Implementation

**Tests**: Tests are OPTIONAL - not included unless explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

- **Extension**: `extension/` at repository root
- **Web App**: `app/` at repository root (Next.js)
- **Shared**: `shared/` at repository root

---

## Phase 1: Setup & Build Pipeline

**Purpose**: Project initialization and basic structure for Chrome Extension.

**Independent Test**: Extension loads in Chrome via "Load unpacked" without errors.

- [ ] T001 Create extension directory structure at `extension/`
- [ ] T002 Initialize TypeScript configuration at `extension/tsconfig.json`
- [ ] T003 Configure Vite build system at `extension/vite.config.ts` for MV3 extension
- [ ] T004 Create manifest.json at `extension/manifest.json` with MV3 structure
- [ ] T005 Configure minimal permissions in `extension/manifest.json` (storage, activeTab, scripting, sidePanel)
- [ ] T006 Implement strict CSP in `extension/manifest.json` (no eval, no inline scripts)
- [ ] T007 Create background service worker stub at `extension/background/service-worker.ts`
- [ ] T008 Create content script stub at `extension/content/content-script.ts`
- [ ] T009 Create side panel HTML at `extension/ui/side-panel.html`
- [ ] T010 Setup build scripts in `package.json` for extension build
- [ ] T011 Test extension loads in Chrome via "Load unpacked" without errors
- [ ] T012 Verify Next.js setup exists at `app/` directory
- [ ] T013 Create shared code directory structure at `shared/`
- [ ] T014 Configure TypeScript project references for shared code in `tsconfig.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

**Independent Test**: Storage adapters can save/load data, validators reject invalid inputs.

### Type Definitions

- [ ] T015 [P] Define TypeScript types at `extension/types/index.ts` (CapturedItem with id, imageReference, sourceUrl, timestamp, metadata, qualityIndicator; CapBoard with items array, metadata, gridConfig, exportHistory; ImageReference with urlOrBlob, thumbnail, dimensions, fallbackIndicator; ExportManifest with boardMetadata, itemReferences, exportTimestamp, formatVersion)
- [ ] T016 [P] Define shared types at `shared/types/index.ts` for extension and web compatibility (export CapturedItem, CapBoard, ImageReference, ExportManifest interfaces matching extension types)

### Storage Layer

- [ ] T017 [P] Implement chrome.storage.local adapter at `extension/storage/storage-adapter.ts` (save/load board metadata, handle errors)
- [ ] T018 [P] Implement IndexedDB adapter at `extension/storage/indexeddb-adapter.ts` for blob storage (store/retrieve image blobs)
- [ ] T019 [P] Create storage interface/abstraction at `extension/storage/storage-interface.ts` (define IStorageAdapter interface for both adapters)
- [ ] T020 [P] Implement storage quota monitoring in `extension/storage/storage-adapter.ts` (check chrome.storage.quota, warn at 80% usage)
- [ ] T021 [P] Implement board size limit enforcement (100 items) in `extension/storage/storage-adapter.ts` (prevent saves beyond 100 items)
- [ ] T022 [P] Implement warning threshold (80 items) in `extension/storage/storage-adapter.ts` (emit warning event at 80 items)

### Validation Layer

- [ ] T023 [P] Implement URL validator at `extension/validation/url-validator.ts` (block javascript:, validate http/https/data schemes)
- [ ] T024 [P] Implement image validator at `extension/validation/image-validator.ts` (validate MIME types JPEG/PNG/GIF/WebP, enforce 10MB size limit, 10MP dimension limit)
- [ ] T025 [P] Implement schema validator at `extension/validation/schema-validator.ts` (validate CapturedItem, CapBoard data structures)
- [ ] T026 [P] Create shared URL validator at `shared/validators/url.ts` for reuse by extension and web app

### Message Contracts

- [ ] T027 [P] Define message types at `extension/types/messages.ts` (capture request/response, storage updates, export requests with TypeScript interfaces)
- [ ] T028 [P] Implement message validation in `extension/background/service-worker.ts` message handlers (validate message shape, reject invalid messages)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Load Extension in Chrome (Priority: P1) 🎯 MVP

**Goal**: Extension loads successfully in Chrome and appears in extensions list with icon and name.

**Independent Test**: Run build command, open chrome://extensions, load unpacked extension, verify it appears with icon and name "CapThat", reload reflects code changes after rebuild.

**Acceptance Criteria**:
- Extension loads without errors
- Extension shows icon and name "CapThat" in extensions list
- Reload reflects code changes after rebuild

### Implementation for User Story 1

- [ ] T029 [US1] Add extension icon assets to `extension/icons/` directory (16x16, 48x48, 128x128 PNG files)
- [ ] T030 [US1] Configure icon paths in `extension/manifest.json` (icons field with all sizes)
- [ ] T031 [US1] Set extension name to "CapThat" in `extension/manifest.json` (name field)
- [ ] T032 [US1] Verify build output generates valid extension package
- [ ] T033 [US1] Test extension reload functionality (make code change, rebuild, reload extension, verify changes appear)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Show CapThat Panel UI (Priority: P1) 🎯 MVP

**Goal**: Users can open the CapThat panel and see the complete UI with title, grid, and action buttons.

**Independent Test**: Open extension panel (via action button, side panel, or injected overlay), verify UI displays correctly with title "CapThat!", empty grid with N slots, buttons (Clear, Export JSON, Export CapBoard, Export Individual Caps), and styled with Tailwind at desktop widths.

**Acceptance Criteria**:
- Panel opens via extension action button or side panel
- UI displays title "CapThat!"
- Empty grid shows N slots (e.g., 10) with placeholders
- Action buttons are visible and styled
- UI is styled with Tailwind and usable at desktop widths

### Implementation for User Story 2

- [ ] T034 [P] [US2] Setup React and Tailwind CSS in `extension/ui/side-panel.tsx` (import React, configure Tailwind)
- [ ] T035 [P] [US2] Create Header component at `extension/ui/components/Header.tsx` (display "CapThat!" title)
- [ ] T036 [P] [US2] Create ImageGrid component at `extension/ui/components/ImageGrid.tsx` (empty grid with N slots, placeholder support)
- [ ] T037 [P] [US2] Create ActionButton component at `extension/ui/components/ActionButton.tsx` (reusable button with states, hover effects)
- [ ] T038 [P] [US2] Create CapBoardPanel component at `extension/ui/components/CapBoardPanel.tsx` (main panel layout with Header, ImageGrid, action buttons)
- [ ] T039 [US2] Implement side panel entry point in `extension/ui/side-panel.tsx` (render CapBoardPanel, mount React app)
- [ ] T040 [US2] Configure side panel in `extension/manifest.json` (side_panel field with default_path)
- [ ] T041 [US2] Implement extension action button handler in `extension/background/service-worker.ts` (open side panel on click)
- [ ] T042 [US2] Add placeholder text to empty grid slots in `extension/ui/components/ImageGrid.tsx` ("Click Cap! to capture images")
- [ ] T043 [US2] Apply dark mode styling in `extension/ui/globals.css` (dark background, light text, glassmorphism effects)
- [ ] T044 [US2] Apply Tailwind styling to all components (teal/cyan accents, rounded corners, soft glows, transitions)

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Detect Capturable Images on Page (Priority: P2)

**Goal**: Extension identifies and marks capturable images on web pages without breaking page layout.

**Independent Test**: Visit page with images, verify extension injects capture controls or enables capture mode, verify page layout not broken, verify no console errors on common websites.

**Acceptance Criteria**:
- Extension detects `<img>` elements with valid sources
- Images are marked as capturable
- Page layout is not broken
- No console errors on common websites

### Implementation for User Story 3

- [ ] T045 [P] [US3] Implement image detection logic in `extension/content/content-script.ts` (scan for `<img>` elements, filter valid sources)
- [ ] T046 [US3] Inject capture controls into page in `extension/content/content-script.ts` (add "Cap!" buttons to image tiles, use isolated world)
- [ ] T047 [US3] Ensure content script uses isolated world in `extension/manifest.json` (verify world: "ISOLATED" for content scripts)
- [ ] T048 [US3] Implement CSS injection for capture controls in `extension/content/content-script.ts` (style buttons, ensure no layout breakage)
- [ ] T049 [US3] Add error handling for content script injection in `extension/content/content-script.ts` (catch errors, log to console, prevent page breakage)
- [ ] T050 [US3] Test on common websites (e-commerce, social media, content sites) and verify no console errors

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Capture Image Using "Cap!" Button (Priority: P2)

**Goal**: Users can click "Cap!" on an image and it appears in the CapThat panel within 2 seconds.

**Independent Test**: Click "Cap!" on an image, verify item appears in CapThat panel within 2 seconds with all required metadata, verify duplicate captures are handled appropriately, verify board limit warnings and enforcement.

**Acceptance Criteria**:
- Item appears in panel within 2 seconds
- Item includes image reference, source URL, timestamp
- Duplicate detection works (content hash matching)
- Warning shown at 80 items
- Capture prevented at 100 items

### Implementation for User Story 4

- [ ] T051 [US4] Implement "Cap!" button click handler in `extension/content/content-script.ts` (send CAPTURE_REQUEST message to service worker)
- [ ] T052 [US4] Implement capture request handler in `extension/background/service-worker.ts` (receive CAPTURE_REQUEST, validate input)
- [ ] T053 [US4] Implement image fetch logic in `extension/background/service-worker.ts` (attempt to fetch image blob, handle CORS)
- [ ] T054 [US4] Implement content hash calculation in `extension/background/service-worker.ts` (calculate hash for duplicate detection)
- [ ] T055 [US4] Implement duplicate detection in `extension/background/service-worker.ts` (check content hash against existing items)
- [ ] T056 [US4] Create CapturedItem from capture in `extension/background/service-worker.ts` (generate UUID, create ImageReference, set timestamp)
- [ ] T057 [US4] Save captured item to storage in `extension/background/service-worker.ts` (use storage adapters, enforce 100 item limit)
- [ ] T058 [US4] Send storage update message to UI in `extension/background/service-worker.ts` (broadcast STORAGE_UPDATE with new item)
- [ ] T059 [US4] Implement capture response handler in `extension/content/content-script.ts` (receive CAPTURE_RESPONSE, show feedback)
- [ ] T060 [US4] Update ImageGrid to receive new items in `extension/ui/components/ImageGrid.tsx` (listen for STORAGE_UPDATE messages, add items to grid)
- [ ] T061 [US4] Implement board limit check in `extension/background/service-worker.ts` (check item count before save, emit warning at 80, prevent at 100)
- [ ] T062 [US4] Display board limit warning in `extension/ui/components/CapBoardPanel.tsx` (show warning message at 80 items)

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 - View Captured Items in Grid (Priority: P2)

**Goal**: Users can see captured items rendered as thumbnails in grid slots with metadata, and board state persists.

**Independent Test**: Capture multiple items, verify they render as thumbnails in grid slots with metadata, verify board state persists across refreshes and browser restarts.

**Acceptance Criteria**:
- Items render as thumbnails in grid slots
- Grid cells show thumbnail and optional metadata
- Virtual scrolling works for 100+ items
- Board state persists across refreshes and browser restarts

### Implementation for User Story 5

- [ ] T063 [P] [US5] Create ImageCard component at `extension/ui/components/ImageCard.tsx` (display thumbnail, metadata, handle loading states)
- [ ] T064 [US5] Implement thumbnail generation in `extension/background/service-worker.ts` (create base64 thumbnails for grid display)
- [ ] T065 [US5] Update ImageGrid to render ImageCard components in `extension/ui/components/ImageGrid.tsx` (map items to cards, handle empty slots)
- [ ] T066 [US5] Implement virtual scrolling in `extension/ui/components/ImageGrid.tsx` (fixed slots, content scrolls within slots for 100+ items)
- [ ] T067 [US5] Load board state on panel open in `extension/ui/components/CapBoardPanel.tsx` (request board from service worker on mount)
- [ ] T068 [US5] Implement board load handler in `extension/background/service-worker.ts` (load board from storage, send to UI)
- [ ] T069 [US5] Verify persistence across browser restart (capture items, close browser, reopen, verify items still visible)

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently

---

## Phase 8: User Story 6 - Remove a Captured Item (Priority: P3)

**Goal**: Users can remove individual items from the board without affecting other items.

**Independent Test**: Remove an individual item, verify it disappears immediately, verify it's removed from storage, verify other items remain intact.

**Acceptance Criteria**:
- Remove control (X button) visible on each item
- Item disappears immediately on click
- Item removed from storage
- Other items remain intact

### Implementation for User Story 6

- [ ] T070 [P] [US6] Add remove button to ImageCard component in `extension/ui/components/ImageCard.tsx` (X button with hover state)
- [ ] T071 [US6] Implement remove item handler in `extension/ui/components/ImageCard.tsx` (send BOARD_UPDATE message with remove action)
- [ ] T072 [US6] Implement remove item handler in `extension/background/service-worker.ts` (receive BOARD_UPDATE, remove item from board, save to storage)
- [ ] T073 [US6] Broadcast storage update after removal in `extension/background/service-worker.ts` (send STORAGE_UPDATE with remove action)
- [ ] T074 [US6] Update ImageGrid to handle item removal in `extension/ui/components/ImageGrid.tsx` (remove item from grid on STORAGE_UPDATE)

**Checkpoint**: At this point, User Story 6 should be fully functional and testable independently

---

## Phase 9: User Story 7 - Clear the Entire Cap Board (Priority: P3)

**Goal**: Users can clear the entire board with confirmation, removing all items from UI and storage.

**Independent Test**: Click "Clear Cap Board", confirm action, verify all items removed from UI and storage.

**Acceptance Criteria**:
- Clear button triggers confirmation step
- Confirmation can be confirmed or cancelled
- All items removed from UI on confirm
- All items deleted from storage on confirm

### Implementation for User Story 7

- [ ] T075 [US7] Implement clear button handler in `extension/ui/components/CapBoardPanel.tsx` (show confirmation modal or confirm prompt)
- [ ] T076 [US7] Create confirmation modal component in `extension/ui/components/CapBoardPanel.tsx` (confirm/cancel buttons, glassmorphism styling)
- [ ] T077 [US7] Implement clear board handler in `extension/ui/components/CapBoardPanel.tsx` (send BOARD_UPDATE message with clear action on confirm)
- [ ] T078 [US7] Implement clear board handler in `extension/background/service-worker.ts` (receive BOARD_UPDATE, clear items array, save empty board to storage)
- [ ] T079 [US7] Broadcast storage update after clear in `extension/background/service-worker.ts` (send STORAGE_UPDATE with clear action and empty board)
- [ ] T080 [US7] Update ImageGrid to handle board clear in `extension/ui/components/ImageGrid.tsx` (clear all items on STORAGE_UPDATE clear action)

**Checkpoint**: At this point, User Story 7 should be fully functional and testable independently

---

## Phase 10: User Story 8 - Persist Board Using Extension Storage (Priority: P2)

**Goal**: Board data is automatically saved and loaded, with graceful error handling.

**Independent Test**: Capture items, close and reopen panel, verify items load automatically. Test storage errors handled gracefully.

**Acceptance Criteria**:
- Board metadata persisted using chrome.storage.local
- Image blobs stored in IndexedDB
- Items load automatically on panel open
- Storage errors handled gracefully with non-blocking messages

### Implementation for User Story 8

- [ ] T081 [US8] Implement automatic save on capture in `extension/background/service-worker.ts` (save board to chrome.storage.local after each capture)
- [ ] T082 [US8] Implement automatic save on remove in `extension/background/service-worker.ts` (save board to chrome.storage.local after each removal)
- [ ] T083 [US8] Implement automatic save on clear in `extension/background/service-worker.ts` (save empty board to chrome.storage.local after clear)
- [ ] T084 [US8] Implement board load on panel open in `extension/ui/components/CapBoardPanel.tsx` (request board from service worker on component mount)
- [ ] T085 [US8] Implement board load handler in `extension/background/service-worker.ts` (load board from chrome.storage.local, load blobs from IndexedDB, send to UI)
- [ ] T086 [US8] Implement error handling for storage operations in `extension/background/service-worker.ts` (catch storage errors, send ERROR message with user-friendly text)
- [ ] T087 [US8] Display storage errors in UI in `extension/ui/components/CapBoardPanel.tsx` (show non-blocking toast for storage errors)

**Checkpoint**: At this point, User Story 8 should be fully functional and testable independently

---

## Phase 11: User Story 9 - Export Board Metadata as JSON (Priority: P3)

**Goal**: Users can export board data as a valid JSON file with all required metadata fields.

**Independent Test**: Click "Export JSON", verify .json file downloads with all required fields for each item, verify JSON validates (no circular refs, valid UTF-8).

**Acceptance Criteria**:
- JSON file downloads on click
- JSON includes id, image URL, source URL, timestamp, optional metadata for each item
- JSON validates (no circular refs, valid UTF-8)

### Implementation for User Story 9

- [ ] T088 [US9] Implement export JSON button handler in `extension/ui/components/CapBoardPanel.tsx` (send EXPORT_REQUEST message with format: 'json')
- [ ] T089 [US9] Implement JSON export logic in `extension/export/json-export.ts` (serialize board to JSON, handle circular refs, ensure valid UTF-8)
- [ ] T090 [US9] Implement export request handler in `extension/background/service-worker.ts` (receive EXPORT_REQUEST, call export function, trigger download)
- [ ] T091 [US9] Implement file download in `extension/background/service-worker.ts` (use chrome.downloads API or createObjectURL for JSON download)
- [ ] T092 [US9] Send export response to UI in `extension/background/service-worker.ts` (send EXPORT_RESPONSE with success/failure)
- [ ] T093 [US9] Handle export response in UI in `extension/ui/components/CapBoardPanel.tsx` (show success/error message)

**Checkpoint**: At this point, User Story 9 should be fully functional and testable independently

---

## Phase 12: User Story 10 - Export Individual Captured Images (Priority: P3)

**Goal**: Users can export each captured image as separate files with consistent, unique filenames.

**Independent Test**: Click "Export Individual Caps", verify multiple image files download with consistent filenames (cap-<timestamp>-<id>.png), verify CORS-blocked images are skipped and reported.

**Acceptance Criteria**:
- Multiple image files download
- Filenames are consistent and unique (cap-<timestamp>-<id>.png)
- CORS-blocked images are skipped and reported in summary

### Implementation for User Story 10

- [ ] T094 [US10] Implement export individual images button handler in `extension/ui/components/CapBoardPanel.tsx` (send EXPORT_REQUEST message with format: 'individual')
- [ ] T095 [US10] Implement filename sanitizer in `extension/export/filename-sanitizer.ts` (remove /, \, .., etc., ensure unique filenames)
- [ ] T096 [US10] Implement individual image export logic in `extension/export/json-export.ts` (iterate items, download each image, handle CORS failures)
- [ ] T097 [US10] Implement image download with retry in `extension/export/json-export.ts` (attempt fetch, handle CORS, skip if blocked)
- [ ] T098 [US10] Track skipped images in export in `extension/export/json-export.ts` (count CORS-blocked images)
- [ ] T099 [US10] Send export response with skipped count in `extension/background/service-worker.ts` (include skippedCount in EXPORT_RESPONSE)
- [ ] T100 [US10] Display export summary in UI in `extension/ui/components/CapBoardPanel.tsx` (show skipped count if > 0)

**Checkpoint**: At this point, User Story 10 should be fully functional and testable independently

---

## Phase 13: User Story 11 - Export Full Cap Board as ZIP (Priority: P3)

**Goal**: Users can export the entire board as a ZIP file containing images folder and board.json manifest.

**Independent Test**: Click "Export CapBoard", verify .zip file downloads containing /images/ folder and board.json, verify export completes for boards up to 50 items without crashing.

**Acceptance Criteria**:
- ZIP file downloads on click
- ZIP contains /images/ folder with images (if available)
- ZIP contains board.json manifest
- Export completes for boards up to 50 items

### Implementation for User Story 11

- [ ] T101 [US11] Implement export ZIP button handler in `extension/ui/components/CapBoardPanel.tsx` (send EXPORT_REQUEST message with format: 'zip')
- [ ] T102 [US11] Install JSZip dependency in `package.json` (add jszip package)
- [ ] T103 [US11] Implement ZIP export logic in `extension/export/zip-export.ts` (create ZIP with JSZip, add images to /images/ folder, add board.json)
- [ ] T104 [US11] Generate board.json manifest in `extension/export/zip-export.ts` (create ExportManifest with board metadata, item references, export timestamp)
- [ ] T105 [US11] Add images to ZIP in `extension/export/zip-export.ts` (iterate items, add images to /images/ folder, handle CORS-blocked images)
- [ ] T106 [US11] Implement ZIP download in `extension/background/service-worker.ts` (generate ZIP blob, trigger download)
- [ ] T107 [US11] Handle large boards (50+ items) in `extension/export/zip-export.ts` (stream or chunk processing to prevent memory issues)
- [ ] T108 [US11] Send export response to UI in `extension/background/service-worker.ts` (send EXPORT_RESPONSE with success/failure)

**Checkpoint**: At this point, User Story 11 should be fully functional and testable independently

---

## Phase 14: User Story 12 - Handle CORS-Blocked Images with Fallback (Priority: P2)

**Goal**: Extension captures images even when direct download fails, using fallback strategies.

**Independent Test**: Attempt to capture CORS-blocked images, verify fallback mechanisms work (URL storage, blob fetch attempt, optional tab capture), verify items still added to board with usable thumbnails, verify users informed about fallback usage.

**Acceptance Criteria**:
- System attempts capture in order: store URL, attempt fetch blob, fallback to visible tab capture (optional v2)
- Items added to board even when fallback used
- Users informed via badge or tooltip when fallback used

### Implementation for User Story 12

- [ ] T109 [US12] Implement CORS fallback strategy in `extension/background/service-worker.ts` (try URL storage first, then blob fetch, then tab capture)
- [ ] T110 [US12] Implement URL-only storage fallback in `extension/background/service-worker.ts` (store image URL when blob fetch fails)
- [ ] T111 [US12] Implement blob fetch attempt in `extension/background/service-worker.ts` (attempt fetch with CORS handling, catch errors)
- [ ] T112 [US12] Set qualityIndicator on CapturedItem in `extension/background/service-worker.ts` (set to 'url-only', 'blob', or 'fallback' based on capture method)
- [ ] T113 [US12] Display fallback indicator in ImageCard in `extension/ui/components/ImageCard.tsx` (show badge or tooltip when qualityIndicator is 'url-only' or 'fallback')
- [ ] T114 [US12] Generate thumbnail from URL when blob unavailable in `extension/background/service-worker.ts` (create thumbnail from URL for grid display)

**Checkpoint**: At this point, User Story 12 should be fully functional and testable independently

---

## Phase 15: User Story 13 - Show Status Feedback for Actions (Priority: P3)

**Goal**: Users receive confirmation and error feedback for all actions without blocking interaction.

**Independent Test**: Perform various actions (capture, export, clear), verify appropriate feedback messages appear (toast notifications), verify no blocking alerts except clear confirmation.

**Acceptance Criteria**:
- Toast appears on capture: "Captured"
- Toast appears on export success: "Exported successfully"
- Toast appears on errors with clear message and retry button
- No blocking alerts except clear confirmation

### Implementation for User Story 13

- [ ] T115 [P] [US13] Create toast notification component in `extension/ui/components/Toast.tsx` (non-blocking toast with message, auto-dismiss, retry button support)
- [ ] T116 [US13] Implement toast state management in `extension/ui/components/CapBoardPanel.tsx` (toast queue, show/hide logic)
- [ ] T117 [US13] Show "Captured" toast on successful capture in `extension/ui/components/CapBoardPanel.tsx` (listen for STORAGE_UPDATE add action)
- [ ] T118 [US13] Show "Exported successfully" toast on export success in `extension/ui/components/CapBoardPanel.tsx` (listen for EXPORT_RESPONSE success)
- [ ] T119 [US13] Show error toast with retry button on failure in `extension/ui/components/CapBoardPanel.tsx` (listen for ERROR messages, show retry button if retryable)
- [ ] T120 [US13] Implement retry logic in `extension/ui/components/CapBoardPanel.tsx` (retry failed action on retry button click)
- [ ] T121 [US13] Format error messages by category in `extension/ui/components/CapBoardPanel.tsx` (show user-friendly messages for permission/CORS/storage/validation errors)

**Checkpoint**: At this point, User Story 13 should be fully functional and testable independently

---

## Phase 16: User Story 14 - Send Captured Items to Local Next.js API (Priority: P4 - Optional Phase 2)

**Goal**: Extension can send captured items to local Next.js app when available, with graceful fallback.

**Independent Test**: Capture items with local app running, verify items posted to http://localhost:3000/api/capture. Test with app not running, verify fallback to extension storage. Test app detection, verify "Local app not detected" message.

**Acceptance Criteria**:
- Items posted to http://localhost:3000/api/capture when app running
- Fallback to extension storage when app not running
- "Local app not detected" message shown when app unavailable
- Items stored and displayed in Next.js board page

### Implementation for User Story 14

- [ ] T122 [US14] Create Next.js API route at `app/api/capture/route.ts` (POST handler, validate origin, accept capture payload)
- [ ] T123 [US14] Implement CORS handling in Next.js API in `app/api/capture/route.ts` (allow chrome-extension:// origins)
- [ ] T124 [US14] Implement payload validation in Next.js API in `app/api/capture/route.ts` (validate itemId, sourceUrl, timestamp, imageReference)
- [ ] T125 [US14] Store captured items in Next.js in `app/api/capture/route.ts` (save to database or file system)
- [ ] T126 [US14] Create board page at `app/board/page.tsx` (display captured items from Next.js storage)
- [ ] T127 [US14] Implement local app detection in `extension/background/service-worker.ts` (ping http://localhost:3000/api/capture to check availability)
- [ ] T128 [US14] Implement API client in `extension/background/service-worker.ts` (send POST request to http://localhost:3000/api/capture with captured item)
- [ ] T129 [US14] Implement origin validation in `extension/background/service-worker.ts` (validate requests only go to http://localhost:3000)
- [ ] T130 [US14] Implement fallback to extension storage in `extension/background/service-worker.ts` (if API unavailable, use extension storage)
- [ ] T131 [US14] Show "Local app not detected" message in UI in `extension/ui/components/CapBoardPanel.tsx` (non-blocking message when app unavailable)
- [ ] T132 [US14] Handle API errors gracefully in `extension/background/service-worker.ts` (catch network errors, validation errors, fallback to extension storage)

**Checkpoint**: At this point, User Story 14 should be fully functional and testable independently

---

## Phase 17: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T133 [P] Update documentation in `README.md` (extension setup, usage, development guide)
- [ ] T134 [P] Code cleanup and refactoring (review all files, remove dead code, improve naming)
- [ ] T135 [P] Performance optimization (optimize image loading, virtual scrolling, storage operations)
- [ ] T136 [P] Security review (verify CSP compliance, input validation, storage quota handling)
- [ ] T137 [P] Accessibility improvements (keyboard navigation, ARIA labels, contrast checks)
- [ ] T138 [P] Error handling improvements (comprehensive error messages, retry logic, logging)
- [ ] T139 [P] Run quickstart.md validation (test all user scenarios from quickstart.md)
- [ ] T140 [P] Final testing across all user stories (end-to-end testing, browser compatibility)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-16)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 17)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Depends on User Story 2 (needs panel UI) and User Story 3 (needs image detection) - Can start after US2 and US3
- **User Story 5 (P2)**: Depends on User Story 4 (needs captured items) - Can start after US4
- **User Story 6 (P3)**: Depends on User Story 5 (needs grid display) - Can start after US5
- **User Story 7 (P3)**: Depends on User Story 5 (needs grid display) - Can start after US5
- **User Story 8 (P2)**: Depends on User Story 4 (needs capture functionality) - Can start after US4
- **User Story 9 (P3)**: Depends on User Story 5 (needs board data) - Can start after US5
- **User Story 10 (P3)**: Depends on User Story 5 (needs board data) - Can start after US5
- **User Story 11 (P3)**: Depends on User Story 5 (needs board data) - Can start after US5
- **User Story 12 (P2)**: Depends on User Story 4 (needs capture functionality) - Can start after US4
- **User Story 13 (P3)**: Depends on User Stories 4, 9, 10, 11 (needs actions to provide feedback for) - Can start after US4
- **User Story 14 (P4)**: Depends on User Story 4 (needs capture functionality) - Optional Phase 2, can start after US4

### Within Each User Story

- Models/types before services
- Services before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001-T014) can run in parallel where they touch different files
- All Foundational tasks marked [P] (T015-T028) can run in parallel
- Once Foundational phase completes, User Stories 1, 2, and 3 can start in parallel
- User Stories 4, 8, and 12 can start in parallel after US2 and US3 complete
- User Stories 6, 7, 9, 10, 11 can start in parallel after US5 completes
- All tasks marked [P] within a user story can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all component creation tasks in parallel:
Task: "Create Header component at extension/ui/components/Header.tsx"
Task: "Create ImageGrid component at extension/ui/components/ImageGrid.tsx"
Task: "Create ActionButton component at extension/ui/components/ActionButton.tsx"
Task: "Create CapBoardPanel component at extension/ui/components/CapBoardPanel.tsx"
```

---

## Parallel Example: User Story 4

```bash
# Launch foundational tasks in parallel (after Phase 2):
Task: "Implement 'Cap!' button click handler in extension/content/content-script.ts"
Task: "Implement capture request handler in extension/background/service-worker.ts"
Task: "Implement image fetch logic in extension/background/service-worker.ts"
Task: "Implement content hash calculation in extension/background/service-worker.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Load Extension)
4. Complete Phase 4: User Story 2 (Show Panel UI)
5. **STOP and VALIDATE**: Test User Stories 1 and 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Extension loads!)
3. Add User Story 2 → Test independently → Deploy/Demo (UI visible!)
4. Add User Story 3 → Test independently → Deploy/Demo (Image detection!)
5. Add User Story 4 → Test independently → Deploy/Demo (Capture works!)
6. Add User Story 5 → Test independently → Deploy/Demo (Grid display!)
7. Add User Story 8 → Test independently → Deploy/Demo (Persistence!)
8. Add User Story 12 → Test independently → Deploy/Demo (CORS handling!)
9. Add remaining stories → Test independently → Deploy/Demo
10. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Load Extension)
   - Developer B: User Story 2 (Panel UI)
   - Developer C: User Story 3 (Image Detection)
3. After US1, US2, US3 complete:
   - Developer A: User Story 4 (Capture)
   - Developer B: User Story 8 (Persistence)
   - Developer C: User Story 12 (CORS Fallback)
4. After US4, US5 complete:
   - Developer A: User Story 6 (Remove Item)
   - Developer B: User Story 7 (Clear Board)
   - Developer C: User Story 9 (Export JSON)
5. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 140

**Tasks by Phase**:
- Phase 1 (Setup): 14 tasks
- Phase 2 (Foundational): 14 tasks
- Phase 3 (US1): 5 tasks
- Phase 4 (US2): 11 tasks
- Phase 5 (US3): 6 tasks
- Phase 6 (US4): 12 tasks
- Phase 7 (US5): 7 tasks
- Phase 8 (US6): 5 tasks
- Phase 9 (US7): 6 tasks
- Phase 10 (US8): 7 tasks
- Phase 11 (US9): 6 tasks
- Phase 12 (US10): 7 tasks
- Phase 13 (US11): 8 tasks
- Phase 14 (US12): 6 tasks
- Phase 15 (US13): 7 tasks
- Phase 16 (US14): 11 tasks
- Phase 17 (Polish): 8 tasks

**Tasks by User Story**:
- User Story 1: 5 tasks
- User Story 2: 11 tasks
- User Story 3: 6 tasks
- User Story 4: 12 tasks
- User Story 5: 7 tasks
- User Story 6: 5 tasks
- User Story 7: 6 tasks
- User Story 8: 7 tasks
- User Story 9: 6 tasks
- User Story 10: 7 tasks
- User Story 11: 8 tasks
- User Story 12: 6 tasks
- User Story 13: 7 tasks
- User Story 14: 11 tasks

**Parallel Opportunities Identified**:
- Phase 2: 14 tasks marked [P] can run in parallel
- User Story 2: 5 component creation tasks can run in parallel
- User Stories 1, 2, 3: Can start in parallel after Phase 2
- User Stories 4, 8, 12: Can start in parallel after US2 and US3
- User Stories 6, 7, 9, 10, 11: Can start in parallel after US5

**Independent Test Criteria**:
- US1: Extension loads in Chrome, appears in extensions list
- US2: Panel opens and displays complete UI
- US3: Images detected without breaking page layout
- US4: Capture works within 2 seconds with duplicate handling
- US5: Items render in grid and persist across restarts
- US6: Individual items can be removed
- US7: Entire board can be cleared with confirmation
- US8: Board persists and loads automatically
- US9: JSON export generates valid file
- US10: Individual images export with unique filenames
- US11: ZIP export contains images and manifest
- US12: CORS-blocked images handled with fallback
- US13: Status feedback appears for all actions
- US14: Items sent to Next.js API when available

**Suggested MVP Scope**: User Stories 1 and 2 (Load Extension + Show Panel UI) provide the foundation. For a functional MVP, add User Stories 3, 4, 5, 8, and 12 (Image Detection + Capture + Grid Display + Persistence + CORS Handling).

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All tasks follow strict checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
