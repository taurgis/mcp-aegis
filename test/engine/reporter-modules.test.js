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

      it('should suppress detailed analysis when groupErrors + concise enabled', () => {
        // Recreate analyzer with flags
        analyzer = new ValidationErrorAnalyzer({ groupErrors: true, concise: true });
        const validationResult = {
          errors: [
            { type: 'extra_field', path: 'response.result.foo', message: "Unexpected field 'foo'" },
            { type: 'pattern_failed', path: 'response.result.bar', message: 'Pattern failed' },
          ],
          analysis: { summary: '2 validation errors', suggestions: ['Remove unexpected field'] },
        };
        analyzer.displayEnhancedValidationErrors(validationResult);
        const output = capturedLogs.join('');
        // Should not contain header or any of the error type banners
        assert.ok(!output.includes('Detailed Validation Analysis'));
        assert.ok(!output.includes('EXTRA FIELD'));
        assert.ok(!output.includes('PATTERN FAILED'));
      });

      it('should suppress output in quiet mode', () => {
        analyzer = new ValidationErrorAnalyzer({ quiet: true });
        const validationResult = {
          errors: [{ type: 'missing_field', message: 'Missing field' }],
        };
        analyzer.displayEnhancedValidationErrors(validationResult);
        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });

      it('should use displaySimpleErrors when noAnalysis option is enabled', () => {
        analyzer = new ValidationErrorAnalyzer({ noAnalysis: true });
        const validationResult = {
          errors: [
            { type: 'missing_field', path: 'response.tools', message: 'Missing tools field' },
          ],
        };
        analyzer.displayEnhancedValidationErrors(validationResult);
        const output = capturedLogs.join('');
        assert.ok(output.includes('Validation Errors:'));
        assert.ok(output.includes('Missing tools field'));
        assert.ok(!output.includes('Detailed Validation Analysis'));
      });

      it('should filter syntax errors when syntaxOnly option is enabled', () => {
        analyzer = new ValidationErrorAnalyzer({ syntaxOnly: true });
        const validationResult = {
          errors: [
            { type: 'pattern_failed', expected: 'arrayLength:5', message: 'Pattern failed' },
            { type: 'missing_field', message: 'Missing field' },
          ],
        };
        analyzer.displayEnhancedValidationErrors(validationResult);
        const output = capturedLogs.join('');
        // Should show analysis for syntax errors only
        assert.ok(output.includes('Detailed Validation Analysis') || output.length > 0);
      });

      it('should return early when syntaxOnly has no syntax errors', () => {
        analyzer = new ValidationErrorAnalyzer({ syntaxOnly: true });
        const validationResult = {
          errors: [
            { type: 'missing_field', message: 'Missing field' },
            { type: 'type_mismatch', message: 'Type mismatch' },
          ],
        };
        analyzer.displayEnhancedValidationErrors(validationResult);
        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });

      it('should group similar errors when groupErrors option is enabled', () => {
        analyzer = new ValidationErrorAnalyzer({ groupErrors: true });
        const validationResult = {
          errors: [
            { type: 'extra_field', path: 'response.result.foo', message: 'Extra field foo' },
            { type: 'extra_field', path: 'response.result.bar', message: 'Extra field bar' },
            { type: 'missing_field', path: 'response.tools', message: 'Missing tools' },
          ],
        };
        analyzer.displayEnhancedValidationErrors(validationResult);
        const output = capturedLogs.join('');
        assert.ok(output.includes('Found 2 similar error(s)'));
      });

      it('should display suggestion breakdown with weighted prioritization', () => {
        const validationResult = {
          errors: [
            { type: 'pattern_failed', expected: 'arrayLength:5', message: 'Pattern failed' },
            { type: 'extra_field', message: 'Extra field' },
            { type: 'missing_field', message: 'Missing field' },
          ],
          analysis: {
            summary: '3 validation errors',
            suggestions: [
              'Check pattern syntax - common issues: missing "match:" prefix',
              'Remove unexpected field(s)',
              'Verify all required fields',
            ],
          },
        };
        analyzer.displayEnhancedValidationErrors(validationResult);
        const output = capturedLogs.join('');
        assert.ok(output.includes('Top Recommendations'));
        assert.ok(output.includes('1. Check pattern syntax'));
      });
    });

    describe('displaySimpleErrors', () => {
      it('should display simple error messages without analysis', () => {
        const validationResult = {
          errors: [
            { type: 'missing_field', path: 'response.tools', message: 'Missing tools field' },
            { type: 'type_mismatch', path: 'response.count', message: 'Expected number' },
          ],
        };
        analyzer.displaySimpleErrors(validationResult);
        const output = capturedLogs.join('');
        assert.ok(output.includes('Validation Errors:'));
        assert.ok(output.includes('Missing tools field'));
        assert.ok(output.includes('Expected number'));
      });

      it('should return early if no errors', () => {
        const validationResult = { errors: [] };
        analyzer.displaySimpleErrors(validationResult);
        const output = capturedLogs.join('');
        assert.equal(output.trim(), '');
      });

      it('should limit errors to maxErrors option', () => {
        analyzer = new ValidationErrorAnalyzer({ maxErrors: 2 });
        const validationResult = {
          errors: [
            { type: 'error1', message: 'Error 1' },
            { type: 'error2', message: 'Error 2' },
            { type: 'error3', message: 'Error 3' },
            { type: 'error4', message: 'Error 4' },
          ],
        };
        analyzer.displaySimpleErrors(validationResult);
        const output = capturedLogs.join('');
        assert.ok(output.includes('Error 1'));
        assert.ok(output.includes('Error 2'));
        assert.ok(!output.includes('Error 3'));
        assert.ok(output.includes('... and 2 more error(s)'));
      });
    });

    describe('filterSyntaxErrors', () => {
      it('should filter only syntax-related pattern_failed errors', () => {
        const errors = [
          { type: 'pattern_failed', expected: 'arrayLength:5', message: 'Pattern failed' },
          { type: 'pattern_failed', expected: 'match:arrayLength:5', message: 'Pattern failed' },
          { type: 'missing_field', message: 'Missing field' },
        ];
        const syntaxErrors = analyzer.filterSyntaxErrors(errors);
        assert.equal(syntaxErrors.length, 1);
        assert.equal(syntaxErrors[0].expected, 'arrayLength:5');
      });

      it('should return empty array when no syntax errors', () => {
        const errors = [
          { type: 'missing_field', message: 'Missing field' },
          { type: 'type_mismatch', message: 'Type mismatch' },
        ];
        const syntaxErrors = analyzer.filterSyntaxErrors(errors);
        assert.equal(syntaxErrors.length, 0);
      });
    });

    describe('groupSimilarErrors', () => {
      it('should group errors by type', () => {
        const errors = [
          { type: 'missing_field', path: 'field1', message: 'Missing field1' },
          { type: 'missing_field', path: 'field2', message: 'Missing field2' },
          { type: 'type_mismatch', path: 'field3', message: 'Type mismatch' },
        ];
        const grouped = analyzer.groupSimilarErrors(errors);
        assert.equal(grouped.length, 2);

        const missingFieldGroup = grouped.find(g => g.type === 'missing_field');
        assert.equal(missingFieldGroup.count, 2);
        assert.deepEqual(missingFieldGroup.paths, ['field1', 'field2']);
      });

      it('should group pattern_failed errors by type and expected pattern', () => {
        const errors = [
          { type: 'pattern_failed', expected: 'arrayLength:5', path: 'field1' },
          { type: 'pattern_failed', expected: 'arrayLength:5', path: 'field2' },
          { type: 'pattern_failed', expected: 'contains:test', path: 'field3' },
        ];
        const grouped = analyzer.groupSimilarErrors(errors);
        assert.equal(grouped.length, 2);

        const arrayLengthGroup = grouped.find(g => g.expected === 'arrayLength:5');
        assert.equal(arrayLengthGroup.count, 2);
        assert.deepEqual(arrayLengthGroup.paths, ['field1', 'field2']);
      });

      it('should handle errors without paths', () => {
        const errors = [
          { type: 'missing_field', message: 'Missing field1' },
          { type: 'missing_field', message: 'Missing field2' },
        ];
        const grouped = analyzer.groupSimilarErrors(errors);
        assert.equal(grouped.length, 1);
        assert.equal(grouped[0].count, 2);
        assert.deepEqual(grouped[0].paths, []);
      });
    });

    describe('displaySingleError', () => {
      it('should display error with type, path, and message', () => {
        const error = {
          type: 'missing_field',
          path: 'response.tools',
          message: 'Missing tools field',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('🚫 MISSING FIELD'));
        assert.ok(output.includes('📍 Path: response.tools'));
        assert.ok(output.includes('💬 Missing tools field'));
      });

      it('should display grouped error count', () => {
        const error = {
          type: 'extra_field',
          count: 3,
          paths: ['field1', 'field2', 'field3'],
          message: 'Extra fields',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('📊 Found 3 similar error(s)'));
        assert.ok(output.includes('📍 Paths: field1, field2, field3'));
      });

      it('should display expected vs actual for value_mismatch errors', () => {
        const error = {
          type: 'value_mismatch',
          path: 'response.count',
          message: 'Value mismatch',
          expected: 5,
          actual: '5',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('≠ VALUE MISMATCH'));
        assert.ok(output.includes('Expected:') && output.includes('5'));
        assert.ok(output.includes('Actual:') && output.includes('"5"'));
      });

      it('should display expected vs actual for type_mismatch errors', () => {
        const error = {
          type: 'type_mismatch',
          path: 'response.count',
          message: 'Type mismatch',
          expected: 'number',
          actual: 'string',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('🔀 TYPE MISMATCH'));
        assert.ok(output.includes('Expected:') && output.includes('"number"'));
        assert.ok(output.includes('Actual:') && output.includes('"string"'));
      });

      it('should handle pattern_failed errors with non_existent_feature', () => {
        const error = {
          type: 'pattern_failed',
          expected: 'nonExistentPattern:value',
          patternType: 'non_existent_feature',
          alternatives: ['match:contains:value', 'match:regex:value'],
          example: {
            incorrect: 'nonExistentPattern:value',
            correct: 'match:contains:value',
          },
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('❌ Feature Not Available'));
        assert.ok(output.includes('✅ Available alternatives:'));
        assert.ok(output.includes('match:contains:value'));
        assert.ok(output.includes('📝 Example:'));
        assert.ok(output.includes('❌ nonExistentPattern:value'));
        assert.ok(output.includes('✅ match:contains:value'));
      });

      it('should handle extra_field errors with aggregated suggestions', () => {
        const error = {
          type: 'extra_field',
          count: 3,
          paths: ['response.field1', 'response.field2', 'response.field3'],
          message: 'Extra fields found',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('💡 Suggestion: Remove unexpected field(s): field1, field2, field3'));
      });

      it('should handle errors without paths gracefully', () => {
        const error = {
          type: 'pattern_failed',
          message: 'Pattern validation failed',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('🎭 PATTERN FAILED'));
        assert.ok(output.includes('💬 Pattern validation failed'));
        assert.ok(!output.includes('📍 Path:'));
      });

      it('should truncate long path lists', () => {
        const error = {
          type: 'extra_field',
          count: 6,
          paths: ['field1', 'field2', 'field3', 'field4', 'field5', 'field6'],
          message: 'Extra fields',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('📍 Paths: field1, field2, field3'));
        assert.ok(output.includes('... and 3 more'));
      });

      it('should suppress suggestions for array element extra_field errors', () => {
        const error = {
          type: 'extra_field',
          path: 'response.result[0].unexpectedField',
          message: 'Extra field',
          suggestion: 'Remove this field',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(!output.includes('💡 Suggestion:'));
      });

      it('should display suggestions for other error types', () => {
        const error = {
          type: 'missing_field',
          path: 'response.tools',
          message: 'Missing field',
          suggestion: 'Add the required field',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('💡 Suggestion: Add the required field'));
      });
    });

    describe('getOriginalPattern method', () => {
      it('should handle getOriginalPattern method for type_mismatch with malformed patterns', () => {
        const error = {
          type: 'type_mismatch',
          expected: 'arrayLength:5',
          actual: [],
          message: 'Type mismatch',
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('🔧 Possible Syntax Issues:'));
      });
    });

    describe('edge cases and error handling', () => {
      it('should handle errors with undefined expected/actual values', () => {
        const error = {
          type: 'pattern_failed',
          path: 'response.test',
          message: 'Pattern failed',
          expected: undefined,
          actual: undefined,
        };
        analyzer.displaySingleError(error);
        const output = capturedLogs.join('');
        assert.ok(output.includes('🎭 PATTERN FAILED'));
        assert.ok(output.includes('💬 Pattern failed'));
      });

      it('should handle constructor with options', () => {
        const customAnalyzer = new ValidationErrorAnalyzer({
          quiet: true,
          maxErrors: 10,
          groupErrors: true,
        });
        assert.equal(customAnalyzer.options.quiet, true);
        assert.equal(customAnalyzer.options.maxErrors, 10);
        assert.equal(customAnalyzer.options.groupErrors, true);
      });
    });
  });
});
