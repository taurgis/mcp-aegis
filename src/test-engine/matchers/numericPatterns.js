/**
 * Numeric Patterns - Handles numeric comparison pattern matching
 * Follows single responsibility principle for numeric pattern operations
 */

/**
 * Handle greater than pattern matching
 * @param {string} pattern - Pattern with 'greaterThan:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleGreaterThanPattern(pattern, actual) {
  const threshold = parseFloat(pattern.substring(12)); // Remove 'greaterThan:' prefix
  const actualNumber = parseFloat(actual);

  if (isNaN(threshold) || isNaN(actualNumber)) {
    return false;
  }

  return actualNumber > threshold;
}

/**
 * Handle greater than or equal pattern matching
 * @param {string} pattern - Pattern with 'greaterThanOrEqual:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleGreaterThanOrEqualPattern(pattern, actual) {
  const threshold = parseFloat(pattern.substring(19)); // Remove 'greaterThanOrEqual:' prefix
  const actualNumber = parseFloat(actual);

  if (isNaN(threshold) || isNaN(actualNumber)) {
    return false;
  }

  return actualNumber >= threshold;
}

/**
 * Handle less than pattern matching
 * @param {string} pattern - Pattern with 'lessThan:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleLessThanPattern(pattern, actual) {
  const threshold = parseFloat(pattern.substring(9)); // Remove 'lessThan:' prefix
  const actualNumber = parseFloat(actual);

  if (isNaN(threshold) || isNaN(actualNumber)) {
    return false;
  }

  return actualNumber < threshold;
}

/**
 * Handle less than or equal pattern matching
 * @param {string} pattern - Pattern with 'lessThanOrEqual:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleLessThanOrEqualPattern(pattern, actual) {
  const threshold = parseFloat(pattern.substring(16)); // Remove 'lessThanOrEqual:' prefix
  const actualNumber = parseFloat(actual);

  if (isNaN(threshold) || isNaN(actualNumber)) {
    return false;
  }

  return actualNumber <= threshold;
}

/**
 * Handle between pattern matching (inclusive)
 * @param {string} pattern - Pattern with 'between:' prefix (format: 'between:min:max')
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleBetweenPattern(pattern, actual) {
  const rangeStr = pattern.substring(8); // Remove 'between:' prefix
  const parts = rangeStr.split(':');

  if (parts.length !== 2) {
    return false;
  }

  const min = parseFloat(parts[0]);
  const max = parseFloat(parts[1]);
  const actualNumber = parseFloat(actual);

  if (isNaN(min) || isNaN(max) || isNaN(actualNumber)) {
    return false;
  }

  return actualNumber >= min && actualNumber <= max;
}

/**
 * Handle range pattern matching (alias for between - inclusive)
 * @param {string} pattern - Pattern with 'range:' prefix (format: 'range:min:max')
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleRangePattern(pattern, actual) {
  const rangeStr = pattern.substring(6); // Remove 'range:' prefix
  const parts = rangeStr.split(':');

  if (parts.length !== 2) {
    return false;
  }

  const min = parseFloat(parts[0]);
  const max = parseFloat(parts[1]);
  const actualNumber = parseFloat(actual);

  if (isNaN(min) || isNaN(max) || isNaN(actualNumber)) {
    return false;
  }

  return actualNumber >= min && actualNumber <= max;
}
