import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import useClipboard from "../hooks/useClipboard";

// Korean holidays data
const KOREAN_HOLIDAYS: string[] = [
  // 2024
  "2024-01-01", // New Year's Day
  "2024-02-09",
  "2024-02-10",
  "2024-02-11", // Seollal (Lunar New Year) and holidays
  "2024-03-01", // Independence Movement Day
  "2024-05-05",
  "2024-05-06", // Children's Day (observed on the next weekday)
  "2024-06-06", // Memorial Day
  "2024-08-15", // Liberation Day
  "2024-09-16",
  "2024-09-17",
  "2024-09-18", // Chuseok (Korean Thanksgiving) and holidays
  "2024-10-03", // National Foundation Day
  "2024-10-09", // Hangul Day
  "2024-12-25", // Christmas Day
  // 2025
  "2025-01-01",
  "2025-01-28",
  "2025-01-29",
  "2025-01-30", // Seollal
  "2025-03-01",
  "2025-05-05",
  "2025-06-06",
  "2025-08-15",
  "2025-10-03",
  "2025-10-09",
  "2025-12-25",
  // 2026 (partial)
  "2026-01-01",
  "2026-02-16",
  "2026-02-17",
  "2026-02-18",
  "2026-03-01",
  "2026-05-05",
  "2026-06-06",
  "2026-08-15",
  "2026-10-03",
  "2026-10-09",
  "2026-12-25",
];

// Utility functions
function parseDate(value: string): Date | null {
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date: Date, holidays: Set<string>): boolean {
  const dateStr = date.toISOString().split("T")[0];
  return holidays.has(dateStr);
}

function addOrSubtractDays(
  date: Date,
  days: number,
  excludeWeekends: boolean,
  holidays: Set<string>
): Date {
  const result = new Date(date);
  const step = days >= 0 ? 1 : -1;
  let remaining = Math.abs(days);
  while (remaining > 0) {
    result.setDate(result.getDate() + step);
    const skipWeekend = excludeWeekends && isWeekend(result);
    const skipHoliday = isHoliday(result, holidays);
    if (skipWeekend || skipHoliday) {
      // Skip this day and do not decrement remaining
      continue;
    }
    remaining -= 1;
  }
  return result;
}

interface AddInput {
  base: string;
  days: number;
  operation: "add" | "subtract";
  excludeWeekends: boolean;
  excludeHolidays: boolean;
}

const AddSubtractPage: React.FC = () => {
  const [addInput, setAddInput] = useLocalStorage<AddInput>(
    "dateCalculator:add",
    {
      base: "",
      days: 0,
      operation: "add",
      excludeWeekends: false,
      excludeHolidays: false,
    }
  );

  const [result, setResult] = useState<{
    valid: boolean;
    resultDate: Date | null;
    error?: string;
  }>({ valid: false, resultDate: null });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, copy] = useClipboard();

  const holidaySet = useMemo(() => new Set<string>(KOREAN_HOLIDAYS), []);

  useEffect(() => {
    const baseDate = parseDate(addInput.base);
    if (!baseDate) {
      setResult({ valid: false, resultDate: null, error: undefined });
      return;
    }
    if (isNaN(addInput.days)) {
      setResult({
        valid: false,
        resultDate: null,
        error: "Invalid number of days",
      });
      return;
    }
    const days = addInput.operation === "add" ? addInput.days : -addInput.days;
    const resultDate = addOrSubtractDays(
      baseDate,
      days,
      addInput.excludeWeekends,
      addInput.excludeHolidays ? holidaySet : new Set()
    );
    setResult({ valid: true, resultDate });
  }, [addInput, holidaySet]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleCopy = async () => {
    if (!result.valid || !result.resultDate) return;

    try {
      const text = `결과 날짜: ${formatDate(result.resultDate)}`;
      setLoading(true);
      await copy(text);
      setToast({ message: "복사되었습니다.", type: "success" });
    } catch {
      setToast({ message: "복사에 실패했습니다.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAddInput({
      base: "",
      days: 0,
      operation: "add",
      excludeWeekends: false,
      excludeHolidays: false,
    });
    setToast({ message: "초기화되었습니다.", type: "success" });
  };

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">날짜 계산 (더하기/빼기)</h1>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          ← 메인으로
        </Link>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">기준 날짜</label>
            <input
              type="date"
              value={addInput.base}
              onChange={(e) =>
                setAddInput({ ...addInput, base: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">일수</label>
            <input
              type="number"
              value={addInput.days}
              onChange={(e) =>
                setAddInput({
                  ...addInput,
                  days: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">연산</label>
            <select
              value={addInput.operation}
              onChange={(e) =>
                setAddInput({
                  ...addInput,
                  operation: e.target.value as "add" | "subtract",
                })
              }
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="add">더하기 (+)</option>
              <option value="subtract">빼기 (-)</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={addInput.excludeWeekends}
                onChange={(e) =>
                  setAddInput({
                    ...addInput,
                    excludeWeekends: e.target.checked,
                  })
                }
                className="mr-2 rounded"
              />
              주말 제외
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={addInput.excludeHolidays}
                onChange={(e) =>
                  setAddInput({
                    ...addInput,
                    excludeHolidays: e.target.checked,
                  })
                }
                className="mr-2 rounded"
              />
              공휴일 제외
            </label>
          </div>
        </div>

        {/* Results */}
        <div>
          {result.valid && result.resultDate ? (
            <div className="space-y-4">
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">
                  계산 결과
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      결과 날짜:
                    </span>
                    <span className="font-semibold">
                      {formatDate(result.resultDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      요일:
                    </span>
                    <span className="font-semibold">
                      {weekdays[result.resultDate.getDay()]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      연산:
                    </span>
                    <span className="font-semibold">
                      {addInput.base} {addInput.operation === "add" ? "+" : "-"}{" "}
                      {addInput.days}일
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                기준 날짜와 일수를 입력하면 결과가 표시됩니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          disabled={loading || !result.valid || !result.resultDate}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "복사 중..." : "결과 복사"}
        </button>
        <button
          onClick={resetForm}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          초기화
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AddSubtractPage;
