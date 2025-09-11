import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Reporter } from '../../src/test-engine/reporter.js';
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

  describe('constructor options', () => {
    it('should initialize with verbose option', () => {
      const verboseReporter = new Reporter({ verbose: true });
      assert.equal(verboseReporter.verbose, true);
      assert.equal(verboseReporter.debug, false);
      assert.equal(verboseReporter.timing, false);
      assert.equal(verboseReporter.json, false);
      assert.equal(verboseReporter.quiet, false);
    });

    it('should initialize with all options', () => {
      const reporter = new Reporter({
        verbose: true,
        debug: true,
        timing: true,
        json: true,
        quiet: true,
      });
      assert.equal(reporter.verbose, true);
      assert.equal(reporter.debug, true);
      assert.equal(reporter.timing, true);
      assert.equal(reporter.json, true);
      assert.equal(reporter.quiet, true);
    });

    it('should initialize performance metrics', () => {
      const reporter = new Reporter();
      assert.ok(reporter.performanceMetrics);
      assert.equal(reporter.performanceMetrics.serverStartTime, 0);
      assert.equal(reporter.performanceMetrics.handshakeTime, 0);
      assert.equal(reporter.performanceMetrics.totalTestTime, 0);
      assert.equal(reporter.performanceMetrics.communicationTime, 0);
    });
  });

  describe('timing methods', () => {
    it('should start suite timing', () => {
      reporter.startSuiteTiming();
      assert.ok(reporter.suiteStartTime);
      assert.ok(reporter.suiteStartTime > 0);
    });

    it('should start test timing', () => {
      reporter.startTestTiming();
      assert.ok(reporter.testStartTime);
      assert.ok(reporter.testStartTime > 0);
    });
  });

  describe('logDebug', () => {
    it('should not log debug in normal mode', () => {
      reporter.logDebug('Debug message', { data: 'test' });

      const output = capturedLogs.join('');
      assert.equal(output, '');
    });

    it('should log debug in debug mode', () => {
      const debugReporter = new Reporter({ debug: true });
      debugReporter.logDebug('Debug message', { data: 'test' });

      const output = capturedLogs.join('');
      assert.ok(output.includes('DEBUG'));
      assert.ok(output.includes('Debug message'));
      assert.ok(output.includes('"data": "test"'));
    });

    it('should not log debug in quiet mode even with debug enabled', () => {
      const quietDebugReporter = new Reporter({ debug: true, quiet: true });
      quietDebugReporter.logDebug('Debug message');

      const output = capturedLogs.join('');
      assert.equal(output, '');
    });

    it('should log debug without data', () => {
      const debugReporter = new Reporter({ debug: true });
      debugReporter.logDebug('Debug message only');

      const output = capturedLogs.join('');
      assert.ok(output.includes('DEBUG'));
      assert.ok(output.includes('Debug message only'));
    });
  });

  describe('logMCPCommunication', () => {
    it('should not log MCP communication in normal mode', () => {
      reporter.logMCPCommunication('SEND', { jsonrpc: '2.0', method: 'tools/list', id: '1' });

      const output = capturedLogs.join('');
      assert.equal(output, '');
    });

    it('should log MCP SEND communication in debug mode', () => {
      const debugReporter = new Reporter({ debug: true });
      debugReporter.logMCPCommunication('SEND', { jsonrpc: '2.0', method: 'tools/list', id: '1' });

      const output = capturedLogs.join('');
      assert.ok(output.includes('MCP SEND'));
      assert.ok(output.includes('→'));
      assert.ok(output.includes('tools/list'));
      assert.ok(output.includes('"method": "tools/list"'));
    });

    it('should log MCP RECV communication in debug mode', () => {
      const debugReporter = new Reporter({ debug: true });
      debugReporter.logMCPCommunication('RECV', { jsonrpc: '2.0', id: '1', result: {} });

      const output = capturedLogs.join('');
      assert.ok(output.includes('MCP RECV'));
      assert.ok(output.includes('←'));
      assert.ok(output.includes('response'));
      assert.ok(output.includes('"result": {}'));
    });

    it('should not log MCP communication in quiet mode', () => {
      const quietDebugReporter = new Reporter({ debug: true, quiet: true });
      quietDebugReporter.logMCPCommunication('SEND', { jsonrpc: '2.0', method: 'tools/list', id: '1' });

      const output = capturedLogs.join('');
      assert.equal(output, '');
    });
  });

  describe('logPerformance', () => {
    it('should not log performance in normal mode', () => {
      reporter.logPerformance('Test operation', 150);

      const output = capturedLogs.join('');
      assert.equal(output, '');
    });

    it('should log performance in timing mode', () => {
      const timingReporter = new Reporter({ timing: true });
      timingReporter.logPerformance('Test operation', 150);

      const output = capturedLogs.join('');
      assert.ok(output.includes('TIMING'));
      assert.ok(output.includes('Test operation: 150ms'));
    });

    it('should not log performance in quiet mode', () => {
      const quietTimingReporter = new Reporter({ timing: true, quiet: true });
      quietTimingReporter.logPerformance('Test operation', 150);

      const output = capturedLogs.join('');
      assert.equal(output, '');
    });
  });

  describe('recordPerformance', () => {
    it('should record valid performance metrics', () => {
      reporter.recordPerformance('serverStartTime', 500);
      reporter.recordPerformance('handshakeTime', 200);
      reporter.recordPerformance('totalTestTime', 1000);
      reporter.recordPerformance('communicationTime', 300);

      assert.equal(reporter.performanceMetrics.serverStartTime, 500);
      assert.equal(reporter.performanceMetrics.handshakeTime, 200);
      assert.equal(reporter.performanceMetrics.totalTestTime, 1000);
      assert.equal(reporter.performanceMetrics.communicationTime, 300);
    });

    it('should ignore invalid performance metrics', () => {
      const initialMetrics = { ...reporter.performanceMetrics };
      reporter.recordPerformance('invalidMetric', 500);

      assert.deepEqual(reporter.performanceMetrics, initialMetrics);
    });
  });

  describe('finalizeSuite', () => {
    it('should finalize current suite', () => {
      reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
      reporter.logTestStart('Test 1');
      reporter.logTestPass();

      assert.ok(reporter.currentSuite);
      reporter.finalizeSuite();

      assert.equal(reporter.currentSuite, null);
      assert.equal(reporter.suiteResults.length, 1);
      assert.equal(reporter.suiteResults[0].description, 'Test Suite');
      assert.equal(reporter.suiteResults[0].tests.length, 1);
    });

    it('should handle finalize without current suite', () => {
      const initialSuiteResults = reporter.suiteResults.length;
      reporter.finalizeSuite();

      assert.equal(reporter.suiteResults.length, initialSuiteResults);
    });
  });

  describe('verbose mode', () => {
    it('should not log non-verbose output in verbose mode', () => {
      const verboseReporter = new Reporter({ verbose: true });
      verboseReporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
      verboseReporter.logTestStart('Test case');
      verboseReporter.logTestPass();

      const output = capturedLogs.join('');
      // In verbose mode, these should not produce immediate output
      assert.ok(!output.includes('📋 Test Suite'));
      assert.ok(!output.includes('PASS'));
    });
  });

  describe('quiet mode', () => {
    it('should not log info messages in quiet mode', () => {
      const quietReporter = new Reporter({ quiet: true });
      quietReporter.logInfo('Test info message');

      const output = capturedLogs.join('');
      assert.equal(output, '');
    });

    it('should still log errors and warnings in quiet mode', () => {
      const quietReporter = new Reporter({ quiet: true });
      quietReporter.logError('Test error');
      quietReporter.logWarning('Test warning');

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test error'));
      assert.ok(output.includes('Test warning'));
    });
  });

  describe('timing integration', () => {
    it('should include timing in test pass output when timing enabled', () => {
      const timingReporter = new Reporter({ timing: true });
      timingReporter.logSuiteHeader('Test Suite', '/path/to/test.yml'); // Initialize currentSuite
      timingReporter.logTestStart('Test with timing');
      timingReporter.logTestPass();

      const output = capturedLogs.join('');
      assert.ok(output.includes('PASS'));
      assert.ok(output.includes('ms'));
    });    it('should include timing in test fail output when timing enabled', () => {
      const timingReporter = new Reporter({ timing: true });
      timingReporter.logSuiteHeader('Test Suite', '/path/to/test.yml'); // Initialize currentSuite
      timingReporter.logTestStart('Test with timing');
      timingReporter.logTestFail('expected', 'actual', 'Failed test');

      const output = capturedLogs.join('');
      assert.ok(output.includes('FAIL'));
      assert.ok(output.includes('ms'));
    });    it('should include timing suffix when provided', () => {
      reporter.logTestPass('(custom timing)');

      const output = capturedLogs.join('');
      assert.ok(output.includes('PASS'));
      assert.ok(output.includes('(custom timing)'));
    });
  });

  describe('JSON output', () => {
    it('should output JSON results when json mode enabled', () => {
      const jsonReporter = new Reporter({ json: true });
      jsonReporter.passedTests = 2;
      jsonReporter.failedTests = 1;
      jsonReporter.totalTests = 3;
      jsonReporter.performanceMetrics.serverStartTime = 100;

      // Simulate some time passing for non-zero duration
      jsonReporter.startTime = Date.now() - 500; // 500ms ago

      jsonReporter.logSummary();

      const output = capturedLogs.join('');
      const jsonOutput = JSON.parse(output);

      assert.equal(jsonOutput.summary.total, 3);
      assert.equal(jsonOutput.summary.passed, 2);
      assert.equal(jsonOutput.summary.failed, 1);
      assert.equal(jsonOutput.summary.success, false);
      assert.ok(jsonOutput.summary.duration > 0); // Should be > 0 now
      assert.equal(jsonOutput.performance.serverStartTime, 100);
      assert.ok(Array.isArray(jsonOutput.suites));
    });
  });

  describe('logPerformanceMetrics', () => {
    it('should not log performance metrics when timing disabled', () => {
      reporter.performanceMetrics.serverStartTime = 100;
      reporter.logPerformanceMetrics();

      const output = capturedLogs.join('');
      assert.equal(output, '');
    });

    it('should log performance metrics when timing enabled', () => {
      const timingReporter = new Reporter({ timing: true });
      timingReporter.performanceMetrics.serverStartTime = 100;
      timingReporter.performanceMetrics.handshakeTime = 50;
      timingReporter.performanceMetrics.totalTestTime = 0; // Should not log zero values
      timingReporter.logPerformanceMetrics();

      const output = capturedLogs.join('');
      assert.ok(output.includes('Performance Metrics'));
      assert.ok(output.includes('serverStartTime: 100ms'));
      assert.ok(output.includes('handshakeTime: 50ms'));
      assert.ok(!output.includes('totalTestTime: 0ms'));
    });
  });

  describe('containsPatterns', () => {
    it('should detect string patterns', () => {
      assert.equal(reporter.containsPatterns('match:type:string'), true);
      assert.equal(reporter.containsPatterns('regular string'), false);
    });

    it('should detect object pattern keys', () => {
      const objectWithPattern = {
        'match:arrayElements': { name: 'test' },
      };
      assert.equal(reporter.containsPatterns(objectWithPattern), true);

      const objectWithPartial = {
        'match:partial': { field: 'value' },
      };
      assert.equal(reporter.containsPatterns(objectWithPartial), true);

      const objectWithExtractField = {
        'match:extractField': 'tools.*.name',
      };
      assert.equal(reporter.containsPatterns(objectWithExtractField), true);
    });

    it('should detect nested patterns', () => {
      const nestedObject = {
        result: {
          tools: 'match:arrayLength:5',
        },
      };
      assert.equal(reporter.containsPatterns(nestedObject), true);
    });

    it('should handle non-objects', () => {
      assert.equal(reporter.containsPatterns(null), false);
      assert.equal(reporter.containsPatterns(undefined), false);
      assert.equal(reporter.containsPatterns(123), false);
    });
  });

  describe('getErrorIcon', () => {
    it('should return correct icons for known error types', () => {
      assert.equal(reporter.getErrorIcon('missing_field'), '🚫');
      assert.equal(reporter.getErrorIcon('extra_field'), '➕');
      assert.equal(reporter.getErrorIcon('type_mismatch'), '🔀');
      assert.equal(reporter.getErrorIcon('pattern_failed'), '🎭');
      assert.equal(reporter.getErrorIcon('value_mismatch'), '≠');
      assert.equal(reporter.getErrorIcon('length_mismatch'), '📏');
    });

    it('should return default icon for unknown error types', () => {
      assert.equal(reporter.getErrorIcon('unknown_error'), '❌');
    });
  });

  describe('enhanced validation errors', () => {
    it('should display enhanced validation errors', () => {
      const validationResult = {
        errors: [
          {
            type: 'type_mismatch',
            path: 'result.tools',
            message: 'Expected array, got string',
            expected: 'array',
            actual: 'string',
            suggestion: 'Check that the response returns an array of tools',
          },
          {
            type: 'missing_field',
            path: 'result.tools.0.name',
            message: 'Required field "name" is missing',
            suggestion: 'Ensure all tools have a name property',
          },
        ],
        analysis: {
          summary: '2 validation errors found',
          suggestions: [
            'Verify the server response format',
            'Check tool schema compliance',
          ],
        },
      };

      reporter.logTestFail('expected', 'actual', 'Validation failed', validationResult);

      const output = capturedLogs.join('');
      assert.ok(output.includes('Detailed Validation Analysis'));
      assert.ok(output.includes('TYPE MISMATCH'));
      assert.ok(output.includes('MISSING FIELD'));
      assert.ok(output.includes('Expected array, got string'));
      assert.ok(output.includes('Top Recommendations'));
    });

    it('should handle validation errors without analysis', () => {
      const validationResult = {
        errors: [
          {
            type: 'value_mismatch',
            path: 'result.status',
            message: 'Expected "success", got "error"',
            expected: 'success',
            actual: 'error',
          },
        ],
      };

      reporter.logTestFail('expected', 'actual', null, validationResult);

      const output = capturedLogs.join('');
      assert.ok(output.includes('VALUE MISMATCH'));
      assert.ok(output.includes('Expected "success", got "error"'));
    });

    it('should limit displayed errors to 5', () => {
      const validationResult = {
        errors: Array.from({ length: 8 }, (_, i) => ({
          type: 'type_mismatch',
          path: `result.field${i}`,
          message: `Error ${i}`,
          expected: 'string',
          actual: 'number',
        })),
      };

      reporter.logTestFail('expected', 'actual', null, validationResult);

      const output = capturedLogs.join('');
      assert.ok(output.includes('and 3 more validation error(s)'));
    });
  });

  describe('pattern analysis', () => {
    it('should create explanations for type patterns', () => {
      const expected = { status: 'match:type:string' };
      const actual = { status: 123 };

      const explanation = reporter.createPatternExplanation(expected, actual);
      assert.ok(explanation.includes('Type validation'));
      assert.ok(explanation.includes('expected \'string\''));
      assert.ok(explanation.includes('got \'number\''));
    });

    it('should create explanations for arrayLength patterns', () => {
      const expected = { tools: 'match:arrayLength:5' };
      const actual = { tools: ['tool1', 'tool2'] };

      const explanation = reporter.createPatternExplanation(expected, actual);
      assert.ok(explanation.includes('Length validation'));
      assert.ok(explanation.includes('expected 5'));
      assert.ok(explanation.includes('got 2'));
    });

    it('should create explanations for contains patterns', () => {
      const expected = { message: 'match:contains:success' };
      const actual = { message: 'Operation failed' };

      const explanation = reporter.createPatternExplanation(expected, actual);
      assert.ok(explanation.includes('Contains validation'));
      assert.ok(explanation.includes('looking for \'success\''));
    });

    it('should handle arrayElements patterns', () => {
      const expected = {
        tools: {
          'match:arrayElements': { name: 'string' },
        },
      };
      const actual = { tools: [{ name: 'tool1' }, { name: 'tool2' }] };

      const explanation = reporter.createPatternExplanation(expected, actual);
      assert.ok(explanation.includes('arrayElements pattern'));
      assert.ok(explanation.includes('Validating 2 array items'));
    });

    it('should handle partial patterns', () => {
      const expected = {
        'match:partial': { status: 'success' },
      };
      const actual = { status: 'success', extra: 'data' };

      const explanation = reporter.createPatternExplanation(expected, actual);
      assert.ok(explanation.includes('partial matching'));
      assert.ok(explanation.includes('Only validating specified fields'));
    });

    it('should handle extractField patterns', () => {
      const expected = {
        'match:extractField': 'tools.*.name',
      };
      const actual = { tools: [{ name: 'tool1' }] };

      const explanation = reporter.createPatternExplanation(expected, actual);
      assert.ok(explanation.includes('field extraction'));
      assert.ok(explanation.includes('tools.*.name'));
    });
  });

  describe('verbose results', () => {
    it('should log verbose test results hierarchy', () => {
      // Clear any previous logs
      capturedLogs.length = 0;

      const verboseReporter = new Reporter({ verbose: true });

      // Simulate a complete test suite
      verboseReporter.logSuiteHeader('Test Suite 1', '/path/to/test1.yml');
      verboseReporter.logTestStart('Test 1');
      verboseReporter.logTestPass();
      verboseReporter.logTestStart('Test 2');
      verboseReporter.logTestFail('expected', 'actual', 'Test failed');
      verboseReporter.finalizeSuite();

      verboseReporter.logSummary();

      const output = capturedLogs.join('');
      assert.ok(output.includes('Test Results Hierarchy'));
      assert.ok(output.includes('Test Suite 1'));
      assert.ok(output.includes('/path/to/test1.yml'));
      assert.ok(output.includes('Test 1')); // Check for test name without emoji
      assert.ok(output.includes('Test 2')); // Check for test name without emoji
      assert.ok(output.includes('Test failed'));
    });

    it('should include timing in verbose results when enabled', () => {
      const verboseTimingReporter = new Reporter({ verbose: true, timing: true });

      verboseTimingReporter.logSuiteHeader('Timed Suite', '/path/test.yml');
      verboseTimingReporter.logTestStart('Timed Test');
      verboseTimingReporter.logTestPass();
      verboseTimingReporter.finalizeSuite();

      verboseTimingReporter.logSummary();

      const output = capturedLogs.join('');
      assert.ok(output.includes('📁 Timed Suite'));
      assert.ok(output.includes('ms')); // Should include timing
    });
  });

  describe('intelligent diff', () => {
    it('should display standard diff for non-pattern cases', () => {
      const expected = { status: 'success', value: 42 };
      const actual = { status: 'error', value: 24 };

      reporter.displayIntelligentDiff(expected, actual);

      const output = capturedLogs.join('');
      assert.ok(output.includes('Diff:'));
    });

    it('should display pattern analysis for pattern cases', () => {
      const expected = { status: 'match:type:string' };
      const actual = { status: 123 };

      reporter.displayIntelligentDiff(expected, actual);

      const output = capturedLogs.join('');
      assert.ok(output.includes('Pattern Analysis'));
      assert.ok(output.includes('Type validation'));
    });
  });
});
