/**
 * ImageCard Component
 * Individual image card with floating "Cap!" button overlay
 * Hover effects with lift and glow
 */

import React from 'react';
import { ActionButton } from './ActionButton';

interface ImageCardProps {
  imageUrl: string;
  alt?: string;
  onCapture: () => void;
  isCaptured?: boolean;
  metadata?: {
    title?: string;
    domain?: string;
  };
}

export const ImageCard: React.FC<ImageCardProps> = ({
  imageUrl,
  alt = 'Capturable image',
  onCapture,
  isCaptured = false,
  metadata,
}) => {
  return (
    <div className="group relative w-full aspect-square rounded-xl overflow-hidden bg-slate-800/40 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1">
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Overlay gradient for better button visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Metadata (optional) */}
      {metadata && (metadata.title || metadata.domain) && (
        <div className="absolute top-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-slate-200">
            {metadata.title && (
              <div className="font-medium truncate">{metadata.title}</div>
            )}
            {metadata.domain && (
              <div className="text-cyan-400/80 text-[10px] truncate">
                {metadata.domain}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cap! Button - Floating in bottom-right */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <button
          onClick={onCapture}
          disabled={isCaptured}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-cyan-500/40 hover:shadow-cyan-400/50 transition-all duration-200 hover:scale-110 active:scale-95 border border-cyan-300/30 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isCaptured ? 'Already captured' : 'Capture image'}
        >
          {isCaptured ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            'Cap!'
          )}
        </button>
      </div>

      {/* Captured indicator badge */}
      {isCaptured && (
        <div className="absolute top-2 right-2">
          <div className="bg-cyan-500/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-white shadow-lg">
            ✓ Captured
          </div>
        </div>
      )}
    </div>
  );
};

