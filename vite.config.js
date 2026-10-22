

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true,
//     port: 5174,
//     strictPort: true,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "quickcart-icon.svg",
      ],
      manifest: {
        name: "QuickCart",
        short_name: "QuickCart",
        description: "Smart QR Shopping",
        theme_color: "#FFB800",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "quickcart-icon.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "quickcart-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],

  server: {
    host: true,
    port: 5174,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
