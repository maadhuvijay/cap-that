/**
 * CapBoardPanel Component
 * Main panel component with Header, ImageGrid for captured items, action buttons
 * Empty state with placeholder text "Click Cap! to capture images"
 * Styled with Tailwind CSS
 * 
 * Task: T037 - Create CapBoardPanel component at extension/ui/components/CapBoardPanel.tsx
 */

import React, { useState } from 'react';
import { Header } from './Header';
import { ImageGrid } from './ImageGrid';
import { ActionButton } from './ActionButton';
import type { CapturedItem, GridConfig } from '../../types';

interface CapBoardPanelProps {
  items: CapturedItem[];
  gridConfig?: GridConfig;
  onClear: () => void;
  onExportJSON: () => void;
  onExportZIP: () => void;
  onExportIndividual: () => void;
  onRemoveItem?: (id: string) => void;
  maxItems?: number;
  warningThreshold?: number;
}

export const CapBoardPanel: React.FC<CapBoardPanelProps> = ({
  items,
  gridConfig = { slots: 10, columns: 5, virtualScrolling: true },
  onClear,
  onExportJSON,
  onExportZIP,
  onExportIndividual,
  onRemoveItem,
  maxItems = 100,
  warningThreshold = 80,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const itemCount = items.length;
  const isNearLimit = itemCount >= warningThreshold;
  const isAtLimit = itemCount >= maxItems;

  const handleClear = () => {
    if (showClearConfirm) {
      onClear();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-dark-bg">
      {/* Header Component */}
      <Header />

      {/* Warning Banner */}
      {isNearLimit && (
        <div
          className={`px-6 py-2 text-xs border-b ${
            isAtLimit
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          }`}
        >
          {isAtLimit
            ? `Board full (${itemCount}/${maxItems})`
            : `Approaching limit (${itemCount}/${maxItems})`}
        </div>
      )}

      {/* ImageGrid Component */}
      <div className="flex-1 overflow-y-auto">
        <ImageGrid
          items={items}
          slots={gridConfig.slots}
          columns={gridConfig.columns}
          virtualScrolling={gridConfig.virtualScrolling}
          placeholderText="Click Cap! to capture images"
          onRemoveItem={onRemoveItem}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-4 border-t border-teal-500/20 glass-light space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <ActionButton
            label="Clear Cap Board"
            onClick={handleClear}
            variant="danger"
            size="sm"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            }
          />
          <ActionButton
            label="Export JSON"
            onClick={onExportJSON}
            variant="secondary"
            size="sm"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ActionButton
            label="Export CapBoard"
            onClick={onExportZIP}
            variant="secondary"
            size="sm"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
          <ActionButton
            label="Export Individual Caps"
            onClick={onExportIndividual}
            variant="secondary"
            size="sm"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-strong rounded-xl border border-red-500/30 shadow-2xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-2">
              Clear Cap Board?
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              This will permanently remove all {itemCount} captured items. This
              action cannot be undone.
            </p>
            <div className="flex gap-2">
              <ActionButton
                label="Cancel"
                onClick={() => setShowClearConfirm(false)}
                variant="secondary"
                size="sm"
                className="flex-1"
              />
              <ActionButton
                label="Clear All"
                onClick={handleClear}
                variant="danger"
                size="sm"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

