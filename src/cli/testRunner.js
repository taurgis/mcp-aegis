import { MCPCommunicator } from '../core/MCPCommunicator.js';
import { Reporter } from './reporter.js';

/**
 * Enhanced pattern matching for YAML tests
 * @param {string} pattern - The pattern to match
 * @param {*} actual - The actual value
 * @returns {boolean} Whether the pattern matches
 */
function matchPattern(pattern, actual) {
  // Handle different pattern types
  if (pattern.startsWith('regex:')) {
    // Standard regex matching
    const regex = new RegExp(pattern.substring(6));
    return regex.test(String(actual));
  }
  
  if (pattern.startsWith('length:')) {
    // Array/string length matching
    const expectedLength = parseInt(pattern.substring(7));
    if (Array.isArray(actual) || typeof actual === 'string') {
      return actual.length === expectedLength;
    }
    return false;
  }
  
  if (pattern.startsWith('arrayLength:')) {
    // Alias for length: for clarity
    const expectedLength = parseInt(pattern.substring(12));
    if (Array.isArray(actual)) {
      return actual.length === expectedLength;
    }
    return false;
  }
  
  if (pattern.startsWith('contains:')) {
    // Substring/array contains matching
    const searchValue = pattern.substring(9);
    if (typeof actual === 'string') {
      return actual.includes(searchValue);
    }
    if (Array.isArray(actual)) {
      return actual.some(item => String(item).includes(searchValue));
    }
    return false;
  }
  
  if (pattern.startsWith('startsWith:')) {
    // String starts with prefix
    const prefix = pattern.substring(11);
    if (typeof actual === 'string') {
      return actual.startsWith(prefix);
    }
    return false;
  }
  
  if (pattern.startsWith('endsWith:')) {
    // String ends with suffix
    const suffix = pattern.substring(9);
    if (typeof actual === 'string') {
      return actual.endsWith(suffix);
    }
    return false;
  }
  
  if (pattern.startsWith('arrayContains:')) {
    // Array contains specific value
    const searchValue = pattern.substring(14);
    if (Array.isArray(actual)) {
      return actual.includes(searchValue);
    }
    return false;
  }
  
  if (pattern.startsWith('type:')) {
    // Type checking
    const expectedType = pattern.substring(5);
    return typeof actual === expectedType;
  }
  
  if (pattern.startsWith('exists')) {
    // Check if value exists (not null/undefined)
    return actual !== null && actual !== undefined;
  }
  
  if (pattern.startsWith('count:')) {
    // Count objects/arrays with specific properties
    const expectedCount = parseInt(pattern.substring(6));
    if (Array.isArray(actual)) {
      return actual.length === expectedCount;
    }
    if (typeof actual === 'object' && actual !== null) {
      return Object.keys(actual).length === expectedCount;
    }
    return false;
  }
  
  // Default: treat as regex (backward compatibility)
  const regex = new RegExp(pattern);
  return regex.test(String(actual));
}

/**
 * Enhanced deep equality comparison with flexible pattern matching
 * @param {*} expected - Expected value (can include patterns)
 * @param {*} actual - Actual value
 * @param {string} path - Current path for error reporting
 * @returns {boolean}
 */
function deepEqual(expected, actual, path = '') {
  if (expected === actual) return true;
  
  if (expected == null || actual == null) return expected === actual;
  
  // Handle special matching directives
  if (typeof expected === 'string' && expected.startsWith('match:')) {
    const pattern = expected.substring(6);
    return matchPattern(pattern, actual);
  }
  
  // Handle special object-based patterns BEFORE type checks
  if (typeof expected === 'object' && expected !== null) {
    // Check for partial matching directive
    if ('match:partial' in expected) {
      return deepEqualPartial(expected['match:partial'], actual, path);
    }
    
    // Handle array element matching patterns
    if ('match:arrayElements' in expected) {
      if (!Array.isArray(actual)) return false;
      const elementPattern = expected['match:arrayElements'];
      return actual.every(item => deepEqualPartial(elementPattern, item, path + '[]'));
    }
    
    // Handle field extraction patterns
    if ('match:extractField' in expected && 'value' in expected) {
      const fieldPath = expected['match:extractField'];
      const expectedValue = expected['value'];
      const extractedValue = extractFieldFromObject(actual, fieldPath);
      return deepEqual(expectedValue, extractedValue, path + '.' + fieldPath);
    }
  }
  
  if (typeof expected !== typeof actual) return false;
  
  if (typeof expected !== 'object') return expected === actual;
  
  if (Array.isArray(expected) !== Array.isArray(actual)) return false;
  
  if (Array.isArray(expected)) {
    if (expected.length !== actual.length) return false;
    for (let i = 0; i < expected.length; i++) {
      if (!deepEqual(expected[i], actual[i], path + `[${i}]`)) return false;
    }
    return true;
  }
  
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  
  // Normal object comparison
  if (expectedKeys.length !== actualKeys.length) return false;
  
  for (const key of expectedKeys) {
    if (!actualKeys.includes(key)) return false;
    
    if (!deepEqual(expected[key], actual[key], path ? `${path}.${key}` : key)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Partial object matching - only checks specified fields
 * @param {*} expected - Expected partial object
 * @param {*} actual - Actual object
 * @param {string} path - Current path for error reporting
 * @returns {boolean}
 */
function deepEqualPartial(expected, actual, path = '') {
  if (expected == null || actual == null) return expected === actual;
  
  if (typeof expected !== 'object' || typeof actual !== 'object') {
    return deepEqual(expected, actual, path);
  }
  
  if (Array.isArray(expected) !== Array.isArray(actual)) return false;
  
  if (Array.isArray(expected)) {
    // For arrays in partial mode, we look for matching elements (not exact order)
    for (let i = 0; i < expected.length; i++) {
      const expectedElement = expected[i];
      let found = false;
      
      // Search for a matching element in the actual array
      for (let j = 0; j < actual.length; j++) {
        if (deepEqualPartial(expectedElement, actual[j], path + `[${j}]`)) {
          found = true;
          break;
        }
      }
      
      if (!found) return false;
    }
    return true;
  }
  
  // For objects, only check the keys that exist in expected
  for (const key of Object.keys(expected)) {
    if (!(key in actual)) return false;
    
    if (!deepEqualPartial(expected[key], actual[key], path ? `${path}.${key}` : key)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Extract field value from nested object using dot notation
 * @param {*} obj - Source object
 * @param {string} fieldPath - Dot-separated field path (e.g., "tools.0.name")
 * @returns {*} Extracted value
 */
function extractFieldFromObject(obj, fieldPath) {
  const parts = fieldPath.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current == null) return undefined;
    
    if (part === '*' && Array.isArray(current)) {
      // Wildcard for arrays - return array of values
      const remainingPath = parts.slice(parts.indexOf(part) + 1).join('.');
      if (remainingPath) {
        return current.map(item => extractFieldFromObject(item, remainingPath));
      }
      return current;
    }
    
    if (Array.isArray(current) && /^\d+$/.test(part)) {
      current = current[parseInt(part)];
    } else if (typeof current === 'object') {
      current = current[part];
    } else {
      return undefined;
    }
  }
  
  return current;
}

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
    // Start the server
    reporter.logInfo('Starting MCP server...');
    await communicator.start();
    serverStarted = true;
    reporter.logInfo('Server started successfully');

    // Perform MCP handshake
    reporter.logInfo('Performing MCP handshake...');
    await performHandshake(communicator, reporter);
    reporter.logInfo('Handshake completed successfully');

    // Execute test suites
    for (const testSuite of testSuites) {
      reporter.logSuiteHeader(testSuite.description, testSuite.filePath);

      for (const test of testSuite.tests) {
        await executeTest(communicator, test, reporter);
      }
    }

  } catch (error) {
    reporter.logError(`Test execution failed: ${error.message}`);
    return false;
  } finally {
    if (serverStarted) {
      try {
        reporter.logInfo('Shutting down server...');
        await communicator.stop();
        reporter.logInfo('Server shut down successfully');
      } catch (error) {
        reporter.logWarning(`Error during server shutdown: ${error.message}`);
      }
    }
  }

  // Print summary
  reporter.logSummary();
  
  return reporter.allTestsPassed();
}

/**
 * Performs the MCP initialization handshake
 * @param {MCPCommunicator} communicator - The communicator instance
 * @param {Reporter} reporter - The reporter instance
 */
async function performHandshake(communicator, reporter) {
  // Send initialize request
  const initializeRequest = {
    jsonrpc: '2.0',
    id: 'init-1',
    method: 'initialize',
    params: {
      protocolVersion: '2025-06-18',
      clientInfo: {
        name: 'MCP Conductor',
        version: '1.0.0'
      },
      capabilities: {}
    }
  };

  await communicator.sendMessage(initializeRequest);
  const initResponse = await communicator.readMessage();

  // Validate initialize response
  if (initResponse.error) {
    throw new Error(`Server initialization failed: ${JSON.stringify(initResponse.error)}`);
  }

  if (!initResponse.result) {
    throw new Error('Server initialization failed: No result in initialize response');
  }

  // Send initialized notification
  const initializedNotification = {
    jsonrpc: '2.0',
    method: 'notifications/initialized'
  };

  await communicator.sendMessage(initializedNotification);
  
  // Small delay to let server process the notification
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Executes a single test with enhanced pattern matching
 * @param {MCPCommunicator} communicator - The communicator instance
 * @param {Object} test - The test definition
 * @param {Reporter} reporter - The reporter instance
 */
async function executeTest(communicator, test, reporter) {
  reporter.logTestStart(test.it);
  
  // Clear stderr buffer before test
  communicator.clearStderr();

  try {
    // Send the request
    await communicator.sendMessage(test.request);
    
    // Read the response
    const actualResponse = await communicator.readMessage();
    
    // Get stderr output
    const stderrOutput = communicator.getStderr();
    
    // Check response assertion with enhanced pattern matching
    let responseMatches = true;
    let responseError = null;
    
    if (test.expect.response) {
      if (!deepEqual(test.expect.response, actualResponse)) {
        responseMatches = false;
        responseError = 'Response does not match expected value';
      }
    }
    
    // Check stderr assertion with enhanced patterns
    let stderrMatches = true;
    let stderrError = null;
    
    if (test.expect.stderr !== undefined) {
      if (test.expect.stderr === 'toBeEmpty') {
        if (stderrOutput.trim() !== '') {
          stderrMatches = false;
          stderrError = `Expected stderr to be empty, but got: "${stderrOutput.trim()}"`;
        }
      } else if (typeof test.expect.stderr === 'string' && test.expect.stderr.startsWith('match:')) {
        const pattern = test.expect.stderr.substring(6);
        if (!matchPattern(pattern, stderrOutput)) {
          stderrMatches = false;
          stderrError = `Stderr output does not match pattern: ${pattern}`;
        }
      } else if (test.expect.stderr !== stderrOutput.trim()) {
        stderrMatches = false;
        stderrError = 'Stderr output does not match expected value';
      }
    }
    
    // Report results with enhanced error information
    if (responseMatches && stderrMatches) {
      reporter.logTestPass();
    } else {
      const errorMessages = [];
      if (!responseMatches) errorMessages.push(responseError);
      if (!stderrMatches) errorMessages.push(stderrError);
      
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
