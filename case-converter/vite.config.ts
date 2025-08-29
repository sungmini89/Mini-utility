import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Vite configuration including PWA support.  This file registers a
// service worker and provides a manifest so the app can be installed
// like a native application.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "케이스 변환기",
        short_name: "케이스변환기",
        description: "텍스트를 다양한 케이스 형식으로 변환할 수 있는 도구",
        theme_color: "#ffffff",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  server: {
    open: true,
  },
});
