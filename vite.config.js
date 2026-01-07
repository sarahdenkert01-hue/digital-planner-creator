import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'konva-vendor': ['react-konva', 'konva'],
          'pdf-vendor': ['jspdf', 'pdf-lib']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-konva', 'konva', 'jspdf', 'pdf-lib']
  }
})
