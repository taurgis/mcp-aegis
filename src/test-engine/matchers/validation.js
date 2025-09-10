/**
 * Enhanced Validation - Provides detailed error analysis and reporting
 * Single responsibility: Generate comprehensive validation error reports with actionable feedback
 */

import { matchPattern } from './patterns.js';
import { extractFieldFromObject } from './fields.js';

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

  // Handle type patterns
  if (pattern.startsWith('type:')) {
    const expectedType = pattern.substring(5);
    return {
      patternType: 'type',
      message: `Type validation failed: expected '${expectedType}' but got '${actualType}'`,
      suggestion: `Fix server to return ${expectedType} type, or change pattern to 'match:type:${actualType}'`,
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
    return {
      patternType: 'arrayContains',
      message: `ArrayContains validation failed: array does not contain '${searchValue}'`,
      suggestion: Array.isArray(actual)
        ? `Fix server to include '${searchValue}' in array or update pattern to match actual array contents: ${JSON.stringify(actual)}`
        : `Fix server to return array containing '${searchValue}' or change validation approach`,
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
    return isValid; // Early return for partial validation - don't check for extra fields
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

  // Check for missing keys (expected fields not in actual)
  const missingKeys = expectedKeys.filter(key => !(key in actual));
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

  // Validate expected fields that exist in actual
  const commonKeys = expectedKeys.filter(key => key in actual);
  for (const key of commonKeys) {
    const fieldPath = `${path}.${key}`;
    const fieldValid = validateRecursive(expected[key], actual[key], fieldPath, context);
    if (!fieldValid) {
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

  // For partial matching, we only check that expected fields are present and valid
  // We don't complain about extra fields in the actual object

  // Check for missing expected fields
  const missingKeys = expectedKeys.filter(key => !(key in actual));
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

  // Validate expected fields that exist in actual (ignore extra fields)
  const commonKeys = expectedKeys.filter(key => key in actual);
  for (const key of commonKeys) {
    const fieldPath = `${path}.${key}`;
    const fieldValid = validatePartialRecursive(expected[key], actual[key], fieldPath, context);
    if (!fieldValid) {
      isValid = false;
    }
  }

  return isValid;
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
  const specialKeys = ['match:partial', 'match:arrayElements', 'match:extractField'];
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
