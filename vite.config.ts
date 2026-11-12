import { fileURLToPath, URL } from 'node:url'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

import { VitePWA } from 'vite-plugin-pwa'

// Etabli après corrections judicieuses suggérées par l'IA de Google

export default defineConfig({
  // Forcer à './' pour que ça fonctionne depuis un site par directement au domaine
  base: './',
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      sassVariables: join(import.meta.dirname, 'src/quasar-variables.sass')
    }),
    VitePWA({
      injectRegister: false,
      strategies: 'injectManifest',
      srcDir: 'src-pwa',
      filename: 'my-sw.ts',
      /* Le plugin ignore "workbox" avec la stratégie 'injectManifest'
        Il faut donner les options dans 'injectManifest'
        globPatterns: doit donner TOUS les patterns qu'on veut retrouver en cache.
        Les autres n'y seront pas inscrits.
        maximumFileSizeToCacheInBytes: par défaut 2Mo PAR ressource.
        L'augmenter s'il y a de très assets.
      */
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,json}'],
        maximumFileSizeToCacheInBytes: 4000000,
        sourcemap: true,
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      devOptions: {
        /* enabled: pour disposer d'un SW même en dev
        Quand le SW a des imports il faut forcer le type 'module'
        */
        enabled: true,
        type: 'module', // Required if my-sw.ts uses ES imports
      },
      // URLs des icônes en relatif
      manifest: {
        "name": "asocial 3",
        "short_name": "asocial 3",
        "description": "Tests divers vue pwa",
        "theme_color": "#ffffff",
        "icons": [
          { "src": "anonymous-black.png", "sizes": "128x128", "type": "image/png" },
          { "src": "anonymous-white.png", "sizes": "128x128", "type": "image/png" }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
