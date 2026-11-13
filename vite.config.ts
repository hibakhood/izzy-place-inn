import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  // GitHub Pages serves from /izzy-place-inn/, Vercel serves from /
  // (Vercel sets VERCEL=1 automatically during builds)
  base: process.env.VERCEL ? "/" : "/izzy-place-inn/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: false,
      includeAssets: [
        "favicon.ico",
        "izzy-icon-16.png",
        "izzy-icon-32.png",
        "izzy-icon-48.png",
        "izzy-icon-180.png",
        "izzy-icon-192.png",
        "izzy-icon-512.png",
        "apple-touch-icon.png",
        "site.webmanifest",
        "images/brand/izzy-logo-forest-gold.png",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff2}"],
        globIgnores: ["**/images/**", "**/videos/**"],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api": "http://127.0.0.1:3001",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
