/**
 * Represents a single match result from applying a regular expression
 * against the test text.  It includes the matched substring, the
 * index at which the match was found and any captured groups.
 */
export interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

/**
 * Representation of a saved regular expression along with its flags and
 * a timestamp.  Saved patterns can be recalled later to avoid
 * retyping frequently used expressions.
 */
export interface SavedPattern {
  pattern: string;
  flags: string;
  date: number;
}

/**
 * A simple mapping from known regex tokens to a human readable
 * description.  Used by the description parser and cheat sheet.
 */
export interface TokenDescription {
  token: string;
  description: string;
}