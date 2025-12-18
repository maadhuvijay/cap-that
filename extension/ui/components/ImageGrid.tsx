/**
 * ImageGrid Component
 * Grid layout with N slots, placeholder support, virtual scrolling configuration
 * Styled with Tailwind CSS
 * 
 * Task: T035 - Create ImageGrid component at extension/ui/components/ImageGrid.tsx
 */

import React from 'react';
import { ImageCard } from './ImageCard';
import type { CapturedItem } from '../../types';

interface ImageGridProps {
  items: CapturedItem[];
  slots?: number;
  columns?: number;
  virtualScrolling?: boolean;
  placeholderText?: string;
  onRemoveItem?: (itemId: string) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  items,
  slots = 10,
  columns = 5,
  virtualScrolling = true,
  placeholderText = 'Click Cap! to capture images',
  onRemoveItem,
}) => {
  // Create array of slots (filled with items + empty placeholders)
  const slotCount = Math.max(slots, items.length);
  const slotsArray = Array.from({ length: slotCount }, (_, index) => {
    return items[index] || null;
  });

  // Grid columns class based on columns prop (Tailwind requires explicit classes)
  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[columns] || 'grid-cols-5';

  // Empty state
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full glass-card flex items-center justify-center">
            <svg
              className="w-8 h-8 text-teal-400/60"
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
          <p className="text-slate-400 text-sm">{placeholderText}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid ${gridColsClass} gap-3 p-4 auto-rows-fr`}
      role="grid"
      aria-label="Cap board grid"
    >
      {slotsArray.map((item, index) => {
        if (!item) {
          // Empty slot placeholder
          return (
            <div
              key={`empty-${index}`}
              className="aspect-square rounded-lg glass-card border border-teal-500/10 flex items-center justify-center"
            >
              <div className="text-center p-4">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-teal-400/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-xs text-slate-500">{placeholderText}</p>
              </div>
            </div>
          );
        }

        // Filled slot with captured item
        const imageUrl =
          typeof item.imageReference.urlOrBlob === 'string'
            ? item.imageReference.urlOrBlob
            : item.imageReference.thumbnail || '';

        return (
          <ImageCard
            key={item.id}
            item={item}
            imageUrl={imageUrl}
            thumbnail={item.imageReference.thumbnail}
            metadata={item.metadata}
            onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
          />
        );
      })}
    </div>
  );
};

