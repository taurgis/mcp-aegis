/**
 * Formatting utilities - helper functions for error message formatting
 * Follows single responsibility principle - only concerned with message formatting
 */

/**
 * Format a syntax suggestion for display
 * @param {Object} suggestion - Suggestion object
 * @returns {string} Formatted suggestion message
 */
export function formatSuggestion(suggestion) {
  // Handle non-existent feature errors with special formatting
  if (suggestion.type === 'non_existent_feature') {
    let message = `❌ Unsupported Feature: ${suggestion.message}`;

    if (suggestion.suggestion) {
      message += `\n   💡 Solution: ${suggestion.suggestion}`;
    }

    if (suggestion.alternatives && suggestion.alternatives.length > 0) {
      message += '\n   ✅ Available alternatives:';
      for (const alternative of suggestion.alternatives.slice(0, 3)) { // Show max 3 alternatives
        message += `\n      • ${alternative}`;
      }
    }

    if (suggestion.example) {
      message += '\n   📝 Example:';
      message += `\n      ❌ ${suggestion.example.incorrect}`;
      message += `\n      ✅ ${suggestion.example.correct}`;
    }

    return message;
  }

  // Handle confusing pattern warnings
  if (suggestion.type === 'confusing_pattern') {
    let message = `🔀 Similar Pattern Available: ${suggestion.message}`;
    message += `\n   Change: "${suggestion.original}" → "${suggestion.corrected}"`;
    return message;
  }

  // Handle sounds-like feature errors
  if (suggestion.type === 'sounds_like_feature') {
    let message = `❌ Feature Not Available: ${suggestion.message}`;
    if (suggestion.suggestion) {
      message += `\n   💡 Alternative: ${suggestion.suggestion}`;
    }
    return message;
  }

  // Default formatting for other suggestions
  let message = `🔧 Syntax Fix: ${suggestion.message}`;

  if (suggestion.corrected !== suggestion.original) {
    message += `\n   Change: "${suggestion.original}" → "${suggestion.corrected}"`;
  }

  if (suggestion.example) {
    message += `\n   Example: ${suggestion.example}`;
  }

  return message;
}

/**
 * Format multiple suggestions into a comprehensive message
 * @param {Array} suggestions - Array of suggestion objects
 * @returns {Array} Array of formatted suggestion messages
 */
export function formatSuggestions(suggestions) {
  return suggestions.map(formatSuggestion);
}

/**
 * Create a suggestion object
 * @param {Object} options - Suggestion options
 * @param {string} options.type - Type of suggestion
 * @param {string} options.original - Original pattern
 * @param {string} options.corrected - Corrected pattern
 * @param {string} options.message - Suggestion message
 * @param {string} [options.example] - Optional example
 * @returns {Object} Formatted suggestion object
 */
export function createSuggestion({ type, original, corrected, message, example }) {
  const suggestion = {
    type,
    original,
    corrected,
    pattern: corrected,
    message,
  };

  if (example) {
    suggestion.example = example;
  }

  return suggestion;
}

/**
 * Format anti-pattern warnings
 * @param {Array} warnings - Array of anti-pattern warnings
 * @returns {Array} Array of formatted warning messages
 */
export function formatAntiPatternWarnings(warnings) {
  return warnings.map(warning => {
    let message = `⚠️ Anti-Pattern: ${warning.message}`;
    if (warning.fix) {
      message += `\n   Fix: ${warning.fix}`;
    }
    return message;
  });
}
