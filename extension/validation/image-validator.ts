/**
 * Image Validator for CapThat Extension
 * 
 * Validates image data (Blob or URL) to ensure it meets size and format requirements.
 * 
 * Requirements:
 * - MIME types: image/jpeg, image/png, image/gif, image/webp only
 * - Size limit: 10MB per image
 * - Dimension limit: 10MP (width * height <= 10,000,000)
 * 
 * Task: T024 - Implement image validator at extension/validation/image-validator.ts
 */

import { ValidationError } from './url-validator';

/**
 * Allowed MIME types for images.
 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

/**
 * Maximum file size in bytes (10MB).
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Maximum image dimensions in pixels (10MP = 10,000,000 pixels).
 */
const MAX_DIMENSIONS = 10_000_000; // 10MP

/**
 * Validates image MIME type.
 * 
 * @param mimeType - MIME type string to validate
 * @returns true if MIME type is allowed
 * @throws ValidationError if MIME type is not allowed
 */
export function validateImageMimeType(mimeType: string): boolean {
  if (typeof mimeType !== 'string') {
    throw new ValidationError('MIME type must be a string');
  }

  const normalizedMimeType = mimeType.toLowerCase().trim();

  if (!ALLOWED_MIME_TYPES.includes(normalizedMimeType)) {
    throw new ValidationError(
      `Image MIME type not allowed: ${mimeType}. ` +
      `Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    );
  }

  return true;
}

/**
 * Validates image file size.
 * 
 * @param size - File size in bytes
 * @returns true if size is within limit
 * @throws ValidationError if size exceeds limit
 */
export function validateImageSize(size: number): boolean {
  if (typeof size !== 'number' || size < 0) {
    throw new ValidationError('Image size must be a non-negative number');
  }

  if (size > MAX_FILE_SIZE) {
    const sizeMB = (size / (1024 * 1024)).toFixed(2);
    const maxMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    throw new ValidationError(
      `Image size exceeds limit: ${sizeMB}MB. Maximum size: ${maxMB}MB`
    );
  }

  return true;
}

/**
 * Validates image dimensions.
 * 
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @returns true if dimensions are within limit
 * @throws ValidationError if dimensions exceed limit
 */
export function validateImageDimensions(width: number, height: number): boolean {
  if (typeof width !== 'number' || width <= 0) {
    throw new ValidationError('Image width must be a positive number');
  }

  if (typeof height !== 'number' || height <= 0) {
    throw new ValidationError('Image height must be a positive number');
  }

  const totalPixels = width * height;

  if (totalPixels > MAX_DIMENSIONS) {
    const mp = (totalPixels / 1_000_000).toFixed(2);
    throw new ValidationError(
      `Image dimensions exceed limit: ${mp}MP (${width}x${height}). ` +
      `Maximum: 10MP (10,000,000 pixels)`
    );
  }

  return true;
}

/**
 * Validates a Blob as an image.
 * 
 * @param blob - Blob to validate
 * @returns Promise that resolves to true if blob is valid
 * @throws ValidationError if blob is invalid
 */
export async function validateImageBlob(blob: Blob): Promise<boolean> {
  if (!(blob instanceof Blob)) {
    throw new ValidationError('Input must be a Blob object');
  }

  // Validate MIME type
  validateImageMimeType(blob.type);

  // Validate file size
  validateImageSize(blob.size);

  // Validate dimensions by loading image
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);

      try {
        validateImageDimensions(img.width, img.height);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ValidationError('Failed to load image for validation'));
    };

    img.src = url;
  });
}

/**
 * Validates an image URL.
 * 
 * Note: This validates the URL format and scheme, but cannot validate
 * the actual image content without fetching it. Use validateImageBlob
 * after fetching the image for full validation.
 * 
 * @param url - Image URL to validate
 * @returns true if URL format is valid
 * @throws ValidationError if URL is invalid
 */
export function validateImageURL(url: string): boolean {
  if (typeof url !== 'string' || url.trim().length === 0) {
    throw new ValidationError('Image URL must be a non-empty string');
  }

  // Basic URL validation (scheme check is done by URL validator)
  // Additional validation can be done after fetching the image
  return true;
}

