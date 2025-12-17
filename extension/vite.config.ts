import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../build/extension',
    emptyOutDir: true,
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
            return 'background/service-worker.js';
          }
          if (chunkInfo.name === 'content/content-script') {
            return 'content/content-script.js';
          }
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@shared': resolve(__dirname, '../shared'),
    },
  },
});

