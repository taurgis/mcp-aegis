/**
 * Shared Categories - Feature categorization for non-existent features
 * Provides consistent categorization across all correction modules
 */

/**
 * Feature categories for non-existent features
 */
export const FEATURE_CATEGORIES = {
  network: 'Network and HTTP-related features',
  validation: 'Data validation and format checking',
  security: 'Security and authentication features',
  array: 'Array manipulation and analysis',
  numeric: 'Advanced numeric operations',
  string: 'Advanced string operations',
  date: 'Advanced date and time operations',
  file: 'File system and I/O operations',
  extension: 'Plugin and extension system features',
  database: 'Database and query operations',
  format: 'Data format and serialization',
  crypto: 'Cryptography and hashing',
  ai: 'Artificial intelligence and ML features',
  system: 'System and environment features',
};

/**
 * Feature suggestion types
 */
export const SUGGESTION_TYPES = {
  unsupported_feature: 'Feature is not supported in MCP Aegis',
  syntax_error: 'Incorrect syntax or pattern format',
  naming_error: 'Pattern name misspelling or variation',
  type_error: 'Incorrect type specification',
  operator_error: 'Incorrect operator or symbol usage',
  regex_error: 'Regular expression syntax error',
};

/**
 * Common alternative patterns for different use cases
 */
export const COMMON_ALTERNATIVES = {
  // Network alternatives
  network: [
    'Use regex patterns for URL validation',
    'Use string patterns for protocol checking',
    'Use numeric patterns for status codes',
  ],

  // Validation alternatives
  validation: [
    'Use regex patterns for format validation',
    'Use type checking with additional patterns',
    'Use length and contains patterns',
  ],

  // Security alternatives
  security: [
    'Use regex patterns for token structure validation',
    'Use string patterns for basic format checking',
    'Use manual validation outside of pattern matching',
  ],

  // Array alternatives
  array: [
    'Use arrayLength for size validation',
    'Use arrayContains for existence checking',
    'Use crossField patterns for complex logic',
  ],

  // Numeric alternatives
  numeric: [
    'Use existing numeric comparison patterns',
    'Use regex patterns for format validation',
    'Use type checking with range validation',
  ],
};

/**
 * Get category description
 */
export function getCategoryDescription(category) {
  return FEATURE_CATEGORIES[category] || 'Unknown feature category';
}

/**
 * Get suggestion type description
 */
export function getSuggestionTypeDescription(type) {
  return SUGGESTION_TYPES[type] || 'Unknown suggestion type';
}

/**
 * Get common alternatives for a category
 */
export function getAlternativesForCategory(category) {
  return COMMON_ALTERNATIVES[category] || COMMON_ALTERNATIVES.validation;
}
