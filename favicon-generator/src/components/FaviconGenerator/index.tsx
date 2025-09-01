import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GenerationOptions, HistoryItem, Mode, ToastType } from "./types";
import { generateIcons } from "./utils";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";
import useZipDownload from "../../hooks/useZipDownload";

/**
 * List of available icon sizes to choose from. You can adjust this
 * array to include more or fewer sizes depending on requirements.
 */
const AVAILABLE_SIZES = [16, 32, 48, 64, 96, 128, 256];

// Default generation options on initial load
const DEFAULT_OPTIONS: GenerationOptions = {
  mode: "image",
  text: "",
  imageSrc: null,
  bgColor: "#ffffff",
  bgAlpha: 1,
  textColor: "#000000",
  sizes: [16, 32, 48],
};

// Mode-specific default options
const MODE_DEFAULTS = {
  image: {
    bgColor: "#ffffff",
    bgAlpha: 1,
    textColor: "#000000",
    sizes: [16, 32, 48],
  },
  text: {
    bgColor: "#3b82f6", // blue
    bgAlpha: 1,
    textColor: "#ffffff", // white
    sizes: [16, 32, 48],
  },
  emoji: {
    bgColor: "#f59e0b", // amber
    bgAlpha: 1,
    textColor: "#ffffff", // white
    sizes: [16, 32, 48],
  },
};

/**
 * FaviconGenerator provides an interface for generating multi‑size
 * favicons from an image, text or emoji. Users can customise colours
 * and sizes, preview the icons, download them individually or copy
 * corresponding HTML code. Settings and history are persisted via
 * localStorage.
 */
const FaviconGenerator: React.FC = () => {
  // Options and icons are persisted in localStorage
  const [options, setOptions] = useLocalStorage<GenerationOptions>(
    "faviconGenerator:options",
    DEFAULT_OPTIONS
  );
  const [icons, setIcons] = useLocalStorage<Record<number, string>>(
    "faviconGenerator:icons",
    {}
  );
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "faviconGenerator:history",
    []
  );
  // Loading state
  const [loading, setLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  // Clipboard hook
  const [copied, copy] = useClipboard();
  // ZIP download hook
  const [zipLoading, downloadZip] = useZipDownload();
  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Use refs to store latest values for keyboard event handlers
  const optionsRef = useRef(options);
  const iconsRef = useRef(icons);
  const historyRef = useRef(history);

  // Update refs when values change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    iconsRef.current = icons;
  }, [icons]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  // Debug loading state changes
  useEffect(() => {
    console.log("Loading state changed to:", loading);
  }, [loading]);

  /**
   * Generate the icons based on current options. Handles errors such as
   * missing input and updates the icons state. Shows a loading indicator
   * while processing.
   */
  const handleGenerate = async () => {
    console.log("handleGenerate called, current loading state:", loading);
    // Validate input
    if (options.mode === "image" && !options.imageSrc) {
      setToast({ message: "Please upload an image.", type: "error" });
      return;
    }
    if (options.mode === "text" && !options.text) {
      setToast({ message: "Please enter text.", type: "error" });
      return;
    }
    if (options.mode === "emoji" && !options.text) {
      setToast({ message: "Please enter emoji.", type: "error" });
      return;
    }
    if (!options.sizes || options.sizes.length === 0) {
      setToast({ message: "Please select at least one size.", type: "error" });
      return;
    }

    console.log("Setting loading to true");
    setLoading(true);
    setForceUpdate((prev) => prev + 1);

    try {
      console.log("Generating icons...");
      const generated = await generateIcons(options);
      console.log("Icons generated:", Object.keys(generated));
      setIcons(generated);
      setToast({ message: "아이콘 생성 완료!", type: "success" });
    } catch (error) {
      console.warn("Icon generation failed", error);
      setToast({ message: "Failed to generate icons", type: "error" });
    } finally {
      console.log("Setting loading to false");
      // Force immediate state update
      setTimeout(() => {
        console.log("Force setting loading to false");
        setLoading(false);
        setForceUpdate((prev) => prev + 1);
      }, 0);
    }
  };

  const handleKeyboardCopyHtml = useCallback(async () => {
    const currentIcons = iconsRef.current;
    if (!currentIcons || Object.keys(currentIcons).length === 0) {
      setToast({
        message: "No icons to copy. Please generate first.",
        type: "error",
      });
      return;
    }
    const sizes = Object.keys(currentIcons).map((s) => Number(s));
    const maxSize = Math.max(...sizes);
    const htmlLines: string[] = [];
    sizes.forEach((size) => {
      const uri = currentIcons[size];
      htmlLines.push(
        `<link rel="icon" type="image/png" sizes="${size}x${size}" href="${uri}" />`
      );
    });
    const icoUri = currentIcons[maxSize].replace("image/png", "image/x-icon");
    htmlLines.push(`<link rel="icon" type="image/x-icon" href="${icoUri}" />`);
    const html = htmlLines.join("\n");
    try {
      await copy(html);
      setToast({ message: "HTML code copied!", type: "success" });
    } catch (error) {
      setToast({ message: "Copy failed", type: "error" });
    }
  }, [copy]);

  const handleKeyboardSaveHistory = useCallback(() => {
    const currentIcons = iconsRef.current;
    const currentOptions = optionsRef.current;
    const currentHistory = historyRef.current;
    if (!currentIcons || Object.keys(currentIcons).length === 0) return;
    const entry: HistoryItem = {
      date: Date.now(),
      options: currentOptions,
      icons: currentIcons,
    };
    setHistory([entry, ...currentHistory].slice(0, 10));
    setToast({ message: "Saved to history", type: "success" });
  }, [setHistory]);

  const handleKeyboardReset = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
    setIcons({});
    setToast({ message: "Options reset", type: "success" });
  }, [setOptions, setIcons]);

  const handleKeyboardDownloadZip = useCallback(async () => {
    const currentIcons = iconsRef.current;
    if (!currentIcons || Object.keys(currentIcons).length === 0) {
      setToast({
        message: "No icons to download. Please generate first.",
        type: "error",
      });
      return;
    }
    try {
      await downloadZip(currentIcons, "favicons.zip");
      setToast({ message: "ZIP file downloaded!", type: "success" });
    } catch (error) {
      setToast({ message: "ZIP download failed", type: "error" });
    }
  }, [downloadZip]);

  // Keyboard shortcuts: Alt+G generate, Ctrl/Cmd+Shift+C copy HTML, Ctrl/Cmd+Shift+S save,
  // Ctrl/Cmd+Shift+R reset, Ctrl/Cmd+Shift+Z download ZIP
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.altKey &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        e.key.toLowerCase() === "g"
      ) {
        e.preventDefault();
        handleGenerate();
      }
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "c":
            e.preventDefault();
            handleKeyboardCopyHtml();
            break;
          case "s":
            e.preventDefault();
            handleKeyboardSaveHistory();
            break;
          case "r":
            e.preventDefault();
            handleKeyboardReset();
            break;
          case "z":
            e.preventDefault();
            handleKeyboardDownloadZip();
            break;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleKeyboardCopyHtml,
    handleKeyboardSaveHistory,
    handleKeyboardReset,
    handleKeyboardDownloadZip,
  ]);

  /**
   * Copy the generated HTML <link> code for including the favicons in a
   * webpage. Includes one link per selected size and a default icon
   * referencing the largest size as an ICO. Uses the current icons data
   * URIs. If icons have not been generated, shows an error toast.
   */
  async function handleCopyHtml() {
    if (!icons || Object.keys(icons).length === 0) {
      setToast({
        message: "No icons to copy. Please generate first.",
        type: "error",
      });
      return;
    }
    // Determine largest size for ICO
    const sizes = Object.keys(icons).map((s) => Number(s));
    const maxSize = Math.max(...sizes);
    const htmlLines: string[] = [];
    // Add link tags for PNG sizes
    sizes.forEach((size) => {
      const uri = icons[size];
      htmlLines.push(
        `<link rel="icon" type="image/png" sizes="${size}x${size}" href="${uri}" />`
      );
    });
    // Add ICO link (using largest PNG as a fallback)
    const icoUri = icons[maxSize].replace("image/png", "image/x-icon");
    htmlLines.push(`<link rel="icon" type="image/x-icon" href="${icoUri}" />`);
    const html = htmlLines.join("\n");
    try {
      await copy(html);
      setToast({ message: "HTML code copied!", type: "success" });
    } catch (error) {
      setToast({ message: "Copy failed", type: "error" });
    }
  }

  /**
   * Save the current icons and options to history. Keeps only the
   * latest 10 entries.
   */
  function handleSaveHistory() {
    if (!icons || Object.keys(icons).length === 0) return;
    const entry: HistoryItem = {
      date: Date.now(),
      options,
      icons,
    };
    setHistory([entry, ...history].slice(0, 10));
    setToast({ message: "Saved to history", type: "success" });
  }

  /**
   * Download all generated icons as a ZIP file.
   */
  async function handleDownloadZip() {
    if (!icons || Object.keys(icons).length === 0) {
      setToast({
        message: "No icons to download. Please generate first.",
        type: "error",
      });
      return;
    }
    try {
      await downloadZip(icons, "favicons.zip");
      setToast({ message: "ZIP file downloaded!", type: "success" });
    } catch (error) {
      setToast({ message: "ZIP download failed", type: "error" });
    }
  }

  /**
   * Reset the generator options to defaults and clear generated icons.
   */
  function handleReset() {
    setOptions(DEFAULT_OPTIONS);
    setIcons({});
    setToast({ message: "Options reset", type: "success" });
  }

  /**
   * Restore options and icons from history item.
   */
  function handleRestoreHistory(item: HistoryItem) {
    setOptions(item.options);
    setIcons(item.icons);
    setToast({
      message: `Restored ${item.options.mode} mode settings from ${new Date(
        item.date
      ).toLocaleString()}`,
      type: "success",
    });
  }

  // Auto-dismiss toast after 2 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  /**
   * Handle file upload for image mode. Reads the selected file as a
   * data URI and updates the options.imageSrc. Supports only the first
   * selected file with size and type validation.
   */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setToast({ message: "Please select a valid image file", type: "error" });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setToast({ message: "File size must be less than 5MB", type: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setOptions({ ...options, imageSrc: result });
    };
    reader.onerror = () => {
      setToast({ message: "Failed to read file", type: "error" });
    };
    reader.readAsDataURL(file);
  }

  /**
   * Toggle an icon size in the options.sizes array.
   */
  function toggleSize(size: number) {
    const sizes = options.sizes.includes(size)
      ? options.sizes.filter((s) => s !== size)
      : [...options.sizes, size].sort((a, b) => a - b);
    setOptions({ ...options, sizes });
  }

  /**
   * Download a data URI as a file by creating a temporary link and
   * triggering a click. The browser will handle the file download.
   */
  function downloadData(uri: string, filename: string) {
    const a = document.createElement("a");
    a.href = uri;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="space-y-6">
      {/* Options panel */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-md font-semibold mb-3">Generator Options</h2>
        {/* Mode selection */}
        <div className="flex gap-4 mb-4">
          {(["image", "text", "emoji"] as Mode[]).map((m) => (
            <label key={m} className="flex items-center space-x-1">
              <input
                type="radio"
                name="mode"
                value={m}
                checked={options.mode === m}
                onChange={() => {
                  // 모드 변경 시 해당 모드의 기본값으로 초기화
                  const modeDefaults =
                    MODE_DEFAULTS[m as keyof typeof MODE_DEFAULTS];
                  setOptions({
                    ...options,
                    mode: m,
                    imageSrc: null,
                    text: "",
                    bgColor: modeDefaults.bgColor,
                    bgAlpha: modeDefaults.bgAlpha,
                    textColor: modeDefaults.textColor,
                    sizes: modeDefaults.sizes,
                  });
                }}
              />
              <span className="capitalize">{m}</span>
            </label>
          ))}
        </div>
        {/* Image upload */}
        {options.mode === "image" && (
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="file-upload"
            >
              Upload image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400"
            />
            {options.imageSrc && (
              <img
                src={options.imageSrc}
                alt="Uploaded"
                className="mt-2 max-h-32 object-contain border border-gray-300 dark:border-gray-600 rounded"
              />
            )}
          </div>
        )}
        {/* Text/Emoji input */}
        {(options.mode === "text" || options.mode === "emoji") && (
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="text-input"
            >
              {options.mode === "text" ? "Enter text" : "Enter emoji"}
            </label>
            <input
              id="text-input"
              type="text"
              value={options.text}
              placeholder={
                options.mode === "emoji"
                  ? "😀, 👩‍💻, 🐱‍👤 등 입력"
                  : "텍스트 입력"
              }
              onChange={(e) => setOptions({ ...options, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring bg-white dark:bg-gray-700"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {options.mode === "emoji"
                ? "여러 이모지를 입력해도 자동으로 맞춰서 렌더링됩니다."
                : "짧은 텍스트를 입력하면 아이콘에 맞춰 그려집니다."}
            </p>
            {options.mode === "emoji" && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">💡 이모지 입력 방법:</p>
                <ul className="space-y-1">
                  <li>
                    •{" "}
                    <kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">
                      Win + .
                    </kbd>{" "}
                    (Windows 이모지 패널)
                  </li>
                  <li>
                    •{" "}
                    <kbd className="px-1 py-0.5 bg-blue-200 dark:bg-blue-800 rounded text-xs">
                      Cmd + Ctrl + Space
                    </kbd>{" "}
                    (Mac 이모지 패널)
                  </li>
                  <li>
                    • 복사/붙여넣기: 여기서 복사 →{" "}
                    <span className="font-mono">😀🔥👩‍💻</span>
                  </li>
                  <li>
                    • 직접 타이핑: <span className="font-mono">😀</span>{" "}
                    <span className="font-mono">🔥</span>{" "}
                    <span className="font-mono">👩‍💻</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
        {/* Colour options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="bg-color"
            >
              Background colour
            </label>
            <input
              id="bg-color"
              type="color"
              value={options.bgColor}
              onChange={(e) =>
                setOptions({ ...options, bgColor: e.target.value })
              }
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="bg-alpha"
            >
              Background transparency: {options.bgAlpha}
            </label>
            <input
              id="bg-alpha"
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={options.bgAlpha}
              onChange={(e) =>
                setOptions({ ...options, bgAlpha: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
          {(options.mode === "text" || options.mode === "emoji") && (
            <div className="sm:col-span-2">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="text-color"
              >
                Text colour
              </label>
              <input
                id="text-color"
                type="color"
                value={options.textColor}
                onChange={(e) =>
                  setOptions({ ...options, textColor: e.target.value })
                }
              />
            </div>
          )}
        </div>
        {/* Size selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => (
              <label key={size} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={size}
                  checked={options.sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />
                <span>
                  {size}×{size}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Generate button */}
        <div>
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>
      </div>

      {/* Preview grid and actions */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-md font-semibold mb-3">Preview</h2>
        {(!icons || Object.keys(icons).length === 0) && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No icons generated yet.
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(icons).map(([sizeStr, uri]) => {
            const size = Number(sizeStr);
            return (
              <div
                key={size}
                className="flex flex-col items-center border border-gray-200 dark:border-gray-700 p-2 rounded"
              >
                <img
                  src={uri}
                  alt={`${size} icon`}
                  className="mb-2"
                  style={{ width: size, height: size }}
                />
                <span className="text-xs mb-1">
                  {size}×{size}
                </span>
                <button
                  onClick={() =>
                    downloadData(uri, `favicon-${size}x${size}.png`)
                  }
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring text-xs"
                >
                  Download
                </button>
              </div>
            );
          })}
        </div>
        {Object.keys(icons).length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={handleCopyHtml}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring text-sm"
            >
              Copy HTML
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={zipLoading}
              className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 focus:outline-none focus:ring text-sm disabled:opacity-50"
            >
              {zipLoading ? "Downloading..." : "Download ZIP"}
            </button>
            <button
              onClick={handleSaveHistory}
              className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring text-sm"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* History list */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-md font-semibold mb-3">History</h2>
        <ul className="space-y-2 max-h-48 overflow-auto text-sm">
          {history.length === 0 && (
            <li className="text-gray-500 dark:text-gray-400">
              No history yet.
            </li>
          )}
          {history.map((item) => (
            <li
              key={item.date}
              className="p-2 bg-white dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              onClick={() => handleRestoreHistory(item)}
              title="Click to restore these settings"
            >
              <div className="flex justify-between">
                <span>
                  {item.options.mode} — {item.options.sizes.join(",")}
                </span>
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {new Date(item.date).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                {Object.keys(item.icons)
                  .slice(0, 2)
                  .map((s) => `${s}×${s}`)
                  .join(", ")}
                {Object.keys(item.icons).length > 2 ? "…" : ""}
              </div>
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                💡 Click to restore
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Toast notification */}
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

export default FaviconGenerator;
