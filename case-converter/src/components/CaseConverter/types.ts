/**
 * Enumerates the supported case conversion options.  Each case is
 * represented by a human‑readable name that appears on the conversion
 * buttons and in the history list.
 */
export type CaseOption =
  | 'UPPERCASE'
  | 'lowercase'
  | 'Title Case'
  | 'Sentence case'
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'InVeRsE CaSe';

/**
 * Records a single conversion in the user's history.  Each entry stores
 * the input and output text, the chosen conversion option and a
 * timestamp so items can be ordered.
 */
export interface HistoryItem {
  option: CaseOption;
  input: string;
  output: string;
  date: number;
}