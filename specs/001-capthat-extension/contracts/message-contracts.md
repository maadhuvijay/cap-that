# Message Contracts: CapThat Chrome Extension

**Feature**: 001-capthat-extension  
**Date**: 2025-01-27  
**Status**: Design Complete

## Overview

This document defines the message contracts for internal communication within the Chrome Extension. Messages flow between:
- Content Script ↔ Service Worker
- UI (Side Panel) ↔ Service Worker
- Service Worker ↔ Storage Layer

All messages use the `chrome.runtime.sendMessage` API with TypeScript discriminated union pattern for type safety.

## Message Type Definitions

All messages extend a base structure with a `type` discriminator field:

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

## Request-Response Contracts

### Capture Request/Response

**Request**: `CaptureRequestMessage`
- **From**: Content Script
- **To**: Service Worker
- **Purpose**: Request capture of an image from the current page

```typescript
interface CaptureRequestMessage {
  type: 'CAPTURE_REQUEST';
  payload: {
    imageUrl: string;           // HTTP/HTTPS/data URL of image to capture
    sourceUrl: string;          // URL of page where image was found
    metadata?: Record<string, unknown>;  // Optional metadata (title, domain, etc.)
  };
}
```

**Validation Rules**:
- `imageUrl` must be valid HTTP/HTTPS/data URL (validated via URL validator)
- `sourceUrl` must be valid HTTP/HTTPS URL
- `metadata` must be serializable JSON object (no circular refs)

**Response**: `CaptureResponseMessage`
- **From**: Service Worker
- **To**: Content Script
- **Purpose**: Indicate capture success or failure

```typescript
interface CaptureResponseMessage {
  type: 'CAPTURE_RESPONSE';
  payload: {
    success: boolean;
    itemId?: string;            // Present if success=true
    error?: string;             // Present if success=false (user-friendly message)
    errorCategory?: 'permission' | 'cors' | 'storage' | 'validation';
  };
}
```

**Validation Rules**:
- If `success` is true, `itemId` must be present
- If `success` is false, `error` and `errorCategory` must be present
- Error messages must be user-friendly (no internal paths exposed)

### Export Request/Response

**Request**: `ExportRequestMessage`
- **From**: UI (Side Panel)
- **To**: Service Worker
- **Purpose**: Request export of board data

```typescript
interface ExportRequestMessage {
  type: 'EXPORT_REQUEST';
  payload: {
    format: 'json' | 'zip' | 'individual';
    options?: {
      includeMetadata?: boolean;  // Include full metadata in export
      sanitizeFilenames?: boolean; // Sanitize filenames (default: true)
    };
  };
}
```

**Validation Rules**:
- `format` must be one of: 'json', 'zip', 'individual'
- `options` must be valid ExportOptions if present

**Response**: `ExportResponseMessage`
- **From**: Service Worker
- **To**: UI (Side Panel)
- **Purpose**: Indicate export completion

```typescript
interface ExportResponseMessage {
  type: 'EXPORT_RESPONSE';
  payload: {
    success: boolean;
    filename?: string;          // Present if success=true (downloaded filename)
    error?: string;             // Present if success=false
    skippedCount?: number;      // Number of images skipped due to CORS/permissions
  };
}
```

**Validation Rules**:
- If `success` is true, `filename` must be present
- If `success` is false, `error` must be present
- `skippedCount` indicates number of images skipped due to CORS/permissions

### Board Update Request

**Request**: `BoardUpdateMessage`
- **From**: UI (Side Panel)
- **To**: Service Worker
- **Purpose**: Request board state changes (remove item, clear board)

```typescript
interface BoardUpdateMessage {
  type: 'BOARD_UPDATE';
  payload: {
    action: 'remove' | 'clear';
    itemId?: string;            // Required if action='remove'
  };
}
```

**Validation Rules**:
- If `action` is 'remove', `itemId` must be present and non-empty
- If `action` is 'clear', `itemId` must be absent

**Response**: `StorageUpdateMessage` (see below)

## Broadcast Contracts

### Storage Update

**Message**: `StorageUpdateMessage`
- **From**: Service Worker
- **To**: UI (Side Panel) - broadcast
- **Purpose**: Notify UI of storage changes

```typescript
interface StorageUpdateMessage {
  type: 'STORAGE_UPDATE';
  payload: {
    action: 'add' | 'remove' | 'clear' | 'update';
    item?: CapturedItem;        // Present if action='add' or 'update'
    board?: CapBoard;           // Present if action='clear' or full board update
  };
}
```

**Validation Rules**:
- If `action` is 'add' or 'update', `item` must be present
- If `action` is 'clear', `board` must be present (with empty items array)
- If `action` is 'remove', `item` must be present (for removal confirmation)

### Error Message

**Message**: `ErrorMessage`
- **From**: Service Worker
- **To**: Any component (broadcast)
- **Purpose**: Report errors that require user notification

```typescript
interface ErrorMessage {
  type: 'ERROR';
  payload: {
    message: string;            // User-friendly error message
    category: 'permission' | 'cors' | 'storage' | 'validation' | 'unknown';
    retryable: boolean;         // Whether action can be retried
  };
}
```

**Validation Rules**:
- `message` must be non-empty string (user-friendly, no internal paths)
- `category` must be one of the allowed values
- `retryable` indicates if action can be retried via retry button

## Message Validation

All messages must be validated at the service worker boundary (T028):

1. **Shape Validation**: Verify message has required `type` field
2. **Type Validation**: Verify `type` matches known message types
3. **Payload Validation**: Verify payload structure matches message type
4. **Content Validation**: Validate payload content (URLs, IDs, etc.)

Invalid messages should be rejected with an `ErrorMessage` response.

## Usage Examples

### Capture Flow

```typescript
// Content Script → Service Worker
chrome.runtime.sendMessage({
  type: 'CAPTURE_REQUEST',
  payload: {
    imageUrl: 'https://example.com/image.jpg',
    sourceUrl: 'https://example.com/page',
    metadata: { title: 'Example Image' }
  }
}, (response: CaptureResponseMessage) => {
  if (response.payload.success) {
    console.log('Captured:', response.payload.itemId);
  } else {
    console.error('Capture failed:', response.payload.error);
  }
});
```

### Export Flow

```typescript
// UI → Service Worker
chrome.runtime.sendMessage({
  type: 'EXPORT_REQUEST',
  payload: {
    format: 'zip',
    options: { includeMetadata: true }
  }
}, (response: ExportResponseMessage) => {
  if (response.payload.success) {
    console.log('Exported:', response.payload.filename);
  } else {
    console.error('Export failed:', response.payload.error);
  }
});
```

### Storage Update Listener

```typescript
// UI listens for storage updates
chrome.runtime.onMessage.addListener((message: StorageUpdateMessage) => {
  if (message.type === 'STORAGE_UPDATE') {
    if (message.payload.action === 'add') {
      // Add item to UI
      addItemToGrid(message.payload.item!);
    } else if (message.payload.action === 'clear') {
      // Clear UI grid
      clearGrid();
    }
  }
});
```

## Implementation Notes

- All messages use TypeScript interfaces for type safety
- Message validation occurs in `extension/background/service-worker.ts` (T028)
- Messages are validated before processing to prevent invalid data
- Error messages are always user-friendly and never expose internal paths
- Retryable errors include a retry mechanism in the UI

## Related Documentation

- Data Model: See `data-model.md` for entity definitions
- Implementation: See `tasks.md` for task T027 (message types) and T028 (message validation)

