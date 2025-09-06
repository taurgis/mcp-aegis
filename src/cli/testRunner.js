/**
 * Test Runner - Main orchestrator for MCP test execution
 * Follows single responsibility principle for test suite orchestration
 */

import { MCPCommunicator } from '../core/MCPCommunicator.js';
import { Reporter } from './reporter.js';
import { performMCPHandshake } from './mcpHandshake.js';
import { executeTest } from './testExecutor.js';

// Re-export functions for backward compatibility with existing tests
export { matchPattern } from './patternMatcher.js';
export { deepEqual, deepEqualPartial } from './equalityMatcher.js';
export { extractFieldFromObject } from './fieldExtractor.js';
export { performMCPHandshake as performHandshake } from './mcpHandshake.js';
export { executeTest as executeTest } from './testExecutor.js';

/**
 * Executes tests against an MCP server
 * @param {Object} config - Server configuration
 * @param {Array} testSuites - Array of test suites to run
 * @returns {Promise<boolean>} Whether all tests passed
 */
export async function runTests(config, testSuites) {
  const reporter = new Reporter();
  const communicator = new MCPCommunicator(config);
  
  let serverStarted = false;

  try {
    // Start server and perform handshake
    await startServerAndHandshake(communicator, reporter);
    serverStarted = true;

    // Execute all test suites
    await executeTestSuites(communicator, testSuites, reporter);

  } catch (error) {
    reporter.logError(`Test execution failed: ${error.message}`);
    return false;
  } finally {
    if (serverStarted) {
      await shutdownServer(communicator, reporter);
    }
  }

  // Print summary and return results
  reporter.logSummary();
  return reporter.allTestsPassed();
}

/**
 * Start server and perform MCP handshake
 * @param {MCPCommunicator} communicator - The communicator instance
 * @param {Reporter} reporter - The reporter instance
 */
async function startServerAndHandshake(communicator, reporter) {
  reporter.logInfo('Starting MCP server...');
  await communicator.start();
  reporter.logInfo('Server started successfully');

  reporter.logInfo('Performing MCP handshake...');
  await performMCPHandshake(communicator, reporter);
  reporter.logInfo('Handshake completed successfully');
}

/**
 * Execute all test suites
 * @param {MCPCommunicator} communicator - The communicator instance
 * @param {Array} testSuites - Array of test suites
 * @param {Reporter} reporter - The reporter instance
 */
async function executeTestSuites(communicator, testSuites, reporter) {
  for (const testSuite of testSuites) {
    reporter.logSuiteHeader(testSuite.description, testSuite.filePath);

    for (const test of testSuite.tests) {
      await executeTest(communicator, test, reporter);
    }
  }
}

/**
 * Shutdown server gracefully
 * @param {MCPCommunicator} communicator - The communicator instance
 * @param {Reporter} reporter - The reporter instance
 */
async function shutdownServer(communicator, reporter) {
  try {
    reporter.logInfo('Shutting down server...');
    await communicator.stop();
    reporter.logInfo('Server shut down successfully');
  } catch (error) {
    reporter.logWarning(`Error during server shutdown: ${error.message}`);
  }
}
