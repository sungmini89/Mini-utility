import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import RegexTester from ".";

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

// Mock navigator.clipboard
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: jest.fn(),
  },
});

describe("RegexTester", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
    jest.clearAllMocks();
  });

  test("finds numeric matches in test text", async () => {
    render(<RegexTester />);
    // Set pattern to \d+
    const patternInput = screen.getByLabelText(
      /Regular Expression/i
    ) as HTMLInputElement;
    fireEvent.change(patternInput, { target: { value: "\\d+" } });
    // Ensure global flag is on
    const gFlagCheckbox = screen.getByLabelText("g") as HTMLInputElement;
    if (!gFlagCheckbox.checked) {
      fireEvent.click(gFlagCheckbox);
    }
    // Enter test text
    const textArea = screen.getByLabelText(/Test Text/i) as HTMLTextAreaElement;
    fireEvent.change(textArea, { target: { value: "abc 123 def 456" } });
    // Wait for matches to update
    await waitFor(() => {
      expect(screen.getByText(/Matches \(2\)/i)).toBeInTheDocument();
    });
  });

  test("shows error for invalid regex", async () => {
    render(<RegexTester />);
    const patternInput = screen.getByLabelText(
      /Regular Expression/i
    ) as HTMLInputElement;
    fireEvent.change(patternInput, { target: { value: "[" } }); // Invalid regex

    await waitFor(() => {
      expect(
        screen.getByText("Invalid regular expression")
      ).toBeInTheDocument();
    });
  });

  test("handles capture groups correctly", async () => {
    render(<RegexTester />);
    const patternInput = screen.getByLabelText(
      /Regular Expression/i
    ) as HTMLInputElement;
    fireEvent.change(patternInput, { target: { value: "(\\d+)([a-z]+)" } });

    const textArea = screen.getByLabelText(/Test Text/i) as HTMLTextAreaElement;
    fireEvent.change(textArea, { target: { value: "123abc 456def" } });

    await waitFor(() => {
      // Use getAllByText to handle multiple elements
      const groupElements = screen.getAllByText(/Group \d+:/);
      expect(groupElements.length).toBeGreaterThan(0);
    });
  });

  test("toggles regex flags correctly", () => {
    render(<RegexTester />);
    const gFlagCheckbox = screen.getByLabelText("g") as HTMLInputElement;
    const iFlagCheckbox = screen.getByLabelText("i") as HTMLInputElement;

    expect(gFlagCheckbox.checked).toBe(true); // Default value
    expect(iFlagCheckbox.checked).toBe(false);

    fireEvent.click(iFlagCheckbox);
    expect(iFlagCheckbox.checked).toBe(true);

    fireEvent.click(gFlagCheckbox);
    expect(gFlagCheckbox.checked).toBe(false);
  });

  test("applies regex templates", async () => {
    render(<RegexTester />);
    const templateSelect = screen.getByLabelText(
      /Template:/
    ) as HTMLSelectElement;

    fireEvent.change(templateSelect, { target: { value: "Email" } });

    await waitFor(() => {
      // Check if the pattern input contains the email regex
      const patternInput = screen.getByLabelText(
        /Regular Expression/i
      ) as HTMLInputElement;
      expect(patternInput.value).toContain("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+");
    });
  });

  test("saves and loads patterns", async () => {
    render(<RegexTester />);
    const patternInput = screen.getByLabelText(
      /Regular Expression/i
    ) as HTMLInputElement;
    const saveButton = screen.getByText("Save");

    fireEvent.change(patternInput, { target: { value: "test" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Pattern saved")).toBeInTheDocument();
    });

    // Check if pattern appears in saved list
    expect(screen.getByText("/test/")).toBeInTheDocument();
  });

  test("handles replacement functionality", async () => {
    render(<RegexTester />);
    const patternInput = screen.getByLabelText(
      /Regular Expression/i
    ) as HTMLInputElement;
    const replacementInput = screen.getByLabelText(
      /Replacement \(optional\)/i
    ) as HTMLInputElement;
    const testTextArea = screen.getByLabelText(
      /Test Text/i
    ) as HTMLTextAreaElement;

    fireEvent.change(patternInput, { target: { value: "\\d+" } });
    fireEvent.change(replacementInput, { target: { value: "NUMBER" } });
    fireEvent.change(testTextArea, { target: { value: "abc 123 def" } });

    await waitFor(() => {
      const replaceOutput = screen.getByLabelText(
        /Replace Output/i
      ) as HTMLTextAreaElement;
      expect(replaceOutput.value).toBe("abc NUMBER def");
    });
  });

  test("shows pattern description", async () => {
    render(<RegexTester />);
    const patternInput = screen.getByLabelText(
      /Regular Expression/i
    ) as HTMLInputElement;
    fireEvent.change(patternInput, { target: { value: "\\d+" } });

    await waitFor(() => {
      // Use getAllByText to handle multiple elements
      const digitElements = screen.getAllByText("digit (0–9)");
      expect(digitElements.length).toBeGreaterThan(0);

      const plusElements = screen.getAllByText(
        "one or more of the preceding element"
      );
      expect(plusElements.length).toBeGreaterThan(0);
    });
  });
});
