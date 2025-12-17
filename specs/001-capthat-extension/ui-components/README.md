# CapThat UI Components

Initial UI implementation with futuristic dark theme using Tailwind CSS only.

## Components

### Header.tsx
Browser-like header with URL bar and navigation arrows.

**Props**:
- `currentUrl?: string` - Current page URL to display
- `onBack?: () => void` - Back button handler
- `onForward?: () => void` - Forward button handler
- `canGoBack?: boolean` - Whether back navigation is available
- `canGoForward?: boolean` - Whether forward navigation is available

### ActionButton.tsx
Reusable button component with hover states and micro-interactions.

**Props**:
- `label: string` - Button text
- `onClick: () => void` - Click handler
- `variant?: 'primary' | 'secondary' | 'danger'` - Button style variant
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `disabled?: boolean` - Disabled state
- `icon?: React.ReactNode` - Optional icon element
- `className?: string` - Additional CSS classes

### ImageCard.tsx
Individual image card with floating "Cap!" button overlay.

**Props**:
- `imageUrl: string` - Image source URL
- `alt?: string` - Image alt text
- `onCapture: () => void` - Capture button handler
- `isCaptured?: boolean` - Whether image is already captured
- `metadata?: { title?: string; domain?: string }` - Optional metadata

### ImageGrid.tsx
Main content grid of image cards with empty state handling.

**Props**:
- `images: ImageItem[]` - Array of image items to display
- `onCapture: (id: string) => void` - Capture handler (receives image ID)
- `emptyMessage?: string` - Message to show when no images
- `gridCols?: number` - Number of grid columns (2, 3, or 4)

### CapBoardPanel.tsx
Right-side floating panel with board grid and action buttons.

**Props**:
- `items: CapturedItem[]` - Array of captured items
- `onClear: () => void` - Clear board handler
- `onExportJSON: () => void` - Export JSON handler
- `onExportZIP: () => void` - Export ZIP handler
- `onExportIndividual: () => void` - Export individual images handler
- `onRemoveItem?: (id: string) => void` - Remove individual item handler
- `maxItems?: number` - Maximum items allowed (default: 100)
- `warningThreshold?: number` - Warning threshold (default: 80)

### MainLayout.tsx
Complete page layout example combining all components.

**Usage**: Reference implementation showing how components work together.

## Design System

### Colors
- **Primary Accent**: Cyan/Teal gradient (`from-cyan-500 to-teal-500`)
- **Background**: Dark slate (`slate-900`, `slate-800`)
- **Text**: Light slate (`slate-200`, `slate-400`)
- **Borders**: Cyan with opacity (`cyan-500/20`)

### Effects
- **Glassmorphism**: `backdrop-blur-md` with semi-transparent backgrounds
- **Gradients**: Subtle gradients on buttons and backgrounds
- **Shadows**: Colored shadows with cyan/teal accents
- **Transitions**: 200-300ms smooth transitions

### Typography
- **Headings**: Bold with gradient text (`bg-clip-text text-transparent`)
- **Body**: Regular weight, high contrast on dark background

## Implementation Notes

1. **Tailwind Only**: No external UI libraries, pure Tailwind CSS
2. **Dark Mode**: All components use dark theme by default
3. **Accessibility**: Keyboard navigation, ARIA labels, focus states
4. **Responsive**: Components adapt to container sizes
5. **Performance**: Lazy loading for images, optimized transitions

## Next Steps

1. Integrate with extension content script for real image detection
2. Connect to storage layer for persistence
3. Implement export functionality
4. Add toast notification system
5. Test on various screen sizes and browsers

