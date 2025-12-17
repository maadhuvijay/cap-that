/**
 * CapBoardPanel Component
 * Right-side floating panel with board grid and action buttons
 * Futuristic glassmorphism design
 */

import React, { useState } from 'react';
import { ActionButton } from './ActionButton';

interface CapturedItem {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  sourceUrl: string;
  timestamp: number;
  metadata?: {
    title?: string;
    domain?: string;
  };
}

interface CapBoardPanelProps {
  items: CapturedItem[];
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
    <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-l border-cyan-500/20 shadow-2xl shadow-cyan-500/10 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          CapThat!
        </h2>
        {isNearLimit && (
          <div
            className={`mt-2 text-xs px-2 py-1 rounded ${
              isAtLimit
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}
          >
            {isAtLimit
              ? `Board full (${itemCount}/${maxItems})`
              : `Approaching limit (${itemCount}/${maxItems})`}
          </div>
        )}
      </div>

      {/* Board Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-slate-800/40 backdrop-blur-sm border border-cyan-500/20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-cyan-400/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-slate-400 text-sm mb-1">Empty Cap Board</p>
              <p className="text-slate-500 text-xs">
                Click "Cap!" to capture images
              </p>
            </div>
          </div>
        ) : (
          <div
            className="grid grid-cols-4 gap-2 auto-rows-fr"
            role="grid"
            aria-label="Cap board grid"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-lg overflow-hidden bg-slate-800/40 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <img
                  src={item.thumbnailUrl || item.imageUrl}
                  alt={item.metadata?.title || 'Captured image'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Remove button on hover */}
                {onRemoveItem && (
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs font-bold shadow-lg"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                )}
                {/* Metadata tooltip on hover */}
                {item.metadata && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {item.metadata.title && (
                      <div className="text-xs text-slate-200 truncate">
                        {item.metadata.title}
                      </div>
                    )}
                    {item.metadata.domain && (
                      <div className="text-[10px] text-cyan-400/80 truncate">
                        {item.metadata.domain}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-4 border-t border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm space-y-2">
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
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-xl border border-red-500/30 shadow-2xl p-6 max-w-sm mx-4">
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

