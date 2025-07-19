import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
    manifest: {
      name: 'Dual Trader',
      short_name: 'DT By Ash',
      description: 'Non-Profit Experimental Trading Platform',
      theme_color: '#000000',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/assets/dual-trader-logo.jpg',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/assets/dual-trader-logo.jpg',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/assets/dual-trader-logo.jpg',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    }
  })],
})
