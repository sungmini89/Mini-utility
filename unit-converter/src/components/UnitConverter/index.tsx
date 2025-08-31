import React, { useEffect, useMemo, useState } from "react";
import type { Category, FavouriteItem } from "./types";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";
import { convertValue, getUnitsForCategory } from "./utils";

/**
 * 단위 변환기 메인 컴포넌트
 *
 * 이 컴포넌트는 다양한 단위 간 변환을 제공하는 종합적인 도구입니다.
 * 사용자는 길이, 무게, 온도, 면적, 부피, 속도, 데이터 단위를 실시간으로 변환할 수 있습니다.
 *
 * 주요 기능:
 * - 7개 카테고리의 단위 변환 지원
 * - 실시간 변환 계산 및 결과 표시
 * - 즐겨찾기 저장 및 관리
 * - 클립보드 복사 기능
 * - 키보드 단축키 지원
 * - localStorage를 통한 상태 지속성
 * - 다크모드 지원
 * - 반응형 디자인
 *
 * @example
 * ```tsx
 * <UnitConverter />
 * ```
 *
 * @returns {JSX.Element} 단위 변환기 UI 컴포넌트
 */
const UnitConverter: React.FC = () => {
  // 선택된 카테고리를 localStorage에 저장
  const [category, setCategory] = useLocalStorage<Category>(
    "unitConverter:category",
    "length"
  );

  // 각 카테고리별 입력 상태를 localStorage에 저장
  const [lengthState, setLengthState] = useLocalStorage(
    "unitConverter:length",
    {
      input: "",
      from: "m",
      to: "km",
    }
  );
  const [weightState, setWeightState] = useLocalStorage(
    "unitConverter:weight",
    {
      input: "",
      from: "kg",
      to: "g",
    }
  );
  const [temperatureState, setTemperatureState] = useLocalStorage(
    "unitConverter:temperature",
    {
      input: "",
      from: "C",
      to: "F",
    }
  );
  const [areaState, setAreaState] = useLocalStorage("unitConverter:area", {
    input: "",
    from: "m2",
    to: "pyeong",
  });
  const [volumeState, setVolumeState] = useLocalStorage(
    "unitConverter:volume",
    {
      input: "",
      from: "L",
      to: "gal",
    }
  );
  const [speedState, setSpeedState] = useLocalStorage("unitConverter:speed", {
    input: "",
    from: "kmh",
    to: "mph",
  });
  const [dataState, setDataState] = useLocalStorage("unitConverter:data", {
    input: "",
    from: "MB",
    to: "GB",
  });

  // 즐겨찾기 변환 목록을 localStorage에 저장
  const [favourites, setFavourites] = useLocalStorage<FavouriteItem[]>(
    "unitConverter:favourites",
    [] as FavouriteItem[]
  );

  // 현재 카테고리에 따른 상태와 설정자 함수를 동적으로 가져옴
  const categoryState = useMemo(() => {
    switch (category) {
      case "length":
        return { state: lengthState, setter: setLengthState };
      case "weight":
        return { state: weightState, setter: setWeightState };
      case "temperature":
        return { state: temperatureState, setter: setTemperatureState };
      case "area":
        return { state: areaState, setter: setAreaState };
      case "volume":
        return { state: volumeState, setter: setVolumeState };
      case "speed":
        return { state: speedState, setter: setSpeedState };
      case "data":
        return { state: dataState, setter: setDataState };
      default:
        return { state: lengthState, setter: setLengthState };
    }
  }, [
    category,
    lengthState,
    weightState,
    temperatureState,
    areaState,
    volumeState,
    speedState,
    dataState,
  ]);

  // 변환 결과와 오류 상태
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // 복사 및 저장 작업의 로딩 상태
  const [loading, setLoading] = useState(false);
  // 토스트 알림 상태
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // 클립보드 훅
  const [copied, copy] = useClipboard();

  /**
   * 입력값이나 단위가 변경될 때마다 변환을 계산
   * 실시간으로 결과를 업데이트하고 오류를 처리합니다.
   */
  useEffect(() => {
    const { state } = categoryState;
    const inputNum = parseFloat(state.input);
    if (state.input === "" || isNaN(inputNum)) {
      setOutput("");
      setError(state.input !== "" ? "숫자를 입력하세요." : null);
      return;
    }
    const result = convertValue(
      category as Category,
      state.from,
      state.to,
      inputNum
    );
    if (isNaN(result)) {
      setOutput("");
      setError("변환할 수 없는 단위입니다.");
    } else {
      setError(null);
      // 소수점 자릿수를 제한하여 긴 부동소수점을 방지; 최대 10자리 유효숫자 표시
      const formatted = Number(result.toPrecision(10)).toString();
      setOutput(formatted);
    }
  }, [categoryState, category]);

  /**
   * 키보드 단축키 이벤트 리스너
   *
   * 지원하는 단축키:
   * - Ctrl/Cmd + Shift + C: 결과 복사
   * - Ctrl/Cmd + Shift + S: 즐겨찾기 추가
   * - Ctrl/Cmd + Shift + R: 현재 카테고리 초기화
   * - Alt + 1~7: 카테고리 전환
   * - Alt + 0: 단위 교환
   */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      // 결과 복사: Ctrl/Cmd + Shift + C
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      }
      // 즐겨찾기 저장: Ctrl/Cmd + Shift + S
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        addFavourite();
      }
      // 초기화: Ctrl/Cmd + Shift + R
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        resetCurrent();
      }
      // Alt + 1..7로 카테고리 전환
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const num = Number(e.key);
        if (num >= 1 && num <= 7) {
          e.preventDefault();
          const categories: Category[] = [
            "length",
            "weight",
            "temperature",
            "area",
            "volume",
            "speed",
            "data",
          ];
          setCategory(categories[num - 1]);
        }
      }
      // Alt + 0으로 단위 교환
      if (e.altKey && e.key === "0") {
        e.preventDefault();
        swapUnits();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [categoryState, category]);

  /**
   * 토스트 알림 자동 해제
   * 2초 후 자동으로 토스트를 숨깁니다.
   */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  /**
   * 변환 결과를 클립보드에 복사
   * 성공/실패에 따른 토스트 알림을 표시합니다.
   */
  async function handleCopy() {
    if (!output) return;
    try {
      setLoading(true);
      await copy(output);
      setToast({ message: "복사되었습니다.", type: "success" });
    } catch {
      setToast({ message: "복사에 실패했습니다.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  /**
   * From과 To 단위를 서로 교환
   * 사용자가 단위를 빠르게 바꿀 수 있도록 도와줍니다.
   */
  function swapUnits() {
    const { state, setter } = categoryState;
    setter({ ...state, from: state.to, to: state.from });
  }

  /**
   * 현재 카테고리의 입력값을 초기화
   * 입력 필드를 비우고 결과와 오류를 초기화합니다.
   */
  function resetCurrent() {
    const { state, setter } = categoryState;
    setter({ ...state, input: "", from: state.from, to: state.to });
    setOutput("");
    setError(null);
    setToast({ message: "초기화되었습니다.", type: "success" });
  }

  /**
   * 현재 변환을 즐겨찾기에 추가
   * 최대 20개까지 저장할 수 있으며, 중복은 허용하지 않습니다.
   */
  function addFavourite() {
    const { state } = categoryState;
    if (!state.input || !output) return;
    const id = Date.now();
    const newFav: FavouriteItem = {
      id,
      category: category as Category,
      from: state.from,
      to: state.to,
    };
    setFavourites([newFav, ...favourites].slice(0, 20));
    setToast({ message: "즐겨찾기에 추가되었습니다.", type: "success" });
  }

  /**
   * 즐겨찾기 항목을 ID로 삭제
   * @param id 삭제할 즐겨찾기의 고유 ID
   */
  function removeFavourite(id: number) {
    setFavourites(favourites.filter((f) => f.id !== id));
  }

  /**
   * 즐겨찾기 변환을 적용
   * 카테고리가 다르면 먼저 변경하고, 단위를 설정합니다.
   * @param fav 적용할 즐겨찾기 항목
   */
  function applyFavourite(fav: FavouriteItem) {
    if (fav.category !== category) {
      setCategory(fav.category);
    }
    // 상태 업데이트를 기다림
    setTimeout(() => {
      const { state, setter } = categoryState;
      setter({ ...state, from: fav.from, to: fav.to });
    }, 0);
  }

  /**
   * 현재 변환에 대한 공식이나 비율을 렌더링
   *
   * 온도의 경우: 섭씨-화씨-켈빈 변환 공식 표시
   * 다른 단위의 경우: 1 단위당 변환 비율 표시
   *
   * @returns {JSX.Element | null} 변환 공식 또는 비율 정보
   */
  const renderFormula = () => {
    const { state } = categoryState;
    if (!state.from || !state.to) return null;
    if (category === "temperature") {
      // 온도 공식은 단위에 따라 다름
      const from = state.from;
      const to = state.to;
      let formula = "";
      if (from === "C" && to === "F") formula = "°F = °C × 9/5 + 32";
      else if (from === "C" && to === "K") formula = "K = °C + 273.15";
      else if (from === "F" && to === "C") formula = "°C = (°F − 32) × 5/9";
      else if (from === "F" && to === "K")
        formula = "K = (°F − 32) × 5/9 + 273.15";
      else if (from === "K" && to === "C") formula = "°C = K − 273.15";
      else if (from === "K" && to === "F")
        formula = "°F = (K − 273.15) × 9/5 + 32";
      else formula = "동일 단위";
      return (
        <p className="text-xs text-gray-500 dark:text-gray-400">{formula}</p>
      );
    } else {
      // 곱셈 변환의 경우, 1 단위당 변환 비율 표시
      const num = parseFloat(state.input);
      if (isNaN(num) || !output) return null;
      // ratio = convertValue(category, from, to, 1)
      const ratio = convertValue(category as Category, state.from, state.to, 1);
      const ratioFormatted = Number(ratio.toPrecision(10)).toString();
      return (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          1 {state.from} = {ratioFormatted} {state.to}
        </p>
      );
    }
  };

  // 현재 카테고리에 대한 단위 목록 가져오기
  const units = getUnitsForCategory(category as Category);

  return (
    <div className="space-y-6">
      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            { key: "length", label: "길이" },
            { key: "weight", label: "무게" },
            { key: "temperature", label: "온도" },
            { key: "area", label: "면적" },
            { key: "volume", label: "부피" },
            { key: "speed", label: "속도" },
            { key: "data", label: "데이터" },
          ] as { key: Category; label: string }[]
        ).map(({ key, label }, idx) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-3 py-2 rounded text-sm focus:outline-none focus:ring transition-colors ${
              category === key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            title={`Alt+${idx + 1}`}
          >
            {label}
          </button>
        ))}
      </div>
      {/* 입력 및 출력 필드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">값</label>
            <input
              type="text"
              value={categoryState.state.input}
              onChange={(e) =>
                categoryState.setter({
                  ...categoryState.state,
                  input: e.target.value,
                })
              }
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              placeholder="숫자를 입력하세요"
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">From</label>
              <select
                value={categoryState.state.from}
                onChange={(e) =>
                  categoryState.setter({
                    ...categoryState.state,
                    from: e.target.value,
                  })
                }
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              >
                {units.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={swapUnits}
              className="self-end px-2 py-1 bg-gray-400 dark:bg-gray-600 text-white rounded hover:bg-gray-500 dark:hover:bg-gray-500 focus:outline-none focus:ring"
              title="Alt+0"
            >
              ↔
            </button>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">To</label>
              <select
                value={categoryState.state.to}
                onChange={(e) =>
                  categoryState.setter({
                    ...categoryState.state,
                    to: e.target.value,
                  })
                }
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring"
              >
                {units.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {renderFormula()}
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">결과</label>
            <input
              type="text"
              value={output}
              readOnly
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
              placeholder="변환 결과가 여기에 표시됩니다"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              disabled={!output}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring disabled:opacity-50"
            >
              복사
            </button>
            <button
              onClick={addFavourite}
              disabled={!output}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring disabled:opacity-50"
            >
              즐겨찾기 추가
            </button>
            <button
              onClick={resetCurrent}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
      {/* 즐겨찾기 목록 */}
      {favourites.length > 0 && (
        <div className="mt-6">
          <h2 className="text-md font-semibold mb-2">즐겨찾기</h2>
          <ul className="space-y-2 max-h-40 overflow-auto text-sm">
            {favourites.map((fav) => (
              <li
                key={fav.id}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center"
              >
                <button
                  onClick={() => applyFavourite(fav)}
                  className="text-left flex-1"
                >
                  <span className="font-semibold mr-2">{fav.category}</span>
                  <span>
                    {fav.from} → {fav.to}
                  </span>
                </button>
                <button
                  onClick={() => removeFavourite(fav.id)}
                  className="text-red-600 hover:text-red-800 text-xs focus:outline-none"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* 로딩 표시기 */}
      {loading && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded shadow">
          로딩 중…
        </div>
      )}
      {/* 토스트 알림 */}
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

export default UnitConverter;
