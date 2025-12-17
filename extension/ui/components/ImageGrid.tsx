/**
 * ImageGrid Component
 * Main content grid of image cards
 * Handles empty state placeholders
 */

import React from 'react';
import { ImageCard } from './ImageCard';

interface ImageItem {
  id: string;
  imageUrl: string;
  alt?: string;
  metadata?: {
    title?: string;
    domain?: string;
  };
  isCaptured?: boolean;
}

interface ImageGridProps {
  images: ImageItem[];
  onCapture: (id: string) => void;
  emptyMessage?: string;
  gridCols?: number;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onCapture,
  emptyMessage = 'No images found on this page',
  gridCols = 2,
}) => {
  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[gridCols] || 'grid-cols-2';

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/60 backdrop-blur-sm border border-cyan-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-cyan-400/60"
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
          <p className="text-slate-400 text-sm">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid ${gridColsClass} gap-4 p-4 auto-rows-fr`}
      role="grid"
      aria-label="Image grid"
    >
      {images.map((image) => (
        <ImageCard
          key={image.id}
          imageUrl={image.imageUrl}
          alt={image.alt}
          onCapture={() => onCapture(image.id)}
          isCaptured={image.isCaptured}
          metadata={image.metadata}
        />
      ))}
    </div>
  );
};

