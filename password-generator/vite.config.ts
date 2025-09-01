import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/**
 * 비밀번호 생성기 애플리케이션을 위한 Vite 설정
 *
 * React, Tailwind CSS, PWA 지원을 활성화하고 앱 매니페스트를 설정합니다.
 * 개발 환경에서는 PWA를 비활성화하여 서비스 워커 충돌을 방지합니다.
 *
 * @returns {import('vite').UserConfig} Vite 설정 객체
 *
 * @since 1.0.0
 * @author 비밀번호 도구 팀
 */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo.png"],
      manifest: {
        name: "비밀번호 도구",
        short_name: "비밀번호",
        description:
          "사용자 정의 옵션으로 안전한 비밀번호를 생성하고 즐겨찾기를 저장하세요.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
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
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions: {
        enabled: false, // 개발 환경에서 PWA 비활성화
      },
    }),
  ],
  server: {
    port: 3001,
    open: true,
  },
});
