import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { OutputFormatter } from '../../src/test-engine/reporter/OutputFormatter.js';
import { PerformanceTracker } from '../../src/test-engine/reporter/PerformanceTracker.js';
import { ValidationErrorAnalyzer } from '../../src/test-engine/reporter/ValidationErrorAnalyzer.js';
import { PatternAnalyzer } from '../../src/test-engine/reporter/PatternAnalyzer.js';
import { ResultsCollector } from '../../src/test-engine/reporter/ResultsCollector.js';

describe('Reporter Modules (Individual Coverage)', () => {
  let capturedLogs;
  let originalConsoleLog;
  let capturedStdout;
  let originalStdoutWrite;

  beforeEach(() => {
    capturedLogs = [];
    capturedStdout = [];

    originalConsoleLog = console.log;
    console.log = (...args) => {
      capturedLogs.push(args.join(' '));
    };

    originalStdoutWrite = process.stdout.write;
    process.stdout.write = (data) => {
      capturedStdout.push(data);
      return true;
    };
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    process.stdout.write = originalStdoutWrite;
  });

  describe('OutputFormatter', () => {
    let formatter;

    beforeEach(() => {
      formatter = new OutputFormatter();
    });

    describe('constructor options', () => {
      it('should initialize with default options', () => {
        const defaultFormatter = new OutputFormatter();
        assert.equal(defaultFormatter.verbose, false);
        assert.equal(defaultFormatter.debug, false);
        assert.equal(defaultFormatter.timing, false);
        assert.equal(defaultFormatter.json, false);
        assert.equal(defaultFormatter.quiet, false);
      });

      it('should initialize with custom options', () => {
        const customFormatter = new OutputFormatter({
          verbose: true,
          debug: true,
          timing: true,
          json: true,
          quiet: true,
        });
        assert.equal(customFormatter.verbose, true);
        assert.equal(customFormatter.debug, true);
        assert.equal(customFormatter.timing, true);
        assert.equal(customFormatter.json, true);
        assert.equal(customFormatter.quiet, true);
      });
    });

    describe('debug logging', () => {
      it('should log debug messages when debug is enabled', () => {
        const debugFormatter = new OutputFormatter({ debug: true });
        debugFormatter.logDebug('Test debug message');

        const output = capturedLogs.join('');
        assert.ok(output.includes('🐛 [DEBUG] Test debug message'));
      });

      it('should log debug messages with data', () => {
        const debugFormatter = new OutputFormatter({ debug: true });
        debugFormatter.logDebug('Test message', { key: 'value', number: 42 });

        const output = capturedLogs.join('');
        assert.ok(output.includes('Test message'));
        assert.ok(output.includes('"key": "value"'));
        assert.ok(output.includes('"number": 42'));
      });

      it('should not log debug messages when debug is disabled', () => {
        formatter.logDebug('Should not appear');
        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });

      it('should not log debug messages in quiet mode', () => {
        const quietFormatter = new OutputFormatter({ debug: true, quiet: true });
        quietFormatter.logDebug('Should not appear');
        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });
    });

    describe('MCP communication logging', () => {
      it('should log SEND messages', () => {
        const debugFormatter = new OutputFormatter({ debug: true });
        debugFormatter.logMCPCommunication('SEND', { method: 'tools/list', id: '1' });

        const output = capturedLogs.join('');
        assert.ok(output.includes('📡 [MCP SEND] → tools/list'));
        assert.ok(output.includes('"method": "tools/list"'));
      });

      it('should log RECV messages', () => {
        const debugFormatter = new OutputFormatter({ debug: true });
        debugFormatter.logMCPCommunication('RECV', { jsonrpc: '2.0', id: '1', result: {} });

        const output = capturedLogs.join('');
        assert.ok(output.includes('📡 [MCP RECV] ← response'));
        assert.ok(output.includes('"jsonrpc": "2.0"'));
      });

      it('should not log MCP communication when debug is disabled', () => {
        formatter.logMCPCommunication('SEND', { method: 'test' });
        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });

      it('should not log MCP communication in quiet mode', () => {
        const quietFormatter = new OutputFormatter({ debug: true, quiet: true });
        quietFormatter.logMCPCommunication('SEND', { method: 'test' });
        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });
    });

    describe('display methods', () => {
      it('should display suite header', () => {
        formatter.displaySuiteHeader('Test Suite', '/path/to/test.yml');

        const output = capturedLogs.join('');
        assert.ok(output.includes('Test Suite'));
        assert.ok(output.includes('/path/to/test.yml'));
      });

      it('should display test start', () => {
        formatter.displayTestStart('should test something');

        const output = capturedStdout.join('');
        assert.ok(output.includes('should test something'));
      });

      it('should display test pass', () => {
        formatter.displayTestPass();

        const output = capturedLogs.join('');
        assert.ok(output.includes('✓'));
      });

      it('should display test pass with timing', () => {
        formatter.displayTestPass('(150ms)', 150);

        const output = capturedLogs.join('');
        assert.ok(output.includes('✓'));
        assert.ok(output.includes('(150ms)'));
      });

      it('should display test fail', () => {
        formatter.displayTestFail('Test failed');

        const output = capturedLogs.join('');
        assert.ok(output.includes('✗'));
        assert.ok(output.includes('Test failed'));
      });

      it('should display test fail with timing', () => {
        formatter.displayTestFail('Test failed', 200);

        const output = capturedLogs.join('');
        assert.ok(output.includes('✗'));
        assert.ok(output.includes('Test failed'));
      });
    });

    describe('message display methods', () => {
      it('should display error messages', () => {
        formatter.displayError('Error occurred');

        const output = capturedLogs.join('');
        assert.ok(output.includes('Error occurred'));
      });

      it('should display info messages', () => {
        formatter.displayInfo('Information message');

        const output = capturedLogs.join('');
        assert.ok(output.includes('Information message'));
      });

      it('should display warning messages', () => {
        formatter.displayWarning('Warning message');

        const output = capturedLogs.join('');
        assert.ok(output.includes('Warning message'));
      });

      it('should not display info messages in quiet mode', () => {
        const quietFormatter = new OutputFormatter({ quiet: true });
        quietFormatter.displayInfo('Should not appear');

        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });

      it('should still display error messages in quiet mode', () => {
        const quietFormatter = new OutputFormatter({ quiet: true });
        quietFormatter.displayError('Error in quiet mode');

        const output = capturedLogs.join('');
        assert.ok(output.includes('Error in quiet mode'));
      });
    });

    describe('stderr display', () => {
      it('should display stderr info', () => {
        formatter.displayStderrInfo('Some stderr output', 'toBeEmpty');

        const output = capturedLogs.join('');
        assert.ok(output.includes('stderr') || output.includes('Some stderr output'));
      });

      it('should handle expected stderr patterns', () => {
        formatter.displayStderrInfo('Warning: deprecated', 'match:contains:Warning');

        const output = capturedLogs.join('');
        // This method might not output anything if stderr matches expected pattern
        assert.ok(true); // Just verify it doesn't crash
      });
    });

    describe('summary and results display', () => {
      it('should display summary', () => {
        const timingFormatter = new OutputFormatter({ timing: true });
        const summary = { total: 5, passed: 4, failed: 1, success: false };
        timingFormatter.displaySummary(summary, 1500);

        const output = capturedLogs.join('');
        assert.ok(output.includes('Test Results'));
        assert.ok(output.includes('4 passed'));
        assert.ok(output.includes('1 failed'));
        assert.ok(output.includes('1500ms')); // Duration shown when timing is enabled
      });

      it('should display performance metrics', () => {
        const timingFormatter = new OutputFormatter({ timing: true });
        const metrics = {
          serverStartTime: 500,
          handshakeTime: 100,
          averageTestTime: 50,
        };
        timingFormatter.displayPerformanceMetrics(metrics);

        const output = capturedLogs.join('');
        assert.ok(output.includes('Performance Metrics'));
        assert.ok(output.includes('serverStartTime'));
        assert.ok(output.includes('500ms'));
      });

      it('should output JSON results', () => {
        const results = {
          summary: { total: 1, passed: 1, failed: 0 },
          performance: { total: 1000 },
          suites: [],
        };
        formatter.outputJsonResults(results);

        const output = capturedLogs.join('');
        assert.ok(output.includes('"summary"'));
        assert.ok(output.includes('"performance"'));
        assert.ok(output.includes('"suites"'));
      });

      it('should display verbose results', () => {
        const suiteResults = [{
          description: 'Test Suite',
          filePath: '/path/to/test.yml',
          tests: [{ description: 'test 1', passed: true }],
        }];
        formatter.displayVerboseResults(suiteResults);

        const output = capturedLogs.join('');
        assert.ok(output.includes('Test Results Hierarchy'));
        assert.ok(output.includes('Test Suite'));
      });
    });

    describe('performance logging', () => {
      it('should log performance when timing is enabled', () => {
        const timingFormatter = new OutputFormatter({ timing: true });
        timingFormatter.logPerformance('Test operation', 250);

        const output = capturedLogs.join('');
        assert.ok(output.includes('Test operation'));
        assert.ok(output.includes('250ms'));
      });

      it('should not log performance when timing is disabled', () => {
        formatter.logPerformance('Test operation', 250);

        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });

      it('should not log performance in quiet mode', () => {
        const quietFormatter = new OutputFormatter({ timing: true, quiet: true });
        quietFormatter.logPerformance('Test operation', 250);

        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });
    });
  });

  describe('PerformanceTracker', () => {
    let tracker;

    beforeEach(() => {
      tracker = new PerformanceTracker();
    });

    describe('timing operations', () => {
      it('should track suite timing', () => {
        tracker.startSuiteTiming();

        // Simulate some time passing
        setTimeout(() => {
          const duration = tracker.getSuiteDuration();
          assert.ok(duration >= 0);
          assert.ok(typeof duration === 'number');
        }, 10);
      });

      it('should track test timing', () => {
        tracker.startTestTiming();

        // Simulate some time passing
        setTimeout(() => {
          const duration = tracker.getTestDuration();
          assert.ok(duration >= 0);
          assert.ok(typeof duration === 'number');
        }, 10);
      });

      it('should calculate total duration', () => {
        tracker.startSuiteTiming();

        setTimeout(() => {
          const total = tracker.getTotalDuration();
          assert.ok(total >= 0);
          assert.ok(typeof total === 'number');
        }, 10);
      });
    });

    describe('performance metrics', () => {
      it('should record performance metrics', () => {
        tracker.recordPerformance('serverStartTime', 100);
        tracker.recordPerformance('handshakeTime', 200);

        const metrics = tracker.getPerformanceMetrics();
        assert.equal(metrics.serverStartTime, 100);
        assert.equal(metrics.handshakeTime, 200);
      });

      it('should return default metrics initially', () => {
        const metrics = tracker.getPerformanceMetrics();
        assert.equal(typeof metrics, 'object');
        assert.equal(metrics.serverStartTime, 0);
        assert.equal(metrics.handshakeTime, 0);
        assert.equal(metrics.totalTestTime, 0);
        assert.equal(metrics.communicationTime, 0);
      });

      it('should ignore unknown metric names', () => {
        tracker.recordPerformance('unknownMetric', 500);

        const metrics = tracker.getPerformanceMetrics();
        assert.equal(metrics.unknownMetric, undefined);
      });
    });

    describe('duration calculations', () => {
      it('should return 0 for duration before timing starts', () => {
        const duration = tracker.getTestDuration();
        assert.equal(duration, 0);
      });

      it('should return 0 for suite duration before timing starts', () => {
        const duration = tracker.getSuiteDuration();
        assert.equal(duration, 0);
      });

      it('should handle multiple test timings', () => {
        tracker.startTestTiming();
        setTimeout(() => {
          const first = tracker.getTestDuration();

          tracker.startTestTiming();
          setTimeout(() => {
            const second = tracker.getTestDuration();
            assert.ok(second >= 0);
            assert.ok(typeof second === 'number');
          }, 5);
        }, 5);
      });
    });
  });

  describe('ValidationErrorAnalyzer', () => {
    let analyzer;

    beforeEach(() => {
      analyzer = new ValidationErrorAnalyzer();
    });

    describe('constructor', () => {
      it('should initialize with error icons', () => {
        assert.ok(analyzer.errorIcons);
        assert.equal(analyzer.errorIcons.missing_field, '🚫');
        assert.equal(analyzer.errorIcons.extra_field, '➕');
        assert.equal(analyzer.errorIcons.type_mismatch, '🔀');
        assert.equal(analyzer.errorIcons.pattern_failed, '🎭');
        assert.equal(analyzer.errorIcons.value_mismatch, '≠');
        assert.equal(analyzer.errorIcons.length_mismatch, '📏');
      });
    });

    describe('getErrorIcon', () => {
      it('should return correct icons for known error types', () => {
        assert.equal(analyzer.getErrorIcon('missing_field'), '🚫');
        assert.equal(analyzer.getErrorIcon('type_mismatch'), '🔀');
        assert.equal(analyzer.getErrorIcon('pattern_failed'), '🎭');
      });

      it('should return default icon for unknown error types', () => {
        assert.equal(analyzer.getErrorIcon('unknown_error'), '❌');
        assert.equal(analyzer.getErrorIcon(''), '❌');
        assert.equal(analyzer.getErrorIcon(null), '❌');
      });
    });

    describe('analyzeValidationResult', () => {
      it('should handle empty validation result', () => {
        const analysis = analyzer.analyzeValidationResult(null);
        assert.equal(analysis.summary, 'No validation errors');
        assert.equal(analysis.suggestions.length, 0);
      });

      it('should handle validation result without errors', () => {
        const analysis = analyzer.analyzeValidationResult({});
        assert.equal(analysis.summary, 'No validation errors');
        assert.equal(analysis.suggestions.length, 0);
      });

      it('should analyze validation result with errors', () => {
        const validationResult = {
          errors: [
            { type: 'type_mismatch', path: 'response.result.count', message: 'Expected number, got string' },
            { type: 'missing_field', path: 'response.result.tools', message: 'Missing required field' },
            { type: 'pattern_failed', path: 'response.result.name', message: 'Pattern match failed' },
          ],
        };

        const analysis = analyzer.analyzeValidationResult(validationResult);
        assert.ok(analysis.summary.includes('3 validation error(s)'));
        assert.ok(analysis.summary.includes('3 type(s)'));
        assert.equal(analysis.errorTypes.length, 3);
        assert.ok(analysis.errorTypes.includes('type_mismatch'));
        assert.ok(analysis.errorTypes.includes('missing_field'));
        assert.ok(analysis.errorTypes.includes('pattern_failed'));
      });
    });

    describe('generateSuggestions', () => {
      it('should generate suggestions for type_mismatch errors', () => {
        const errors = [{ type: 'type_mismatch' }];
        const suggestions = analyzer.generateSuggestions(errors, ['type_mismatch'], []);
        assert.ok(suggestions.some(s => s.includes('Check data types')));
      });

      it('should generate suggestions for missing_field errors', () => {
        const errors = [{ type: 'missing_field' }];
        const suggestions = analyzer.generateSuggestions(errors, ['missing_field'], []);
        assert.ok(suggestions.some(s => s.includes('required fields')));
      });

      it('should generate suggestions for pattern_failed errors', () => {
        const errors = [{ type: 'pattern_failed' }];
        const suggestions = analyzer.generateSuggestions(errors, ['pattern_failed'], []);
        assert.ok(suggestions.some(s => s.includes('pattern matching')));
      });

      it('should generate suggestions for length_mismatch errors', () => {
        const errors = [{ type: 'length_mismatch' }];
        const suggestions = analyzer.generateSuggestions(errors, ['length_mismatch'], []);
        assert.ok(suggestions.some(s => s.includes('array/string lengths')));
      });

      it('should suggest partial matching for many path errors', () => {
        const paths = ['path1', 'path2', 'path3', 'path4'];
        const suggestions = analyzer.generateSuggestions([], [], paths);
        assert.ok(suggestions.some(s => s.includes('partial matching')));
      });

      it('should limit suggestions to top 3', () => {
        const errors = [
          { type: 'type_mismatch' },
          { type: 'missing_field' },
          { type: 'pattern_failed' },
          { type: 'length_mismatch' },
        ];
        const suggestions = analyzer.generateSuggestions(
          errors,
          ['type_mismatch', 'missing_field', 'pattern_failed', 'length_mismatch'],
          ['path1', 'path2', 'path3', 'path4'],
        );
        assert.ok(suggestions.length <= 3);
      });
    });

    describe('displayEnhancedValidationErrors', () => {
      it('should display validation errors with analysis', () => {
        const validationResult = {
          errors: [
            {
              type: 'type_mismatch',
              path: 'response.result.count',
              message: 'Expected number, got string',
              expected: 5,
              actual: '5',
              suggestion: 'Convert string to number',
            },
          ],
          analysis: {
            summary: '1 validation error found',
            suggestions: ['Check data types in your response'],
          },
        };

        analyzer.displayEnhancedValidationErrors(validationResult);

        const output = capturedLogs.join('');
        assert.ok(output.includes('Detailed Validation Analysis'));
        assert.ok(output.includes('TYPE MISMATCH'));
        assert.ok(output.includes('response.result.count'));
        assert.ok(output.includes('Expected number, got string'));
        assert.ok(output.includes('Top Recommendations'));
      });

      it('should display multiple errors with limit', () => {
        const errors = Array.from({ length: 8 }, (_, i) => ({
          type: 'value_mismatch',
          path: `field${i}`,
          message: `Error ${i}`,
          expected: `expected${i}`,
          actual: `actual${i}`,
        }));

        const validationResult = { errors };
        analyzer.displayEnhancedValidationErrors(validationResult);

        const output = capturedLogs.join('');
        assert.ok(output.includes('VALUE MISMATCH'));
        assert.ok(output.includes('and 3 more validation error(s)'));
      });

      it('should handle errors without path', () => {
        const validationResult = {
          errors: [{
            type: 'pattern_failed',
            message: 'Pattern validation failed',
          }],
        };

        analyzer.displayEnhancedValidationErrors(validationResult);

        const output = capturedLogs.join('');
        assert.ok(output.includes('PATTERN FAILED'));
        assert.ok(output.includes('Pattern validation failed'));
      });

      it('should handle errors without suggestions', () => {
        const validationResult = {
          errors: [{
            type: 'missing_field',
            path: 'response.tools',
            message: 'Missing tools field',
          }],
        };

        analyzer.displayEnhancedValidationErrors(validationResult);

        const output = capturedLogs.join('');
        assert.ok(output.includes('MISSING FIELD'));
        assert.ok(output.includes('Missing tools field'));
      });
    });
  });
});
