/**
 * Message Type Definitions for CapThat Chrome Extension
 * 
 * This file defines all message types used for communication between:
 * - Content Script ↔ Service Worker
 * - UI (Side Panel) ↔ Service Worker
 * 
 * All messages use a discriminated union pattern with a `type` field
 * for type-safe routing and validation.
 * 
 * Task: T027 - Define message types at extension/types/messages.ts
 */

import type { CapturedItem, CapBoard } from './index';

// ============================================================================
// Base Message Structure
// ============================================================================

/**
 * Base interface for all messages in the extension.
 * All messages must have a `type` field for discriminated union pattern.
 */
export interface BaseMessage {
  type: string;
}

// ============================================================================
// Export Options
// ============================================================================

/**
 * Options for export operations.
 */
export interface ExportOptions {
  /** Include thumbnails in export (default: false) */
  includeThumbnails?: boolean;
  /** Maximum file size limit in bytes (default: 100MB) */
  maxSizeBytes?: number;
}

/**
 * Export format options.
 */
export type ExportFormat = 'json' | 'zip' | 'individual';

// ============================================================================
// Error Category
// ============================================================================

/**
 * Error category for error messages.
 */
export type ErrorCategory = 'permission' | 'cors' | 'storage' | 'validation' | 'unknown';

// ============================================================================
// Capture Messages
// ============================================================================

/**
 * Request from content script to service worker to capture an image.
 * 
 * Sent when user clicks "Cap!" button on an image.
 */
export interface CaptureRequestMessage extends BaseMessage {
  type: 'CAPTURE_REQUEST';
  payload: {
    /** Image URL to capture (HTTP/HTTPS/data URL) */
    imageUrl: string;
    /** Source page URL where image was found */
    sourceUrl: string;
    /** Optional metadata (title, domain, product link, etc.) */
    metadata?: Record<string, unknown>;
  };
}

/**
 * Response from service worker to content script after capture attempt.
 * 
 * Indicates success or failure with appropriate error details.
 */
export interface CaptureResponseMessage extends BaseMessage {
  type: 'CAPTURE_RESPONSE';
  payload: {
    /** Whether capture was successful */
    success: boolean;
    /** Item ID if capture succeeded */
    itemId?: string;
    /** Error message if capture failed (user-friendly, no internal paths) */
    error?: string;
    /** Error category for UI handling (permission/CORS/storage/validation) */
    errorCategory?: ErrorCategory;
  };
}

// ============================================================================
// Storage Update Messages
// ============================================================================

/**
 * Notification from service worker to UI about storage changes.
 * 
 * Used to update UI when board state changes (item added/removed/cleared).
 */
export interface StorageUpdateMessage extends BaseMessage {
  type: 'STORAGE_UPDATE';
  payload: {
    /** Action that triggered the update */
    action: 'add' | 'remove' | 'clear' | 'update';
    /** Captured item (present for 'add' and 'update' actions) */
    item?: CapturedItem;
    /** Full board state (present for 'clear' action) */
    board?: CapBoard;
  };
}

// ============================================================================
// Export Messages
// ============================================================================

/**
 * Request from UI to service worker to export board data.
 * 
 * Sent when user clicks export buttons (Export JSON, Export CapBoard, Export Individual Caps).
 */
export interface ExportRequestMessage extends BaseMessage {
  type: 'EXPORT_REQUEST';
  payload: {
    /** Export format (json, zip, or individual images) */
    format: ExportFormat;
    /** Optional export options */
    options?: ExportOptions;
  };
}

/**
 * Response from service worker to UI after export attempt.
 * 
 * Indicates success or failure with export details.
 */
export interface ExportResponseMessage extends BaseMessage {
  type: 'EXPORT_RESPONSE';
  payload: {
    /** Whether export was successful */
    success: boolean;
    /** Exported filename if successful */
    filename?: string;
    /** Error message if export failed */
    error?: string;
    /** Number of images skipped due to CORS/permissions */
    skippedCount?: number;
  };
}

// ============================================================================
// Board Update Messages
// ============================================================================

/**
 * Request to update board state (remove item or clear board).
 * 
 * Sent from UI to service worker when user removes item or clears board.
 */
export interface BoardUpdateMessage extends BaseMessage {
  type: 'BOARD_UPDATE';
  payload: {
    /** Action to perform */
    action: 'remove' | 'clear';
    /** Item ID to remove (required for 'remove' action) */
    itemId?: string;
  };
}

// ============================================================================
// Error Messages
// ============================================================================

/**
 * Generic error message for any operation.
 * 
 * Used to communicate errors from service worker to content script or UI.
 */
export interface ErrorMessage extends BaseMessage {
  type: 'ERROR';
  payload: {
    /** User-friendly error message (no internal paths exposed) */
    message: string;
    /** Error category for UI handling */
    category: ErrorCategory;
    /** Whether the action can be retried */
    retryable: boolean;
  };
}

// ============================================================================
// Message Union Type
// ============================================================================

/**
 * Union type of all possible messages in the extension.
 * 
 * Used for type-safe message handling and validation.
 */
export type Message =
  | CaptureRequestMessage
  | CaptureResponseMessage
  | StorageUpdateMessage
  | ExportRequestMessage
  | ExportResponseMessage
  | BoardUpdateMessage
  | ErrorMessage;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if message is a capture request.
 */
export function isCaptureRequestMessage(msg: BaseMessage): msg is CaptureRequestMessage {
  return msg.type === 'CAPTURE_REQUEST';
}

/**
 * Type guard to check if message is a capture response.
 */
export function isCaptureResponseMessage(msg: BaseMessage): msg is CaptureResponseMessage {
  return msg.type === 'CAPTURE_RESPONSE';
}

/**
 * Type guard to check if message is a storage update.
 */
export function isStorageUpdateMessage(msg: BaseMessage): msg is StorageUpdateMessage {
  return msg.type === 'STORAGE_UPDATE';
}

/**
 * Type guard to check if message is an export request.
 */
export function isExportRequestMessage(msg: BaseMessage): msg is ExportRequestMessage {
  return msg.type === 'EXPORT_REQUEST';
}

/**
 * Type guard to check if message is an export response.
 */
export function isExportResponseMessage(msg: BaseMessage): msg is ExportResponseMessage {
  return msg.type === 'EXPORT_RESPONSE';
}

/**
 * Type guard to check if message is a board update.
 */
export function isBoardUpdateMessage(msg: BaseMessage): msg is BoardUpdateMessage {
  return msg.type === 'BOARD_UPDATE';
}

/**
 * Type guard to check if message is an error.
 */
export function isErrorMessage(msg: BaseMessage): msg is ErrorMessage {
  return msg.type === 'ERROR';
}

// ============================================================================
// Message Validation
// ============================================================================

/**
 * Validates that a message has the required structure.
 * 
 * @param msg - Message to validate
 * @returns True if message has valid structure
 */
export function isValidMessage(msg: unknown): msg is Message {
  if (typeof msg !== 'object' || msg === null) {
    return false;
  }

  const baseMsg = msg as BaseMessage;
  if (typeof baseMsg.type !== 'string') {
    return false;
  }

  // Check if type is one of the known message types
  const validTypes: Message['type'][] = [
    'CAPTURE_REQUEST',
    'CAPTURE_RESPONSE',
    'STORAGE_UPDATE',
    'EXPORT_REQUEST',
    'EXPORT_RESPONSE',
    'BOARD_UPDATE',
    'ERROR',
  ];

  return validTypes.includes(baseMsg.type as Message['type']);
}

