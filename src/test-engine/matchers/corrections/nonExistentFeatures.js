/**
 * Non-existent Features Detection - Identifies attempts to use features that don't exist in MCP Conductor
 * Designed to catch AI agents and users trying to use patterns that sound reasonable but aren't implemented
 */

/**
 * Map of non-existent features that users/AI might attempt to use
 */
const NON_EXISTENT_FEATURES = {
  'match:httpStatus:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'HTTP status validation is not supported in MCP Conductor',
    suggestion: 'Use numeric comparison patterns for status codes',
    alternatives: [
      'status: "match:equals:200"',
      'status: "match:between:200:299"',
      'status: "match:greaterThanOrEqual:200"',
    ],
    example: {
      incorrect: 'status: "match:httpStatus:ok"',
      correct: 'status: "match:equals:200"',
    },
  },

  'match:url:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'URL validation patterns are not supported',
    suggestion: 'Use regex patterns to validate URL structure',
    alternatives: [
      'url: "match:regex:^https?://"',
      'url: "match:startsWith:https://"',
      'url: "match:contains:api.example.com"',
    ],
    example: {
      incorrect: 'url: "match:url:valid"',
      correct: 'url: "match:regex:^https?://[\\w.-]+\\.[a-z]{2,}$"',
    },
  },

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

  'match:custom:': {
    type: 'unsupported_feature',
    category: 'extension',
    message: 'Custom pattern operators are not supported',
    suggestion: 'Use available built-in patterns or combine multiple patterns',
    alternatives: [
      'Use combination of existing patterns',
      'Create multiple validation steps',
      'Use crossField patterns for complex logic',
    ],
    example: {
      incorrect: 'value: "match:custom:myValidator"',
      correct: 'value: "match:type:string"\nvalue: "match:regex:^[A-Z]"',
    },
  },

  'match:jwt:': {
    type: 'unsupported_feature',
    category: 'security',
    message: 'JWT token validation is not supported',
    suggestion: 'Use regex patterns to validate JWT structure or string patterns',
    alternatives: [
      'token: "match:regex:^[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]*$"',
      'token: "match:contains:."',
      'token: "match:split:."'
    ],
    example: {
      incorrect: 'token: "match:jwt:valid"',
      correct: 'token: "match:regex:^[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]*$"'
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
      'id: "match:contains:-"'
    ],
    example: {
      incorrect: 'id: "match:uuid:v4"',
      correct: 'id: "match:regex:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"'
    },
  },

  'match:json:': {
    type: 'unsupported_feature',
    category: 'format',
    message: 'JSON validation patterns are not supported',
    suggestion: 'Use type checking or specific field validation',
    alternatives: [
      'data: "match:type:object"',
      'data: "match:contains:{"',
      'Use nested field validation for JSON structure'
    ],
    example: {
      incorrect: 'response: "match:json:valid"',
      correct: 'response: "match:type:object"'
    },
  },

  'match:schema:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Schema validation is not supported as a pattern operator',
    suggestion: 'Use nested field validation or type checking',
    alternatives: [
      'Use nested field validation',
      'field: "match:type:string"',
      'field: "match:hasField:requiredProperty"'
    ],
    example: {
      incorrect: 'data: "match:schema:userSchema"',
      correct: 'data.name: "match:type:string"\ndata.email: "match:contains:@"'
    },
  },

  'match:format:': {
    type: 'unsupported_feature',
    category: 'validation',
    message: 'Format validation patterns are not supported',
    suggestion: 'Use regex patterns for format validation',
    alternatives: [
      'value: "match:regex:pattern"',
      'value: "match:length:10"',
      'value: "match:contains:specific-format"'
    ],
    example: {
      incorrect: 'date: "match:format:iso8601"',
      correct: 'date: "match:regex:^\\\\d{4}-\\\\d{2}-\\\\d{2}T\\\\d{2}:\\\\d{2}:\\\\d{2}"'
    },
  },
};

/**
 * Patterns that might be confused with actual features
 */
const CONFUSING_PATTERNS = {
  'match:arrayHas:': {
    actual: 'match:arrayContains:',
    message: 'Use "arrayContains" instead of "arrayHas"',
  },
  'match:arrayIncludes:': {
    actual: 'match:arrayContains:',
    message: 'Use "arrayContains" instead of "arrayIncludes"',
  },
  'match:getField:': {
    actual: 'match:extractField:',
    message: 'Use "extractField" instead of "getField"',
  },
  'match:isType:': {
    actual: 'match:type:',
    message: 'Use "type" instead of "isType"',
  },
};

/**
 * Analyze a pattern to detect non-existent features
 * @param {string} pattern - The pattern to analyze
 * @returns {Array} Array of error suggestions for non-existent features
 */
export function analyzeNonExistentFeatures(pattern) {
  const suggestions = [];

  if (!pattern || typeof pattern !== 'string') {
    return suggestions;
  }

  // Check for exact non-existent feature patterns
  for (const [nonExistentPattern, details] of Object.entries(NON_EXISTENT_FEATURES)) {
    if (pattern.startsWith(nonExistentPattern)) {
      suggestions.push({
        type: 'non_existent_feature',
        category: details.category,
        original: pattern,
        message: details.message,
        suggestion: details.suggestion,
        alternatives: details.alternatives,
        example: details.example,
        severity: 'error',
      });
      break;
    }
  }

  // Check for confusing pattern variations
  for (const [confusingPattern, details] of Object.entries(CONFUSING_PATTERNS)) {
    if (pattern.startsWith(confusingPattern)) {
      suggestions.push({
        type: 'confusing_pattern',
        original: pattern,
        corrected: pattern.replace(confusingPattern, details.actual),
        message: details.message,
        suggestion: `Replace "${confusingPattern}" with "${details.actual}"`,
        severity: 'warning',
      });
      break;
    }
  }

  // Check for patterns that sound like they should exist but don't
  const soundsLikePatterns = [
    {
      regex: /^match:(validate|check|verify|test|ensure):/,
      message: 'Validation keywords are not supported as pattern operators',
      suggestion: 'Use specific validation patterns like "type:", "regex:", "contains:", etc.',
    },
    {
      regex: /^match:(is|has|can|should|must):/,
      message: 'Boolean-style operators are not supported',
      suggestion: 'Use specific patterns like "exists", "type:", "arrayContains:", etc.',
    },
  ];

  for (const check of soundsLikePatterns) {
    if (check.regex.test(pattern)) {
      suggestions.push({
        type: 'sounds_like_feature',
        original: pattern,
        message: check.message,
        suggestion: check.suggestion,
        severity: 'error',
      });
      break;
    }
  }

  return suggestions;
}
