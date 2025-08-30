import { renderHook } from "@testing-library/react";
import { act } from "react";
import useLocalStorage from "./useLocalStorage";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useLocalStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns default value when localStorage is empty", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default-value")
    );

    expect(result.current[0]).toBe("default-value");
  });

  test("returns stored value from localStorage", () => {
    localStorageMock.getItem.mockReturnValue('"stored-value"');

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default-value")
    );

    expect(result.current[0]).toBe("stored-value");
    expect(localStorageMock.getItem).toHaveBeenCalledWith("test-key");
  });

  test("updates localStorage when value changes", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default-value")
    );

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "test-key",
      '"new-value"'
    );
  });

  test("handles function updates", () => {
    localStorageMock.getItem.mockReturnValue('"initial-value"');

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default-value")
    );

    act(() => {
      result.current[1]((prev: string) => prev + "-updated");
    });

    expect(result.current[0]).toBe("initial-value-updated");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "test-key",
      '"initial-value-updated"'
    );
  });

  test("removes item from localStorage when value is undefined", () => {
    localStorageMock.getItem.mockReturnValue('"initial-value"');

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default-value")
    );

    act(() => {
      result.current[1](undefined as any);
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("test-key");
  });

  test("handles localStorage errors gracefully", () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default-value")
    );

    expect(result.current[0]).toBe("default-value");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
