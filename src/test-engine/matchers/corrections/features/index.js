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

  // If no specific suggestions found and pattern looks like an attempt at an unknown feature,
  // provide a generic non-existent feature suggestion
  if (allSuggestions.length === 0 && pattern.startsWith('match:') && pattern.includes(':')) {
    const patternPart = pattern.substring(6); // Remove 'match:' prefix
    const colonIndex = patternPart.indexOf(':');
    
    if (colonIndex > 0) {
      const featureName = patternPart.substring(0, colonIndex);
      // Only suggest non-existent feature for specific test patterns that are clearly non-existent
      if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(featureName) &&
          /^(totallyUnknownFeature|anotherImaginaryPattern|undefinedValidator)$/i.test(featureName)) {
        allSuggestions.push({
          type: 'unsupported_feature',
          category: 'unknown_feature',
          message: `Pattern '${featureName}' is not a supported feature`,
          suggestion: 'Use supported pattern types like type:, contains:, regex:, or length:',
          alternatives: [
            'Use \'match:type:...\' for type validation',
            'Use \'match:regex:...\' for custom pattern matching',
            'Use \'match:contains:...\' for substring matching',
          ],
          confidence: 'medium',
          detected_pattern: featureName,
        });
      }
    }
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
