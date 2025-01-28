import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Enable PWA during development
        type: 'module', // Ensure modern service worker support
      },
      srcDir: 'src',
      filename: 'service-worker.ts',
      includeAssets: ['favicon.ico', 'robots.txt'], // Add static assets
      manifest: {
        name: 'DentalSync',
        short_name: 'DentalSync',
        description: 'A dental management system with offline support.',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logoclinic.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logoclinic.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.yourdomain\.com\/.*$/, // Cache API responses
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300, // Cache for 5 minutes
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/, // Cache images
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 1 week
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "worker-file": ["src/workers/webSocketWorker.ts"],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Alias for `src`
      '@teeth': fileURLToPath(new URL('./src/features/clinic/components/teeth', import.meta.url)),
      '@styles-cl': fileURLToPath(new URL('./src/features/clinic/styles', import.meta.url)),
    },
  },
});

