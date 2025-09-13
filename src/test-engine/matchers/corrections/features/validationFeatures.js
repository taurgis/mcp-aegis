/**
 * Validation Features - Non-existent validation and format checking features
 * Focuses on data validation features that don't exist in MCP Conductor
 */

/**
 * Validation-related non-existent features
 */
export const VALIDATION_FEATURES = {
  'match:email:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Email validation patterns are not supported',
    suggestion: 'Use regex patterns to validate email structure',
    alternatives: [
      'email: "match:regex:^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$"',
      'email: "match:contains:@"',
      'email: "match:endsWith:.com"',
    ],
    example: {
      incorrect: 'email: "match:email:valid"',
      correct: 'email: "match:regex:^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$"',
    },
  },

  'match:uuid:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'UUID validation patterns are not supported',
    suggestion: 'Use regex patterns to validate UUID structure',
    alternatives: [
      'id: "match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"',
      'id: "match:length:36"',
      'id: "match:contains:-"',
    ],
    example: {
      incorrect: 'id: "match:uuid:valid"',
      correct: 'id: "match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"',
    },
  },

  'match:phone:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Phone number validation is not supported',
    suggestion: 'Use regex patterns for phone number validation',
    alternatives: [
      'phone: "match:regex:^\\+?[1-9]\\d{1,14}$"',
      'phone: "match:contains:+"',
      'phone: "match:length:10"',
    ],
    example: {
      incorrect: 'phone: "match:phone:valid"',
      correct: 'phone: "match:regex:^\\+?[1-9]\\d{1,14}$"',
    },
  },

  'match:creditCard:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Credit card validation is not supported',
    suggestion: 'Use regex patterns for credit card validation',
    alternatives: [
      'card: "match:regex:^[0-9]{13,19}$"',
      'card: "match:length:16"',
      'card: "match:type:string"',
    ],
    example: {
      incorrect: 'card: "match:creditCard:valid"',
      correct: 'card: "match:regex:^[0-9]{13,19}$"',
    },
  },

  'match:empty:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Empty validation is not supported',
    suggestion: 'Use length or arrayLength patterns',
    alternatives: [
      'value: "match:arrayLength:0"',
      'value: "match:length:0"',
      'value: "match:count:0"',
    ],
    example: {
      incorrect: 'items: "match:empty"',
      correct: 'items: "match:arrayLength:0"',
    },
  },

  'match:notEmpty:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Not empty validation is not supported',
    suggestion: 'Use length or arrayLength patterns with negation',
    alternatives: [
      'value: "match:not:arrayLength:0"',
      'value: "match:not:length:0"',
      'value: "match:greaterThan:0"',
    ],
    example: {
      incorrect: 'items: "match:notEmpty"',
      correct: 'items: "match:not:arrayLength:0"',
    },
  },
};

/**
 * Analyze validation feature errors
 */
export function analyzeValidationFeatures(pattern) {
  const suggestions = [];

  // Check for exact matches first
  if (VALIDATION_FEATURES[pattern]) {
    const feature = VALIDATION_FEATURES[pattern];
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
  for (const [featurePattern, details] of Object.entries(VALIDATION_FEATURES)) {
    if (pattern.includes(featurePattern.replace('match:', '').replace(':', ''))) {
      suggestions.push({
        type: details.type,
        category: details.category,
        message: `Possible validation feature attempt: ${details.message}`,
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
