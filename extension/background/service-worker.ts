/**
 * Background Service Worker for CapThat Chrome Extension
 * 
 * This service worker handles:
 * - Message routing between content scripts, UI, and background
 * - Storage operations (chrome.storage.local and IndexedDB)
 * - Image capture orchestration
 * - Export operations (JSON, ZIP, individual images)
 * - Board state management
 * 
 * Task: T007 - Create background service worker stub
 * 
 * Future tasks will implement:
 * - T027: Message type definitions
 * - T028: Message validation
 * - T051-T059: Capture request handling
 * - T070, T075: Board update handling
 * - T084, T096: Export request handling
 */

console.log('CapThat service worker loaded');

// ============================================================================
// Extension Lifecycle
// ============================================================================

/**
 * Handle extension installation and updates
 * 
 * Future: Initialize default board state, migrate data if needed
 */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('CapThat extension installed/updated:', details.reason);
  
  // TODO: Initialize default board state if first install
  // TODO: Handle data migration on updates
});

// ============================================================================
// Message Handling
// ============================================================================

/**
 * Main message router for all extension communication
 * 
 * Handles messages from:
 * - Content scripts (capture requests)
 * - UI/side panel (board updates, export requests)
 * 
 * Future: Implement message validation (T028) and handlers for:
 * - CAPTURE_REQUEST (T051-T059)
 * - BOARD_UPDATE (T070, T075)
 * - EXPORT_REQUEST (T084, T096)
 */
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    console.log('Message received:', message, 'from:', sender);
    
    // TODO: Validate message structure (T028)
    // TODO: Route to appropriate handler based on message.type
    
    // Placeholder handlers for future implementation:
    if (message.type === 'CAPTURE_REQUEST') {
      // TODO: T051-T059 - Handle capture request
      // - Validate image URL and source URL
      // - Attempt image fetch with CORS fallback
      // - Create CapturedItem
      // - Check board size limits
      // - Save to storage
      // - Send response
      console.log('Capture request received (not yet implemented)');
    } else if (message.type === 'BOARD_UPDATE') {
      // TODO: T070, T075 - Handle board updates
      // - Remove item or clear board
      // - Update storage
      // - Send storage update message to UI
      console.log('Board update received (not yet implemented)');
    } else if (message.type === 'EXPORT_REQUEST') {
      // TODO: T084, T096 - Handle export requests
      // - JSON export
      // - ZIP export
      // - Individual image export
      console.log('Export request received (not yet implemented)');
    }
    
    // Return true to keep message channel open for async responses
    return true;
  }
);

// ============================================================================
// Side Panel Management
// ============================================================================

/**
 * Handle side panel connections
 * 
 * Future: Send initial board state when panel opens
 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidePanel') {
    console.log('CapThat side panel opened');
    
    // TODO: Send initial board state to panel when it opens
    // TODO: Listen for messages from panel
    
    port.onDisconnect.addListener(() => {
      console.log('CapThat side panel closed');
    });
  }
});

// ============================================================================
// Action Button
// ============================================================================

/**
 * Handle extension action button click
 * Opens the side panel for the current tab
 */
chrome.action.onClicked.addListener((tab) => {
  console.log('Action button clicked for tab:', tab.id);
  
  if (tab.id !== undefined) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// ============================================================================
// Storage Listeners (Future)
// ============================================================================

/**
 * Listen for storage changes from other extension contexts
 * 
 * Future: T065 - Update UI when storage changes externally
 */
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    console.log('Storage changed:', changes);
    
    // TODO: Broadcast storage updates to UI
    // TODO: Handle board metadata changes
  }
});

