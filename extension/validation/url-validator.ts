/**
 * URL Validator for CapThat Extension
 * 
 * Validates URLs to ensure they are safe and valid for use in the extension.
 * 
 * Security requirements:
 * - Block javascript: scheme and other dangerous schemes
 * - Allow http://, https://, and data: schemes only
 * - Validate URL format
 * 
 * Task: T023 - Implement URL validator at extension/validation/url-validator.ts
 */

/**
 * Custom error class for validation errors.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Allowed URL schemes for image sources and page URLs.
 */
const ALLOWED_SCHEMES = ['http:', 'https:', 'data:'];

/**
 * Blocked URL schemes that are dangerous or not allowed.
 */
const BLOCKED_SCHEMES = ['javascript:', 'file:', 'about:', 'chrome:', 'chrome-extension:'];

/**
 * Validates a URL string.
 * 
 * @param url - URL string to validate
 * @returns true if URL is valid and safe
 * @throws ValidationError if URL is invalid or unsafe
 */
export function validateURL(url: string): boolean {
  if (typeof url !== 'string' || url.trim().length === 0) {
    throw new ValidationError('URL must be a non-empty string');
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    throw new ValidationError(`Invalid URL format: ${url}`);
  }

  const scheme = parsedUrl.protocol.toLowerCase();

  // Check for blocked schemes
  if (BLOCKED_SCHEMES.some(blocked => scheme.startsWith(blocked))) {
    throw new ValidationError(
      `URL scheme not allowed: ${scheme}. ` +
      `Only http://, https://, and data: URLs are allowed.`
    );
  }

  // Check for allowed schemes
  if (!ALLOWED_SCHEMES.some(allowed => scheme === allowed)) {
    throw new ValidationError(
      `URL scheme not allowed: ${scheme}. ` +
      `Only http://, https://, and data: URLs are allowed.`
    );
  }

  return true;
}

/**
 * Validates a source URL (page URL where image was captured).
 * 
 * Source URLs must be HTTP or HTTPS (not data: URLs).
 * 
 * @param url - Source URL to validate
 * @returns true if URL is valid
 * @throws ValidationError if URL is invalid
 */
export function validateSourceURL(url: string): boolean {
  validateURL(url); // Basic validation first

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    // Should not happen after validateURL, but TypeScript needs this
    throw new ValidationError(`Invalid URL format: ${url}`);
  }

  const scheme = parsedUrl.protocol.toLowerCase();

  // Source URLs must be HTTP or HTTPS (not data:)
  if (scheme !== 'http:' && scheme !== 'https:') {
    throw new ValidationError(
      `Source URL must be HTTP or HTTPS, not ${scheme}`
    );
  }

  return true;
}

