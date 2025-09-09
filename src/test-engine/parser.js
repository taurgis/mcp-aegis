import { glob } from 'glob';
import { readFile } from 'fs/promises';
import yaml from 'js-yaml';

/**
 * Loads and validates test suites from YAML files matching the glob pattern
 * @param {string} globPattern - Glob pattern to match test files
 * @returns {Promise<Array>} Array of test suite objects
 */
export async function loadTestSuites(globPattern) {
  try {
    // Find all files matching the pattern
    const testFiles = await glob(globPattern);

    const testSuites = [];

    for (const filePath of testFiles) {
      try {
        const fileContent = await readFile(filePath, 'utf8');
        const testSuite = yaml.load(fileContent);

        // Validate test suite structure
        if (!testSuite || typeof testSuite !== 'object') {
          throw new Error(`Invalid test suite structure in ${filePath}: must be an object`);
        }

        if (!testSuite.description || typeof testSuite.description !== 'string') {
          throw new Error(`Invalid test suite in ${filePath}: missing or invalid "description" field`);
        }

        if (!Array.isArray(testSuite.tests)) {
          throw new Error(`Invalid test suite in ${filePath}: "tests" must be an array`);
        }

        // Validate individual tests
        testSuite.tests.forEach((test, index) => {
          if (!test.it || typeof test.it !== 'string') {
            throw new Error(`Invalid test at index ${index} in ${filePath}: missing or invalid "it" field`);
          }

          if (!test.request || typeof test.request !== 'object') {
            throw new Error(`Invalid test at index ${index} in ${filePath}: missing or invalid "request" field`);
          }

          if (!test.expect || typeof test.expect !== 'object') {
            throw new Error(`Invalid test at index ${index} in ${filePath}: missing or invalid "expect" field`);
          }

          // Validate JSON-RPC structure in request
          if (test.request.jsonrpc !== '2.0') {
            throw new Error(`Invalid test at index ${index} in ${filePath}: request must have jsonrpc: "2.0"`);
          }

          if (!test.request.method) {
            throw new Error(`Invalid test at index ${index} in ${filePath}: request must have a "method" field`);
          }

          // Validate performance assertions (optional)
          if (test.expect.performance) {
            validatePerformanceAssertions(test.expect.performance, `test at index ${index} in ${filePath}`);
          }
        });

        // Add metadata
        testSuite.filePath = filePath;
        testSuites.push(testSuite);

      } catch (error) {
        if (error.code === 'ENOENT') {
          throw new Error(`Test file not found: ${filePath}`);
        }
        throw error;
      }
    }

    return testSuites;
  } catch (error) {
    if (error.message.includes('no matches found')) {
      return [];
    }
    throw error;
  }
}

/**
 * Validate performance assertions structure
 * @param {Object} performance - Performance assertions object
 * @param {string} context - Context for error messages
 */
function validatePerformanceAssertions(performance, context) {
  if (typeof performance !== 'object' || performance === null) {
    throw new Error(`Invalid ${context}: performance assertions must be an object`);
  }

  // Validate maxResponseTime format if present
  if (performance.maxResponseTime !== undefined) {
    if (!isValidTimeFormat(performance.maxResponseTime)) {
      throw new Error(`Invalid ${context}: maxResponseTime must be a valid time format (e.g., "2000ms", "2s", or number)`);
    }
  }

  // Validate minResponseTime format if present
  if (performance.minResponseTime !== undefined) {
    if (!isValidTimeFormat(performance.minResponseTime)) {
      throw new Error(`Invalid ${context}: minResponseTime must be a valid time format (e.g., "1000ms", "1s", or number)`);
    }
  }

  // Ensure at least one assertion is provided
  const validKeys = ['maxResponseTime', 'minResponseTime'];
  const providedKeys = Object.keys(performance);
  const validProvidedKeys = providedKeys.filter(key => validKeys.includes(key));

  if (validProvidedKeys.length === 0) {
    throw new Error(`Invalid ${context}: performance assertions must include at least one of: ${validKeys.join(', ')}`);
  }

  // Check for unsupported keys
  const unsupportedKeys = providedKeys.filter(key => !validKeys.includes(key));
  if (unsupportedKeys.length > 0) {
    throw new Error(`Invalid ${context}: unsupported performance assertion keys: ${unsupportedKeys.join(', ')}. Supported: ${validKeys.join(', ')}`);
  }
}

/**
 * Check if a value is in valid time format
 * @param {*} value - Value to check
 * @returns {boolean} Whether the value is valid
 */
function isValidTimeFormat(value) {
  // Accept numbers (milliseconds)
  if (typeof value === 'number' && value >= 0) {
    return true;
  }

  // Accept string time formats
  if (typeof value === 'string') {
    // Check milliseconds format (e.g., "2000ms")
    if (/^\d+(?:\.\d+)?ms$/.test(value)) {
      return true;
    }

    // Check seconds format (e.g., "2s", "2.5s")
    if (/^\d+(?:\.\d+)?s$/.test(value)) {
      return true;
    }

    // Check plain numbers (treated as milliseconds)
    if (/^\d+(?:\.\d+)?$/.test(value)) {
      return true;
    }
  }

  return false;
}
