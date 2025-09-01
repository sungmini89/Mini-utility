import { useState } from "react";
import JSZip from "jszip";
import { dataURItoBlob } from "../utils/common";

/**
 * @fileoverview ZIP 파일 다운로드 기능을 제공하는 커스텀 훅
 *
 * 이 훅은 여러 favicon 파일을 ZIP 파일로 압축하여 다운로드하는 기능을 제공합니다.
 * JSZip 라이브러리를 사용하여 클라이언트 사이드에서 ZIP 파일을 생성하고,
 * 다운로드 진행 상태를 추적합니다.
 *
 * @author Favicon Generator Team
 * @version 1.0.0
 */

/**
 * @description ZIP 파일 다운로드 기능을 제공하는 훅
 *
 * 여러 favicon 파일을 ZIP 파일로 압축하여 다운로드하는 훅입니다:
 * - JSZip을 사용한 클라이언트 사이드 ZIP 생성
 * - Data URI를 Blob으로 변환하여 ZIP에 추가
 * - 다운로드 진행 상태 자동 추적
 * - 메모리 누수 방지를 위한 URL 해제
 * - 에러 처리 및 로딩 상태 관리
 *
 * @returns {[boolean, (icons: Record<number, string>, filename?: string) => Promise<void>]}
 *          [로딩 상태, ZIP 다운로드 함수]
 *
 * @example
 * ```typescript
 * const [zipLoading, downloadZip] = useZipDownload();
 *
 * const handleDownload = async () => {
 *   try {
 *     await downloadZip({
 *       16: 'data:image/png;base64,...',
 *       32: 'data:image/png;base64,...',
 *       48: 'data:image/png;base64,...'
 *     }, 'my-favicons.zip');
 *   } catch (error) {
 *     console.error('ZIP 다운로드 실패:', error);
 *   }
 * };
 * ```
 */
export default function useZipDownload(): [
  boolean,
  (icons: Record<number, string>, filename?: string) => Promise<void>
] {
  const [loading, setLoading] = useState(false);

  const downloadZip = async (
    icons: Record<number, string>,
    filename: string = "favicons.zip"
  ) => {
    if (!icons || Object.keys(icons).length === 0) {
      throw new Error("No icons to download");
    }

    setLoading(true);
    try {
      const zip = new JSZip();

      // Add each icon to the ZIP
      Object.entries(icons).forEach(([size, dataURI]) => {
        const blob = dataURItoBlob(dataURI);
        zip.file(`favicon-${size}x${size}.png`, blob);
      });

      // Generate and download the ZIP
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("ZIP download failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return [loading, downloadZip];
}
