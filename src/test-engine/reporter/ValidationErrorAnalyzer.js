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
   * Filter errors to show only syntax-related ones
   * @param {Array} errors - Array of validation errors
   * @returns {Array} Filtered array of syntax errors
   */
  filterSyntaxErrors(errors) {
    return errors.filter(error => {
      if (error.type === 'pattern_failed' && error.expected) {
        const syntaxAnalysis = analyzeSyntaxErrors(error.expected);
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
    }

    // Actionable suggestion
    if (error.suggestion) {
      console.log(chalk.cyan(`       💡 Suggestion: ${error.suggestion}`));
    }
  }
}
