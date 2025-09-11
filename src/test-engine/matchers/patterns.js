/**
 * Pattern Matcher - Main orchestrator for all pattern matching operations
 * Coordinates between specialized pattern modules following single responsibility principle
 */

// Import string pattern handlers
import {
  handleRegexPattern,
  handleContainsPattern,
  handleStartsWithPattern,
  handleEndsWithPattern,
  handleContainsIgnoreCasePattern,
  handleEqualsIgnoreCasePattern,
  handleDefaultPattern,
} from './stringPatterns.js';

// Import array pattern handlers
import {
  handleArrayLengthPattern,
  handleArrayContainsPattern,
} from './arrayPatterns.js';

// Import type pattern handlers
import {
  handleLengthPattern,
  handleTypePattern,
  handleExistsPattern,
  handleCountPattern,
} from './typePatterns.js';

// Import numeric pattern handlers
import {
  handleGreaterThanPattern,
  handleGreaterThanOrEqualPattern,
  handleLessThanPattern,
  handleLessThanOrEqualPattern,
  handleBetweenPattern,
  handleRangePattern,
  handleEqualsPattern,
  handleNotEqualsPattern,
  handleApproximatelyPattern,
  handleMultipleOfPattern,
  handleDivisibleByPattern,
  handleDecimalPlacesPattern,
} from './numericPatterns.js';

// Import date pattern handlers
import {
  handleDateAfterPattern,
  handleDateBeforePattern,
  handleDateBetweenPattern,
  handleDateValidPattern,
  handleDateAgePattern,
  handleDateEqualsPattern,
  handleDateFormatPattern,
} from './datePatterns.js';

/**
 * Pattern matching for YAML tests
 * @param {string} pattern - The pattern to match
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
export function matchPattern(pattern, actual) {
  // Check if pattern has "not:" prefix - this negates the result
  let isNegated = false;
  let actualPattern = pattern;

  if (pattern.startsWith('not:')) {
    isNegated = true;
    actualPattern = pattern.substring(4);
  }

  const patternHandlers = {
    'regex:': handleRegexPattern,
    'length:': handleLengthPattern,
    'arrayLength:': handleArrayLengthPattern,
    'contains:': handleContainsPattern,
    'containsIgnoreCase:': handleContainsIgnoreCasePattern,
    'equalsIgnoreCase:': handleEqualsIgnoreCasePattern,
    'startsWith:': handleStartsWithPattern,
    'endsWith:': handleEndsWithPattern,
    'arrayContains:': handleArrayContainsPattern,
    'type:': handleTypePattern,
    'exists': handleExistsPattern,
    'count:': handleCountPattern,
    'greaterThan:': handleGreaterThanPattern,
    'greaterThanOrEqual:': handleGreaterThanOrEqualPattern,
    'lessThan:': handleLessThanPattern,
    'lessThanOrEqual:': handleLessThanOrEqualPattern,
    'between:': handleBetweenPattern,
    'range:': handleRangePattern,
    'equals:': handleEqualsPattern,
    'notEquals:': handleNotEqualsPattern,
    'approximately:': handleApproximatelyPattern,
    'multipleOf:': handleMultipleOfPattern,
    'divisibleBy:': handleDivisibleByPattern,
    'decimalPlaces:': handleDecimalPlacesPattern,
    'dateAfter:': handleDateAfterPattern,
    'dateBefore:': handleDateBeforePattern,
    'dateBetween:': handleDateBetweenPattern,
    'dateValid': handleDateValidPattern,
    'dateAge:': handleDateAgePattern,
    'dateEquals:': handleDateEqualsPattern,
    'dateFormat:': handleDateFormatPattern,
  };

  let result = false;

  // Find matching handler
  for (const [prefix, handler] of Object.entries(patternHandlers)) {
    if (actualPattern.startsWith(prefix)) {
      result = handler(actualPattern, actual);
      break;
    }
  }

  // If no specific handler found, use default handler
  if (!result && !Object.keys(patternHandlers).some(prefix => actualPattern.startsWith(prefix))) {
    result = handleDefaultPattern(actualPattern, actual);
  }

  // Apply negation if needed
  return isNegated ? !result : result;
}

