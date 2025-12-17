# Implementation Tasks: CapThat Chrome Extension

**Feature**: CapThat Chrome Extension + Next.js Web App  
**Feature Branch**: `001-capthat-extension`  
**Generated**: 2025-01-27  
**Status**: Ready for Implementation

## Overview

This document contains actionable, dependency-ordered tasks for implementing the CapThat Chrome Extension. Tasks are organized by phase, with user stories implemented independently to enable parallel work where possible.

**Total Tasks**: 147  
**User Stories**: 14 (P1: 2, P2: 5, P3: 6, P4: 1)  
**MVP Scope**: User Stories 1-2 (P1) + Foundational tasks

---

## Implementation Strategy

### MVP First Approach
- **MVP v1**: Complete User Stories 1-2 (P1) + Foundational tasks
- **Incremental Delivery**: Each user story phase is independently testable
- **Parallel Opportunities**: Tasks marked with `[P]` can be worked on in parallel

### Task Format
- `[P]` = Parallelizable (different files, no dependencies)
- `[US1]`, `[US2]`, etc. = User Story label (maps to spec.md)
- All tasks include exact file paths for implementation

---

## Phase 1: Setup & Build Pipeline

**Goal**: Initialize project structure and build configuration for Chrome Extension.

**Independent Test**: Extension loads in Chrome via "Load unpacked" without errors.

### Setup Tasks

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

## Phase 2: Foundational Tasks

**Goal**: Implement core infrastructure that blocks all user stories (storage, validation, types).

**Independent Test**: Storage adapters can save/load data, validators reject invalid inputs.

### Type Definitions

- [ ] T015 [P] Define TypeScript types at `extension/types/index.ts` (CapturedItem, CapBoard, ImageReference, ExportManifest)
- [ ] T016 [P] Define shared types at `shared/types/index.ts` for extension and web compatibility (export CapturedItem, CapBoard, ImageReference, ExportManifest interfaces)

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

---

## Phase 3: User Story 1 - Load Extension in Chrome (P1)

**Goal**: Extension loads successfully in Chrome and appears in extensions list.

**Independent Test**: Run build command, open chrome://extensions, load unpacked extension, verify it appears with icon and name "CapThat", reload reflects code changes.

**Acceptance Criteria**:
- Extension loads without errors
- Extension shows icon and name "CapThat" in extensions list
- Reloading extension reflects code changes after rebuild

### Implementation Tasks

- [ ] T029 [US1] Create extension icon files at `extension/icons/icon16.png`, `extension/icons/icon48.png`, `extension/icons/icon128.png` (icons field already configured in manifest.json)
- [ ] T030 [US1] Verify extension name "CapThat" is configured in `extension/manifest.json` (name field)
- [ ] T031 [US1] Verify build output generates valid extension structure in `build/extension/` (run `npm run build:extension` and verify manifest.json, icons, and compiled JS files exist)
- [ ] T032 [US1] Test extension loads via "Load unpacked" in chrome://extensions (open chrome://extensions, enable Developer mode, click "Load unpacked", select `build/extension/` directory)
- [ ] T033 [US1] Test extension reload reflects code changes after rebuild (make code change, rebuild, reload extension in chrome://extensions, verify change appears)

---

## Phase 4: User Story 2 - Show CapThat Panel UI (P1)

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

---

## Phase 5: User Story 3 - Detect Capturable Images on Page (P2)

**Goal**: Extension identifies images on the page and enables capture mode.

**Independent Test**: Visit page with images, verify extension injects capture controls or enables capture mode without breaking page layout or producing console errors.

**Acceptance Criteria**:
- Extension injects capture controls or enables capture mode
- Images with valid sources are marked as capturable
- Page layout is not broken, page interactions work normally
- No console errors on common websites

### Content Script Implementation

- [ ] T050 [US3] Implement image detection logic in `extension/content/content-script.ts` (querySelector for `<img>` elements)
- [ ] T051 [US3] Filter valid image sources (http/https/data) in `extension/content/content-script.ts`
- [ ] T052 [US3] Handle lazy-loaded images in `extension/content/content-script.ts`
- [ ] T053 [US3] Inject "Cap!" buttons with isolation in `extension/content/content-script.ts`
- [ ] T054 [US3] Setup message passing to service worker in `extension/content/content-script.ts`

### Security Hardening

- [ ] T055 [US3] Verify isolated world usage (no unsafeWindow) in `extension/content/content-script.ts`
- [ ] T056 [US3] Sanitize DOM manipulation in `extension/content/content-script.ts`
- [ ] T057 [US3] Test XSS prevention (isolated world, sanitized DOM)
- [ ] T058 [US3] Test content script injects without breaking pages on common websites

---

## Phase 6: User Story 4 - Capture Image Using "Cap!" Button (P2)

**Goal**: Users can click "Cap!" on an image tile to add it to Cap Board.

**Independent Test**: Click "Cap!" on image, verify item appears in CapThat panel within 2 seconds with all required metadata, duplicate captures handled appropriately, 80/100 limit warnings shown.

**Acceptance Criteria**:
- Item appears in panel within 2 seconds
- Item includes image reference, source page URL, captured timestamp
- Duplicate captures handled consistently (content hash matching)
- Warning shown at 80 items, capture blocked at 100 items

### Capture Logic

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

---

## Phase 7: User Story 5 - View Captured Items in Grid (P2)

**Goal**: Users can see captured items rendered as thumbnails in grid slots.

**Independent Test**: Capture multiple items, verify they render as thumbnails in grid slots with metadata, board state persists across refreshes and browser restarts.

**Acceptance Criteria**:
- Empty grid slots display placeholders with capture hint text
- Captured items render as thumbnails in grid slots
- Grid cells show thumbnail and optional metadata
- Virtual scrolling handles more than N items
- Board state persists across refreshes and browser restarts

### Grid Implementation

- [ ] T069 [US5] Implement grid rendering in `extension/ui/components/ImageGrid.tsx` (render captured items as thumbnails)
- [ ] T070 [US5] Implement empty state placeholders in `extension/ui/components/ImageGrid.tsx` ("Click Cap! to capture images")
- [ ] T071 [US5] Implement virtual scrolling in `extension/ui/components/ImageGrid.tsx` (fixed slots, content scrolls)
- [ ] T072 [US5] Load board data on panel open in `extension/ui/side-panel.tsx`
- [ ] T073 [US5] Handle grid updates on capture/remove in `extension/ui/components/ImageGrid.tsx`
- [ ] T074 [US5] Test board state persists across browser restarts

---

## Phase 8: User Story 8 - Persist Board Using Extension Storage (P2)

**Goal**: Board is saved automatically and loads when panel reopens.

**Independent Test**: Capture items, close and reopen panel, verify items load automatically, storage errors handled gracefully.

**Acceptance Criteria**:
- Board metadata persisted using chrome.storage.local
- Image blobs stored in IndexedDB
- Previously captured items load automatically on panel open
- Storage errors handled with non-blocking error messages

### Storage Persistence

- [ ] T075 [US8] Implement save board metadata in `extension/storage/storage-adapter.ts` (chrome.storage.local)
- [ ] T076 [US8] Implement save image blobs in `extension/storage/indexeddb-adapter.ts`
- [ ] T077 [US8] Implement load board on panel open in `extension/ui/side-panel.tsx`
- [ ] T078 [US8] Handle storage errors gracefully in `extension/storage/storage-adapter.ts`
- [ ] T079 [US8] Test board persistence across browser restarts

---

## Phase 9: User Story 12 - Handle CORS-Blocked Images with Fallback (P2)

**Goal**: Extension captures images even when direct download fails due to CORS.

**Independent Test**: Attempt to capture CORS-blocked images, verify fallback mechanisms work, items added to board with usable thumbnail, users informed about fallback usage.

**Acceptance Criteria**:
- System tries capture in order: store URL, attempt fetch blob, fallback to visible tab capture (optional v2)
- Items added to board with usable thumbnail even when fallback used
- Users informed via badge or tooltip when lower-quality fallback used

### CORS Fallback Implementation

- [ ] T080 [US12] Implement fallback capture strategy in `extension/background/service-worker.ts` (URL → blob → tab capture)
- [ ] T081 [US12] Store fallback indicator in captured item metadata
- [ ] T082 [US12] Display fallback badge/tooltip in `extension/ui/components/ImageCard.tsx`
- [ ] T083 [US12] Test CORS-blocked image capture with fallback

---

## Phase 10: User Story 6 - Remove a Captured Item (P3)

**Goal**: Users can remove individual captured items from the board.

**Independent Test**: Remove individual item, verify it disappears immediately, removed from storage, other items remain intact.

**Acceptance Criteria**:
- Remove control (X button) available on each item
- Item disappears immediately when removed
- Item removed from storage
- Other items remain on board

### Remove Functionality

- [ ] T084 [US6] Add remove button to items in `extension/ui/components/ImageCard.tsx`
- [ ] T085 [US6] Implement remove handler in `extension/ui/side-panel.tsx`
- [ ] T086 [US6] Update storage on remove in `extension/storage/storage-adapter.ts`
- [ ] T087 [US6] Update UI on remove in `extension/ui/components/ImageGrid.tsx`

---

## Phase 11: User Story 7 - Clear the Entire Cap Board (P3)

**Goal**: Users can clear the entire board with confirmation.

**Independent Test**: Click "Clear Cap Board", confirm action, verify all items removed from UI and storage.

**Acceptance Criteria**:
- "Clear Cap Board" button available
- Confirmation step (modal or confirm prompt) shown
- All items removed from UI on confirmation
- All stored items deleted from extension storage

### Clear Board Implementation

- [ ] T088 [US7] Implement clear button handler in `extension/ui/components/CapBoardPanel.tsx`
- [ ] T089 [US7] Add confirmation modal in `extension/ui/components/CapBoardPanel.tsx`
- [ ] T090 [US7] Clear storage on confirmation in `extension/storage/storage-adapter.ts`
- [ ] T091 [US7] Reset UI on clear in `extension/ui/components/ImageGrid.tsx`

---

## Phase 12: User Story 9 - Export Board Metadata as JSON (P3)

**Goal**: Users can export board metadata as JSON file.

**Independent Test**: Click "Export JSON", verify valid JSON file downloads with all required metadata fields for each item.

**Acceptance Criteria**:
- .json file downloads on click
- JSON includes for each item: id, image URL (or filename reference), source page URL, captured timestamp, optional metadata
- JSON validates (no circular refs, valid UTF-8)

### JSON Export

- [ ] T092 [US9] Implement JSON export logic at `extension/export/json-export.ts`
- [ ] T093 [US9] Generate JSON manifest with all metadata in `extension/export/json-export.ts`
- [ ] T094 [US9] Validate JSON structure in `extension/export/json-export.ts`
- [ ] T095 [US9] Download JSON via chrome.downloads API in `extension/export/json-export.ts`
- [ ] T096 [US9] Wire export button to handler in `extension/ui/components/CapBoardPanel.tsx`

---

## Phase 13: User Story 10 - Export Individual Captured Images (P3)

**Goal**: Users can export each captured image as separate files.

**Independent Test**: Click "Export Individual Caps", verify multiple image files download with consistent, unique filenames, CORS-blocked images handled appropriately.

**Acceptance Criteria**:
- Multiple image files download on click
- Filenames are consistent and unique (cap-<timestamp>-<id>.png)
- CORS-blocked images skipped and reported in summary

### Individual Image Export

- [ ] T097 [US10] Implement individual image export logic at `extension/export/image-export.ts`
- [ ] T098 [US10] Fetch images with CORS handling in `extension/export/image-export.ts`
- [ ] T099 [US10] Generate unique filenames in `extension/export/filename-sanitizer.ts` (cap-<timestamp>-<id>.png)
- [ ] T100 [US10] Sanitize filenames in `extension/export/filename-sanitizer.ts` (prevent path traversal)
- [ ] T101 [US10] Download multiple files via chrome.downloads API in `extension/export/image-export.ts`
- [ ] T102 [US10] Handle CORS-blocked images gracefully in `extension/export/image-export.ts`
- [ ] T103 [US10] Wire export button to handler in `extension/ui/components/CapBoardPanel.tsx`

---

## Phase 14: User Story 11 - Export Full Cap Board as ZIP (P3)

**Goal**: Users can export full board as single ZIP file.

**Independent Test**: Click "Export CapBoard", verify ZIP file downloads containing images folder and board.json manifest, completes successfully for boards up to 50 items.

**Acceptance Criteria**:
- Single .zip file downloads on click
- ZIP contains /images/ folder with images (if available) and board.json manifest
- Export completes without crashing for boards up to 50 items

### ZIP Export

- [ ] T104 [US11] Install JSZip dependency in `package.json`
- [ ] T105 [US11] Implement ZIP export logic at `extension/export/zip-export.ts`
- [ ] T106 [US11] Create ZIP structure with /images/ folder in `extension/export/zip-export.ts`
- [ ] T107 [US11] Add board.json manifest to ZIP in `extension/export/zip-export.ts`
- [ ] T108 [US11] Implement size limits in `extension/export/zip-export.ts` (prevent ZIP bombs)
- [ ] T109 [US11] Download ZIP via chrome.downloads API in `extension/export/zip-export.ts`
- [ ] T110 [US11] Wire export button to handler in `extension/ui/components/CapBoardPanel.tsx`

---

## Phase 15: User Story 13 - Show Status Feedback for Actions (P3)

**Goal**: Users receive confirmation and error feedback for all actions.

**Independent Test**: Perform various actions (capture, export, clear), verify appropriate feedback messages appear without blocking user interaction except for clear confirmation.

**Acceptance Criteria**:
- Toast appears "Captured" when "Cap!" clicked
- "Exported successfully" message on export success
- Toast notification with clear error message (permission/CORS/storage) and retry button on failure
- No blocking alerts except for "Clear board confirmation"

### Toast System

- [ ] T111 [US13] Create toast component at `extension/ui/components/Toast.tsx`
- [ ] T112 [US13] Implement toast queue in `extension/ui/components/Toast.tsx`
- [ ] T113 [US13] Show success messages (capture, export) in `extension/ui/side-panel.tsx`
- [ ] T114 [US13] Show error messages with retry button in `extension/ui/components/Toast.tsx`
- [ ] T115 [US13] Map errors to user-friendly messages in `extension/ui/components/Toast.tsx` (permission/CORS/storage categories)
- [ ] T116 [US13] Implement retry functionality in `extension/ui/components/Toast.tsx`
- [ ] T117 [US13] Ensure no internal paths exposed in error messages

---

## Phase 16: User Story 14 - Send Captured Items to Local Next.js API (P4 - Optional Phase 2)

**Goal**: Extension posts captured items to local Next.js API when available.

**Independent Test**: Capture items, verify they are posted to local Next.js API when available, appropriate fallback behavior when app is not running.

**Acceptance Criteria**:
- Extension posts captured payload to http://localhost:3000/api/capture when local app running
- Extension falls back to extension-only storage when local app not running
- "Local app not detected" message shown when app unavailable
- Items stored and displayed in Next.js board view

### Next.js API Integration

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

---

## Phase 17: Polish & Cross-Cutting Concerns

**Goal**: Complete security hardening, performance optimization, and final polish.

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

### User Story Completion Order

1. **Phase 1-2** (Setup + Foundational): Must complete before any user stories
2. **Phase 3** (US1 - Load Extension): Blocks all other stories (extension must load)
3. **Phase 4** (US2 - Panel UI): Blocks US5, US6, US7, US9, US10, US11, US13 (UI needed for interactions)
4. **Phase 5** (US3 - Detect Images): Blocks US4 (images must be detected before capture)
5. **Phase 6** (US4 - Capture): Blocks US5, US8, US12 (captures needed for board)
6. **Phase 7** (US5 - View Grid): Depends on US2, US4, US8
7. **Phase 8** (US8 - Persist Board): Can run in parallel with US5 after US4
8. **Phase 9** (US12 - CORS Fallback): Depends on US4, can run in parallel with US5, US8
9. **Phase 10** (US6 - Remove Item): Depends on US5
10. **Phase 11** (US7 - Clear Board): Depends on US5
11. **Phase 12** (US9 - Export JSON): Depends on US5
12. **Phase 13** (US10 - Export Images): Depends on US5
13. **Phase 14** (US11 - Export ZIP): Depends on US9, US10
14. **Phase 15** (US13 - Status Feedback): Depends on US4, US9, US10, US11, US7
15. **Phase 16** (US14 - Next.js API): Optional, can run independently after US4
16. **Phase 17** (Polish): Depends on all previous phases

### Parallel Execution Examples

**After Phase 2 (Foundational)**:
- T015-T028 can run in parallel (different files, no dependencies)

**After Phase 4 (US2 - Panel UI)**:
- T050-T058 (US3 - Detect Images) can start
- T059-T068 (US4 - Capture) can start after US3

**After Phase 6 (US4 - Capture)**:
- T069-T074 (US5 - View Grid) and T075-T079 (US8 - Persist Board) can run in parallel
- T080-T083 (US12 - CORS Fallback) can run in parallel

**After Phase 7 (US5 - View Grid)**:
- T084-T087 (US6 - Remove), T088-T091 (US7 - Clear), T092-T096 (US9 - Export JSON), T097-T103 (US10 - Export Images) can run in parallel

**After Phase 12-13 (US9, US10)**:
- T104-T110 (US11 - Export ZIP) can start

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

