import { fileURLToPath, URL } from 'node:url'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
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
      workbox: { 
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,json}'],
        ignoreURLParametersMatching: [/.*/],
        maximumFileSizeToCacheInBytes: 4000000,
        sourcemap: true },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      devOptions: {
        enabled: true
      },
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
