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

/**
 * Handle equals pattern matching (exact numeric equality)
 * @param {string} pattern - Pattern with 'equals:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleEqualsPattern(pattern, actual) {
  const expected = parseFloat(pattern.substring(7)); // Remove 'equals:' prefix
  const actualNumber = parseFloat(actual);

  if (isNaN(expected) || isNaN(actualNumber)) {
    return false;
  }

  return actualNumber === expected;
}

/**
 * Handle not equals pattern matching (numeric inequality)
 * @param {string} pattern - Pattern with 'notEquals:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleNotEqualsPattern(pattern, actual) {
  const expected = parseFloat(pattern.substring(10)); // Remove 'notEquals:' prefix
  const actualNumber = parseFloat(actual);

  if (isNaN(expected) || isNaN(actualNumber)) {
    return false;
  }

  return actualNumber !== expected;
}

/**
 * Handle approximately pattern matching (floating point tolerance)
 * @param {string} pattern - Pattern with 'approximately:' prefix (format: 'approximately:value:tolerance')
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleApproximatelyPattern(pattern, actual) {
  const params = pattern.substring(14); // Remove 'approximately:' prefix
  const parts = params.split(':');

  if (parts.length !== 2) {
    return false;
  }

  const expected = parseFloat(parts[0]);
  const tolerance = parseFloat(parts[1]);
  const actualNumber = parseFloat(actual);

  if (isNaN(expected) || isNaN(tolerance) || isNaN(actualNumber)) {
    return false;
  }

  return Math.abs(actualNumber - expected) <= tolerance;
}

/**
 * Handle multiple of pattern matching (modular arithmetic)
 * @param {string} pattern - Pattern with 'multipleOf:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleMultipleOfPattern(pattern, actual) {
  const divisor = parseFloat(pattern.substring(11)); // Remove 'multipleOf:' prefix
  const actualNumber = parseFloat(actual);

  if (isNaN(divisor) || isNaN(actualNumber) || divisor === 0) {
    return false;
  }

  return actualNumber % divisor === 0;
}

/**
 * Handle divisible by pattern matching (alias for multipleOf)
 * @param {string} pattern - Pattern with 'divisibleBy:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDivisibleByPattern(pattern, actual) {
  const divisor = parseFloat(pattern.substring(12)); // Remove 'divisibleBy:' prefix
  const actualNumber = parseFloat(actual);

  if (isNaN(divisor) || isNaN(actualNumber) || divisor === 0) {
    return false;
  }

  return actualNumber % divisor === 0;
}

/**
 * Handle decimal places pattern matching (precision validation)
 * @param {string} pattern - Pattern with 'decimalPlaces:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDecimalPlacesPattern(pattern, actual) {
  const expectedPlaces = parseInt(pattern.substring(14), 10); // Remove 'decimalPlaces:' prefix
  const actualNumber = parseFloat(actual);

  if (isNaN(expectedPlaces) || isNaN(actualNumber)) {
    return false;
  }

  // Convert to string and check decimal places
  const actualStr = actualNumber.toString();
  const decimalIndex = actualStr.indexOf('.');

  if (decimalIndex === -1) {
    // No decimal point, so 0 decimal places
    return expectedPlaces === 0;
  }

  const actualPlaces = actualStr.length - decimalIndex - 1;
  return actualPlaces === expectedPlaces;
}
