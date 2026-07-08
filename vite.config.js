import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  // Inline images into the JS bundle so the single-file artifact build works.
  build: { assetsInlineLimit: 500000 },
})
