import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sibling_vibes/',
  server: {
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
