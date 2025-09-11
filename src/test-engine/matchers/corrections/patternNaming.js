/**
 * Pattern naming corrections - handles misspellings and naming variations
 * Follows single responsibility principle - only concerned with pattern name corrections
 *
 * This module provides comprehensive debugging assistance for YAML pattern development
 * by correcting common naming errors and providing helpful suggestions.
 */

/**
 * All available patterns in MCP Conductor (29+ patterns)
 * Used for intelligent error suggestions and debugging assistance
 */
export const AVAILABLE_PATTERNS = {
  // Core patterns (deep equality, type validation)
  core: ['type', 'exists', 'length', 'count'],

  // String patterns (8 patterns)
  string: ['regex', 'contains', 'containsIgnoreCase', 'startsWith', 'endsWith', 'equalsIgnoreCase'],

  // Array patterns (3 patterns)
  array: ['arrayLength', 'arrayContains', 'arrayElements'],

  // Numeric patterns (10 patterns)
  numeric: ['greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'range', 'equals', 'notEquals', 'approximately', 'multipleOf', 'divisibleBy', 'decimalPlaces'],

  // Date patterns (8 patterns)
  date: ['dateValid', 'dateAfter', 'dateBefore', 'dateBetween', 'dateAge', 'dateEquals', 'dateFormat'],

  // Complex patterns (field extraction, partial matching, negation)
  complex: ['extractField', 'partial', 'not'],
};

/**
 * Get all pattern names as a flat array
 */
export const ALL_PATTERN_NAMES = Object.values(AVAILABLE_PATTERNS).flat();

/**
 * Pattern naming error corrections with enhanced debugging messages
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
  'match:contain:': 'match:contains:', // Fix missing 's'
  'match:startWith:': 'match:startsWith:', // Fix missing 's'
  'match:endWith:': 'match:endsWith:', // Fix missing 's'

  // Missing match: prefix (all 29+ patterns)
  'arrayLength:': 'match:arrayLength:',
  'arrayContains:': 'match:arrayContains:',
  'arrayElements:': 'match:arrayElements:',
  'contains:': 'match:contains:',
  'containsIgnoreCase:': 'match:containsIgnoreCase:',
  'equalsIgnoreCase:': 'match:equalsIgnoreCase:',
  'startsWith:': 'match:startsWith:',
  'endsWith:': 'match:endsWith:',
  'type:': 'match:type:',
  'regex:': 'match:regex:',
  'regexp:': 'match:regex:', // Common regex alias
  'length:': 'match:length:',
  'between:': 'match:between:',
  'range:': 'match:range:',
  'greaterThan:': 'match:greaterThan:',
  'greaterThanOrEqual:': 'match:greaterThanOrEqual:',
  'lessThan:': 'match:lessThan:',
  'lessThanOrEqual:': 'match:lessThanOrEqual:',
  'equals:': 'match:equals:',
  'notEquals:': 'match:notEquals:',
  'approximately:': 'match:approximately:',
  'multipleOf:': 'match:multipleOf:',
  'divisibleBy:': 'match:divisibleBy:',
  'decimalPlaces:': 'match:decimalPlaces:',
  'dateAfter:': 'match:dateAfter:',
  'dateBefore:': 'match:dateBefore:',
  'dateBetween:': 'match:dateBetween:',
  'dateValid': 'match:dateValid',
  'dateAge:': 'match:dateAge:',
  'dateEquals:': 'match:dateEquals:',
  'dateFormat:': 'match:dateFormat:',
  'exists': 'match:exists',
  'extractField:': 'match:extractField:',
  'partial:': 'match:partial:',
  'not:': 'match:not:',

  // Common misspellings and aliases
  'match:aproximate:': 'match:approximately:',
  'match:aproximately:': 'match:approximately:',
  'match:multiple:': 'match:multipleOf:',
  'match:divisible:': 'match:divisibleBy:',
  'match:modulo:': 'match:multipleOf:',
  'match:mod:': 'match:multipleOf:',
  'match:regexp:': 'match:regex:',
  'match:regular:': 'match:regex:',
  'match:greater:': 'match:greaterThan:',
  'match:less:': 'match:lessThan:',
  'match:gt:': 'match:greaterThan:',
  'match:lt:': 'match:lessThan:',
  'match:gte:': 'match:greaterThanOrEqual:',
  'match:lte:': 'match:lessThanOrEqual:',
  'match:ge:': 'match:greaterThanOrEqual:',
  'match:le:': 'match:lessThanOrEqual:',
  'match:eq:': 'match:equals:',
  'match:ne:': 'match:notEquals:',
  'match:equal:': 'match:equals:',
  'match:notEqual:': 'match:notEquals:',
  'match:neq:': 'match:notEquals:',
  'match:inRange:': 'match:between:',
  'match:in:': 'match:arrayContains:',
  'match:hasField:': 'match:exists:',
  'match:fieldExists:': 'match:exists:',
  'match:hasProperty:': 'match:exists:',
  'match:propertyExists:': 'match:exists:',
  'match:arraySize:': 'match:arrayLength:',
  'match:arrayCount:': 'match:arrayLength:',
  'match:size:': 'match:arrayLength:',
  'match:count:': 'match:length:',
  'match:countProperties:': 'match:count:',
  'match:objectCount:': 'match:count:',
  'match:substr:': 'match:contains:',
  'match:substring:': 'match:contains:',
  'match:beginsWith:': 'match:startsWith:',
  'match:prefix:': 'match:startsWith:',
  'match:suffix:': 'match:endsWith:',
  'match:finishWith:': 'match:endsWith:',
  'match:finishesWith:': 'match:endsWith:',
  'match:validDate:': 'match:dateValid:',
  'match:isValidDate:': 'match:dateValid:',
  'match:dateIsValid:': 'match:dateValid:',
  'match:after:': 'match:dateAfter:',
  'match:before:': 'match:dateBefore:',
  'match:newer:': 'match:dateAfter:',
  'match:older:': 'match:dateBefore:',
  'match:age:': 'match:dateAge:',
  'match:recent:': 'match:dateAge:',
  'match:dateWithin:': 'match:dateAge:',
  'match:sameDate:': 'match:dateEquals:',
  'match:equalDate:': 'match:dateEquals:',
  'match:extract:': 'match:extractField:',
  'match:field:': 'match:extractField:',
  'match:getField:': 'match:extractField:',
  'match:pluck:': 'match:extractField:',
  'match:select:': 'match:extractField:',
  'match:pick:': 'match:extractField:',
  'match:partialMatch:': 'match:partial:',
  'match:subset:': 'match:partial:',
  'match:include:': 'match:partial:',
  'match:negate:': 'match:not:',
  'match:invert:': 'match:not:',
  'match:opposite:': 'match:not:',
  'match:reverse:': 'match:not:',
  'match:exclude:': 'match:not:',
};

/**
 * Complex pattern naming corrections with regex patterns and enhanced debugging
 */
export const PATTERN_NAMING_REGEX_CORRECTIONS = {
  // Misspelling with regex patterns
  'match:lenght:': {
    pattern: /^lenght:(\d+)$/,
    correction: (match, num) => `length:${num}`,
    message: 'Misspelling: use "length" instead of "lenght"',
    category: 'misspelling',
  },
  'match:aproximately:': {
    pattern: /^aproximately:(.+)$/,
    correction: (match, value) => `approximately:${value}`,
    message: 'Misspelling: use "approximately" instead of "aproximately"',
    category: 'misspelling',
  },
  // Array contains with field specification
  'match:arrayContains:name:': {
    pattern: /^arrayContains:([^:]+):(.*)$/,
    correction: (match, field, value) => `arrayContains:${field}:${value}`,
    message: 'Use format "match:arrayContains:fieldName:expectedValue" for object field matching',
    category: 'syntax',
  },
  // Common parameter format errors
  'match:between:': {
    pattern: /^between:([^:]+)$/,
    correction: (match, value) => `between:${value}:${value}`,
    message: 'Between pattern requires two values: "match:between:MIN:MAX"',
    category: 'syntax',
    suggestion: 'Example: "match:between:10:20" for values between 10 and 20',
  },
  'match:approximately:': {
    pattern: /^approximately:([^:]+)$/,
    correction: (match, value) => `approximately:${value}:0.1`,
    message: 'Approximately pattern requires value and tolerance: "match:approximately:VALUE:TOLERANCE"',
    category: 'syntax',
    suggestion: 'Example: "match:approximately:100:5" for 100 ± 5',
  },
  'match:dateBetween:': {
    pattern: /^dateBetween:([^:]+)$/,
    correction: (match, value) => `dateBetween:${value}:${value}`,
    message: 'DateBetween pattern requires start and end dates: "match:dateBetween:START:END"',
    category: 'syntax',
    suggestion: 'Example: "match:dateBetween:2023-01-01:2023-12-31"',
  },
  // Wrong operator symbols (programmer habits)
  'match:>': {
    pattern: /^>:?(.*)$/,
    correction: (match, value) => `greaterThan:${value}`,
    message: 'Use "match:greaterThan:VALUE" instead of "match:>"',
    category: 'syntax',
  },
  'match:<': {
    pattern: /^<:?(.*)$/,
    correction: (match, value) => `lessThan:${value}`,
    message: 'Use "match:lessThan:VALUE" instead of "match:<"',
    category: 'syntax',
  },
  'match:>=': {
    pattern: /^>=:?(.*)$/,
    correction: (match, value) => `greaterThanOrEqual:${value}`,
    message: 'Use "match:greaterThanOrEqual:VALUE" instead of "match:>="',
    category: 'syntax',
  },
  'match:<=': {
    pattern: /^<=:?(.*)$/,
    correction: (match, value) => `lessThanOrEqual:${value}`,
    message: 'Use "match:lessThanOrEqual:VALUE" instead of "match:<="',
    category: 'syntax',
  },
  'match:==': {
    pattern: /^==:?(.*)$/,
    correction: (match, value) => `equals:${value}`,
    message: 'Use "match:equals:VALUE" instead of "match:=="',
    category: 'syntax',
  },
  'match:!=': {
    pattern: /^!=:?(.*)$/,
    correction: (match, value) => `notEquals:${value}`,
    message: 'Use "match:notEquals:VALUE" instead of "match:!="',
    category: 'syntax',
  },
  // Missing colons (common YAML syntax errors)
  'match:type': {
    pattern: /^type\s+(.+)$/,
    correction: (match, type) => `type:${type}`,
    message: 'Pattern syntax requires colon: "match:type:TYPE"',
    category: 'syntax',
    suggestion: 'Example: "match:type:string" not "match:type string"',
  },
  'match:contains': {
    pattern: /^contains\s+(.+)$/,
    correction: (match, value) => `contains:${value}`,
    message: 'Pattern syntax requires colon: "match:contains:VALUE"',
    category: 'syntax',
  },
  // Common alias patterns that need correction
  'match:greater:': {
    pattern: /^greater:(.*)$/,
    correction: (match, value) => `greaterThan:${value}`,
    message: 'Use "match:greaterThan:VALUE" instead of "match:greater:VALUE"',
    category: 'alias',
  },
  'match:contain:': {
    pattern: /^contain:(.*)$/,
    correction: (match, value) => `contains:${value}`,
    message: 'Use "match:contains:VALUE" instead of "match:contain:VALUE"',
    category: 'alias',
  },
  'match:less:': {
    pattern: /^less:(.*)$/,
    correction: (match, value) => `lessThan:${value}`,
    message: 'Use "match:lessThan:VALUE" instead of "match:less:VALUE"',
    category: 'alias',
  },
  'match:equal:': {
    pattern: /^equal:(.*)$/,
    correction: (match, value) => `equals:${value}`,
    message: 'Use "match:equals:VALUE" instead of "match:equal:VALUE"',
    category: 'alias',
  },
  'match:start:': {
    pattern: /^start:(.*)$/,
    correction: (match, value) => `startsWith:${value}`,
    message: 'Use "match:startsWith:VALUE" instead of "match:start:VALUE"',
    category: 'alias',
  },
  'match:end:': {
    pattern: /^end:(.*)$/,
    correction: (match, value) => `endsWith:${value}`,
    message: 'Use "match:endsWith:VALUE" instead of "match:end:VALUE"',
    category: 'alias',
  },
  // Date format shortcuts
  'match:today': {
    pattern: /^today$/,
    correction: () => 'dateAge:1d',
    message: 'Use "match:dateAge:1d" for dates within today',
    category: 'alias',
  },
  'match:recent': {
    pattern: /^recent$/,
    correction: () => 'dateAge:7d',
    message: 'Use "match:dateAge:7d" for recent dates (within 7 days)',
    category: 'alias',
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
    'containsIgnoreCase:', 'equalsIgnoreCase:', 'greaterThanOrEqual:', 'lessThanOrEqual:',
    'dateBetween:', 'divisibleBy:', 'decimalPlaces:',
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
    'match:extractField', 'match:partial', 'match:not', 'match:containsIgnoreCase',
    'match:equalsIgnoreCase', 'match:greaterThanOrEqual', 'match:lessThanOrEqual',
    'match:dateBetween', 'match:divisibleBy', 'match:decimalPlaces',
  ];

  // Note: 'match:arrayElements' and 'match:exists' can be used without colons
  // when they are pattern object keys, so we don't include them here
  return patternNames.some(name => pattern === name);
}

/**
 * Calculate string similarity using Levenshtein distance for fuzzy matching
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Similarity score (0-1, higher is more similar)
 */
function stringSimilarity(a, b) {
  if (a === b) {
    return 1;
  }
  if (a.length === 0) {
    return 0;
  }
  if (b.length === 0) {
    return 0;
  }

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }

  const maxLength = Math.max(a.length, b.length);
  return (maxLength - matrix[b.length][a.length]) / maxLength;
}

/**
 * Find the most similar pattern names for debugging suggestions
 * @param {string} invalidPattern - The invalid pattern name
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {Array<{pattern: string, similarity: number, category: string}>} Suggested patterns
 */
export function findSimilarPatterns(invalidPattern, maxSuggestions = 5) {
  // Remove 'match:' prefix for comparison if present
  const cleanPattern = invalidPattern.replace(/^match:/, '');

  const suggestions = [];

  // Check against all available patterns
  for (const [category, patterns] of Object.entries(AVAILABLE_PATTERNS)) {
    for (const pattern of patterns) {
      const similarity = stringSimilarity(cleanPattern, pattern);
      if (similarity > 0.3) { // Only suggest if reasonably similar
        suggestions.push({
          pattern: `match:${pattern}`,
          similarity,
          category,
        });
      }
    }
  }

  // Sort by similarity (highest first) and return top suggestions
  return suggestions
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxSuggestions);
}

/**
 * Analyze a pattern and provide comprehensive debugging information
 * @param {string} pattern - The pattern to analyze
 * @returns {Object} Debugging information including suggestions, errors, and examples
 */
export function analyzePattern(pattern) {
  const result = {
    original: pattern,
    isValid: false,
    errors: [],
    suggestions: [],
    category: 'unknown',
    examples: [],
    corrected: null,
  };

  // Check if it's a valid pattern (starts with 'match:')
  if (!pattern.startsWith('match:')) {
    result.errors.push('Pattern must start with "match:" prefix');
    if (isLikelyPattern(pattern)) {
      result.corrected = `match:${pattern}`;
      result.suggestions.push({
        type: 'prefix',
        text: `Add "match:" prefix: "${result.corrected}"`,
        confidence: 0.9,
      });
    }
  }

  // Check for exact corrections first
  if (PATTERN_NAMING_CORRECTIONS[pattern]) {
    result.corrected = PATTERN_NAMING_CORRECTIONS[pattern];
    result.suggestions.push({
      type: 'correction',
      text: `Use correct spelling: "${result.corrected}"`,
      confidence: 1.0,
    });
  }

  // Check for regex-based corrections
  for (const [keyPrefix, correction] of Object.entries(PATTERN_NAMING_REGEX_CORRECTIONS)) {
    // Remove 'match:' from both pattern and key for comparison
    const cleanPattern = pattern.replace(/^match:/, '');
    const cleanKey = keyPrefix.replace(/^match:/, '');
    
    if (cleanPattern.startsWith(cleanKey)) {
      const match = cleanPattern.match(correction.pattern);
      if (match) {
        result.corrected = `match:${correction.correction(...match)}`;
        result.suggestions.push({
          type: 'regex_correction',
          text: correction.message,
          suggestion: result.corrected,
          confidence: 0.9,
          example: correction.suggestion,
        });
        break; // Use first matching correction
      }
    }
  }

  // Determine pattern category and validity
  let patternToCheck = pattern.replace(/^match:/, '').split(':')[0];
  
  // If we have a correction, use the corrected pattern for category detection
  if (result.corrected) {
    patternToCheck = result.corrected.replace(/^match:/, '').split(':')[0];
  }
  
  for (const [category, patterns] of Object.entries(AVAILABLE_PATTERNS)) {
    if (patterns.includes(patternToCheck)) {
      result.category = category;
      result.isValid = true;
      break;
    }
  }

  // If pattern starts with match: but isn't recognized, check if it's close to a valid pattern
  if (pattern.startsWith('match:') && !result.isValid && !result.corrected) {
    // Find similar patterns for fuzzy matching
    const similarPatterns = findSimilarPatterns(pattern, 3);
    for (const similar of similarPatterns) {
      result.suggestions.push({
        type: 'similar',
        text: `Did you mean "${similar.pattern}"?`,
        confidence: similar.similarity,
        category: similar.category,
      });
    }
  }

  // Special handling for patterns without match: prefix
  if (!pattern.startsWith('match:')) {
    const similarPatterns = findSimilarPatterns(pattern, 3);
    for (const similar of similarPatterns) {
      result.suggestions.push({
        type: 'similar',
        text: `Did you mean "${similar.pattern}"?`,
        confidence: similar.similarity,
        category: similar.category,
      });
    }
  }

  // Add category-specific examples
  result.examples = getPatternExamples(result.category);

  return result;
}

/**
 * Get example patterns for a specific category
 * @param {string} category - Pattern category
 * @returns {Array<string>} Example patterns
 */
function getPatternExamples(category) {
  const examples = {
    core: [
      '"match:type:string"',
      '"match:exists"',
      '"match:length:10"',
      '"match:count:5"',
    ],
    string: [
      '"match:contains:error"',
      '"match:startsWith:Hello"',
      '"match:endsWith:.json"',
      '"match:regex:\\\\d+"',
      '"match:containsIgnoreCase:SUCCESS"',
    ],
    array: [
      '"match:arrayLength:3"',
      '"match:arrayContains:value"',
      '"match:arrayContains:name:tool_name"',
      'tools:\n  match:arrayElements:\n    name: "match:type:string"',
    ],
    numeric: [
      '"match:greaterThan:100"',
      '"match:between:10:20"',
      '"match:approximately:99.5:0.1"',
      '"match:multipleOf:5"',
      '"match:decimalPlaces:2"',
    ],
    date: [
      '"match:dateValid"',
      '"match:dateAfter:2023-01-01"',
      '"match:dateAge:7d"',
      '"match:dateFormat:iso"',
    ],
    complex: [
      'match:extractField: "tools.*.name"\nvalue: ["tool1", "tool2"]',
      'match:partial:\n  status: "success"',
      '"match:not:contains:error"',
    ],
    unknown: [
      '"match:type:string"',
      '"match:contains:value"',
      '"match:arrayLength:1"',
    ],
  };

  return examples[category] || examples.unknown;
}

/**
 * Generate helpful error message for pattern debugging
 * @param {string} pattern - The problematic pattern
 * @param {string} context - Additional context (optional)
 * @returns {string} Formatted error message with suggestions
 */
export function generatePatternErrorMessage(pattern, context = '') {
  const analysis = analyzePattern(pattern);
  let message = `❌ Pattern Error: "${pattern}"\n\n`;

  if (analysis.errors.length > 0) {
    message += '🔍 Issues Found:\n';
    analysis.errors.forEach(error => {
      message += `  • ${error}\n`;
    });
    message += '\n';
  }

  if (analysis.suggestions.length > 0) {
    message += '💡 Suggestions:\n';
    analysis.suggestions.forEach((suggestion, index) => {
      const confidence = Math.round(suggestion.confidence * 100);
      message += `  ${index + 1}. ${suggestion.text}`;
      if (suggestion.confidence < 1.0) {
        message += ` (${confidence}% confidence)`;
      }
      if (suggestion.example) {
        message += `\n     Example: ${suggestion.example}`;
      }
      message += '\n';
    });
    message += '\n';
  }

  if (analysis.examples.length > 0) {
    message += `📚 ${analysis.category.charAt(0).toUpperCase() + analysis.category.slice(1)} Pattern Examples:\n`;
    analysis.examples.forEach(example => {
      message += `  • ${example}\n`;
    });
    message += '\n';
  }

  message += '📖 See documentation: https://conductor.rhino-inquisitor.com/#/pattern-matching/overview\n';

  if (context) {
    message += `\n🔧 Context: ${context}`;
  }

  return message;
}
