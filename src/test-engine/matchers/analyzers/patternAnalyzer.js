/**
 * Pattern analyzer - analyzes pattern-specific errors
 * Follows single responsibility principle - only concerned with pattern analysis
 */

import { PATTERN_ANALYZERS, isLikelyPattern } from '../corrections/index.js';
import {
  isValidDateFormat,
  isMissingColon,
  extractFieldPath,
  hasProperDotNotation,
  isNumeric,
} from '../utils/validators.js';
import { createSuggestion } from '../utils/formatters.js';

/**
 * Analyze pattern-specific common errors
 * @param {string} pattern - The pattern to analyze
 * @returns {Array} Array of suggestions
 */
export function analyzePatternSpecificErrors(pattern) {
  const suggestions = [];

  // Check for missing match: prefix
  if (!pattern.startsWith('match:') && isLikelyPattern(pattern)) {
    suggestions.push(createSuggestion({
      type: 'missing_prefix',
      original: pattern,
      corrected: `match:${pattern}`,
      message: 'Pattern strings should start with "match:" prefix',
    }));
  }

  // Check for common pattern naming errors (missing 's' in plural forms)
  const pluralErrors = [
    { from: 'match:contain:', to: 'match:contains:', name: 'contains' },
    { from: 'match:startWith:', to: 'match:startsWith:', name: 'startsWith' },
    { from: 'match:endWith:', to: 'match:endsWith:', name: 'endsWith' },
  ];

  for (const error of pluralErrors) {
    if (pattern.includes(error.from)) {
      const corrected = pattern.replace(error.from, error.to);
      suggestions.push(createSuggestion({
        type: 'pattern_name_error',
        original: pattern,
        corrected,
        message: `Use "${error.to}" instead of "${error.from}"`,
      }));
    }
  }

  // Run pattern-specific analyzers
  for (const analyzer of Object.values(PATTERN_ANALYZERS)) {
    suggestions.push(...analyzer(pattern));
  }

  // Check for missing colon after pattern names
  if (isMissingColon(pattern)) {
    const corrected = `${pattern}:`;
    suggestions.push(createSuggestion({
      type: 'missing_colon',
      original: pattern,
      corrected,
      message: 'Pattern should end with colon (:) when used without a value',
    }));
  }

  // Check for arrayContains with missing field specification
  if (pattern.includes('arrayContains:') && pattern.split(':').length === 3 && pattern.endsWith(':')) {
    suggestions.push(createSuggestion({
      type: 'incomplete_pattern',
      original: pattern,
      corrected: `${pattern}fieldName:expectedValue`,
      message: 'arrayContains needs either a simple value or fieldName:expectedValue format',
      example: 'Use "match:arrayContains:myValue" or "match:arrayContains:name:expectedName"',
    }));
  }

  // Check for extractField without proper path format
  if (pattern.includes('extractField:')) {
    const fieldPath = extractFieldPath(pattern);
    if (fieldPath && !hasProperDotNotation(fieldPath)) {
      suggestions.push(createSuggestion({
        type: 'invalid_field_path',
        original: pattern,
        corrected: `${pattern.split(':')[0]}:extractField:${fieldPath}.*`,
        message: 'extractField requires dot notation path like "tools.*.name" or "result.items.0.id"',
        example: 'Use "match:extractField:tools.*.name" to extract all tool names',
      }));
    }
  }

  // Check for length patterns without numbers
  if (pattern.includes('length:')) {
    const lengthValue = pattern.split('length:')[1];
    if (lengthValue && !isNumeric(lengthValue.split(':')[0])) {
      suggestions.push(createSuggestion({
        type: 'invalid_length',
        original: pattern,
        corrected: `${pattern.split('length:')[0]}length:0`,
        message: 'Length pattern requires a number: "match:length:5"',
      }));
    }
  }

  // Check for date patterns with invalid formats
  const datePatterns = ['dateAfter:', 'dateBefore:', 'dateEquals:'];
  for (const datePattern of datePatterns) {
    if (pattern.includes(datePattern)) {
      const datePart = pattern.split(new RegExp('date(?:After|Before|Equals):'))[1];
      if (datePart && !isValidDateFormat(datePart)) {
        suggestions.push(createSuggestion({
          type: 'invalid_date_format',
          original: pattern,
          corrected: pattern.replace(datePart, '2023-01-01'),
          message: 'Use ISO date format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS',
          example: 'Use "match:dateAfter:2023-01-01" or "match:dateAfter:2023-01-01T10:00:00"',
        }));
      }
    }
  }

  return suggestions;
}
