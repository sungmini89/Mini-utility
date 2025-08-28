/**
 * Truncate a string to the specified length, appending an ellipsis if it
 * exceeds that length.  Useful for rendering previews in the history list.
 */
export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}…`;
}