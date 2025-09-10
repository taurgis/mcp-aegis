/**
 * Pattern Utilities - Shared utility functions for pattern matching
 * Follows single responsibility principle for utility operations
 */

/**
 * Helper function to get nested value from object using dot notation
 * @param {Object} obj - The object to traverse
 * @param {string} path - Dot-separated path (e.g., "nested.field.value")
 * @returns {*} The value at the path, or undefined if not found
 */
export function getNestedValue(obj, path) {
  if (!path || typeof obj !== 'object' || obj === null) {
    return undefined;
  }

  return path.split('.').reduce((current, key) => {
    return (current && typeof current === 'object' && key in current)
      ? current[key]
      : undefined;
  }, obj);
}

/**
 * Check if a pattern looks like a regex pattern
 * @param {string} pattern - The pattern to check
 * @returns {boolean} Whether the pattern appears to be regex
 */
export function isRegexPattern(pattern) {
  const regexChars = ['.*', '.+', '^', '$', '\\d', '\\w', '\\s', '\\b', '[', '(', '|', '?', '*', '+', '{'];
  return regexChars.some(char => pattern.includes(char));
}
