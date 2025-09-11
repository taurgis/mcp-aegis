/**
 * Syntax Analyzer - Orchestrates syntax error detection and correction
 * Refactored for modularity, extensibility, and KISS principles
 * Follows single responsibility principle - orchestrates different analysis modules
 */

import { SYNTAX_CORRECTIONS } from './corrections/index.js';
import { analyzePatternSpecificErrors } from './analyzers/patternAnalyzer.js';
import { analyzeStructureErrors } from './analyzers/structureAnalyzer.js';
import { detectAntiPatterns } from './analyzers/antiPatternDetector.js';
import { formatSuggestions } from './utils/formatters.js';

/**
 * Analyze pattern for syntax errors and suggest corrections
 * @param {string} pattern - The pattern string to analyze
 * @param {Object} context - Additional context (yamlStructure, actualValue, etc.)
 * @returns {Object} Analysis result with suggestions
 */
export function analyzeSyntaxErrors(pattern, context = {}) {
  const suggestions = [];

  if (typeof pattern !== 'string') {
    return { hasSyntaxErrors: false, suggestions: [] };
  }

  // First, check for pattern-specific errors (more detailed analysis)
  const patternSpecificErrors = analyzePatternSpecificErrors(pattern);
  suggestions.push(...patternSpecificErrors);

  // Then check for direct string replacements in SYNTAX_CORRECTIONS
  let foundDirectReplacement = false;

  // Check all syntax corrections
  for (const [errorPattern, correction] of Object.entries(SYNTAX_CORRECTIONS)) {
    if (typeof correction === 'string') {
      // Exact match replacements
      if (pattern === errorPattern) {
        suggestions.push({
          type: 'direct_replacement',
          original: errorPattern,
          corrected: correction,
          pattern: correction,
          message: `Replace "${errorPattern}" with "${correction}"`,
        });
        foundDirectReplacement = true;
        break;
      }
      // For patterns that should start with match:, check if they don't have the prefix
      if (errorPattern.endsWith(':') && pattern.startsWith('match:')) {
        continue; // This pattern already has match: prefix, skip this correction
      }
      // Check if pattern contains the error pattern (for missing prefix cases)
      if (pattern.includes(errorPattern) && !pattern.startsWith('match:') && !foundDirectReplacement) {
        suggestions.push({
          type: 'direct_replacement',
          original: errorPattern,
          corrected: correction,
          pattern: pattern.replace(errorPattern, correction),
          message: `Replace "${errorPattern}" with "${correction}"`,
        });
        foundDirectReplacement = true;
        break;
      }
    }
  }

  // Check for regex-based corrections if no direct replacement found
  if (!foundDirectReplacement) {
    for (const [_errorPattern, correction] of Object.entries(SYNTAX_CORRECTIONS)) {
      if (typeof correction === 'object' && correction.pattern) {
        // Handle regex-based corrections
        const patternWithoutMatch = pattern.replace(/^match:/, '');
        const match = patternWithoutMatch.match(correction.pattern);
        if (match) {
          const correctedPattern = correction.correction(...match);
          suggestions.push({
            type: 'regex_replacement',
            original: pattern,
            corrected: `match:${correctedPattern}`,
            pattern: `match:${correctedPattern}`,
            message: correction.message,
          });
          foundDirectReplacement = true;
          break;
        }
      }
    }
  }

  // Check for structure errors if context is provided
  if (context.yamlContext) {
    const structureErrors = analyzeStructureErrors(context.yamlContext);
    suggestions.push(...structureErrors);
  }

  return {
    hasSyntaxErrors: suggestions.length > 0,
    suggestions,
  };
}

/**
 * Generate enhanced error message with syntax corrections
 * @param {string} originalError - Original error message
 * @param {string} pattern - The pattern that failed
 * @param {*} actualValue - The actual value
 * @param {Object} context - Additional context
 * @returns {Object} Enhanced error with syntax suggestions
 */
export function enhanceErrorWithSyntaxSuggestions(originalError, pattern, actualValue, context = {}) {
  const syntaxAnalysis = analyzeSyntaxErrors(pattern, context);

  if (!syntaxAnalysis.hasSyntaxErrors) {
    return {
      message: originalError,
      suggestions: [],
    };
  }

  const syntaxSuggestions = formatSuggestions(syntaxAnalysis.suggestions);

  return {
    message: originalError,
    syntaxSuggestions,
    hasSyntaxErrors: true,
  };
}

// Re-export for backward compatibility
export { detectAntiPatterns };
