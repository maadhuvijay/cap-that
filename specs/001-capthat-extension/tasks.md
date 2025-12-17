---
description: "Task list for CapThat Chrome Extension implementation"
---

# Tasks: CapThat Chrome Extension

**Input**: Design documents from `/specs/001-capthat-extension/`  
**Prerequisites**: implementation-plan.md (required), spec.md (required for user stories)  
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
- Reloading extension reflects code changes after rebuild

### Implementation for User Story 1

- [ ] T029 [US1] Create extension icon files at `extension/icons/icon16.png`, `extension/icons/icon48.png`, `extension/icons/icon128.png`
- [ ] T030 [US1] Verify extension name "CapThat" is configured in `extension/manifest.json` (name field)
- [ ] T031 [US1] Verify build output generates valid extension structure in `build/extension/` (run `npm run build:extension` and verify manifest.json, icons, and compiled JS files exist)
- [ ] T032 [US1] Test extension loads via "Load unpacked" in chrome://extensions (open chrome://extensions, enable Developer mode, click "Load unpacked", select `build/extension/` directory)
- [ ] T033 [US1] Test extension reload reflects code changes after rebuild (make code change, rebuild, reload extension in chrome://extensions, verify change appears)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Show CapThat Panel UI (Priority: P1) 🎯 MVP

**Goal**: Users can open CapThat panel and see complete UI with title, grid, and action buttons.

**Independent Test**: Click extension action button (or open side panel), verify UI displays with title "CapThat!", empty grid with N slots, buttons (Clear, Export JSON, Export CapBoard, Export Individual Caps), styled with Tailwind at desktop widths.

**Acceptance Criteria**:
- Panel opens via extension action button or side panel
- UI displays title "CapThat!", empty grid with N slots, action buttons
- UI is styled with Tailwind and usable at desktop widths

### Design System Setup

- [ ] T034 [US2] Configure Tailwind for dark mode in `extension/ui/tailwind.config.js`
- [ ] T035 [US2] Define color palette (teal/cyan/electric blue) in `extension/ui/tailwind.config.js`
- [ ] T036 [US2] Create utility classes for glassmorphism in `extension/ui/globals.css` (backdrop-blur effects)
- [ ] T037 [US2] Define typography scale in `extension/ui/tailwind.config.js`

### UI Components

- [ ] T038 [P] [US2] Implement Header component at `extension/ui/components/Header.tsx` (browser-like header with URL bar)
- [ ] T039 [P] [US2] Implement ActionButton component at `extension/ui/components/ActionButton.tsx` (reusable button with hover/active states)
- [ ] T040 [P] [US2] Implement ImageCard component at `extension/ui/components/ImageCard.tsx` (image card with "Cap!" button overlay)
- [ ] T041 [P] [US2] Implement ImageGrid component at `extension/ui/components/ImageGrid.tsx` (grid layout with empty state placeholders)
- [ ] T042 [P] [US2] Implement CapBoardPanel component at `extension/ui/components/CapBoardPanel.tsx` (right-side panel with board grid and action buttons)

### Side Panel Integration

- [ ] T043 [US2] Integrate React components in `extension/ui/side-panel.tsx`
- [ ] T044 [US2] Setup Tailwind styles in `extension/ui/side-panel.html`
- [ ] T045 [US2] Configure side panel in `extension/manifest.json` (side_panel field)
- [ ] T046 [US2] Test side panel opens and displays correctly
- [ ] T047 [US2] Test responsive layout at desktop widths (1024px+)
- [ ] T048 [US2] Verify dark theme with glassmorphism effects render correctly
- [ ] T049 [US2] Verify hover states and transitions work (200-300ms duration)

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Detect Capturable Images on Page (Priority: P2)

**Goal**: Extension identifies images on the page and enables capture mode.

**Independent Test**: Visit page with images, verify extension injects capture controls or enables capture mode without breaking page layout or producing console errors.

**Acceptance Criteria**:
- Extension injects capture controls or enables capture mode
- Images with valid sources are marked as capturable
- Page layout is not broken, page interactions work normally
- No console errors on common websites

### Implementation for User Story 3

- [ ] T050 [US3] Implement image detection logic in `extension/content/content-script.ts` (querySelector for `<img>` elements)
- [ ] T051 [US3] Filter valid image sources (http/https/data) in `extension/content/content-script.ts`
- [ ] T052 [US3] Handle lazy-loaded images in `extension/content/content-script.ts`
- [ ] T053 [US3] Inject "Cap!" buttons with isolation in `extension/content/content-script.ts`
- [ ] T054 [US3] Setup message passing to service worker in `extension/content/content-script.ts`
- [ ] T055 [US3] Verify isolated world usage (no unsafeWindow) in `extension/content/content-script.ts`
- [ ] T056 [US3] Sanitize DOM manipulation in `extension/content/content-script.ts`
- [ ] T057 [US3] Test XSS prevention (isolated world, sanitized DOM)
- [ ] T058 [US3] Test content script injects without breaking pages on common websites

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Capture Image Using "Cap!" Button (Priority: P2)

**Goal**: Users can click "Cap!" on an image tile to add it to Cap Board.

**Independent Test**: Click "Cap!" on image, verify item appears in CapThat panel within 2 seconds with all required metadata, duplicate captures handled appropriately, 80/100 limit warnings shown.

**Acceptance Criteria**:
- Item appears in panel within 2 seconds
- Item includes image reference, source page URL, captured timestamp
- Duplicate captures handled consistently (content hash matching)
- Warning shown at 80 items, capture blocked at 100 items

### Implementation for User Story 4

- [ ] T059 [US4] Implement capture request handler in `extension/background/service-worker.ts`
- [ ] T060 [US4] Implement URL capture (primary) in `extension/background/service-worker.ts`
- [ ] T061 [US4] Implement blob fetch (best-effort) in `extension/background/service-worker.ts`
- [ ] T062 [US4] Handle CORS failures gracefully in `extension/background/service-worker.ts`
- [ ] T063 [US4] Store fallback indicator in `extension/background/service-worker.ts`
- [ ] T064 [US4] Implement duplicate detection (URL-based) in `extension/background/service-worker.ts`
- [ ] T065 [US4] Generate thumbnail for grid in `extension/background/service-worker.ts`
- [ ] T066 [US4] Save captured item to storage in `extension/background/service-worker.ts`
- [ ] T067 [US4] Check board size before capture (80/100 limits) in `extension/background/service-worker.ts`
- [ ] T068 [US4] Update UI on capture completion via storage events

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 - View Captured Items in Grid (Priority: P2)

**Goal**: Users can see captured items rendered as thumbnails in grid slots.

**Independent Test**: Capture multiple items, verify they render as thumbnails in grid slots with metadata, board state persists across refreshes and browser restarts.

**Acceptance Criteria**:
- Empty grid slots display placeholders with capture hint text
- Captured items render as thumbnails in grid slots
- Grid cells show thumbnail and optional metadata
- Virtual scrolling handles more than N items
- Board state persists across refreshes and browser restarts

### Implementation for User Story 5

- [ ] T069 [US5] Implement grid rendering in `extension/ui/components/ImageGrid.tsx` (render captured items as thumbnails)
- [ ] T070 [US5] Implement empty state placeholders in `extension/ui/components/ImageGrid.tsx` ("Click Cap! to capture images")
- [ ] T071 [US5] Implement virtual scrolling in `extension/ui/components/ImageGrid.tsx` (fixed slots, content scrolls)
- [ ] T072 [US5] Load board data on panel open in `extension/ui/side-panel.tsx`
- [ ] T073 [US5] Handle grid updates on capture/remove in `extension/ui/components/ImageGrid.tsx`
- [ ] T074 [US5] Test board state persists across browser restarts

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently

---

## Phase 8: User Story 8 - Persist Board Using Extension Storage (Priority: P2)

**Goal**: Board is saved automatically and loads when panel reopens.

**Independent Test**: Capture items, close and reopen panel, verify items load automatically, storage errors handled gracefully.

**Acceptance Criteria**:
- Board metadata persisted using chrome.storage.local
- Image blobs stored in IndexedDB
- Previously captured items load automatically on panel open
- Storage errors handled with non-blocking error messages

### Implementation for User Story 8

- [ ] T075 [US8] Implement save board metadata in `extension/storage/storage-adapter.ts` (chrome.storage.local)
- [ ] T076 [US8] Implement save image blobs in `extension/storage/indexeddb-adapter.ts`
- [ ] T077 [US8] Implement load board on panel open in `extension/ui/side-panel.tsx`
- [ ] T078 [US8] Handle storage errors gracefully in `extension/storage/storage-adapter.ts`
- [ ] T079 [US8] Test board persistence across browser restarts

**Checkpoint**: At this point, User Story 8 should be fully functional and testable independently

---

## Phase 9: User Story 12 - Handle CORS-Blocked Images with Fallback (Priority: P2)

**Goal**: Extension captures images even when direct download fails due to CORS.

**Independent Test**: Attempt to capture CORS-blocked images, verify fallback mechanisms work, items added to board with usable thumbnail, users informed about fallback usage.

**Acceptance Criteria**:
- System tries capture in order: store URL, attempt fetch blob, fallback to visible tab capture (optional v2)
- Items added to board with usable thumbnail even when fallback used
- Users informed via badge or tooltip when lower-quality fallback used

### Implementation for User Story 12

- [ ] T080 [US12] Implement fallback capture strategy in `extension/background/service-worker.ts` (URL → blob → tab capture)
- [ ] T081 [US12] Store fallback indicator in captured item metadata
- [ ] T082 [US12] Display fallback badge/tooltip in `extension/ui/components/ImageCard.tsx`
- [ ] T083 [US12] Test CORS-blocked image capture with fallback

**Checkpoint**: At this point, User Story 12 should be fully functional and testable independently

---

## Phase 10: User Story 6 - Remove a Captured Item (Priority: P3)

**Goal**: Users can remove individual captured items from the board.

**Independent Test**: Remove individual item, verify it disappears immediately, removed from storage, other items remain intact.

**Acceptance Criteria**:
- Remove control (X button) available on each item
- Item disappears immediately when removed
- Item removed from storage
- Other items remain on board

### Implementation for User Story 6

- [ ] T084 [US6] Add remove button to items in `extension/ui/components/ImageCard.tsx`
- [ ] T085 [US6] Implement remove handler in `extension/ui/side-panel.tsx`
- [ ] T086 [US6] Update storage on remove in `extension/storage/storage-adapter.ts`
- [ ] T087 [US6] Update UI on remove in `extension/ui/components/ImageGrid.tsx`

**Checkpoint**: At this point, User Story 6 should be fully functional and testable independently

---

## Phase 11: User Story 7 - Clear the Entire Cap Board (Priority: P3)

**Goal**: Users can clear the entire board with confirmation.

**Independent Test**: Click "Clear Cap Board", confirm action, verify all items removed from UI and storage.

**Acceptance Criteria**:
- "Clear Cap Board" button available
- Confirmation step (modal or confirm prompt) shown
- All items removed from UI on confirmation
- All stored items deleted from extension storage

### Implementation for User Story 7

- [ ] T088 [US7] Implement clear button handler in `extension/ui/components/CapBoardPanel.tsx`
- [ ] T089 [US7] Add confirmation modal in `extension/ui/components/CapBoardPanel.tsx`
- [ ] T090 [US7] Clear storage on confirmation in `extension/storage/storage-adapter.ts`
- [ ] T091 [US7] Reset UI on clear in `extension/ui/components/ImageGrid.tsx`

**Checkpoint**: At this point, User Story 7 should be fully functional and testable independently

---

## Phase 12: User Story 9 - Export Board Metadata as JSON (Priority: P3)

**Goal**: Users can export board metadata as JSON file.

**Independent Test**: Click "Export JSON", verify valid JSON file downloads with all required metadata fields for each item.

**Acceptance Criteria**:
- .json file downloads on click
- JSON includes for each item: id, image URL (or filename reference), source page URL, captured timestamp, optional metadata
- JSON validates (no circular refs, valid UTF-8)

### Implementation for User Story 9

- [ ] T092 [US9] Implement JSON export logic at `extension/export/json-export.ts`
- [ ] T093 [US9] Generate JSON manifest with all metadata in `extension/export/json-export.ts`
- [ ] T094 [US9] Validate JSON structure in `extension/export/json-export.ts`
- [ ] T095 [US9] Download JSON via chrome.downloads API in `extension/export/json-export.ts`
- [ ] T096 [US9] Wire export button to handler in `extension/ui/components/CapBoardPanel.tsx`

**Checkpoint**: At this point, User Story 9 should be fully functional and testable independently

---

## Phase 13: User Story 10 - Export Individual Captured Images (Priority: P3)

**Goal**: Users can export each captured image as separate files.

**Independent Test**: Click "Export Individual Caps", verify multiple image files download with consistent, unique filenames, CORS-blocked images handled appropriately.

**Acceptance Criteria**:
- Multiple image files download on click
- Filenames are consistent and unique (cap-<timestamp>-<id>.png)
- CORS-blocked images skipped and reported in summary

### Implementation for User Story 10

- [ ] T097 [US10] Implement individual image export logic at `extension/export/image-export.ts`
- [ ] T098 [US10] Fetch images with CORS handling in `extension/export/image-export.ts`
- [ ] T099 [US10] Generate unique filenames in `extension/export/filename-sanitizer.ts` (cap-<timestamp>-<id>.png)
- [ ] T100 [US10] Sanitize filenames in `extension/export/filename-sanitizer.ts` (prevent path traversal)
- [ ] T101 [US10] Download multiple files via chrome.downloads API in `extension/export/image-export.ts`
- [ ] T102 [US10] Handle CORS-blocked images gracefully in `extension/export/image-export.ts`
- [ ] T103 [US10] Wire export button to handler in `extension/ui/components/CapBoardPanel.tsx`

**Checkpoint**: At this point, User Story 10 should be fully functional and testable independently

---

## Phase 14: User Story 11 - Export Full Cap Board as ZIP (Priority: P3)

**Goal**: Users can export full board as single ZIP file.

**Independent Test**: Click "Export CapBoard", verify ZIP file downloads containing images folder and board.json manifest, completes successfully for boards up to 50 items.

**Acceptance Criteria**:
- Single .zip file downloads on click
- ZIP contains /images/ folder with images (if available) and board.json manifest
- Export completes without crashing for boards up to 50 items

### Implementation for User Story 11

- [ ] T104 [US11] Install JSZip dependency in `package.json`
- [ ] T105 [US11] Implement ZIP export logic at `extension/export/zip-export.ts`
- [ ] T106 [US11] Create ZIP structure with /images/ folder in `extension/export/zip-export.ts`
- [ ] T107 [US11] Add board.json manifest to ZIP in `extension/export/zip-export.ts`
- [ ] T108 [US11] Implement size limits in `extension/export/zip-export.ts` (prevent ZIP bombs)
- [ ] T109 [US11] Download ZIP via chrome.downloads API in `extension/export/zip-export.ts`
- [ ] T110 [US11] Wire export button to handler in `extension/ui/components/CapBoardPanel.tsx`

**Checkpoint**: At this point, User Story 11 should be fully functional and testable independently

---

## Phase 15: User Story 13 - Show Status Feedback for Actions (Priority: P3)

**Goal**: Users receive confirmation and error feedback for all actions.

**Independent Test**: Perform various actions (capture, export, clear), verify appropriate feedback messages appear without blocking user interaction except for clear confirmation.

**Acceptance Criteria**:
- Toast appears "Captured" when "Cap!" clicked
- "Exported successfully" message on export success
- Toast notification with clear error message (permission/CORS/storage) and retry button on failure
- No blocking alerts except for "Clear board confirmation"

### Implementation for User Story 13

- [ ] T111 [US13] Create toast component at `extension/ui/components/Toast.tsx`
- [ ] T112 [US13] Implement toast queue in `extension/ui/components/Toast.tsx`
- [ ] T113 [US13] Show success messages (capture, export) in `extension/ui/side-panel.tsx`
- [ ] T114 [US13] Show error messages with retry button in `extension/ui/components/Toast.tsx`
- [ ] T115 [US13] Map errors to user-friendly messages in `extension/ui/components/Toast.tsx` (permission/CORS/storage categories)
- [ ] T116 [US13] Implement retry functionality in `extension/ui/components/Toast.tsx`
- [ ] T117 [US13] Ensure no internal paths exposed in error messages

**Checkpoint**: At this point, User Story 13 should be fully functional and testable independently

---

## Phase 16: User Story 14 - Send Captured Items to Local Next.js API (Priority: P4 - Optional Phase 2)

**Goal**: Extension posts captured items to local Next.js API when available.

**Independent Test**: Capture items, verify they are posted to local Next.js API when available, appropriate fallback behavior when app is not running.

**Acceptance Criteria**:
- Extension posts captured payload to http://localhost:3000/api/capture when local app running
- Extension falls back to extension-only storage when local app not running
- "Local app not detected" message shown when app unavailable
- Items stored and displayed in Next.js board view

### Implementation for User Story 14

- [ ] T118 [US14] Create Next.js API endpoint at `app/api/capture/route.ts` (POST handler)
- [ ] T119 [US14] Validate payload structure in `app/api/capture/route.ts`
- [ ] T120 [US14] Store captures in local database/file system in `app/api/capture/route.ts`
- [ ] T121 [US14] Return success/error response in `app/api/capture/route.ts`
- [ ] T122 [US14] Detect localhost:3000 availability in `extension/background/service-worker.ts`
- [ ] T123 [US14] Post capture payload to API in `extension/background/service-worker.ts`
- [ ] T124 [US14] Handle timeouts in `extension/background/service-worker.ts`
- [ ] T125 [US14] Fallback to extension storage when API unavailable in `extension/background/service-worker.ts`
- [ ] T126 [US14] Validate localhost origin only in `extension/background/service-worker.ts`
- [ ] T127 [US14] Create board view page at `app/board/page.tsx`
- [ ] T128 [US14] Display captured items in board view in `app/board/page.tsx`

**Checkpoint**: At this point, User Story 14 should be fully functional and testable independently

---

## Phase 17: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

**Independent Test**: All security acceptance criteria pass, performance acceptable with 100 items, UI polished and accessible.

### Security Hardening

- [ ] T129 Verify manifest permissions are minimal and justified (activeTab, storage, scripting, sidePanel)
- [ ] T130 Test CSP violations are blocked (no eval, no inline scripts)
- [ ] T131 Test XSS prevention in content scripts (isolated world, sanitized DOM)
- [ ] T132 Test input validation with malicious URLs (javascript:, data: schemes)
- [ ] T133 Test storage quota handling (warnings at 80% usage, errors at 100%)
- [ ] T134 Verify export filename sanitization (no path traversal characters)
- [ ] T135 Implement MIME type validation (JPEG, PNG, GIF, WebP only) in `extension/validation/image-validator.ts`
- [ ] T136 Implement image size limits (10MB per image, 10MP dimensions) in `extension/validation/image-validator.ts`
- [ ] T137 Verify error messages are user-friendly (no internal paths exposed)
- [ ] T138 Test localhost API origin validation (reject non-localhost requests)

### Performance Optimization

- [ ] T139 Optimize thumbnail rendering for 100 items in `extension/ui/components/ImageGrid.tsx`
- [ ] T140 Implement lazy loading for images in `extension/ui/components/ImageCard.tsx`
- [ ] T141 Test virtual scrolling performance with 100 items

### Accessibility & UX

- [ ] T142 Verify high contrast text on dark background (WCAG AA compliance)
- [ ] T143 Verify keyboard navigation works (tab navigation, Enter/Space activation)
- [ ] T144 Test all interactive elements have hover states
- [ ] T145 Verify transitions are smooth (200-300ms, no jank)

### Documentation

- [ ] T146 Create README.md at `extension/README.md` with setup and usage instructions
- [ ] T147 Document security considerations in `extension/SECURITY.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Depends on US3 (images must be detected before capture)
- **User Story 5 (P2)**: Depends on US2 (UI needed), US4 (captures needed), US8 (persistence needed)
- **User Story 6 (P3)**: Depends on US5 (grid needed)
- **User Story 7 (P3)**: Depends on US5 (grid needed)
- **User Story 8 (P2)**: Can start after US4 (captures needed) - Can run in parallel with US5
- **User Story 9 (P3)**: Depends on US5 (board needed)
- **User Story 10 (P3)**: Depends on US5 (board needed)
- **User Story 11 (P3)**: Depends on US9, US10 (export components needed)
- **User Story 12 (P2)**: Depends on US4 (capture needed) - Can run in parallel with US5, US8
- **User Story 13 (P3)**: Depends on US4, US9, US10, US11, US7 (actions needed for feedback)
- **User Story 14 (P4)**: Can start after US4 (capture needed) - Optional, can run independently

### Within Each User Story

- Models before services
- Services before endpoints/UI
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks can run in parallel (different files)
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Execution Examples

### After Phase 2 (Foundational):
```bash
# Launch all foundational tasks in parallel:
Task: "Define TypeScript types at extension/types/index.ts"
Task: "Define shared types at shared/types/index.ts"
Task: "Implement chrome.storage.local adapter at extension/storage/storage-adapter.ts"
Task: "Implement IndexedDB adapter at extension/storage/indexeddb-adapter.ts"
Task: "Implement URL validator at extension/validation/url-validator.ts"
Task: "Implement image validator at extension/validation/image-validator.ts"
Task: "Define message types at extension/types/messages.ts"
```

### After Phase 4 (US2 - Panel UI):
```bash
# Launch UI components in parallel:
Task: "Implement Header component at extension/ui/components/Header.tsx"
Task: "Implement ActionButton component at extension/ui/components/ActionButton.tsx"
Task: "Implement ImageCard component at extension/ui/components/ImageCard.tsx"
Task: "Implement ImageGrid component at extension/ui/components/ImageGrid.tsx"
Task: "Implement CapBoardPanel component at extension/ui/components/CapBoardPanel.tsx"
```

### After Phase 6 (US4 - Capture):
```bash
# Launch parallel stories:
Task: "Implement grid rendering in extension/ui/components/ImageGrid.tsx" (US5)
Task: "Implement save board metadata in extension/storage/storage-adapter.ts" (US8)
Task: "Implement fallback capture strategy in extension/background/service-worker.ts" (US12)
```

---

## Implementation Strategy

### MVP First (User Stories 1-2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Load Extension)
4. Complete Phase 4: User Story 2 (Panel UI)
5. **STOP and VALIDATE**: Test User Stories 1-2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Extension loads!)
3. Add User Story 2 → Test independently → Deploy/Demo (UI visible!)
4. Add User Story 3 → Test independently → Deploy/Demo (Images detected!)
5. Add User Story 4 → Test independently → Deploy/Demo (Capture works!)
6. Add User Story 5 → Test independently → Deploy/Demo (Grid displays!)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Load Extension)
   - Developer B: User Story 2 (Panel UI)
3. Once US1 and US2 are done:
   - Developer A: User Story 3 (Detect Images)
   - Developer B: User Story 4 (Capture)
   - Developer C: User Story 5 (View Grid) + US8 (Persistence)
4. Stories complete and integrate independently

---

## Task Summary

### Total Tasks: 147

### Tasks by Phase:
- Phase 1 (Setup): 14 tasks
- Phase 2 (Foundational): 14 tasks
- Phase 3 (US1): 5 tasks
- Phase 4 (US2): 16 tasks
- Phase 5 (US3): 9 tasks
- Phase 6 (US4): 10 tasks
- Phase 7 (US5): 6 tasks
- Phase 8 (US8): 5 tasks
- Phase 9 (US12): 4 tasks
- Phase 10 (US6): 4 tasks
- Phase 11 (US7): 4 tasks
- Phase 12 (US9): 5 tasks
- Phase 13 (US10): 7 tasks
- Phase 14 (US11): 7 tasks
- Phase 15 (US13): 7 tasks
- Phase 16 (US14): 11 tasks
- Phase 17 (Polish): 20 tasks

### Tasks by User Story:
- US1 (P1): 5 tasks
- US2 (P1): 16 tasks
- US3 (P2): 9 tasks
- US4 (P2): 10 tasks
- US5 (P2): 6 tasks
- US6 (P3): 4 tasks
- US7 (P3): 4 tasks
- US8 (P2): 5 tasks
- US9 (P3): 5 tasks
- US10 (P3): 7 tasks
- US11 (P3): 7 tasks
- US12 (P2): 4 tasks
- US13 (P3): 7 tasks
- US14 (P4): 11 tasks

### Parallel Opportunities Identified:
- 28 tasks marked with `[P]` can be worked on in parallel

### Independent Test Criteria for Each Story:
- **US1**: Extension loads in Chrome, appears in extensions list
- **US2**: Panel opens and displays complete UI
- **US3**: Images detected without breaking pages
- **US4**: Capture adds item to board within 2 seconds
- **US5**: Grid displays captured items, persists across restarts
- **US6**: Remove item works, other items remain
- **US7**: Clear board works with confirmation
- **US8**: Board persists and loads automatically
- **US9**: JSON export generates valid file
- **US10**: Individual images export with unique filenames
- **US11**: ZIP export completes for boards up to 50 items
- **US12**: CORS-blocked images captured with fallback
- **US13**: Status feedback appears for all actions
- **US14**: Items posted to Next.js API when available

### Suggested MVP Scope:
- **MVP v1**: Phases 1-4 (Setup + Foundational + US1 + US2)
  - Total MVP tasks: 49 tasks
  - Delivers: Extension loads, panel UI displays, foundation for all features

---

## Format Validation

✅ All tasks follow the strict checklist format:
- Checkbox: `- [ ]`
- Task ID: `T001`, `T002`, etc.
- Parallel marker: `[P]` where applicable
- Story label: `[US1]`, `[US2]`, etc. for user story phases
- Description: Clear action with exact file path

---

**End of Tasks Document**
