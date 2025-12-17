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

// Listen for side panel open
chrome.sidePanel.onOpened.addListener(() => {
  console.log('CapThat side panel opened');
});

// Listen for action button click
chrome.action.onClicked.addListener((tab) => {
  console.log('Action button clicked for tab:', tab.id);
  // Open side panel
  chrome.sidePanel.open({ tabId: tab.id });
});

