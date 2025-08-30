/**
 * Choose a random element from an array.  If the array is empty it
 * returns undefined.  Not used by the regex tester but provided for
 * completeness and potential future utilities.
 */
export function randomChoice<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Generate a list of words by cycling through the provided vocabulary
 * array until the desired count is reached.  This helper is unused in
 * the regex tester but included to mirror other utilities in the
 * project and allow easy extension.
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