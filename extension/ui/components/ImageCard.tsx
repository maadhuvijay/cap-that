/**
 * ImageCard Component
 * Individual image card with thumbnail display, metadata display, hover states
 * Styled with Tailwind CSS
 * 
 * Task: T036 - Create ImageCard component at extension/ui/components/ImageCard.tsx
 */

import React from 'react';
import type { CapturedItem } from '../../types';

interface ImageCardProps {
  item: CapturedItem;
  imageUrl: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
  onRemove?: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  item,
  imageUrl,
  thumbnail,
  metadata,
  onRemove,
}) => {
  // Extract metadata fields
  const title = metadata?.title as string | undefined;
  const domain = metadata?.domain as string | undefined;

  // Use thumbnail if available, otherwise fall back to imageUrl
  const displayImage = thumbnail || imageUrl;

  // Quality indicator badge
  const showQualityIndicator =
    item.qualityIndicator === 'url-only' || item.qualityIndicator === 'fallback';

  return (
    <div className="group relative w-full aspect-square rounded-lg overflow-hidden glass-card border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 hover-lift hover-glow-teal">
      {/* Thumbnail Image */}
      <div className="absolute inset-0">
        <img
          src={displayImage}
          alt={title || 'Captured image'}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%231a1a1a" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="%23a0a0a0" font-size="12"%3EImage%3C/text%3E%3C/svg%3E';
          }}
        />
        {/* Overlay gradient for better metadata visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Quality Indicator Badge */}
      {showQualityIndicator && (
        <div className="absolute top-2 left-2 z-10">
          <div className="glass-strong rounded-full px-2 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/30">
            ⚠ Fallback
          </div>
        </div>
      )}

      {/* Remove Button (X) - appears on hover */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-red-500/90 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs font-bold shadow-lg focus-ring"
          aria-label="Remove item"
        >
          ×
        </button>
      )}

      {/* Metadata Display - appears on hover */}
      {(title || domain) && (
        <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="glass-strong rounded-t-lg px-3 py-2">
            {title && (
              <div className="text-xs font-medium text-slate-200 truncate mb-1">
                {title}
              </div>
            )}
            {domain && (
              <div className="text-[10px] text-teal-400/80 truncate">
                {domain}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

