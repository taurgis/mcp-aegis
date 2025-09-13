/**
 * Shared Pattern Definitions - Centralized pattern definitions to avoid duplication
 * Used across all correction modules for consistency and maintenance
 */

/**
 * All available patterns in MCP Conductor (31+ patterns)
 * Single source of truth for pattern validation and corrections
 */
export const AVAILABLE_PATTERNS = {
  // Core patterns (deep equality, type validation)
  core: ['type', 'exists', 'length', 'count'],

  // String patterns (6 patterns)
  string: ['regex', 'contains', 'containsIgnoreCase', 'startsWith', 'endsWith', 'equalsIgnoreCase'],

  // Array patterns (3 patterns)
  array: ['arrayLength', 'arrayContains', 'arrayElements'],

  // Numeric patterns (12 patterns)
  numeric: ['greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'range', 'equals', 'notEquals', 'approximately', 'multipleOf', 'divisibleBy', 'decimalPlaces'],

  // Date patterns (7 patterns)
  date: ['dateValid', 'dateAfter', 'dateBefore', 'dateBetween', 'dateAge', 'dateEquals', 'dateFormat'],

  // Complex patterns (field extraction, partial matching, negation, cross-field validation)
  complex: ['extractField', 'partial', 'not', 'crossField'],
};

/**
 * Get all pattern names as a flat array
 */
export const ALL_PATTERN_NAMES = Object.values(AVAILABLE_PATTERNS).flat();

/**
 * Valid pattern operators with descriptions
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
  'arrayElements': 'All array elements match pattern (object-based pattern)',

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
  'crossField': 'Cross-field validation (compare fields within same object)',
};

/**
 * Common pattern examples for suggestions
 */
export const PATTERN_EXAMPLES = {
  // String examples
  string: ['match:contains:example', 'match:startsWith:prefix', 'match:regex:^[A-Z][a-z]+$'],

  // Numeric examples
  numeric: ['match:equals:42', 'match:greaterThan:0', 'match:between:1:100'],

  // Array examples
  array: ['match:arrayLength:5', 'match:arrayContains:value', 'match:arrayElements:'],

  // Type examples
  type: ['match:type:string', 'match:type:number', 'match:type:array'],

  // Date examples
  date: ['match:dateValid', 'match:dateAfter:2023-01-01', 'match:dateAge:7d'],

  // Complex examples
  complex: ['match:extractField:tools.*.name', 'match:partial:', 'match:crossField:startDate < endDate'],

  // Default fallback
  default: ['match:equals:value', 'match:type:string'],
};

/**
 * Check if a string is a valid pattern name
 */
export function isValidPattern(pattern) {
  return ALL_PATTERN_NAMES.includes(pattern);
}

/**
 * Get pattern category for a given pattern
 */
export function getPatternCategory(pattern) {
  for (const [category, patterns] of Object.entries(AVAILABLE_PATTERNS)) {
    if (patterns.includes(pattern)) {
      return category;
    }
  }
  return 'unknown';
}

/**
 * Get examples for a specific data type
 */
export function getExamplesForType(type) {
  return PATTERN_EXAMPLES[type] || PATTERN_EXAMPLES.default;
}
