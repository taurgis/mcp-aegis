/**
 * Parameter Parser Utility - Handles both JSON and pipe-separated parameter formats
 * Single responsibility: Parse various parameter string formats into JavaScript objects
 */

/**
 * Parse parameter string in either JSON or pipe-separated format
 * @param {string} paramString - Parameter string to parse
 * @param {string} context - Context for error messages ('tool arguments', 'method parameters', etc.)
 * @returns {Object} Parsed parameters object
 * @throws {Error} If parsing fails or format is invalid
 */
export function parseParameters(paramString, context = 'parameters') {
  if (!paramString || typeof paramString !== 'string') {
    return {};
  }

  const trimmed = paramString.trim();
  if (!trimmed) {
    return {};
  }

  // Try JSON format first (if starts with { or [ or is a quoted string/null/boolean)
  if (trimmed.startsWith('{') || trimmed.startsWith('[') ||
      trimmed === 'null' || trimmed === 'true' || trimmed === 'false' ||
      trimmed.startsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error(`${context} must be a JSON object`);
      }
      return parsed;
    } catch (error) {
      if (error.message.includes(`${context} must be`)) {
        throw error;
      }
      // For some specific cases like malformed JSON that starts with {,
      // try pipe format as fallback
      if (trimmed.startsWith('{') && !trimmed.endsWith('}')) {
        // This is likely malformed JSON intended as pipe format
        try {
          return parsePipeSeparated(trimmed, context);
        } catch {
          // If pipe parsing also fails, throw the original JSON error
          throw new Error(`Invalid JSON for ${context}: ${error.message}`);
        }
      }
      throw new Error(`Invalid JSON for ${context}: ${error.message}`);
    }
  }

  // Parse pipe-separated format: param1:value1|param2:value2
  try {
    return parsePipeSeparated(trimmed, context);
  } catch (error) {
    // If pipe format fails, try JSON one more time in case it's malformed JSON
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error(`${context} must be a JSON object`);
      }
      return parsed;
    } catch {
      // Return the original pipe parsing error since that's more likely what the user intended
      throw error;
    }
  }
}

/**
 * Parse pipe-separated parameter format: param1:value1|param2:value2
 * Supports nested object notation with dots: obj.field:value
 * @param {string} paramString - Pipe-separated parameter string
 * @param {string} context - Context for error messages
 * @returns {Object} Parsed parameters object
 * @throws {Error} If format is invalid
 */
function parsePipeSeparated(paramString, context) {
  const result = {};

  // Split by pipe character, but handle escaped pipes
  const pairs = splitByPipe(paramString);

  for (const pair of pairs) {
    const trimmedPair = pair.trim();
    if (!trimmedPair) {
      continue;
    }

    // Find the first colon that separates key from value
    const colonIndex = trimmedPair.indexOf(':');
    if (colonIndex === -1) {
      throw new Error(`Invalid ${context} format: "${trimmedPair}" - expected format "key:value"`);
    }

    const key = trimmedPair.substring(0, colonIndex).trim();
    const value = trimmedPair.substring(colonIndex + 1).trim();

    if (!key) {
      throw new Error(`Invalid ${context} format: empty key in "${trimmedPair}"`);
    }

    // Parse the value and set it in the result object
    const parsedValue = parseValue(value);
    setNestedProperty(result, key, parsedValue);
  }

  return result;
}

/**
 * Split string by pipe character, handling escaped pipes
 * @param {string} str - String to split
 * @returns {string[]} Array of split parts
 */
function splitByPipe(str) {
  const parts = [];
  let current = '';
  let i = 0;

  while (i < str.length) {
    if (str[i] === '\\' && i + 1 < str.length && str[i + 1] === '|') {
      // Escaped pipe - add literal pipe to current part
      current += '|';
      i += 2;
    } else if (str[i] === '|') {
      // Unescaped pipe - split here
      parts.push(current);
      current = '';
      i++;
    } else {
      current += str[i];
      i++;
    }
  }

  // Add the last part
  if (current || parts.length === 0) {
    parts.push(current);
  }

  return parts;
}

/**
 * Parse a string value into appropriate JavaScript type
 * @param {string} value - String value to parse
 * @returns {*} Parsed value (string, number, boolean, null, or object)
 */
function parseValue(value) {
  if (!value) {
    return '';
  }

  // Handle special values
  if (value === 'null') {
    return null;
  }
  if (value === 'undefined') {
    return undefined;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  // Try to parse as number
  if (/^-?\d+$/.test(value)) {
    return parseInt(value, 10);
  }

  if (/^-?\d*\.\d+$/.test(value)) {
    return parseFloat(value);
  }

  // Try to parse as JSON (for objects, arrays, or quoted strings)
  if ((value.startsWith('{') && value.endsWith('}')) ||
      (value.startsWith('[') && value.endsWith(']')) ||
      (value.startsWith('"') && value.endsWith('"'))) {
    try {
      return JSON.parse(value);
    } catch {
      // If JSON parsing fails, treat as string
    }
  }

  // Return as string
  return value;
}

/**
 * Set a nested property in an object using dot notation
 * @param {Object} obj - Target object
 * @param {string} path - Property path (e.g., 'obj.field.subfield')
 * @param {*} value - Value to set
 */
function setNestedProperty(obj, path, value) {
  const parts = path.split('.');
  let current = obj;

  // Navigate to the parent of the final property
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {};
    }
    current = current[part];
  }

  // Set the final property
  const finalKey = parts[parts.length - 1];
  current[finalKey] = value;
}

/**
 * Format examples showing both JSON and pipe-separated formats
 * @param {string} context - Context for the examples
 * @returns {string[]} Array of example strings
 */
export function getParameterFormatExamples(_context = 'parameters') {
  return [
    'JSON format: \'{"key": "value", "num": 42}\'',
    'Pipe format: \'key:value|num:42\'',
    'Nested objects: \'obj.field:value|obj.count:5\'',
    'Mixed types: \'text:hello|active:true|count:10|config:null\'',
    'Complex values: \'data:{"nested": "object"}|items:[1,2,3]\'',
    'Escaped pipes: \'message:hello\\|world|other:value\'',
  ];
}
