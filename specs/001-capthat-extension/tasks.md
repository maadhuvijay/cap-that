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

- [X] T001 Create extension directory structure at `extension/`
- [X] T002 Initialize TypeScript configuration at `extension/tsconfig.json`
- [X] T003 Configure Vite build system at `extension/vite.config.ts` for MV3 extension
- [X] T004 Create manifest.json at `extension/manifest.json` with MV3 structure
- [X] T005 Configure minimal permissions in `extension/manifest.json` (storage, activeTab, scripting, sidePanel)
- [X] T006 Implement strict CSP in `extension/manifest.json` (no eval, no inline scripts)
- [X] T007 Create background service worker stub at `extension/background/service-worker.ts`
- [X] T008 Create content script stub at `extension/content/content-script.ts`
- [X] T009 Create side panel HTML at `extension/ui/side-panel.html`
- [X] T010 Setup build scripts in `package.json` for extension build
- [X] T011 Test extension loads in Chrome via "Load unpacked" without errors
- [X] T012 Verify Next.js setup exists at `app/` directory
- [X] T013 Create shared code directory structure at `shared/`
- [X] T014 Configure TypeScript project references for shared code in `tsconfig.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

**Independent Test**: Storage adapters can save/load data, validators reject invalid inputs.

### Type Definitions

- [X] T015 [P] Define TypeScript types at `extension/types/index.ts` (CapturedItem interface with id: string, imageReference: ImageReference, sourceUrl: string, timestamp: number, metadata?: Record<string, unknown>, qualityIndicator?: 'url-only' | 'blob' | 'fallback'; CapBoard interface with items: CapturedItem[], metadata: BoardMetadata, gridConfig: GridConfig, exportHistory?: ExportManifest[]; ImageReference interface with urlOrBlob: string | BlobReference, thumbnail?: string, dimensions?: { width: number; height: number }, fallbackIndicator?: boolean; BoardMetadata interface with creationDate: number, lastModified: number, version: string; GridConfig interface with slots: number, columns: number, virtualScrolling: boolean; ExportManifest interface with boardMetadata: BoardMetadata, itemReferences: ExportItemReference[], exportTimestamp: number, formatVersion: string; ExportItemReference interface with itemId: string, filename?: string, imageUrl?: string, metadata: Record<string, unknown>; BlobReference type for IndexedDB blob keys)
- [X] T016 [P] Define shared types at `shared/types/index.ts` for extension and web compatibility (export CapturedItem, CapBoard, ImageReference, BoardMetadata, GridConfig, ExportManifest, ExportItemReference interfaces matching extension types from T015, ensure types are compatible for Next.js API integration)

### Storage Layer

- [X] T017 [P] Implement chrome.storage.local adapter at `extension/storage/storage-adapter.ts` (save CapBoard metadata to chrome.storage.local with key 'capBoard', load board from storage, handle chrome.storage errors with try-catch, return CapBoard object or null if not found)
- [X] T018 [P] Implement IndexedDB adapter at `extension/storage/indexeddb-adapter.ts` for blob storage (open IndexedDB database 'capthat', create 'images' object store if needed, store Blob objects with unique keys, retrieve blobs by key, handle IndexedDB errors, return Blob or null)
- [X] T019 [P] Create storage interface/abstraction at `extension/storage/storage-interface.ts` (define IStorageAdapter interface with saveBoard(board: CapBoard): Promise<void>, loadBoard(): Promise<CapBoard | null>, saveBlob(key: string, blob: Blob): Promise<void>, getBlob(key: string): Promise<Blob | null>, implement interface for both chrome.storage.local and IndexedDB adapters)
- [X] T020 [P] Implement storage quota monitoring in `extension/storage/storage-adapter.ts` (check chrome.storage.quota.bytesUsed and chrome.storage.quota.bytesInUse, calculate usage percentage, emit warning event or throw error when usage exceeds 80%, prevent saves when quota exceeded)
- [X] T021 [P] Implement board size limit enforcement (100 items) in `extension/storage/storage-adapter.ts` (validate items.length <= 100 before save operation, throw error with user-friendly message if limit exceeded, prevent save when board has 100 items)
- [X] T022 [P] Implement warning threshold (80 items) in `extension/storage/storage-adapter.ts` (check items.length >= 80 before save, emit warning event or callback when threshold reached, allow save but notify UI to show warning message)

### Validation Layer

- [X] T023 [P] Implement URL validator at `extension/validation/url-validator.ts` (validate URL string, block javascript: scheme and other dangerous schemes, allow http://, https://, and data: schemes only, return boolean or throw ValidationError with user-friendly message, validate sourceUrl for CapturedItem)
- [X] T024 [P] Implement image validator at `extension/validation/image-validator.ts` (validate MIME types: image/jpeg, image/png, image/gif, image/webp only, enforce 10MB size limit per image, enforce 10MP dimension limit (width * height <= 10,000,000), validate Blob or URL input, return boolean or throw ValidationError with specific reason)
- [X] T025 [P] Implement schema validator at `extension/validation/schema-validator.ts` (validate CapturedItem structure: required fields id, imageReference, sourceUrl, timestamp, validate id is non-empty string, validate sourceUrl via URL validator, validate timestamp is positive number, validate metadata is serializable JSON object, validate CapBoard structure: items array length <= 100, items contain valid CapturedItem objects, metadata and gridConfig are valid, return boolean or throw ValidationError)
- [X] T026 [P] Create shared URL validator at `shared/validators/url.ts` for reuse by extension and web app (export URL validation function matching T023 implementation, ensure compatibility with both extension and Next.js API, validate http/https/data schemes, block javascript: and dangerous schemes)

### Message Contracts

- [X] T027 [P] Define message types at `extension/types/messages.ts` (define CaptureRequestMessage with type: 'CAPTURE_REQUEST', payload: { imageUrl: string, sourceUrl: string, metadata?: Record<string, unknown> }; CaptureResponseMessage with type: 'CAPTURE_RESPONSE', payload: { success: boolean, itemId?: string, error?: string, errorCategory?: 'permission' | 'cors' | 'storage' | 'validation' }; StorageUpdateMessage with type: 'STORAGE_UPDATE', payload: { action: 'add' | 'remove' | 'clear' | 'update', item?: CapturedItem, board?: CapBoard }; ExportRequestMessage with type: 'EXPORT_REQUEST', payload: { format: 'json' | 'zip' | 'individual', options?: ExportOptions }; ExportResponseMessage with type: 'EXPORT_RESPONSE', payload: { success: boolean, filename?: string, error?: string, skippedCount?: number }; BoardUpdateMessage with type: 'BOARD_UPDATE', payload: { action: 'remove' | 'clear', itemId?: string }; ErrorMessage with type: 'ERROR', payload: { message: string, category: ErrorCategory, retryable: boolean }; define Message union type, export type guards for each message type, export isValidMessage function)
- [X] T028 [P] Implement message validation in `extension/background/service-worker.ts` message handlers (validate message shape: check type field exists and is string, validate message type matches known types from T027, validate payload structure matches message type requirements, validate payload content: URLs via URL validator, itemId format, action values, reject invalid messages with ErrorMessage response, add validation before processing any incoming messages)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Load Extension in Chrome (Priority: P1) 🎯 MVP

**Goal**: Extension loads successfully in Chrome and appears in extensions list with icon and name.

**Independent Test**: Run build command, open chrome://extensions, load unpacked extension, verify it appears with icon and name "CapThat", reload reflects code changes after rebuild.

**Acceptance Criteria**:
- Extension loads without errors
- Extension shows icon and name "CapThat" in extensions list
- Reloading extension after code changes reflects updates

- [X] T029 [US1] Create extension icon assets and configure in `extension/manifest.json` (add icons field with 16x16, 48x48, 128x128 icon paths)
- [X] T030 [US1] Configure extension name "CapThat" in `extension/manifest.json` (set name field to "CapThat")
- [X] T031 [US1] Verify extension loads without console errors in Chrome DevTools
- [X] T032 [US1] Test extension reload functionality (make code change, rebuild, reload extension, verify changes appear)
- [X] T033 [US1] Verify extension appears in chrome://extensions list with correct name and icon

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Show CapThat Panel UI (Priority: P1) 🎯 MVP

**Goal**: Panel opens and displays complete UI (title, grid, buttons) within 1 second.

**Independent Test**: Open extension panel (via action button, side panel, or injected overlay), verify UI displays correctly with title, grid, and action buttons, confirm it's styled and usable at desktop widths.

**Acceptance Criteria**:
- Panel opens within 1 second
- Title "CapThat!" is visible
- Empty grid with N slots (e.g., 10) is visible
- Placeholder text appears: "Click Cap! to capture images"
- Action buttons are visible: Clear, Export JSON, Export CapBoard, Export Individual Caps
- UI is styled with Tailwind CSS
- UI is usable at desktop width (1024px+)

### UI Components

- [X] T034 [P] [US2] Create Header component at `extension/ui/components/Header.tsx` (browser-like header with title "CapThat!", styled with Tailwind dark mode, glassmorphism effects, teal/cyan accents)
- [X] T035 [P] [US2] Create ImageGrid component at `extension/ui/components/ImageGrid.tsx` (grid layout with N slots, placeholder support, virtual scrolling configuration, Tailwind styling)
- [X] T036 [P] [US2] Create ImageCard component at `extension/ui/components/ImageCard.tsx` (individual image card with thumbnail display, metadata display, hover states, Tailwind styling)
- [X] T037 [P] [US2] Create CapBoardPanel component at `extension/ui/components/CapBoardPanel.tsx` (main panel component with Header, ImageGrid for captured items, action buttons, empty state with placeholder text "Click Cap! to capture images", Tailwind styling)
- [X] T038 [P] [US2] Create ActionButton component at `extension/ui/components/ActionButton.tsx` (reusable button component with states: default, hover, active, disabled, keyboard accessible, Tailwind styling with teal/cyan accents, smooth transitions)

### Panel Integration

- [X] T039 [US2] Integrate React components in `extension/ui/side-panel.tsx` (import and render CapBoardPanel, setup React root, configure Tailwind CSS, handle side panel lifecycle)
- [X] T040 [US2] Configure side panel in `extension/manifest.json` (add side_panel field with default_path: "ui/side-panel.html", configure side panel action)
- [X] T041 [US2] Setup Tailwind CSS configuration at `extension/ui/tailwind.config.js` (configure dark mode, glassmorphism utilities, teal/cyan color palette, responsive breakpoints)
- [X] T042 [US2] Import global styles at `extension/ui/globals.css` (Tailwind directives, dark mode base styles, custom utilities for glassmorphism)
- [X] T043 [US2] Implement empty grid placeholder in `extension/ui/components/ImageGrid.tsx` (display placeholder text "Click Cap! to capture images" when items array is empty, style with Tailwind)
- [X] T044 [US2] Add action buttons to CapBoardPanel: Clear Cap Board, Export JSON, Export CapBoard, Export Individual Caps (wire up button components, add to panel layout, style with Tailwind)

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Detect Capturable Images on Page (Priority: P2)

**Goal**: Extension detects and marks capturable images on pages without breaking page functionality.

**Independent Test**: Visit a page with images and verify that the extension injects capture controls or enables capture mode without breaking page layout or producing console errors.

**Acceptance Criteria**:
- Extension injects capture controls or enables capture mode
- Images with valid `<img>` sources are marked as capturable
- Page layout is not broken
- Page interactions work normally
- No console errors on common websites

- [X] T045 [US3] Implement image detection in `extension/content/content-script.ts` (scan page for `<img>` elements with valid src attributes, filter out broken or invalid images, mark images as capturable)
- [X] T046 [US3] Inject capture controls into page in `extension/content/content-script.ts` (add "Cap!" button overlay to capturable images, use isolated world to avoid page conflicts, style with Tailwind-like classes or inline styles)
- [X] T047 [US3] Ensure content script uses isolated world in `extension/manifest.json` (verify content_scripts configuration uses isolated world, no unsafeWindow access)
- [X] T048 [US3] Test image detection on common websites (e-commerce sites, social media, image galleries, verify no page layout breaks, verify no console errors)
- [X] T049 [US3] Handle edge cases: pages with no images, broken images, lazy-loaded images (graceful handling, no errors, extension still functional)

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Capture Image Using "Cap!" Button (Priority: P2)

**Goal**: Users can capture images by clicking "Cap!" and items appear in panel within 2 seconds.

**Independent Test**: Click "Cap!" on an image and verify it appears in the CapThat panel within 2 seconds with all required metadata, and duplicate captures are handled appropriately.

**Acceptance Criteria**:
- Item appears in panel within 2 seconds
- Item includes image reference (URL or blob), source page URL, captured timestamp
- Duplicate captures handled consistently (content hash matching)
- Warning shown at 80 items
- Capture blocked at 100 items with "Board is full" message

### Capture Flow

- [ ] T050 [US4] Implement capture button click handler in `extension/content/content-script.ts` (listen for "Cap!" button clicks, extract image URL and source page URL, collect optional metadata, send CaptureRequestMessage to service worker)
- [ ] T051 [US4] Implement capture request handler in `extension/background/service-worker.ts` (receive CaptureRequestMessage, validate image URL and source URL, attempt image fetch with CORS fallback, create CapturedItem with unique ID, validate item via schema validator)
- [ ] T052 [US4] Implement image fetch with CORS fallback in `extension/background/service-worker.ts` (try fetch blob first, fallback to URL storage if CORS blocked, set qualityIndicator based on method used, handle fetch errors gracefully)
- [ ] T053 [US4] Create CapturedItem with metadata in `extension/background/service-worker.ts` (generate UUID v4 for id, create ImageReference with urlOrBlob, set sourceUrl, set timestamp to current time, extract optional metadata from page, set qualityIndicator)
- [ ] T054 [US4] Implement duplicate detection in `extension/background/service-worker.ts` (calculate content hash for image, check against existing items, prevent duplicate or mark as already captured, use image content hash not URL)
- [ ] T055 [US4] Check board size limits before capture in `extension/background/service-worker.ts` (check items.length >= 80 for warning, check items.length >= 100 for hard limit, return appropriate error messages, prevent capture at 100 items)
- [ ] T056 [US4] Save captured item to storage in `extension/background/service-worker.ts` (add item to CapBoard items array, save board via storage adapter, handle storage errors, send StorageUpdateMessage to UI)
- [ ] T057 [US4] Send capture response to content script in `extension/background/service-worker.ts` (send CaptureResponseMessage with success/failure, include itemId on success, include error and errorCategory on failure)
- [ ] T058 [US4] Display toast notification "Captured" in `extension/ui/components/CapBoardPanel.tsx` (show toast when StorageUpdateMessage received with action 'add', non-blocking toast, auto-dismiss after 2 seconds)
- [ ] T059 [US4] Handle capture errors in content script in `extension/content/content-script.ts` (receive CaptureResponseMessage, show error toast with retry button if retryable, handle permission/CORS/storage/validation errors appropriately)

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 - View Captured Items in Grid (Priority: P2)

**Goal**: Captured items render as thumbnails in grid slots and board state persists across sessions.

**Independent Test**: Capture multiple items and verify they render as thumbnails in grid slots with metadata, and the board state persists across refreshes and browser restarts.

**Acceptance Criteria**:
- Empty slots show placeholders when no items
- Captured items render as thumbnails in grid slots
- Grid cells show thumbnail and optional metadata (title/domain)
- Virtual scrolling works for 100+ items (fixed slots, content scrolls)
- Board state persists after panel close/reopen
- Board state persists after browser restart

### Grid Display

- [ ] T060 [US5] Load board from storage on panel open in `extension/ui/side-panel.tsx` (call storage adapter loadBoard on component mount, handle null/empty board, set initial state)
- [ ] T061 [US5] Render captured items in ImageGrid in `extension/ui/components/ImageGrid.tsx` (map items array to grid slots, render ImageCard for each item, handle empty state with placeholders, display thumbnails from ImageReference)
- [ ] T062 [US5] Display thumbnails in ImageCard in `extension/ui/components/ImageCard.tsx` (render thumbnail from ImageReference.thumbnail or urlOrBlob, handle blob references, handle URL references, show fallback if image fails to load)
- [ ] T063 [US5] Display optional metadata in ImageCard in `extension/ui/components/ImageCard.tsx` (show title if available in metadata, show domain if available, style metadata with Tailwind)
- [ ] T064 [US5] Implement virtual scrolling in ImageGrid in `extension/ui/components/ImageGrid.tsx` (use virtual scrolling library or custom implementation, show fixed number of slots, scroll content within slots, handle 100+ items smoothly)
- [ ] T065 [US5] Listen for storage updates in `extension/ui/side-panel.tsx` (listen for StorageUpdateMessage from service worker, update UI when items added/removed/cleared, handle 'add' action to add item to grid, handle 'clear' action to clear grid)
- [ ] T066 [US5] Persist board state automatically in `extension/background/service-worker.ts` (save board to storage after any item add/remove/clear, use storage adapter, handle storage errors gracefully)
- [ ] T067 [US5] Test board persistence across sessions (capture items, close panel, reopen panel, verify items load, restart browser, reopen panel, verify items still present)

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently

---

## Phase 8: User Story 6 - Remove a Captured Item (Priority: P3)

**Goal**: Users can remove individual items from the board without affecting other items.

**Independent Test**: Remove an individual item and verify it disappears immediately, is removed from storage, and other items remain intact.

**Acceptance Criteria**:
- Item disappears immediately from UI
- Item is removed from storage
- Other items remain on board
- No unintended side effects

- [ ] T068 [US6] Add remove control (X button) to ImageCard in `extension/ui/components/ImageCard.tsx` (add X button overlay on hover, style with Tailwind, keyboard accessible)
- [ ] T069 [US6] Implement remove button click handler in `extension/ui/components/ImageCard.tsx` (send BoardUpdateMessage with action 'remove' and itemId to service worker, handle click event)
- [ ] T070 [US6] Handle remove request in service worker in `extension/background/service-worker.ts` (receive BoardUpdateMessage with action 'remove', validate itemId, remove item from CapBoard items array, save updated board to storage, send StorageUpdateMessage with action 'remove' to UI)
- [ ] T071 [US6] Update UI on item removal in `extension/ui/components/ImageGrid.tsx` (listen for StorageUpdateMessage with action 'remove', remove item from grid display immediately, update grid state)
- [ ] T072 [US6] Verify item removed from storage (check chrome.storage.local after removal, verify item no longer in items array, verify other items intact)

**Checkpoint**: At this point, User Story 6 should be fully functional and testable independently

---

## Phase 9: User Story 7 - Clear the Entire Cap Board (Priority: P3)

**Goal**: Users can clear the entire board with confirmation, removing all items from UI and storage.

**Independent Test**: Click "Clear Cap Board", confirm the action, and verify all items are removed from UI and storage.

**Acceptance Criteria**:
- Confirmation step appears (modal or confirm prompt)
- All items removed from UI after confirmation
- All items deleted from storage
- Board is empty

- [ ] T073 [US7] Implement clear button click handler in `extension/ui/components/CapBoardPanel.tsx` (show confirmation modal or use confirm prompt, only blocking alert allowed, handle user confirmation/cancellation)
- [ ] T074 [US7] Create confirmation modal component in `extension/ui/components/CapBoardPanel.tsx` (modal with "Clear Cap Board?" message, Confirm and Cancel buttons, styled with Tailwind, glassmorphism effects)
- [ ] T075 [US7] Handle clear request in service worker in `extension/background/service-worker.ts` (receive BoardUpdateMessage with action 'clear', clear items array from CapBoard, save empty board to storage, send StorageUpdateMessage with action 'clear' and empty board to UI)
- [ ] T076 [US7] Update UI on board clear in `extension/ui/components/ImageGrid.tsx` (listen for StorageUpdateMessage with action 'clear', clear all items from grid display, show empty state with placeholders)
- [ ] T077 [US7] Verify all items removed from storage (check chrome.storage.local after clear, verify items array is empty, verify board metadata still present)

**Checkpoint**: At this point, User Story 7 should be fully functional and testable independently

---

## Phase 10: User Story 8 - Persist Board Using Extension Storage (Priority: P2)

**Goal**: Board automatically saves and loads, with graceful error handling for storage failures.

**Independent Test**: Capture items, close and reopen the panel, and verify items load automatically. Storage errors should be handled gracefully.

**Acceptance Criteria**:
- Board metadata persisted in chrome.storage.local
- Image blobs stored in IndexedDB (if applicable)
- Items load automatically when panel reopens
- Storage errors handled gracefully with non-blocking message

- [ ] T078 [US8] Auto-save board on changes in `extension/background/service-worker.ts` (save board to storage after every add/remove/clear operation, use storage adapter, handle save errors)
- [ ] T079 [US8] Auto-load board on panel open in `extension/ui/side-panel.tsx` (load board from storage on component mount, handle null/empty board, update UI state)
- [ ] T080 [US8] Handle storage load errors gracefully in `extension/ui/side-panel.tsx` (catch storage errors, show non-blocking error message, allow panel to function with empty board)
- [ ] T081 [US8] Handle storage save errors gracefully in `extension/background/service-worker.ts` (catch storage errors, send ErrorMessage to UI, allow user to retry, prevent data loss)
- [ ] T082 [US8] Test persistence across browser restarts (capture items, close browser, reopen browser, open panel, verify items load)

**Checkpoint**: At this point, User Story 8 should be fully functional and testable independently

---

## Phase 11: User Story 9 - Export Board Metadata as JSON (Priority: P3)

**Goal**: Users can export board metadata as a valid JSON file with all required fields.

**Independent Test**: Click "Export JSON" and verify a valid JSON file downloads with all required metadata fields for each item.

**Acceptance Criteria**:
- `.json` file downloads
- JSON includes for each item: id, imageUrl (or filename reference), sourceUrl, timestamp, optional metadata fields
- JSON validates (no circular refs, valid UTF-8)
- Toast notification: "Exported successfully"

- [ ] T083 [US9] Implement JSON export logic in `extension/export/json-export.ts` (create ExportManifest with board metadata, map CapturedItem to ExportItemReference, serialize to JSON, validate JSON structure, handle circular references)
- [ ] T084 [US9] Handle export request in service worker in `extension/background/service-worker.ts` (receive ExportRequestMessage with format 'json', call JSON export function, create downloadable file, send ExportResponseMessage with filename)
- [ ] T085 [US9] Trigger file download in UI in `extension/ui/components/CapBoardPanel.tsx` (receive ExportResponseMessage, create download link with blob URL, trigger download, show "Exported successfully" toast)
- [ ] T086 [US9] Sanitize JSON output in `extension/export/json-export.ts` (ensure valid UTF-8 encoding, remove circular references, validate JSON structure before serialization)
- [ ] T087 [US9] Test JSON export validation (export board, open JSON file, verify structure, verify all required fields present, verify no circular refs)

**Checkpoint**: At this point, User Story 9 should be fully functional and testable independently

---

## Phase 12: User Story 10 - Export Individual Captured Images (Priority: P3)

**Goal**: Users can export each captured image as separate files with consistent, unique filenames.

**Independent Test**: Click "Export Individual Caps" and verify multiple image files download with consistent, unique filenames, and CORS-blocked images are handled appropriately.

**Acceptance Criteria**:
- Multiple image files download
- Filenames are consistent and unique (e.g., cap-<timestamp>-<id>.png)
- CORS-blocked images are skipped and reported in summary
- Export completes successfully

- [ ] T088 [US10] Implement filename sanitization in `extension/export/filename-sanitizer.ts` (remove path traversal characters: /, \, .., etc., limit filename length, ensure unique filenames with timestamp and ID, format: cap-<timestamp>-<id>.png)
- [ ] T089 [US10] Implement individual image export in `extension/export/individual-export.ts` (iterate through board items, attempt to download each image, handle CORS-blocked images, skip failed downloads, track skipped count)
- [ ] T090 [US10] Handle CORS-blocked images in export in `extension/export/individual-export.ts` (detect CORS errors, skip image, increment skippedCount, continue with next image)
- [ ] T091 [US10] Trigger multiple file downloads in UI in `extension/ui/components/CapBoardPanel.tsx` (receive ExportResponseMessage, create download links for each image, trigger downloads sequentially or in batch, show skipped count in toast if applicable)
- [ ] T092 [US10] Report skipped images in export response in `extension/background/service-worker.ts` (include skippedCount in ExportResponseMessage, show summary message to user)

**Checkpoint**: At this point, User Story 10 should be fully functional and testable independently

---

## Phase 13: User Story 11 - Export Full Cap Board as ZIP (Priority: P3)

**Goal**: Users can export the entire board as a single ZIP file containing images and board.json manifest.

**Independent Test**: Click "Export CapBoard" and verify a ZIP file downloads containing images folder and board.json manifest, completing successfully for boards up to 50 items.

**Acceptance Criteria**:
- Single `.zip` file downloads
- ZIP contains /images/ folder with images (if available)
- ZIP contains board.json manifest referencing those images
- Export completes without crashing

- [ ] T093 [US11] Install and configure JSZip dependency in `package.json` (add jszip package, configure for extension build)
- [ ] T094 [US11] Implement ZIP export logic in `extension/export/zip-export.ts` (create JSZip instance, add images to /images/ folder, create board.json manifest, generate ZIP blob, handle errors)
- [ ] T095 [US11] Create board.json manifest for ZIP in `extension/export/zip-export.ts` (create ExportManifest with board metadata, map items to ExportItemReference with filename mappings, serialize to JSON)
- [ ] T096 [US11] Handle ZIP export request in service worker in `extension/background/service-worker.ts` (receive ExportRequestMessage with format 'zip', call ZIP export function, create downloadable ZIP file, send ExportResponseMessage with filename)
- [ ] T097 [US11] Trigger ZIP file download in UI in `extension/ui/components/CapBoardPanel.tsx` (receive ExportResponseMessage, create download link with ZIP blob URL, trigger download, show "Exported successfully" toast)
- [ ] T098 [US11] Test ZIP export with 50 items (capture 50 items, export ZIP, verify ZIP structure, verify images folder, verify board.json, verify no crashes)

**Checkpoint**: At this point, User Story 11 should be fully functional and testable independently

---

## Phase 14: User Story 12 - Handle CORS-Blocked Images with Fallback (Priority: P2)

**Goal**: Extension captures images even when direct download fails, using fallback mechanisms.

**Independent Test**: Attempt to capture CORS-blocked images and verify fallback mechanisms work, items are still added to the board, and users are informed about fallback usage.

**Acceptance Criteria**:
- System tries capture in order: URL storage → blob fetch → fallback
- Item is added to board even when fallback used
- Item has usable thumbnail
- User is informed via badge/tooltip if lower-quality fallback used

- [ ] T099 [US12] Implement CORS fallback strategy in `extension/background/service-worker.ts` (try URL storage first, attempt blob fetch, fallback to URL-only storage if CORS blocked, set qualityIndicator based on method used)
- [ ] T100 [US12] Set qualityIndicator on CapturedItem in `extension/background/service-worker.ts` (set 'url-only' if URL storage used, set 'blob' if blob fetch succeeded, set 'fallback' if fallback method used)
- [ ] T101 [US12] Display fallback indicator in ImageCard in `extension/ui/components/ImageCard.tsx` (show badge or tooltip if qualityIndicator is 'url-only' or 'fallback', style with Tailwind, inform user of lower quality)
- [ ] T102 [US12] Ensure thumbnail available even with fallback in `extension/background/service-worker.ts` (generate thumbnail from image URL if blob unavailable, use data URL or base64 thumbnail, ensure thumbnail always present for grid display)
- [ ] T103 [US12] Test CORS fallback on various websites (test on sites with strict CORS, verify fallback works, verify items still captured, verify user informed of fallback)

**Checkpoint**: At this point, User Story 12 should be fully functional and testable independently

---

## Phase 15: User Story 13 - Show Status Feedback for Actions (Priority: P3)

**Goal**: Users receive appropriate feedback (toasts/notifications) for all actions without blocking interaction.

**Independent Test**: Perform various actions (capture, export, clear) and verify appropriate feedback messages appear without blocking user interaction except for clear confirmation.

**Acceptance Criteria**:
- Capture shows "Captured" toast
- Export shows "Exported successfully" message
- Errors show toast with clear message and retry button
- Retry button allows retry of failed action
- Only "Clear board confirmation" shows blocking alert

- [ ] T104 [US13] Create toast notification component in `extension/ui/components/Toast.tsx` (toast component with message, auto-dismiss after 2-3 seconds, non-blocking, styled with Tailwind, glassmorphism effects)
- [ ] T105 [US13] Implement toast system in `extension/ui/side-panel.tsx` (toast state management, show/hide toasts, queue multiple toasts, position toasts appropriately)
- [ ] T106 [US13] Show "Captured" toast on successful capture in `extension/ui/components/CapBoardPanel.tsx` (listen for StorageUpdateMessage with action 'add', show "Captured" toast)
- [ ] T107 [US13] Show "Exported successfully" toast on export success in `extension/ui/components/CapBoardPanel.tsx` (listen for ExportResponseMessage with success=true, show "Exported successfully" toast)
- [ ] T108 [US13] Show error toast with retry button in `extension/ui/components/Toast.tsx` (error toast component with message, retry button, handle retry action, show error category, styled appropriately)
- [ ] T109 [US13] Implement retry functionality in `extension/ui/components/CapBoardPanel.tsx` (store last failed action, retry on button click, resend request to service worker)
- [ ] T110 [US13] Ensure only clear confirmation is blocking in `extension/ui/components/CapBoardPanel.tsx` (verify all toasts are non-blocking, only clear confirmation modal blocks interaction)

**Checkpoint**: At this point, User Story 13 should be fully functional and testable independently

---

## Phase 16: User Story 14 - Send Captured Items to Local Next.js API (Priority: P4 - Optional Phase 2)

**Goal**: Extension can send captured items to local Next.js app when available, with graceful fallback.

**Independent Test**: Capture items and verify they are posted to the local Next.js API when available, with appropriate fallback behavior when the app is not running.

**Acceptance Criteria**:
- Items posted to http://localhost:3000/api/capture when app running
- Falls back to extension-only storage when app not running
- "Local app not detected" message shown when app unavailable (non-blocking)
- Extension functions normally regardless of app availability

### Next.js API (Phase 2)

- [ ] T111 [US14] Create Next.js API route at `app/api/capture/route.ts` (POST handler, validate request origin is chrome-extension, validate payload structure, save item to Next.js storage, return success/error response)
- [ ] T112 [US14] Implement CORS handling in Next.js API in `app/api/capture/route.ts` (allow chrome-extension origins, validate origin, return appropriate CORS headers)
- [ ] T113 [US14] Validate capture payload in Next.js API in `app/api/capture/route.ts` (validate itemId, sourceUrl, timestamp, imageReference, metadata, return 400 if invalid)
- [ ] T114 [US14] Store captured items in Next.js app in `app/api/capture/route.ts` (save to database or file storage, handle storage errors, return 500 on server error)

### Extension Integration

- [ ] T115 [US14] Detect local Next.js app availability in `extension/background/service-worker.ts` (check if http://localhost:3000 is reachable, ping API endpoint, cache availability status)
- [ ] T116 [US14] Send captured items to Next.js API in `extension/background/service-worker.ts` (POST to http://localhost:3000/api/capture with capture payload, validate origin before sending, handle network errors)
- [ ] T117 [US14] Implement fallback to extension storage in `extension/background/service-worker.ts` (if API unavailable, save to extension storage only, if API request fails, save to extension storage, ensure no data loss)
- [ ] T118 [US14] Show "Local app not detected" message in `extension/ui/components/CapBoardPanel.tsx` (detect when app unavailable, show non-blocking message, allow extension to function normally)
- [ ] T119 [US14] Validate localhost origin in extension in `extension/background/service-worker.ts` (ensure requests only go to http://localhost:3000, reject other origins, security validation)
- [ ] T120 [US14] Test integration with Next.js app (start Next.js app, capture item, verify POST to /api/capture, stop app, capture item, verify fallback to extension storage)

**Checkpoint**: At this point, User Story 14 should be fully functional and testable independently

---

## Phase 17: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T121 [P] Documentation updates in `extension/README.md` (usage instructions, build instructions, development setup)
- [ ] T122 [P] Code cleanup and refactoring (review all code, remove unused code, improve code organization)
- [ ] T123 [P] Performance optimization across all stories (optimize image loading, optimize storage operations, optimize UI rendering)
- [ ] T124 [P] Security hardening (review all security requirements, verify CSP compliance, verify input validation, verify filename sanitization)
- [ ] T125 Run quickstart.md validation (execute all test scenarios from quickstart.md, verify all acceptance criteria met, document any issues)

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
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US3 for image detection
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Depends on US4 for captured items
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Depends on US5 for viewing items
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - Depends on US5 for viewing items
- **User Story 8 (P2)**: Can start after Foundational (Phase 2) - Depends on US4 for captured items
- **User Story 9 (P3)**: Can start after Foundational (Phase 2) - Depends on US5 for board data
- **User Story 10 (P3)**: Can start after Foundational (Phase 2) - Depends on US5 for board data
- **User Story 11 (P3)**: Can start after Foundational (Phase 2) - Depends on US5 for board data
- **User Story 12 (P2)**: Can start after Foundational (Phase 2) - Depends on US4 for capture flow
- **User Story 13 (P3)**: Can start after Foundational (Phase 2) - Depends on US4, US9, US10, US11 for actions
- **User Story 14 (P4)**: Can start after Foundational (Phase 2) - Depends on US4 for capture flow, optional Phase 2

### Within Each User Story

- Models/types before services
- Services before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- Models/types within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch all UI components for User Story 2 together:
Task: "Create Header component at extension/ui/components/Header.tsx"
Task: "Create ImageGrid component at extension/ui/components/ImageGrid.tsx"
Task: "Create ImageCard component at extension/ui/components/ImageCard.tsx"
Task: "Create CapBoardPanel component at extension/ui/components/CapBoardPanel.tsx"
Task: "Create ActionButton component at extension/ui/components/ActionButton.tsx"
```

---

## Parallel Example: Phase 2 Foundational

```bash
# Launch all foundational tasks together (all marked [P]):
Task: "Define TypeScript types at extension/types/index.ts"
Task: "Define shared types at shared/types/index.ts"
Task: "Implement chrome.storage.local adapter at extension/storage/storage-adapter.ts"
Task: "Implement IndexedDB adapter at extension/storage/indexeddb-adapter.ts"
Task: "Create storage interface/abstraction at extension/storage/storage-interface.ts"
Task: "Implement URL validator at extension/validation/url-validator.ts"
Task: "Implement image validator at extension/validation/image-validator.ts"
Task: "Implement schema validator at extension/validation/schema-validator.ts"
Task: "Define message types at extension/types/messages.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Load Extension)
4. Complete Phase 4: User Story 2 (Show Panel UI)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Stories 1 & 2 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Add User Story 5 → Test independently → Deploy/Demo
6. Add User Stories 6-8 → Test independently → Deploy/Demo
7. Add User Stories 9-13 → Test independently → Deploy/Demo
8. Add User Story 14 (optional Phase 2) → Test independently → Deploy/Demo
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1 & 2 (MVP)
   - Developer B: User Story 3 (Image Detection)
   - Developer C: User Story 4 (Capture)
3. After MVP complete:
   - Developer A: User Story 5 (View Grid)
   - Developer B: User Story 8 (Persistence)
   - Developer C: User Story 12 (CORS Fallback)
4. After P2 stories complete:
   - Developer A: User Stories 6 & 7 (Remove/Clear)
   - Developer B: User Stories 9-11 (Exports)
   - Developer C: User Story 13 (Status Feedback)
5. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (if tests requested)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths must be exact and match project structure from plan.md

---

## Task Summary

**Total Tasks**: 125

**Tasks by Phase**:
- Phase 1 (Setup): 14 tasks
- Phase 2 (Foundational): 14 tasks
- Phase 3 (US1): 5 tasks
- Phase 4 (US2): 11 tasks
- Phase 5 (US3): 5 tasks
- Phase 6 (US4): 10 tasks
- Phase 7 (US5): 8 tasks
- Phase 8 (US6): 5 tasks
- Phase 9 (US7): 5 tasks
- Phase 10 (US8): 5 tasks
- Phase 11 (US9): 5 tasks
- Phase 12 (US10): 5 tasks
- Phase 13 (US11): 6 tasks
- Phase 14 (US12): 5 tasks
- Phase 15 (US13): 7 tasks
- Phase 16 (US14): 10 tasks
- Phase 17 (Polish): 5 tasks

**Tasks by User Story**:
- User Story 1: 5 tasks
- User Story 2: 11 tasks
- User Story 3: 5 tasks
- User Story 4: 10 tasks
- User Story 5: 8 tasks
- User Story 6: 5 tasks
- User Story 7: 5 tasks
- User Story 8: 5 tasks
- User Story 9: 5 tasks
- User Story 10: 5 tasks
- User Story 11: 6 tasks
- User Story 12: 5 tasks
- User Story 13: 7 tasks
- User Story 14: 10 tasks

**Parallel Opportunities Identified**:
- Phase 2: 14 tasks can run in parallel
- Phase 4: 5 component tasks can run in parallel
- Multiple user stories can be worked on in parallel after foundational phase

**Suggested MVP Scope**: User Stories 1 & 2 (Load Extension + Show Panel UI) - 16 tasks total

**Independent Test Criteria**:
- Each user story has clear independent test criteria defined
- All stories can be tested independently without dependencies on other stories
- Test scenarios available in quickstart.md
