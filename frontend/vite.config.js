import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig, loadEnv, normalizePath } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import vue from '@vitejs/plugin-vue'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  let proxy = {}
  if (mode === 'development') {
    proxy = {
      '/api': {
        target: 'http://localhost:8000', // Your Flask server
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
      }
    }
  }

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          id: env.VITE_BASE_PATH || '/OpenNumismatWeb/',
          name: 'OpenNumismat Web',
          short_name: 'OpenNumismat',
          description: 'Application for browsing OpenNumismat collection',
          background_color: '#FFFFFF',
          theme_color: '#FFA726',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
          ],
        },
        workbox: {
          ignoreURLParametersMatching: [/^v$/],
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,wasm}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
        }
      }),
      viteStaticCopy({
        targets: [
          {
            src: normalizePath(path.resolve(__dirname, './node_modules/sql.js/dist/sql-wasm-browser.wasm')),
            dest: 'wasm'
          }
        ]
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
      proxy: proxy,
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        },
      }
    },
  }
})
