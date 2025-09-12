/**
 * Network Features - Non-existent network and HTTP-related features
 * Focuses on network, HTTP, and URL validation features that don't exist in MCP Conductor
 */

import { getCategoryDescription, getAlternativesForCategory } from '../shared/categories.js';

/**
 * Network-related non-existent features
 */
export const NETWORK_FEATURES = {
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

  'match:domain:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'Domain validation patterns are not supported',
    suggestion: 'Use regex patterns to validate domain structure',
    alternatives: [
      'domain: "match:regex:^[a-zA-Z0-9.-]+\\.[a-z]{2,}$"',
      'domain: "match:contains:."',
      'domain: "match:endsWith:.com"',
    ],
    example: {
      incorrect: 'domain: "match:domain:valid"',
      correct: 'domain: "match:regex:^[a-zA-Z0-9.-]+\\.[a-z]{2,}$"',
    },
  },

  'match:ip:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'IP address validation is not supported',
    suggestion: 'Use regex patterns for IP address validation',
    alternatives: [
      'ip: "match:regex:^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$"',
      'ip: "match:contains:."',
      'ip: "match:regex:^\\d+\\."',
    ],
    example: {
      incorrect: 'ip: "match:ip:valid"',
      correct: 'ip: "match:regex:^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$"',
    },
  },

  'match:port:': {
    type: 'unsupported_feature',
    category: 'network',
    message: 'Port validation is not supported',
    suggestion: 'Use numeric comparison patterns',
    alternatives: [
      'port: "match:between:1:65535"',
      'port: "match:greaterThan:0"',
      'port: "match:type:number"',
    ],
    example: {
      incorrect: 'port: "match:port:valid"',
      correct: 'port: "match:between:1:65535"',
    },
  },
};

/**
 * Analyze network feature errors
 */
export function analyzeNetworkFeatures(pattern) {
  const suggestions = [];
  
  // Check for exact matches first
  if (NETWORK_FEATURES[pattern]) {
    const feature = NETWORK_FEATURES[pattern];
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
  for (const [featurePattern, details] of Object.entries(NETWORK_FEATURES)) {
    if (pattern.includes(featurePattern.replace('match:', '').replace(':', ''))) {
      suggestions.push({
        type: details.type,
        category: details.category,
        message: `Possible network feature attempt: ${details.message}`,
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
