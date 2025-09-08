/**
 * Field Extractor - Handles field extraction from nested objects
 * Follows single responsibility principle for object field extraction
 */

/**
 * Extract field value from nested object using dot notation or bracket notation
 * @param {*} obj - Source object
 * @param {string} fieldPath - Field path (e.g., "tools.0.name", "tools[5].name", "tools.*.name")
 * @returns {*} Extracted value
 */
export function extractFieldFromObject(obj, fieldPath) {
  // Parse field path to handle both dot notation and bracket notation
  const parts = parseFieldPath(fieldPath);
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (current == null) {return undefined;}

    if (part === '*' && Array.isArray(current)) {
      return handleWildcardExtraction(current, parts, i);
    }

    if (Array.isArray(current) && isNumericIndex(part)) {
      const index = parseInt(part);
      current = current[index];
    } else if (isObject(current)) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Parse field path to handle both dot notation and bracket notation
 * Supports: "tools.0.name", "tools[5].name", "tools.*.name", "tools[*].name"
 * @param {string} fieldPath - The field path to parse
 * @returns {Array<string>} Array of path parts
 */
function parseFieldPath(fieldPath) {
  const parts = [];
  let current = '';
  let inBrackets = false;
  
  for (let i = 0; i < fieldPath.length; i++) {
    const char = fieldPath[i];
    
    if (char === '[') {
      if (current) {
        parts.push(current);
        current = '';
      }
      inBrackets = true;
    } else if (char === ']') {
      if (current) {
        parts.push(current);
        current = '';
      }
      inBrackets = false;
    } else if (char === '.' && !inBrackets) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  
  if (current) {
    parts.push(current);
  }
  
  return parts;
}

/**
 * Handle wildcard extraction from arrays
 * @param {Array} array - The array to extract from
 * @param {Array} parts - Path parts
 * @param {number} wildcardIndex - Index of wildcard in parts
 * @returns {Array|*} Extracted values
 */
function handleWildcardExtraction(array, parts, wildcardIndex) {
  const remainingParts = parts.slice(wildcardIndex + 1);

  if (remainingParts.length > 0) {
    // Reconstruct path for remaining parts - need to handle both syntaxes
    const remainingPath = remainingParts.join('.');
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
