/**
 * Equality handles deep equality comparison with pattern matching
 * Follows single responsibility principle for object comparison
 */

import { matchPattern } from './patterns.js';
import { extractFieldFromObject } from './fields.js';

/**
 * Enhanced deep equality comparison with flexible pattern matching
 * @param {*} expected - Expected value (can include patterns)
 * @param {*} actual - Actual value
 * @param {string} path - Current path for error reporting
 * @returns {boolean} Whether values are equal
 */
export function deepEqual(expected, actual, path = '') {
  // Fast path for exact equality
  if (expected === actual) {return true;}

  // Handle string patterns BEFORE null checks to allow pattern matching on null values
  if (typeof expected === 'string' && expected.startsWith('match:')) {
    const pattern = expected.substring(6);
    return matchPattern(pattern, actual);
  }

  // Handle null/undefined cases (only after pattern matching)
  if (expected == null || actual == null) {
    return expected === actual;
  }

  // Handle special object-based patterns (only if they contain special keys)
  if (isObject(expected) && hasSpecialPatternKeys(expected)) {
    return handleObjectPatterns(expected, actual, path);
  }

  // Type mismatch
  if (typeof expected !== typeof actual) {return false;}

  // Handle non-object primitives
  if (typeof expected !== 'object') {
    return expected === actual;
  }

  // Handle arrays vs objects
  if (Array.isArray(expected) !== Array.isArray(actual)) {
    return false;
  }

  // Handle arrays
  if (Array.isArray(expected)) {
    return compareArrays(expected, actual, path);
  }

  // Handle regular objects
  return compareObjects(expected, actual, path);
}

/**
 * Check if an object has special pattern keys
 * @param {Object} obj - Object to check
 * @returns {boolean} Whether object has special pattern keys
 */
function hasSpecialPatternKeys(obj) {
  return 'match:partial' in obj ||
         'match:arrayElements' in obj ||
         'match:crossField' in obj ||
         ('match:extractField' in obj && 'value' in obj);
}

/**
 * Handle special object pattern matching
 * @param {Object} expected - Expected object with patterns
 * @param {*} actual - Actual value
 * @param {string} path - Current path
 * @returns {boolean} Whether pattern matches
 */
function handleObjectPatterns(expected, actual, path) {
  // Check for partial matching directive
  if ('match:partial' in expected) {
    return deepEqualPartial(expected['match:partial'], actual, path);
  }

  // Handle array element matching patterns
  if ('match:arrayElements' in expected) {
    if (!Array.isArray(actual)) {return false;}
    const elementPattern = expected['match:arrayElements'];
    return actual.every(item => deepEqualPartial(elementPattern, item, `${path  }[]`));
  }

  // Handle field extraction patterns
  if ('match:extractField' in expected && 'value' in expected) {
    const fieldPath = expected['match:extractField'];
    const expectedValue = expected['value'];
    const extractedValue = extractFieldFromObject(actual, fieldPath);
    return deepEqual(expectedValue, extractedValue, `${path  }.${  fieldPath}`);
  }

  // Handle cross-field patterns
  if ('match:crossField' in expected) {
    const crossFieldPattern = expected['match:crossField'];
    return matchPattern(`crossField:${crossFieldPattern}`, actual);
  }

  return false;
}

/**
 * Compare arrays for deep equality
 * @param {Array} expected - Expected array
 * @param {Array} actual - Actual array
 * @param {string} path - Current path
 * @returns {boolean} Whether arrays are equal
 */
function compareArrays(expected, actual, path) {
  if (expected.length !== actual.length) {return false;}

  for (let i = 0; i < expected.length; i++) {
    if (!deepEqual(expected[i], actual[i], `${path  }[${i}]`)) {
      return false;
    }
  }

  return true;
}

/**
 * Compare objects for deep equality
 * @param {Object} expected - Expected object
 * @param {Object} actual - Actual object
 * @param {string} path - Current path
 * @returns {boolean} Whether objects are equal
 */
function compareObjects(expected, actual, path) {
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);

  // Check for nested crossField patterns first
  if ('match:crossField' in expected) {
    // Handle nested crossField pattern within this object context
    const crossFieldPattern = expected['match:crossField'];
    if (!matchPattern(`crossField:${crossFieldPattern}`, actual)) {
      return false;
    }
    // Remove the crossField pattern from comparison and continue with other keys
    const filteredExpectedKeys = expectedKeys.filter(key => key !== 'match:crossField');
    const remainingExpected = {};
    for (const key of filteredExpectedKeys) {
      remainingExpected[key] = expected[key];
    }
    // Continue comparison with remaining keys
    return compareObjectsPartial(remainingExpected, actual, path);
  }

  if (expectedKeys.length !== actualKeys.length) {return false;}

  for (const key of expectedKeys) {
    if (!actualKeys.includes(key)) {return false;}

    const newPath = path ? `${path}.${key}` : key;
    if (!deepEqual(expected[key], actual[key], newPath)) {
      return false;
    }
  }

  return true;
}

/**
 * Partial object matching - only checks specified fields
 * @param {*} expected - Expected partial object
 * @param {*} actual - Actual object
 * @param {string} path - Current path for error reporting
 * @returns {boolean} Whether partial match succeeds
 */
export function deepEqualPartial(expected, actual, path = '') {
  // Fast path for exact equality
  if (expected === actual) {return true;}

  // Handle string patterns BEFORE null checks to allow pattern matching on null values
  if (typeof expected === 'string' && expected.startsWith('match:')) {
    const pattern = expected.substring(6);
    return matchPattern(pattern, actual);
  }

  // Handle null/undefined cases (only after pattern matching)
  if (expected == null || actual == null) {
    return expected === actual;
  }

  // For non-objects, use regular deep equality
  if (typeof expected !== 'object' || typeof actual !== 'object') {
    return deepEqual(expected, actual, path);
  }

  // Handle array mismatch
  if (Array.isArray(expected) !== Array.isArray(actual)) {
    return false;
  }

  // Handle arrays - look for matching elements (not exact order)
  if (Array.isArray(expected)) {
    return compareArraysPartial(expected, actual, path);
  }

  // For objects, only check the keys that exist in expected
  return compareObjectsPartial(expected, actual, path);
}

/**
 * Compare arrays for partial matching
 * @param {Array} expected - Expected array elements
 * @param {Array} actual - Actual array
 * @param {string} path - Current path
 * @returns {boolean} Whether all expected elements are found
 */
function compareArraysPartial(expected, actual, path) {
  for (let i = 0; i < expected.length; i++) {
    const expectedElement = expected[i];
    let found = false;

    // Search for a matching element in the actual array
    for (let j = 0; j < actual.length; j++) {
      if (deepEqualPartial(expectedElement, actual[j], `${path  }[${j}]`)) {
        found = true;
        break;
      }
    }

    if (!found) {return false;}
  }

  return true;
}

/**
 * Compare objects for partial matching
 * @param {Object} expected - Expected object (partial)
 * @param {Object} actual - Actual object
 * @param {string} path - Current path
 * @returns {boolean} Whether partial match succeeds
 */
function compareObjectsPartial(expected, actual, path) {
  // Check for nested crossField patterns first
  if ('match:crossField' in expected) {
    // Handle nested crossField pattern within this object context
    const crossFieldPattern = expected['match:crossField'];
    if (!matchPattern(`crossField:${crossFieldPattern}`, actual)) {
      return false;
    }
    // Remove the crossField pattern from comparison and continue with other keys
    const filteredExpected = {};
    for (const key of Object.keys(expected)) {
      if (key !== 'match:crossField') {
        filteredExpected[key] = expected[key];
      }
    }
    // Continue comparison with remaining keys
    for (const key of Object.keys(filteredExpected)) {
      if (!(key in actual)) {return false;}

      const newPath = path ? `${path}.${key}` : key;
      if (!deepEqualPartial(filteredExpected[key], actual[key], newPath)) {
        return false;
      }
    }
    return true;
  }

  for (const key of Object.keys(expected)) {
    if (!(key in actual)) {return false;}

    const newPath = path ? `${path}.${key}` : key;
    if (!deepEqualPartial(expected[key], actual[key], newPath)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if value is a plain object
 * @param {*} value - Value to check
 * @returns {boolean} Whether value is an object
 */
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
