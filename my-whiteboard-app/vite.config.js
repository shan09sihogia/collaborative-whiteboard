import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'b65951dadfba.ngrok-free.app' // Add the ngrok host here
    ]
  }
})