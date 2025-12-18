/**
 * Schema Validator for CapThat Extension
 * 
 * Validates data structures (CapturedItem, CapBoard) to ensure they meet
 * schema requirements before storage.
 * 
 * Requirements:
 * - CapturedItem: required fields (id, imageReference, sourceUrl, timestamp)
 * - CapturedItem: id is non-empty string
 * - CapturedItem: sourceUrl is valid URL
 * - CapturedItem: timestamp is positive number
 * - CapturedItem: metadata is serializable JSON object
 * - CapBoard: items array length <= 100
 * - CapBoard: items contain valid CapturedItem objects
 * - CapBoard: metadata and gridConfig are valid
 * 
 * Task: T025 - Implement schema validator at extension/validation/schema-validator.ts
 */

import type { CapturedItem, CapBoard, ImageReference } from '../types/index';
import { validateSourceURL } from './url-validator';
import { ValidationError } from './url-validator';

/**
 * Validates a CapturedItem structure.
 * 
 * @param item - CapturedItem to validate
 * @returns true if item is valid
 * @throws ValidationError if item is invalid
 */
export function validateCapturedItem(item: unknown): item is CapturedItem {
  if (!item || typeof item !== 'object') {
    throw new ValidationError('CapturedItem must be an object');
  }

  const itemObj = item as Record<string, unknown>;

  // Validate required fields
  if (!itemObj.id || typeof itemObj.id !== 'string' || itemObj.id.trim().length === 0) {
    throw new ValidationError('CapturedItem.id must be a non-empty string');
  }

  if (!itemObj.imageReference || typeof itemObj.imageReference !== 'object') {
    throw new ValidationError('CapturedItem.imageReference must be an object');
  }

  if (!itemObj.sourceUrl || typeof itemObj.sourceUrl !== 'string') {
    throw new ValidationError('CapturedItem.sourceUrl must be a string');
  }

  if (typeof itemObj.timestamp !== 'number' || itemObj.timestamp <= 0) {
    throw new ValidationError('CapturedItem.timestamp must be a positive number');
  }

  // Validate sourceUrl format
  try {
    validateSourceURL(itemObj.sourceUrl as string);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(`CapturedItem.sourceUrl: ${error.message}`);
    }
    throw error;
  }

  // Validate imageReference structure
  const imageRef = itemObj.imageReference as ImageReference;
  if (!imageRef.urlOrBlob || (typeof imageRef.urlOrBlob !== 'string' && typeof imageRef.urlOrBlob !== 'object')) {
    throw new ValidationError('ImageReference.urlOrBlob must be a string or BlobReference');
  }

  // Validate metadata if present (must be serializable JSON object)
  if (itemObj.metadata !== undefined) {
    if (typeof itemObj.metadata !== 'object' || itemObj.metadata === null || Array.isArray(itemObj.metadata)) {
      throw new ValidationError('CapturedItem.metadata must be a serializable JSON object');
    }

    // Test JSON serialization
    try {
      JSON.stringify(itemObj.metadata);
    } catch (error) {
      throw new ValidationError('CapturedItem.metadata must be JSON-serializable (no circular references)');
    }
  }

  // Validate qualityIndicator if present
  if (itemObj.qualityIndicator !== undefined) {
    const validIndicators = ['url-only', 'blob', 'fallback'];
    if (!validIndicators.includes(itemObj.qualityIndicator as string)) {
      throw new ValidationError(
        `CapturedItem.qualityIndicator must be one of: ${validIndicators.join(', ')}`
      );
    }
  }

  return true;
}

/**
 * Validates a CapBoard structure.
 * 
 * @param board - CapBoard to validate
 * @returns true if board is valid
 * @throws ValidationError if board is invalid
 */
export function validateCapBoard(board: unknown): board is CapBoard {
  if (!board || typeof board !== 'object') {
    throw new ValidationError('CapBoard must be an object');
  }

  const boardObj = board as Record<string, unknown>;

  // Validate items array
  if (!Array.isArray(boardObj.items)) {
    throw new ValidationError('CapBoard.items must be an array');
  }

  if (boardObj.items.length > 100) {
    throw new ValidationError(
      `CapBoard.items.length must be <= 100, got ${boardObj.items.length}`
    );
  }

  // Validate each item in the array
  for (let i = 0; i < boardObj.items.length; i++) {
    try {
      validateCapturedItem(boardObj.items[i]);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new ValidationError(`CapBoard.items[${i}]: ${error.message}`);
      }
      throw error;
    }
  }

  // Validate metadata
  if (!boardObj.metadata || typeof boardObj.metadata !== 'object') {
    throw new ValidationError('CapBoard.metadata must be an object');
  }

  const metadata = boardObj.metadata as Record<string, unknown>;
  if (typeof metadata.creationDate !== 'number' || metadata.creationDate <= 0) {
    throw new ValidationError('BoardMetadata.creationDate must be a positive number');
  }

  if (typeof metadata.lastModified !== 'number' || metadata.lastModified <= 0) {
    throw new ValidationError('BoardMetadata.lastModified must be a positive number');
  }

  if (metadata.creationDate > metadata.lastModified) {
    throw new ValidationError('BoardMetadata.creationDate must be <= lastModified');
  }

  if (!metadata.version || typeof metadata.version !== 'string') {
    throw new ValidationError('BoardMetadata.version must be a non-empty string');
  }

  // Validate gridConfig
  if (!boardObj.gridConfig || typeof boardObj.gridConfig !== 'object') {
    throw new ValidationError('CapBoard.gridConfig must be an object');
  }

  const gridConfig = boardObj.gridConfig as Record<string, unknown>;
  if (typeof gridConfig.slots !== 'number' || gridConfig.slots <= 0) {
    throw new ValidationError('GridConfig.slots must be a positive integer');
  }

  if (typeof gridConfig.columns !== 'number' || gridConfig.columns <= 0) {
    throw new ValidationError('GridConfig.columns must be a positive integer');
  }

  if (gridConfig.slots < gridConfig.columns) {
    throw new ValidationError('GridConfig.slots must be >= columns');
  }

  if (typeof gridConfig.virtualScrolling !== 'boolean') {
    throw new ValidationError('GridConfig.virtualScrolling must be a boolean');
  }

  // Validate exportHistory if present
  if (boardObj.exportHistory !== undefined) {
    if (!Array.isArray(boardObj.exportHistory)) {
      throw new ValidationError('CapBoard.exportHistory must be an array');
    }

    // Basic validation of export history items
    for (let i = 0; i < boardObj.exportHistory.length; i++) {
      const exportItem = boardObj.exportHistory[i];
      if (!exportItem || typeof exportItem !== 'object') {
        throw new ValidationError(`CapBoard.exportHistory[${i}] must be an object`);
      }
    }
  }

  return true;
}

