/**
 * Feature Corrections Index - Centralized access to all non-existent feature corrections
 * Replaces the monolithic nonExistentFeatures.js with focused, maintainable modules
 */

import { analyzeNetworkFeatures } from './networkFeatures.js';
import { analyzeValidationFeatures } from './validationFeatures.js';
import { analyzeSecurityFeatures } from './securityFeatures.js';
import { analyzeArrayFeatures } from './arrayFeatures.js';
import { analyzeNumericFeatures } from './numericFeatures.js';

/**
 * Combined feature analyzers
 */
export const FEATURE_ANALYZERS = {
  analyzeNetworkFeatures,
  analyzeValidationFeatures,
  analyzeSecurityFeatures,
  analyzeArrayFeatures,
  analyzeNumericFeatures,
};

/**
 * Analyze all non-existent features
 * Replaces the original analyzeNonExistentFeatures function
 */
export function analyzeNonExistentFeatures(pattern) {
  const allSuggestions = [];

  // Run all feature analyzers
  for (const analyzer of Object.values(FEATURE_ANALYZERS)) {
    const suggestions = analyzer(pattern);
    allSuggestions.push(...suggestions);
  }

  // Sort by confidence level (high first)
  return allSuggestions.sort((a, b) => {
    if (a.confidence === 'high' && b.confidence !== 'high') {
      return -1;
    }
    if (b.confidence === 'high' && a.confidence !== 'high') {
      return 1;
    }
    return 0;
  });
}
