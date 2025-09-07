/**
 * Test Command Handler - Handles main test execution command
 * Single responsibility: Coordinate test execution with proper error handling
 */

import { existsSync } from 'fs';
import { loadConfig } from '../../core/configParser.js';
import { loadTestSuites } from '../../test-engine/parser.js';
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
    const testSuites = await loadTestSuites(testPattern);
    output.logTestSuitesFound(testSuites.length);

    // Handle no test files found
    if (testSuites.length === 0) {
      output.logNoTestFiles(testPattern);
      return true; // Not a failure condition
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
