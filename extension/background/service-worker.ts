/**
 * Background Service Worker for CapThat Chrome Extension
 * 
 * This service worker handles:
 * - Message routing between content scripts, UI, and background
 * - Storage operations (chrome.storage.local and IndexedDB)
 * - Image capture orchestration
 * - Export operations (JSON, ZIP, individual images)
 * - Board state management
 * 
 * Tasks:
 * - T007: Create background service worker stub
 * - T027: Message type definitions
 * - T028: Message validation
 * - T051-T059: Capture request handling (future)
 * - T070, T075: Board update handling (future)
 * - T084, T096: Export request handling (future)
 */

import {
  type Message,
  type ErrorMessage,
  type CaptureRequestMessage,
  type CaptureResponseMessage,
  isValidMessage,
  isCaptureRequestMessage,
  isBoardUpdateMessage,
  isExportRequestMessage,
} from '../types/messages';
import { validateURL, validateSourceURL } from '../validation/url-validator';
import { ValidationError } from '../validation/url-validator';
import { validateCapturedItem } from '../validation/schema-validator';
import { chromeStorageAdapter } from '../storage/storage-adapter';
import { indexedDBAdapter } from '../storage/indexeddb-adapter';
import type { CapturedItem, ImageReference, CapBoard } from '../types/index';

console.log('CapThat service worker loaded');

// ============================================================================
// Extension Lifecycle
// ============================================================================

/**
 * Handle extension installation and updates
 * 
 * Future: Initialize default board state, migrate data if needed
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('CapThat extension installed/updated:', details.reason);
  
  // TODO: Initialize default board state if first install
  // TODO: Handle data migration on updates
});

// ============================================================================
// Message Validation
// ============================================================================

/**
 * Validates message structure and payload content.
 * 
 * Task: T028 - Implement message validation in service worker message handlers
 * 
 * @param message - Message to validate
 * @returns ErrorMessage if validation fails, null if valid
 */
function validateMessage(message: unknown): ErrorMessage | null {
  // Check if message has valid structure
  if (!isValidMessage(message)) {
    return {
      type: 'ERROR',
      payload: {
        message: 'Invalid message structure: missing or invalid type field',
        category: 'validation',
        retryable: false,
      },
    };
  }

  const msg = message as Message;

  // Validate message type-specific payloads
  if (isCaptureRequestMessage(msg)) {
    // Validate CAPTURE_REQUEST payload
    if (!msg.payload || typeof msg.payload !== 'object') {
      return {
        type: 'ERROR',
        payload: {
          message: 'Invalid CAPTURE_REQUEST: payload missing or invalid',
          category: 'validation',
          retryable: false,
        },
      };
    }

    const { imageUrl, sourceUrl, metadata } = msg.payload;

    // Validate imageUrl
    if (!imageUrl || typeof imageUrl !== 'string') {
      return {
        type: 'ERROR',
        payload: {
          message: 'Invalid CAPTURE_REQUEST: imageUrl must be a string',
          category: 'validation',
          retryable: false,
        },
      };
    }

    try {
      validateURL(imageUrl);
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          type: 'ERROR',
          payload: {
            message: `Invalid image URL: ${error.message}`,
            category: 'validation',
            retryable: false,
          },
        };
      }
    }

    // Validate sourceUrl
    if (!sourceUrl || typeof sourceUrl !== 'string') {
      return {
        type: 'ERROR',
        payload: {
          message: 'Invalid CAPTURE_REQUEST: sourceUrl must be a string',
          category: 'validation',
          retryable: false,
        },
      };
    }

    try {
      validateSourceURL(sourceUrl);
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          type: 'ERROR',
          payload: {
            message: `Invalid source URL: ${error.message}`,
            category: 'validation',
            retryable: false,
          },
        };
      }
    }

    // Validate metadata if present (must be serializable object)
    if (metadata !== undefined) {
      if (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata)) {
        return {
          type: 'ERROR',
          payload: {
            message: 'Invalid CAPTURE_REQUEST: metadata must be an object',
            category: 'validation',
            retryable: false,
          },
        };
      }

      // Test JSON serialization
      try {
        JSON.stringify(metadata);
      } catch {
        return {
          type: 'ERROR',
          payload: {
            message: 'Invalid CAPTURE_REQUEST: metadata must be JSON-serializable',
            category: 'validation',
            retryable: false,
          },
        };
      }
    }
  } else if (isBoardUpdateMessage(msg)) {
    // Validate BOARD_UPDATE payload
    if (!msg.payload || typeof msg.payload !== 'object') {
      return {
        type: 'ERROR',
        payload: {
          message: 'Invalid BOARD_UPDATE: payload missing or invalid',
          category: 'validation',
          retryable: false,
        },
      };
    }

    const { action, itemId } = msg.payload;

    // Validate action
    if (action !== 'remove' && action !== 'clear') {
      return {
        type: 'ERROR',
        payload: {
          message: `Invalid BOARD_UPDATE: action must be 'remove' or 'clear', got '${action}'`,
          category: 'validation',
          retryable: false,
        },
      };
    }

    // Validate itemId for 'remove' action
    if (action === 'remove') {
      if (!itemId || typeof itemId !== 'string' || itemId.trim().length === 0) {
        return {
          type: 'ERROR',
          payload: {
            message: "Invalid BOARD_UPDATE: itemId required for 'remove' action",
            category: 'validation',
            retryable: false,
          },
        };
      }
    } else if (action === 'clear' && itemId !== undefined) {
      return {
        type: 'ERROR',
        payload: {
          message: "Invalid BOARD_UPDATE: itemId must not be present for 'clear' action",
          category: 'validation',
          retryable: false,
        },
      };
    }
  } else if (isExportRequestMessage(msg)) {
    // Validate EXPORT_REQUEST payload
    if (!msg.payload || typeof msg.payload !== 'object') {
      return {
        type: 'ERROR',
        payload: {
          message: 'Invalid EXPORT_REQUEST: payload missing or invalid',
          category: 'validation',
          retryable: false,
        },
      };
    }

    const { format, options } = msg.payload;

    // Validate format
    const validFormats = ['json', 'zip', 'individual'];
    if (!format || !validFormats.includes(format)) {
      return {
        type: 'ERROR',
        payload: {
          message: `Invalid EXPORT_REQUEST: format must be one of ${validFormats.join(', ')}, got '${format}'`,
          category: 'validation',
          retryable: false,
        },
      };
    }

    // Validate options if present
    if (options !== undefined) {
      if (typeof options !== 'object' || options === null || Array.isArray(options)) {
        return {
          type: 'ERROR',
          payload: {
            message: 'Invalid EXPORT_REQUEST: options must be an object',
            category: 'validation',
            retryable: false,
          },
        };
      }

      // Validate includeThumbnails if present
      if (options.includeThumbnails !== undefined && typeof options.includeThumbnails !== 'boolean') {
        return {
          type: 'ERROR',
          payload: {
            message: 'Invalid EXPORT_REQUEST: options.includeThumbnails must be a boolean',
            category: 'validation',
            retryable: false,
          },
        };
      }

      // Validate maxSizeBytes if present
      if (options.maxSizeBytes !== undefined) {
        if (typeof options.maxSizeBytes !== 'number' || options.maxSizeBytes <= 0) {
          return {
            type: 'ERROR',
            payload: {
              message: 'Invalid EXPORT_REQUEST: options.maxSizeBytes must be a positive number',
              category: 'validation',
              retryable: false,
            },
          };
        }
      }
    }
  }

  // Message is valid
  return null;
}

// ============================================================================
// Capture Request Handler
// ============================================================================

/**
 * Generates a UUID v4 for CapturedItem IDs.
 * 
 * @returns UUID v4 string
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Attempts to fetch an image with CORS fallback.
 * 
 * Task: T052 - Implement image fetch with CORS fallback
 * This is a basic implementation that will be expanded in T052.
 * 
 * @param imageUrl - URL of the image to fetch
 * @returns Promise that resolves to ImageReference or null if fetch fails
 */
async function fetchImageWithFallback(imageUrl: string): Promise<ImageReference | null> {
  try {
    // Attempt to fetch the image as a blob
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    
    // Validate blob (basic check - T052 will expand this)
    if (!(blob instanceof Blob)) {
      throw new Error('Fetched data is not a blob');
    }

    // Store blob in IndexedDB and get reference key
    const blobKey = `blob-${generateUUID()}`;
    await indexedDBAdapter.saveBlob(blobKey, blob);

    // Create ImageReference with blob reference
    const imageReference: ImageReference = {
      urlOrBlob: blobKey,
    };

    return imageReference;
  } catch (error) {
    // CORS or fetch failed - fallback to URL-only storage
    console.warn('Image fetch failed, using URL fallback:', error);
    
    // Create ImageReference with URL-only (fallback)
    const imageReference: ImageReference = {
      urlOrBlob: imageUrl,
      fallbackIndicator: true,
    };

    return imageReference;
  }
}

/**
 * Creates a CapturedItem with unique ID and metadata.
 * 
 * Task: T053 - Create CapturedItem with metadata
 * This is a basic implementation that will be expanded in T053.
 * 
 * @param imageReference - ImageReference for the captured image
 * @param sourceUrl - URL of the page where image was captured
 * @param metadata - Optional metadata from the page
 * @returns CapturedItem object
 */
function createCapturedItem(
  imageReference: ImageReference,
  sourceUrl: string,
  metadata?: Record<string, unknown>
): CapturedItem {
  // Determine quality indicator based on whether we have a blob or URL
  const qualityIndicator: 'url-only' | 'blob' | 'fallback' = 
    typeof imageReference.urlOrBlob === 'string' && imageReference.urlOrBlob.startsWith('blob-')
      ? 'blob'
      : imageReference.fallbackIndicator
      ? 'fallback'
      : 'url-only';

  const item: CapturedItem = {
    id: generateUUID(),
    imageReference,
    sourceUrl,
    timestamp: Date.now(),
    metadata,
    qualityIndicator,
  };

  return item;
}

/**
 * Handles capture request from content script.
 * 
 * Task: T051 - Implement capture request handler
 * 
 * This handler:
 * - Receives and validates CaptureRequestMessage (already validated by validateMessage)
 * - Validates image URL and source URL (already done in validateMessage)
 * - Attempts image fetch with CORS fallback
 * - Creates CapturedItem with unique ID
 * - Validates item via schema validator
 * 
 * Future tasks will expand:
 * - T052: Enhanced image fetch with better CORS handling
 * - T053: Enhanced metadata extraction
 * - T054: Duplicate detection
 * - T055: Board size limit checks
 * - T056: Save to storage
 * - T057: Send response
 * 
 * @param message - Validated CaptureRequestMessage
 * @returns Promise that resolves to CaptureResponseMessage
 */
async function handleCaptureRequest(
  message: CaptureRequestMessage
): Promise<CaptureResponseMessage> {
  try {
    const { imageUrl, sourceUrl, metadata } = message.payload;

    // Validate image URL and source URL (already done in validateMessage, but double-check)
    try {
      validateURL(imageUrl);
      validateSourceURL(sourceUrl);
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          type: 'CAPTURE_RESPONSE',
          payload: {
            success: false,
            error: error.message,
            errorCategory: 'validation',
          },
        };
      }
      throw error;
    }

    // Attempt image fetch with CORS fallback
    const imageReference = await fetchImageWithFallback(imageUrl);
    
    if (!imageReference) {
      return {
        type: 'CAPTURE_RESPONSE',
        payload: {
          success: false,
          error: 'Failed to fetch image',
          errorCategory: 'cors',
        },
      };
    }

    // Create CapturedItem with unique ID
    const capturedItem = createCapturedItem(imageReference, sourceUrl, metadata);

    // Validate item via schema validator
    try {
      validateCapturedItem(capturedItem);
    } catch (error) {
      if (error instanceof ValidationError) {
        return {
          type: 'CAPTURE_RESPONSE',
          payload: {
            success: false,
            error: `Validation failed: ${error.message}`,
            errorCategory: 'validation',
          },
        };
      }
      throw error;
    }

    // TODO: T054 - Check for duplicates
    // TODO: T055 - Check board size limits
    // TODO: T056 - Save to storage
    // TODO: T057 - Send storage update message to UI

    // For now, return success (storage will be implemented in T056)
    return {
      type: 'CAPTURE_RESPONSE',
      payload: {
        success: true,
        itemId: capturedItem.id,
      },
    };
  } catch (error) {
    console.error('Capture request handler error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred during capture';

    return {
      type: 'CAPTURE_RESPONSE',
      payload: {
        success: false,
        error: errorMessage,
        errorCategory: 'unknown',
      },
    };
  }
}

// ============================================================================
// Message Handling
// ============================================================================

/**
 * Main message router for all extension communication
 * 
 * Handles messages from:
 * - Content scripts (capture requests)
 * - UI/side panel (board updates, export requests)
 * 
 * Implements message validation (T028) before processing.
 * 
 * Handlers:
 * - CAPTURE_REQUEST (T051) - Implemented
 * - BOARD_UPDATE (T070, T075) - Future
 * - EXPORT_REQUEST (T084, T096) - Future
 */
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    console.log('Message received:', message, 'from:', sender);

    // Validate message structure and payload (T028)
    const validationError = validateMessage(message);
    if (validationError) {
      console.error('Message validation failed:', validationError);
      sendResponse(validationError);
      return false; // Don't keep channel open for invalid messages
    }

    // Route to appropriate handler based on message.type
    const msg = message as Message;

    // Handle capture requests (T051)
    if (msg.type === 'CAPTURE_REQUEST') {
      handleCaptureRequest(msg)
        .then((response) => {
          sendResponse(response);
        })
        .catch((error) => {
          console.error('Error handling capture request:', error);
          sendResponse({
            type: 'CAPTURE_RESPONSE',
            payload: {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              errorCategory: 'unknown',
            },
          });
        });
      // Return true to keep channel open for async response
      return true;
    } else if (msg.type === 'BOARD_UPDATE') {
      // TODO: T070, T075 - Handle board updates
      // - Remove item or clear board
      // - Update storage
      // - Send storage update message to UI
      console.log('Board update received (not yet implemented)');
      sendResponse({
        type: 'ERROR',
        payload: {
          message: 'Board update functionality not yet implemented',
          category: 'unknown',
          retryable: false,
        },
      });
    } else if (msg.type === 'EXPORT_REQUEST') {
      // TODO: T084, T096 - Handle export requests
      // - JSON export
      // - ZIP export
      // - Individual image export
      console.log('Export request received (not yet implemented)');
      sendResponse({
        type: 'EXPORT_RESPONSE',
        payload: {
          success: false,
          error: 'Export functionality not yet implemented',
        },
      });
    } else {
      // Unknown message type (should not happen after validation, but handle gracefully)
      console.warn('Unknown message type after validation:', msg.type);
      sendResponse({
        type: 'ERROR',
        payload: {
          message: `Unknown message type: ${msg.type}`,
          category: 'validation',
          retryable: false,
        },
      });
    }

    // Return true to keep message channel open for async responses
    return true;
  }
);

// ============================================================================
// Side Panel Management
// ============================================================================

/**
 * Handle side panel connections
 * 
 * Future: Send initial board state when panel opens
 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidePanel') {
    console.log('CapThat side panel opened');
    
    // TODO: Send initial board state to panel when it opens
    // TODO: Listen for messages from panel
    
    port.onDisconnect.addListener(() => {
      console.log('CapThat side panel closed');
    });
  }
});

// ============================================================================
// Action Button
// ============================================================================

/**
 * Handle extension action button click
 * Opens the side panel for the current tab
 */
chrome.action.onClicked.addListener((tab) => {
  console.log('Action button clicked for tab:', tab.id);
  
  if (tab.id !== undefined) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// ============================================================================
// Storage Listeners (Future)
// ============================================================================

/**
 * Listen for storage changes from other extension contexts
 * 
 * Future: T065 - Update UI when storage changes externally
 */
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    console.log('Storage changed:', changes);
    
    // TODO: Broadcast storage updates to UI
    // TODO: Handle board metadata changes
  }
});

