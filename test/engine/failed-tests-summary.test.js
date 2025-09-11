import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { Reporter } from '../../src/test-engine/reporter/Reporter.js';

describe('Failed Tests Summary Enhancement', () => {
  let originalConsoleLog;
  let capturedLogs;

  beforeEach(() => {
    capturedLogs = [];
    originalConsoleLog = console.log;
    console.log = (...args) => {
      capturedLogs.push(args.join(' '));
    };
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('should display failed tests summary when there are failures', () => {
    const reporter = new Reporter();

    // Setup a test suite with some failures
    reporter.logSuiteHeader('Test Suite 1', '/path/to/test1.yml');
    reporter.logTestStart('should pass');
    reporter.logTestPass();
    reporter.logTestStart('should fail');
    reporter.logTestFail('expected', 'actual', 'Test failed message');
    reporter.finalizeSuite();

    reporter.logSuiteHeader('Test Suite 2', '/path/to/test2.yml');
    reporter.logTestStart('should also fail');
    reporter.logTestFail('expected2', 'actual2', 'Another test failed', {
      errors: [
        { type: 'type_mismatch', message: 'Type error', path: 'response.field' },
        { type: 'missing_field', message: 'Missing field error' },
      ],
    });
    reporter.finalizeSuite();

    // Generate summary
    reporter.logSummary();

    const output = capturedLogs.join('\n');

    // Should show the main summary
    assert.ok(output.includes('Test Results:'));
    assert.ok(output.includes('1 passed'));
    assert.ok(output.includes('2 failed'));

    // Should show the failed tests summary
    assert.ok(output.includes('Failed Tests Summary:'));
    assert.ok(output.includes('Test Suite 1'));
    assert.ok(output.includes('/path/to/test1.yml'));
    assert.ok(output.includes('should fail'));
    assert.ok(output.includes('Test failed message'));

    assert.ok(output.includes('Test Suite 2'));
    assert.ok(output.includes('/path/to/test2.yml'));
    assert.ok(output.includes('should also fail'));
    assert.ok(output.includes('Another test failed'));

    // Should show validation details
    assert.ok(output.includes('Validation Details:'));
    assert.ok(output.includes('Type error'));
    assert.ok(output.includes('Path: response.field'));
    assert.ok(output.includes('Missing field error'));
  });

  it('should not display failed tests summary when all tests pass', () => {
    const reporter = new Reporter();

    // Setup a test suite with only passing tests
    reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
    reporter.logTestStart('should pass');
    reporter.logTestPass();
    reporter.logTestStart('should also pass');
    reporter.logTestPass();
    reporter.finalizeSuite();

    // Generate summary
    reporter.logSummary();

    const output = capturedLogs.join('\n');

    // Should show the main summary
    assert.ok(output.includes('Test Results:'));
    assert.ok(output.includes('2 passed'));
    assert.ok(output.includes('All tests passed!'));

    // Should NOT show the failed tests summary
    assert.ok(!output.includes('Failed Tests Summary:'));
  });

  it('should respect quiet mode and not show failed tests summary', () => {
    const reporter = new Reporter({ quiet: true });

    // Setup a test suite with failures
    reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
    reporter.logTestStart('should fail');
    reporter.logTestFail('expected', 'actual', 'Test failed');
    reporter.finalizeSuite();

    // Generate summary
    reporter.logSummary();

    const output = capturedLogs.join('\n');

    // Should not show any output in quiet mode
    assert.equal(output.trim(), '');
  });

  it('should limit validation errors to prevent overwhelming output', () => {
    const reporter = new Reporter();

    // Setup a test with many validation errors
    const validationResult = {
      errors: Array.from({ length: 5 }, (_, i) => ({
        type: 'type_mismatch',
        message: `Error ${i + 1}`,
        path: `field${i + 1}`,
      })),
    };

    reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
    reporter.logTestStart('should fail with many errors');
    reporter.logTestFail('expected', 'actual', 'Validation failed', validationResult);
    reporter.finalizeSuite();

    // Generate summary
    reporter.logSummary();

    const output = capturedLogs.join('\n');

    // Should show only first 3 errors
    assert.ok(output.includes('Error 1'));
    assert.ok(output.includes('Error 2'));
    assert.ok(output.includes('Error 3'));
    
    // Should show "and X more" message
    assert.ok(output.includes('and 2 more validation error(s)'));
  });

  it('should handle tests without validation errors', () => {
    const reporter = new Reporter();

    // Setup a test suite with simple failures (no validation details)
    reporter.logSuiteHeader('Test Suite', '/path/to/test.yml');
    reporter.logTestStart('should fail simply');
    reporter.logTestFail('expected', 'actual', 'Simple failure message');
    reporter.finalizeSuite();

    // Generate summary
    reporter.logSummary();

    const output = capturedLogs.join('\n');

    // Should show the failure but not validation details
    assert.ok(output.includes('Failed Tests Summary:'));
    assert.ok(output.includes('should fail simply'));
    assert.ok(output.includes('Simple failure message'));
    assert.ok(!output.includes('Validation Details:'));
  });
});
