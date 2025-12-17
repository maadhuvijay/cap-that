# Implementation Plan: CapThat Chrome Extension

**Branch**: `001-capthat-extension` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-capthat-extension/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

CapThat is a Chrome Extension (MV3) for capturing and organizing images into a mood board. The extension uses content scripts to detect images, a service worker for background processing, and a side panel UI for board management. Core functionality includes image capture with CORS fallback, board persistence using chrome.storage.local and IndexedDB, and export capabilities (JSON and ZIP). The implementation uses TypeScript, React, and Tailwind CSS with a strict security model.

## Technical Context

**Language/Version**: TypeScript 5.x, JavaScript (ES2020+)  
**Primary Dependencies**: 
- Chrome Extension APIs (chrome.storage, chrome.runtime, chrome.scripting, chrome.sidePanel)
- React 19.2.1 for UI components
- Tailwind CSS 4.x for styling
- JSZip for ZIP export functionality
- Vite 5.4.0 for extension bundling
- Next.js 16.0.10 for Phase 2 web app integration

**Storage**: 
- chrome.storage.local for board metadata (10MB default quota)
- IndexedDB for image blob storage (larger quota, better for binary data)
- Fallback to URL-only storage if blob fetch fails

**Testing**: Manual testing in Chrome via "Load unpacked" extension. Unit tests are optional per project requirements.  
**Target Platform**: Chrome Browser (Manifest V3), Desktop (1024px+ width assumed)  
**Project Type**: Extension + Web (hybrid - extension at root, Next.js app in app/ directory)  
**Performance Goals**: 
- Capture appears in board within 2 seconds
- Panel opens within 1 second
- Export completes for boards up to 50 items (v1), 100 items (v1.5)
- Virtual scrolling handles 100+ items smoothly

**Constraints**: 
- Strict CSP (no eval, no inline scripts)
- Minimal permissions (activeTab over *://*/*)
- 100 item board limit (hard limit, warning at 80)
- 10MB per image size limit, 10MP dimension limit
- CORS limitations require fallback strategies
- Storage quota monitoring required

**Scale/Scope**: 
- Single user, local-first extension
- Up to 100 captured items per board
- Export support for boards up to 50 items (v1), 100 items (v1.5)
- Works on common websites (e-commerce, social media, content sites)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Clarity & Readability**: 
- [x] All code uses descriptive names and clear structure
- [x] No cryptic or overly clever implementations

**Simplicity First**: 
- [x] Chosen approach is the simplest that solves the problem
- [x] Any complexity is justified and documented

**Regular Comments**: 
- [x] Plan includes comment strategy for complex logic
- [x] Framework-specific patterns will be explained for newcomers

**File Organization**: 
- [x] File structure avoids excessive file splitting
- [x] Related functionality consolidated where possible
- [x] File separation only where clearly beneficial

**Violations**: None identified. Message types will be consolidated in a single `messages.ts` file per Constitution principle IV.

## Project Structure

### Documentation (this feature)

```text
specs/001-capthat-extension/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
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
│       ├── index.ts                    # TypeScript types (CapturedItem, CapBoard, etc.)
│       └── messages.ts                 # Message type definitions (T027)
│
├── app/                                # Next.js App (Phase 2)
│   ├── api/
│   │   └── capture/
│   │       └── route.ts                # POST /api/capture
│   ├── board/
│   │   └── page.tsx                    # Board view page
│   └── layout.tsx                      # Root layout
│
├── shared/                             # Shared code
│   ├── types/
│   │   └── index.ts                    # Shared TypeScript types
│   ├── validators/
│   │   └── url.ts                      # URL validation
│   └── storage/
│       └── adapters.ts                 # Storage interface
│
└── specs/
    └── 001-capthat-extension/
        ├── spec.md                     # Main feature spec
        ├── plan.md                     # This document
        └── checklists/
            ├── requirements.md
            └── security.md
```

**Structure Decision**: Hybrid structure with extension at root, Next.js app in `app/` directory, and shared code in `shared/` directory. This follows the existing project layout and allows code sharing between extension and web app.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. Message types will be consolidated in a single file per Constitution principle IV.

