import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During development, proxy /api to backend at 3001
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
