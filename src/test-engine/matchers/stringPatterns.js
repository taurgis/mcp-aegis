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
