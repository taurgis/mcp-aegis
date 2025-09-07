/**
 * Test Runner - Main orchestrator for MCP test execution
 * Follows single responsibility principle for test suite orchestration
 */

import { MCPCommunicator } from '../core/MCPCommunicator.js';
import { Reporter } from './reporter.js';
import { performMCPHandshake } from '../protocol/handshake.js';
import { executeTest } from './executor.js';

// Re-export functions for backward compatibility with existing tests
export { matchPattern } from './matchers/patterns.js';
export { deepEqual, deepEqualPartial } from './matchers/equality.js';
export { extractFieldFromObject } from './matchers/fields.js';
export { performMCPHandshake as performHandshake } from '../protocol/handshake.js';
export { executeTest as executeTest } from './executor.js';

/**
 * Executes tests against an MCP server
 * @param {Object} config - Server configuration
 * @param {Array} testSuites - Array of test suites to run
 * @param {Object} options - Options object with verbose flag
 * @returns {Promise<boolean>} Whether all tests passed
 */
export async function runTests(config, testSuites, options = {}) {
  const reporter = new Reporter(options);
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
  const serverStartTime = Date.now();
  reporter.logInfo('Starting MCP server...');
  reporter.logDebug('Server configuration', communicator.config);

  await communicator.start();
  const serverDuration = Date.now() - serverStartTime;
  reporter.recordPerformance('serverStartTime', serverDuration);
  reporter.logPerformance('Server startup', serverDuration);
  reporter.logInfo('Server started successfully');

  const handshakeStartTime = Date.now();
  reporter.logInfo('Performing MCP handshake...');
  await performMCPHandshake(communicator, reporter);
  const handshakeDuration = Date.now() - handshakeStartTime;
  reporter.recordPerformance('handshakeTime', handshakeDuration);
  reporter.logPerformance('MCP handshake', handshakeDuration);
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

    // Finalize the current suite for verbose output
    reporter.finalizeSuite();
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
