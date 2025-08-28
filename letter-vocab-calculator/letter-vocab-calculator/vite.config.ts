import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Vite configuration with React and PWA support.  This configuration
// registers a service worker for offline functionality and defines
// a default manifest.  The server is configured to automatically
// open the browser when running in development mode.
export default defineConfig({
  plugins: [
    react(),
    // PWA plugin provides offline support and a web manifest
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Letter Vocabulary Calculator',
        short_name: 'LetterCalc',
        description: 'Real‑time letter and vocabulary calculator with SNS limits',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    open: true
  }
});