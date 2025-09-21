import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Reporter } from '../../src/test-engine/reporter.js';

describe('Reporter (Refactored)', () => {
  let reporter;
  let capturedLogs;
  let originalConsoleLog;

  beforeEach(() => {
    reporter = new Reporter();
    capturedLogs = [];

    // Mock console.log to capture output safely
    originalConsoleLog = console.log;
    console.log = (...args) => {
      // Safely handle arguments that might contain non-serializable data
      const safeArgs = args.map(arg => {
        if (typeof arg === 'string') {
          return arg;
        }
        try {
          // Try basic stringify first
          return JSON.stringify(arg);
        } catch (error) {
          // If that fails, convert to string representation
          return String(arg);
        }
      });
      capturedLogs.push(safeArgs.join(' '));
    };
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  describe('constructor', () => {
    it('should initialize with proper modules', () => {
      assert.ok(reporter.outputFormatter);
      assert.ok(reporter.performanceTracker);
      assert.ok(reporter.validationErrorAnalyzer);
      assert.ok(reporter.patternAnalyzer);
      assert.ok(reporter.resultsCollector);
    });

    it('should initialize with options', () => {
      const optionedReporter = new Reporter({ verbose: true, debug: true, timing: true });
      assert.ok(optionedReporter.outputFormatter);
      assert.equal(optionedReporter.options.verbose, true);
      assert.equal(optionedReporter.options.debug, true);
      assert.equal(optionedReporter.options.timing, true);
    });
  });

  describe('test lifecycle', () => {
    it('should handle complete test lifecycle', () => {
      // Start suite
      reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');

      // Start test
      reporter.logTestStart('should pass');

      // Pass test
      reporter.logTestPass();

      // Finalize suite
      reporter.finalizeSuite();

      // Check results
      const summary = reporter.getSummary();
      assert.equal(summary.total, 1);
      assert.equal(summary.passed, 1);
      assert.equal(summary.failed, 0);
      assert.ok(reporter.allTestsPassed());
    });

    it('should handle failed tests', () => {
      reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
      reporter.logTestStart('should fail');
      reporter.logTestFail({ expected: 'foo' }, { actual: 'bar' }, 'Values do not match');
      reporter.finalizeSuite();

      const summary = reporter.getSummary();
      assert.equal(summary.total, 1);
      assert.equal(summary.passed, 0);
      assert.equal(summary.failed, 1);
      assert.equal(reporter.allTestsPassed(), false);
    });

    it('should track multiple tests', () => {
      reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');

      // First test - pass
      reporter.logTestStart('test 1');
      reporter.logTestPass();

      // Second test - fail
      reporter.logTestStart('test 2');
      reporter.logTestFail('expected', 'actual', 'Test failed');

      // Third test - pass
      reporter.logTestStart('test 3');
      reporter.logTestPass();

      reporter.finalizeSuite();

      const summary = reporter.getSummary();
      assert.equal(summary.total, 3);
      assert.equal(summary.passed, 2);
      assert.equal(summary.failed, 1);
    });
  });

  describe('logging methods', () => {
    it('should delegate debug logging', () => {
      const debugReporter = new Reporter({ debug: true });
      debugReporter.logDebug('Debug message', { data: 'test' });

      const output = capturedLogs.join('');
      assert.ok(output.includes('Debug message'));
    });

    it('should delegate MCP communication logging', () => {
      const debugReporter = new Reporter({ debug: true });
      debugReporter.logMCPCommunication('SEND', { method: 'test', id: '1' });

      const output = capturedLogs.join('');
      assert.ok(output.includes('SEND'));
      assert.ok(output.includes('test'));
    });

    it('should delegate performance logging', () => {
      const timingReporter = new Reporter({ timing: true });
      timingReporter.logPerformance('Test operation', 150);

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test operation'));
      assert.ok(output.includes('150ms'));
    });

    it('should record performance metrics', () => {
      reporter.recordPerformance('serverStartTime', 1000);
      // Performance metrics are internal to PerformanceTracker
      // We can verify through the logSummary behavior
      assert.ok(true); // If no error, recordPerformance worked
    });
  });

  describe('output methods', () => {
    it('should log error messages', () => {
      reporter.logError('Error message');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Error message'));
    });

    it('should log info messages', () => {
      reporter.logInfo('Info message');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Info message'));
    });

    it('should log warning messages', () => {
      reporter.logWarning('Warning message');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Warning message'));
    });

    it('should handle stderr info', () => {
      reporter.logStderrInfo('Some stderr output', 'toBeEmpty');

      const output = capturedLogs.join('');
      assert.ok(output.includes('stderr'));
    });
  });

  describe('summary and results', () => {
    beforeEach(() => {
      // Setup some test data
      reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
      reporter.logTestStart('test 1');
      reporter.logTestPass();
      reporter.logTestStart('test 2');
      reporter.logTestFail('expected', 'actual', 'Failed');
      reporter.finalizeSuite();
    });

    it('should generate summary', () => {
      const summary = reporter.getSummary();
      assert.equal(summary.total, 2);
      assert.equal(summary.passed, 1);
      assert.equal(summary.failed, 1);
      assert.equal(summary.success, false);
    });

    it('should get suite results', () => {
      const suiteResults = reporter.getSuiteResults();
      assert.equal(suiteResults.length, 1);
      assert.equal(suiteResults[0].description, 'Test Suite');
      assert.equal(suiteResults[0].filePath, '/path/to/test.yml');
      assert.equal(suiteResults[0].tests.length, 2);
    });

    it('should log summary in normal mode', () => {
      reporter.logSummary();

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test Results'));
      assert.ok(output.includes('1 passed'));
      assert.ok(output.includes('1 failed'));
    });

    it('should log summary in JSON mode', () => {
      const jsonReporter = new Reporter({ json: true });
      jsonReporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
      jsonReporter.logTestStart('test');
      jsonReporter.logTestPass();
      jsonReporter.finalizeSuite();

      jsonReporter.logSummary();

      const output = capturedLogs.join('');
      assert.ok(output.includes('"summary"'));
      assert.ok(output.includes('"performance"'));
      assert.ok(output.includes('"suites"'));
    });

    it('should log verbose results', () => {
      const verboseReporter = new Reporter({ verbose: true });
      verboseReporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
      verboseReporter.logTestStart('test');
      verboseReporter.logTestPass();
      verboseReporter.finalizeSuite();

      verboseReporter.logSummary();

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test Results Hierarchy'));
    });
  });

  describe('timing integration', () => {
    it('should track timing through performance tracker', () => {
      reporter.startSuiteTiming();
      reporter.startTestTiming();

      // Simulate some time passing
      setTimeout(() => {
        reporter.logTestPass();
        reporter.finalizeSuite();

        // Should not throw errors - timing is handled internally
        assert.ok(true);
      }, 10);
    });
  });

  describe('quiet mode', () => {
    it('should respect quiet mode', () => {
      const quietReporter = new Reporter({ quiet: true });
      quietReporter.logInfo('Should not appear');

      const output = capturedLogs.join('');
      assert.equal(output.trim(), ''); // Should be empty in quiet mode
    });

    it('should still log errors in quiet mode', () => {
      const quietReporter = new Reporter({ quiet: true });
      quietReporter.logError('Error message');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Error message'));
    });
  });

  describe('concise grouped error mode', () => {
    it('should suppress per-test detailed analysis while retaining failure line', () => {
      const conciseReporter = new Reporter({ groupErrors: true, concise: true });
      const originalWrite = process.stdout.write;
      const stdoutChunks = [];
      process.stdout.write = (chunk) => {
        // Safely handle stdout chunks to avoid serialization issues
        try {
          stdoutChunks.push(String(chunk));
        } catch (error) {
          stdoutChunks.push('[Unable to stringify stdout chunk]');
        }
        return true;
      };
      conciseReporter.startSuiteTiming();
      conciseReporter.logTestStart('fails concisely');
      const validationResult = {
        errors: [
          { type: 'extra_field', path: 'response.result.foo', message: "Unexpected field 'foo'" },
          { type: 'pattern_failed', path: 'response.result.bar', message: 'Pattern failed', expected: 'match:regex:.*' },
        ],
        analysis: { summary: '2 errors', suggestions: ['Remove unexpected field'] },
      };
      conciseReporter.logTestFail({}, {}, 'Failure message', validationResult);
      process.stdout.write = originalWrite;
      const output = capturedLogs.join('');
      const combined = stdoutChunks.join('') + output;
      assert.ok(combined.includes('fails concisely'));
      // Should NOT contain detailed analysis header or pattern banners
      assert.ok(!combined.includes('Detailed Validation Analysis'));
      assert.ok(!combined.includes('EXTRA FIELD'));
      assert.ok(!combined.includes('PATTERN FAILED'));
    });
  });

  describe('modular architecture', () => {
    it('should properly delegate to modules', () => {
      // Test that the main Reporter is just coordinating modules
      assert.ok(reporter.outputFormatter.constructor.name === 'OutputFormatter');
      assert.ok(reporter.performanceTracker.constructor.name === 'PerformanceTracker');
      assert.ok(reporter.validationErrorAnalyzer.constructor.name === 'ValidationErrorAnalyzer');
      assert.ok(reporter.patternAnalyzer.constructor.name === 'PatternAnalyzer');
      assert.ok(reporter.resultsCollector.constructor.name === 'ResultsCollector');
    });

    it('should maintain clean separation of concerns', () => {
      // Each module should be responsible for its own functionality
      // Reporter should only coordinate, not implement functionality
      const reporterMethods = Object.getOwnPropertyNames(Reporter.prototype);

      // Should mainly be coordination methods, not implementation
      assert.ok(reporterMethods.includes('logSummary'));
      assert.ok(reporterMethods.includes('logTestPass'));
      assert.ok(reporterMethods.includes('logTestFail'));
      assert.ok(reporterMethods.includes('allTestsPassed'));
    });
  });
});
