/**
 * Test Executor - Handles individual test execution
 * Follows single responsibility principle for single test execution
 */

import { deepEqual } from './equalityMatcher.js';
import { matchPattern } from './patternMatcher.js';

/**
 * Executes a single test with enhanced pattern matching
 * @param {MCPCommunicator} communicator - The communicator instance
 * @param {Object} test - The test definition
 * @param {Reporter} reporter - The reporter instance
 */
export async function executeTest(communicator, test, reporter) {
  reporter.logTestStart(test.it);
  
  // Clear stderr buffer before test
  communicator.clearStderr();

  try {
    // Send request and get response
    await communicator.sendMessage(test.request);
    const actualResponse = await communicator.readMessage();
    const stderrOutput = communicator.getStderr();
    
    // Validate response and stderr
    const responseResult = validateResponse(test.expect.response, actualResponse);
    const stderrResult = validateStderr(test.expect.stderr, stderrOutput);
    
    // Report results
    if (responseResult.passed && stderrResult.passed) {
      reporter.logTestPass();
    } else {
      const errorMessages = [];
      if (!responseResult.passed) errorMessages.push(responseResult.error);
      if (!stderrResult.passed) errorMessages.push(stderrResult.error);
      
      reporter.logTestFail(
        test.expect.response || test.expect,
        actualResponse,
        errorMessages.join('; ')
      );
    }
    
  } catch (error) {
    reporter.logTestFail(
      test.expect.response || test.expect,
      null,
      `Test execution error: ${error.message}`
    );
  }
}

/**
 * Validate the response against expected values
 * @param {*} expected - Expected response
 * @param {*} actual - Actual response
 * @returns {Object} Validation result with passed flag and error message
 */
function validateResponse(expected, actual) {
  if (!expected) {
    return { passed: true };
  }
  
  if (deepEqual(expected, actual)) {
    return { passed: true };
  }
  
  return {
    passed: false,
    error: 'Response does not match expected value'
  };
}

/**
 * Validate stderr output against expected patterns
 * @param {*} expected - Expected stderr pattern
 * @param {string} actual - Actual stderr output
 * @returns {Object} Validation result with passed flag and error message
 */
function validateStderr(expected, actual) {
  if (expected === undefined) {
    return { passed: true };
  }
  
  if (expected === 'toBeEmpty') {
    if (actual.trim() === '') {
      return { passed: true };
    }
    return {
      passed: false,
      error: `Expected stderr to be empty, but got: "${actual.trim()}"`
    };
  }
  
  if (typeof expected === 'string' && expected.startsWith('match:')) {
    const pattern = expected.substring(6);
    if (matchPattern(pattern, actual)) {
      return { passed: true };
    }
    return {
      passed: false,
      error: `Stderr output does not match pattern: ${pattern}`
    };
  }
  
  if (expected === actual.trim()) {
    return { passed: true };
  }
  
  return {
    passed: false,
    error: 'Stderr output does not match expected value'
  };
}
