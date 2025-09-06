/**
 * Field Extractor - Handles field extraction from nested objects
 * Follows single responsibility principle for object field extraction
 */

/**
 * Extract field value from nested object using dot notation
 * @param {*} obj - Source object
 * @param {string} fieldPath - Dot-separated field path (e.g., "tools.0.name" or "tools.*.name")
 * @returns {*} Extracted value
 */
export function extractFieldFromObject(obj, fieldPath) {
  const parts = fieldPath.split('.');
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (current == null) {return undefined;}

    if (part === '*' && Array.isArray(current)) {
      return handleWildcardExtraction(current, parts, i);
    }

    if (Array.isArray(current) && isNumericIndex(part)) {
      current = current[parseInt(part)];
    } else if (isObject(current)) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Handle wildcard extraction from arrays
 * @param {Array} array - The array to extract from
 * @param {Array} parts - Path parts
 * @param {number} wildcardIndex - Index of wildcard in parts
 * @returns {Array|*} Extracted values
 */
function handleWildcardExtraction(array, parts, wildcardIndex) {
  const remainingPath = parts.slice(wildcardIndex + 1).join('.');

  if (remainingPath) {
    return array.map(item => extractFieldFromObject(item, remainingPath));
  }

  return array;
}

/**
 * Check if a string represents a numeric index
 * @param {string} str - String to check
 * @returns {boolean} Whether the string is numeric
 */
function isNumericIndex(str) {
  return /^\d+$/.test(str);
}

/**
 * Check if value is a plain object
 * @param {*} value - Value to check
 * @returns {boolean} Whether value is an object
 */
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
