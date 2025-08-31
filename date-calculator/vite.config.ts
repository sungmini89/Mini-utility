/**
 * @fileoverview Vite 빌드 도구 설정 파일
 * @description React + TypeScript + PWA를 위한 Vite 설정을 정의합니다.
 * @author Date Calculator Team
 * @version 1.0.0
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/**
 * Vite 설정 객체
 * @description 개발 서버, 빌드 최적화, PWA 설정을 포함합니다.
 */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg}"],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: "날짜 계산기",
        short_name: "날짜 계산기",
        description: "한국 공휴일을 고려한 정확한 날짜 계산 도구",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#3B82F6",
        orientation: "portrait",
        scope: "/",
        lang: "ko",
        icons: [
          {
            src: "/icons/icon-144x144.svg",
            sizes: "144x144",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/icons/icon-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
        categories: ["utilities", "productivity"],
      },
    }),
  ],

  /**
   * 빌드 설정
   * @description 코드 분할, 압축, 청크 최적화를 설정합니다.
   */
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          icons: ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  /**
   * 의존성 최적화 설정
   * @description 빌드 시 포함할 핵심 라이브러리들을 지정합니다.
   */
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "lucide-react"],
  },

  /**
   * 개발 서버 설정
   * @description 개발 환경에서의 포트와 자동 열기 설정
   */
  server: {
    port: 3000,
    open: true,
  },

  /**
   * 프리뷰 서버 설정
   * @description 빌드된 파일을 미리보기 위한 설정
   */
  preview: {
    port: 4173,
    open: true,
  },
});
