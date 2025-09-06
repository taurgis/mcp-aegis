import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Reporter } from '../src/cli/reporter.js';
import { Writable } from 'stream';

// Mock console methods for testing
class MockOutput extends Writable {
  constructor() {
    super();
    this.output = [];
  }

  _write(chunk, encoding, callback) {
    this.output.push(chunk.toString());
    callback();
  }

  getOutput() {
    return this.output.join('');
  }

  clear() {
    this.output = [];
  }
}

describe('Reporter', () => {
  let reporter;
  let mockStdout;
  let mockStderr;
  let originalStdout;
  let originalStderr;
  let originalConsoleLog;
  let capturedLogs;

  beforeEach(() => {
    reporter = new Reporter();
    capturedLogs = [];

    // Mock console.log to capture output
    originalConsoleLog = console.log;
    console.log = (...args) => {
      capturedLogs.push(args.join(' '));
    };

    // Mock process.stdout.write
    originalStdout = process.stdout.write;
    process.stdout.write = (chunk) => {
      capturedLogs.push(chunk.toString());
      return true;
    };
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    process.stdout.write = originalStdout;
  });

  describe('constructor', () => {
    it('should initialize with zero counts', () => {
      assert.equal(reporter.totalTests, 0);
      assert.equal(reporter.passedTests, 0);
      assert.equal(reporter.failedTests, 0);
    });
  });

  describe('logSuiteHeader', () => {
    it('should log suite information', () => {
      reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test Suite'));
      assert.ok(output.includes('/path/to/test.yml'));
    });
  });

  describe('logTestStart', () => {
    it('should log test start', () => {
      reporter.logTestStart('should do something');

      const output = capturedLogs.join('');
      assert.ok(output.includes('should do something'));
      assert.ok(output.includes('...'));
    });
  });

  describe('logTestPass', () => {
    it('should increment passed count and log success', () => {
      reporter.logTestPass();

      assert.equal(reporter.passedTests, 1);
      assert.equal(reporter.totalTests, 1);
      assert.equal(reporter.failedTests, 0);

      const output = capturedLogs.join('');
      assert.ok(output.includes('PASS'));
    });
  });

  describe('logTestFail', () => {
    it('should increment failed count and log failure', () => {
      const expected = { status: 'success' };
      const actual = { status: 'error' };

      reporter.logTestFail(expected, actual, 'Test failed');

      assert.equal(reporter.failedTests, 1);
      assert.equal(reporter.totalTests, 1);
      assert.equal(reporter.passedTests, 0);

      const output = capturedLogs.join('');
      assert.ok(output.includes('FAIL'));
      assert.ok(output.includes('Test failed'));
    });

    it('should handle failure without error message', () => {
      const expected = { value: 'expected' };
      const actual = { value: 'actual' };

      reporter.logTestFail(expected, actual);

      assert.equal(reporter.failedTests, 1);
      const output = capturedLogs.join('');
      assert.ok(output.includes('FAIL'));
    });

    it('should handle failure with only error message', () => {
      reporter.logTestFail(undefined, undefined, 'Custom error message');

      assert.equal(reporter.failedTests, 1);
      const output = capturedLogs.join('');
      assert.ok(output.includes('FAIL'));
      assert.ok(output.includes('Custom error message'));
    });
  });

  describe('logSummary', () => {
    it('should log summary with all tests passed', () => {
      reporter.passedTests = 5;
      reporter.totalTests = 5;

      reporter.logSummary();

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test Results'));
      assert.ok(output.includes('5 passed'));
      assert.ok(output.includes('Total: 5'));
      assert.ok(output.includes('All tests passed'));
    });

    it('should log summary with some tests failed', () => {
      reporter.passedTests = 3;
      reporter.failedTests = 2;
      reporter.totalTests = 5;

      reporter.logSummary();

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test Results'));
      assert.ok(output.includes('3 passed'));
      assert.ok(output.includes('2 failed'));
      assert.ok(output.includes('Total: 5'));
      assert.ok(output.includes('2 test(s) failed'));
    });
  });

  describe('allTestsPassed', () => {
    it('should return true when no tests failed', () => {
      reporter.passedTests = 5;
      reporter.totalTests = 5;
      reporter.failedTests = 0;

      assert.equal(reporter.allTestsPassed(), true);
    });

    it('should return false when tests failed', () => {
      reporter.passedTests = 3;
      reporter.failedTests = 2;
      reporter.totalTests = 5;

      assert.equal(reporter.allTestsPassed(), false);
    });
  });

  describe('utility methods', () => {
    it('should log error message', () => {
      reporter.logError('Test error');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test error'));
    });

    it('should log info message', () => {
      reporter.logInfo('Test info');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test info'));
    });

    it('should log warning message', () => {
      reporter.logWarning('Test warning');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test warning'));
    });
  });

  describe('logStderrInfo', () => {
    it('should warn about unexpected stderr when expecting empty', () => {
      reporter.logStderrInfo('Some error output', 'toBeEmpty');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Unexpected stderr output'));
      assert.ok(output.includes('Some error output'));
    });

    it('should log stderr when not expecting empty', () => {
      reporter.logStderrInfo('Expected output', 'expected pattern');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Stderr: Expected output'));
    });

    it('should not log when stderr is empty and expected to be empty', () => {
      const initialLogCount = capturedLogs.length;
      reporter.logStderrInfo('', 'toBeEmpty');

      // Should not add any new logs
      assert.equal(capturedLogs.length, initialLogCount);
    });
  });
});
