import { test } from 'node:test';
import assert from 'node:assert';
import { executeTest } from '../src/test-engine/executor.js';
import { Reporter } from '../src/test-engine/reporter.js';

// Mock MCPCommunicator for testing
class MockCommunicator {
  constructor(responseTime = 100) {
    this.responseTime = responseTime;
  }

  clearStderr() {
    // Mock implementation
  }

  async sendMessage(message) {
    // Mock implementation - simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.responseTime));
  }

  async readMessage() {
    // Mock JSON-RPC response
    return {
      jsonrpc: '2.0',
      id: 'test-1',
      result: {
        tools: [],
      },
    };
  }

  getStderr() {
    return '';
  }
}

// Mock Reporter for testing
class MockReporter extends Reporter {
  constructor() {
    super({ quiet: true }); // Suppress output during tests
    this.lastTestResult = null;
    this.lastErrorMessage = null;
  }

  logTestStart() {
    super.logTestStart('Mock test');
  }

  logTestPass(timingSuffix) {
    this.lastTestResult = 'pass';
    this.lastTimingSuffix = timingSuffix;
  }

  logTestFail(expected, actual, errorMessage) {
    this.lastTestResult = 'fail';
    this.lastErrorMessage = errorMessage;
  }
}

test('Performance Assertions', async (t) => {
  await t.test('should pass when response time is within maxResponseTime', async () => {
    const communicator = new MockCommunicator(50); // 50ms response time
    const reporter = new MockReporter();

    const testDef = {
      it: 'should be fast',
      request: {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      },
      expect: {
        response: {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            tools: [],
          },
        },
        performance: {
          maxResponseTime: '100ms',  // More than 50ms, should pass
        },
        stderr: 'toBeEmpty',
      },
    };

    await executeTest(communicator, testDef, reporter);

    assert.equal(reporter.lastTestResult, 'pass');
    assert.ok(reporter.lastTimingSuffix, 'Should include timing suffix');
    assert.ok(reporter.lastTimingSuffix.includes('ms'), 'Should show milliseconds');
  });

  await t.test('should fail when response time exceeds maxResponseTime', async () => {
    const communicator = new MockCommunicator(150); // 150ms response time
    const reporter = new MockReporter();

    const testDef = {
      it: 'should be fast',
      request: {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      },
      expect: {
        response: {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            tools: [],
          },
        },
        performance: {
          maxResponseTime: '100ms',  // Less than 150ms, should fail
        },
        stderr: 'toBeEmpty',
      },
    };

    await executeTest(communicator, testDef, reporter);

    assert.equal(reporter.lastTestResult, 'fail');
    assert.ok(reporter.lastErrorMessage.includes('exceeds maximum allowed'));
    assert.ok(reporter.lastErrorMessage.includes('100ms'));
  });

  await t.test('should pass when response time meets minResponseTime', async () => {
    const communicator = new MockCommunicator(150); // 150ms response time
    const reporter = new MockReporter();

    const testDef = {
      it: 'should be slow enough',
      request: {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      },
      expect: {
        response: {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            tools: [],
          },
        },
        performance: {
          minResponseTime: '100ms',  // Less than 150ms, should pass
        },
        stderr: 'toBeEmpty',
      },
    };

    await executeTest(communicator, testDef, reporter);

    assert.equal(reporter.lastTestResult, 'pass');
  });

  await t.test('should fail when response time is below minResponseTime', async () => {
    const communicator = new MockCommunicator(50); // 50ms response time
    const reporter = new MockReporter();

    const testDef = {
      it: 'should be slow enough',
      request: {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      },
      expect: {
        response: {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            tools: [],
          },
        },
        performance: {
          minResponseTime: '100ms',  // More than 50ms, should fail
        },
        stderr: 'toBeEmpty',
      },
    };

    await executeTest(communicator, testDef, reporter);

    assert.equal(reporter.lastTestResult, 'fail');
    assert.ok(reporter.lastErrorMessage.includes('below minimum required'));
    assert.ok(reporter.lastErrorMessage.includes('100ms'));
  });

  await t.test('should handle different time formats', async () => {
    const communicator = new MockCommunicator(1500); // 1500ms = 1.5s
    const reporter = new MockReporter();

    const testDef = {
      it: 'should handle seconds format',
      request: {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      },
      expect: {
        response: {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            tools: [],
          },
        },
        performance: {
          maxResponseTime: '2s',  // 2 seconds = 2000ms, should pass
        },
        stderr: 'toBeEmpty',
      },
    };

    await executeTest(communicator, testDef, reporter);

    assert.equal(reporter.lastTestResult, 'pass');
  });

  await t.test('should handle numeric time format (milliseconds)', async () => {
    const communicator = new MockCommunicator(500); // 500ms
    const reporter = new MockReporter();

    const testDef = {
      it: 'should handle numeric format',
      request: {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      },
      expect: {
        response: {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            tools: [],
          },
        },
        performance: {
          maxResponseTime: 1000,  // 1000ms, should pass
        },
        stderr: 'toBeEmpty',
      },
    };

    await executeTest(communicator, testDef, reporter);

    assert.equal(reporter.lastTestResult, 'pass');
  });

  await t.test('should handle both min and max constraints', async () => {
    const communicator = new MockCommunicator(150); // 150ms
    const reporter = new MockReporter();

    const testDef = {
      it: 'should be within range',
      request: {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      },
      expect: {
        response: {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            tools: [],
          },
        },
        performance: {
          minResponseTime: '100ms',  // 100ms < 150ms ✓
          maxResponseTime: '200ms',   // 150ms < 200ms ✓
        },
        stderr: 'toBeEmpty',
      },
    };

    await executeTest(communicator, testDef, reporter);

    assert.equal(reporter.lastTestResult, 'pass');
  });

  await t.test('should work without performance assertions (backward compatibility)', async () => {
    const communicator = new MockCommunicator(100);
    const reporter = new MockReporter();

    const testDef = {
      it: 'should work normally',
      request: {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      },
      expect: {
        response: {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            tools: [],
          },
        },
        stderr: 'toBeEmpty',
      },
    };

    await executeTest(communicator, testDef, reporter);

    assert.equal(reporter.lastTestResult, 'pass');
    // Should not have timing suffix when no performance assertions
    assert.equal(reporter.lastTimingSuffix, undefined);
  });
});
