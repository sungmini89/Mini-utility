import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "QR Code Generator",
        short_name: "QRGen",
        description:
          "Create custom QR codes for various data types with adjustable size and colors.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    open: true,
    hmr: {
      overlay: true,
    },
  },
  define: {
    __HMR_CONFIG_NAME__: JSON.stringify("vite"),
    // React Router Future Flags 환경변수 처리
    "process.env.REACT_ROUTER_FUTURE_FLAGS": JSON.stringify(
      process.env.REACT_ROUTER_FUTURE_FLAGS ||
        "v7_startTransition,v7_relativeSplatPath"
    ),
  },
});
