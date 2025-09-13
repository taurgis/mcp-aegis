/**
 * Array Features - Non-existent array manipulation and analysis features
 * Focuses on array-related features that don't exist in MCP Conductor
 */

/**
 * Array-related non-existent features
 */
export const ARRAY_FEATURES = {
  'match:unique:': {
    type: 'unsupported_feature',
    category: 'array',
    message: 'Array uniqueness validation is not supported',
    suggestion: 'Use crossField patterns or manual validation',
    alternatives: [
      'Use crossField patterns for uniqueness validation',
      'Validate specific duplicate scenarios',
      'Use arrayContains with negation',
    ],
    example: {
      incorrect: 'ids: "match:unique"',
      correct: 'Use manual validation or crossField patterns',
    },
  },

  'match:sorted:': {
    type: 'unsupported_feature',
    category: 'array',
    message: 'Array sorting validation is not supported',
    suggestion: 'Use crossField patterns for order validation',
    alternatives: [
      'Use crossField patterns for order checking',
      'Validate specific element relationships',
      'Use manual comparison logic',
    ],
    example: {
      incorrect: 'scores: "match:sorted:asc"',
      correct: 'Use crossField patterns for order validation',
    },
  },

  'match:min:': {
    type: 'unsupported_feature',
    category: 'array',
    message: 'Array minimum value validation is not supported',
    suggestion: 'Use individual element validation or crossField patterns',
    alternatives: [
      'Use arrayElements for individual validation',
      'Use crossField patterns for min/max logic',
      'Use greaterThan on specific indices',
    ],
    example: {
      incorrect: 'values: "match:min:0"',
      correct: 'values: { match:arrayElements: { value: "match:greaterThan:0" } }',
    },
  },

  'match:max:': {
    type: 'unsupported_feature',
    category: 'array',
    message: 'Array maximum value validation is not supported',
    suggestion: 'Use individual element validation or crossField patterns',
    alternatives: [
      'Use arrayElements for individual validation',
      'Use crossField patterns for min/max logic',
      'Use lessThan on specific indices',
    ],
    example: {
      incorrect: 'values: "match:max:100"',
      correct: 'values: { match:arrayElements: { value: "match:lessThan:100" } }',
    },
  },

  'match:sum:': {
    type: 'unsupported_feature',
    category: 'array',
    message: 'Array sum validation is not supported',
    suggestion: 'Use crossField patterns or manual calculation',
    alternatives: [
      'Use crossField patterns for sum calculation',
      'Validate individual elements instead',
      'Use manual validation outside patterns',
    ],
    example: {
      incorrect: 'totals: "match:sum:100"',
      correct: 'Use crossField patterns or manual validation',
    },
  },

  'match:average:': {
    type: 'unsupported_feature',
    category: 'array',
    message: 'Array average validation is not supported',
    suggestion: 'Use crossField patterns or manual calculation',
    alternatives: [
      'Use crossField patterns for average calculation',
      'Validate individual elements instead',
      'Use manual validation outside patterns',
    ],
    example: {
      incorrect: 'scores: "match:average:85"',
      correct: 'Use crossField patterns or manual validation',
    },
  },
};

/**
 * Analyze array feature errors
 */
export function analyzeArrayFeatures(pattern) {
  const suggestions = [];

  // Check for exact matches first
  if (ARRAY_FEATURES[pattern]) {
    const feature = ARRAY_FEATURES[pattern];
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
  for (const [featurePattern, details] of Object.entries(ARRAY_FEATURES)) {
    if (pattern.includes(featurePattern.replace('match:', '').replace(':', ''))) {
      suggestions.push({
        type: details.type,
        category: details.category,
        message: `Possible array feature attempt: ${details.message}`,
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
