import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnpluginIcons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { prefetch } from './prefetch-plugin';

export default defineConfig({
  plugins: [
    svelte(),
    prefetch(),
    // replace({ ...replacePlugin() }),
    UnpluginIcons({ autoInstall: true, compiler: 'svelte' }),
    VitePWA({
      includeAssets: [
        'robots.txt',
        'assets/app-icons/finder/32.png',
        'assets/cover-image.png',
        'assets/cursors/(normal|link|text|help)-select.svg',
        'assets/**/*.mp3',
        'assets/**/*.webp',
        'assets/wallpapers/37-[12].jpg',
      ],
      manifest: {
        name: 'Mac OS Monterey Svelte Web',
        short_name: 'macOS Svelte',
        theme_color: '#ffffff',
        description: 'Mac OS Monterey Web written in Svelte',
        icons: [
          {
            src: 'assets/app-icons/finder/128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'assets/app-icons/finder/192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/app-icons/finder/256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'assets/app-icons/finder/512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'assets/app-icons/finder/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/github1s.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'github1s-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '🍎': new URL('./src/', import.meta.url).pathname,
    },
  },
  build: {
    minify: 'terser',
  },
});
