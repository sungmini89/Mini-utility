import { WifiInput, VCardInput, EmailInput, SmsInput } from "./types";

/**
 * 일반 텍스트를 QR 코드 값으로 변환
 *
 * 입력된 텍스트의 앞뒤 공백을 제거하여 반환합니다.
 *
 * @param text - 변환할 텍스트
 * @returns 공백이 제거된 텍스트
 *
 * @example
 * ```ts
 * generateText('  Hello World  '); // 'Hello World'
 * ```
 */
export function generateText(text: string): string {
  return text.trim();
}

/**
 * URL을 QR 코드 값으로 변환
 *
 * URL이 http:// 또는 https://로 시작하지 않으면 자동으로 https://를 추가합니다.
 * 빈 문자열인 경우 빈 문자열을 반환합니다.
 *
 * @param url - 변환할 URL
 * @returns 프로토콜이 포함된 완전한 URL
 *
 * @example
 * ```ts
 * generateUrl('example.com'); // 'https://example.com'
 * generateUrl('https://example.com'); // 'https://example.com'
 * ```
 */
export function generateUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * WiFi 네트워크 정보를 QR 코드 값으로 변환
 *
 * WiFi Alliance 표준에 따라 WiFi 연결 정보를 생성합니다.
 * 특수문자는 백슬래시로 이스케이프 처리됩니다.
 *
 * @param wifiInput - WiFi 네트워크 정보
 * @param wifiInput.ssid - 네트워크 이름
 * @param wifiInput.password - 네트워크 비밀번호
 * @param wifiInput.encryption - 암호화 타입 (WPA, WEP, nopass)
 * @param wifiInput.hidden - 숨겨진 네트워크 여부
 * @returns WiFi 연결을 위한 QR 코드 값
 *
 * @example
 * ```ts
 * generateWifi({
 *   ssid: 'MyWiFi',
 *   password: 'password123',
 *   encryption: 'WPA',
 *   hidden: false
 * });
 * // 'WIFI:T:WPA;S:MyWiFi;P:password123;H:false;;'
 * ```
 */
export function generateWifi({
  ssid,
  password,
  encryption,
  hidden,
}: WifiInput): string {
  // Escape special characters ; , : \ "
  const esc = (s: string) => s.replace(/([\\;:,\"])/g, "\\$1");
  const enc = encryption === "nopass" ? "" : encryption;
  const parts = [
    `WIFI:T:${enc};` +
      `S:${esc(ssid)};` +
      (encryption !== "nopass" ? `P:${esc(password)};` : "") +
      (hidden ? "H:true;" : "") +
      ";",
  ];
  return parts.join("");
}

/**
 * 연락처 정보를 vCard 형식으로 변환
 *
 * vCard 3.0 표준에 따라 연락처 정보를 생성합니다.
 * 빈 필드는 자동으로 제외됩니다.
 *
 * @param vcardInput - 연락처 정보
 * @param vcardInput.name - 이름
 * @param vcardInput.organisation - 조직/회사
 * @param vcardInput.title - 직책
 * @param vcardInput.phone - 전화번호
 * @param vcardInput.email - 이메일
 * @param vcardInput.website - 웹사이트
 * @returns vCard 형식의 연락처 정보
 *
 * @example
 * ```ts
 * generateVCard({
 *   name: '홍길동',
 *   organisation: '테크컴퍼니',
 *   title: '개발자',
 *   phone: '010-1234-5678',
 *   email: 'hong@example.com'
 * });
 * ```
 */
export function generateVCard({
  name,
  organisation,
  title,
  phone,
  email,
  website,
}: VCardInput): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  const addLine = (key: string, value: string) => {
    if (!value) return;
    lines.push(`${key}:${value}`);
  };
  addLine("FN", name.trim());
  addLine("ORG", organisation.trim());
  addLine("TITLE", title.trim());
  addLine("TEL;TYPE=CELL", phone.trim());
  addLine("EMAIL", email.trim());
  addLine("URL", website.trim());
  lines.push("END:VCARD");
  return lines.join("\n");
}

/**
 * 이메일 정보를 mailto URI로 변환
 *
 * 이메일 주소, 제목, 내용을 포함한 mailto 링크를 생성합니다.
 * 제목과 내용이 비어있으면 이메일 주소만 사용합니다.
 *
 * @param emailInput - 이메일 정보
 * @param emailInput.email - 이메일 주소
 * @param emailInput.subject - 이메일 제목
 * @param emailInput.body - 이메일 내용
 * @returns mailto URI
 *
 * @example
 * ```ts
 * generateEmail({
 *   email: 'user@example.com',
 *   subject: '안녕하세요',
 *   body: 'QR 코드 생성기 테스트입니다.'
 * });
 * // 'mailto:user@example.com?subject=안녕하세요&body=QR 코드 생성기 테스트입니다.'
 * ```
 */
export function generateEmail({ email, subject, body }: EmailInput): string {
  const addr = email.trim();
  const params: string[] = [];
  if (subject.trim())
    params.push(`subject=${encodeURIComponent(subject.trim())}`);
  if (body.trim()) params.push(`body=${encodeURIComponent(body.trim())}`);
  return params.length > 0
    ? `mailto:${addr}?${params.join("&")}`
    : `mailto:${addr}`;
}

/**
 * SMS 정보를 SMSTO URI로 변환
 *
 * 전화번호와 메시지를 포함한 SMS 링크를 생성합니다.
 * 메시지가 비어있으면 전화번호만 사용합니다.
 *
 * @param smsInput - SMS 정보
 * @param smsInput.number - 전화번호
 * @param smsInput.message - SMS 메시지
 * @returns SMSTO URI
 *
 * @example
 * ```ts
 * generateSms({
 *   number: '010-1234-5678',
 *   message: '안녕하세요!'
 * });
 * // 'SMSTO:010-1234-5678:안녕하세요!'
 * ```
 */
export function generateSms({ number, message }: SmsInput): string {
  const num = number.trim();
  const msg = message.trim();
  return msg ? `SMSTO:${num}:${encodeURIComponent(msg)}` : `SMSTO:${num}`;
}

/**
 * Convert an SVG element into a PNG data URL. The returned promise resolves
 * with a base64 encoded PNG. This function creates a temporary canvas and
 * draws the SVG onto it. Optional scaling can be applied to increase
 * resolution.
 */
export async function svgToPng(
  svgElement: SVGSVGElement,
  scale = 1
): Promise<string> {
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
  });
  const width = svgElement.getBoundingClientRect().width * scale;
  const height = svgElement.getBoundingClientRect().height * scale;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  // Fill background with transparent or user-specified colour is not applied here
  ctx.drawImage(img, 0, 0, width, height);
  const pngData = canvas.toDataURL("image/png");
  URL.revokeObjectURL(url);
  return pngData;
}

/**
 * Trigger a file download from a data URL. Creates a temporary anchor
 * element and clicks it programmatically.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
