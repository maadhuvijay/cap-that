/**
 * Side Panel Entry Point
 * Integrates React components and handles side panel lifecycle
 * 
 * Task: T039 - Integrate React components in extension/ui/side-panel.tsx
 */

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CapBoardPanel } from './components/CapBoardPanel';
import type { CapturedItem, CapBoard, GridConfig } from '../types';
import './globals.css';

function SidePanel() {
  const [board, setBoard] = useState<CapBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load board from storage on mount
  useEffect(() => {
    const loadBoard = async () => {
      try {
        // TODO: Load from storage adapter (T060)
        // For now, initialize with empty board
        const emptyBoard: CapBoard = {
          items: [],
          metadata: {
            creationDate: Date.now(),
            lastModified: Date.now(),
            version: '1.0.0',
          },
          gridConfig: {
            slots: 10,
            columns: 5,
            virtualScrolling: true,
          },
        };
        setBoard(emptyBoard);
      } catch (error) {
        console.error('Failed to load board:', error);
        // Initialize with empty board on error
        const emptyBoard: CapBoard = {
          items: [],
          metadata: {
            creationDate: Date.now(),
            lastModified: Date.now(),
            version: '1.0.0',
          },
          gridConfig: {
            slots: 10,
            columns: 5,
            virtualScrolling: true,
          },
        };
        setBoard(emptyBoard);
      } finally {
        setIsLoading(false);
      }
    };

    loadBoard();
  }, []);

  // Listen for storage updates from service worker
  useEffect(() => {
    const messageListener = (message: unknown) => {
      // TODO: Handle StorageUpdateMessage (T065)
      console.log('Received message:', message);
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  // Action handlers (will be wired up in later tasks)
  const handleClear = () => {
    if (board) {
      const clearedBoard: CapBoard = {
        ...board,
        items: [],
        metadata: {
          ...board.metadata,
          lastModified: Date.now(),
        },
      };
      setBoard(clearedBoard);
      // TODO: Save to storage (T075)
    }
  };

  const handleExportJSON = () => {
    // TODO: Implement JSON export (T083-T085)
    console.log('Export JSON clicked');
  };

  const handleExportZIP = () => {
    // TODO: Implement ZIP export (T093-T097)
    console.log('Export ZIP clicked');
  };

  const handleExportIndividual = () => {
    // TODO: Implement individual export (T088-T092)
    console.log('Export Individual clicked');
  };

  const handleRemoveItem = (itemId: string) => {
    if (board) {
      const updatedBoard: CapBoard = {
        ...board,
        items: board.items.filter((item) => item.id !== itemId),
        metadata: {
          ...board.metadata,
          lastModified: Date.now(),
        },
      };
      setBoard(updatedBoard);
      // TODO: Save to storage (T070)
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-bg">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-bg">
        <div className="text-slate-400">Failed to load board</div>
      </div>
    );
  }

  return (
    <CapBoardPanel
      items={board.items}
      gridConfig={board.gridConfig}
      onClear={handleClear}
      onExportJSON={handleExportJSON}
      onExportZIP={handleExportZIP}
      onExportIndividual={handleExportIndividual}
      onRemoveItem={handleRemoveItem}
      maxItems={100}
      warningThreshold={80}
    />
  );
}

// Establish connection with service worker to notify it that side panel is open
const port = chrome.runtime.connect({ name: 'sidePanel' });

// Handle disconnection when side panel closes
window.addEventListener('beforeunload', () => {
  port.disconnect();
});

// Initialize React app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
} else {
  console.error('Root container not found');
}

