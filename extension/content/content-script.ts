// Content script for CapThat extension
// Detects images on the page and enables capture mode
// Uses isolated world (default in MV3) - no unsafeWindow access

console.log('CapThat content script loaded');

// Initialize content script
function init() {
  console.log('Initializing CapThat content script');
  
  // TODO: Implement image detection
  // - Query for <img> elements
  // - Filter valid image sources (http/https/data)
  // - Handle lazy-loaded images
  // - Inject "Cap!" buttons with isolation
  
  // TODO: Setup message passing to service worker
  // - Send capture requests
  // - Receive responses
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Listen for messages from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  // TODO: Handle messages from service worker
  // - Update UI state
  // - Handle errors
  
  return true;
});

