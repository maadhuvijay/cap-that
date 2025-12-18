import React from 'react';
import { createRoot } from 'react-dom/client';

function SidePanel() {
  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1>CapThat</h1>
      <p>Side panel UI will be implemented in Phase 4 (User Story 2)</p>
    </div>
  );
}

// Establish connection with service worker to notify it that side panel is open
const port = chrome.runtime.connect({ name: 'sidePanel' });

// Handle disconnection when side panel closes
window.addEventListener('beforeunload', () => {
  port.disconnect();
});

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
}

