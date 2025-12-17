# Message Contracts

This directory contains message type definitions for the CapThat Chrome Extension.

## Files

- **messages.ts** - TypeScript definitions for all message types used in the extension

## Message Flow

### Content Script → Service Worker
- `CAPTURE_REQUEST` - Request to capture an image

### Service Worker → Content Script
- `CAPTURE_RESPONSE` - Response to capture request
- `ERROR` - Error notification

### UI → Service Worker
- `EXPORT_REQUEST` - Request to export board data
- `BOARD_UPDATE` - Request to remove item or clear board

### Service Worker → UI
- `STORAGE_UPDATE` - Notification of board state changes
- `EXPORT_RESPONSE` - Response to export request
- `ERROR` - Error notification

## Usage

Import message types in your code:

```typescript
import type { 
  Message, 
  CaptureRequestMessage,
  CaptureResponseMessage 
} from './contracts/messages';

// Send message
chrome.runtime.sendMessage<CaptureRequestMessage>({
  type: 'CAPTURE_REQUEST',
  payload: {
    imageUrl: 'https://example.com/image.jpg',
    sourceUrl: 'https://example.com',
  }
});

// Handle message
chrome.runtime.onMessage.addListener((msg: Message) => {
  if (msg.type === 'CAPTURE_RESPONSE') {
    // Handle response
  }
});
```

## Validation

All messages should be validated using `isValidMessage()` before processing:

```typescript
import { isValidMessage } from './contracts/messages';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!isValidMessage(msg)) {
    sendResponse({ error: 'Invalid message format' });
    return;
  }
  // Process valid message
});
```

## Task Reference

This contract is part of **T027**: Define message types at `extension/types/messages.ts`

The actual implementation file should be created at:
`extension/types/messages.ts`

