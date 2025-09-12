/**
 * CLI Options Handler - Centralized option parsing and validation
 * Handles all CLI option logic and provides clean interfaces
 */

/**
 * Parse and validate CLI options
 * @param {Object} rawOptions - Raw options from Commander.js
 * @returns {Object} Validated options object
 */
export function parseOptions(rawOptions) {
  const options = {
    config: rawOptions.config || './conductor.config.json',
    verbose: Boolean(rawOptions.verbose),
    debug: Boolean(rawOptions.debug),
    timing: Boolean(rawOptions.timing),
    json: Boolean(rawOptions.json),
    quiet: Boolean(rawOptions.quiet),
    // New debugging options
    errorsOnly: Boolean(rawOptions.errorsOnly),
    syntaxOnly: Boolean(rawOptions.syntaxOnly),
    noAnalysis: rawOptions.analysis === false, // Commander.js sets 'analysis' to false when --no-analysis is used
    groupErrors: Boolean(rawOptions.groupErrors),
    maxErrors: rawOptions.maxErrors !== undefined ?
      (isNaN(parseInt(rawOptions.maxErrors, 10)) ? 5 : parseInt(rawOptions.maxErrors, 10)) : 5,
  };

  // Validate option combinations
  if (options.verbose && options.quiet) {
    throw new Error('Cannot use both --verbose and --quiet options together');
  }

  if (options.json && options.verbose) {
    // JSON output takes precedence, disable verbose for cleaner output
    options.verbose = false;
  }

  if (options.errorsOnly && options.verbose) {
    throw new Error('Cannot use both --errors-only and --verbose options together');
  }

  if (options.syntaxOnly && options.noAnalysis) {
    throw new Error('Cannot use both --syntax-only and --no-analysis options together');
  }

  if (options.maxErrors < 1) {
    throw new Error('--max-errors must be a positive number');
  }

  return options;
}

/**
 * Extract test options for the test runner
 * @param {Object} options - Parsed options object
 * @returns {Object} Test execution options
 */
export function getTestOptions(options) {
  return {
    verbose: options.verbose,
    debug: options.debug,
    timing: options.timing,
    json: options.json,
    quiet: options.quiet,
    // New debugging options
    errorsOnly: options.errorsOnly,
    syntaxOnly: options.syntaxOnly,
    noAnalysis: options.noAnalysis,
    groupErrors: options.groupErrors,
    maxErrors: options.maxErrors,
  };
}

/**
 * Determine if output should be suppressed based on options
 * @param {Object} options - Parsed options object
 * @returns {boolean} True if output should be suppressed
 */
export function shouldSuppressOutput(options) {
  return options.json || options.quiet;
}

/**
 * Get configuration for different output modes
 * @param {Object} options - Parsed options object
 * @returns {Object} Output configuration
 */
export function getOutputConfig(options) {
  return {
    showProgress: !shouldSuppressOutput(options),
    showDetails: options.verbose && !options.quiet,
    showDebug: options.debug && !options.quiet,
    showTiming: options.timing && !options.quiet,
    jsonOutput: options.json,
    quietMode: options.quiet,
  };
}

/**
 * Validate that required options are present
 * @param {string} testPattern - Test pattern argument
 * @param {Object} options - Parsed options object
 * @throws {Error} If validation fails
 */
export function validateRequiredOptions(testPattern, options) {
  if (!testPattern) {
    throw new Error('Test pattern is required when running tests');
  }

  if (!options.config) {
    throw new Error('Configuration file path is required');
  }
}
