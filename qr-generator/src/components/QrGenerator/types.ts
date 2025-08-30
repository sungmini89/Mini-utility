/**
 * QR 코드 생성기에서 사용하는 타입 정의
 *
 * 다양한 QR 코드 타입과 입력 데이터의 구조를 정의합니다.
 * 각 타입은 특정 용도에 맞게 설계되어 있습니다.
 *
 * @author QR Code Generator Team
 * @since 1.0.0
 */

/**
 * 지원되는 QR 코드 데이터 타입
 *
 * 각 타입은 서로 다른 입력 폼과 변환 함수에 대응합니다.
 */
export type QrType =
  | "text" // 일반 텍스트
  | "url" // 웹사이트 링크
  | "wifi" // WiFi 네트워크 정보
  | "vcard" // 연락처 정보 (vCard)
  | "email" // 이메일
  | "sms"; // SMS 메시지

/**
 * QR 코드 생성 옵션
 *
 * QR 코드의 외관과 동작을 제어하는 설정들을 포함합니다.
 */
export interface QrOptions {
  type: QrType; // QR 코드 타입
  data: string; // QR 코드에 인코딩할 데이터
  size: number; // QR 코드 크기 (픽셀)
  fgColor: string; // 전경색 (QR 코드 색상)
  bgColor: string; // 배경색
  logo?: string; // 로고 이미지 (Base64 인코딩)
}

/**
 * 생성된 QR 코드의 히스토리 항목
 *
 * 사용자가 생성한 QR 코드의 정보를 저장하고 관리합니다.
 * 최근 10개의 항목만 유지됩니다.
 */
export interface HistoryItem {
  type: QrType; // QR 코드 타입
  data: string; // 원본 데이터
  date: number; // 생성 시간 (타임스탬프)
}

/**
 * 텍스트 입력 데이터
 */
export interface TextInput {
  text: string; // 입력된 텍스트
}

/**
 * URL 입력 데이터
 */
export interface UrlInput {
  url: string; // 입력된 URL
}

/**
 * WiFi 네트워크 입력 데이터
 *
 * WiFi Alliance 표준을 따르는 네트워크 연결 정보
 */
export interface WifiInput {
  ssid: string; // 네트워크 이름
  password: string; // 네트워크 비밀번호
  encryption: "WPA" | "WEP" | "nopass"; // 암호화 타입
  hidden: boolean; // 숨겨진 네트워크 여부
}

/**
 * 연락처 정보 입력 데이터
 *
 * vCard 3.0 표준을 따르는 연락처 정보
 */
export interface VCardInput {
  name: string; // 이름
  organisation: string; // 조직/회사
  title: string; // 직책
  phone: string; // 전화번호
  email: string; // 이메일
  website: string; // 웹사이트
}

/**
 * 이메일 입력 데이터
 *
 * mailto URI 생성을 위한 이메일 정보
 */
export interface EmailInput {
  email: string; // 이메일 주소
  subject: string; // 이메일 제목
  body: string; // 이메일 내용
}

/**
 * SMS 입력 데이터
 *
 * SMSTO URI 생성을 위한 SMS 정보
 */
export interface SmsInput {
  number: string; // 전화번호
  message: string; // SMS 메시지
}
