import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  // Define Chrome extension globals for type checking
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  build: {
    outDir: '../build/extension',
    emptyOutDir: true,
    // Enable source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
    // Minify in production
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
    rollupOptions: {
      input: {
        'background/service-worker': resolve(__dirname, 'background/service-worker.ts'),
        'content/content-script': resolve(__dirname, 'content/content-script.ts'),
        'ui/side-panel': resolve(__dirname, 'ui/side-panel.html'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep directory structure for service worker and content script
          if (chunkInfo.name === 'background/service-worker') {
            // Service worker must be ES module for MV3
            return 'background/service-worker.js';
          }
          if (chunkInfo.name === 'content/content-script') {
            return 'content/content-script.js';
          }
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Preserve CSS file names for easier debugging
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Ensure ES module format for MV3 compatibility
        format: 'es',
      },
    },
    // Target ES2020 for Chrome extension compatibility
    target: 'es2020',
    // Chunk size warning limit (extensions can have larger chunks)
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@shared': resolve(__dirname, '../shared'),
    },
  },
  // Optimize dependencies for extension build
  optimizeDeps: {
    exclude: ['chrome'],
  },
});

