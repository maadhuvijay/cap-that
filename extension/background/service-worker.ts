// Background service worker for CapThat extension
// Handles message routing, storage operations, and export orchestration

console.log('CapThat service worker loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('CapThat extension installed');
});

// Listen for messages from content scripts and UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  
  // TODO: Implement message handlers
  // - Capture requests from content script
  // - Storage updates
  // - Export requests
  
  return true; // Keep message channel open for async response
});

// Listen for side panel connection (to detect when it opens)
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidePanel') {
    console.log('CapThat side panel opened');
    
    port.onDisconnect.addListener(() => {
      console.log('CapThat side panel closed');
    });
  }
});

// Listen for action button click
chrome.action.onClicked.addListener((tab) => {
  console.log('Action button clicked for tab:', tab.id);
  // Open side panel
  if (tab.id !== undefined) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

