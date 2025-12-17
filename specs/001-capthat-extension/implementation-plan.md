# Implementation Plan: CapThat Chrome Extension

**Feature Branch**: `001-capthat-extension`  
**Created**: 2025-01-27  
**Status**: Planning  
**Feature Spec**: [spec.md](./spec.md)  
**Security Checklist**: [checklists/security.md](./checklists/security.md)

## Executive Summary

This plan outlines the implementation of CapThat: a Chrome Extension (MV3) + Next.js web app for capturing and organizing images into a mood board. The MVP focuses on local-first functionality with a futuristic, dark-mode UI using Tailwind CSS only.

**Key Deliverables**:
- Chrome Extension with content script injection
- CapThat panel UI (side panel or overlay)
- Image capture with CORS fallback handling
- Board persistence (chrome.storage.local + IndexedDB)
- Export functionality (JSON + ZIP)
- Optional Phase 2: Local Next.js API integration

---

## 1. High-Level Architecture Overview

### 1.1 Extension Components

#### **Manifest V3 Structure**
```
manifest.json
├── Permissions (minimal)
│   ├── storage (chrome.storage.local)
│   ├── activeTab (current tab access)
│   ├── scripting (content script injection)
│   └── sidePanel (optional, for panel UI)
├── Content Security Policy (strict)
│   ├── script-src 'self'
│   ├── img-src 'self' data: blob: https: http:
│   └── connect-src 'self' http://localhost:3000
└── Background Service Worker
    ├── Message routing
    ├── Storage management
    └── Export orchestration
```

#### **Content Script**
- **Isolation**: MV3 isolated world (default)
- **Purpose**: Detect images, inject "Cap!" buttons
- **Communication**: `postMessage` to service worker
- **Security**: No direct page context access, sanitized DOM manipulation

#### **Service Worker (Background)**
- **Purpose**: Message handling, storage operations, export generation
- **Lifecycle**: Event-driven, persistent state via chrome.storage
- **Security**: Validates all messages, enforces storage limits

#### **UI Surface Options**
1. **Side Panel** (recommended for MVP)
   - Native Chrome UI
   - Persistent across tabs
   - Requires `sidePanel` permission
2. **Action Popup** (alternative)
   - Lightweight, quick access
   - Closes on navigation
3. **Injected Overlay** (fallback)
   - Works without side panel permission
   - More complex CSS isolation

**Decision**: Start with **Side Panel** for better UX; fallback to popup if needed.

### 1.2 Next.js App Structure (Phase 2)

```
app/
├── api/
│   └── capture/
│       └── route.ts (POST handler)
├── board/
│   └── page.tsx (board view)
└── layout.tsx (shared layout)
```

**API Endpoint**: `POST /api/capture`
- Accepts: `{ id, imageUrl, sourceUrl, timestamp, metadata }`
- Validates payload structure
- Stores in local database (Phase 2)
- Returns: `{ success: boolean, id?: string }`

### 1.3 Data Flow

```
┌─────────────┐
│ Web Page    │
│ (Images)    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Content Script  │ ◄─── Detects images, injects "Cap!" buttons
│ (Isolated)      │
└──────┬──────────┘
       │ postMessage
       ▼
┌─────────────────┐
│ Service Worker  │ ◄─── Validates, processes capture
│ (Background)    │
└──────┬──────────┘
       │
       ├──► chrome.storage.local (metadata)
       ├──► IndexedDB (image blobs)
       └──► Side Panel UI (updates via storage events)
```

**Export Flow**:
```
Service Worker
  ├──► Generate JSON manifest
  ├──► Fetch images (with CORS handling)
  ├──► Create ZIP via JSZip
  └──► Download via chrome.downloads API
```

### 1.4 Security Boundaries

#### **Isolation Layers**
1. **Content Script ↔ Page**: Isolated world, no `unsafeWindow`
2. **Content Script ↔ Extension**: `postMessage` with validation
3. **Extension ↔ Storage**: Input validation before write
4. **Extension ↔ Export**: Filename sanitization, size limits

#### **Validation Checkpoints**
- **Input**: URLs, metadata, timestamps (on capture)
- **Storage**: Data schema validation (on write/read)
- **Export**: Filename sanitization, JSON structure validation
- **API** (Phase 2): Payload validation, localhost-only origin check

#### **Permission Rationale**
| Permission | Justification | Alternative Considered |
|------------|---------------|----------------------|
| `storage` | Required for chrome.storage.local | None |
| `activeTab` | Access current tab for image detection | `*://*/*` (too broad) |
| `scripting` | MV3 requirement for content script injection | None |
| `sidePanel` | Better UX than popup | Popup (acceptable fallback) |

---

## 2. Folder and File Structure

```
cap-that/
├── extension/                          # Chrome Extension
│   ├── manifest.json                   # MV3 manifest
│   ├── background/
│   │   └── service-worker.ts          # Background service worker
│   ├── content/
│   │   └── content-script.ts          # Content script injection
│   ├── ui/
│   │   ├── side-panel.html            # Side panel HTML
│   │   ├── side-panel.tsx             # React component
│   │   └── components/                # UI components
│   │       ├── Header.tsx
│   │       ├── ImageGrid.tsx
│   │       ├── ImageCard.tsx
│   │       ├── CapBoardPanel.tsx
│   │       └── ActionButton.tsx
│   ├── storage/
│   │   ├── storage-adapter.ts          # chrome.storage wrapper
│   │   └── indexeddb-adapter.ts       # IndexedDB wrapper
│   ├── export/
│   │   ├── json-export.ts              # JSON export logic
│   │   ├── zip-export.ts               # ZIP export logic
│   │   └── filename-sanitizer.ts       # Filename sanitization
│   ├── validation/
│   │   ├── url-validator.ts            # URL validation
│   │   ├── image-validator.ts          # Image validation
│   │   └── schema-validator.ts         # Data schema validation
│   └── types/
│       └── index.ts                    # TypeScript types
│
├── web/                                # Next.js App (Phase 2)
│   ├── app/
│   │   ├── api/
│   │   │   └── capture/
│   │   │       └── route.ts            # POST /api/capture
│   │   ├── board/
│   │   │   └── page.tsx                # Board view page
│   │   └── layout.tsx                  # Root layout
│   └── components/                     # Shared components
│
├── shared/                             # Shared code
│   ├── types/
│   │   └── index.ts                    # Shared TypeScript types
│   ├── validators/
│   │   ├── url.ts                      # URL validation
│   │   ├── image.ts                    # Image validation
│   │   └── schema.ts                   # Schema validation
│   ├── storage/
│   │   └── adapters.ts                 # Storage interface
│   └── export/
│       ├── json.ts                     # JSON export utilities
│       └── zip.ts                      # ZIP export utilities
│
├── specs/
│   └── 001-capthat-extension/
│       ├── spec.md                     # Main feature spec
│       ├── implementation-plan.md      # This document
│       └── checklists/
│           ├── requirements.md
│           └── security.md
│
└── build/                              # Build output
    ├── extension/                      # Packed extension
    └── web/                            # Next.js build
```

**Build Configuration**:
- **Extension**: TypeScript + Vite (or esbuild) for bundling
- **Web**: Next.js default build (`next build`)
- **Shared**: Compiled to both extension and web targets

---

## 3. Main Spec Integration Plan

### 3.1 Security Requirements Integration

**Location in Main Spec**: Add new section "Security Requirements" after "Functional Requirements"

**Structure**:
```markdown
## Security Requirements

### Non-Functional Requirements
- **NFR-SEC-001**: Extension MUST request minimal permissions (activeTab over *://*/*)
- **NFR-SEC-002**: Extension MUST implement strict CSP (no eval, no inline scripts)
- **NFR-SEC-003**: Content scripts MUST use isolated world (no unsafeWindow)
- **NFR-SEC-004**: All inputs MUST be validated before storage
- **NFR-SEC-005**: URLs MUST be sanitized (block javascript: schemes)
- **NFR-SEC-006**: Storage quota MUST be monitored (prevent DoS)
- **NFR-SEC-007**: Image size MUST be limited (prevent memory exhaustion)
- **NFR-SEC-008**: Export filenames MUST be sanitized (prevent path traversal)
- **NFR-SEC-009**: Error messages MUST NOT expose internal paths
- **NFR-SEC-010**: Phase 2 API MUST only communicate with localhost:3000

### Acceptance Criteria
- [AC-SEC-001] Manifest permissions reviewed and justified
- [AC-SEC-002] CSP violations blocked in testing
- [AC-SEC-003] XSS prevention verified in content scripts
- [AC-SEC-004] Input validation tested with malicious URLs
- [AC-SEC-005] Storage quota handling tested
- [AC-SEC-006] Export filename sanitization verified
```

**Action**: Update `spec.md` with above section (Spec update required)

### 3.2 UI/Design Requirements Integration

**Location in Main Spec**: Add new section "UI/Design Requirements" after "Assumptions"

**Structure**:
```markdown
## UI/Design Requirements

### Visual Style
- **UI-001**: Dark mode by default
- **UI-002**: Glassmorphism / soft translucency panels
- **UI-003**: Subtle gradients (teal/cyan/electric blue accents)
- **UI-004**: Soft glows + ambient shadows
- **UI-005**: Rounded corners, thin borders
- **UI-006**: Low-contrast grid background
- **UI-007**: Minimal text; strong visual hierarchy

### Layout Requirements
- **UI-008**: Top browser-like header with URL bar and navigation arrows
- **UI-009**: Main content: grid of image cards with floating "Cap!" buttons
- **UI-010**: Right-side floating panel: "CapThat!" title, board grid, action buttons
- **UI-011**: Modular component structure (Header, ImageGrid, ImageCard, CapBoardPanel, ActionButton)

### Interaction Requirements
- **UI-012**: Hover states (subtle glow and/or scale)
- **UI-013**: Button press micro-interactions
- **UI-014**: Smooth transitions (200–300ms)
- **UI-015**: Cards lift slightly on hover

### Accessibility Requirements
- **UI-016**: High contrast text on dark background
- **UI-017**: Keyboard navigable buttons
- **UI-018**: Clean Tailwind class usage (no external UI libraries)
```

**Action**: Update `spec.md` with above section (Spec update required)

### 3.3 Security Checklist Linkage

**Location**: `checklists/security.md` (already exists)

**Action**: Keep detailed threat model and testing checklist in `security.md` (Checklist-only)

**Integration Points**:
- Main spec references security checklist for detailed testing
- Implementation plan references security checklist for validation checkpoints
- Code reviews use security checklist as validation guide

---

## 4. Milestones

### MVP v1 (Must-Have Features)

**Target**: Production-ready MVP with core functionality

**Features**:
- ✅ Chrome Extension loads in Chrome
- ✅ Side panel UI with futuristic dark theme
- ✅ Image detection and "Cap!" button injection
- ✅ Image capture (URL + metadata)
- ✅ Board persistence (chrome.storage.local + IndexedDB)
- ✅ Board grid with empty state placeholders
- ✅ 80/100 item limit enforcement
- ✅ Export JSON
- ✅ Export ZIP (with JSZip)
- ✅ Toast notifications (success/error with retry)
- ✅ Strict CSP and minimal permissions
- ✅ Input validation (URLs, metadata, timestamps)
- ✅ Filename sanitization for exports
- ✅ Error handling (no internal path exposure)

**Success Criteria**:
- Extension loads without errors
- Captures appear in board within 2 seconds
- Board persists across browser restarts
- Exports generate valid files
- No CSP violations
- No XSS vulnerabilities

### v1.5 (Improved Robustness)

**Target**: Enhanced reliability and security

**Features**:
- ✅ MIME type validation for images
- ✅ Image size limits (10MB per image, 10MP dimensions)
- ✅ SHA-256 content hashing for duplicate detection
- ✅ Better capture/dedupe messaging
- ✅ Export hardening (ZIP size limits, file count limits)
- ✅ Storage quota monitoring and warnings
- ✅ Improved error messages (user-friendly)
- ✅ Performance optimization (virtual scrolling for 100 items)

**Success Criteria**:
- Handles oversized images gracefully
- Duplicate detection works reliably
- Exports complete for boards up to 100 items
- Storage quota warnings appear at 80% usage

### v2 (Phase 2 - Optional)

**Target**: Local Next.js integration

**Features**:
- ✅ Next.js API endpoint (`POST /api/capture`)
- ✅ Extension → Next.js communication (localhost:3000 only)
- ✅ Fallback to extension storage when API unavailable
- ✅ Board view in Next.js app
- ✅ Optional tab capture fallback for CORS-blocked images

**Success Criteria**:
- Extension successfully posts to local API when available
- Graceful fallback when API unavailable
- Board view displays captured items
- Tab capture works for CORS-blocked images

---

## 5. Step-by-Step Implementation Plan

### Phase 0: Setup & Build Pipeline

**Tasks**:
1. **Setup Extension Build**
   - Initialize TypeScript config for extension
   - Configure bundler (Vite or esbuild)
   - Create manifest.json with minimal permissions
   - Setup CSP in manifest
   - Test extension loads in Chrome

2. **Setup Next.js Build** (Phase 2 prep)
   - Verify Next.js setup (already exists)
   - Configure TypeScript paths for shared code
   - Test build pipeline

3. **Setup Shared Code Structure**
   - Create `shared/` directory
   - Configure TypeScript project references
   - Setup validation utilities

**Deliverables**:
- Extension loads in Chrome
- Build scripts work
- TypeScript compiles without errors

### Phase 1: Core UI Components

**Tasks**:
1. **Design System Setup**
   - Configure Tailwind for dark mode
   - Define color palette (teal/cyan/electric blue)
   - Create utility classes for glassmorphism
   - Define typography scale

2. **Build Base Components**
   - `Header.tsx`: Browser-like header with URL bar
   - `ActionButton.tsx`: Reusable button with hover/active states
   - `ImageCard.tsx`: Image card with "Cap!" button overlay
   - `ImageGrid.tsx`: Grid layout with empty state
   - `CapBoardPanel.tsx`: Right-side panel with board grid and actions

3. **Implement Side Panel**
   - Create `side-panel.html`
   - Integrate React components
   - Setup Tailwind styles
   - Test responsive layout

**Deliverables**:
- All UI components render correctly
- Dark theme with glassmorphism effects
- Hover states and transitions work
- Side panel opens and displays correctly

### Phase 2: Content Script & Image Detection

**Tasks**:
1. **Content Script Implementation**
   - Create `content-script.ts`
   - Implement image detection (querySelector for `<img>`)
   - Inject "Cap!" buttons (with isolation)
   - Setup message passing to service worker

2. **Security Hardening**
   - Verify isolated world (no unsafeWindow)
   - Sanitize DOM manipulation
   - Validate message shapes
   - Test XSS prevention

3. **Image Detection Logic**
   - Filter valid image sources (http/https/data)
   - Handle lazy-loaded images
   - Handle background images (optional)
   - Handle SVG images (optional)

**Deliverables**:
- Content script injects without breaking pages
- "Cap!" buttons appear on images
- No console errors on common websites
- XSS prevention verified

### Phase 3: Message Contracts & Validation

**Tasks**:
1. **Define Message Types**
   - Create TypeScript interfaces for messages
   - Define capture request/response
   - Define storage update messages
   - Define export request messages

2. **Implement Schema Validation**
   - Create `schema-validator.ts`
   - Validate URLs (block javascript:)
   - Validate metadata structure
   - Validate timestamps

3. **Implement Message Handlers**
   - Service worker message router
   - Content script message sender
   - Validation at boundaries

**Deliverables**:
- Message contracts defined
- Validation prevents invalid data
- Messages pass between contexts securely

### Phase 4: Storage Layer

**Tasks**:
1. **Storage Adapters**
   - Implement `storage-adapter.ts` (chrome.storage.local)
   - Implement `indexeddb-adapter.ts` (for blobs)
   - Create storage interface/abstraction

2. **Data Models**
   - Define `CapturedItem` type
   - Define `CapBoard` type
   - Implement serialization/deserialization

3. **Storage Operations**
   - Save captured item
   - Load board on panel open
   - Remove item
   - Clear board
   - Quota monitoring

4. **Limit Enforcement**
   - Check board size before capture
   - Show warning at 80 items
   - Block capture at 100 items
   - Update UI accordingly

**Deliverables**:
- Storage operations work correctly
- Board persists across restarts
- 80/100 limit enforced
- Quota monitoring active

### Phase 5: Image Capture Logic

**Tasks**:
1. **Capture Strategy**
   - Implement URL capture (primary)
   - Implement blob fetch (best-effort)
   - Handle CORS failures gracefully
   - Store fallback indicator

2. **Image Validation**
   - Validate image URLs
   - Validate MIME types (v1.5)
   - Validate image size (v1.5)
   - Handle corrupted images

3. **Duplicate Detection**
   - Implement URL-based duplicate check (v1)
   - Implement content hash (SHA-256) (v1.5)
   - Show appropriate messages

4. **Thumbnail Generation**
   - Generate thumbnails for grid
   - Store thumbnail data
   - Handle thumbnail failures

**Deliverables**:
- Images capture successfully
- CORS failures handled gracefully
- Duplicates detected (URL-based in v1)
- Thumbnails display in grid

### Phase 6: Board UI & Interactions

**Tasks**:
1. **Grid Implementation**
   - Render captured items as thumbnails
   - Implement empty state placeholders
   - Implement infinite scroll (virtual scrolling)
   - Handle grid updates on capture/remove

2. **Remove Functionality**
   - Add remove button to items
   - Implement remove handler
   - Update storage
   - Update UI

3. **Clear Board**
   - Implement clear button
   - Add confirmation modal
   - Clear storage
   - Reset UI

**Deliverables**:
- Grid displays captured items
- Empty states show correctly
- Remove works for individual items
- Clear board works with confirmation

### Phase 7: Export Functionality

**Tasks**:
1. **JSON Export**
   - Generate JSON manifest
   - Include all metadata
   - Validate JSON structure
   - Download via chrome.downloads API

2. **Individual Image Export**
   - Fetch images (handle CORS)
   - Generate unique filenames
   - Sanitize filenames
   - Download multiple files

3. **ZIP Export**
   - Install JSZip dependency
   - Create ZIP structure
   - Add images folder
   - Add board.json manifest
   - Implement size limits
   - Download ZIP

4. **Export Security**
   - Filename sanitization
   - JSON validation
   - ZIP size limits
   - File count limits

**Deliverables**:
- JSON export generates valid files
- Individual images export correctly
- ZIP export works for boards up to 50 items (v1), 100 items (v1.5)
- Filenames are sanitized

### Phase 8: Error Handling & Toasts

**Tasks**:
1. **Toast System**
   - Create toast component
   - Implement toast queue
   - Show success/error messages
   - Add retry button for errors

2. **Error Categories**
   - Permission errors
   - CORS errors
   - Storage errors
   - Export errors

3. **User-Friendly Messages**
   - Map errors to user messages
   - Hide internal paths
   - Provide actionable guidance
   - Log detailed errors (extension logs only)

**Deliverables**:
- Toasts appear for all actions
- Error messages are user-friendly
- Retry functionality works
- No internal paths exposed

### Phase 9: Phase 2 - Local API Integration (Optional)

**Tasks**:
1. **Next.js API Endpoint**
   - Create `POST /api/capture` route
   - Validate payload structure
   - Store in local database (or file system)
   - Return success/error response

2. **Extension → API Communication**
   - Detect localhost:3000 availability
   - Post capture payload
   - Handle timeouts
   - Fallback to extension storage

3. **Board View in Next.js**
   - Create `/board` page
   - Display captured items
   - Sync with extension (optional)

**Deliverables**:
- API endpoint accepts captures
- Extension posts to API when available
- Fallback works when API unavailable
- Board view displays items

---

## 6. Risks & Mitigations

### 6.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **CORS limitations prevent image capture** | High | High | Start with URL capture; document CORS limitations; implement tab capture fallback (v2) |
| **Storage quota exceeded** | Medium | Medium | Monitor quota; enforce 100-item limit; show warnings at 80% usage; handle errors gracefully |
| **Performance degradation with 100 items** | Medium | Low | Implement virtual scrolling; optimize thumbnail rendering; lazy load images |
| **XSS via metadata/DOM** | High | Low | Validate all inputs; sanitize user-visible strings; use isolated world; test XSS prevention |
| **Over-broad permissions** | Medium | Low | Use activeTab instead of *://*/*; document permission rationale; review in security checklist |
| **Export path traversal / ZIP bombs** | High | Low | Sanitize filenames; limit ZIP size; limit file count; validate JSON structure |
| **Memory exhaustion from large images** | Medium | Medium | Implement size limits (10MB, 10MP); reject/resize oversized images; handle gracefully |
| **Content script conflicts with page** | Low | Medium | Use isolated world; minimal DOM manipulation; test on common websites |

### 6.2 Security Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **XSS in content script** | High | Low | Isolated world; validate messages; sanitize DOM; test XSS prevention |
| **Storage DoS attack** | Medium | Low | Enforce 100-item limit; monitor quota; validate inputs; handle errors |
| **Malicious image URLs** | Medium | Low | Validate URLs (block javascript:); validate MIME types; handle corrupted images |
| **CSP violations** | Medium | Low | Strict CSP; test violations; no eval/inline scripts |
| **Localhost API SSRF** (Phase 2) | Low | Low | Validate localhost origin only; timeout requests; validate responses |

### 6.3 Product Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **UI doesn't match design vision** | Medium | Medium | Create design system early; iterate on components; test with users |
| **Extension breaks on some websites** | Medium | Medium | Test on common websites; handle errors gracefully; document limitations |
| **Export fails for large boards** | Low | Low | Implement size limits; test with 50+ items; optimize ZIP generation |

---

## 7. Acceptance Criteria Highlights

### Core Functionality
- [ ] Extension loads in Chrome without errors
- [ ] Side panel opens and displays UI correctly
- [ ] Images are detected and "Cap!" buttons appear
- [ ] Capture adds item to board within 2 seconds
- [ ] Board persists across browser restarts
- [ ] 80/100 limit enforced with warnings

### Security
- [ ] Minimal permissions requested (activeTab, storage, scripting)
- [ ] CSP violations blocked
- [ ] XSS prevention verified
- [ ] Input validation tested (malicious URLs)
- [ ] Filename sanitization verified
- [ ] No internal paths in error messages

### UI/Design
- [ ] Dark mode with glassmorphism effects
- [ ] Hover states and transitions work
- [ ] Grid displays items correctly
- [ ] Empty states show placeholders
- [ ] Toasts appear for actions

### Export
- [ ] JSON export generates valid files
- [ ] Individual images export correctly
- [ ] ZIP export works for 50+ items
- [ ] CORS-blocked images handled gracefully

---

## 8. Next Steps

1. **Update Main Spec**: Add Security Requirements and UI/Design Requirements sections
2. **Create Initial UI Components**: Build JSX components with Tailwind (see separate deliverable)
3. **Setup Build Pipeline**: Configure extension build system
4. **Begin Phase 0 Implementation**: Setup and build pipeline

---

## Appendix: Technology Decisions

### Build Tools
- **Extension**: Vite or esbuild (TBD based on complexity)
- **Web**: Next.js (already configured)
- **TypeScript**: Yes (type safety)

### Dependencies
- **JSZip**: For ZIP export
- **Tailwind CSS**: For styling (no external UI libraries)
- **React**: For UI components (extension + web)

### Storage Strategy
- **Metadata**: chrome.storage.local (10MB default quota)
- **Image Blobs**: IndexedDB (larger quota, better for blobs)
- **Fallback**: URL-only storage if blob fetch fails

### Capture Strategy
1. **Primary**: Store image URL + metadata
2. **Best-effort**: Fetch blob (handle CORS gracefully)
3. **Fallback** (v2): Tab capture for CORS-blocked images

---

**End of Implementation Plan**

