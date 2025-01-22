import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "worker-file": ["src/websockets/webSocketWorker.ts"],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias for the `src` directory
      '@teeth': path.resolve(__dirname, './src/features/clinic/components/teeth'),
      '@styles-cl': path.resolve(__dirname, './src/features/clinic/styles'),
    },
  },
});

console.log(path.resolve(__dirname, './src'));
