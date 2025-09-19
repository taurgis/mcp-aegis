/**
 * Validation utilities - helper functions for pattern validation
 * Follows single responsibility principle - only concerned with validation helpers
 */

/**
 * Check if a string is a valid date format
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} Whether it's a valid date format
 */
export function isValidDateFormat(dateStr) {
  if (!dateStr) {
    return false;
  }

  // Check for common valid formats
  const dateFormats = [
    /^\d{4}-\d{2}-\d{2}$/,                           // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,        // YYYY-MM-DDTHH:MM:SS
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, // YYYY-MM-DDTHH:MM:SS.sssZ
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,       // YYYY-MM-DDTHH:MM:SSZ
    /^\d+$/,                                         // Unix timestamp
  ];

  const isValidFormat = dateFormats.some(format => format.test(dateStr));
  if (!isValidFormat) {
    return false;
  }

  // Try to parse the date to see if it's actually valid
  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Check if a pattern has a missing colon after pattern name
 * @param {string} pattern - Pattern to check
 * @returns {boolean} Whether it's missing a colon
 */
export function isMissingColon(pattern) {
  if (!pattern.startsWith('match:')) {
    return false;
  }

  // Check if pattern doesn't have a colon after the pattern name and is just a pattern name
  return !pattern.includes(':', 6) && isPatternNameOnly(pattern);
}

/**
 * Check if a pattern is just a pattern name without a value
 * @param {string} pattern - Pattern to check
 * @returns {boolean} Whether it's just a pattern name
 */
function isPatternNameOnly(pattern) {
  const patternNames = [
    'match:arrayLength', 'match:arrayContains', 'match:contains',
    'match:startsWith', 'match:endsWith', 'match:type', 'match:regex', 'match:length',
    'match:between', 'match:range', 'match:greaterThan', 'match:lessThan', 'match:equals',
    'match:notEquals', 'match:approximately', 'match:multipleOf', 'match:dateAfter',
    'match:dateBefore', 'match:dateAge', 'match:dateEquals', 'match:dateFormat',
    'match:extractField', 'match:partial', 'match:not',
  ];

  // Note: 'match:arrayElements' and 'match:exists' can be used without colons
  // when they are pattern object keys, so we don't include them here
  return patternNames.some(name => pattern === name);
}

/**
 * Extract regex part from a regex pattern
 * @param {string} pattern - Pattern containing regex
 * @returns {string|null} The regex part or null if not found
 */
export function extractRegexPart(pattern) {
  if (!pattern.includes('regex:')) {
    return null;
  }
  const parts = pattern.split('regex:');
  return parts.length > 1 ? parts[1] : null;
}

/**
 * Extract field path from extractField pattern
 * @param {string} pattern - Pattern containing extractField
 * @returns {string|null} The field path or null if not found
 */
export function extractFieldPath(pattern) {
  if (!pattern.includes('extractField:')) {
    return null;
  }
  const parts = pattern.split('extractField:');
  return parts.length > 1 ? parts[1] : null;
}

/**
 * Check if a pattern uses proper dot notation for field paths
 * @param {string} fieldPath - Field path to check
 * @returns {boolean} Whether it uses proper dot notation
 */
export function hasProperDotNotation(fieldPath) {
  return fieldPath && (fieldPath.includes('.') || fieldPath.includes('*'));
}

/**
 * Check if a value is a number
 * @param {string} value - Value to check
 * @returns {boolean} Whether it's a valid number
 */
export function isNumeric(value) {
  // Handle edge cases that Number() incorrectly converts
  if (value === '' || value === null || value === undefined || typeof value === 'boolean') {
    return false;
  }

  // Handle string values with only whitespace
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  return !isNaN(Number(value)) && isFinite(Number(value));
}
