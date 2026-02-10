import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../src/movie_app/static/dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/get_movie_suggestion': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/select_movie': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
