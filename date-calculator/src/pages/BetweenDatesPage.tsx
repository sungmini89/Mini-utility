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

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date: Date, holidays: Set<string>): boolean {
  const dateStr = date.toISOString().split("T")[0];
  return holidays.has(dateStr);
}

function differenceInDays(
  start: Date,
  end: Date,
  excludeWeekends: boolean,
  holidays: Set<string>
): number {
  const startCopy = new Date(start);
  const endCopy = new Date(end);
  let diff = 0;
  const step = startCopy < endCopy ? 1 : -1;

  while (
    (step === 1 && startCopy < endCopy) ||
    (step === -1 && startCopy > endCopy)
  ) {
    startCopy.setDate(startCopy.getDate() + step);
    const skipWeekend = excludeWeekends && isWeekend(startCopy);
    const skipHoliday = isHoliday(startCopy, holidays);
    if (skipWeekend || skipHoliday) {
      continue;
    }
    diff += step;
  }
  return diff;
}

function differenceInTimeUnits(start: Date, end: Date) {
  let delta = Math.abs(end.getTime() - start.getTime());
  const days = Math.floor(delta / (24 * 60 * 60 * 1000));
  delta -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(delta / (60 * 60 * 1000));
  delta -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(delta / (60 * 1000));
  delta -= minutes * 60 * 1000;
  const seconds = Math.floor(delta / 1000);
  return { days, hours, minutes, seconds };
}

function formatTimeDifference({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}): string {
  const parts: string[] = [];
  if (days) parts.push(`${days}일`);
  if (hours) parts.push(`${hours}시간`);
  if (minutes) parts.push(`${minutes}분`);
  if (seconds || parts.length === 0) parts.push(`${seconds}초`);
  return parts.join(" ");
}

interface BetweenInput {
  start: string;
  end: string;
  excludeWeekends: boolean;
  excludeHolidays: boolean;
}

const BetweenDatesPage: React.FC = () => {
  const [between, setBetween] = useLocalStorage<BetweenInput>(
    "dateCalculator:between",
    {
      start: "",
      end: "",
      excludeWeekends: false,
      excludeHolidays: false,
    }
  );

  const [result, setResult] = useState<{
    valid: boolean;
    daysIncluding: number;
    daysExcluding: number;
    timeDiff: { days: number; hours: number; minutes: number; seconds: number };
    error?: string;
  }>({
    valid: false,
    daysIncluding: 0,
    daysExcluding: 0,
    timeDiff: { days: 0, hours: 0, minutes: 0, seconds: 0 },
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, copy] = useClipboard();

  const holidaySet = useMemo(() => new Set<string>(KOREAN_HOLIDAYS), []);

  useEffect(() => {
    const startDate = parseDate(between.start);
    const endDate = parseDate(between.end);
    if (!startDate || !endDate) {
      setResult({
        valid: false,
        daysIncluding: 0,
        daysExcluding: 0,
        timeDiff: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        error: undefined,
      });
      return;
    }

    const daysIncluding = Math.floor(
      Math.abs(endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    const daysExcluding = differenceInDays(
      startDate,
      endDate,
      between.excludeWeekends,
      between.excludeHolidays ? holidaySet : new Set()
    );
    const timeDiff = differenceInTimeUnits(startDate, endDate);
    setResult({
      valid: true,
      daysIncluding,
      daysExcluding: Math.abs(daysExcluding),
      timeDiff,
    });
  }, [between, holidaySet]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleCopy = async () => {
    if (!result.valid) return;

    try {
      const text = `기간 차이: ${result.daysIncluding}일 (주말/휴일 제외: ${
        result.daysExcluding
      }일), 시간 차이: ${formatTimeDifference(result.timeDiff)}`;
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
    setBetween({
      start: "",
      end: "",
      excludeWeekends: false,
      excludeHolidays: false,
    });
    setToast({ message: "초기화되었습니다.", type: "success" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">두 날짜 사이 일수 계산</h1>
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
            <label
              htmlFor="start-date"
              className="block text-sm font-medium mb-2"
            >
              시작 날짜
            </label>
            <input
              id="start-date"
              type="date"
              value={between.start}
              onChange={(e) =>
                setBetween({ ...between, start: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="end-date"
              className="block text-sm font-medium mb-2"
            >
              종료 날짜
            </label>
            <input
              id="end-date"
              type="date"
              value={between.end}
              onChange={(e) => setBetween({ ...between, end: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="exclude-weekends"
              className="inline-flex items-center"
            >
              <input
                id="exclude-weekends"
                type="checkbox"
                checked={between.excludeWeekends}
                onChange={(e) =>
                  setBetween({ ...between, excludeWeekends: e.target.checked })
                }
                className="mr-2 rounded"
              />
              주말 제외
            </label>
            <label
              htmlFor="exclude-holidays"
              className="inline-flex items-center"
            >
              <input
                id="exclude-holidays"
                type="checkbox"
                checked={between.excludeHolidays}
                onChange={(e) =>
                  setBetween({ ...between, excludeHolidays: e.target.checked })
                }
                className="mr-2 rounded"
              />
              공휴일 제외
            </label>
          </div>
        </div>

        {/* Results */}
        <div>
          {result.valid ? (
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                  계산 결과
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      전체 일수:
                    </span>
                    <span className="font-semibold">
                      {result.daysIncluding}일
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      주말/휴일 제외:
                    </span>
                    <span className="font-semibold">
                      {result.daysExcluding}일
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      시간 차이:
                    </span>
                    <span className="font-semibold">
                      {formatTimeDifference(result.timeDiff)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                날짜를 선택하면 결과가 표시됩니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          disabled={loading || !result.valid}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default BetweenDatesPage;
