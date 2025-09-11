/**
 * Pattern naming corrections - handles misspellings and naming variations
 * Follows single responsibility principle - only concerned with pattern name corrections
 */

/**
 * Pattern naming error corrections
 */
export const PATTERN_NAMING_CORRECTIONS = {
  // Pattern naming errors - wrong pluralization
  'match:arrayElement:': 'match:arrayElements:',
  'match:arrayElement': 'match:arrayElements',
  'arrayElement:': 'arrayElements:',
  'arrayElement': 'arrayElements',
  'match:extractFields:': 'match:extractField:',
  'match:extractFields': 'match:extractField',
  'extractFields:': 'extractField:',
  'extractFields': 'extractField',

  // Plural/singular confusion
  'match:contain:': 'match:contains:',             // Fix missing 's'
  'match:startWith:': 'match:startsWith:',         // Fix missing 's'
  'match:endWith:': 'match:endsWith:',             // Fix missing 's'

  // Missing match: prefix
  'arrayLength:': 'match:arrayLength:',
  'arrayContains:': 'match:arrayContains:',
  'arrayElements:': 'match:arrayElements:',
  'contains:': 'match:contains:',
  'startsWith:': 'match:startsWith:',
  'endsWith:': 'match:endsWith:',
  'type:': 'match:type:',
  'regex:': 'match:regex:',
  'regexp:': 'match:regex:',               // Common regex alias
  'length:': 'match:length:',
  'between:': 'match:between:',
  'range:': 'match:range:',
  'greaterThan:': 'match:greaterThan:',
  'lessThan:': 'match:lessThan:',
  'equals:': 'match:equals:',
  'notEquals:': 'match:notEquals:',
  'approximately:': 'match:approximately:',
  'multipleOf:': 'match:multipleOf:',
  'dateAfter:': 'match:dateAfter:',
  'dateBefore:': 'match:dateBefore:',
  'dateValid': 'match:dateValid',
  'dateAge:': 'match:dateAge:',
  'dateEquals:': 'match:dateEquals:',
  'dateFormat:': 'match:dateFormat:',
  'exists': 'match:exists',
  'extractField:': 'match:extractField:',
  'partial:': 'match:partial:',
  'not:': 'match:not:',

  // Common misspellings
  'match:aproximate:': 'match:approximately:',
  'match:multiple:': 'match:multipleOf:',
  'match:divisible:': 'match:multipleOf:',
};

/**
 * Complex pattern naming corrections with regex patterns
 */
export const PATTERN_NAMING_REGEX_CORRECTIONS = {
  // Misspelling with regex patterns
  'match:lenght:': {
    pattern: /^lenght:(\d+)$/,
    correction: (match, num) => `length:${num}`,
    message: 'Misspelling: use "length" instead of "lenght"',
  },
  'match:aproximately:': {
    pattern: /^aproximately:(.+)$/,
    correction: (match, value) => `approximately:${value}`,
    message: 'Misspelling: use "approximately" instead of "aproximately"',
  },
  // Array contains with field specification
  'match:arrayContains:name:': {
    pattern: /^arrayContains:([^:]+):(.*)$/,
    correction: (match, field, value) => `arrayContains:${field}:${value}`,
    message: 'Use format "match:arrayContains:fieldName:expectedValue" for object field matching',
  },
};

/**
 * Check if a string looks like a pattern that should have match: prefix
 * @param {string} str - String to check
 * @returns {boolean} Whether it looks like a pattern
 */
export function isLikelyPattern(str) {
  const patternIndicators = [
    'arrayLength:', 'arrayContains:', 'arrayElements:', 'contains:', 'startsWith:', 'endsWith:',
    'type:', 'regex:', 'regexp:', 'length:', 'between:', 'range:', 'greaterThan:', 'lessThan:',
    'equals:', 'notEquals:', 'approximately:', 'multipleOf:', 'dateAfter:', 'dateBefore:',
    'dateValid', 'dateAge:', 'dateEquals:', 'dateFormat:', 'exists', 'extractField:', 'partial:',
    'not:', 'contain:', 'startWith:', 'endWith:', 'eq:', 'ne:', 'gt:', 'lt:', 'gte:', 'lte:',
  ];

  return patternIndicators.some(indicator => str.includes(indicator));
}

/**
 * Check if a pattern is just a pattern name without a value
 * @param {string} pattern - Pattern to check
 * @returns {boolean} Whether it's just a pattern name
 */
export function isPatternNameOnly(pattern) {
  const patternNames = [
    'match:arrayLength', 'match:arrayContains', 'match:contains',
    'match:startsWith', 'match:endsWith', 'match:type', 'match:regex', 'match:length',
    'match:between', 'match:range', 'match:greaterThan', 'match:lessThan', 'match:equals',
    'match:notEquals', 'match:approximately', 'match:multipleOf', 'match:dateAfter',
    'match:dateBefore', 'match:dateAge', 'match:dateEquals', 'match:dateFormat',
    'match:extractField', 'match:partial', 'match:not',
  ];

  // Note: 'match:arrayElements' and 'match:exists' can be used without colons
  // when they are pattern object keys, so we don't include them here
  return patternNames.some(name => pattern === name);
}
