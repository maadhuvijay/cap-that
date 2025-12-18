# API Contracts: CapThat Next.js Integration (Phase 2)

**Feature**: 001-capthat-extension  
**Date**: 2025-01-27  
**Status**: Phase 2 (Optional)

## Overview

This document defines the REST API contract for the Phase 2 Next.js application integration. The extension can send captured items to a local Next.js app running on `http://localhost:3000`.

**Important**: This API is optional Phase 2 functionality. The extension must gracefully fall back to extension-only storage when the local app is not running.

## Base URL

```
http://localhost:3000
```

**Security**: The extension MUST validate that requests are only sent to `http://localhost:3000`. Any other origin must be rejected.

## Endpoints

### POST /api/capture

Receives captured items from the Chrome Extension.

**Request**:

```http
POST /api/capture HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Origin: chrome-extension://<extension-id>
```

**Request Body**:

```typescript
interface CapturePayload {
  itemId: string;                    // UUID v4
  imageReference: {
    urlOrBlob: string;               // Image URL or blob reference
    thumbnail?: string;              // Base64-encoded thumbnail
    dimensions?: {
      width: number;
      height: number;
    };
    fallbackIndicator?: boolean;
  };
  sourceUrl: string;                 // URL of source page
  timestamp: number;                 // Unix timestamp (milliseconds)
  metadata?: Record<string, unknown>; // Optional metadata
  qualityIndicator?: 'url-only' | 'blob' | 'fallback';
}
```

**Example Request**:

```json
{
  "itemId": "550e8400-e29b-41d4-a716-446655440000",
  "imageReference": {
    "urlOrBlob": "https://example.com/image.jpg",
    "thumbnail": "data:image/jpeg;base64,/9j/4AAQ...",
    "dimensions": {
      "width": 1920,
      "height": 1080
    },
    "fallbackIndicator": false
  },
  "sourceUrl": "https://example.com/page",
  "timestamp": 1706356800000,
  "metadata": {
    "title": "Example Image",
    "domain": "example.com"
  },
  "qualityIndicator": "blob"
}
```

**Response - Success (200 OK)**:

```json
{
  "success": true,
  "itemId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Item captured successfully"
}
```

**Response - Error (400 Bad Request)**:

```json
{
  "success": false,
  "error": "Invalid payload: missing required field 'itemId'",
  "code": "VALIDATION_ERROR"
}
```

**Response - Error (500 Internal Server Error)**:

```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

**Status Codes**:
- `200 OK`: Item captured successfully
- `400 Bad Request`: Invalid payload (validation error)
- `500 Internal Server Error`: Server error

**Validation Rules**:
- `itemId` must be non-empty string (UUID format recommended)
- `sourceUrl` must be valid HTTP/HTTPS URL
- `timestamp` must be positive number
- `imageReference.urlOrBlob` must be non-empty string
- `metadata` must be serializable JSON object (no circular refs)

## Error Handling

The extension MUST handle the following scenarios:

1. **Local app not running**: Fall back to extension-only storage
2. **Network error**: Fall back to extension-only storage, show user-friendly error
3. **Validation error (400)**: Log error, fall back to extension-only storage
4. **Server error (500)**: Log error, fall back to extension-only storage

The extension should NOT block user actions if the API is unavailable.

## Security

### Origin Validation

The extension MUST validate the origin before sending requests:

```typescript
const ALLOWED_ORIGIN = 'http://localhost:3000';

function isValidOrigin(url: string): boolean {
  try {
    const origin = new URL(url).origin;
    return origin === ALLOWED_ORIGIN;
  } catch {
    return false;
  }
}
```

### CORS

The Next.js API MUST handle CORS for Chrome Extension origins:

```typescript
// Next.js API route example
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  
  // Validate origin is Chrome Extension
  if (origin && origin.startsWith('chrome-extension://')) {
    // Handle request
  } else {
    return new Response('Forbidden', { status: 403 });
  }
}
```

## Fallback Behavior

When the local app is not available:

1. Extension continues to function normally
2. All data stored in extension storage (chrome.storage.local + IndexedDB)
3. User sees "Local app not detected" message (optional, non-blocking)
4. No user-facing errors - extension works independently

## Implementation Notes

- This API is optional Phase 2 functionality (User Story 14)
- Extension must detect if local app is running before attempting requests
- Extension should gracefully degrade if API is unavailable
- All validation must occur on both client (extension) and server (Next.js)
- API should return user-friendly error messages (no internal paths)

## Related Documentation

- Functional Requirements: See `spec.md` FR-046, FR-047, FR-048
- Data Model: See `data-model.md` for entity definitions
- Message Contracts: See `contracts/message-contracts.md` for extension messaging


