/**
 * Normalize a string for skill matching
 * - lowercase
 * - trim whitespace
 * - remove special characters except spaces and hyphens
 */
export function normalizeToken(token: string): string {
  return token
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s\-\/]/g, '');
}

/**
 * Parse a query string into normalized tokens
 * Splits by commas, spaces, or semicolons
 * Filters out empty tokens
 */
export function parseQueryTokens(query: string): string[] {
  const tokens = query
    .split(/[,;\s]+/)
    .map(normalizeToken)
    .filter((t) => t.length > 0);
  
  // Remove duplicates
  return [...new Set(tokens)];
}

/**
 * Normalize an array of skills
 */
export function normalizeSkills(skills: string[]): string[] {
  return skills.map(normalizeToken).filter((s) => s.length > 0);
}
