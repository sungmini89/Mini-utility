import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import {
  QrType,
  HistoryItem,
  TextInput,
  UrlInput,
  WifiInput,
  VCardInput,
  EmailInput,
  SmsInput,
} from "./types";
import {
  generateText,
  generateUrl,
  generateWifi,
  generateVCard,
  generateEmail,
  generateSms,
  svgToPng,
  downloadDataUrl,
} from "./utils";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";
import { validateLocalStorage } from "../../utils/common";

/**
 * QR 코드 생성기 메인 컴포넌트
 *
 * 다양한 데이터 타입을 QR 코드로 변환하고, 사용자가 크기, 색상, 로고를
 * 커스터마이징할 수 있는 완전한 QR 코드 생성 도구입니다.
 *
 * @description
 * - 6가지 QR 코드 타입 지원 (텍스트, URL, WiFi, 연락처, 이메일, SMS)
 * - 실시간 QR 코드 미리보기
 * - 크기, 색상, 로고 커스터마이징
 * - PNG/SVG 다운로드 지원
 * - 클립보드 복사 기능
 * - 생성 히스토리 자동 저장
 * - 다크모드 지원
 * - 키보드 단축키 지원
 *
 * @example
 * ```tsx
 * <QrGenerator />
 * ```
 *
 * @author QR Code Generator Team
 * @since 1.0.0
 */
const QrGenerator: React.FC = () => {
  // Active tab representing the currently selected data type
  const [activeType, setActiveType] = useState<QrType>("text");
  // Input states for each data type persisted in localStorage
  const [textInput, setTextInput] = useLocalStorage<TextInput>(
    "qrGenerator:text",
    { text: "" }
  );
  const [urlInput, setUrlInput] = useLocalStorage<UrlInput>("qrGenerator:url", {
    url: "",
  });
  const [wifiInput, setWifiInput] = useLocalStorage<WifiInput>(
    "qrGenerator:wifi",
    {
      ssid: "",
      password: "",
      encryption: "WPA",
      hidden: false,
    }
  );
  const [vcardInput, setVcardInput] = useLocalStorage<VCardInput>(
    "qrGenerator:vcard",
    {
      name: "",
      organisation: "",
      title: "",
      phone: "",
      email: "",
      website: "",
    }
  );
  const [emailInput, setEmailInput] = useLocalStorage<EmailInput>(
    "qrGenerator:email",
    {
      email: "",
      subject: "",
      body: "",
    }
  );
  const [smsInput, setSmsInput] = useLocalStorage<SmsInput>("qrGenerator:sms", {
    number: "",
    message: "",
  });
  // Customisation options persisted in localStorage
  const [size, setSize] = useLocalStorage<number>("qrGenerator:size", 256);
  const [fgColor, setFgColor] = useLocalStorage<string>(
    "qrGenerator:fgColor",
    "#000000"
  );
  const [bgColor, setBgColor] = useLocalStorage<string>(
    "qrGenerator:bgColor",
    "#ffffff"
  );
  const [logoData, setLogoData] = useLocalStorage<string | undefined>(
    "qrGenerator:logo",
    undefined
  );
  // Raw string used to generate the QR code
  const [qrValue, setQrValue] = useState<string>("");
  // History of previously generated codes
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "qrGenerator:history",
    [] as HistoryItem[]
  );
  // Copy functionality via custom hook
  const [copied, copy] = useClipboard();
  // Toast state for notifications
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // Loading state for download operations
  const [loading, setLoading] = useState<boolean>(false);
  // Reference to the QRCode SVG for export
  const qrRef = useRef<SVGSVGElement | null>(null);

  // Compute the QR value whenever inputs or type change
  useEffect(() => {
    let value = "";
    try {
      switch (activeType) {
        case "text":
          value = generateText(textInput.text);
          break;
        case "url":
          value = generateUrl(urlInput.url);
          break;
        case "wifi":
          value = generateWifi(wifiInput);
          break;
        case "vcard":
          value = generateVCard(vcardInput);
          break;
        case "email":
          value = generateEmail(emailInput);
          break;
        case "sms":
          value = generateSms(smsInput);
          break;
        default:
          value = "";
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error generating QR value", type: "error" });
      value = "";
    }
    setQrValue(value);
  }, [
    activeType,
    textInput,
    urlInput,
    wifiInput,
    vcardInput,
    emailInput,
    smsInput,
  ]);

  // Auto-save to history when the QR value updates (non-empty) and type changes
  useEffect(() => {
    if (!qrValue) return;
    const newItem: HistoryItem = {
      type: activeType,
      data: qrValue,
      date: Date.now(),
    };
    setHistory((prev) => {
      // Avoid duplicates: if last item has same data and type, skip
      if (
        prev.length > 0 &&
        prev[0].data === qrValue &&
        prev[0].type === activeType
      ) {
        return prev;
      }
      const updated = [newItem, ...prev];
      return updated.slice(0, 10);
    });
  }, [qrValue]);

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Copy: Ctrl/Cmd + Shift + C
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      }
      // Download PNG: Ctrl/Cmd + Shift + S
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleDownload("png");
      }
      // Reset: Ctrl/Cmd + Shift + R
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        resetAll();
      }
      // Alt + [1-6] to switch tabs
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const num = Number(e.key);
        if (num >= 1 && num <= 6) {
          e.preventDefault();
          const types: QrType[] = [
            "text",
            "url",
            "wifi",
            "vcard",
            "email",
            "sms",
          ];
          setActiveType(types[num - 1]);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Auto-dismiss toast after 2 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Handle copy to clipboard
  async function handleCopy() {
    if (!qrValue) return;
    try {
      await copy(qrValue);
      setToast({ message: "Copied to clipboard", type: "success" });
    } catch {
      setToast({ message: "Copy failed", type: "error" });
    }
  }

  // Reset all inputs and options
  function resetAll() {
    setTextInput({ text: "" });
    setUrlInput({ url: "" });
    setWifiInput({ ssid: "", password: "", encryption: "WPA", hidden: false });
    setVcardInput({
      name: "",
      organisation: "",
      title: "",
      phone: "",
      email: "",
      website: "",
    });
    setEmailInput({ email: "", subject: "", body: "" });
    setSmsInput({ number: "", message: "" });
    setHistory([]);
    setLogoData(undefined);
    setToast({ message: "Cleared all inputs", type: "success" });
  }

  // Handle logo file upload and convert to data URL
  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoData(reader.result as string);
    };
    reader.onerror = () => {
      setToast({ message: "Logo upload failed", type: "error" });
    };
    reader.readAsDataURL(file);
  }

  // Download QR as png or svg
  async function handleDownload(format: "png" | "svg") {
    if (!qrRef.current) return;
    try {
      setLoading(true);
      if (format === "svg") {
        // Serialize SVG directly
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(qrRef.current);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const dataUrl = URL.createObjectURL(blob);
        downloadDataUrl(dataUrl, "qr-code.svg");
        URL.revokeObjectURL(dataUrl);
      } else {
        const pngData = await svgToPng(qrRef.current, 2);
        downloadDataUrl(pngData, "qr-code.png");
      }
      setToast({
        message: `Downloaded ${format.toUpperCase()}`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({ message: "Download failed", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Render input panel based on active type
  const renderInputs = () => {
    switch (activeType) {
      case "text":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Text</label>
            <textarea
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="Enter text"
              value={textInput.text}
              onChange={(e) => setTextInput({ text: e.target.value })}
              rows={3}
            />
          </div>
        );
      case "url":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">URL</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="https://example.com"
              value={urlInput.url}
              onChange={(e) => setUrlInput({ url: e.target.value })}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Protocol will be prefixed if omitted.
            </p>
          </div>
        );
      case "wifi":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">SSID</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="Network name"
              value={wifiInput.ssid}
              onChange={(e) =>
                setWifiInput({ ...wifiInput, ssid: e.target.value })
              }
            />
            {wifiInput.encryption !== "nopass" && (
              <>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="text"
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
                  placeholder="Password"
                  value={wifiInput.password}
                  onChange={(e) =>
                    setWifiInput({ ...wifiInput, password: e.target.value })
                  }
                />
              </>
            )}
            <label className="block text-sm font-medium">Encryption</label>
            <select
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              value={wifiInput.encryption}
              onChange={(e) =>
                setWifiInput({
                  ...wifiInput,
                  encryption: e.target.value as WifiInput["encryption"],
                })
              }
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
            <label className="inline-flex items-center mt-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={wifiInput.hidden}
                onChange={(e) =>
                  setWifiInput({ ...wifiInput, hidden: e.target.checked })
                }
              />
              Hidden network
            </label>
          </div>
        );
      case "vcard":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="Full name"
              value={vcardInput.name}
              onChange={(e) =>
                setVcardInput({ ...vcardInput, name: e.target.value })
              }
            />
            <label className="block text-sm font-medium">Organisation</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="Company"
              value={vcardInput.organisation}
              onChange={(e) =>
                setVcardInput({ ...vcardInput, organisation: e.target.value })
              }
            />
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="Job title"
              value={vcardInput.title}
              onChange={(e) =>
                setVcardInput({ ...vcardInput, title: e.target.value })
              }
            />
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="123-456-7890"
              value={vcardInput.phone}
              onChange={(e) =>
                setVcardInput({ ...vcardInput, phone: e.target.value })
              }
            />
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="email@example.com"
              value={vcardInput.email}
              onChange={(e) =>
                setVcardInput({ ...vcardInput, email: e.target.value })
              }
            />
            <label className="block text-sm font-medium">Website</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="https://example.com"
              value={vcardInput.website}
              onChange={(e) =>
                setVcardInput({ ...vcardInput, website: e.target.value })
              }
            />
          </div>
        );
      case "email":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email address</label>
            <input
              type="email"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="someone@example.com"
              value={emailInput.email}
              onChange={(e) =>
                setEmailInput({ ...emailInput, email: e.target.value })
              }
            />
            <label className="block text-sm font-medium">Subject</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="Subject"
              value={emailInput.subject}
              onChange={(e) =>
                setEmailInput({ ...emailInput, subject: e.target.value })
              }
            />
            <label className="block text-sm font-medium">Body</label>
            <textarea
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="Message body"
              value={emailInput.body}
              onChange={(e) =>
                setEmailInput({ ...emailInput, body: e.target.value })
              }
              rows={3}
            />
          </div>
        );
      case "sms":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Phone number</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="1234567890"
              value={smsInput.number}
              onChange={(e) =>
                setSmsInput({ ...smsInput, number: e.target.value })
              }
            />
            <label className="block text-sm font-medium">Message</label>
            <textarea
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="Message"
              value={smsInput.message}
              onChange={(e) =>
                setSmsInput({ ...smsInput, message: e.target.value })
              }
              rows={3}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            { key: "text", label: "Text" },
            { key: "url", label: "URL" },
            { key: "wifi", label: "WiFi" },
            { key: "vcard", label: "Contact" },
            { key: "email", label: "Email" },
            { key: "sms", label: "SMS" },
          ] as { key: QrType; label: string }[]
        ).map(({ key, label }, idx) => (
          <button
            key={key}
            onClick={() => setActiveType(key)}
            className={`px-3 py-2 rounded text-sm focus:outline-none focus:ring transition-colors ${
              activeType === key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            title={`Alt+${idx + 1}`}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Input panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>{renderInputs()}</div>
        {/* Customisation options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Size: {size}px
            </label>
            <input
              type="range"
              min={128}
              max={512}
              step={8}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-1">
                Foreground
              </label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 p-0 border-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Background
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 p-0 border-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Logo (optional)
            </label>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
            {logoData && (
              <div className="mt-2 flex items-center">
                <img
                  src={logoData}
                  alt="Logo preview"
                  className="w-12 h-12 object-contain mr-2"
                />
                <button
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring"
                  onClick={() => setLogoData(undefined)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Preview and actions */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center justify-center p-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
          {qrValue ? (
            <div className="relative" style={{ width: size, height: size }}>
              <QRCode
                value={qrValue}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level="Q"
                ref={qrRef}
              />
              {/* Logo overlay */}
              {logoData && (
                <img
                  src={logoData}
                  alt="Logo"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: size * 0.25,
                    height: size * 0.25,
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Enter data to generate a QR code.
            </p>
          )}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
              disabled={!qrValue}
            >
              Copy Data
            </button>
            <button
              onClick={() => handleDownload("png")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring"
              disabled={!qrValue || loading}
            >
              {loading ? "Downloading..." : "Download PNG"}
            </button>
            <button
              onClick={() => handleDownload("svg")}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring"
              disabled={!qrValue || loading}
            >
              {loading ? "Preparing..." : "Download SVG"}
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring"
            >
              Reset
            </button>
          </div>
          {/* History panel */}
          <div>
            <h2 className="text-md font-semibold mb-2">History</h2>
            <ul className="space-y-1 max-h-40 overflow-auto text-sm">
              {history.length === 0 && (
                <li className="text-gray-500 dark:text-gray-400">
                  No history yet.
                </li>
              )}
              {history.map((item, idx) => (
                <li
                  key={item.date}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-start"
                >
                  <div>
                    <span className="font-semibold mr-2">{item.type}:</span>
                    <span>
                      {item.data.slice(0, 50)}
                      {item.data.length > 50 ? "…" : ""}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                    {new Date(item.date).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Toast notifications */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
      {copied && <span className="sr-only">Copied</span>}
    </div>
  );
};

export default QrGenerator;
