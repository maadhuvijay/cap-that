# Data Model: CapThat Chrome Extension

**Feature**: 001-capthat-extension  
**Date**: 2025-01-27  
**Status**: Design Complete

## Core Entities

### CapturedItem

Represents a single image capture with all associated metadata.

**Fields**:
- `id: string` - Unique identifier (UUID v4)
- `imageReference: ImageReference` - Reference to the captured image
- `sourceUrl: string` - URL of the page where image was captured
- `timestamp: number` - Unix timestamp (milliseconds) of capture
- `metadata?: Record<string, unknown>` - Optional metadata (title, domain, product link, etc.)
- `qualityIndicator?: 'url-only' | 'blob' | 'fallback'` - Indicates capture quality/fallback used

**Validation Rules**:
- `id` must be non-empty string
- `sourceUrl` must be valid HTTP/HTTPS URL (validated via URL validator)
- `timestamp` must be positive number
- `metadata` must be serializable JSON object (no circular refs)

**State Transitions**: None (immutable after creation)

### CapBoard

Represents the collection of captured items and board configuration.

**Fields**:
- `items: CapturedItem[]` - Array of captured items (max 100)
- `metadata: BoardMetadata` - Board-level metadata
- `gridConfig: GridConfig` - Grid layout configuration
- `exportHistory?: ExportManifest[]` - Optional history of exports

**Validation Rules**:
- `items.length` must be ≤ 100 (enforced before save)
- `items` array must contain valid CapturedItem objects
- `metadata` must be valid BoardMetadata object

**State Transitions**:
- Empty → Has items (on capture)
- Has items → Empty (on clear)
- Item count 79 → 80 (warning threshold)
- Item count 99 → 100 (hard limit)

### ImageReference

Represents the captured image data (URL or blob).

**Fields**:
- `urlOrBlob: string | BlobReference` - Either image URL string or IndexedDB blob reference
- `thumbnail?: string` - Base64-encoded thumbnail for grid display
- `dimensions?: { width: number; height: number }` - Original image dimensions if available
- `fallbackIndicator?: boolean` - True if lower-quality fallback was used

**Validation Rules**:
- If `urlOrBlob` is string, must be valid HTTP/HTTPS/data URL
- If `urlOrBlob` is BlobReference, must have valid IndexedDB key
- `thumbnail` must be valid base64 string if present
- `dimensions` must have positive width and height if present

**State Transitions**: None (immutable after creation)

### BoardMetadata

Board-level metadata and configuration.

**Fields**:
- `creationDate: number` - Unix timestamp of board creation
- `lastModified: number` - Unix timestamp of last modification
- `version: string` - Board data format version (semantic versioning)

**Validation Rules**:
- `creationDate` must be ≤ `lastModified`
- `version` must be valid semantic version string

### GridConfig

Grid layout configuration.

**Fields**:
- `slots: number` - Number of grid slots (default: 10)
- `columns: number` - Number of columns (default: 5)
- `virtualScrolling: boolean` - Whether virtual scrolling is enabled (default: true)

**Validation Rules**:
- `slots` must be positive integer
- `columns` must be positive integer
- `slots` must be ≥ `columns`

### ExportManifest

Represents exported board data structure.

**Fields**:
- `boardMetadata: BoardMetadata` - Board metadata at export time
- `itemReferences: ExportItemReference[]` - Array of item references with file mappings
- `exportTimestamp: number` - Unix timestamp of export
- `formatVersion: string` - Export format version (semantic versioning)

**Validation Rules**:
- `itemReferences` must be non-empty array
- `formatVersion` must be valid semantic version string
- JSON structure must be valid (no circular refs, valid UTF-8)

### ExportItemReference

Reference to an exported item with file mapping.

**Fields**:
- `itemId: string` - ID of the captured item
- `filename?: string` - Filename in export (if image was exported)
- `imageUrl?: string` - Original image URL (if available)
- `metadata: Record<string, unknown>` - Item metadata

## Message Types (T027)

### Message Base Structure

All messages use discriminated union pattern with `type` field:

```typescript
type Message = 
  | CaptureRequestMessage
  | CaptureResponseMessage
  | StorageUpdateMessage
  | ExportRequestMessage
  | ExportResponseMessage
  | BoardUpdateMessage
  | ErrorMessage;
```

### CaptureRequestMessage

Request from content script to service worker to capture an image.

**Fields**:
- `type: 'CAPTURE_REQUEST'`
- `payload: { imageUrl: string; sourceUrl: string; metadata?: Record<string, unknown> }`

**Validation**:
- `imageUrl` must be valid HTTP/HTTPS/data URL
- `sourceUrl` must be valid HTTP/HTTPS URL
- `metadata` must be serializable JSON object

### CaptureResponseMessage

Response from service worker to content script after capture attempt.

**Fields**:
- `type: 'CAPTURE_RESPONSE'`
- `payload: { success: boolean; itemId?: string; error?: string; errorCategory?: 'permission' | 'cors' | 'storage' | 'validation' }`

**Validation**:
- If `success` is true, `itemId` must be present
- If `success` is false, `error` and `errorCategory` must be present

### StorageUpdateMessage

Notification from service worker to UI about storage changes.

**Fields**:
- `type: 'STORAGE_UPDATE'`
- `payload: { action: 'add' | 'remove' | 'clear' | 'update'; item?: CapturedItem; board?: CapBoard }`

**Validation**:
- If `action` is 'add' or 'update', `item` must be present
- If `action` is 'clear', `board` must be present (empty items array)

### ExportRequestMessage

Request from UI to service worker to export board data.

**Fields**:
- `type: 'EXPORT_REQUEST'`
- `payload: { format: 'json' | 'zip' | 'individual'; options?: ExportOptions }`

**Validation**:
- `format` must be one of the allowed values
- `options` must be valid ExportOptions if present

### ExportResponseMessage

Response from service worker to UI after export attempt.

**Fields**:
- `type: 'EXPORT_RESPONSE'`
- `payload: { success: boolean; filename?: string; error?: string; skippedCount?: number }`

**Validation**:
- If `success` is true, `filename` must be present
- If `success` is false, `error` must be present
- `skippedCount` indicates number of images skipped due to CORS/permissions

### BoardUpdateMessage

Request to update board state (remove item, clear board).

**Fields**:
- `type: 'BOARD_UPDATE'`
- `payload: { action: 'remove' | 'clear'; itemId?: string }`

**Validation**:
- If `action` is 'remove', `itemId` must be present
- If `action` is 'clear', `itemId` must be absent

### ErrorMessage

Generic error message for any operation.

**Fields**:
- `type: 'ERROR'`
- `payload: { message: string; category: 'permission' | 'cors' | 'storage' | 'validation' | 'unknown'; retryable: boolean }`

**Validation**:
- `message` must be non-empty string (user-friendly, no internal paths)
- `category` must be one of the allowed values
- `retryable` indicates if action can be retried

## Relationships

- **CapBoard** contains many **CapturedItem** (1:N)
- **CapturedItem** has one **ImageReference** (1:1)
- **CapBoard** has one **BoardMetadata** (1:1)
- **CapBoard** has one **GridConfig** (1:1)
- **CapBoard** may have many **ExportManifest** (1:N, optional)
- **ExportManifest** references many **CapturedItem** via **ExportItemReference** (1:N)

## Storage Mapping

- **CapBoard** → chrome.storage.local (key: `capBoard`)
- **ImageReference.blob** → IndexedDB (store: `images`, key: blob reference)
- **ExportManifest** → Not stored (generated on export)

## Validation Summary

All entities must pass schema validation before storage:
- URL validation (block javascript:, validate schemes)
- Image validation (MIME types, size limits)
- Schema validation (structure, required fields)
- Storage quota checks (before write operations)

