/**
 * Pattern Matcher - Handles all pattern matching logic for test assertions
 * Follows single responsibility principle for pattern matching operations
 */

/**
 * Pattern matching for YAML tests
 * @param {string} pattern - The pattern to match
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function matchPattern(pattern, actual) {
  const patternHandlers = {
    'regex:': handleRegexPattern,
    'length:': handleLengthPattern,
    'arrayLength:': handleArrayLengthPattern,
    'contains:': handleContainsPattern,
    'startsWith:': handleStartsWithPattern,
    'endsWith:': handleEndsWithPattern,
    'arrayContains:': handleArrayContainsPattern,
    'type:': handleTypePattern,
    'exists': handleExistsPattern,
    'count:': handleCountPattern
  };

  // Find matching handler
  for (const [prefix, handler] of Object.entries(patternHandlers)) {
    if (pattern.startsWith(prefix)) {
      return handler(pattern, actual);
    }
  }

  // Default handler for regex-like patterns or substring matching
  return handleDefaultPattern(pattern, actual);
}

/**
 * Handle regex pattern matching
 */
function handleRegexPattern(pattern, actual) {
  const regex = new RegExp(pattern.substring(6));
  return regex.test(String(actual));
}

/**
 * Handle length pattern matching
 */
function handleLengthPattern(pattern, actual) {
  const expectedLength = parseInt(pattern.substring(7));
  if (Array.isArray(actual) || typeof actual === 'string') {
    return actual.length === expectedLength;
  }
  return false;
}

/**
 * Handle array length pattern matching
 */
function handleArrayLengthPattern(pattern, actual) {
  const expectedLength = parseInt(pattern.substring(12));
  return Array.isArray(actual) && actual.length === expectedLength;
}

/**
 * Handle contains pattern matching
 */
function handleContainsPattern(pattern, actual) {
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
 */
function handleStartsWithPattern(pattern, actual) {
  const prefix = pattern.substring(11);
  return typeof actual === 'string' && actual.startsWith(prefix);
}

/**
 * Handle ends with pattern matching
 */
function handleEndsWithPattern(pattern, actual) {
  const suffix = pattern.substring(9);
  return typeof actual === 'string' && actual.endsWith(suffix);
}

/**
 * Handle array contains pattern matching
 */
function handleArrayContainsPattern(pattern, actual) {
  const searchValue = pattern.substring(14);
  return Array.isArray(actual) && actual.includes(searchValue);
}

/**
 * Handle type pattern matching
 */
function handleTypePattern(pattern, actual) {
  const expectedType = pattern.substring(5);
  
  if (expectedType === 'array') {
    return Array.isArray(actual);
  }
  
  return typeof actual === expectedType;
}

/**
 * Handle exists pattern matching
 */
function handleExistsPattern(pattern, actual) {
  return actual !== null && actual !== undefined;
}

/**
 * Handle count pattern matching
 */
function handleCountPattern(pattern, actual) {
  const expectedCount = parseInt(pattern.substring(6));
  if (Array.isArray(actual)) {
    return actual.length === expectedCount;
  }
  if (typeof actual === 'object' && actual !== null) {
    return Object.keys(actual).length === expectedCount;
  }
  return false;
}

/**
 * Handle default pattern matching (regex detection or substring)
 */
function handleDefaultPattern(pattern, actual) {
  const regexChars = ['.*', '.+', '^', '$', '\\d', '\\w', '\\s', '\\b', '[', '(', '|', '?', '*', '+', '{'];
  
  // Check if pattern looks like regex
  const isRegexPattern = regexChars.some(char => pattern.includes(char));
  
  if (isRegexPattern) {
    const regex = new RegExp(pattern);
    return regex.test(String(actual));
  }
  
  // Default: substring contains matching
  return String(actual).includes(pattern);
}
