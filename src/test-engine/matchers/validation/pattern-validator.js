/**
 * Pattern Validation - Handles string pattern validation with detailed error analysis
 * Single responsibility: Validate string patterns and provide specific failure feedback
 */

import { matchPattern } from '../patterns.js';
import { analyzeNonExistentFeatures } from '../corrections/index.js';

/**
 * Validate string patterns with detailed error reporting
 * @param {string} expected - Pattern string (e.g., "match:type:string")
 * @param {*} actual - Actual value
 * @param {string} path - Current validation path
 * @param {Object} context - Validation context
 * @returns {boolean} Whether pattern validation passed
 */
export function validatePattern(expected, actual, path, context) {
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
  // Utility: produce diff index for short strings
  const diffIndex = (a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return -1;
    }
    const max = Math.min(a.length, b.length);
    for (let i = 0; i < max; i++) {
      if (a[i] !== b[i]) {
        return i;
      }
    }
    return a.length === b.length ? -1 : max; // divergence at end
  };

  // List of all supported pattern prefixes and exact patterns
  const SUPPORTED_PATTERN_PREFIXES = [
    'regex:', 'length:', 'arrayLength:', 'contains:', 'containsIgnoreCase:', 'equalsIgnoreCase:',
    'startsWith:', 'endsWith:', 'arrayContains:', 'type:', 'count:', 'greaterThan:', 'greaterThanOrEqual:',
    'lessThan:', 'lessThanOrEqual:', 'between:', 'range:', 'equals:', 'notEquals:', 'approximately:',
    'multipleOf:', 'divisibleBy:', 'decimalPlaces:', 'dateAfter:', 'dateBefore:', 'dateBetween:',
    'dateAge:', 'dateEquals:', 'dateFormat:', 'crossField:', 'not:',
    // String length patterns
    'stringLength:', 'stringLengthGreaterThan:', 'stringLengthLessThan:',
    'stringLengthGreaterThanOrEqual:', 'stringLengthLessThanOrEqual:', 'stringLengthBetween:',
  ];

  const SUPPORTED_EXACT_PATTERNS = ['exists', 'dateValid', 'stringEmpty', 'stringNotEmpty'];

  // Check if this pattern has a recognized prefix or is a plain regex (no prefix with colon)
  const hasKnownPrefix = SUPPORTED_PATTERN_PREFIXES.some(p => pattern.startsWith(p)) ||
                        SUPPORTED_EXACT_PATTERNS.includes(pattern);
  const isPlainRegex = !pattern.includes(':') || pattern.match(/^[^:]+$/);

  // Only analyze for non-existent features if pattern looks like it has a prefix but isn't recognized
  if (!hasKnownPrefix && !isPlainRegex && pattern.includes(':')) {
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
  }

  // Handle type patterns
  if (pattern.startsWith('type:')) {
    const expectedTypeRaw = pattern.substring(5);
    const expectedType = normalizeTypeAlias(expectedTypeRaw);
    const detailParts = [];

    // Provide structural hints for complex types
    if (Array.isArray(actual)) {
      detailParts.push(`actual array length=${actual.length}`);
      if (actual.length > 0) {
        const firstType = typeof actual[0];
        // Collect up to first 4 distinct element types for richer diagnostics
        const typeSet = [];
        for (let i = 0; i < actual.length && typeSet.length < 4; i++) {
          const t = typeof actual[i];
          if (!typeSet.includes(t)) {
            typeSet.push(t);
          }
        }
        detailParts.push(`elementTypes=${typeSet.join('|')}`);
        detailParts.push(`firstElementType=${firstType}`);
      }
    } else if (actual && typeof actual === 'object') {
      const keys = Object.keys(actual);
      const keysPreview = keys.slice(0, 5).join(',');
      const overflow = keys.length > 5 ? '…' : '';
      detailParts.push(`actual object keys=${keys.length}[${keysPreview}${overflow}]`);
    } else if (actualType === 'string') {
      detailParts.push(`length=${actual.length}`);
      if (actual.length > 60) {
        const truncated = `${String(actual).slice(0, 57)}…`;
        detailParts.push(`preview=${JSON.stringify(truncated)}`);
      }
    }

    // Null / undefined special cases
    if (expectedType === 'null' && actual !== null) {
      detailParts.push('expected null value');
    } else if (expectedType === 'array' && actualType === 'object') {
      detailParts.push('hint: did you mean object schema validation?');
    } else if (expectedType === 'object' && Array.isArray(actual)) {
      detailParts.push('hint: received array not plain object');
    }

    const detail = detailParts.length ? ` | ${detailParts.join(' | ')}` : '';
    const message = `Type validation failed: expected '${expectedTypeRaw}' but got '${actualType}'${detail}`;

    // Suggest alternative patterns / corrections
    const suggestions = [];
    suggestions.push(`Fix server to return ${expectedTypeRaw} type`);
    suggestions.push(`or change pattern to 'match:type:${actualType}'`);
    if (expectedTypeRaw === 'array' && actualType === 'object') {
      suggestions.push("If you only need keys count, use 'match:count:<n>' on object");
    }
    if (expectedTypeRaw === 'object' && Array.isArray(actual)) {
      suggestions.push("If you intended to assert array length, use 'match:length:<n>'");
    }
    if ((expectedTypeRaw === 'string' || expectedTypeRaw === 'number') && actualType !== expectedTypeRaw) {
      suggestions.push("If you only care existence, use 'match:exists'");
    }
    const suggestion = suggestions.join(' | ');

    return {
      patternType: 'type',
      message,
      suggestion,
      expectedNormalized: expectedType,
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
  // --- Enhanced STRING pattern diagnostics (parity with numeric/date detail) ---
  // Provide diff-oriented messaging, case-insensitive hints, and regex anchor suggestions
  if (pattern.startsWith('length:')) {
    const raw = pattern.substring(7);
    const expectedLen = parseInt(raw, 10);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    if (isNaN(expectedLen)) {
      return {
        patternType: 'length_malformed',
        message: `length pattern malformed: '${raw}' is not an integer`,
        suggestion: 'Use integer length e.g. match:length:12',
      };
    }
    const actualLen = actualStr.length;
    return {
      patternType: 'length',
      message: `Length validation failed: expected ${expectedLen} characters but got ${actualLen}${actualLen !== 0 ? ` (diff ${actualLen - expectedLen})` : ''}`,
      suggestion: `Adjust string to length ${expectedLen} or update pattern to match ${actualLen}`,
    };
  }

  if (pattern.startsWith('containsIgnoreCase:')) {
    const term = pattern.substring('containsIgnoreCase:'.length);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    return {
      patternType: 'containsIgnoreCase',
      message: `Case-insensitive contains failed: '${term}' not found in ${actualPreview}`,
      suggestion: `Ensure value contains '${term}' (any case) or change term; actual lower case preview: '${actualStr.toLowerCase()}'`,
    };
  }

  if (pattern.startsWith('equalsIgnoreCase:')) {
    const target = pattern.substring('equalsIgnoreCase:'.length);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    return {
      patternType: 'equalsIgnoreCase',
      message: `Case-insensitive equality failed: expected '${target}' ~= '${actualStr}' (lowercase comparison '${target.toLowerCase()}' vs '${actualStr.toLowerCase()}')`,
      suggestion: `Adjust value to '${target}' (any case) or update pattern`,
    };
  }

  if (pattern.startsWith('icontains:')) { // alias in tests (match:icontains:TEXT)
    const term = pattern.substring('icontains:'.length);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    return {
      patternType: 'icontains',
      message: `Case-insensitive contains failed: '${term}' not found in ${actualPreview}`,
      suggestion: `Ensure value contains '${term}' (any case). Current value length ${actualStr.length}`,
    };
  }

  if (pattern.startsWith('regex:')) {
    const expr = pattern.substring(6);
    // Special handling when actual is array: clarify no element matched
    if (Array.isArray(actual)) {
      const sample = actual.slice(0, 3).map(v => (typeof v === 'string' ? v : JSON.stringify(v)));
      return {
        patternType: 'regex',
        message: `Regex pattern '${expr}' did not match any element in extracted array[length=${actual.length}]`,
        suggestion: `Adjust regex or server output. First sample elements: ${sample.join(' | ')}`,
      };
    }
    return {
      patternType: 'regex',
      message: `Regex pattern '${expr}' did not match value ${actualPreview}`,
      suggestion: expr.startsWith('^') && expr.endsWith('$')
        ? 'Update regex or server output to satisfy anchored expression'
        : 'Consider anchoring with ^ and $ if full-string match intended, or adjust pattern/output',
    };
  }

  if (pattern.startsWith('contains:')) {
    const searchTerm = pattern.substring(9);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const preview = actualStr.length > 80 ? `${actualStr.slice(0, 80)}...` : actualStr;
    return {
      patternType: 'contains',
      message: `Contains validation failed: '${searchTerm}' not found (string length ${actualStr.length})`,
      suggestion: typeof actual === 'string'
        ? `Insert '${searchTerm}' into value or change pattern. Preview: "${preview}"`
        : `Fix server to return string containing '${searchTerm}' or change validation approach. Preview: "${preview}"`,
    };
  }

  if (pattern.startsWith('startsWith:')) {
    const prefix = pattern.substring(11);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const commonPrefixLen = commonPrefixLength(actualStr, prefix);
    const idx = diffIndex(actualStr, prefix);
    let diffSnippet = '';
    if (idx !== -1) {
      diffSnippet = ` | diff@${idx}`;
    }
    return {
      patternType: 'startsWith',
      message: `StartsWith failed: value does not start with '${prefix}' (shared prefix length ${commonPrefixLen}/${prefix.length}${diffSnippet})`,
      suggestion: typeof actual === 'string'
        ? (commonPrefixLen > 0
          ? `Adjust start to '${prefix}' (currently shares '${prefix.slice(0, commonPrefixLen)}')`
          : `Change server value to start with '${prefix}' or update pattern`)
        : `Fix server to return string starting with '${prefix}' or change validation approach`,
    };
  }

  if (pattern.startsWith('endsWith:')) {
    const suffix = pattern.substring(9);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const shared = commonSuffixLength(actualStr, suffix);
    // We don't currently display idx for suffix; could add future improvement.
    return {
      patternType: 'endsWith',
      message: `EndsWith failed: value does not end with '${suffix}' (shared suffix length ${shared}/${suffix.length})`,
      suggestion: typeof actual === 'string'
        ? (shared > 0
          ? `Adjust ending to '${suffix}' (currently ends with '${actualStr.slice(-shared)}')`
          : `Change server value to end with '${suffix}' or update pattern`)
        : `Fix server to return string ending with '${suffix}' or change validation approach`,
    };
  }

  // String length patterns - Enhanced feedback for the new length validation patterns
  if (pattern.startsWith('stringLength:')) {
    const expectedLength = parseInt(pattern.substring(13), 10);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const actualLength = actualStr.length;
    if (isNaN(expectedLength)) {
      return {
        patternType: 'stringLength_malformed',
        message: `stringLength pattern malformed: expected integer but got '${pattern.substring(13)}'`,
        suggestion: 'Use integer value e.g. match:stringLength:10',
      };
    }
    const diff = actualLength - expectedLength;
    return {
      patternType: 'stringLength',
      message: `String length validation failed: expected exactly ${expectedLength} characters but got ${actualLength} (difference: ${diff > 0 ? '+' : ''}${diff})`,
      suggestion: diff > 0
        ? `Shorten text by ${diff} character(s) or change expected length to ${actualLength}`
        : `Lengthen text by ${Math.abs(diff)} character(s) or change expected length to ${actualLength}`,
    };
  }

  if (pattern.startsWith('stringLengthGreaterThan:')) {
    const minLength = parseInt(pattern.substring(24), 10);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const actualLength = actualStr.length;
    if (isNaN(minLength)) {
      return {
        patternType: 'stringLengthGreaterThan_malformed',
        message: `stringLengthGreaterThan pattern malformed: expected integer but got '${pattern.substring(24)}'`,
        suggestion: 'Use integer value e.g. match:stringLengthGreaterThan:5',
      };
    }
    const shortage = minLength - actualLength + 1;
    return {
      patternType: 'stringLengthGreaterThan',
      message: `String length validation failed: expected > ${minLength} characters but got ${actualLength}`,
      suggestion: actualLength <= minLength
        ? `Add ${shortage} more character(s) (minimum ${minLength + 1}) or lower threshold`
        : 'String meets length requirement - check logic',
    };
  }

  if (pattern.startsWith('stringLengthLessThan:')) {
    const maxLength = parseInt(pattern.substring(21), 10);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const actualLength = actualStr.length;
    if (isNaN(maxLength)) {
      return {
        patternType: 'stringLengthLessThan_malformed',
        message: `stringLengthLessThan pattern malformed: expected integer but got '${pattern.substring(21)}'`,
        suggestion: 'Use integer value e.g. match:stringLengthLessThan:100',
      };
    }
    const excess = actualLength - maxLength + 1;
    return {
      patternType: 'stringLengthLessThan',
      message: `String length validation failed: expected < ${maxLength} characters but got ${actualLength}`,
      suggestion: actualLength >= maxLength
        ? `Remove ${excess} character(s) (maximum ${maxLength - 1}) or raise threshold`
        : 'String meets length requirement - check logic',
    };
  }

  if (pattern.startsWith('stringLengthGreaterThanOrEqual:')) {
    const minLength = parseInt(pattern.substring(31), 10);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const actualLength = actualStr.length;
    if (isNaN(minLength)) {
      return {
        patternType: 'stringLengthGreaterThanOrEqual_malformed',
        message: `stringLengthGreaterThanOrEqual pattern malformed: expected integer but got '${pattern.substring(31)}'`,
        suggestion: 'Use integer value e.g. match:stringLengthGreaterThanOrEqual:1',
      };
    }
    const shortage = minLength - actualLength;
    return {
      patternType: 'stringLengthGreaterThanOrEqual',
      message: `String length validation failed: expected >= ${minLength} characters but got ${actualLength}`,
      suggestion: actualLength < minLength
        ? `Add ${shortage} more character(s) or lower threshold to ${actualLength}`
        : 'String meets length requirement - check logic',
    };
  }

  if (pattern.startsWith('stringLengthLessThanOrEqual:')) {
    const maxLength = parseInt(pattern.substring(28), 10);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const actualLength = actualStr.length;
    if (isNaN(maxLength)) {
      return {
        patternType: 'stringLengthLessThanOrEqual_malformed',
        message: `stringLengthLessThanOrEqual pattern malformed: expected integer but got '${pattern.substring(28)}'`,
        suggestion: 'Use integer value e.g. match:stringLengthLessThanOrEqual:50',
      };
    }
    const excess = actualLength - maxLength;
    return {
      patternType: 'stringLengthLessThanOrEqual',
      message: `String length validation failed: expected <= ${maxLength} characters but got ${actualLength}`,
      suggestion: actualLength > maxLength
        ? `Remove ${excess} character(s) or raise threshold to ${actualLength}`
        : 'String meets length requirement - check logic',
    };
  }

  if (pattern.startsWith('stringLengthBetween:')) {
    const betweenStr = pattern.substring(20);
    const parts = betweenStr.split(':');
    if (parts.length !== 2) {
      return {
        patternType: 'stringLengthBetween_malformed',
        message: `stringLengthBetween pattern malformed: expected 'stringLengthBetween:<min>:<max>' got '${pattern}'`,
        suggestion: 'Provide both min and max length e.g. match:stringLengthBetween:10:200',
      };
    }
    const [minStr, maxStr] = parts;
    const minLength = parseInt(minStr, 10);
    const maxLength = parseInt(maxStr, 10);
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const actualLength = actualStr.length;

    if (isNaN(minLength) || isNaN(maxLength)) {
      return {
        patternType: 'stringLengthBetween_malformed',
        message: `stringLengthBetween bounds invalid: min='${minStr}' max='${maxStr}'`,
        suggestion: 'Use valid integers for both bounds',
      };
    }
    if (minLength > maxLength) {
      return {
        patternType: 'stringLengthBetween_reversed',
        message: `stringLengthBetween range invalid: min ${minLength} > max ${maxLength}`,
        suggestion: 'Ensure min <= max',
      };
    }

    let rangeSuggestion;
    if (actualLength < minLength) {
      const shortage = minLength - actualLength;
      rangeSuggestion = `Add ${shortage} character(s) to reach minimum ${minLength}`;
    } else if (actualLength > maxLength) {
      const excess = actualLength - maxLength;
      rangeSuggestion = `Remove ${excess} character(s) to stay under maximum ${maxLength}`;
    } else {
      rangeSuggestion = 'String length is within range - check logic';
    }

    return {
      patternType: 'stringLengthBetween',
      message: `String length validation failed: expected ${minLength}-${maxLength} characters but got ${actualLength}`,
      suggestion: rangeSuggestion,
    };
  }

  if (pattern === 'stringEmpty') {
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const actualLength = actualStr.length;
    return {
      patternType: 'stringEmpty',
      message: `String empty validation failed: expected empty string but got ${actualLength} characters`,
      suggestion: actualLength > 0
        ? 'Clear the string value or change validation to \'match:stringNotEmpty\''
        : 'String is empty - check logic',
    };
  }

  if (pattern === 'stringNotEmpty') {
    const actualStr = typeof actual === 'string' ? actual : String(actual ?? '');
    const actualLength = actualStr.length;
    return {
      patternType: 'stringNotEmpty',
      message: 'String not empty validation failed: expected non-empty string but got empty string',
      suggestion: actualLength === 0
        ? 'Provide a non-empty string value or change validation to \'match:stringEmpty\''
        : 'String is not empty - check logic',
    };
  }

  // --- End enhanced string length diagnostics ---

  // --- End enhanced string diagnostics ---
  // Numeric pattern enhancements (mirrors date-specific feedback style)
  // Provide explicit diagnostics: thresholds, differences, remainders, tolerance, precision
  if (pattern.startsWith('greaterThan:')) {
    const raw = pattern.substring(12);
    const expectedNum = parseFloat(raw);
    const actualNum = parseFloat(actual);
    if (isNaN(expectedNum)) {
      return {
        patternType: 'greaterThan_malformed',
        message: `greaterThan pattern malformed: '${raw}' is not a number`,
        suggestion: 'Use numeric value e.g. match:greaterThan:10',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'greaterThan_type',
        message: `greaterThan failed: expected numeric value > ${expectedNum} but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    const diff = actualNum - expectedNum;
    return {
      patternType: 'greaterThan',
      message: `Numeric comparison failed: ${actualNum} is NOT > ${expectedNum} (difference ${diff.toFixed(2)})`,
      suggestion: `Increase value above ${expectedNum} or change threshold`,
    };
  }
  if (pattern.startsWith('greaterThanOrEqual:')) {
    const raw = pattern.substring(19);
    const expectedNum = parseFloat(raw);
    const actualNum = parseFloat(actual);
    if (isNaN(expectedNum)) {
      return {
        patternType: 'greaterThanOrEqual_malformed',
        message: `greaterThanOrEqual pattern malformed: '${raw}' is not a number`,
        suggestion: 'Use numeric value e.g. match:greaterThanOrEqual:10',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'greaterThanOrEqual_type',
        message: `greaterThanOrEqual failed: expected numeric value >= ${expectedNum} but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    const diff = actualNum - expectedNum;
    return {
      patternType: 'greaterThanOrEqual',
      message: `Numeric comparison failed: ${actualNum} is NOT >= ${expectedNum} (difference ${diff.toFixed(2)})`,
      suggestion: `Raise value to at least ${expectedNum} or adjust threshold`,
    };
  }
  if (pattern.startsWith('lessThan:')) {
    const raw = pattern.substring(9);
    const expectedNum = parseFloat(raw);
    const actualNum = parseFloat(actual);
    if (isNaN(expectedNum)) {
      return {
        patternType: 'lessThan_malformed',
        message: `lessThan pattern malformed: '${raw}' is not a number`,
        suggestion: 'Use numeric value e.g. match:lessThan:50',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'lessThan_type',
        message: `lessThan failed: expected numeric value < ${expectedNum} but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    const diff = actualNum - expectedNum; // positive means too large
    return {
      patternType: 'lessThan',
      message: `Numeric comparison failed: ${actualNum} is NOT < ${expectedNum} (exceeds by ${diff.toFixed(2)})`,
      suggestion: `Reduce value below ${expectedNum} or change threshold`,
    };
  }
  if (pattern.startsWith('lessThanOrEqual:')) {
    const raw = pattern.substring(16);
    const expectedNum = parseFloat(raw);
    const actualNum = parseFloat(actual);
    if (isNaN(expectedNum)) {
      return {
        patternType: 'lessThanOrEqual_malformed',
        message: `lessThanOrEqual pattern malformed: '${raw}' is not a number`,
        suggestion: 'Use numeric value e.g. match:lessThanOrEqual:50',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'lessThanOrEqual_type',
        message: `lessThanOrEqual failed: expected numeric value <= ${expectedNum} but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    const diff = actualNum - expectedNum; // positive means too large
    return {
      patternType: 'lessThanOrEqual',
      message: `Numeric comparison failed: ${actualNum} is NOT <= ${expectedNum} (exceeds by ${diff.toFixed(2)})`,
      suggestion: `Reduce value to <= ${expectedNum} or adjust threshold`,
    };
  }
  if (pattern.startsWith('between:')) {
    const raw = pattern.substring(8);
    const parts = raw.split(':');
    if (parts.length !== 2) {
      return {
        patternType: 'between_malformed',
        message: `between pattern malformed: expected 'between:min:max' got '${pattern}'`,
        suggestion: 'Use both bounds e.g. match:between:10:20',
      };
    }
    const [minStr, maxStr] = parts;
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);
    const actualNum = parseFloat(actual);
    if (isNaN(min) || isNaN(max)) {
      return {
        patternType: 'between_malformed',
        message: `between bounds invalid: min='${minStr}' max='${maxStr}'`,
        suggestion: 'Use numeric min and max, e.g. match:between:5:15',
      };
    }
    if (min > max) {
      return {
        patternType: 'between_reversed',
        message: `between range reversed: min ${min} > max ${max}`,
        suggestion: 'Swap the bounds so min <= max',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'between_type',
        message: `between failed: expected numeric in [${min}, ${max}] but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    return {
      patternType: 'between',
      message: `Range validation failed: ${actualNum} not in inclusive range [${min}, ${max}]`,
      suggestion: `Adjust value into range or change bounds to include ${actualNum}`,
    };
  }
  if (pattern.startsWith('range:')) {
    const raw = pattern.substring(6);
    const parts = raw.split(':');
    if (parts.length !== 2) {
      return {
        patternType: 'range_malformed',
        message: `range pattern malformed: expected 'range:min:max' got '${pattern}'`,
        suggestion: 'Use both bounds e.g. match:range:10:20',
      };
    }
    const [minStr, maxStr] = parts;
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);
    const actualNum = parseFloat(actual);
    if (isNaN(min) || isNaN(max)) {
      return {
        patternType: 'range_malformed',
        message: `range bounds invalid: min='${minStr}' max='${maxStr}'`,
        suggestion: 'Use numeric min and max, e.g. match:range:5:15',
      };
    }
    if (min > max) {
      return {
        patternType: 'range_reversed',
        message: `range range reversed: min ${min} > max ${max}`,
        suggestion: 'Swap the bounds so min <= max',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'range_type',
        message: `range failed: expected numeric in [${min}, ${max}] but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    return {
      patternType: 'range',
      message: `Range validation failed: ${actualNum} not in inclusive range [${min}, ${max}]`,
      suggestion: `Adjust value into range or change bounds to include ${actualNum}`,
    };
  }
  if (pattern.startsWith('equals:')) {
    const raw = pattern.substring(7);
    const expectedNum = parseFloat(raw);
    const actualNum = parseFloat(actual);
    if (isNaN(expectedNum)) {
      return {
        patternType: 'equals_malformed',
        message: `equals pattern malformed: '${raw}' is not a number`,
        suggestion: 'Use numeric value e.g. match:equals:42',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'equals_type',
        message: `equals failed: expected numeric == ${expectedNum} but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    return {
      patternType: 'equals',
      message: `Equality failed: ${actualNum} !== ${expectedNum} (difference ${(actualNum - expectedNum).toFixed(2)})`,
      suggestion: `Set value to ${expectedNum} or update expected equals pattern`,
    };
  }
  if (pattern.startsWith('notEquals:')) {
    const raw = pattern.substring(10);
    const disallowed = parseFloat(raw);
    const actualNum = parseFloat(actual);
    if (isNaN(disallowed)) {
      return {
        patternType: 'notEquals_malformed',
        message: `notEquals pattern malformed: '${raw}' is not a number`,
        suggestion: 'Use numeric value e.g. match:notEquals:0',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'notEquals_type',
        message: `notEquals failed: expected numeric value != ${disallowed} but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    return {
      patternType: 'notEquals',
      message: `Negated equality failed: value ${actualNum} SHOULD NOT equal ${disallowed}`,
      suggestion: `Change value away from ${disallowed} or remove notEquals`,
    };
  }
  if (pattern.startsWith('approximately:')) {
    const raw = pattern.substring(14);
    const parts = raw.split(':');
    if (parts.length !== 2) {
      return {
        patternType: 'approximately_malformed',
        message: `approximately pattern malformed: expected 'approximately:value:tolerance' got '${pattern}'`,
        suggestion: 'Use value and tolerance e.g. match:approximately:100:5',
      };
    }
    const [targetStr, tolStr] = parts;
    const target = parseFloat(targetStr);
    const tolerance = parseFloat(tolStr);
    const actualNum = parseFloat(actual);
    if (isNaN(target) || isNaN(tolerance)) {
      return {
        patternType: 'approximately_malformed',
        message: `approximately numbers invalid: value='${targetStr}' tolerance='${tolStr}'`,
        suggestion: 'Use numeric value and tolerance e.g. match:approximately:100:5',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'approximately_type',
        message: `approximately failed: expected numeric near ${target} ± ${tolerance} but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    const diff = Math.abs(actualNum - target);
    return {
      patternType: 'approximately',
      message: `Approximate comparison failed: |${actualNum} - ${target}| = ${diff.toFixed(2)} > ${tolerance}`,
      suggestion: `Adjust value within ±${tolerance} of ${target} or widen tolerance`,
    };
  }
  if (pattern.startsWith('multipleOf:')) {
    const raw = pattern.substring(11);
    const divisor = parseFloat(raw);
    const actualNum = parseFloat(actual);
    if (isNaN(divisor)) {
      return {
        patternType: 'multipleOf_malformed',
        message: `multipleOf pattern malformed: '${raw}' is not a number`,
        suggestion: 'Use numeric divisor e.g. match:multipleOf:10',
      };
    }
    if (divisor === 0) {
      return {
        patternType: 'multipleOf_malformed',
        message: 'multipleOf divisor cannot be 0',
        suggestion: 'Use non-zero divisor',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'multipleOf_type',
        message: `multipleOf failed: expected numeric multiple of ${divisor} but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    const remainder = actualNum % divisor;
    return {
      patternType: 'multipleOf',
      message: `MultipleOf failed: ${actualNum} % ${divisor} = ${remainder.toFixed(2)} (expected 0)`,
      suggestion: `Adjust value to a multiple of ${divisor} or change divisor`,
    };
  }
  if (pattern.startsWith('divisibleBy:')) {
    const raw = pattern.substring(12);
    const divisor = parseFloat(raw);
    const actualNum = parseFloat(actual);
    if (isNaN(divisor)) {
      return {
        patternType: 'divisibleBy_malformed',
        message: `divisibleBy pattern malformed: '${raw}' is not a number`,
        suggestion: 'Use numeric divisor e.g. match:divisibleBy:10',
      };
    }
    if (divisor === 0) {
      return {
        patternType: 'divisibleBy_malformed',
        message: 'divisibleBy divisor cannot be 0',
        suggestion: 'Use non-zero divisor',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'divisibleBy_type',
        message: `divisibleBy failed: expected numeric divisible by ${divisor} but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    const remainder = actualNum % divisor;
    return {
      patternType: 'divisibleBy',
      message: `DivisibleBy failed: ${actualNum} % ${divisor} = ${remainder.toFixed(2)} (expected 0)`,
      suggestion: `Adjust value to be divisible by ${divisor} or change divisor`,
    };
  }
  if (pattern.startsWith('decimalPlaces:')) {
    const raw = pattern.substring(14);
    const places = parseInt(raw, 10);
    const actualNum = parseFloat(actual);
    if (isNaN(places)) {
      return {
        patternType: 'decimalPlaces_malformed',
        message: `decimalPlaces pattern malformed: '${raw}' is not an integer`,
        suggestion: 'Use integer e.g. match:decimalPlaces:2',
      };
    }
    if (isNaN(actualNum)) {
      return {
        patternType: 'decimalPlaces_type',
        message: `decimalPlaces failed: expected numeric with ${places} decimal place(s) but actual is non-numeric ${actualPreview}`,
        suggestion: 'Return numeric value from server or adjust pattern',
      };
    }
    const actualStr = String(actual);
    const idx = actualStr.indexOf('.');
    const actualPlaces = idx === -1 ? 0 : actualStr.length - idx - 1;
    return {
      patternType: 'decimalPlaces',
      message: `Decimal precision failed: expected ${places} place(s) but got ${actualPlaces} (value ${actualStr})`,
      suggestion: `Format value with ${places} decimal place(s) or change expected precision`,
    };
  }

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
 * Normalize common type aliases to JavaScript typeof / semantic categories
 * @param {string} t
 * @returns {string}
 */
function normalizeTypeAlias(t) {
  if (!t) {
    return t;
  }
  const lower = t.toLowerCase();
  switch (lower) {
    case 'int':
    case 'integer':
    case 'float':
    case 'number':
      return 'number';
    case 'bool':
    case 'boolean':
      return 'boolean';
    case 'str':
    case 'string':
      return 'string';
    case 'arr':
    case 'array':
      return 'array';
    case 'obj':
    case 'object':
      return 'object';
    case 'null':
      return 'null';
    case 'undef':
    case 'undefined':
      return 'undefined';
    default:
      return t; // preserve custom / unexpected types for higher-level handling
  }
}

/**
 * Get a readable preview of a value for error messages
 * @param {*} value - Value to preview
 * @returns {string} Readable preview
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

/**
 * Compute length of common prefix between two strings
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function commonPrefixLength(a, b) {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[i] === b[i]) {
    i++;
  }
  return i;
}

/**
 * Compute length of common suffix between two strings
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function commonSuffixLength(a, b) {
  const max = Math.min(a.length, b.length);
  let i = 0;
  while (i < max && a[a.length - 1 - i] === b[b.length - 1 - i]) {
    i++;
  }
  return i;
}
