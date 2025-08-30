import React, { useState, useEffect } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";
import type { HistoryItem, ParseError } from "./types";
import {
  validateJSON,
  formatJSON,
  minifyJSON,
  jsonToYAML,
  jsonToCSV,
  applyJSONPath,
  positionToLineColumn,
} from "./utils";

/**
 * JsonFormatter component enables validation, formatting and conversion of
 * JSON input.  Users can toggle between formatted, minified, YAML, CSV
 * and JSONPath views.  It includes error handling with line/column
 * indicators, a tree view, copy/download functionality and optional
 * history storage.
 */
const JsonFormatter: React.FC = () => {
  // Persist input text across sessions
  const [input, setInput] = useLocalStorage<string>("jsonFormatter:input", "");
  const [view, setView] = useState<
    "formatted" | "minified" | "yaml" | "csv" | "jsonpath"
  >("formatted");
  const [jsonPath, setJsonPath] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [parseError, setParseError] = useState<ParseError | null>(null);
  const [jsonValue, setJsonValue] = useState<any>(null);
  const [jsonPathResult, setJsonPathResult] = useState<any>(null);
  const [treeOpen, setTreeOpen] = useState<boolean>(false);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "jsonFormatter:history",
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [copied, copy] = useClipboard();

  // Parse and compute outputs when input or view or jsonPath changes
  useEffect(() => {
    setLoading(true);
    // Validate and parse JSON
    const res = validateJSON(input);
    if (!res.valid) {
      setParseError(res.error || null);
      setJsonValue(null);
      setOutput("");
      setJsonPathResult(null);
      setLoading(false);
      return;
    }
    setParseError(null);
    const value = res.value;
    setJsonValue(value);
    // Determine output based on selected view
    try {
      switch (view) {
        case "formatted":
          setOutput(formatJSON(value));
          break;
        case "minified":
          setOutput(minifyJSON(value));
          break;
        case "yaml":
          setOutput(jsonToYAML(value));
          break;
        case "csv": {
          const result = jsonToCSV(value);
          if (typeof result === "string") {
            setOutput(result);
          } else {
            setOutput("");
            setParseError(result);
          }
          break;
        }
        case "jsonpath":
          setOutput("");
          if (jsonPath.trim().length > 0) {
            const jp = applyJSONPath(value, jsonPath);
            setJsonPathResult(jp);
          } else {
            setJsonPathResult(null);
          }
          break;
      }
    } catch (err: any) {
      setOutput("");
      setParseError({ message: err.message });
    }
    setLoading(false);
  }, [input, view, jsonPath]);

  // Auto clear toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Copy output or JSONPath result depending on view
  async function handleCopy() {
    let text = "";
    if (view === "jsonpath") {
      text = JSON.stringify(jsonPathResult, null, 2);
    } else {
      text = output;
    }
    if (!text) return;
    try {
      await copy(text);
      setToast({ message: "Copied to clipboard!", type: "success" });
    } catch {
      setToast({ message: "Copy failed", type: "error" });
    }
  }

  // Download output or JSONPath result as a file
  function handleDownload() {
    let text = "";
    let ext = "txt";
    if (view === "jsonpath") {
      text = JSON.stringify(jsonPathResult, null, 2);
      ext = "json";
    } else {
      text = output;
      if (view === "yaml") ext = "yaml";
      else if (view === "csv") ext = "csv";
      else ext = "json";
    }
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Save current operation to history
  function saveToHistory() {
    let outText = "";
    if (view === "jsonpath") {
      outText = JSON.stringify(jsonPathResult, null, 2);
    } else {
      outText = output;
    }
    const newItem: HistoryItem = {
      input,
      output: outText,
      view,
      date: Date.now(),
    };
    setHistory([newItem, ...history].slice(0, 20));
    setToast({ message: "Saved to history", type: "success" });
  }

  // Toggle tree view
  function toggleTree() {
    setTreeOpen((prev) => !prev);
  }

  // Generate tree view recursively
  function renderTree(value: any, keyPrefix: string = ""): React.ReactNode {
    if (value === null || typeof value !== "object") {
      return (
        <span className="text-blue-600 dark:text-blue-300">
          {JSON.stringify(value)}
        </span>
      );
    }
    if (Array.isArray(value)) {
      return (
        <ul className="ml-4 list-decimal">
          {value.map((item, idx) => (
            <li key={`${keyPrefix}-${idx}`}>
              {renderTree(item, `${keyPrefix}-${idx}`)}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <ul className="ml-4 list-none">
        {Object.entries(value).map(([k, v]) => (
          <li key={`${keyPrefix}-${k}`} className="mb-1">
            <span className="font-semibold">{k}: </span>
            {renderTree(v, `${keyPrefix}-${k}`)}
          </li>
        ))}
      </ul>
    );
  }

  // Determine toast background colour
  const toastBg = toast?.type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {["formatted", "minified", "yaml", "csv", "jsonpath"].map((opt) => (
          <button
            key={opt}
            onClick={() => setView(opt as any)}
            className={`px-3 py-2 rounded focus:outline-none focus:ring text-sm ${
              view === opt
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
          >
            {opt === "formatted"
              ? "Format"
              : opt === "minified"
              ? "Minify"
              : opt === "yaml"
              ? "YAML"
              : opt === "csv"
              ? "CSV"
              : "JSONPath"}
          </button>
        ))}
        <button
          onClick={toggleTree}
          className="ml-auto px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring text-sm"
        >
          {treeOpen ? "Hide Tree" : "Show Tree"}
        </button>
      </div>
      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">JSON Input</label>
          {/* CodeMirror for JSON input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter JSON here..."
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-h-40 resize-y focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400 w-full"
          />
          {parseError && parseError.index !== undefined && (
            <div className="text-sm text-red-600 mt-2">
              {(() => {
                const pos = positionToLineColumn(input, parseError.index!);
                return (
                  <span>
                    Error at line {pos.line}, column {pos.column}:{" "}
                    {parseError.message}
                  </span>
                );
              })()}
            </div>
          )}
          {parseError && parseError.index === undefined && (
            <div className="text-sm text-red-600 mt-2">
              {parseError.message}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {view === "jsonpath" && (
            <div className="mb-2">
              <label className="text-sm font-medium mr-2">JSONPath:</label>
              <input
                type="text"
                value={jsonPath}
                onChange={(e) => setJsonPath(e.target.value)}
                placeholder="e.g. $.store.book[*].author"
                className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400 w-full"
              />
            </div>
          )}
          <label className="text-sm font-medium mb-1">
            {view === "jsonpath"
              ? "Result"
              : view === "yaml"
              ? "YAML Output"
              : view === "csv"
              ? "CSV Output"
              : "JSON Output"}
          </label>
          {view === "jsonpath" ? (
            <textarea
              value={
                jsonPathResult ? JSON.stringify(jsonPathResult, null, 2) : ""
              }
              readOnly
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-40 resize-y"
            />
          ) : (
            <textarea
              value={output}
              readOnly
              className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-40 resize-y"
            />
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring text-sm"
            >
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring text-sm"
            >
              Download
            </button>
            <button
              onClick={saveToHistory}
              className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring text-sm"
            >
              Save
            </button>
            {loading && (
              <span className="ml-2 text-sm text-gray-500">Processing…</span>
            )}
          </div>
        </div>
      </div>
      {/* Tree view */}
      {treeOpen && jsonValue && (
        <div className="mt-6">
          <h2 className="text-md font-semibold mb-2">Tree View</h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded p-3 overflow-auto max-h-60 text-sm">
            {renderTree(jsonValue)}
          </div>
        </div>
      )}
      {/* History */}
      <div className="mt-6">
        <h2 className="text-md font-semibold mb-2">History</h2>
        <ul className="space-y-2 max-h-40 overflow-auto text-sm">
          {history.length === 0 && (
            <li className="text-gray-500">No history</li>
          )}
          {history.map((item) => (
            <li
              key={item.date}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center"
            >
              <div className="truncate max-w-[70%]">
                <span className="font-semibold mr-1">
                  {item.view.toUpperCase()}:
                </span>
                {item.output.slice(0, 50)}
                {item.output.length > 50 ? "…" : ""}
              </div>
              <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                {new Date(item.date).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* Toast */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toastBg}`}
        >
          {toast.message}
        </div>
      )}
      {copied && <span className="sr-only">Copied</span>}
    </div>
  );
};

export default JsonFormatter;
