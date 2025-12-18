/**
 * Storage Interface/Abstraction for CapThat Extension
 * 
 * This file defines the storage interface that both chrome.storage.local
 * and IndexedDB adapters must implement.
 * 
 * Task: T019 - Create storage interface/abstraction at extension/storage/storage-interface.ts
 */

import type { CapBoard } from '../types/index';

/**
 * Storage adapter interface for board metadata and blob storage.
 * 
 * This interface abstracts the underlying storage mechanism (chrome.storage.local
 * for metadata, IndexedDB for blobs) to allow for easy testing and future changes.
 */
export interface IStorageAdapter {
  /**
   * Save board metadata to storage.
   * 
   * @param board - CapBoard object to save
   * @throws Error if save fails (quota exceeded, validation error, etc.)
   */
  saveBoard(board: CapBoard): Promise<void>;

  /**
   * Load board metadata from storage.
   * 
   * @returns CapBoard object or null if not found
   * @throws Error if load fails (corrupted data, etc.)
   */
  loadBoard(): Promise<CapBoard | null>;

  /**
   * Save a blob to storage (IndexedDB).
   * 
   * @param key - Unique key for the blob (BlobReference)
   * @param blob - Blob object to store
   * @throws Error if save fails (quota exceeded, etc.)
   */
  saveBlob(key: string, blob: Blob): Promise<void>;

  /**
   * Retrieve a blob from storage (IndexedDB).
   * 
   * @param key - BlobReference key
   * @returns Blob object or null if not found
   * @throws Error if retrieval fails
   */
  getBlob(key: string): Promise<Blob | null>;
}

