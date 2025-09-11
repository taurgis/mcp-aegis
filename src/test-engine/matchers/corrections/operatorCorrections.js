/**
 * Operator corrections - handles operator-related syntax errors
 * Follows single responsibility principle - only concerned with operator corrections
 */

/**
 * Operator symbol and alias corrections
 */
export const OPERATOR_CORRECTIONS = {
  // Wrong operators or symbols
  'match:eq:': 'match:equals:',
  'match:ne:': 'match:notEquals:',
  'match:gt:': 'match:greaterThan:',
  'match:lt:': 'match:lessThan:',
  'match:gte:': 'match:greaterThanOrEqual:',
  'match:lte:': 'match:lessThanOrEqual:',
  'match:==:': 'match:equals:',
  'match:!=:': 'match:notEquals:',
  'match:>:': 'match:greaterThan:',
  'match:<:': 'match:lessThan:',
  'match:>=:': 'match:greaterThanOrEqual:',
  'match:<=:': 'match:lessThanOrEqual:',

  // Operator symbols with values (pattern matching)
  'match:>5': 'match:greaterThan:5',
  'match:<10': 'match:lessThan:10',
  'match:>=0': 'match:greaterThanOrEqual:0',
  'match:<=100': 'match:lessThanOrEqual:100',
  'match:=value': 'match:equals:value',
  'match:==value': 'match:equals:value',
  'match:!=value': 'match:notEquals:value',
};

/**
 * Complex operator corrections with delimiters
 */
export const OPERATOR_DELIMITER_CORRECTIONS = {
  // Pattern delimiter errors
  'match:between:': {
    pattern: /^between:(\d+),(\d+)$/,
    correction: (match, p1, p2) => `between:${p1}:${p2}`,
    message: 'Use colon (:) instead of comma (,) as delimiter',
  },
  'match:range:': {
    pattern: /^range:(\d+),(\d+)$/,
    correction: (match, p1, p2) => `range:${p1}:${p2}`,
    message: 'Use colon (:) instead of comma (,) as delimiter',
  },
  'match:dateBetween:': {
    pattern: /^dateBetween:([^,]+),([^,]+)$/,
    correction: (match, p1, p2) => `dateBetween:${p1}:${p2}`,
    message: 'Use colon (:) instead of comma (,) as delimiter',
  },
};

/**
 * Analyze operator-related pattern errors
 * @param {string} pattern - Pattern to analyze
 * @returns {Array} Array of operator correction suggestions
 */
export function analyzeOperatorErrors(pattern) {
  const suggestions = [];

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

  // Check for common operator mistakes
  if (pattern.includes('=') && !pattern.includes('equals:') && !pattern.includes('notEquals:')) {
    const corrected = pattern.replace(/=+/g, '').replace(/match:/, 'match:equals:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:equals:value" instead of "match:=value" or similar',
    });
  }

  // Check for operator symbols
  if (pattern.includes('match:>') && !pattern.includes('greaterThan:')) {
    const corrected = pattern.replace('match:>', 'match:greaterThan:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:greaterThan:" instead of "match:>"',
    });
  }

  if (pattern.includes('match:<') && !pattern.includes('lessThan:')) {
    const corrected = pattern.replace('match:<', 'match:lessThan:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:lessThan:" instead of "match:<"',
    });
  }

  if (pattern.includes('match:!=') && !pattern.includes('notEquals:')) {
    const corrected = pattern.replace('match:!=', 'match:notEquals:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:notEquals:" instead of "match:!="',
    });
  }

  if (pattern.includes('match:==') && !pattern.includes('equals:')) {
    const corrected = pattern.replace('match:==', 'match:equals:');
    suggestions.push({
      type: 'wrong_operator',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:equals:" instead of "match:=="',
    });
  }

  // Check for common operator aliases
  if (pattern.includes('match:eq:') && !pattern.includes('equals:')) {
    const corrected = pattern.replace('match:eq:', 'match:equals:');
    suggestions.push({
      type: 'operator_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:equals:" instead of "match:eq:"',
    });
  }

  if (pattern.includes('match:ne:') && !pattern.includes('notEquals:')) {
    const corrected = pattern.replace('match:ne:', 'match:notEquals:');
    suggestions.push({
      type: 'operator_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:notEquals:" instead of "match:ne:"',
    });
  }

  if (pattern.includes('match:gt:') && !pattern.includes('greaterThan:')) {
    const corrected = pattern.replace('match:gt:', 'match:greaterThan:');
    suggestions.push({
      type: 'operator_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:greaterThan:" instead of "match:gt:"',
    });
  }

  if (pattern.includes('match:lt:') && !pattern.includes('lessThan:')) {
    const corrected = pattern.replace('match:lt:', 'match:lessThan:');
    suggestions.push({
      type: 'operator_alias',
      original: pattern,
      corrected,
      pattern: corrected,
      message: 'Use "match:lessThan:" instead of "match:lt:"',
    });
  }

  return suggestions;
}
