import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        id: '/',
        name: 'SectorTres - F1 Companion',
        short_name: 'S3',
        lang: 'es',
        description: 'Tu compañero F1: horarios, resultados y estadísticas',
        theme_color: '#E10600',
        background_color: '#09090b',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        categories: ['sports', 'news'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Carreras',
            short_name: 'Carreras',
            url: '/',
            description: 'Ver el calendario y las carreras'
          },
          {
            name: 'Configuración',
            short_name: 'Ajustes',
            url: '/settings',
            description: 'Cambiar tema y preferencias'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.jolpi\.ca\/ergast\/f1\/.*\.json$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'f1-api',
              networkTimeoutSeconds: 4,
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/media\.formula1\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'f1-media',
              expiration: {
                maxEntries: 120,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/julesr0y\/f1-assets\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'f1-circuits',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    })
  ]
})