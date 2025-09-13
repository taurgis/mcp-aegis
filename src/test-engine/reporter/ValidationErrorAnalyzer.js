import chalk from 'chalk';
import { analyzeSyntaxErrors, enhanceErrorWithSyntaxSuggestions } from '../matchers/syntaxAnalyzer.js';

/**
 * Analyzes and displays enhanced validation error information
 * Follows single responsibility principle - only concerned with validation error analysis
 */
export class ValidationErrorAnalyzer {
  constructor(options = {}) {
    this.options = options;
    this.errorIcons = {
      missing_field: '🚫',
      extra_field: '➕',
      type_mismatch: '🔀',
      pattern_failed: '🎭',
      value_mismatch: '≠',
      length_mismatch: '📏',
    };
  }

  /**
   * Display enhanced validation errors with detailed analysis
   * @param {ValidationResult} validationResult - Enhanced validation result
   */
  displayEnhancedValidationErrors(validationResult) {
    // Don't display in quiet mode
    if (this.options.quiet) {
      return;
    }

    // Skip detailed analysis if noAnalysis option is enabled
    if (this.options.noAnalysis) {
      this.displaySimpleErrors(validationResult);
      return;
    }

    // Concise mode: when used with grouped errors, suppress the entire detailed block
    // We intentionally skip headers, mini summaries, grouped error listings, and suggestions
    // so that only the higher-level reporter output and the final grouped summary appear.
    if (this.options.groupErrors && this.options.concise) {
      return; // Early exit – nothing else rendered for this test
    }

    // Filter errors based on syntaxOnly option
    let errors = validationResult.errors;
    if (this.options.syntaxOnly) {
      errors = this.filterSyntaxErrors(errors);
      if (errors.length === 0) {
        return; // No syntax errors to display
      }
    }

    // Group similar errors if requested
    if (this.options.groupErrors) {
      errors = this.groupSimilarErrors(errors);
    }

    const { analysis } = validationResult;

    console.log();
    console.log(chalk.cyan('    🔍 Detailed Validation Analysis:'));

    // Display analysis summary
    if (analysis && analysis.summary) {
      console.log(chalk.yellow(`    📊 ${analysis.summary}`));
    }

    // Per-test mini summary (structural vs pattern counts) for quick scan
    if (validationResult.errors && validationResult.errors.length > 0) {
      const structuralTypes = ['missing_field', 'extra_field', 'type_mismatch', 'length_mismatch'];
      const patternTypes = ['pattern_failed'];
      const counts = {
        structural: 0,
        pattern: 0,
        value: 0,
        detail: {
          missing_field: 0,
          extra_field: 0,
          type_mismatch: 0,
          length_mismatch: 0,
          pattern_failed: 0,
          value_mismatch: 0,
        },
      };
      validationResult.errors.forEach(e => {
        if (structuralTypes.includes(e.type)) {
          counts.structural++;
        } else if (patternTypes.includes(e.type)) {
          counts.pattern++;
        } else if (e.type === 'value_mismatch') {
          counts.value++;
        }
        if (counts.detail[e.type] !== undefined) {
          counts.detail[e.type]++;
        }
      });
      const structuralBreakdown = Object.entries(counts.detail)
        .filter(([k, v]) => ['missing_field', 'extra_field', 'type_mismatch', 'length_mismatch'].includes(k) && v > 0)
        .map(([k, v]) => `${k.replace('_', ' ')}:${v}`)
        .join(' ');
      const patternBreakdown = counts.detail.pattern_failed ? `pattern_failed:${counts.detail.pattern_failed}` : '';
      const parts = [];
      parts.push(`structural=${counts.structural}${structuralBreakdown ? ` (${structuralBreakdown})` : ''}`);
      parts.push(`pattern=${counts.pattern}${patternBreakdown ? ` (${patternBreakdown})` : ''}`);
      if (counts.value) {
        parts.push(`value=${counts.value}`);
      }
      const uniquePaths = new Set(validationResult.errors.map(e => e.path).filter(Boolean));
      parts.push(`paths=${uniquePaths.size}`);
      console.log(chalk.gray(`    🧾 Mini Summary: ${parts.join(' | ')}`));
    }

    // Display detailed errors (respecting maxErrors limit)
    const maxErrors = this.options.maxErrors || 5;
    const criticalErrors = errors.slice(0, maxErrors);

    for (let i = 0; i < criticalErrors.length; i++) {
      const error = criticalErrors[i];
      this.displaySingleError(error);
    }

    // Show summary if there are more errors
    if (errors.length > maxErrors) {
      console.log();
      console.log(chalk.gray(`    ... and ${errors.length - maxErrors} more validation error(s)`));
    }

    // Display top suggestions
    if (analysis && analysis.suggestions && analysis.suggestions.length > 0) {
      console.log();
      console.log(chalk.cyan('    🎯 Top Recommendations:'));
      // If there are a large number of extra_field errors, collapse into one aggregated suggestion
      const extraFieldErrors = validationResult.errors.filter(e => e.type === 'extra_field');
      let aggregatedExtraFieldSuggestion = null;
      if (extraFieldErrors.length > 3) {
        const fieldNames = [...new Set(extraFieldErrors.map(e => (e.path || '').split('.').pop()))];
        const preview = fieldNames.slice(0, 5).join(', ');
        const moreCount = fieldNames.length > 5 ? `, +${fieldNames.length - 5} more` : '';
        aggregatedExtraFieldSuggestion = `Remove unexpected field(s): ${preview}${moreCount} or add them to expected response`;
      }

      const sanitized = analysis.suggestions.map(s => {
        // Replace verbose per-field removal suggestions with aggregated one if applicable
        if (aggregatedExtraFieldSuggestion &&
          /^Remove '.*' from server response or add it to expected response/.test(s)
        ) {
          return aggregatedExtraFieldSuggestion;
        }
        // Strip trailing dynamic value parts for removal suggestions to avoid noisy timestamps
        if (/^Remove '.*' from server response or add it to expected response with value:/.test(s)) {
          return s.replace(/ with value:.*$/, '');
        }
        return s;
      });

      // De-duplicate sanitized suggestions
      const seen = new Set();
      const finalSuggestions = sanitized.filter(s => {
        if (seen.has(s)) {
          return false;
        }
        seen.add(s);
        return true;
      });

      // Impact-based weighting: syntax > structural > pattern generic > length/partial
      const weight = (s) => {
        if (/syntax|malformed|missing "match:"/i.test(s)) { return 10; }
        if (/Remove unexpected field|Remove unexpected field\(s\)/i.test(s)) { return 8; }
        if (/Verify all required fields|Check data types/i.test(s)) { return 7; }
        if (/pattern syntax|Review pattern matching/i.test(s)) { return 6; }
        if (/array|string lengths/i.test(s)) { return 5; }
        if (/partial matching/i.test(s)) { return 3; }
        return 1;
      };
      const sorted = [...finalSuggestions].sort((a, b) => weight(b) - weight(a));
      sorted.forEach((suggestion, index) => {
        // Force a hard newline before each numbered item to avoid line-wrap concatenation
        console.log(chalk.yellow(`    ${index + 1}. ${suggestion}`));
      });
    }
  }

  /**
   * Get appropriate icon for error type
   * @param {string} errorType - Type of validation error
   * @returns {string} Unicode icon for error type
   */
  getErrorIcon(errorType) {
    return this.errorIcons[errorType] || '❌';
  }

  /**
   * Analyze validation result and return summary
   * @param {ValidationResult} validationResult - Validation result to analyze
   * @returns {Object} Analysis summary
   */
  analyzeValidationResult(validationResult) {
    if (!validationResult || !validationResult.errors) {
      return { summary: 'No validation errors', suggestions: [] };
    }

    const { errors } = validationResult;
    const errorTypes = [...new Set(errors.map(e => e.type))];
    const pathsWithErrors = [...new Set(errors.map(e => e.path).filter(p => p))];

    const summary = `Found ${errors.length} validation error(s) of ${errorTypes.length} type(s)`;
    const suggestions = this.generateSuggestions(errors, errorTypes, pathsWithErrors);

    return { summary, suggestions, errorTypes, pathsWithErrors };
  }

  /**
   * Generate actionable suggestions based on error patterns
   * @param {Array} errors - Array of validation errors
   * @param {Array} errorTypes - Unique error types
   * @param {Array} pathsWithErrors - Paths that have errors
   * @returns {Array} Array of suggestion strings
   */
  generateSuggestions(errors, errorTypes, pathsWithErrors) {
    const suggestions = [];

    if (errorTypes.includes('type_mismatch')) {
      // Check if type mismatches might be malformed patterns
      const typeMismatchErrors = errors.filter(e => e.type === 'type_mismatch');
      let hasSyntaxIssues = false;

      for (const error of typeMismatchErrors) {
        if (error.expected && typeof error.expected === 'string') {
          const originalPattern = this.getOriginalPattern(error.expected);
          const syntaxAnalysis = analyzeSyntaxErrors(originalPattern);
          if (syntaxAnalysis.hasSyntaxErrors) {
            hasSyntaxIssues = true;
            break;
          }
        }
      }

      if (hasSyntaxIssues) {
        suggestions.push('Check pattern syntax - some strings may be malformed patterns missing "match:" prefix');
      } else {
        suggestions.push('Check data types in your response - ensure numbers are not strings');
      }
    }

    if (errorTypes.includes('missing_field')) {
      suggestions.push('Verify all required fields are present in the response');
    }

    if (errorTypes.includes('pattern_failed')) {
      // Check if any pattern errors might be syntax issues
      const patternErrors = errors.filter(e => e.type === 'pattern_failed');
      let hasSyntaxIssues = false;

      for (const error of patternErrors) {
        if (error.expected) {
          const originalPattern = this.getOriginalPattern(error.expected);
          const syntaxAnalysis = analyzeSyntaxErrors(originalPattern);
          if (syntaxAnalysis.hasSyntaxErrors) {
            hasSyntaxIssues = true;
            break;
          }
        }
      }

      if (hasSyntaxIssues) {
        suggestions.push('Check pattern syntax - common issues: missing "match:" prefix, "arrayElement" vs "arrayElements", comma vs colon delimiters');
      } else {
        suggestions.push('Review pattern matching syntax and ensure proper escaping');
      }
    }

    if (errorTypes.includes('length_mismatch')) {
      suggestions.push('Check array/string lengths match expected values');
    }

    if (pathsWithErrors.length > 3) {
      suggestions.push('Consider using partial matching to focus on specific fields');
    }

    return suggestions.slice(0, 3); // Limit to top 3 suggestions
  }

  /**
   * Display simple error messages without detailed analysis
   * @param {ValidationResult} validationResult - Enhanced validation result
   */
  displaySimpleErrors(validationResult) {
    const { errors } = validationResult;

    if (errors.length === 0) {
      return;
    }

    console.log();
    console.log(chalk.red('    Validation Errors:'));

    const maxErrors = this.options.maxErrors || 5;
    const errorsToShow = errors.slice(0, maxErrors);

    errorsToShow.forEach((error, index) => {
      console.log(chalk.red(`    ${index + 1}. ${error.message}`));
      if (error.path && error.path !== 'response') {
        console.log(chalk.gray(`       Path: ${error.path}`));
      }
    });

    if (errors.length > maxErrors) {
      console.log(chalk.gray(`    ... and ${errors.length - maxErrors} more error(s)`));
    }
  }

  /**
   * Get the original pattern string with match: prefix if needed
   * @param {string} pattern - Pattern string that may be missing match: prefix
   * @returns {string} Pattern with match: prefix if it should have one
   */
  getOriginalPattern(pattern) {
    if (!pattern || typeof pattern !== 'string') {
      return pattern;
    }

    // If it already has match: prefix, return as-is
    if (pattern.startsWith('match:')) {
      return pattern;
    }

    // List of known pattern types that should have match: prefix
    const knownPatternTypes = [
      'arrayLength:', 'arrayContains:', 'contains:', 'containsIgnoreCase:', 'equalsIgnoreCase:',
      'startsWith:', 'endsWith:', 'type:', 'regex:', 'length:', 'between:', 'range:',
      'greaterThan:', 'greaterThanOrEqual:', 'lessThan:', 'lessThanOrEqual:', 'equals:',
      'notEquals:', 'approximately:', 'multipleOf:', 'divisibleBy:', 'decimalPlaces:',
      'dateAfter:', 'dateBefore:', 'dateBetween:', 'dateValid', 'dateAge:', 'dateEquals:',
      'dateFormat:', 'crossField:', 'exists',
    ];

    // Check if this pattern starts with a known pattern type
    for (const patternType of knownPatternTypes) {
      if (pattern.startsWith(patternType) || pattern === 'exists') {
        return `match:${pattern}`;
      }
    }

    // If not a known pattern type, return as-is
    return pattern;
  }

  /**
   * Filter errors to show only syntax-related ones
   * @param {Array} errors - Array of validation errors
   * @returns {Array} Filtered array of syntax errors
   */
  filterSyntaxErrors(errors) {
    return errors.filter(error => {
      if (error.type === 'pattern_failed' && error.expected) {
        const originalPattern = this.getOriginalPattern(error.expected);
        const syntaxAnalysis = analyzeSyntaxErrors(originalPattern);
        return syntaxAnalysis.hasSyntaxErrors;
      }
      return false;
    });
  }

  /**
   * Group similar errors together to reduce repetition
   * @param {Array} errors - Array of validation errors
   * @returns {Array} Array of grouped errors
   */
  groupSimilarErrors(errors) {
    const grouped = new Map();

    errors.forEach(error => {
      // Create a key based on error type and pattern (for pattern errors)
      let key = error.type;
      if (error.type === 'pattern_failed' && error.expected) {
        key = `${error.type}:${error.expected}`;
      }

      if (!grouped.has(key)) {
        grouped.set(key, {
          ...error,
          count: 1,
          paths: [error.path].filter(Boolean),
        });
      } else {
        const existing = grouped.get(key);
        existing.count++;
        if (error.path && !existing.paths.includes(error.path)) {
          existing.paths.push(error.path);
        }
      }
    });

    return Array.from(grouped.values());
  }

  /**
   * Display a single error with appropriate formatting
   * @param {Object} error - Validation error object
   */
  displaySingleError(error) {
    console.log();

    // Error header with type and path
    const errorIcon = this.getErrorIcon(error.type);
    const errorHeader = `${errorIcon} ${error.type.replace('_', ' ').toUpperCase()}`;
    console.log(chalk.red(`    ${errorHeader}`));

    // Show count if this is a grouped error
    if (error.count && error.count > 1) {
      console.log(chalk.yellow(`       📊 Found ${error.count} similar error(s)`));
    }

    // Path information
    if (error.paths && error.paths.length > 0) {
      if (error.paths.length === 1) {
        console.log(chalk.gray(`       📍 Path: ${error.paths[0]}`));
      } else {
        console.log(chalk.gray(`       📍 Paths: ${error.paths.slice(0, 3).join(', ')}`));
        if (error.paths.length > 3) {
          console.log(chalk.gray(`              ... and ${error.paths.length - 3} more`));
        }
      }
    } else if (error.path && error.path !== 'response') {
      console.log(chalk.gray(`       📍 Path: ${error.path}`));
    }

    // Error message
    console.log(chalk.white(`       💬 ${error.message}`));

    // Show expected vs actual for specific error types
    if (['value_mismatch', 'type_mismatch'].includes(error.type)) {
      console.log(chalk.gray('       Expected:'), chalk.green(`${JSON.stringify(error.expected)}`));
      console.log(chalk.gray('       Actual:  '), chalk.red(`${JSON.stringify(error.actual)}`));
    }

    // For pattern_failed errors, check for syntax issues
    if (error.type === 'pattern_failed' && error.expected) {
      // Provide compact diff-style snippet (pattern vs actual) for readability
      const patternPreview = typeof error.expected === 'string' ? error.expected : JSON.stringify(error.expected);
      if (patternPreview) {
        console.log(chalk.gray('       Expected Pattern:'), chalk.green(patternPreview));
        if (error.actual !== undefined) {
          const actualPreview = typeof error.actual === 'string' ? error.actual : JSON.stringify(error.actual);
          console.log(chalk.gray('       Actual Value:   '), chalk.red(actualPreview));
        }
      }
      // If this is a non-existent feature, show detailed help
      if (error.patternType === 'non_existent_feature') {
        console.log();
        console.log(chalk.red('       ❌ Feature Not Available'));
        if (error.alternatives && error.alternatives.length > 0) {
          console.log(chalk.cyan('       ✅ Available alternatives:'));
          error.alternatives.slice(0, 3).forEach(alt => {
            console.log(chalk.green(`          • ${alt}`));
          });
        }
        if (error.example) {
          console.log(chalk.cyan('       📝 Example:'));
          console.log(chalk.red(`          ❌ ${error.example.incorrect}`));
          console.log(chalk.green(`          ✅ ${error.example.correct}`));
        }
      } else {
        // Regular syntax analysis for other patterns
        const originalPattern = this.getOriginalPattern(error.expected);
        const syntaxAnalysis = enhanceErrorWithSyntaxSuggestions(
          error.message,
          originalPattern,
          error.actual,
        );

        if (syntaxAnalysis.hasSyntaxErrors && syntaxAnalysis.syntaxSuggestions) {
          console.log();
          console.log(chalk.magenta('       🔧 Possible Syntax Issues:'));
          syntaxAnalysis.syntaxSuggestions.forEach(suggestion => {
            console.log(chalk.yellow(`          ${suggestion}`));
          });
        }
      }
    }

    // For type_mismatch errors, check if expected value might be a malformed pattern
    if (error.type === 'type_mismatch' && error.expected && typeof error.expected === 'string') {
      // Use the original expected value, not the reconstructed pattern
      const syntaxAnalysis = enhanceErrorWithSyntaxSuggestions(
        error.message,
        error.expected, // Use original, not getOriginalPattern()
        error.actual,
      );

      if (syntaxAnalysis.hasSyntaxErrors && syntaxAnalysis.syntaxSuggestions) {
        console.log();
        console.log(chalk.magenta('       🔧 Possible Syntax Issues:'));
        syntaxAnalysis.syntaxSuggestions.forEach(suggestion => {
          console.log(chalk.yellow(`          ${suggestion}`));
        });
      }
    }

    // Actionable suggestion
    if (error.type === 'extra_field' && error.count && error.count > 1) {
      // Aggregate suggestion for multiple extra fields to reduce repetition
      if (error.paths && error.paths.length > 0) {
        const fieldNames = error.paths.map(p => p.split('.').pop()).filter(Boolean);
        const unique = [...new Set(fieldNames)];
        const preview = unique.slice(0, 6).join(', ');
        const more = unique.length > 6 ? `, +${unique.length - 6} more` : '';
        console.log(chalk.cyan(`       💡 Suggestion: Remove unexpected field(s): ${preview}${more} or add them to expected response`));
      }
    } else if (error.suggestion) {
      console.log(chalk.cyan(`       💡 Suggestion: ${error.suggestion}`));
    }
  }
}
