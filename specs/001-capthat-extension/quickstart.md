# Quickstart: CapThat Message Passing

**Feature**: 001-capthat-extension  
**Date**: 2025-01-27  
**Purpose**: Quick reference for implementing message passing in CapThat extension

## Overview

CapThat uses Chrome Extension message passing (`chrome.runtime.sendMessage` / `chrome.runtime.onMessage`) for communication between:
- Content Script ↔ Service Worker
- UI (Side Panel) ↔ Service Worker

All messages are type-safe TypeScript interfaces defined in `contracts/messages.ts`.

## Message Types

### 1. Capture Request (Content Script → Service Worker)

**When**: User clicks "Cap!" button on an image

```typescript
import type { CaptureRequestMessage } from '../types/messages';

// In content script
chrome.runtime.sendMessage<CaptureRequestMessage>({
  type: 'CAPTURE_REQUEST',
  payload: {
    imageUrl: 'https://example.com/image.jpg',
    sourceUrl: 'https://example.com',
    metadata: {
      title: 'Example Image',
      domain: 'example.com',
    },
  }
}, (response) => {
  // Handle response (CaptureResponseMessage)
  if (response?.success) {
    console.log('Image captured:', response.itemId);
  } else {
    console.error('Capture failed:', response?.error);
  }
});
```

### 2. Capture Response (Service Worker → Content Script)

**When**: Service worker completes capture attempt

```typescript
import type { CaptureResponseMessage } from '../types/messages';

// In service worker
function handleCaptureRequest(msg: CaptureRequestMessage, sendResponse: (response: CaptureResponseMessage) => void) {
  try {
    // Perform capture logic...
    const itemId = 'generated-uuid';
    
    sendResponse({
      type: 'CAPTURE_RESPONSE',
      payload: {
        success: true,
        itemId: itemId,
      },
    });
  } catch (error) {
    sendResponse({
      type: 'CAPTURE_RESPONSE',
      payload: {
        success: false,
        error: 'Failed to capture image',
        errorCategory: 'storage',
      },
    });
  }
}
```

### 3. Storage Update (Service Worker → UI)

**When**: Board state changes (item added/removed/cleared)

```typescript
import type { StorageUpdateMessage } from '../types/messages';

// In service worker (after saving item)
function notifyUIUpdate(item: CapturedItem) {
  chrome.runtime.sendMessage<StorageUpdateMessage>({
    type: 'STORAGE_UPDATE',
    payload: {
      action: 'add',
      item: item,
    },
  });
}

// In UI (side panel)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'STORAGE_UPDATE') {
    const update = msg as StorageUpdateMessage;
    if (update.payload.action === 'add' && update.payload.item) {
      // Update UI with new item
      addItemToGrid(update.payload.item);
    }
  }
});
```

### 4. Export Request (UI → Service Worker)

**When**: User clicks export button (Export JSON, Export CapBoard, Export Individual Caps)

```typescript
import type { ExportRequestMessage } from '../types/messages';

// In UI (side panel)
function handleExportClick(format: 'json' | 'zip' | 'individual') {
  chrome.runtime.sendMessage<ExportRequestMessage>({
    type: 'EXPORT_REQUEST',
    payload: {
      format: format,
      options: {
        includeThumbnails: false,
        maxSizeBytes: 100 * 1024 * 1024, // 100MB
      },
    }
  }, (response) => {
    // Handle response (ExportResponseMessage)
    if (response?.success) {
      showToast(`Exported: ${response.filename}`);
    } else {
      showError(`Export failed: ${response?.error}`);
    }
  });
}
```

### 5. Board Update (UI → Service Worker)

**When**: User removes item or clears board

```typescript
import type { BoardUpdateMessage } from '../types/messages';

// In UI (side panel)
function removeItem(itemId: string) {
  chrome.runtime.sendMessage<BoardUpdateMessage>({
    type: 'BOARD_UPDATE',
    payload: {
      action: 'remove',
      itemId: itemId,
    }
  }, (response) => {
    if (response?.success) {
      // Item removed, UI will receive STORAGE_UPDATE message
    }
  });
}

function clearBoard() {
  if (confirm('Clear all items?')) {
    chrome.runtime.sendMessage<BoardUpdateMessage>({
      type: 'BOARD_UPDATE',
      payload: {
        action: 'clear',
      }
    });
  }
}
```

## Service Worker Message Handler

Complete example of service worker message routing:

```typescript
import type { Message } from '../types/messages';
import { 
  isValidMessage,
  isCaptureRequestMessage,
  isExportRequestMessage,
  isBoardUpdateMessage,
} from '../types/messages';

chrome.runtime.onMessage.addListener((msg: unknown, sender, sendResponse) => {
  // Validate message structure
  if (!isValidMessage(msg)) {
    sendResponse({
      type: 'ERROR',
      payload: {
        message: 'Invalid message format',
        category: 'validation',
        retryable: false,
      },
    });
    return true; // Keep channel open for async response
  }

  // Route message by type
  if (isCaptureRequestMessage(msg)) {
    handleCaptureRequest(msg, sendResponse);
  } else if (isExportRequestMessage(msg)) {
    handleExportRequest(msg, sendResponse);
  } else if (isBoardUpdateMessage(msg)) {
    handleBoardUpdate(msg, sendResponse);
  } else {
    sendResponse({
      type: 'ERROR',
      payload: {
        message: 'Unknown message type',
        category: 'validation',
        retryable: false,
      },
    });
  }

  return true; // Keep channel open for async response
});
```

## Content Script Message Handler

Example of content script receiving messages:

```typescript
import type { Message } from '../types/messages';
import { isCaptureResponseMessage, isErrorMessage } from '../types/messages';

chrome.runtime.onMessage.addListener((msg: Message) => {
  if (isCaptureResponseMessage(msg)) {
    if (msg.payload.success) {
      // Show success feedback
      showToast('Image captured!');
    } else {
      // Show error feedback
      showError(msg.payload.error || 'Capture failed');
    }
  } else if (isErrorMessage(msg)) {
    // Handle generic error
    showError(msg.payload.message);
  }
  
  return true;
});
```

## Error Handling

All messages should handle errors gracefully:

```typescript
// In content script
chrome.runtime.sendMessage(message, (response) => {
  if (chrome.runtime.lastError) {
    // Handle Chrome API error
    console.error('Message error:', chrome.runtime.lastError.message);
    showError('Failed to communicate with extension');
    return;
  }
  
  // Handle response
  if (response?.type === 'ERROR') {
    const error = response as ErrorMessage;
    showError(error.payload.message);
    if (error.payload.retryable) {
      // Show retry button
    }
  }
});
```

## Type Safety

Always use TypeScript types for messages:

```typescript
import type { 
  Message,
  CaptureRequestMessage,
  CaptureResponseMessage 
} from '../types/messages';

// Type-safe message sending
function sendCaptureRequest(imageUrl: string, sourceUrl: string) {
  const message: CaptureRequestMessage = {
    type: 'CAPTURE_REQUEST',
    payload: {
      imageUrl,
      sourceUrl,
    },
  };
  
  chrome.runtime.sendMessage(message, (response: CaptureResponseMessage) => {
    // TypeScript knows response structure
    if (response.payload.success) {
      console.log('Item ID:', response.payload.itemId);
    }
  });
}
```

## Testing

Test message passing in Chrome DevTools:

```javascript
// In content script console
chrome.runtime.sendMessage({
  type: 'CAPTURE_REQUEST',
  payload: {
    imageUrl: 'https://example.com/test.jpg',
    sourceUrl: 'https://example.com',
  }
}, (response) => {
  console.log('Response:', response);
});

// In service worker console
chrome.runtime.onMessage.addListener((msg) => {
  console.log('Received:', msg);
});
```

## Next Steps

1. Implement message handlers in `extension/background/service-worker.ts`
2. Implement message senders in `extension/content/content-script.ts`
3. Implement message handlers in `extension/ui/side-panel.tsx`
4. Add message validation using `isValidMessage()` at all boundaries
5. Test message flow end-to-end

## References

- Message Type Definitions: `contracts/messages.ts`
- Data Model: `data-model.md`
- Chrome Extension Messaging: https://developer.chrome.com/docs/extensions/mv3/messaging/

