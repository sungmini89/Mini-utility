/**
 * An entry representing a conversion or formatting operation.  Stores
 * the original input, the resulting output, the type of view (e.g.
 * formatted, minified, yaml, csv, jsonpath) and a timestamp.
 */
export interface HistoryItem {
  input: string;
  output: string;
  view: string;
  date: number;
}

/**
 * Represents an error encountered during parsing or conversion.  The
 * message contains human‑friendly information and optionally
 * character index of the error to aid in highlighting.
 */
export interface ParseError {
  message: string;
  index?: number;
}