import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  server: {
    allowedHosts: [
      'c1d5-2a00-a041-e9c1-fa00-b075-5bf3-6de2-c4b4.ngrok-free.app',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'localhost:5173',
      '127.0.0.1:5173',
      '0.0.0.0:5173',
      // אפשר להוסיף עוד דומיינים אם צריך
    ]
  }
})
