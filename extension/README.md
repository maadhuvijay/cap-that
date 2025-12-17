# CapThat Chrome Extension

Chrome Extension (Manifest V3) for capturing and organizing images into a mood board.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build:extension
   ```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build/extension` directory

## Development

The extension is built using:
- **Vite** for bundling
- **TypeScript** for type safety
- **React** for UI components
- **Manifest V3** for Chrome Extension API

## Project Structure

```
extension/
├── background/
│   └── service-worker.ts    # Background service worker
├── content/
│   └── content-script.ts    # Content script for image detection
├── ui/
│   ├── side-panel.html      # Side panel HTML entry point
│   ├── side-panel.tsx        # React component for side panel
│   └── components/           # UI components
├── storage/                  # Storage adapters
├── export/                   # Export functionality
├── validation/               # Input validation
├── types/                    # TypeScript type definitions
├── manifest.json             # Extension manifest
├── vite.config.ts            # Vite build configuration
└── tsconfig.json             # TypeScript configuration
```

## Icons

Placeholder icons need to be created in `extension/icons/`:
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

The extension will work without icons (Chrome will use default icons), but custom icons should be added before distribution.

## Build Output

The build output is located in `build/extension/` and includes:
- Compiled JavaScript files
- Copied manifest.json
- Copied icons (if present)

