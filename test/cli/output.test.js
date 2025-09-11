import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { OutputManager } from '../../src/cli/interface/output.js';

describe('OutputManager Tests', () => {
  let originalConsoleLog, originalConsoleError;
  let logOutput, errorOutput;

  beforeEach(() => {
    // Mock console functions to capture output
    logOutput = [];
    errorOutput = [];

    originalConsoleLog = console.log;
    originalConsoleError = console.error;

    console.log = (...args) => {
      logOutput.push(args.join(' '));
    };

    console.error = (...args) => {
      errorOutput.push(args.join(' '));
    };
  });

  afterEach(() => {
    // Restore original console functions
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('Constructor and Configuration', () => {
    test('should initialize with default options (no flags)', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      assert.equal(output.showProgress, true);
      assert.equal(output.showDetails, false);
      assert.equal(output.showDebug, false);
      assert.equal(output.jsonOutput, false);
      assert.equal(output.quietMode, false);
    });

    test('should initialize with quiet mode', () => {
      const options = { quiet: true, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      assert.equal(output.showProgress, false);
      assert.equal(output.showDetails, false);
      assert.equal(output.showDebug, false);
      assert.equal(output.jsonOutput, false);
      assert.equal(output.quietMode, true);
    });

    test('should initialize with JSON mode', () => {
      const options = { quiet: false, json: true, verbose: false, debug: false };
      const output = new OutputManager(options);

      assert.equal(output.showProgress, false);
      assert.equal(output.showDetails, false);
      assert.equal(output.showDebug, false);
      assert.equal(output.jsonOutput, true);
      assert.equal(output.quietMode, false);
    });

    test('should initialize with verbose mode', () => {
      const options = { quiet: false, json: false, verbose: true, debug: false };
      const output = new OutputManager(options);

      assert.equal(output.showProgress, true);
      assert.equal(output.showDetails, true);
      assert.equal(output.showDebug, false);
      assert.equal(output.jsonOutput, false);
      assert.equal(output.quietMode, false);
    });

    test('should initialize with debug mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: true };
      const output = new OutputManager(options);

      assert.equal(output.showProgress, true);
      assert.equal(output.showDetails, false);
      assert.equal(output.showDebug, true);
      assert.equal(output.jsonOutput, false);
      assert.equal(output.quietMode, false);
    });

    test('should handle combined verbose and debug modes', () => {
      const options = { quiet: false, json: false, verbose: true, debug: true };
      const output = new OutputManager(options);

      assert.equal(output.showProgress, true);
      assert.equal(output.showDetails, true);
      assert.equal(output.showDebug, true);
      assert.equal(output.jsonOutput, false);
      assert.equal(output.quietMode, false);
    });

    test('should suppress details and debug when quiet is enabled', () => {
      const options = { quiet: true, json: false, verbose: true, debug: true };
      const output = new OutputManager(options);

      assert.equal(output.showProgress, false);
      assert.equal(output.showDetails, false);
      assert.equal(output.showDebug, false);
      assert.equal(output.jsonOutput, false);
      assert.equal(output.quietMode, true);
    });

    test('should suppress progress when JSON mode is enabled', () => {
      const options = { quiet: false, json: true, verbose: true, debug: true };
      const output = new OutputManager(options);

      assert.equal(output.showProgress, false);
      assert.equal(output.showDetails, true); // verbose still enabled, only quiet suppresses
      assert.equal(output.showDebug, true); // debug still enabled, only quiet suppresses
      assert.equal(output.jsonOutput, true);
      assert.equal(output.quietMode, false);
    });
  });

  describe('LogInfo Method', () => {
    test('should log info messages in normal mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logInfo('Test info message');

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], 'Test info message');
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress info messages in quiet mode', () => {
      const options = { quiet: true, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logInfo('Test info message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress info messages in JSON mode', () => {
      const options = { quiet: false, json: true, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logInfo('Test info message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });
  });

  describe('LogError Method', () => {
    test('should log error messages in normal mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logError('Test error message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 1);
      assert.equal(errorOutput[0], 'Test error message');
    });

    test('should log error messages in quiet mode (errors always shown)', () => {
      const options = { quiet: true, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logError('Test error message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 1);
      assert.equal(errorOutput[0], 'Test error message');
    });

    test('should suppress error messages in JSON mode', () => {
      const options = { quiet: false, json: true, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logError('Test error message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });
  });

  describe('LogSuccess Method', () => {
    test('should log success messages in normal mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logSuccess('Test success message');

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], 'Test success message');
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress success messages in quiet mode', () => {
      const options = { quiet: true, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logSuccess('Test success message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress success messages in JSON mode', () => {
      const options = { quiet: false, json: true, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logSuccess('Test success message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });
  });

  describe('LogWarning Method', () => {
    test('should log warning messages in normal mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logWarning('Test warning message');

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], 'Test warning message');
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress warning messages in quiet mode', () => {
      const options = { quiet: true, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logWarning('Test warning message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress warning messages in JSON mode', () => {
      const options = { quiet: false, json: true, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logWarning('Test warning message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });
  });

  describe('LogDetail Method', () => {
    test('should suppress detail messages in normal mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logDetail('Test detail message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });

    test('should log detail messages in verbose mode', () => {
      const options = { quiet: false, json: false, verbose: true, debug: false };
      const output = new OutputManager(options);

      output.logDetail('Test detail message');

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], 'Test detail message');
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress detail messages when quiet mode overrides verbose', () => {
      const options = { quiet: true, json: false, verbose: true, debug: false };
      const output = new OutputManager(options);

      output.logDetail('Test detail message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });

    test('should log detail messages when JSON mode and verbose are both enabled', () => {
      const options = { quiet: false, json: true, verbose: true, debug: false };
      const output = new OutputManager(options);

      output.logDetail('Test detail message');

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], 'Test detail message');
      assert.equal(errorOutput.length, 0);
    });
  });

  describe('LogDebug Method', () => {
    test('should suppress debug messages in normal mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logDebug('Test debug message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });

    test('should log debug messages in debug mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: true };
      const output = new OutputManager(options);

      output.logDebug('Test debug message');

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], '🔍 DEBUG: Test debug message');
      assert.equal(errorOutput.length, 0);
    });

    test('should log debug messages with data in debug mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: true };
      const output = new OutputManager(options);
      const testData = { key: 'value', number: 42 };

      output.logDebug('Test debug message', testData);

      assert.equal(logOutput.length, 2);
      assert.equal(logOutput[0], '🔍 DEBUG: Test debug message');
      assert.equal(logOutput[1], JSON.stringify(testData, null, 2));
      assert.equal(errorOutput.length, 0);
    });

    test('should handle null data parameter', () => {
      const options = { quiet: false, json: false, verbose: false, debug: true };
      const output = new OutputManager(options);

      output.logDebug('Test debug message', null);

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], '🔍 DEBUG: Test debug message');
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress debug messages when quiet mode overrides debug', () => {
      const options = { quiet: true, json: false, verbose: false, debug: true };
      const output = new OutputManager(options);

      output.logDebug('Test debug message');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });

    test('should log debug messages when JSON mode and debug are both enabled', () => {
      const options = { quiet: false, json: true, verbose: false, debug: true };
      const output = new OutputManager(options);

      output.logDebug('Test debug message');

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], '🔍 DEBUG: Test debug message');
      assert.equal(errorOutput.length, 0);
    });
  });

  describe('ShouldSuppress Method', () => {
    test('should return false in normal mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      assert.equal(output.shouldSuppress(), false);
    });

    test('should return true in quiet mode', () => {
      const options = { quiet: true, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      assert.equal(output.shouldSuppress(), true);
    });

    test('should return true in JSON mode', () => {
      const options = { quiet: false, json: true, verbose: false, debug: false };
      const output = new OutputManager(options);

      assert.equal(output.shouldSuppress(), true);
    });

    test('should return true when both quiet and JSON modes are enabled', () => {
      const options = { quiet: true, json: true, verbose: false, debug: false };
      const output = new OutputManager(options);

      assert.equal(output.shouldSuppress(), true);
    });
  });

  describe('Helper Methods', () => {
    test('should log config loaded message', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logConfigLoaded('Test Server Config');

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], '📋 Loaded configuration for: Test Server Config');
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress config loaded message in quiet mode', () => {
      const options = { quiet: true, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logConfigLoaded('Test Server Config');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });

    test('should log test suites found message', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logTestSuitesFound(5);

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], '🧪 Found 5 test suite(s)');
      assert.equal(errorOutput.length, 0);
    });

    test('should handle singular test suite message', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logTestSuitesFound(1);

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], '🧪 Found 1 test suite(s)');
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress test suites found message in JSON mode', () => {
      const options = { quiet: false, json: true, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logTestSuitesFound(3);

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });

    test('should log no test files warning', () => {
      const options = { quiet: false, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logNoTestFiles('**/*.test.mcp.yml');

      assert.equal(logOutput.length, 1);
      assert.equal(logOutput[0], '⚠️  No test files found matching pattern: **/*.test.mcp.yml');
      assert.equal(errorOutput.length, 0);
    });

    test('should suppress no test files warning in quiet mode', () => {
      const options = { quiet: true, json: false, verbose: false, debug: false };
      const output = new OutputManager(options);

      output.logNoTestFiles('**/*.test.mcp.yml');

      assert.equal(logOutput.length, 0);
      assert.equal(errorOutput.length, 0);
    });
  });

  describe('Complex Scenarios', () => {
    test('should handle all logging methods in verbose mode', () => {
      const options = { quiet: false, json: false, verbose: true, debug: false };
      const output = new OutputManager(options);

      output.logInfo('Info message');
      output.logError('Error message');
      output.logSuccess('Success message');
      output.logWarning('Warning message');
      output.logDetail('Detail message');
      output.logDebug('Debug message'); // Should not show

      assert.equal(logOutput.length, 4); // info, success, warning, detail
      assert.ok(logOutput.includes('Info message'));
      assert.ok(logOutput.includes('Success message'));
      assert.ok(logOutput.includes('Warning message'));
      assert.ok(logOutput.includes('Detail message'));

      assert.equal(errorOutput.length, 1); // error
      assert.equal(errorOutput[0], 'Error message');
    });

    test('should handle all logging methods in debug mode', () => {
      const options = { quiet: false, json: false, verbose: false, debug: true };
      const output = new OutputManager(options);

      output.logInfo('Info message');
      output.logError('Error message');
      output.logSuccess('Success message');
      output.logWarning('Warning message');
      output.logDetail('Detail message'); // Should not show
      output.logDebug('Debug message');

      assert.equal(logOutput.length, 4); // info, success, warning, debug
      assert.ok(logOutput.includes('Info message'));
      assert.ok(logOutput.includes('Success message'));
      assert.ok(logOutput.includes('Warning message'));
      assert.ok(logOutput.includes('🔍 DEBUG: Debug message'));

      assert.equal(errorOutput.length, 1); // error
      assert.equal(errorOutput[0], 'Error message');
    });

    test('should handle debug and detail messages in JSON mode with verbose and debug enabled', () => {
      const options = { quiet: false, json: true, verbose: true, debug: true };
      const output = new OutputManager(options);

      output.logInfo('Info message');
      output.logError('Error message');
      output.logSuccess('Success message');
      output.logWarning('Warning message');
      output.logDetail('Detail message');
      output.logDebug('Debug message');

      assert.equal(logOutput.length, 2); // detail and debug still show
      assert.ok(logOutput.includes('Detail message'));
      assert.ok(logOutput.includes('🔍 DEBUG: Debug message'));

      assert.equal(errorOutput.length, 0); // errors suppressed in JSON mode
    });

    test('should suppress all output in quiet mode', () => {
      const options = { quiet: true, json: false, verbose: true, debug: true };
      const output = new OutputManager(options);

      output.logInfo('Info message');
      output.logError('Error message'); // Errors still show in quiet mode
      output.logSuccess('Success message');
      output.logWarning('Warning message');
      output.logDetail('Detail message');
      output.logDebug('Debug message');

      assert.equal(logOutput.length, 0); // all progress messages suppressed
      assert.equal(errorOutput.length, 1); // errors still show
      assert.equal(errorOutput[0], 'Error message');
    });
  });
});
