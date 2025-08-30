import { renderHook } from "@testing-library/react";
import { act } from "react";
import useClipboard from "./useClipboard";

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("useClipboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("returns initial state", () => {
    const { result } = renderHook(() => useClipboard());

    expect(result.current[0]).toBe(false);
    expect(typeof result.current[1]).toBe("function");
  });

  test("copies text successfully", async () => {
    const mockClipboard = navigator.clipboard as any;
    mockClipboard.writeText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current[1]("test text");
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith("test text");
    expect(result.current[0]).toBe(true);
  });

  test("sets copied to false after timeout", async () => {
    const mockClipboard = navigator.clipboard as any;
    mockClipboard.writeText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current[1]("test text");
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current[0]).toBe(false);
  });

  test("handles copy failure", async () => {
    const mockClipboard = navigator.clipboard as any;
    mockClipboard.writeText.mockRejectedValue(new Error("Copy failed"));

    const { result } = renderHook(() => useClipboard());

    await expect(
      act(async () => {
        await result.current[1]("test text");
      })
    ).rejects.toThrow("Copy failed");

    expect(result.current[0]).toBe(false);
  });

  test("warns when copying empty text", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current[1]("");
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "useClipboard: attempting to copy empty text"
    );
    expect(result.current[0]).toBe(false);

    consoleSpy.mockRestore();
  });

  test("warns when copying whitespace only", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current[1]("   ");
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "useClipboard: attempting to copy empty text"
    );
    expect(result.current[0]).toBe(false);

    consoleSpy.mockRestore();
  });

  test("clears previous timeout when copying again", async () => {
    const mockClipboard = navigator.clipboard as any;
    mockClipboard.writeText.mockResolvedValue(undefined);

    const { result } = renderHook(() => useClipboard());

    // First copy
    await act(async () => {
      await result.current[1]("first text");
    });

    expect(result.current[0]).toBe(true);

    // Second copy before timeout
    await act(async () => {
      await result.current[1]("second text");
    });

    expect(result.current[0]).toBe(true);

    // Advance time to see if first timeout was cleared
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should still be true because second timeout is active
    expect(result.current[0]).toBe(false);
  });
});
