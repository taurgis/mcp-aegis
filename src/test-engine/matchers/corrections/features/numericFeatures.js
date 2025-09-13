/**
 * Numeric Features - Non-existent advanced numeric operations
 * Focuses on numeric features that don't exist in MCP Conductor
 */

/**
 * Numeric-related non-existent features
 */
export const NUMERIC_FEATURES = {
  'match:integer:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Integer validation is not supported',
    suggestion: 'Use type checking and regex patterns',
    alternatives: [
      'value: "match:type:number"',
      'value: "match:regex:^-?\\\\d+$"',
      'value: "match:decimalPlaces:0"',
    ],
    example: {
      incorrect: 'id: "match:integer"',
      correct: 'id: "match:regex:^\\\\d+$"',
    },
  },

  'match:float:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Float validation is not supported',
    suggestion: 'Use type checking and decimal patterns',
    alternatives: [
      'value: "match:type:number"',
      'value: "match:contains:."',
      'value: "match:regex:^\\\\d+\\\\.\\\\d+$"',
    ],
    example: {
      incorrect: 'price: "match:float"',
      correct: 'price: "match:type:number"',
    },
  },

  'match:positive:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Positive number validation is not supported',
    suggestion: 'Use greaterThan pattern',
    alternatives: [
      'value: "match:greaterThan:0"',
      'value: "match:greaterThanOrEqual:1"',
      'value: "match:not:lessThanOrEqual:0"',
    ],
    example: {
      incorrect: 'count: "match:positive"',
      correct: 'count: "match:greaterThan:0"',
    },
  },

  'match:negative:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Negative number validation is not supported',
    suggestion: 'Use lessThan pattern',
    alternatives: [
      'value: "match:lessThan:0"',
      'value: "match:lessThanOrEqual:-1"',
      'value: "match:not:greaterThanOrEqual:0"',
    ],
    example: {
      incorrect: 'offset: "match:negative"',
      correct: 'offset: "match:lessThan:0"',
    },
  },

  'match:even:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Even number validation is not supported',
    suggestion: 'Use modulo operations via regex or multipleOf',
    alternatives: [
      'value: "match:multipleOf:2"',
      'value: "match:regex:.*[02468]$"',
      'Use manual validation outside patterns',
    ],
    example: {
      incorrect: 'number: "match:even"',
      correct: 'number: "match:multipleOf:2"',
    },
  },

  'match:odd:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Odd number validation is not supported',
    suggestion: 'Use regex patterns or manual validation',
    alternatives: [
      'value: "match:regex:.*[13579]$"',
      'value: "match:not:multipleOf:2"',
      'Use manual validation outside patterns',
    ],
    example: {
      incorrect: 'number: "match:odd"',
      correct: 'number: "match:regex:.*[13579]$"',
    },
  },

  'match:prime:': {
    type: 'unsupported_feature',
    category: 'numeric',
    message: 'Prime number validation is not supported',
    suggestion: 'Use manual validation or specific value checks',
    alternatives: [
      'Use manual validation outside patterns',
      'Check for specific prime values',
      'Use arrayContains for known primes',
    ],
    example: {
      incorrect: 'number: "match:prime"',
      correct: 'Use manual validation or specific value checks',
    },
  },
};

/**
 * Analyze numeric feature errors
 */
export function analyzeNumericFeatures(pattern) {
  const suggestions = [];

  // Check for exact matches first
  if (NUMERIC_FEATURES[pattern]) {
    const feature = NUMERIC_FEATURES[pattern];
    suggestions.push({
      type: feature.type,
      category: feature.category,
      message: feature.message,
      suggestion: feature.suggestion,
      alternatives: feature.alternatives,
      example: feature.example,
      confidence: 'high',
    });
  }

  // Check for partial matches
  for (const [featurePattern, details] of Object.entries(NUMERIC_FEATURES)) {
    if (pattern.includes(featurePattern.replace('match:', '').replace(':', ''))) {
      suggestions.push({
        type: details.type,
        category: details.category,
        message: `Possible numeric feature attempt: ${details.message}`,
        suggestion: details.suggestion,
        alternatives: details.alternatives,
        example: details.example,
        confidence: 'medium',
        detected_pattern: featurePattern,
      });
    }
  }

  return suggestions;
}
