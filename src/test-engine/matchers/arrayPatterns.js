/**
 * Array Patterns - Handles array-specific pattern matching
 * Follows single responsibility principle for array pattern operations
 */

import { getNestedValue } from './patternUtils.js';

/**
 * Handle array length pattern matching
 * @param {string} pattern - Pattern with 'arrayLength:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleArrayLengthPattern(pattern, actual) {
  const expectedLength = parseInt(pattern.substring(12));
  return Array.isArray(actual) && actual.length === expectedLength;
}

/**
 * Handle array contains pattern matching
 * Supports both simple value matching and object field matching with dot notation
 * Examples:
 * - arrayContains:value - checks if array contains 'value'
 * - arrayContains:field:value - checks if array contains object where obj.field === 'value'
 * - arrayContains:nested.field:value - checks if array contains object where obj.nested.field === 'value'
 * @param {string} pattern - Pattern with 'arrayContains:' prefix
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function handleArrayContainsPattern(pattern, actual) {
  const searchPart = pattern.substring(14); // Remove 'arrayContains:' prefix

  if (!Array.isArray(actual)) {
    return false;
  }

  // Check if this is field-based matching (contains ':' separator)
  const colonIndex = searchPart.indexOf(':');

  if (colonIndex === -1) {
    // Simple value matching (original behavior with type conversion support)
    return actual.some(item => {
      // Direct equality check first (most efficient)
      if (item === searchPart) {
        return true;
      }
      // String conversion check for numbers and other types
      return String(item) === searchPart;
    });
  }

  // Field-based matching: arrayContains:field:value or arrayContains:nested.field:value
  const fieldPath = searchPart.substring(0, colonIndex);
  const fieldValue = searchPart.substring(colonIndex + 1);

  return actual.some(item => {
    // Handle objects with the specified field path (supports dot notation)
    if (typeof item === 'object' && item !== null) {
      const actualValue = getNestedValue(item, fieldPath);
      return actualValue !== undefined && String(actualValue) === fieldValue;
    }
    return false;
  });
}
