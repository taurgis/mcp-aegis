/**
 * Enhanced Validation - Provides detailed error analysis and reporting
 * Single responsibility: Generate comprehensive validation error reports with actionable feedback
 */

import { matchPattern } from './patterns.js';
import { extractFieldFromObject } from './fields.js';
import { handleCrossFieldPattern } from './crossFieldPatterns.js';
import { analyzeNonExistentFeatures } from './corrections/index.js';

/**
 * Check if a string looks like a pattern that's missing the match: prefix
 * @param {string} str - String to check
 * @returns {boolean} Whether the string looks like a missing pattern
 */
function isLikelyMissingMatchPrefix(str) {
  if (!str || typeof str !== 'string') {
    return false;
  }

  // List of pattern types that should have match: prefix
  const patternTypes = [
    'arrayLength:', 'arrayContains:', 'contains:', 'containsIgnoreCase:', 'equalsIgnoreCase:',
    'startsWith:', 'endsWith:', 'type:', 'regex:', 'length:', 'between:', 'range:',
    'greaterThan:', 'greaterThanOrEqual:', 'lessThan:', 'lessThanOrEqual:', 'equals:',
    'notEquals:', 'approximately:', 'multipleOf:', 'divisibleBy:', 'decimalPlaces:',
    'dateAfter:', 'dateBefore:', 'dateBetween:', 'dateValid', 'dateAge:', 'dateEquals:',
    'dateFormat:', 'crossField:', 'extractField:', 'partial:', 'arrayElements:', 'not:',
  ];

  // Check if the string starts with any known pattern type
  for (const patternType of patternTypes) {
    if (str.startsWith(patternType)) {
      return true;
    }
  }

  // Special case for 'exists' pattern (no colon)
  if (str === 'exists') {
    return true;
  }

  return false;
}

/**
 * Comprehensive validation result structure
 * @typedef {Object} ValidationResult
 * @property {boolean} passed - Whether validation passed
 * @property {Array<ValidationError>} errors - Detailed error information
 * @property {Object} analysis - Analysis of validation results
 */

/**
 * Detailed validation error structure
 * @typedef {Object} ValidationError
 * @property {string} type - Error type (missing_field, extra_field, type_mismatch, pattern_failed, value_mismatch)
 * @property {string} path - Exact path where error occurred
 * @property {string} message - Human-readable error message
 * @property {*} expected - Expected value/pattern
 * @property {*} actual - Actual value
 * @property {string} suggestion - Actionable suggestion for fixing the error
 * @property {string} category - Error category (structure, content, pattern)
 */

/**
 * Perform comprehensive validation with detailed error reporting
 * @param {*} expected - Expected value (may contain patterns)
 * @param {*} actual - Actual value
 * @param {string} rootPath - Root path for error reporting (default: 'response')
 * @returns {ValidationResult} Comprehensive validation result
 */
export function validateWithDetailedAnalysis(expected, actual, rootPath = 'response') {
  const errors = [];
  const context = {
    errors,
    rootPath,
    pathHistory: [],
  };

  const isValid = validateRecursive(expected, actual, rootPath, context);

  return {
    passed: isValid,
    errors,
    analysis: generateValidationAnalysis(errors),
  };
}

/**
 * Recursive validation with comprehensive error collection
 * @param {*} expected - Expected value
 * @param {*} actual - Actual value
 * @param {string} path - Current validation path
 * @param {Object} context - Validation context
 * @returns {boolean} Whether validation passed at this level
 */
function validateRecursive(expected, actual, path, context) {
  // Fast path for exact equality
  if (expected === actual) {
    return true;
  }

  // Handle string patterns
  if (typeof expected === 'string' && expected.startsWith('match:')) {
    return validatePattern(expected, actual, path, context);
  }

  // Handle null/undefined cases
  if (expected == null || actual == null) {
    if (expected !== actual) {
      context.errors.push({
        type: 'value_mismatch',
        path,
        message: `Expected ${expected} but got ${actual}`,
        expected,
        actual,
        suggestion: expected == null
          ? `Remove this field from the expected response or set it to the actual value: ${JSON.stringify(actual)}`
          : `Ensure the server returns the expected ${expected} value at ${path}`,
        category: 'content',
      });
      return false;
    }
    return true;
  }

  // Handle special object-based patterns
  if (isObject(expected) && hasSpecialPatternKeys(expected)) {
    return handleSpecialPatterns(expected, actual, path, context);
  }

  // Check if expected string looks like a pattern missing match: prefix
  if (typeof expected === 'string' && isLikelyMissingMatchPrefix(expected)) {
    // Treat as pattern validation failure instead of type mismatch
    context.errors.push({
      type: 'pattern_failed',
      path,
      message: `Pattern syntax error: "${expected}" appears to be missing "match:" prefix`,
      expected, // Keep original for syntax analysis
      actual,
      suggestion: `Change "${expected}" to "match:${expected}" or fix server to return string`,
      category: 'pattern',
      patternType: 'syntax_error',
    });
    return false;
  }

  // Type mismatch
  if (typeof expected !== typeof actual) {
    context.errors.push({
      type: 'type_mismatch',
      path,
      message: `Expected type ${typeof expected} but got type ${typeof actual}`,
      expected: typeof expected,
      actual: typeof actual,
      suggestion: `Change expected type to match actual (${typeof actual}) or fix server to return ${typeof expected}`,
      category: 'structure',
    });
    return false;
  }

  // Handle non-object primitives
  if (typeof expected !== 'object') {
    if (expected !== actual) {
      context.errors.push({
        type: 'value_mismatch',
        path,
        message: `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`,
        expected,
        actual,
        suggestion: `Update expected value to ${JSON.stringify(actual)} or fix server response`,
        category: 'content',
      });
      return false;
    }
    return true;
  }

  // Handle arrays vs objects
  if (Array.isArray(expected) !== Array.isArray(actual)) {
    const expectedType = Array.isArray(expected) ? 'array' : 'object';
    const actualType = Array.isArray(actual) ? 'array' : 'object';
    context.errors.push({
      type: 'type_mismatch',
      path,
      message: `Expected ${expectedType} but got ${actualType}`,
      expected: expectedType,
      actual: actualType,
      suggestion: `Change test to expect ${actualType} or fix server to return ${expectedType}`,
      category: 'structure',
    });
    return false;
  }

  // Handle arrays
  if (Array.isArray(expected)) {
    return validateArray(expected, actual, path, context);
  }

  // Handle regular objects
  return validateObject(expected, actual, path, context);
}

/**
 * Validate string patterns with detailed error reporting
 * @param {string} expected - Pattern string (e.g., "match:type:string")
 * @param {*} actual - Actual value
 * @param {string} path - Current validation path
 * @param {Object} context - Validation context
 * @returns {boolean} Whether pattern validation passed
 */
function validatePattern(expected, actual, path, context) {
  const pattern = expected.substring(6);

  if (matchPattern(pattern, actual)) {
    return true;
  }

  // Generate detailed pattern-specific error
  const patternError = analyzePatternFailure(pattern, actual, path);
  context.errors.push({
    type: 'pattern_failed',
    path,
    message: patternError.message,
    expected: pattern,
    actual,
    suggestion: patternError.suggestion,
    category: 'pattern',
    patternType: patternError.patternType,
  });

  return false;
}

/**
 * Analyze pattern failure and provide specific feedback
 * @param {string} pattern - The pattern that failed
 * @param {*} actual - The actual value
 * @param {string} path - Current validation path
 * @returns {Object} Pattern failure analysis
 */
function analyzePatternFailure(pattern, actual, _path) {
  const actualType = typeof actual;
  const actualPreview = getValuePreview(actual);

  // First, check for non-existent features
  const nonExistentFeatureSuggestions = analyzeNonExistentFeatures(`match:${pattern}`);
  if (nonExistentFeatureSuggestions.length > 0) {
    const suggestion = nonExistentFeatureSuggestions[0];
    return {
      patternType: 'non_existent_feature',
      message: suggestion.message,
      suggestion: suggestion.suggestion,
      alternatives: suggestion.alternatives,
      example: suggestion.example,
      category: suggestion.category,
    };
  }

  // Handle type patterns
  if (pattern.startsWith('type:')) {
    const expectedType = pattern.substring(5);
    return {
      patternType: 'type',
      message: `Type validation failed: expected '${expectedType}' but got '${actualType}'`,
      suggestion: `Fix server to return ${expectedType} type, or change pattern to 'match:type:${actualType}'`,
    };
  }

  // Date pattern enhancements
  if (pattern === 'dateValid') {
    return {
      patternType: 'dateValid',
      message: `Date validation failed: value ${actualPreview} is not a parseable date`,
      suggestion: 'Ensure the server returns an ISO string, timestamp, or valid date format',
    };
  }
  if (pattern.startsWith('dateAfter:')) {
    const ref = pattern.substring(10);
    const refDate = new Date(ref);
    if (isNaN(refDate.getTime())) {
      return {
        patternType: 'dateAfter_malformed',
        message: `dateAfter reference '${ref}' is not a valid date`,
        suggestion: 'Use a valid ISO date/time (e.g., 2025-01-01 or 2025-01-01T00:00:00Z)',
      };
    }
    return {
      patternType: 'dateAfter',
      message: `Date comparison failed: expected value > ${ref}, got ${actualPreview}`,
      suggestion: `Adjust server date to be after ${ref} or update expected threshold`,
    };
  }
  if (pattern.startsWith('dateBefore:')) {
    const ref = pattern.substring(11);
    const refDate = new Date(ref);
    if (isNaN(refDate.getTime())) {
      return {
        patternType: 'dateBefore_malformed',
        message: `dateBefore reference '${ref}' is not a valid date`,
        suggestion: 'Use a valid ISO date/time (e.g., 2025-01-01 or 2025-01-01T00:00:00Z)',
      };
    }
    return {
      patternType: 'dateBefore',
      message: `Date comparison failed: expected value < ${ref}, got ${actualPreview}`,
      suggestion: `Adjust server date to be before ${ref} or update expected threshold`,
    };
  }
  if (pattern.startsWith('dateBetween:')) {
    const betweenStr = pattern.substring(12);
    const parts = betweenStr.split(':');
    if (parts.length !== 2) {
      return {
        patternType: 'dateBetween_malformed',
        message: `dateBetween pattern malformed: expected 'dateBetween:<start>:<end>' got '${pattern}'`,
        suggestion: 'Provide both start and end ISO dates, e.g., match:dateBetween:2024-01-01:2024-12-31',
      };
    }
    const [startStr, endStr] = parts;
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return {
        patternType: 'dateBetween_malformed',
        message: `dateBetween bounds invalid: start='${startStr}' end='${endStr}'`,
        suggestion: 'Use valid ISO date strings for both bounds',
      };
    }
    if (start > end) {
      return {
        patternType: 'dateBetween_reversed',
        message: `dateBetween range reversed: start '${startStr}' is after end '${endStr}'`,
        suggestion: 'Swap the bounds so start <= end',
      };
    }
    return {
      patternType: 'dateBetween',
      message: `Date not in range: expected between ${startStr} and ${endStr}, got ${actualPreview}`,
  suggestion: 'Adjust server date into range or update expected bounds',
    };
  }
  if (pattern.startsWith('dateAge:')) {
    const dur = pattern.substring(8);
    const durMatch = dur.match(/^(\d+)(ms|s|m|h|d)$/);
    if (!durMatch) {
      return {
        patternType: 'dateAge_malformed',
        message: `dateAge duration '${dur}' invalid (expected <number><ms|s|m|h|d>)`,
        suggestion: 'Use formats like 500ms, 30s, 15m, 2h, 7d',
      };
    }
    return {
      patternType: 'dateAge',
      message: `Date age validation failed for threshold ${dur}`,
      suggestion: `Ensure value is a recent date within ${dur}`,
    };
  }
  if (pattern.startsWith('dateEquals:')) {
    const ref = pattern.substring(11);
    const refDate = new Date(ref);
    if (isNaN(refDate.getTime())) {
      return {
        patternType: 'dateEquals_malformed',
        message: `dateEquals expected value '${ref}' is not a valid date`,
        suggestion: 'Use an ISO date/time string or numeric timestamp for dateEquals',
      };
    }
    return {
      patternType: 'dateEquals',
      message: `Date equality failed: expected exactly ${ref}, got ${actualPreview}`,
      suggestion: 'Synchronize server date or adjust expected dateEquals value',
    };
  }
  if (pattern.startsWith('dateFormat:')) {
    const token = pattern.substring(11);
  const supported = ['iso', 'iso-date', 'iso-time', 'us-date', 'eu-date', 'timestamp'];
    if (!supported.includes(token)) {
      return {
        patternType: 'dateFormat_unsupported',
        message: `Unsupported dateFormat token '${token}'. Supported: ${supported.join(', ')}`,
        suggestion: `Use one of: ${supported.join(', ')}`,
      };
    }
    return {
      patternType: 'dateFormat',
      message: `dateFormat mismatch (${token}): value ${actualPreview} does not conform`,
      suggestion: `Ensure value matches ${token} format or change expected token`,
    };
  }

  // Handle length patterns
  if (pattern.startsWith('arrayLength:')) {
    const expectedLength = parseInt(pattern.substring(12));
    const actualLength = Array.isArray(actual) ? actual.length : 'N/A (not array)';
    return {
      patternType: 'arrayLength',
      message: `Array length validation failed: expected ${expectedLength} items but got ${actualLength}`,
      suggestion: Array.isArray(actual)
        ? `Change pattern to 'match:arrayLength:${actual.length}' or fix server to return ${expectedLength} items`
        : `Fix server to return an array, or change validation to expect ${actualType}`,
    };
  }

  // Handle regex patterns
  if (pattern.match(/^[^:]+$/)) {
    return {
      patternType: 'regex',
      message: `Regex pattern '${pattern}' did not match value ${actualPreview}`,
      suggestion: 'Update regex pattern to match actual value, or fix server response to match pattern',
    };
  }

  // Handle contains patterns
  if (pattern.startsWith('contains:')) {
    const searchTerm = pattern.substring(9);
    return {
      patternType: 'contains',
      message: `Contains validation failed: '${searchTerm}' not found in ${actualPreview}`,
      suggestion: typeof actual === 'string'
        ? `Fix server response to include '${searchTerm}' or update pattern to match actual content`
        : `Fix server to return string containing '${searchTerm}' or change validation approach`,
    };
  }

  // Handle startsWith patterns
  if (pattern.startsWith('startsWith:')) {
    const prefix = pattern.substring(11);
    return {
      patternType: 'startsWith',
      message: `StartsWith validation failed: value ${actualPreview} does not start with '${prefix}'`,
      suggestion: typeof actual === 'string'
        ? `Fix server response to start with '${prefix}' or update pattern`
        : `Fix server to return string starting with '${prefix}' or change validation approach`,
    };
  }

  // Handle endsWith patterns
  if (pattern.startsWith('endsWith:')) {
    const suffix = pattern.substring(9);
    return {
      patternType: 'endsWith',
      message: `EndsWith validation failed: value ${actualPreview} does not end with '${suffix}'`,
      suggestion: typeof actual === 'string'
        ? `Fix server response to end with '${suffix}' or update pattern`
        : `Fix server to return string ending with '${suffix}' or change validation approach`,
    };
  }

  // Handle arrayContains patterns
  if (pattern.startsWith('arrayContains:')) {
    const searchValue = pattern.substring(14);
    // Determine if we are in debug mode. The reporter/options layer sets globalThis.__MCP_CONDUCTOR_DEBUG
    // (lightweight global flag to avoid invasive signature changes). Fallback to false.
    const debugMode = Boolean(globalThis.__MCP_CONDUCTOR_DEBUG);
    let suggestionDetail;
    if (Array.isArray(actual)) {
      if (debugMode) {
        suggestionDetail = `Fix server to include '${searchValue}' in array or update pattern to match actual array contents: ${JSON.stringify(actual)}`;
      } else {
        // Provide concise summary without full payload
        const length = actual.length;
        const sample = length > 0 ? actual[0] : undefined;
        const sampleSummary = sample && typeof sample === 'object'
          ? `{keys:${Object.keys(sample).slice(0, 5).join(',')}}`
          : JSON.stringify(sample);
        suggestionDetail = `Fix server to include '${searchValue}' in array or update pattern (array length ${length}, sample ${sampleSummary}). Run with --debug for full contents.`;
      }
    } else {
      suggestionDetail = `Fix server to return array containing '${searchValue}' or change validation approach`;
    }
    return {
      patternType: 'arrayContains',
      message: `ArrayContains validation failed: array does not contain '${searchValue}'`,
      suggestion: suggestionDetail,
    };
  }

  // Handle not: patterns
  if (pattern.startsWith('not:')) {
    const negatedPattern = pattern.substring(4);
    return {
      patternType: 'negation',
      message: `Negation pattern failed: value ${actualPreview} should NOT match '${negatedPattern}' but it does`,
      suggestion: `Fix server to return value that doesn't match '${negatedPattern}' or remove the 'not:' prefix`,
    };
  }

  // Generic pattern failure
  return {
    patternType: 'unknown',
    message: `Pattern '${pattern}' did not match value ${actualPreview}`,
    suggestion: 'Review pattern syntax or fix server response to match expected pattern',
  };
}

/**
 * Handle special pattern objects (arrayElements, partial, extractField)
 * @param {Object} expected - Object with special pattern keys
 * @param {*} actual - Actual value
 * @param {string} path - Current validation path
 * @param {Object} context - Validation context
 * @returns {boolean} Whether validation passed
 */
function handleSpecialPatterns(expected, actual, path, context) {
  let isValid = true;

  // Handle arrayElements pattern
  if ('match:arrayElements' in expected) {
    if (!Array.isArray(actual)) {
      context.errors.push({
        type: 'type_mismatch',
        path,
        message: `arrayElements pattern expects array but got ${typeof actual}`,
        expected: 'array',
        actual: typeof actual,
        suggestion: `Fix server to return array or change validation to expect ${typeof actual}`,
        category: 'structure',
      });
      return false;
    }

    const elementPattern = expected['match:arrayElements'];
    for (let i = 0; i < actual.length; i++) {
      const elementPath = `${path}[${i}]`;
      const elementValid = validateRecursive(elementPattern, actual[i], elementPath, context);
      if (!elementValid) {
        isValid = false;
      }
    }
  }

  // Handle partial matching pattern
  if ('match:partial' in expected) {
    const partialPattern = expected['match:partial'];
    const partialValid = validatePartialRecursive(partialPattern, actual, path, context);
    if (!partialValid) {
      isValid = false;
    }
    
    // Check if there are regular properties to validate alongside match:partial
    const specialKeys = ['match:partial', 'match:arrayElements', 'match:extractField', 'match:crossField', 'match:not:crossField'];
    const regularKeys = Object.keys(expected).filter(key => !specialKeys.includes(key));
    
    if (regularKeys.length > 0) {
      // Validate regular properties using partial object validation logic
      if (actual === null || typeof actual !== 'object' || Array.isArray(actual)) {
        context.errors.push({
          type: 'type_mismatch',
          path,
          message: `Expected object for property validation but got ${Array.isArray(actual) ? 'array' : typeof actual}`,
          expected: 'object',
          actual: Array.isArray(actual) ? 'array' : typeof actual,
          suggestion: `Fix server to return object or change expected type to ${Array.isArray(actual) ? 'array' : typeof actual}`,
          category: 'structure',
        });
        return false;
      }
      
      // Validate regular properties (similar to partial object validation)
      for (const key of regularKeys) {
        if (!(key in actual)) {
          const fieldPath = `${path}.${key}`;
          context.errors.push({
            type: 'missing_field',
            path: fieldPath,
            message: `Missing required field '${key}'`,
            expected: expected[key],
            actual: undefined,
            suggestion: `Add '${key}' field to server response or remove it from expected response`,
            category: 'structure',
          });
          isValid = false;
        } else {
          const fieldPath = `${path}.${key}`;
          const fieldValid = validateRecursive(expected[key], actual[key], fieldPath, context);
          if (!fieldValid) {
            isValid = false;
          }
        }
      }
    }
    
    return isValid; // Return early for partial validation - don't check for extra fields
  }

  // Handle field extraction pattern
  if ('match:extractField' in expected) {
    const fieldPath = expected['match:extractField'];
    const expectedValue = expected.value;

    const extractedValue = extractFieldFromObject(actual, fieldPath);

    if (extractedValue === undefined) {
      context.errors.push({
        type: 'missing_field',
        path: `${path}.extractField(${fieldPath})`,
        message: `Field extraction failed: path '${fieldPath}' not found`,
        expected: fieldPath,
        actual: 'undefined (path not found)',
        suggestion: 'Fix field path or ensure server response includes the expected nested structure',
        category: 'structure',
      });
      return false;
    }

    const extractionValid = validateRecursive(expectedValue, extractedValue, `${path}.extractField(${fieldPath})`, context);
    if (!extractionValid) {
      isValid = false;
    }
  }

  // Handle cross-field validation pattern
  if ('match:crossField' in expected) {
    const condition = expected['match:crossField'];
    const conditionResult = handleCrossFieldPattern(`crossField:${condition}`, actual);

    if (!conditionResult) {
      context.errors.push({
        type: 'pattern_failed',
        path: `${path}.crossField`,
        message: `Cross-field validation failed: condition '${condition}' not satisfied`,
        expected: condition,
        actual: 'condition not met',
        suggestion: `Ensure that the condition '${condition}' is satisfied by the response data`,
        category: 'pattern',
        patternType: 'crossField',
      });
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Partial recursive validation - only validates specified fields, ignores extra fields
 * @param {*} expected - Expected value (partial specification)
 * @param {*} actual - Actual value
 * @param {string} path - Current validation path
 * @param {Object} context - Validation context
 * @returns {boolean} Whether partial validation passed
 */
function validatePartialRecursive(expected, actual, path, context) {
  // Fast path for exact equality
  if (expected === actual) {
    return true;
  }

  // Handle string patterns
  if (typeof expected === 'string' && expected.startsWith('match:')) {
    return validatePattern(expected, actual, path, context);
  }

  // Handle null/undefined cases
  if (expected == null || actual == null) {
    if (expected !== actual) {
      context.errors.push({
        type: 'value_mismatch',
        path,
        message: `Expected ${expected} but got ${actual}`,
        expected,
        actual,
        suggestion: `Update expected value to ${actual} or fix server response`,
        category: 'content',
      });
      return false;
    }
    return true;
  }

  // Handle arrays - partial array validation
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      context.errors.push({
        type: 'type_mismatch',
        path,
        message: `Type mismatch: expected array but got ${typeof actual}`,
        expected: 'array',
        actual: typeof actual,
        suggestion: `Fix server to return array or change expected type to ${typeof actual}`,
        category: 'structure',
      });
      return false;
    }

    return validatePartialArray(expected, actual, path, context);
  }

  // Handle objects - partial object validation
  if (expected && typeof expected === 'object') {
    if (actual === null || typeof actual !== 'object' || Array.isArray(actual)) {
      context.errors.push({
        type: 'type_mismatch',
        path,
        message: `Type mismatch: expected object but got ${Array.isArray(actual) ? 'array' : typeof actual}`,
        expected: 'object',
        actual: Array.isArray(actual) ? 'array' : typeof actual,
        suggestion: `Fix server to return object or change expected type to ${Array.isArray(actual) ? 'array' : typeof actual}`,
        category: 'structure',
      });
      return false;
    }

    return validatePartialObject(expected, actual, path, context);
  }

  // Handle primitives
  if (expected !== actual) {
    context.errors.push({
      type: 'value_mismatch',
      path,
      message: `Expected ${expected} but got ${actual}`,
      expected,
      actual,
      suggestion: `Update expected value to ${actual} or fix server response`,
      category: 'content',
    });
    return false;
  }

  return true;
}

/**
 * Validate array with detailed error reporting
 * @param {Array} expected - Expected array
 * @param {Array} actual - Actual array
 * @param {string} path - Current validation path
 * @param {Object} context - Validation context
 * @returns {boolean} Whether array validation passed
 */
function validateArray(expected, actual, path, context) {
  let isValid = true;

  if (expected.length !== actual.length) {
    context.errors.push({
      type: 'length_mismatch',
      path,
      message: `Array length mismatch: expected ${expected.length} items but got ${actual.length}`,
      expected: expected.length,
      actual: actual.length,
      suggestion: expected.length < actual.length
        ? `Remove ${actual.length - expected.length} extra item(s) from server response or add them to expected array`
        : `Add ${expected.length - actual.length} missing item(s) to server response or remove them from expected array`,
      category: 'structure',
    });
    isValid = false;
  }

  const maxLength = Math.max(expected.length, actual.length);
  for (let i = 0; i < maxLength; i++) {
    const itemPath = `${path}[${i}]`;

    if (i >= expected.length) {
      context.errors.push({
        type: 'extra_field',
        path: itemPath,
        message: `Extra array item at index ${i}`,
        expected: undefined,
        actual: actual[i],
        suggestion: 'Remove extra item from server response or add it to expected array',
        category: 'structure',
      });
      isValid = false;
    } else if (i >= actual.length) {
      context.errors.push({
        type: 'missing_field',
        path: itemPath,
        message: `Missing array item at index ${i}`,
        expected: expected[i],
        actual: undefined,
        suggestion: 'Add missing item to server response or remove it from expected array',
        category: 'structure',
      });
      isValid = false;
    } else {
      const itemValid = validateRecursive(expected[i], actual[i], itemPath, context);
      if (!itemValid) {
        isValid = false;
      }
    }
  }

  return isValid;
}

/**
 * Validate object with detailed error reporting
 * @param {Object} expected - Expected object
 * @param {Object} actual - Actual object
 * @param {string} path - Current validation path
 * @param {Object} context - Validation context
 * @returns {boolean} Whether object validation passed
 */
function validateObject(expected, actual, path, context) {
  let isValid = true;

  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  
  // Filter out special pattern keys from field validation
  const specialKeys = ['match:partial', 'match:arrayElements', 'match:extractField', 'match:crossField', 'match:not:crossField'];
  const regularExpectedKeys = expectedKeys.filter(key => !specialKeys.includes(key));

  // Check for missing keys (expected fields not in actual) - excluding pattern keys
  const missingKeys = regularExpectedKeys.filter(key => !(key in actual));
  for (const key of missingKeys) {
    const fieldPath = `${path}.${key}`;
    context.errors.push({
      type: 'missing_field',
      path: fieldPath,
      message: `Missing required field '${key}'`,
      expected: expected[key],
      actual: undefined,
      suggestion: `Add '${key}' field to server response or remove it from expected response`,
      category: 'structure',
    });
    isValid = false;
  }

  // Check for extra keys (fields in actual not expected)
  const extraKeys = actualKeys.filter(key => !(key in expected));
  for (const key of extraKeys) {
    const fieldPath = `${path}.${key}`;
    context.errors.push({
      type: 'extra_field',
      path: fieldPath,
      message: `Unexpected field '${key}'`,
      expected: undefined,
      actual: actual[key],
      suggestion: `Remove '${key}' from server response or add it to expected response with value: ${JSON.stringify(actual[key])}`,
      category: 'structure',
    });
    isValid = false;
  }

  // Validate expected regular fields that exist in actual
  const commonKeys = regularExpectedKeys.filter(key => key in actual);
  for (const key of commonKeys) {
    const fieldPath = `${path}.${key}`;
    const fieldValid = validateRecursive(expected[key], actual[key], fieldPath, context);
    if (!fieldValid) {
      isValid = false;
    }
  }

  // Handle nested crossField pattern validation
  if ('match:crossField' in expected) {
    const condition = expected['match:crossField'];
    const conditionResult = handleCrossFieldPattern(`crossField:${condition}`, actual);

    if (!conditionResult) {
      context.errors.push({
        type: 'pattern_failed',
        path: `${path}.crossField`,
        message: `Cross-field validation failed: condition '${condition}' not satisfied`,
        expected: condition,
        actual: 'condition not met',
        suggestion: `Ensure that the condition '${condition}' is satisfied by the response data`,
        category: 'pattern',
        patternType: 'crossField',
      });
      isValid = false;
    }
  }

  // Handle nested negated crossField pattern validation
  if ('match:not:crossField' in expected) {
    const condition = expected['match:not:crossField'];
    const conditionResult = matchPattern(`not:crossField:${condition}`, actual);

    if (!conditionResult) {
      context.errors.push({
        type: 'pattern_failed',
        path: `${path}.not:crossField`,
        message: `Negated cross-field validation failed: condition '${condition}' should NOT be satisfied`,
        expected: `NOT ${condition}`,
        actual: 'condition was met',
        suggestion: `Ensure that the condition '${condition}' is NOT satisfied by the response data`,
        category: 'pattern',
        patternType: 'not:crossField',
      });
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Validate array with partial matching - only validates elements that are specified
 * @param {Array} expected - Expected array (partial specification)
 * @param {Array} actual - Actual array
 * @param {string} path - Current validation path
 * @param {Object} context - Validation context
 * @returns {boolean} Whether partial array validation passed
 */
function validatePartialArray(expected, actual, path, context) {
  let isValid = true;

  // For partial array validation, only validate up to the expected length
  // We don't complain about extra elements in the actual array
  for (let i = 0; i < expected.length; i++) {
    const itemPath = `${path}[${i}]`;

    if (i >= actual.length) {
      context.errors.push({
        type: 'missing_field',
        path: itemPath,
        message: `Missing array item at index ${i}`,
        expected: expected[i],
        actual: undefined,
        suggestion: 'Add missing item to server response or remove it from expected array',
        category: 'structure',
      });
      isValid = false;
    } else {
      const itemValid = validatePartialRecursive(expected[i], actual[i], itemPath, context);
      if (!itemValid) {
        isValid = false;
      }
    }
  }

  return isValid;
}

/**
 * Validate object with partial matching - only validates fields that are specified
 * @param {Object} expected - Expected object (partial specification)
 * @param {Object} actual - Actual object
 * @param {string} path - Current validation path
 * @param {Object} context - Validation context
 * @returns {boolean} Whether partial object validation passed
 */
function validatePartialObject(expected, actual, path, context) {
  let isValid = true;

  const expectedKeys = Object.keys(expected);
  
  // Filter out special pattern keys from field validation
  const specialKeys = ['match:partial', 'match:arrayElements', 'match:extractField', 'match:crossField', 'match:not:crossField'];
  const regularExpectedKeys = expectedKeys.filter(key => !specialKeys.includes(key));

  // For partial matching, we only check that expected regular fields are present and valid
  // We don't complain about extra fields in the actual object

  // Check for missing expected regular fields (excluding pattern keys)
  const missingKeys = regularExpectedKeys.filter(key => !(key in actual));
  for (const key of missingKeys) {
    const fieldPath = `${path}.${key}`;
    context.errors.push({
      type: 'missing_field',
      path: fieldPath,
      message: `Missing required field '${key}'`,
      expected: expected[key],
      actual: undefined,
      suggestion: `Add '${key}' field to server response or remove it from expected response`,
      category: 'structure',
    });
    isValid = false;
  }

  // Validate expected regular fields that exist in actual (ignore extra fields)
  const commonKeys = regularExpectedKeys.filter(key => key in actual);
  for (const key of commonKeys) {
    const fieldPath = `${path}.${key}`;
    const fieldValid = validatePartialRecursive(expected[key], actual[key], fieldPath, context);
    if (!fieldValid) {
      isValid = false;
    }
  }

  // Handle nested crossField pattern validation
  if ('match:crossField' in expected) {
    const condition = expected['match:crossField'];
    const conditionResult = handleCrossFieldPattern(`crossField:${condition}`, actual);

    if (!conditionResult) {
      context.errors.push({
        type: 'pattern_failed',
        path: `${path}.crossField`,
        message: `Cross-field validation failed: condition '${condition}' not satisfied`,
        expected: condition,
        actual: 'condition not met',
        suggestion: `Ensure that the condition '${condition}' is satisfied by the response data`,
        category: 'pattern',
        patternType: 'crossField',
      });
      isValid = false;
    }
  }

  // Handle nested negated crossField pattern validation
  if ('match:not:crossField' in expected) {
    const condition = expected['match:not:crossField'];
    const conditionResult = matchPattern(`not:crossField:${condition}`, actual);

    if (!conditionResult) {
      context.errors.push({
        type: 'pattern_failed',
        path: `${path}.not:crossField`,
        message: `Negated cross-field validation failed: condition '${condition}' should NOT be satisfied`,
        expected: `NOT ${condition}`,
        actual: 'condition was met',
        suggestion: `Ensure that the condition '${condition}' is NOT satisfied by the response data`,
        category: 'pattern',
        patternType: 'not:crossField',
      });
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Main validation entry point with comprehensive error analysis
}

/**
 * Generate validation analysis summary
 * @param {Array<ValidationError>} errors - Validation errors
 * @param {*} expected - Expected value
 * @param {*} actual - Actual value
 * @returns {Object} Validation analysis
 */
function generateValidationAnalysis(errors) {
  const errorsByType = errors.reduce((acc, error) => {
    acc[error.type] = (acc[error.type] || 0) + 1;
    return acc;
  }, {});

  const errorsByCategory = errors.reduce((acc, error) => {
    acc[error.category] = (acc[error.category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalErrors: errors.length,
    errorsByType,
    errorsByCategory,
    summary: generateAnalysisSummary(errors, errorsByType, errorsByCategory),
    suggestions: generateTopSuggestions(errors),
  };
}

/**
 * Generate analysis summary
 * @param {Array<ValidationError>} errors - Validation errors
 * @param {Object} errorsByType - Errors grouped by type
 * @param {Object} errorsByCategory - Errors grouped by category
 * @returns {string} Human-readable analysis summary
 */
function generateAnalysisSummary(errors, errorsByType, _errorsByCategory) {
  if (errors.length === 0) {
    return 'All validations passed successfully.';
  }

  const summaryParts = [];

  if (errorsByType.extra_field) {
    summaryParts.push(`${errorsByType.extra_field} unexpected field(s)`);
  }

  if (errorsByType.missing_field) {
    summaryParts.push(`${errorsByType.missing_field} missing field(s)`);
  }

  if (errorsByType.type_mismatch) {
    summaryParts.push(`${errorsByType.type_mismatch} type mismatch(es)`);
  }

  if (errorsByType.pattern_failed) {
    summaryParts.push(`${errorsByType.pattern_failed} pattern validation failure(s)`);
  }

  if (errorsByType.value_mismatch) {
    summaryParts.push(`${errorsByType.value_mismatch} value mismatch(es)`);
  }

  return `Found ${summaryParts.join(', ')}.`;
}

/**
 * Generate top actionable suggestions
 * @param {Array<ValidationError>} errors - Validation errors
 * @returns {Array<string>} Top actionable suggestions
 */
function generateTopSuggestions(errors) {
  // Group similar errors and provide consolidated suggestions
  const suggestionMap = new Map();

  for (const error of errors) {
    const suggestionKey = `${error.type}:${error.category}`;
    if (!suggestionMap.has(suggestionKey)) {
      suggestionMap.set(suggestionKey, {
        type: error.type,
        category: error.category,
        count: 0,
        example: error,
      });
    }
    suggestionMap.get(suggestionKey).count++;
  }

  // Generate prioritized suggestions
  const suggestions = Array.from(suggestionMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(group => {
      if (group.count === 1) {
        return group.example.suggestion;
      }
      return `${group.example.suggestion} (${group.count} similar issues found)`;
    });

  return suggestions;
}

/**
 * Check if value is an object (not array or null)
 * @param {*} value - Value to check
 * @returns {boolean} Whether value is an object
 */
function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check if object has special pattern keys
 * @param {Object} obj - Object to check
 * @returns {boolean} Whether object has special pattern keys
 */
function hasSpecialPatternKeys(obj) {
  const specialKeys = ['match:partial', 'match:arrayElements', 'match:extractField', 'match:crossField'];
  return specialKeys.some(key => key in obj);
}

/**
 * Get a readable preview of a value
 * @param {*} value - Value to preview
 * @returns {string} Human-readable preview
 */
function getValuePreview(value) {
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }

  const type = typeof value;

  if (type === 'string') {
    return value.length > 50 ? `"${value.substring(0, 50)}..."` : `"${value}"`;
  }

  if (type === 'object') {
    if (Array.isArray(value)) {
      return `array[${value.length}]`;
    }
    return `object with keys: [${Object.keys(value).join(', ')}]`;
  }

  return `${type}: ${value}`;
}
