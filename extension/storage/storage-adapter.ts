/**
 * Chrome Storage Local Adapter for CapThat Extension
 * 
 * This adapter implements IStorageAdapter using chrome.storage.local
 * for board metadata storage.
 * 
 * Features:
 * - Save/load CapBoard metadata
 * - Storage quota monitoring (T020)
 * - Board size limit enforcement (T021)
 * - Warning threshold at 80 items (T022)
 * 
 * Tasks:
 * - T017: Implement chrome.storage.local adapter
 * - T020: Implement storage quota monitoring
 * - T021: Implement board size limit enforcement (100 items)
 * - T022: Implement warning threshold (80 items)
 */

import type { CapBoard } from '../types/index';
import type { IStorageAdapter } from './storage-interface';

// Storage key for board metadata
const BOARD_STORAGE_KEY = 'capBoard';

// Board size limits
const MAX_BOARD_ITEMS = 100;
const WARNING_THRESHOLD_ITEMS = 80;

// Storage quota warning threshold (80% of quota)
const QUOTA_WARNING_THRESHOLD = 0.8;

/**
 * Storage quota information
 */
export interface StorageQuotaInfo {
  /** Bytes used */
  bytesUsed: number;
  /** Bytes available */
  bytesAvailable: number;
  /** Total quota */
  quota: number;
  /** Usage percentage (0-1) */
  usagePercentage: number;
}

/**
 * Storage adapter using chrome.storage.local for board metadata.
 */
export class ChromeStorageAdapter implements IStorageAdapter {
  /**
   * Check storage quota and emit warning if usage exceeds threshold.
   * 
   * @throws Error if quota exceeded (usage >= 100%)
   */
  private async checkQuota(): Promise<StorageQuotaInfo> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.getBytesInUse(null, (bytesUsed) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`Failed to check storage quota: ${chrome.runtime.lastError.message}`));
          return;
        }

        // Get quota information
        // Note: chrome.storage.local.QUOTA_BYTES is not available in MV3
        // We'll use a default of 10MB (10,485,760 bytes) as per Chrome's default
        const quota = 10 * 1024 * 1024; // 10MB
        const bytesAvailable = quota - bytesUsed;
        const usagePercentage = bytesUsed / quota;

        const quotaInfo: StorageQuotaInfo = {
          bytesUsed,
          bytesAvailable,
          quota,
          usagePercentage,
        };

        // Emit warning if usage exceeds threshold
        if (usagePercentage >= QUOTA_WARNING_THRESHOLD) {
          console.warn(
            `Storage quota warning: ${(usagePercentage * 100).toFixed(1)}% used ` +
            `(${bytesUsed} / ${quota} bytes)`
          );
          
          // Emit warning event (can be listened to by UI)
          chrome.runtime.sendMessage({
            type: 'STORAGE_QUOTA_WARNING',
            payload: { quotaInfo },
          }).catch(() => {
            // Ignore errors if no listeners
          });
        }

        // Throw error if quota exceeded
        if (usagePercentage >= 1.0) {
          reject(new Error(
            'Storage quota exceeded. Please clear some items or export your board.'
          ));
          return;
        }

        resolve(quotaInfo);
      });
    });
  }

  /**
   * Validate board size before save.
   * 
   * @param board - CapBoard to validate
   * @throws Error if board size exceeds limit
   */
  private validateBoardSize(board: CapBoard): void {
    if (board.items.length > MAX_BOARD_ITEMS) {
      throw new Error(
        `Board is full. Maximum ${MAX_BOARD_ITEMS} items allowed. ` +
        `Please remove some items before adding new ones.`
      );
    }

    // Emit warning if approaching limit
    if (board.items.length >= WARNING_THRESHOLD_ITEMS) {
      const remaining = MAX_BOARD_ITEMS - board.items.length;
      console.warn(
        `Board size warning: ${board.items.length} items, ${remaining} remaining`
      );

      // Emit warning event (can be listened to by UI)
      chrome.runtime.sendMessage({
        type: 'BOARD_SIZE_WARNING',
        payload: {
          currentCount: board.items.length,
          maxCount: MAX_BOARD_ITEMS,
          remaining,
        },
      }).catch(() => {
        // Ignore errors if no listeners
      });
    }
  }

  /**
   * Save board metadata to chrome.storage.local.
   * 
   * @param board - CapBoard object to save
   * @throws Error if save fails (quota exceeded, validation error, etc.)
   */
  async saveBoard(board: CapBoard): Promise<void> {
    // Check quota before save
    await this.checkQuota();

    // Validate board size
    this.validateBoardSize(board);

    return new Promise((resolve, reject) => {
      chrome.storage.local.set(
        { [BOARD_STORAGE_KEY]: board },
        () => {
          if (chrome.runtime.lastError) {
            reject(new Error(
              `Failed to save board: ${chrome.runtime.lastError.message}`
            ));
            return;
          }
          resolve();
        }
      );
    });
  }

  /**
   * Load board metadata from chrome.storage.local.
   * 
   * @returns CapBoard object or null if not found
   * @throws Error if load fails (corrupted data, etc.)
   */
  async loadBoard(): Promise<CapBoard | null> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([BOARD_STORAGE_KEY], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(
            `Failed to load board: ${chrome.runtime.lastError.message}`
          ));
          return;
        }

        const board = result[BOARD_STORAGE_KEY] as CapBoard | undefined;
        if (!board) {
          resolve(null);
          return;
        }

        // Basic validation of loaded data
        if (!board.items || !Array.isArray(board.items)) {
          reject(new Error('Corrupted board data: items array missing or invalid'));
          return;
        }

        if (!board.metadata || typeof board.metadata !== 'object') {
          reject(new Error('Corrupted board data: metadata missing or invalid'));
          return;
        }

        if (!board.gridConfig || typeof board.gridConfig !== 'object') {
          reject(new Error('Corrupted board data: gridConfig missing or invalid'));
          return;
        }

        resolve(board);
      });
    });
  }

  /**
   * Save a blob to storage (IndexedDB).
   * 
   * Note: This adapter only handles chrome.storage.local.
   * Blob storage should use IndexedDBAdapter.
   * 
   * @param key - Unique key for the blob
   * @param blob - Blob object to store
   * @throws Error - This method is not implemented in ChromeStorageAdapter
   */
  async saveBlob(key: string, blob: Blob): Promise<void> {
    throw new Error(
      'saveBlob is not supported by ChromeStorageAdapter. Use IndexedDBAdapter for blob storage.'
    );
  }

  /**
   * Retrieve a blob from storage (IndexedDB).
   * 
   * Note: This adapter only handles chrome.storage.local.
   * Blob retrieval should use IndexedDBAdapter.
   * 
   * @param key - BlobReference key
   * @returns Blob object or null if not found
   * @throws Error - This method is not implemented in ChromeStorageAdapter
   */
  async getBlob(key: string): Promise<Blob | null> {
    throw new Error(
      'getBlob is not supported by ChromeStorageAdapter. Use IndexedDBAdapter for blob storage.'
    );
  }
}

// Export singleton instance
export const chromeStorageAdapter = new ChromeStorageAdapter();

