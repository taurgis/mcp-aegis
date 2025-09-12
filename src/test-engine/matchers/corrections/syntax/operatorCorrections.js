/**
 * Enhanced operator corrections - comprehensive operator-related syntax error detection and correction
 * Focuses solely on operator corrections and symbol substitutions
 */

import { VALID_PATTERNS, PATTERN_EXAMPLES } from '../shared/patterns.js';

/**
 * Comprehensive operator alias and symbol corrections
 * Covers mathematical operators, programming language syntax, SQL-style operators, and common typos
 */
export const OPERATOR_CORRECTIONS = {
  // Mathematical operator aliases
  'match:eq:': 'match:equals:',
  'match:ne:': 'match:notEquals:',
  'match:gt:': 'match:greaterThan:',
  'match:lt:': 'match:lessThan:',

  // Programming language operators
  'match:==:': 'match:equals:',
  'match:!=:': 'match:notEquals:',
  'match:>:': 'match:greaterThan:',
  'match:<:': 'match:lessThan:',
  'match:>=:': 'match:greaterThanOrEqual:',
  'match:<=:': 'match:lessThanOrEqual:',

  // Common typos and variations
  'match:equal:': 'match:equals:',
  'match:notEqual:': 'match:notEquals:',
  'match:greater:': 'match:greaterThan:',
  'match:less:': 'match:lessThan:',
  'match:gte:': 'match:greaterThanOrEqual:',
  'match:lte:': 'match:lessThanOrEqual:',
  'match:approximate:': 'match:approximately:',
  'match:approx:': 'match:approximately:',
  'match:multipleof:': 'match:multipleOf:',
  'match:divisibleby:': 'match:divisibleBy:',
  'match:decimalplaces:': 'match:decimalPlaces:',
};

/**
 * Enhanced analyzeOperatorErrors function to detect operator symbols
 * @param {string} pattern - Pattern to analyze
 * @returns {Array} Array of operator correction suggestions
 */
export function analyzeOperatorErrors(pattern) {
  const suggestions = [];

  // Handle null, undefined, or non-string patterns
  if (!pattern || typeof pattern !== 'string') {
    return suggestions;
  }

  // Check for wrong delimiter in numeric ranges
  if (pattern.includes(',') && (pattern.includes('between:') || pattern.includes('range:') || pattern.includes('dateBetween:'))) {
    const corrected = pattern.replace(/,/g, ':');
    suggestions.push({
      type: 'wrong_delimiter',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use colon (:) instead of comma (,) to separate range values',
    });
  }

  // Check for common operator aliases first (existing logic)
  let foundAlias = false;
  for (const [alias, correct] of Object.entries(OPERATOR_CORRECTIONS)) {
    if (pattern === alias || pattern.includes(alias)) {
      const corrected = pattern.replace(alias, correct);
      suggestions.push({
        type: 'operator_alias',
        original: pattern,
        corrected,
        pattern: corrected,
        message: `Use "${correct}" instead of "${alias}"`,
      });
      foundAlias = true;
      break; // Only suggest one alias fix per pattern
    }
  }

  // Check for operator symbols with values (e.g., "match:=value", "match:>5", etc.)
  // Only if no existing alias was found
  if (!foundAlias) {
    const operatorSymbolMappings = [
      { pattern: /^match:=(.+)$/, replacement: 'match:equals:', name: 'equals' },
      { pattern: /^match:==(.+)$/, replacement: 'match:equals:', name: 'equals' },
      { pattern: /^match:!=(.+)$/, replacement: 'match:notEquals:', name: 'notEquals' },
      { pattern: /^match:>(.+)$/, replacement: 'match:greaterThan:', name: 'greaterThan' },
      { pattern: /^match:<(.+)$/, replacement: 'match:lessThan:', name: 'lessThan' },
      { pattern: /^match:>=(.+)$/, replacement: 'match:greaterThanOrEqual:', name: 'greaterThanOrEqual' },
      { pattern: /^match:<=(.+)$/, replacement: 'match:lessThanOrEqual:', name: 'lessThanOrEqual' },
    ];

    for (const mapping of operatorSymbolMappings) {
      const match = pattern.match(mapping.pattern);
      if (match) {
        const value = match[1];
        const corrected = `${mapping.replacement}${value}`;
        suggestions.push({
          type: 'operator_symbol',
          original: pattern,
          corrected,
          pattern: corrected,
          message: `Use named operator "${mapping.name}" instead of symbol. Replace with "${corrected}"`,
        });
        break; // Only suggest one operator fix per pattern
      }
    }
  }

  return suggestions;
}

/**
 * Generate comprehensive debugging help for developers and AI agents
 * @param {string} pattern - The problematic pattern
 * @param {*} actualValue - The actual value being tested
 * @param {string} fieldPath - Path to the field
 * @returns {Object} Comprehensive debugging information
 */
export function generateOperatorDebuggingHelp(pattern, actualValue = null, fieldPath = '') {
  const analysis = analyzeOperatorErrors(pattern);
  const valueType = detectValueType(actualValue);

  return {
    pattern,
    actualValue,
    fieldPath,
    valueType,
    analysis: {
      errors: analysis.filter(s => s.type === 'wrong_delimiter'),
      warnings: analysis.filter(s => s.type === 'operator_alias'),
      suggestions: generateContextSuggestions(valueType, fieldPath),
    },
    quickFixes: analysis.slice(0, 3), // Top 3 quick fixes
    documentation: {
      validPatterns: Object.keys(VALID_PATTERNS),
      examples: getPatternExamples(valueType),
    },
  };
}

/**
 * Helper functions
 */
function detectValueType(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  if (typeof value === 'string') {
    // Check if it looks like a date
    if (/\d{4}-\d{2}-\d{2}/.test(value) || /\d{2}\/\d{2}\/\d{4}/.test(value)) {
      return 'date';
    }
    return 'string';
  }
  if (typeof value === 'number') {
    return 'numeric';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (typeof value === 'object') {
    return 'object';
  }
  return 'unknown';
}

function generateContextSuggestions(valueType, fieldPath) {
  const suggestions = [];

  // Context-aware suggestions based on value type
  if (valueType === 'numeric') {
    suggestions.push({
      type: 'context_suggestion',
      message: 'For numeric values, consider these patterns:',
      patterns: [
        'match:greaterThan:100',
        'match:lessThan:50',
        'match:between:10:90',
        'match:equals:42',
        'match:approximately:3.14:0.01',
      ],
    });
  } else if (valueType === 'string') {
    suggestions.push({
      type: 'context_suggestion',
      message: 'For string values, consider these patterns:',
      patterns: [
        'match:contains:example',
        'match:startsWith:prefix',
        'match:endsWith:suffix',
        'match:regex:^[A-Z][a-z]+$',
        'match:equalsIgnoreCase:VALUE',
      ],
    });
  } else if (valueType === 'array') {
    suggestions.push({
      type: 'context_suggestion',
      message: 'For array values, consider these patterns:',
      patterns: [
        'match:arrayLength:5',
        'match:arrayContains:value',
        'match:arrayElements:',
      ],
    });
  }

  // Check for date patterns when field suggests date context
  if (fieldPath.toLowerCase().includes('date') || fieldPath.toLowerCase().includes('time')) {
    suggestions.push({
      type: 'date_context_suggestion',
      message: 'This field appears to be a date/time field. Consider using date patterns:',
      patterns: [
        'match:dateValid',
        'match:dateAfter:2023-01-01',
        'match:dateBefore:2024-12-31',
        'match:dateAge:7d',
        'match:dateFormat:iso',
      ],
    });
  }

  return suggestions;
}

function getPatternExamples(valueType) {
  return PATTERN_EXAMPLES[valueType] || PATTERN_EXAMPLES.default;
}

// Re-export shared patterns for backward compatibility
export { VALID_PATTERNS } from '../shared/patterns.js';
