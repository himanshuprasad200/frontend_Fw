// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // THIS IS THE FINAL FIX — PROXY + COOKIE REWRITE
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-i86g.onrender.com',
        changeOrigin: true,
        secure: true,
        // THIS LINE REWRITES THE COOKIE DOMAIN SO BROWSER ACCEPTS IT
        cookieDomainRewrite: {
          '*': '', // Remove domain from cookie → becomes session cookie for current domain
        },
        // Optional: rewrite cookie path if needed
        cookiePathRewrite: {
          '*': '/',
        },
      },
    },
  },

  // For production build
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})