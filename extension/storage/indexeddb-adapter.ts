/**
 * IndexedDB Adapter for Blob Storage
 * 
 * This adapter implements blob storage using IndexedDB for the CapThat extension.
 * IndexedDB is better suited for storing large binary data (image blobs) than
 * chrome.storage.local, which has a 10MB quota.
 * 
 * Features:
 * - Open/create IndexedDB database 'capthat'
 * - Create 'images' object store if needed
 * - Store Blob objects with unique keys
 * - Retrieve blobs by key
 * - Handle IndexedDB errors gracefully
 * 
 * Task: T018 - Implement IndexedDB adapter at extension/storage/indexeddb-adapter.ts
 */

import type { IStorageAdapter } from './storage-interface';

// Database configuration
const DB_NAME = 'capthat';
const DB_VERSION = 1;
const STORE_NAME = 'images';

/**
 * IndexedDB adapter for blob storage.
 */
export class IndexedDBAdapter implements IStorageAdapter {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  /**
   * Initialize IndexedDB database and object store.
   * 
   * @returns Promise that resolves to the database instance
   */
  private async init(): Promise<IDBDatabase> {
    // Return existing database if already initialized
    if (this.db) {
      return this.db;
    }

    // Return existing init promise if initialization in progress
    if (this.initPromise) {
      return this.initPromise;
    }

    // Start initialization
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        this.initPromise = null;
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message || 'Unknown error'}`));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initPromise = null;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          objectStore.createIndex('key', 'key', { unique: true });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Save board metadata to storage.
   * 
   * Note: This adapter only handles blob storage.
   * Board metadata should use ChromeStorageAdapter.
   * 
   * @param board - CapBoard object (not used)
   * @throws Error - This method is not implemented in IndexedDBAdapter
   */
  async saveBoard(board: unknown): Promise<void> {
    throw new Error(
      'saveBoard is not supported by IndexedDBAdapter. Use ChromeStorageAdapter for board metadata.'
    );
  }

  /**
   * Load board metadata from storage.
   * 
   * Note: This adapter only handles blob storage.
   * Board metadata should use ChromeStorageAdapter.
   * 
   * @returns null
   * @throws Error - This method is not implemented in IndexedDBAdapter
   */
  async loadBoard(): Promise<null> {
    throw new Error(
      'loadBoard is not supported by IndexedDBAdapter. Use ChromeStorageAdapter for board metadata.'
    );
  }

  /**
   * Save a blob to IndexedDB.
   * 
   * @param key - Unique key for the blob (BlobReference)
   * @param blob - Blob object to store
   * @throws Error if save fails (quota exceeded, etc.)
   */
  async saveBlob(key: string, blob: Blob): Promise<void> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);

      const request = objectStore.put({ key, blob });

      request.onerror = () => {
        reject(new Error(
          `Failed to save blob: ${request.error?.message || 'Unknown error'}`
        ));
      };

      request.onsuccess = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(new Error(
          `Transaction failed: ${transaction.error?.message || 'Unknown error'}`
        ));
      };
    });
  }

  /**
   * Retrieve a blob from IndexedDB.
   * 
   * @param key - BlobReference key
   * @returns Blob object or null if not found
   * @throws Error if retrieval fails
   */
  async getBlob(key: string): Promise<Blob | null> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);

      const request = objectStore.get(key);

      request.onerror = () => {
        reject(new Error(
          `Failed to retrieve blob: ${request.error?.message || 'Unknown error'}`
        ));
      };

      request.onsuccess = () => {
        const result = request.result;
        if (!result) {
          resolve(null);
          return;
        }

        // Extract blob from stored object
        const blob = result.blob as Blob | undefined;
        if (!blob) {
          reject(new Error('Corrupted blob data: blob missing'));
          return;
        }

        resolve(blob);
      };

      transaction.onerror = () => {
        reject(new Error(
          `Transaction failed: ${transaction.error?.message || 'Unknown error'}`
        ));
      };
    });
  }
}

// Export singleton instance
export const indexedDBAdapter = new IndexedDBAdapter();

