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
