/**
 * Shared TypeScript Type Definitions
 * 
 * This file exports types that are shared between the extension and web app.
 * These types must be compatible for Next.js API integration.
 * 
 * All types are re-exported from extension types to ensure compatibility.
 * 
 * Task: T016 - Define shared types at shared/types/index.ts
 */

// Re-export all types from extension types
// This ensures type compatibility between extension and web app
export type {
  BlobReference,
  ImageReference,
  CapturedItem,
  BoardMetadata,
  GridConfig,
  ExportItemReference,
  ExportManifest,
  CapBoard,
} from '../../extension/types/index';

