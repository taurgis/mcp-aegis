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

    const { errors, analysis } = validationResult;

    console.log();
    console.log(chalk.cyan('    🔍 Detailed Validation Analysis:'));

    // Display analysis summary
    if (analysis && analysis.summary) {
      console.log(chalk.yellow(`    📊 ${analysis.summary}`));
    }

    // Display detailed errors (up to 5 most critical ones)
    const criticalErrors = errors.slice(0, 5);

    for (let i = 0; i < criticalErrors.length; i++) {
      const error = criticalErrors[i];
      console.log();

      // Error header with type and path
      const errorIcon = this.getErrorIcon(error.type);
      const errorHeader = `${errorIcon} ${error.type.replace('_', ' ').toUpperCase()}`;
      console.log(chalk.red(`    ${errorHeader}`));

      // Path information
      if (error.path && error.path !== 'response') {
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
        const syntaxAnalysis = enhanceErrorWithSyntaxSuggestions(
          error.message,
          error.expected,
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
      if (error.suggestion) {
        console.log(chalk.cyan(`       💡 Suggestion: ${error.suggestion}`));
      }
    }

    // Show summary if there are more errors
    if (errors.length > 5) {
      console.log();
      console.log(chalk.gray(`    ... and ${errors.length - 5} more validation error(s)`));
    }

    // Display top suggestions
    if (analysis && analysis.suggestions && analysis.suggestions.length > 0) {
      console.log();
      console.log(chalk.cyan('    🎯 Top Recommendations:'));
      analysis.suggestions.forEach((suggestion, index) => {
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
      suggestions.push('Check data types in your response - ensure numbers are not strings');
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
          const syntaxAnalysis = analyzeSyntaxErrors(error.expected);
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
}
