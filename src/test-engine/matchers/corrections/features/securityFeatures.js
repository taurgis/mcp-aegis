/**
 * Security Features - Non-existent security and authentication features
 * Focuses on security-related features that don't exist in MCP Conductor
 */

/**
 * Security-related non-existent features
 */
export const SECURITY_FEATURES = {
  'match:jwt:': {
    type: 'unsupported_feature',
    category: 'security',
    message: 'JWT token validation is not supported',
    suggestion: 'Use regex patterns to validate JWT structure or string patterns',
    alternatives: [
      'token: "match:regex:^[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]*$"',
      'token: "match:contains:."',
      'token: "match:split:."',
    ],
    example: {
      incorrect: 'token: "match:jwt:valid"',
      correct: 'token: "match:regex:^[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]+\\\\.[A-Za-z0-9-_]*$"',
    },
  },

  'match:hash:': {
    type: 'unsupported_feature',
    category: 'security',
    message: 'Hash validation is not supported',
    suggestion: 'Use regex patterns for hash validation',
    alternatives: [
      'hash: "match:regex:^[a-fA-F0-9]{32}$"', // MD5
      'hash: "match:regex:^[a-fA-F0-9]{64}$"', // SHA256
      'hash: "match:length:64"',
    ],
    example: {
      incorrect: 'hash: "match:hash:md5"',
      correct: 'hash: "match:regex:^[a-fA-F0-9]{32}$"',
    },
  },

  'match:password:': {
    type: 'unsupported_feature',
    category: 'security',
    message: 'Password strength validation is not supported',
    suggestion: 'Use regex patterns for password validation',
    alternatives: [
      'password: "match:regex:^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d).{8,}$"',
      'password: "match:length:8"',
      'password: "match:contains:A"',
    ],
    example: {
      incorrect: 'password: "match:password:strong"',
      correct: 'password: "match:regex:^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d).{8,}$"',
    },
  },

  'match:apiKey:': {
    type: 'unsupported_feature',
    category: 'security',
    message: 'API key validation is not supported',
    suggestion: 'Use string patterns for API key validation',
    alternatives: [
      'apiKey: "match:startsWith:sk-"',
      'apiKey: "match:length:32"',
      'apiKey: "match:regex:^[a-zA-Z0-9_-]+$"',
    ],
    example: {
      incorrect: 'apiKey: "match:apiKey:valid"',
      correct: 'apiKey: "match:startsWith:sk-"',
    },
  },
};

/**
 * Analyze security feature errors
 */
export function analyzeSecurityFeatures(pattern) {
  const suggestions = [];
  
  // Check for exact matches first
  if (SECURITY_FEATURES[pattern]) {
    const feature = SECURITY_FEATURES[pattern];
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
  for (const [featurePattern, details] of Object.entries(SECURITY_FEATURES)) {
    if (pattern.includes(featurePattern.replace('match:', '').replace(':', ''))) {
      suggestions.push({
        type: details.type,
        category: details.category,
        message: `Possible security feature attempt: ${details.message}`,
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
