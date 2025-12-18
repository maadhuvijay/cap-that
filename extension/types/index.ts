/**
 * TypeScript Type Definitions for CapThat Chrome Extension
 * 
 * This file defines all core types used throughout the extension:
 * - CapturedItem: A single captured image with metadata
 * - CapBoard: The collection of captured items and board configuration
 * - ImageReference: Reference to captured image data (URL or blob)
 * - BoardMetadata: Board-level metadata
 * - GridConfig: Grid layout configuration
 * - ExportManifest: Export data structure
 * - ExportItemReference: Reference to exported item
 * - BlobReference: IndexedDB blob key type
 * 
 * Task: T015 - Define TypeScript types at extension/types/index.ts
 */

// ============================================================================
// Blob Reference Type
// ============================================================================

/**
 * Reference to a blob stored in IndexedDB.
 * This is a string key used to retrieve the blob from the 'images' object store.
 */
export type BlobReference = string;

// ============================================================================
// Image Reference
// ============================================================================

/**
 * Represents the captured image data (URL or blob reference).
 * 
 * The image can be stored as:
 * - URL string: Direct URL to the image (for CORS-blocked images or fallback)
 * - BlobReference: IndexedDB key to retrieve the blob (for successfully fetched images)
 */
export interface ImageReference {
  /** Either image URL string or IndexedDB blob reference key */
  urlOrBlob: string | BlobReference;
  /** Base64-encoded thumbnail for grid display (optional) */
  thumbnail?: string;
  /** Original image dimensions if available (optional) */
  dimensions?: {
    width: number;
    height: number;
  };
  /** True if lower-quality fallback was used (optional) */
  fallbackIndicator?: boolean;
}

// ============================================================================
// Captured Item
// ============================================================================

/**
 * Represents a single image capture with all associated metadata.
 * 
 * Each captured item includes:
 * - Unique identifier (UUID v4)
 * - Image reference (URL or blob)
 * - Source page URL
 * - Capture timestamp
 * - Optional metadata (title, domain, etc.)
 * - Quality indicator (capture method used)
 */
export interface CapturedItem {
  /** Unique identifier (UUID v4) */
  id: string;
  /** Reference to the captured image */
  imageReference: ImageReference;
  /** URL of the page where image was captured */
  sourceUrl: string;
  /** Unix timestamp (milliseconds) of capture */
  timestamp: number;
  /** Optional metadata (title, domain, product link, etc.) */
  metadata?: Record<string, unknown>;
  /** Indicates capture quality/fallback used */
  qualityIndicator?: 'url-only' | 'blob' | 'fallback';
}

// ============================================================================
// Board Metadata
// ============================================================================

/**
 * Board-level metadata and configuration.
 */
export interface BoardMetadata {
  /** Unix timestamp of board creation */
  creationDate: number;
  /** Unix timestamp of last modification */
  lastModified: number;
  /** Board data format version (semantic versioning) */
  version: string;
}

// ============================================================================
// Grid Configuration
// ============================================================================

/**
 * Grid layout configuration for the CapBoard UI.
 */
export interface GridConfig {
  /** Number of grid slots (default: 10) */
  slots: number;
  /** Number of columns (default: 5) */
  columns: number;
  /** Whether virtual scrolling is enabled (default: true) */
  virtualScrolling: boolean;
}

// ============================================================================
// Export Item Reference
// ============================================================================

/**
 * Reference to an exported item with file mapping.
 * Used in export manifests to reference captured items.
 */
export interface ExportItemReference {
  /** ID of the captured item */
  itemId: string;
  /** Filename in export (if image was exported) */
  filename?: string;
  /** Original image URL (if available) */
  imageUrl?: string;
  /** Item metadata */
  metadata: Record<string, unknown>;
}

// ============================================================================
// Export Manifest
// ============================================================================

/**
 * Represents exported board data structure.
 * 
 * This is generated on export and contains:
 * - Board metadata at export time
 * - Item references with file mappings
 * - Export timestamp and format version
 */
export interface ExportManifest {
  /** Board metadata at export time */
  boardMetadata: BoardMetadata;
  /** Array of item references with file mappings */
  itemReferences: ExportItemReference[];
  /** Unix timestamp of export */
  exportTimestamp: number;
  /** Export format version (semantic versioning) */
  formatVersion: string;
}

// ============================================================================
// Cap Board
// ============================================================================

/**
 * Represents the collection of captured items and board configuration.
 * 
 * This is the main data structure stored in chrome.storage.local.
 * It contains:
 * - Array of captured items (max 100)
 * - Board metadata
 * - Grid configuration
 * - Optional export history
 */
export interface CapBoard {
  /** Array of captured items (max 100) */
  items: CapturedItem[];
  /** Board-level metadata */
  metadata: BoardMetadata;
  /** Grid layout configuration */
  gridConfig: GridConfig;
  /** Optional history of exports */
  exportHistory?: ExportManifest[];
}

