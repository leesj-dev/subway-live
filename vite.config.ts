import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://app.map.kakao.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/subway/station/arrivals.json"),
      }
    }
  },
  base: "/subway-live/",
})
