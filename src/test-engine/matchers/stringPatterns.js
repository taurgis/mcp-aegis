/**
 * String Patterns - Handles string-specific pattern matching
 * Follows single responsibility principle for string pattern operations
 */

import { isRegexPattern } from './patternUtils.js';

/**
 * Handle regex pattern matching
 * @param {string} pattern - Pattern with 'regex:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleRegexPattern(pattern, actual) {
  const regex = new RegExp(pattern.substring(6));
  return regex.test(String(actual));
}

/**
 * Handle contains pattern matching
 * @param {string} pattern - Pattern with 'contains:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleContainsPattern(pattern, actual) {
  const searchValue = pattern.substring(9);
  if (typeof actual === 'string') {
    return actual.includes(searchValue);
  }
  if (Array.isArray(actual)) {
    return actual.some(item => String(item).includes(searchValue));
  }
  return false;
}

/**
 * Handle starts with pattern matching
 * @param {string} pattern - Pattern with 'startsWith:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleStartsWithPattern(pattern, actual) {
  const prefix = pattern.substring(11);
  return typeof actual === 'string' && actual.startsWith(prefix);
}

/**
 * Handle ends with pattern matching
 * @param {string} pattern - Pattern with 'endsWith:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleEndsWithPattern(pattern, actual) {
  const suffix = pattern.substring(9);
  return typeof actual === 'string' && actual.endsWith(suffix);
}

/**
 * Handle contains pattern matching (case-insensitive)
 * @param {string} pattern - Pattern with 'containsIgnoreCase:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleContainsIgnoreCasePattern(pattern, actual) {
  const searchValue = pattern.substring(19); // 'containsIgnoreCase:'.length = 19
  if (typeof actual === 'string') {
    return actual.toLowerCase().includes(searchValue.toLowerCase());
  }
  if (Array.isArray(actual)) {
    return actual.some(item => String(item).toLowerCase().includes(searchValue.toLowerCase()));
  }
  return false;
}

/**
 * Handle equals pattern matching (case-insensitive)
 * @param {string} pattern - Pattern with 'equalsIgnoreCase:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleEqualsIgnoreCasePattern(pattern, actual) {
  const expectedValue = pattern.substring(17); // 'equalsIgnoreCase:'.length = 17
  return typeof actual === 'string' && actual.toLowerCase() === expectedValue.toLowerCase();
}

/**
 * Handle string length pattern matching (exact length)
 * @param {string} pattern - Pattern with 'stringLength:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleStringLengthPattern(pattern, actual) {
  const expectedLength = parseInt(pattern.substring(13)); // 'stringLength:'.length = 13
  return typeof actual === 'string' && actual.length === expectedLength;
}

/**
 * Handle string length greater than pattern matching
 * @param {string} pattern - Pattern with 'stringLengthGreaterThan:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleStringLengthGreaterThanPattern(pattern, actual) {
  const minLength = parseInt(pattern.substring(24)); // 'stringLengthGreaterThan:'.length = 24
  return typeof actual === 'string' && actual.length > minLength;
}

/**
 * Handle string length less than pattern matching
 * @param {string} pattern - Pattern with 'stringLengthLessThan:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleStringLengthLessThanPattern(pattern, actual) {
  const maxLength = parseInt(pattern.substring(21)); // 'stringLengthLessThan:'.length = 21
  return typeof actual === 'string' && actual.length < maxLength;
}

/**
 * Handle string length greater than or equal pattern matching
 * @param {string} pattern - Pattern with 'stringLengthGreaterThanOrEqual:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleStringLengthGreaterThanOrEqualPattern(pattern, actual) {
  const minLength = parseInt(pattern.substring(31)); // 'stringLengthGreaterThanOrEqual:'.length = 31
  return typeof actual === 'string' && actual.length >= minLength;
}

/**
 * Handle string length less than or equal pattern matching
 * @param {string} pattern - Pattern with 'stringLengthLessThanOrEqual:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleStringLengthLessThanOrEqualPattern(pattern, actual) {
  const maxLength = parseInt(pattern.substring(28)); // 'stringLengthLessThanOrEqual:'.length = 28
  return typeof actual === 'string' && actual.length <= maxLength;
}

/**
 * Handle string length between pattern matching
 * @param {string} pattern - Pattern with 'stringLengthBetween:' prefix (format: 'stringLengthBetween:min:max')
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleStringLengthBetweenPattern(pattern, actual) {
  const rangeStr = pattern.substring(20); // 'stringLengthBetween:'.length = 20
  const [minStr, maxStr] = rangeStr.split(':');
  const minLength = parseInt(minStr);
  const maxLength = parseInt(maxStr);

  if (isNaN(minLength) || isNaN(maxLength)) {
    return false;
  }

  return typeof actual === 'string' && actual.length >= minLength && actual.length <= maxLength;
}

/**
 * Handle string empty pattern matching
 * @param {string} pattern - Pattern 'stringEmpty'
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleStringEmptyPattern(pattern, actual) {
  return typeof actual === 'string' && actual.length === 0;
}

/**
 * Handle string not empty pattern matching
 * @param {string} pattern - Pattern 'stringNotEmpty'
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleStringNotEmptyPattern(pattern, actual) {
  return typeof actual === 'string' && actual.length > 0;
}

/**
 * Handle default pattern matching (regex detection or substring)
 * @param {string} pattern - The pattern without prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleDefaultPattern(pattern, actual) {
  if (isRegexPattern(pattern)) {
    const regex = new RegExp(pattern);
    return regex.test(String(actual));
  }

  // Default: substring contains matching
  return String(actual).includes(pattern);
}
