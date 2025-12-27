/**
 * Content Script for CapThat Chrome Extension
 * 
 * This content script handles:
 * - Image detection on web pages
 * - Injection of "Cap!" capture controls
 * - Message passing to/from service worker
 * - Capture button click handling
 * 
 * Task: T008 - Create content script stub
 * Task: T045 - Implement image detection logic
 * Task: T046 - Inject capture controls into page
 * 
 * Future tasks will implement:
 * - T050: Capture button click handler
 * - T059: Error handling in content script
 * 
 * Security Note: Uses isolated world (default in MV3) - no unsafeWindow access
 */

import { validateURL } from '../validation/url-validator';
import type { CaptureRequestMessage, CaptureResponseMessage, ErrorMessage } from '../types/messages';
import { isCaptureResponseMessage } from '../types/messages';

console.log('CapThat content script loaded');

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize content script when DOM is ready
 * 
 * T045: Image detection implemented
 * T046: Capture controls injection implemented
 * T049: Handle edge cases gracefully (no images, broken images, lazy-loaded images)
 */
function init() {
  try {
    console.log('Initializing CapThat content script');
    
    // T049: Gracefully handle pages where body doesn't exist yet
    // Some edge cases might have no body element (rare but possible)
    if (!document.body && !document.documentElement) {
      console.warn('Page structure not ready, will retry initialization');
      setTimeout(init, 100);
      return;
    }
    
    // T045: Detect capturable images on page
    // T049: This will return empty array gracefully if no images found
    const capturableImages = detectCapturableImages();
    
    // T046: Inject capture controls onto capturable images
    // T049: This handles empty array gracefully (no controls injected)
    injectCaptureControls(capturableImages);
    
    // T045, T049: Set up observer for dynamically added images (lazy loading, infinite scroll, etc.)
    // This will handle lazy-loaded images that appear later
    if (document.body) {
      setupImageDetectionObserver();
    } else {
      // If body isn't ready yet, wait for it
      const bodyObserver = new MutationObserver(() => {
        if (document.body) {
          setupImageDetectionObserver();
          bodyObserver.disconnect();
        }
      });
      bodyObserver.observe(document.documentElement, {
        childList: true,
      });
    }
  } catch (error) {
    // T049: Catch any initialization errors and log them, but don't throw
    // Extension should continue to function even if initialization partially fails
    console.error('Error during content script initialization:', error);
    // Extension will still be functional, just may not detect images on this page
  }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================================================
// Message Handling
// ============================================================================

/**
 * Handle messages from service worker
 * 
 * Receives:
 * - CaptureResponseMessage (T059): Capture success/failure
 * - ErrorMessage: Error notifications
 * - StorageUpdateMessage: Board state updates
 * 
 * T050: Capture button click handler implemented
 * T059: Full error handling with toasts (future task)
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message, 'from:', sender);
  
  // T059: Handle capture responses (will implement toast notifications)
  // - Show success toast when capture succeeds
  // - Show error toast with retry button if capture fails
  // - Handle different error categories (permission, CORS, storage, validation)
  
  // T050: Capture button clicks are now handled in the button click handler
  // Messages from service worker (responses) are handled here
  
  // Return true to keep message channel open for async responses
  return true;
});

// ============================================================================
// Image Detection
// ============================================================================

/**
 * Interface for a capturable image element
 */
interface CapturableImage {
  element: HTMLImageElement;
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}

/**
 * Detect capturable images on the page
 * 
 * Task: T045 - Implement image detection
 * Task: T049 - Handle edge cases (pages with no images, broken images, lazy-loaded images)
 * 
 * Scans the page for <img> elements with valid src attributes,
 * filters out broken or invalid images, and handles lazy-loaded images.
 * 
 * Edge cases handled:
 * - Pages with no images: Returns empty array gracefully
 * - Broken images: Detects via error state and naturalWidth/Height checks
 * - Lazy-loaded images: Detects via data-src attributes and MutationObserver
 * 
 * @returns Array of capturable image elements with their metadata
 */
function detectCapturableImages(): CapturableImage[] {
  const capturableImages: CapturableImage[] = [];
  
  // Query all <img> elements on the page
  const imgElements = document.querySelectorAll<HTMLImageElement>('img');
  
  // T049: Gracefully handle pages with no images
  if (imgElements.length === 0) {
    console.log('No images found on page - extension will continue to function normally');
    return capturableImages;
  }
  
  console.log(`Scanning ${imgElements.length} <img> elements for capturable images`);
  
  for (const img of imgElements) {
    try {
      // T049: Handle lazy-loaded images - check data-src, data-lazy-src, data-original, etc.
      // These are common lazy-load attributes that may contain the actual image URL
      const lazySrc = img.getAttribute('data-src') || 
                      img.getAttribute('data-lazy-src') || 
                      img.getAttribute('data-original') ||
                      img.getAttribute('data-lazy');
      
      // Get the image source URL (prefer lazy-src if available and img.src is placeholder)
      let src = img.src || img.getAttribute('src') || lazySrc || '';
      
      // If src is a placeholder and lazySrc exists, use lazySrc instead
      if (lazySrc && (src === '' || src.includes('placeholder') || src.includes('1x1'))) {
        src = lazySrc;
      }
      
      // Skip images without a source
      if (!src || src.trim().length === 0) {
        continue;
      }
      
      // Skip images with empty or placeholder sources
      if (src === 'about:blank' || 
          (src.startsWith('data:image/svg+xml') && src.includes('none')) ||
          src.includes('placeholder') ||
          src.includes('1x1')) {
        continue;
      }
      
      // Validate URL scheme (http, https, or data:)
      try {
        validateURL(src);
      } catch (error) {
        // Skip images with invalid or blocked URL schemes
        console.debug(`Skipping image with invalid URL: ${src.substring(0, 50)}...`);
        continue;
      }
      
      // T049: Better broken image detection
      // Check if image failed to load (error state)
      const naturalWidth = img.naturalWidth || 0;
      const naturalHeight = img.naturalHeight || 0;
      
      // Skip 1x1 pixel images (often used as trackers or placeholders)
      if (naturalWidth === 1 && naturalHeight === 1) {
        continue;
      }
      
      // T049: Improved broken image detection
      // Check multiple indicators of broken images:
      // 1. Image is complete but has no dimensions (likely failed to load)
      // 2. Image has error event listener (check if onerror was triggered)
      // 3. Image src is set but naturalWidth/Height are 0 and image is complete
      const isComplete = img.complete;
      const hasNoDimensions = naturalWidth === 0 && naturalHeight === 0;
      const isLikelyBroken = isComplete && hasNoDimensions && src !== '';
      
      if (isLikelyBroken) {
        console.debug(`Skipping likely broken image: ${src.substring(0, 50)}...`);
        continue;
      }
      
      // T049: Handle lazy-loaded images that haven't loaded yet
      // Include images with valid src even if they haven't loaded yet
      // The capture process will handle loading them
      // We check if the image has a valid URL structure, not just if it's loaded
      
      // Image is capturable (either loaded or lazy-loaded with valid URL)
      capturableImages.push({
        element: img,
        src: src,
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
      });
      
    } catch (error) {
      // T049: Gracefully skip images that cause errors during processing
      // Log debug info but don't throw - extension should continue functioning
      console.debug(`Error processing image element:`, error);
      continue;
    }
  }
  
  // T049: Log result for debugging, but don't throw errors if no images found
  if (capturableImages.length === 0 && imgElements.length > 0) {
    console.log('No capturable images found (all may be placeholders, broken, or invalid)');
  } else {
    console.log(`Found ${capturableImages.length} capturable images`);
  }
  
  return capturableImages;
}

/**
 * Re-detect images when new content is added to the page
 * 
 * Uses MutationObserver to watch for dynamically added images
 * (e.g., lazy-loaded images, infinite scroll, AJAX content)
 * 
 * Task: T046 - Trigger re-injection of capture controls
 * Task: T049 - Handle lazy-loaded images via attribute changes
 */
function setupImageDetectionObserver() {
  // T049: Gracefully handle case where body doesn't exist
  if (!document.body) {
    console.debug('Cannot setup image observer: document.body not available');
    return;
  }
  
  // Watch for new images added to the DOM
  const observer = new MutationObserver((mutations) => {
    try {
      let hasNewImages = false;
      
      for (const mutation of mutations) {
        // T049: Handle new images added to DOM (lazy loading, infinite scroll)
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            // Check if the added node is an img element
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'IMG') {
                hasNewImages = true;
                break;
              }
              // Check for img elements within the added node
              if (element.querySelectorAll('img').length > 0) {
                hasNewImages = true;
                break;
              }
            }
          }
        }
        
        // T049: Handle lazy-loaded images - watch for src attribute changes
        // and common lazy-load data attributes (data-src, data-lazy-src, etc.)
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLImageElement;
          if (target.tagName === 'IMG') {
            const attrName = mutation.attributeName;
            // Check if src or any lazy-load attribute changed
            if (attrName === 'src' || 
                attrName === 'data-src' || 
                attrName === 'data-lazy-src' ||
                attrName === 'data-original' ||
                attrName === 'data-lazy') {
              hasNewImages = true;
            }
          }
        }
      }
      
      // T049: Only re-scan if we actually detected changes
      // Use debouncing to avoid excessive re-scans
      if (hasNewImages) {
        // Debounce: wait a bit for multiple rapid mutations to settle
        clearTimeout((window as any).__capthat_scanTimeout);
        (window as any).__capthat_scanTimeout = setTimeout(() => {
          console.log('New images detected, re-scanning page');
          const newCapturableImages = detectCapturableImages();
          console.log(`Found ${newCapturableImages.length} capturable images after update`);
          
          // T046: Re-inject capture controls for new images
          // T049: This handles empty arrays gracefully
          injectCaptureControls(newCapturableImages);
        }, 300); // 300ms debounce
      }
    } catch (error) {
      // T049: Catch observer errors gracefully - don't let them break the extension
      console.debug('Error in image detection observer:', error);
    }
  });
  
  try {
    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      // T049: Watch common lazy-load attributes
      attributeFilter: ['src', 'data-src', 'data-lazy-src', 'data-original', 'data-lazy'],
    });
    
    console.log('Image detection observer set up for dynamic content');
  } catch (error) {
    // T049: If observer setup fails, log but don't throw
    console.debug('Could not setup image detection observer:', error);
  }
}

// ============================================================================
// Capture Control Injection
// ============================================================================

/**
 * Data attribute to mark images that already have capture controls
 */
const CAP_CONTROL_DATA_ATTR = 'data-capthat-has-control';

/**
 * CSS class name for the capture button (for styling isolation)
 */
const CAP_BUTTON_CLASS = 'capthat-capture-button';

/**
 * Inject "Cap!" buttons onto capturable images
 * 
 * Task: T046 - Inject capture controls into page
 * Task: T049 - Handle edge cases gracefully (empty array, broken images, lazy-loaded images)
 * 
 * Creates overlay buttons on capturable images with:
 * - "Cap!" button overlay positioned on image
 * - Inline styles to avoid page CSS conflicts
 * - Click handlers to trigger capture (T050 will implement message sending)
 * - Isolated styling to prevent page conflicts
 * 
 * @param capturableImages - Array of capturable image elements
 */
function injectCaptureControls(capturableImages: CapturableImage[]): void {
  // T049: Gracefully handle empty array (pages with no images)
  if (!capturableImages || capturableImages.length === 0) {
    console.debug('No capturable images to inject controls for');
    return;
  }
  
  let injectedCount = 0;
  
  for (const capturableImage of capturableImages) {
    try {
      const img = capturableImage.element;
      
      // T049: Validate image element still exists in DOM
      if (!img || !img.parentNode) {
        console.debug('Image element no longer in DOM, skipping');
        continue;
      }
      
      // Skip if image already has a capture control
      if (img.hasAttribute(CAP_CONTROL_DATA_ATTR)) {
        continue;
      }
      
      // T049: Handle images that may not be visible yet (lazy-loaded)
      // Check if image is in viewport or has dimensions
      const rect = img.getBoundingClientRect();
      
      // T049: For lazy-loaded images, they may have 0 dimensions initially
      // We still want to inject controls, but position them when image loads
      // Skip only if image is completely removed or invalid
      if (!img.offsetParent && rect.width === 0 && rect.height === 0 && img.complete) {
        // Image is hidden and completed loading with no dimensions - likely broken
        console.debug('Skipping hidden/broken image for control injection');
        continue;
      }
      
      // Create button overlay
      const button = createCaptureButton(img, capturableImage.src);
      
      // Mark image as having a control
      img.setAttribute(CAP_CONTROL_DATA_ATTR, 'true');
      
      // T049: Find container safely - handle edge cases where body might not exist
      const container = findPositionedContainer(img) || document.body;
      if (!container) {
        console.debug('No container available for button injection');
        continue;
      }
      
      // Add button to page first (needed for offsetWidth calculation)
      container.appendChild(button);
      
      // Position button relative to image (after it's in DOM so offsetWidth is available)
      // T049: For lazy-loaded images, position will update when image loads
      positionCaptureButton(img, button);
      
      injectedCount++;
      console.debug(`Injected capture control on image: ${capturableImage.src.substring(0, 50)}...`);
    } catch (error) {
      // T049: Continue with other images even if one fails
      // Don't let one broken image prevent others from getting controls
      console.debug('Error injecting capture control:', error);
      continue;
    }
  }
  
  console.log(`Injected ${injectedCount} capture controls`);
}

/**
 * Create a "Cap!" button element with isolated styling
 * 
 * Uses inline styles to avoid conflicts with page CSS.
 * Styled with Tailwind-like appearance (teal/cyan accents, rounded, glassmorphism).
 * 
 * T050: Button click handler implemented to send capture requests
 * 
 * @param img - The image element this button is for
 * @param imageUrl - The image URL to capture
 * @returns Button element ready to be added to DOM
 */
function createCaptureButton(img: HTMLImageElement, imageUrl: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = 'Cap!';
  button.className = CAP_BUTTON_CLASS;
  
  // T050: Set data attributes for identification (used by click handler)
  button.setAttribute('data-capthat-image-url', imageUrl);
  button.setAttribute('data-capthat-source-url', window.location.href);
  
  // Inline styles for isolated styling (Tailwind-like appearance)
  // Teal/cyan color scheme, glassmorphism effects, rounded corners
  button.style.cssText = `
    position: absolute;
    z-index: 999999;
    background: rgba(20, 184, 166, 0.9);
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease-in-out;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    pointer-events: auto;
    user-select: none;
    -webkit-user-select: none;
  `;
  
  // Hover state (using mouseenter/mouseleave since inline styles can't have :hover)
  button.addEventListener('mouseenter', () => {
    button.style.background = 'rgba(15, 118, 110, 0.95)';
    button.style.transform = 'scale(1.05)';
    button.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.background = 'rgba(20, 184, 166, 0.9)';
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  });
  
  // Active state
  button.addEventListener('mousedown', () => {
    button.style.background = 'rgba(13, 148, 136, 1)';
    button.style.transform = 'scale(0.95)';
  });
  
  button.addEventListener('mouseup', () => {
    button.style.background = 'rgba(15, 118, 110, 0.95)';
    button.style.transform = 'scale(1.05)';
  });
  
  // Click handler (T050: Implement capture button click handler)
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Prevent multiple rapid clicks
    if (button.disabled) {
      return;
    }
    
    // Disable button during capture
    button.disabled = true;
    button.style.opacity = '0.6';
    button.style.cursor = 'wait';
    
    // T050: Extract image URL and source page URL from button data attributes
    const captureImageUrl = button.getAttribute('data-capthat-image-url') || imageUrl;
    const captureSourceUrl = button.getAttribute('data-capthat-source-url') || window.location.href;
    
    // T050: Collect optional metadata from page
    const metadata: Record<string, unknown> = {
      pageTitle: document.title || undefined,
      domain: window.location.hostname || undefined,
      timestamp: Date.now(),
    };
    
    // Try to extract additional metadata if available
    // Look for Open Graph or meta tags that might have useful info
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
    
    if (ogTitle) {
      metadata.ogTitle = ogTitle;
    }
    if (ogUrl) {
      metadata.ogUrl = ogUrl;
    }
    
    // T050: Send CaptureRequestMessage to service worker
    const captureRequest: CaptureRequestMessage = {
      type: 'CAPTURE_REQUEST',
      payload: {
        imageUrl: captureImageUrl,
        sourceUrl: captureSourceUrl,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      },
    };
    
    try {
      console.log('Sending capture request:', captureRequest);
      
      // Send message to service worker and wait for response
      const response = await chrome.runtime.sendMessage(captureRequest) as CaptureResponseMessage | ErrorMessage | undefined;
      
      // T050: Handle capture response (basic handling - T059 will implement full error handling)
      if (isCaptureResponseMessage(response)) {
        if (response.payload.success) {
          console.log('Capture successful:', response.payload.itemId);
          // T059: Will show success toast
          // For now, just re-enable button
          button.disabled = false;
          button.style.opacity = '1';
          button.style.cursor = 'pointer';
        } else {
          console.error('Capture failed:', response.payload.error, response.payload.errorCategory);
          // T059: Will show error toast with retry button
          // For now, re-enable button so user can retry
          button.disabled = false;
          button.style.opacity = '1';
          button.style.cursor = 'pointer';
        }
      } else {
        // Received error message or unexpected response
        console.error('Unexpected response from service worker:', response);
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
      }
    } catch (error) {
      // Handle errors sending message (e.g., service worker not available)
      console.error('Error sending capture request:', error);
      // T059: Will show error toast
      // For now, re-enable button
      button.disabled = false;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  });
  
  // Keyboard accessibility
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'Capture this image');
  button.setAttribute('tabindex', '0');
  
  return button;
}

/**
 * Position the capture button as an overlay on the image
 * 
 * Positions the button in the top-right corner of the image,
 * with proper offset to avoid covering important image content.
 * 
 * Task: T049 - Handle lazy-loaded images by updating position when image loads
 * 
 * @param img - The image element
 * @param button - The button element to position
 */
function positionCaptureButton(img: HTMLImageElement, button: HTMLButtonElement): void {
  // T049: Update position function that handles lazy-loaded images
  const updatePosition = () => {
    try {
      // T049: Check if image still exists in DOM
      if (!img || !img.parentNode) {
        return;
      }
      
      // Get image position relative to viewport
      const imgRect = img.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      // T049: For lazy-loaded images that haven't loaded yet, they may have 0 dimensions
      // Still position button, it will update when image loads
      const offset = 8;
      const buttonTop = imgRect.top + scrollY + offset;
      const buttonLeft = imgRect.left + scrollX + Math.max(0, imgRect.width - button.offsetWidth - offset);
      
      button.style.top = `${buttonTop}px`;
      button.style.left = `${buttonLeft}px`;
    } catch (error) {
      // T049: Gracefully handle positioning errors (e.g., image removed from DOM)
      console.debug('Error updating button position:', error);
    }
  };
  
  // Initial position
  updatePosition();
  
  // T049: For lazy-loaded images, update position when image actually loads
  // Only add listener if image hasn't loaded yet
  if (!img.complete) {
    const onLoad = () => {
      updatePosition();
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
    
    const onError = () => {
      // Image failed to load - hide button or handle gracefully
      console.debug('Image failed to load, button may be positioned incorrectly');
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
    
    img.addEventListener('load', onLoad, { once: true });
    img.addEventListener('error', onError, { once: true });
    
    // Store cleanup function for lazy-load listeners
    const existingCleanup = (button as any).__capthat_cleanup;
    (button as any).__capthat_cleanup = () => {
      if (existingCleanup) existingCleanup();
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }
  
  // Update position on scroll/resize
  // Throttle scroll/resize events for performance
  let updateTimeout: number | null = null;
  const throttledUpdate = () => {
    if (updateTimeout !== null) {
      return;
    }
    updateTimeout = window.setTimeout(() => {
      updatePosition();
      updateTimeout = null;
    }, 100);
  };
  
  window.addEventListener('scroll', throttledUpdate, { passive: true });
  window.addEventListener('resize', throttledUpdate, { passive: true });
  
  // Store cleanup function on button for later removal
  const existingCleanup = (button as any).__capthat_cleanup;
  (button as any).__capthat_cleanup = () => {
    window.removeEventListener('scroll', throttledUpdate);
    window.removeEventListener('resize', throttledUpdate);
    if (existingCleanup) existingCleanup();
  };
}

/**
 * Find a positioned container for the button (relative, absolute, or fixed)
 * 
 * If the image is inside a positioned container, we should append the button
 * to that container instead of body to maintain proper positioning context.
 * 
 * @param element - Element to search from
 * @returns Positioned ancestor or null
 */
function findPositionedContainer(element: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = element;
  
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const position = style.position;
    
    if (position === 'relative' || position === 'absolute' || position === 'fixed' || position === 'sticky') {
      return current;
    }
    
    current = current.parentElement;
  }
  
  return null;
}

/**
 * Remove capture controls from images
 * 
 * Useful for cleanup or when images are removed from the page.
 * 
 * @param images - Image elements to remove controls from
 */
function removeCaptureControls(images: NodeListOf<HTMLImageElement> | HTMLImageElement[]): void {
  for (const img of images) {
    if (img.hasAttribute(CAP_CONTROL_DATA_ATTR)) {
      // Find and remove associated button
      const buttons = document.querySelectorAll<HTMLButtonElement>(`.${CAP_BUTTON_CLASS}`);
      for (const button of buttons) {
        const buttonImageUrl = button.getAttribute('data-capthat-image-url');
        if (buttonImageUrl === (img.src || img.getAttribute('src'))) {
          // Cleanup event listeners
          if ((button as any).__capthat_cleanup) {
            (button as any).__capthat_cleanup();
          }
          button.remove();
          break;
        }
      }
      
      // Remove data attribute
      img.removeAttribute(CAP_CONTROL_DATA_ATTR);
    }
  }
}

