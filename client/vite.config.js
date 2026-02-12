// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ARCHITECTURE NOTE: Explicitly define build settings for CI/CD reliability
  build: {
    outDir: 'dist',       // Standard output directory
    emptyOutDir: true,    // Clean directory before building
    sourcemap: false      // Disable source maps for production (smaller bundle, security)
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})