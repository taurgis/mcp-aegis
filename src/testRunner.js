import { MCPCommunicator } from './MCPCommunicator.js';
import { Reporter } from './reporter.js';

/**
 * Deep equality comparison for objects
 * @param {*} expected - Expected value
 * @param {*} actual - Actual value
 * @returns {boolean}
 */
function deepEqual(expected, actual) {
  if (expected === actual) return true;
  
  if (expected == null || actual == null) return expected === actual;
  
  if (typeof expected !== typeof actual) return false;
  
  if (typeof expected !== 'object') return expected === actual;
  
  if (Array.isArray(expected) !== Array.isArray(actual)) return false;
  
  if (Array.isArray(expected)) {
    if (expected.length !== actual.length) return false;
    for (let i = 0; i < expected.length; i++) {
      if (!deepEqual(expected[i], actual[i])) return false;
    }
    return true;
  }
  
  const expectedKeys = Object.keys(expected);
  const actualKeys = Object.keys(actual);
  
  if (expectedKeys.length !== actualKeys.length) return false;
  
  for (const key of expectedKeys) {
    if (!actualKeys.includes(key)) return false;
    
    // Special handling for regex matching
    if (typeof expected[key] === 'string' && expected[key].startsWith('match:')) {
      const pattern = expected[key].substring(6); // Remove 'match:' prefix
      const regex = new RegExp(pattern);
      if (!regex.test(String(actual[key]))) {
        return false;
      }
    } else if (!deepEqual(expected[key], actual[key])) {
      return false;
    }
  }
  
  return true;
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
 * Executes a single test
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
    
    // Check response assertion
    let responseMatches = true;
    let responseError = null;
    
    if (test.expect.response) {
      if (!deepEqual(test.expect.response, actualResponse)) {
        responseMatches = false;
        responseError = 'Response does not match expected value';
      }
    }
    
    // Check stderr assertion
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
        const regex = new RegExp(pattern);
        if (!regex.test(stderrOutput)) {
          stderrMatches = false;
          stderrError = `Stderr output does not match pattern: ${pattern}`;
        }
      } else if (test.expect.stderr !== stderrOutput.trim()) {
        stderrMatches = false;
        stderrError = 'Stderr output does not match expected value';
      }
    }
    
    // Report results
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
