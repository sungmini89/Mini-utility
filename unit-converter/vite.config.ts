import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/**
 * Vite 빌드 도구 설정
 *
 * 이 파일은 단위 변환기 프로젝트의 빌드 설정을 정의합니다.
 * React 플러그인, PWA 지원, 개발 서버 설정 등을 포함합니다.
 *
 * 주요 기능:
 * - React 18 지원
 * - PWA (Progressive Web App) 기능
 * - 자동 서비스 워커 생성
 * - 오프라인 지원
 * - 앱 설치 가능
 *
 * @see https://vitejs.dev/config/
 * @see https://vite-plugin-pwa.netlify.app/
 */
export default defineConfig({
  plugins: [
    // React 지원 플러그인
    react(),

    // PWA 플러그인 - 오프라인 지원 및 앱 설치 기능
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo.png"],
      manifest: {
        name: "Unit Converter",
        short_name: "UnitConv",
        description:
          "Convert between length, weight, temperature, area, volume, speed and data units.",
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
    }),
  ],
});
