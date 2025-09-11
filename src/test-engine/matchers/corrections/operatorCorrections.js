/**
 * Enhanced operator corrections - comprehensive operator-related syntax error detection and correction
 * Designed for developers and AI agents to quickly debug YAML pattern issues in MCP Conductor
 * Follows single responsibility principle - only concerned with operator corrections
 */

/**
 * Complete list of valid patterns (for reference and validation)
 * Updated with all 29+ patterns from MCP Conductor documentation
 */
export const VALID_PATTERNS = {
  // String patterns
  'regex': 'Regular expression matching',
  'contains': 'String contains substring',
  'containsIgnoreCase': 'Case-insensitive contains',
  'startsWith': 'String starts with prefix',
  'endsWith': 'String ends with suffix',
  'equalsIgnoreCase': 'Case-insensitive equality',

  // Array patterns
  'arrayLength': 'Array has exactly N elements',
  'arrayContains': 'Array contains specific value (supports field notation)',
  'arrayElements': 'All array elements match pattern',

  // Type patterns
  'type': 'Data type validation (string, number, object, array, boolean, null)',
  'length': 'String or array length',
  'exists': 'Field exists validation',
  'count': 'Object property count',

  // Numeric comparison patterns
  'greaterThan': 'Value > N',
  'lessThan': 'Value < N',
  'greaterThanOrEqual': 'Value >= N',
  'lessThanOrEqual': 'Value <= N',
  'between': 'Value between MIN:MAX (inclusive)',
  'range': 'Alias for between',
  'equals': 'Exact numeric equality',
  'notEquals': 'Numeric inequality',
  'approximately': 'Floating-point tolerance (VALUE:TOLERANCE)',
  'multipleOf': 'Must be multiple of N',
  'divisibleBy': 'Must be divisible by N',
  'decimalPlaces': 'Must have exactly N decimal places',

  // Date patterns
  'dateValid': 'Valid date/timestamp',
  'dateAfter': 'Date after specified date',
  'dateBefore': 'Date before specified date',
  'dateBetween': 'Date within range (START:END)',
  'dateAge': 'Date within age limit (1d, 2h, 30m)',
  'dateEquals': 'Exact date match',
  'dateFormat': 'Validate date format (iso, iso-date, us-date, timestamp)',

  // Special patterns
  'partial': 'Partial object matching',
  'extractField': 'Extract field values (supports dot notation)',
  'not': 'Negate any pattern (prefix)',
};

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
 * Basic analyzeOperatorErrors function - can be enhanced further
 * @param {string} pattern - Pattern to analyze
 * @returns {Array} Array of operator correction suggestions
 */
export function analyzeOperatorErrors(pattern) {
  const suggestions = [];

  // Handle null, undefined, or non-string inputs
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

  // Check for common operator aliases
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
export function generateOperatorDebuggingHelp(pattern = '', actualValue = null, fieldPath = '') {
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
  const examples = {
    numeric: ['match:greaterThan:100', 'match:between:10:90'],
    string: ['match:contains:example', 'match:startsWith:prefix'],
    array: ['match:arrayLength:5', 'match:arrayContains:value'],
    date: ['match:dateValid', 'match:dateAfter:2023-01-01'],
    default: ['match:equals:value', 'match:type:string'],
  };

  return examples[valueType] || examples.default;
}
