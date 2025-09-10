/**
 * Test Executor - Handles individual test execution
 * Follows single responsibility principle for single test execution
 */

import { matchPattern } from './matchers/patterns.js';
import { validateWithDetailedAnalysis } from './matchers/validation.js';

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
    // Start timing for performance assertions
    const testStartTime = Date.now();

    // Log the request in debug mode
    reporter.logDebug(`Executing test: ${test.it}`);
    reporter.logMCPCommunication('SEND', test.request);

    // Send request and get response
    await communicator.sendMessage(test.request);
    const actualResponse = await communicator.readMessage();
    const stderrOutput = communicator.getStderr();

    // Calculate response time
    const responseTime = Date.now() - testStartTime;

    // Log the response in debug mode
    reporter.logMCPCommunication('RECV', actualResponse);

    if (stderrOutput.trim()) {
      reporter.logDebug('Server stderr output', stderrOutput);
    }

    // Log performance timing
    reporter.logDebug(`Test response time: ${responseTime}ms`);

    // Validate response, stderr, and performance
    const responseResult = validateResponse(test.expect.response, actualResponse);
    const stderrResult = validateStderr(test.expect.stderr, stderrOutput);
    const performanceResult = validatePerformance(test.expect.performance, responseTime);

    // Report results
    if (responseResult.passed && stderrResult.passed && performanceResult.passed) {
      if (test.expect.performance) {
        reporter.logTestPass(`(${responseTime}ms)`);
      } else {
        reporter.logTestPass();
      }
    } else {
      const errorMessages = [];
      if (!responseResult.passed) {errorMessages.push(responseResult.error);}
      if (!stderrResult.passed) {errorMessages.push(stderrResult.error);}
      if (!performanceResult.passed) {errorMessages.push(performanceResult.error);}

      // Pass validation result to reporter for enhanced error display
      reporter.logTestFail(
        test.expect.response || test.expect,
        actualResponse,
        errorMessages.join('; '),
        responseResult.validationResult, // Pass validation result for enhanced reporting
      );
    }

  } catch (error) {
    reporter.logDebug('Test execution error', { error: error.message, stack: error.stack });
    reporter.logTestFail(
      test.expect.response || test.expect,
      null,
      `Test execution error: ${error.message}`,
      null, // No validation result for execution errors
    );
  }
}

/**
 * Validates response against expected values using enhanced detailed validation
 * @param {*} expected - Expected response structure
 * @param {*} actual - Actual response from server
 * @returns {Object} Validation result with passed flag and detailed error message
 */
function validateResponse(expected, actual) {
  if (!expected) {
    return { passed: true };
  }

  try {
    // Use enhanced validation for detailed error reporting
    const validationResult = validateWithDetailedAnalysis(expected, actual, 'response');

    if (validationResult.passed) {
      return { passed: true };
    } else {
      // Create comprehensive error message from validation results
      const errorMessage = formatValidationErrors(validationResult);
      return {
        passed: false,
        error: errorMessage,
        validationResult, // Include full validation result for reporter
      };
    }
  } catch (error) {
    return {
      passed: false,
      error: `Response validation error: ${error.message}`,
    };
  }
}

/**
 * Format validation errors into a comprehensive error message
 * @param {ValidationResult} validationResult - Result from enhanced validation
 * @returns {string} Formatted error message
 */
function formatValidationErrors(validationResult) {
  const { errors } = validationResult;

  if (errors.length === 0) {
    return 'Validation failed for unknown reason';
  }

  // Create primary error message from most critical error
  const primaryError = errors[0];
  let errorMessage = `${primaryError.message}`;

  // Add path information if available
  if (primaryError.path !== 'response') {
    errorMessage = `At ${primaryError.path}: ${primaryError.message}`;
  }

  // Add summary if multiple errors
  if (errors.length > 1) {
    errorMessage += ` (${errors.length - 1} additional validation error${errors.length > 2 ? 's' : ''} found)`;
  }

  return errorMessage;
}

/**
 * Validate stderr output against expected patterns
 * @param {*} expected - Expected stderr pattern
 * @param {string} actual - Actual stderr output
 * @returns {Object} Validation result with passed flag and detailed error message
 */
function validateStderr(expected, actual) {
  if (expected === undefined) {
    return { passed: true };
  }

  if (expected === 'toBeEmpty') {
    if (actual.trim() === '') {
      return { passed: true };
    }
    const preview = actual.trim().length > 100
      ? `${actual.trim().substring(0, 100)}...`
      : actual.trim();
    return {
      passed: false,
      error: `Expected stderr to be empty, but got ${actual.trim().length} characters: "${preview}"`,
    };
  }

  if (typeof expected === 'string' && expected.startsWith('match:')) {
    const pattern = expected.substring(6);
    if (matchPattern(pattern, actual)) {
      return { passed: true };
    }
    const preview = actual.trim().length > 100
      ? `${actual.trim().substring(0, 100)}...`
      : actual.trim();
    return {
      passed: false,
      error: `Stderr pattern '${pattern}' did not match actual output: "${preview}"`,
    };
  }

  if (expected === actual.trim()) {
    return { passed: true };
  }

  const expectedPreview = expected.length > 50 ? `${expected.substring(0, 50)}...` : expected;
  const actualPreview = actual.trim().length > 50
    ? `${actual.trim().substring(0, 50)}...`
    : actual.trim();

  return {
    passed: false,
    error: `Stderr mismatch. Expected: "${expectedPreview}", but got: "${actualPreview}"`,
  };
}

/**
 * Validate performance assertions against actual response time
 * @param {Object|undefined} expected - Expected performance constraints
 * @param {number} actualResponseTime - Actual response time in milliseconds
 * @returns {Object} Validation result with passed flag and detailed error message
 */
function validatePerformance(expected, actualResponseTime) {
  if (!expected) {
    return { passed: true };
  }

  // Validate maxResponseTime assertion
  if (expected.maxResponseTime) {
    const maxTime = parseTimeValue(expected.maxResponseTime);
    if (maxTime === null) {
      return {
        passed: false,
        error: `Invalid maxResponseTime format: "${expected.maxResponseTime}". Expected format: "1000ms", "1s", "2.5s", or number in ms`,
      };
    }

    if (actualResponseTime <= maxTime) {
      return { passed: true };
    } else {
      return {
        passed: false,
        error: `Response time ${actualResponseTime}ms exceeds maximum allowed ${maxTime}ms (${expected.maxResponseTime})`,
      };
    }
  }

  // Validate minResponseTime assertion (for testing slow operations)
  if (expected.minResponseTime) {
    const minTime = parseTimeValue(expected.minResponseTime);
    if (minTime === null) {
      return {
        passed: false,
        error: `Invalid minResponseTime format: "${expected.minResponseTime}". Expected format: "1000ms", "1s", "2.5s", or number in ms`,
      };
    }

    if (actualResponseTime >= minTime) {
      return { passed: true };
    } else {
      return {
        passed: false,
        error: `Response time ${actualResponseTime}ms is below minimum required ${minTime}ms (${expected.minResponseTime})`,
      };
    }
  }

  return { passed: true };
}

/**
 * Parse time value from various formats to milliseconds
 * @param {string|number} value - Time value (e.g., "2000ms", "2s", "2.5s", 2000)
 * @returns {number|null} Time in milliseconds, or null if invalid format
 */
function parseTimeValue(value) {
  // Handle numeric values (already in milliseconds)
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  // Handle milliseconds format (e.g., "2000ms")
  const msMatch = value.match(/^(\d+(?:\.\d+)?)ms$/);
  if (msMatch) {
    return parseFloat(msMatch[1]);
  }

  // Handle seconds format (e.g., "2s", "2.5s")
  const sMatch = value.match(/^(\d+(?:\.\d+)?)s$/);
  if (sMatch) {
    return parseFloat(sMatch[1]) * 1000;
  }

  // Handle plain numbers as milliseconds
  const numMatch = value.match(/^(\d+(?:\.\d+)?)$/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }

  return null;
}

