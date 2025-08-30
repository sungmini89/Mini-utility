import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import JsonFormatter from "./index";

// Mock the CodeMirror component to avoid complex dependencies
jest.mock("@uiw/react-codemirror", () => {
  return {
    Controlled: ({ value, onChange, height }: any) => (
      <textarea
        data-testid="codemirror-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ height }}
        aria-label="JSON Input"
      />
    ),
  };
});

// Mock the hooks by mocking the entire modules
jest.mock("../../hooks/useLocalStorage", () => ({
  __esModule: true,
  default: jest.fn((key: string, defaultValue: any) => {
    if (key === "jsonFormatter:input") {
      return [defaultValue, jest.fn()];
    }
    if (key === "jsonFormatter:view") {
      return [defaultValue, jest.fn()];
    }
    if (key === "jsonFormatter:history") {
      return [[], jest.fn()];
    }
    return [defaultValue, jest.fn()];
  }),
}));

jest.mock("../../hooks/useClipboard", () => ({
  __esModule: true,
  default: jest.fn(() => [false, jest.fn()]),
}));

describe("JsonFormatter Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<JsonFormatter />);
    expect(screen.getByText("JSON Input")).toBeInTheDocument();
    expect(screen.getByText("JSON Output")).toBeInTheDocument();
  });

  test("displays all view mode buttons", () => {
    render(<JsonFormatter />);

    expect(screen.getByText("Format")).toBeInTheDocument();
    expect(screen.getByText("Minify")).toBeInTheDocument();
    expect(screen.getByText("YAML")).toBeInTheDocument();
    expect(screen.getByText("CSV")).toBeInTheDocument();
    expect(screen.getByText("JSONPath")).toBeInTheDocument();
  });

  test("shows tree view toggle button", () => {
    render(<JsonFormatter />);

    const treeButton = screen.getByText("Show Tree");
    expect(treeButton).toBeInTheDocument();
  });

  test("displays action buttons", () => {
    render(<JsonFormatter />);

    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  test("shows history section", () => {
    render(<JsonFormatter />);

    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("No history")).toBeInTheDocument();
  });
});
