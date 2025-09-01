import type { GenerationOptions } from "./types";
import { hexToRgba } from "../../utils/common";
import twemoji from "twemoji";

/**
 * @fileoverview Favicon Generator의 핵심 유틸리티 함수들
 *
 * 이 파일은 favicon 생성에 필요한 모든 핵심 로직을 포함합니다:
 * - 이미지 로딩 및 검증
 * - Canvas를 이용한 이미지/텍스트/이모지 렌더링
 * - 다양한 크기의 favicon 생성
 * - Twemoji를 이용한 이모지 렌더링
 *
 * @author Favicon Generator Team
 * @version 1.0.0
 */

/**
 * @description 이미지 파일 또는 Data URI를 HTMLImageElement로 로드
 *
 * 이미지를 안전하게 로드하고 검증하는 함수입니다:
 * - Data URI 크기 검증 (최대 5MB)
 * - 이미지 차원 검증 (0x0 또는 4096x4096 초과 방지)
 * - 로딩 실패 시 에러 처리
 *
 * @param {string} src - 로드할 이미지의 소스 (파일 경로 또는 Data URI)
 * @returns {Promise<HTMLImageElement>} 로드된 이미지 요소
 * @throws {Error} 이미지 로딩 실패 시 에러 발생
 *
 * @example
 * ```typescript
 * const img = await loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
 * ```
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // Check if it's a data URI and validate size (max 5MB)
    if (src.startsWith("data:")) {
      const base64Data = src.split(",")[1];
      if (base64Data) {
        const byteLength = (base64Data.length * 3) / 4;
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (byteLength > maxSize) {
          reject(new Error("Image file size exceeds 5MB limit"));
          return;
        }
      }
    }

    const img = new Image();
    img.onload = () => {
      // Additional validation after image loads
      if (img.width === 0 || img.height === 0) {
        reject(new Error("Invalid image: zero dimensions"));
        return;
      }
      if (img.width > 4096 || img.height > 4096) {
        reject(new Error("Image dimensions too large (max 4096x4096)"));
        return;
      }
      resolve(img);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

/**
 * @description 이미지를 정사각형 캔버스에 그리기
 *
 * 업로드된 이미지를 favicon 크기에 맞게 변환하는 함수입니다:
 * - 비율을 유지하면서 캔버스를 완전히 덮도록 스케일링
 * - 초과되는 부분은 자동으로 크롭
 * - 배경색으로 투명도 설정 가능
 *
 * @param {HTMLImageElement} source - 변환할 원본 이미지
 * @param {number} size - 생성할 favicon의 크기 (픽셀)
 * @param {string} bgColor - 배경색 (16진수 색상 코드)
 * @param {number} bgAlpha - 배경 투명도 (0-1)
 * @returns {Promise<string>} 생성된 PNG 이미지의 data URI
 * @throws {Error} Canvas 컨텍스트 생성 실패 시 에러 발생
 *
 * @example
 * ```typescript
 * const img = await loadImage('path/to/image.png');
 * const favicon = await drawImageToCanvas(img, 32, '#ffffff', 1);
 * ```
 */
async function drawImageToCanvas(
  source: HTMLImageElement,
  size: number,
  bgColor: string,
  bgAlpha: number
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context creation failed");
  }
  // Fill background
  ctx.fillStyle = hexToRgba(bgColor, bgAlpha);
  ctx.fillRect(0, 0, size, size);
  // Compute scale to cover canvas
  const scale = Math.max(size / source.width, size / source.height);
  const drawWidth = source.width * scale;
  const drawHeight = source.height * scale;
  const dx = (size - drawWidth) / 2;
  const dy = (size - drawHeight) / 2;
  ctx.drawImage(source, dx, dy, drawWidth, drawHeight);
  return canvas.toDataURL("image/png");
}

/**
 * @description 텍스트 또는 이모지를 정사각형 캔버스에 그리기
 *
 * 텍스트나 이모지를 favicon으로 변환하는 함수입니다:
 * - 텍스트를 캔버스 중앙에 배치
 * - 캔버스 크기에 맞게 자동 스케일링
 * - 다양한 이모지 폰트 스택 지원
 * - 가독성을 위한 그림자 효과 추가
 *
 * @param {string} text - 렌더링할 텍스트 또는 이모지
 * @param {number} size - 생성할 favicon의 크기 (픽셀)
 * @param {string} bgColor - 배경색 (16진수 색상 코드)
 * @param {number} bgAlpha - 배경 투명도 (0-1)
 * @param {string} textColor - 텍스트 색상 (16진수 색상 코드)
 * @returns {Promise<string>} 생성된 PNG 이미지의 data URI
 * @throws {Error} Canvas 컨텍스트 생성 실패 시 에러 발생
 *
 * @example
 * ```typescript
 * const favicon = await drawTextToCanvas('Hello', 32, '#3b82f6', 1, '#ffffff');
 * ```
 */
async function drawTextToCanvas(
  text: string,
  size: number,
  bgColor: string,
  bgAlpha: number,
  textColor: string
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context creation failed");
  }
  // Fill background
  ctx.fillStyle = hexToRgba(bgColor, bgAlpha);
  ctx.fillRect(0, 0, size, size);
  // Choose initial font size as 70% of canvas
  let fontSize = size * 0.7;
  // Prefer color emoji capable fonts with fallbacks
  const emojiFontStack = `'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','Twemoji Mozilla', 'EmojiOne Color', 'Segoe UI Symbol', 'Android Emoji', 'Helvetica', 'Arial', 'sans-serif'`;
  ctx.font = `${fontSize}px ${emojiFontStack}`;
  // Adjust font size if text too wide
  let metrics = ctx.measureText(text);
  if (metrics.width > size * 0.9) {
    fontSize = ((size * 0.9) / metrics.width) * fontSize;
    ctx.font = `${fontSize}px ${emojiFontStack}`;
    metrics = ctx.measureText(text);
  }
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Improve emoji/text rendering with shadow to enhance visibility on various backgrounds
  ctx.shadowColor = "rgba(0,0,0,0.08)";
  ctx.shadowBlur = Math.max(1, Math.floor(size * 0.03));
  ctx.fillText(text, size / 2, size / 2);
  // Reset shadow for safety
  ctx.shadowBlur = 0;
  return canvas.toDataURL("image/png");
}

/**
 * @description Twemoji를 사용하여 이모지를 렌더링
 *
 * 시스템 폰트가 컬러 이모지를 지원하지 않을 때 Twemoji SVG를 사용하는
 * 안정적인 대안 함수입니다:
 * - 여러 이모지 지원 (😀🔥👩‍💻)
 * - Twemoji CDN에서 SVG 이미지 로드
 * - CORS 설정으로 캔버스 오염 방지
 * - 이모지가 감지되지 않으면 폰트 렌더링으로 폴백
 *
 * @param {string} text - 렌더링할 이모지 문자열
 * @param {number} size - 생성할 favicon의 크기 (픽셀)
 * @param {string} bgColor - 배경색 (16진수 색상 코드)
 * @param {number} bgAlpha - 배경 투명도 (0-1)
 * @returns {Promise<string>} 생성된 PNG 이미지의 data URI
 * @throws {Error} Canvas 컨텍스트 생성 실패 시 에러 발생
 *
 * @example
 * ```typescript
 * const favicon = await drawEmojiWithTwemoji('😀🔥', 32, '#f59e0b', 1);
 * ```
 */
async function drawEmojiWithTwemoji(
  text: string,
  size: number,
  bgColor: string,
  bgAlpha: number
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context creation failed");
  }
  ctx.fillStyle = hexToRgba(bgColor, bgAlpha);
  ctx.fillRect(0, 0, size, size);

  // Collect Twemoji URLs for each emoji in the string
  const urls: string[] = [];
  twemoji.parse(text, {
    folder: "svg",
    ext: ".svg",
    callback: (icon: string) => {
      const u = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${icon}.svg`;
      urls.push(u);
      return u;
    },
  } as any);

  // Fallback: if no emoji detected, render with font
  if (urls.length === 0) {
    return drawTextToCanvas(text, size, bgColor, bgAlpha, "#000000");
  }

  // Load all images with CORS enabled to keep canvas untainted
  const load = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });

  const images = await Promise.all(urls.map((u) => load(u)));

  // Compute layout: side-by-side with small padding
  const count = images.length;
  const padding = Math.max(0, Math.floor(size * 0.02));
  const cell = Math.floor((size - padding * (count + 1)) / Math.max(1, count));
  const drawSize = Math.min(cell, size - 2 * padding);
  images.forEach((img, index) => {
    const x =
      padding + index * (cell + padding) + Math.floor((cell - drawSize) / 2);
    const y = Math.floor((size - drawSize) / 2);
    ctx.drawImage(img, x, y, drawSize, drawSize);
  });

  return canvas.toDataURL("image/png");
}

/**
 * @description 지정된 옵션에 따라 다양한 크기의 favicon 생성
 *
 * 이 함수는 favicon 생성의 메인 진입점으로, 모든 모드(이미지/텍스트/이모지)를
 * 지원합니다:
 * - 이미지 모드: 업로드된 이미지를 favicon으로 변환
 * - 텍스트 모드: 텍스트를 favicon으로 렌더링
 * - 이모지 모드: 이모지를 Twemoji로 렌더링 (폰트 폴백 포함)
 * - 여러 크기 동시 생성 (16x16, 32x32, 48x48 등)
 *
 * @param {GenerationOptions} options - favicon 생성 옵션
 * @returns {Promise<Record<number, string>>} 크기별 PNG data URI 매핑
 * @throws {Error} 이미지 로딩 실패 또는 Canvas 생성 실패 시 에러 발생
 *
 * @example
 * ```typescript
 * const icons = await generateIcons({
 *   mode: 'text',
 *   text: 'Hello',
 *   bgColor: '#3b82f6',
 *   textColor: '#ffffff',
 *   sizes: [16, 32, 48]
 * });
 * // Returns: { 16: 'data:image/png;base64,...', 32: 'data:image/png;base64,...', ... }
 * ```
 */
export async function generateIcons(
  options: GenerationOptions
): Promise<Record<number, string>> {
  const result: Record<number, string> = {};
  // Preload image if in image mode
  let imageElement: HTMLImageElement | null = null;
  if (options.mode === "image" && options.imageSrc) {
    try {
      imageElement = await loadImage(options.imageSrc);
    } catch (err) {
      console.warn("Image load failed", err);
      throw new Error("Failed to load image");
    }
  }
  for (const size of options.sizes) {
    let uri = "";
    if (options.mode === "image" && imageElement) {
      uri = await drawImageToCanvas(
        imageElement,
        size,
        options.bgColor,
        options.bgAlpha
      );
    } else if (options.mode === "emoji") {
      try {
        uri = await drawEmojiWithTwemoji(
          options.text,
          size,
          options.bgColor,
          options.bgAlpha
        );
      } catch (_e) {
        // Fallback to font rendering if Twemoji fails
        uri = await drawTextToCanvas(
          options.text,
          size,
          options.bgColor,
          options.bgAlpha,
          options.textColor
        );
      }
    } else if (options.mode === "text") {
      uri = await drawTextToCanvas(
        options.text,
        size,
        options.bgColor,
        options.bgAlpha,
        options.textColor
      );
    }
    result[size] = uri;
  }
  return result;
}
