/**
 * MainLayout Component
 * Complete page layout combining Header, ImageGrid, and CapBoardPanel
 * Example usage showing the full UI structure
 */

import React, { useState } from 'react';
import { Header } from './Header';
import { ImageGrid } from './ImageGrid';
import { CapBoardPanel } from './CapBoardPanel';

// Example data types
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

export const MainLayout: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('https://www.example.com');
  const [images, setImages] = useState<ImageItem[]>([
    // Example images - replace with actual detected images
    {
      id: '1',
      imageUrl: 'https://via.placeholder.com/400',
      alt: 'Example image 1',
      metadata: { title: 'Product Image', domain: 'example.com' },
      isCaptured: false,
    },
    {
      id: '2',
      imageUrl: 'https://via.placeholder.com/400',
      alt: 'Example image 2',
      metadata: { title: 'Another Image', domain: 'example.com' },
      isCaptured: false,
    },
  ]);

  const [capturedItems, setCapturedItems] = useState<CapturedItem[]>([]);

  const handleCapture = (imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    // Add to captured items
    const newItem: CapturedItem = {
      id: imageId,
      imageUrl: image.imageUrl,
      sourceUrl: currentUrl,
      timestamp: Date.now(),
      metadata: image.metadata,
    };

    setCapturedItems([...capturedItems, newItem]);

    // Mark as captured in images list
    setImages(
      images.map((img) =>
        img.id === imageId ? { ...img, isCaptured: true } : img
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCapturedItems(capturedItems.filter((item) => item.id !== itemId));
    // Also mark as not captured in images list
    setImages(
      images.map((img) =>
        img.id === itemId ? { ...img, isCaptured: false } : img
      )
    );
  };

  const handleClear = () => {
    setCapturedItems([]);
    setImages(images.map((img) => ({ ...img, isCaptured: false })));
  };

  const handleExportJSON = () => {
    console.log('Export JSON:', capturedItems);
    // Implementation: Generate and download JSON
  };

  const handleExportZIP = () => {
    console.log('Export ZIP:', capturedItems);
    // Implementation: Generate and download ZIP
  };

  const handleExportIndividual = () => {
    console.log('Export Individual:', capturedItems);
    // Implementation: Download individual images
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background grid pattern */}
      <div
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <Header
          currentUrl={currentUrl}
          onBack={() => console.log('Back')}
          onForward={() => console.log('Forward')}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Image Grid */}
          <div className="flex-1 overflow-y-auto">
            <ImageGrid
              images={images}
              onCapture={handleCapture}
              emptyMessage="No images found on this page"
              gridCols={2}
            />
          </div>

          {/* Right: Cap Board Panel */}
          <CapBoardPanel
            items={capturedItems}
            onClear={handleClear}
            onExportJSON={handleExportJSON}
            onExportZIP={handleExportZIP}
            onExportIndividual={handleExportIndividual}
            onRemoveItem={handleRemoveItem}
            maxItems={100}
            warningThreshold={80}
          />
        </div>
      </div>
    </div>
  );
};

