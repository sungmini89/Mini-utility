import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite 빌드 도구 설정 파일
 * 
 * React 애플리케이션을 위한 Vite 설정을 정의합니다.
 * - React 플러그인 설정
 * - 개발 서버 설정
 * - 빌드 최적화 설정
 * - 코드 분할 설정
 */
export default defineConfig({
  /** React 지원을 위한 플러그인 */
  plugins: [react()],
  /** 개발 서버 설정 */
  server: {
    /** 개발 서버 포트 */
    port: 5173,
    /** 포트가 사용 중일 때 오류 발생 */
    strictPort: true,
  },
  /** 프로덕션 빌드 설정 */
  build: {
    /** Rollup 번들러 설정 */
    rollupOptions: {
      /** 출력 설정 */
      output: {
        /** 수동 청크 분할 설정 */
        manualChunks: {
          /** 벤더 라이브러리 청크 */
          vendor: ["react", "react-dom"],
          /** 라우터 라이브러리 청크 */
          router: ["react-router-dom"],
        },
      },
    },
  },
});