import type { HistoryItem, ParseError } from "./types";
import * as YAML from "yaml";
import { JSONPath } from "jsonpath-plus";

/**
 * Attempt to parse a JSON string.  Returns an object containing a
 * boolean indicating validity and either the parsed value or an
 * error with position information.  Position is derived from the
 * error message of the built‑in JSON parser.
 */
export function validateJSON(input: string): {
  valid: boolean;
  value?: any;
  error?: ParseError;
} {
  if (!input.trim()) {
    return { valid: false, error: { message: "Input is empty" } };
  }

  try {
    const value = JSON.parse(input);
    return { valid: true, value };
  } catch (err: unknown) {
    // Attempt to extract position from error message
    const msg: string = err instanceof Error ? err.message : "Invalid JSON";
    let index: number | undefined;
    const match = msg.match(/position\s+(\d+)/i);
    if (match) {
      index = parseInt(match[1], 10);
    }
    return { valid: false, error: { message: msg, index } };
  }
}

/**
 * Convert a JSON value to a formatted string with two‑space
 * indentation.  Uses JSON.stringify which may throw on circular
 * references.
 */
export function formatJSON(value: any): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    throw new Error(`Failed to format JSON: ${errorMessage}`);
  }
}

/**
 * Convert a JSON value to a minified string without extra
 * whitespace.
 */
export function minifyJSON(value: any): string {
  try {
    return JSON.stringify(value);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    throw new Error(`Failed to minify JSON: ${errorMessage}`);
  }
}

/**
 * Convert a JSON value to YAML.  Uses the yaml library for
 * conversion.  Any exceptions are propagated to the caller.
 */
export function jsonToYAML(value: any): string {
  try {
    return YAML.stringify(value);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    throw new Error(`Failed to convert to YAML: ${errorMessage}`);
  }
}

/**
 * Attempt to parse YAML into a JavaScript value.  Throws on
 * malformed YAML.
 */
export function yamlToJSON(yamlStr: string): any {
  try {
    return YAML.parse(yamlStr);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    throw new Error(`Failed to parse YAML: ${errorMessage}`);
  }
}

/**
 * Convert an array of objects into a CSV string.  If the input is
 * not an array of objects a parse error is returned.  Handles
 * simple values; nested objects are stringified as JSON.
 */
export function jsonToCSV(value: any): string | ParseError {
  if (!Array.isArray(value)) {
    return { message: "CSV conversion requires an array of objects" };
  }
  if (value.length === 0) return "";

  try {
    const keys = Object.keys(value[0]);
    const lines = [];
    // header
    lines.push(keys.join(","));
    for (const item of value) {
      const row = keys.map((k) => {
        const cell = (item as any)[k];
        if (cell === null || cell === undefined) return "";
        if (typeof cell === "object") {
          try {
            return JSON.stringify(cell);
          } catch {
            return "[Complex Object]";
          }
        }
        return String(cell).replace(/"/g, '""');
      });
      lines.push(row.join(","));
    }
    return lines.join("\n");
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return { message: `CSV conversion failed: ${errorMessage}` };
  }
}

/**
 * Apply a JSONPath query to a value.  Returns the result of the
 * query.  Errors in the query itself propagate to the caller.
 */
export function applyJSONPath(value: any, path: string): any {
  try {
    return JSONPath({ path, json: value });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    throw new Error(`JSONPath query failed: ${errorMessage}`);
  }
}

/**
 * Given an index into a string, return the line and column number.
 */
export function positionToLineColumn(
  input: string,
  index: number
): { line: number; column: number } {
  if (index < 0 || index >= input.length) {
    return { line: 1, column: 1 };
  }

  let line = 1;
  let col = 1;
  for (let i = 0; i < index; i++) {
    if (input[i] === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
  }
  return { line, column: col };
}
