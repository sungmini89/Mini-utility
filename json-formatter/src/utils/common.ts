/**
 * Choose a random element from an array.  If the array is empty it
 * returns undefined.  Unused by this utility but provided for
 * consistency across projects.
 */
export function randomChoice<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Generate a list of words by cycling through the provided vocabulary
 * array until the desired count is reached.  Not used by the JSON
 * formatter but included for completeness.
 */
export function generateWords(vocab: string[], count: number): string[] {
  const result: string[] = [];
  let i = 0;
  while (result.length < count) {
    result.push(vocab[i % vocab.length]);
    i++;
  }
  return result;
}