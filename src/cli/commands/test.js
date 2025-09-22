/**
 * Test Command Handler - Handles main test execution command
 * Single responsibility: Coordinate test execution with proper error handling
 */

import { existsSync } from 'fs';
import { loadConfig } from '../../core/configParser.js';
import { loadTestSuites, filterTestSuites } from '../../test-engine/parser.js';
import { runTests } from '../../test-engine/runner.js';

/**
 * Execute test command with given pattern and options
 * @param {string} testPattern - Glob pattern for test files
 * @param {Object} options - Parsed CLI options
 * @param {OutputManager} output - Output manager for logging
 * @returns {Promise<boolean>} Success status
 */
export async function executeTestCommand(testPattern, options, output) {
  try {
    // Validate configuration file exists
    if (!existsSync(options.config)) {
      throw new Error(`Configuration file not found: ${options.config}`);
    }

    // Load configuration
    const config = await loadConfig(options.config);
    output.logConfigLoaded(config.name);

    // Load test suites
    const allTestSuites = await loadTestSuites(testPattern);
    output.logTestSuitesFound(allTestSuites.length);

    // Handle no test files found
    if (allTestSuites.length === 0) {
      output.logNoTestFiles(testPattern);
      return true; // Not a failure condition
    }

    // Apply filtering if specified
    const testSuites = filterTestSuites(allTestSuites, options.filter);

    // Report filtering results
    if (options.filter) {
      const originalTestCount = allTestSuites.reduce((count, suite) => count + suite.tests.length, 0);
      const filteredTestCount = testSuites.reduce((count, suite) => count + suite.tests.length, 0);
      const filteredSuiteCount = testSuites.length;

      output.logInfo(`🔍 Filter applied: "${options.filter}"`);
      output.logInfo(`📊 Filtered results: ${filteredSuiteCount}/${allTestSuites.length} suites, ${filteredTestCount}/${originalTestCount} tests`);

      if (testSuites.length === 0) {
        output.logInfo('ℹ️  No tests matched the filter pattern');
        return true; // Not a failure condition
      }
    }

    // Execute tests
    const testOptions = extractTestOptions(options);
    const success = await runTests(config, testSuites, testOptions);

    return success;

  } catch (error) {
    output.logError(`❌ Error: ${error.message}`);
    return false;
  }
}

/**
 * Extract test execution options from CLI options
 * @param {Object} options - Parsed CLI options
 * @returns {Object} Test execution options
 */
function extractTestOptions(options) {
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
    concise: options.concise,
    maxErrors: options.maxErrors,
    filter: options.filter,
  };
}

/**
 * Validate test command prerequisites
 * @param {string} testPattern - Test pattern argument
 * @param {Object} options - Parsed CLI options
 * @throws {Error} If validation fails
 */
export function validateTestCommand(testPattern, options) {
  if (!testPattern) {
    throw new Error('Test pattern is required when running tests');
  }

  if (!options.config) {
    throw new Error('Configuration file path is required');
  }
}
