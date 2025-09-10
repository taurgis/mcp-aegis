/**
 * Type Patterns - Handles type validation and existence pattern matching
 * Follows single responsibility principle for type pattern operations
 */

/**
 * Handle length pattern matching (generic for strings or arrays)
 * @param {string} pattern - Pattern with 'length:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleLengthPattern(pattern, actual) {
  const expectedLength = parseInt(pattern.substring(7));
  if (Array.isArray(actual) || typeof actual === 'string') {
    return actual.length === expectedLength;
  }
  return false;
}

/**
 * Handle type pattern matching
 * @param {string} pattern - Pattern with 'type:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleTypePattern(pattern, actual) {
  const expectedType = pattern.substring(5);

  if (expectedType === 'array') {
    return Array.isArray(actual);
  }

  return typeof actual === expectedType;
}

/**
 * Handle exists pattern matching
 * @param {string} pattern - Pattern with 'exists' value
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleExistsPattern(pattern, actual) {
  return actual !== null && actual !== undefined;
}

/**
 * Handle count pattern matching (for arrays and objects)
 * @param {string} pattern - Pattern with 'count:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleCountPattern(pattern, actual) {
  const expectedCount = parseInt(pattern.substring(6));
  if (Array.isArray(actual)) {
    return actual.length === expectedCount;
  }
  if (typeof actual === 'object' && actual !== null) {
    return Object.keys(actual).length === expectedCount;
  }
  return false;
}
