import chalk from 'chalk';
import { diff } from 'jest-diff';

/**
 * Reporter class for formatting and displaying test results
 */
export class Reporter {
  constructor(options = {}) {
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.verbose = options.verbose || false;
    this.debug = options.debug || false;
    this.timing = options.timing || false;
    this.json = options.json || false;
    this.quiet = options.quiet || false;
    this.suiteResults = []; // Store results for verbose output
    this.startTime = Date.now();
    this.suiteStartTime = null;
    this.testStartTime = null;
    this.performanceMetrics = {
      serverStartTime: 0,
      handshakeTime: 0,
      totalTestTime: 0,
      communicationTime: 0,
    };
  }

  /**
   * Start timing for a suite
   */
  startSuiteTiming() {
    this.suiteStartTime = Date.now();
  }

  /**
   * Start timing for a test
   */
  startTestTiming() {
    this.testStartTime = Date.now();
  }

  /**
   * Log debug information (only in debug mode)
   * @param {string} message - Debug message
   * @param {*} data - Optional data to log
   */
  logDebug(message, data = null) {
    if (!this.debug || this.quiet) {
      return;
    }

    console.log(chalk.gray(`🐛 [DEBUG] ${message}`));
    if (data) {
      console.log(chalk.gray(`    ${JSON.stringify(data, null, 2).split('\n').join('\n    ')}`));
    }
  }

  /**
   * Log MCP communication details
   * @param {string} direction - 'SEND' or 'RECV'
   * @param {Object} message - JSON-RPC message
   */
  logMCPCommunication(direction, message) {
    if (!this.debug || this.quiet) {
      return;
    }

    const arrow = direction === 'SEND' ? '→' : '←';
    const color = direction === 'SEND' ? chalk.blue : chalk.green;
    console.log(color(`📡 [MCP ${direction}] ${arrow} ${message.method || 'response'}`));

    if (this.debug) {
      console.log(color(`    ${JSON.stringify(message, null, 2).split('\n').join('\n    ')}`));
    }
  }

  /**
   * Log performance metrics
   * @param {string} operation - Operation name
   * @param {number} duration - Duration in milliseconds
   */
  logPerformance(operation, duration) {
    if (!this.timing || this.quiet) {
      return;
    }

    console.log(chalk.yellow(`⏱️  [TIMING] ${operation}: ${duration}ms`));
  }

  /**
   * Record performance metric
   * @param {string} metric - Metric name
   * @param {number} duration - Duration in milliseconds
   */
  recordPerformance(metric, duration) {
    if (Object.prototype.hasOwnProperty.call(this.performanceMetrics, metric)) {
      this.performanceMetrics[metric] = duration;
    }
  }

  /**
   * Logs the start of a test suite
   * @param {string} description - Suite description
   * @param {string} filePath - Path to the test file
   */
  logSuiteHeader(description, filePath) {
    this.startSuiteTiming();

    // Store current suite for verbose output
    this.currentSuite = {
      description,
      filePath,
      tests: [],
      startTime: Date.now(),
    };

    if (!this.verbose && !this.quiet) {
      console.log();
      console.log(chalk.bold.blue(`📋 ${description}`));
      console.log(chalk.gray(`   ${filePath}`));
      console.log();
    }

    this.logDebug(`Starting test suite: ${description}`);
  }

  /**
   * Logs the start of a test
   * @param {string} testDescription - Test description
   */
  logTestStart(testDescription) {
    this.startTestTiming();

    // Store test start for verbose mode
    this.currentTest = {
      description: testDescription,
      status: 'running',
      startTime: Date.now(),
    };

    if (!this.verbose && !this.quiet) {
      process.stdout.write(`  ${chalk.gray('●')} ${testDescription} ... `);
    }

    this.logDebug(`Starting test: ${testDescription}`);
  }

  /**
   * Logs a successful test
   * @param {string} [timingSuffix] - Optional timing suffix to display (e.g., "(150ms)")
   */
  logTestPass(timingSuffix = null) {
    this.passedTests++;
    this.totalTests++;

    // Calculate test duration
    const duration = this.testStartTime ? Date.now() - this.testStartTime : 0;

    // Store result for verbose output
    if (this.currentTest) {
      this.currentTest.status = 'passed';
      this.currentTest.duration = duration;
      this.currentSuite.tests.push({ ...this.currentTest });
    }

    if (!this.verbose && !this.quiet) {
      let timingInfo = '';
      if (timingSuffix) {
        timingInfo = ` ${chalk.gray(timingSuffix)}`;
      } else if (this.timing) {
        timingInfo = ` ${chalk.gray(`(${duration}ms)`)}`;
      }
      console.log(`${chalk.green('✓ PASS')}${timingInfo}`);
    }

    this.logDebug(`Test passed in ${duration}ms`);
  }

  /**
   * Logs a failed test with enhanced validation result analysis
   * @param {*} expected - Expected value
   * @param {*} actual - Actual value
   * @param {string} errorMessage - Optional error message
   * @param {ValidationResult} validationResult - Enhanced validation result (optional)
   */
  logTestFail(expected, actual, errorMessage = null, validationResult = null) {
    this.failedTests++;
    this.totalTests++;

    // Calculate test duration
    const duration = this.testStartTime ? Date.now() - this.testStartTime : 0;

    // Store result for verbose output
    if (this.currentTest) {
      this.currentTest.status = 'failed';
      this.currentTest.expected = expected;
      this.currentTest.actual = actual;
      this.currentTest.errorMessage = errorMessage;
      this.currentTest.validationResult = validationResult;
      this.currentTest.duration = duration;
      this.currentSuite.tests.push({ ...this.currentTest });
    }

    if (!this.verbose && !this.quiet) {
      const timingInfo = this.timing ? chalk.gray(` (${duration}ms)`) : '';
      console.log(`${chalk.red('✗ FAIL')}${timingInfo}`);

      if (errorMessage) {
        console.log(chalk.red(`    ${errorMessage}`));
      }

      // Display enhanced validation analysis if available
      if (validationResult && validationResult.errors && validationResult.errors.length > 0) {
        this.displayEnhancedValidationErrors(validationResult);
      } else if (expected !== undefined && actual !== undefined) {
        this.displayIntelligentDiff(expected, actual);
      }
      console.log();
    }

    this.logDebug(`Test failed in ${duration}ms`, { errorMessage, expected, actual, validationResult });
  }

  /**
   * Display enhanced validation errors with detailed analysis
   * @param {ValidationResult} validationResult - Enhanced validation result
   */
  displayEnhancedValidationErrors(validationResult) {
    const { errors, analysis } = validationResult;

    console.log();
    console.log(chalk.cyan('    🔍 Detailed Validation Analysis:'));

    // Display analysis summary
    if (analysis && analysis.summary) {
      console.log(chalk.yellow(`    📊 ${analysis.summary}`));
    }

    // Display detailed errors (up to 5 most critical ones)
    const criticalErrors = errors.slice(0, 5);

    for (let i = 0; i < criticalErrors.length; i++) {
      const error = criticalErrors[i];
      console.log();

      // Error header with type and path
      const errorIcon = this.getErrorIcon(error.type);
      const errorHeader = `${errorIcon} ${error.type.replace('_', ' ').toUpperCase()}`;
      console.log(chalk.red(`    ${errorHeader}`));

      // Path information
      if (error.path && error.path !== 'response') {
        console.log(chalk.gray(`       📍 Path: ${error.path}`));
      }

      // Error message
      console.log(chalk.white(`       💬 ${error.message}`));

      // Show expected vs actual for specific error types
      if (['value_mismatch', 'type_mismatch'].includes(error.type)) {
        console.log(chalk.gray('       Expected:'), chalk.green(`${JSON.stringify(error.expected)}`));
        console.log(chalk.gray('       Actual:  '), chalk.red(`${JSON.stringify(error.actual)}`));
      }

      // Actionable suggestion
      if (error.suggestion) {
        console.log(chalk.cyan(`       💡 Suggestion: ${error.suggestion}`));
      }
    }

    // Show summary if there are more errors
    if (errors.length > 5) {
      console.log();
      console.log(chalk.gray(`    ... and ${errors.length - 5} more validation error(s)`));
    }

    // Display top suggestions
    if (analysis && analysis.suggestions && analysis.suggestions.length > 0) {
      console.log();
      console.log(chalk.cyan('    🎯 Top Recommendations:'));
      analysis.suggestions.forEach((suggestion, index) => {
        console.log(chalk.yellow(`    ${index + 1}. ${suggestion}`));
      });
    }
  }

  /**
   * Get appropriate icon for error type
   * @param {string} errorType - Type of validation error
   * @returns {string} Unicode icon for error type
   */
  getErrorIcon(errorType) {
    const icons = {
      missing_field: '🚫',
      extra_field: '➕',
      type_mismatch: '🔀',
      pattern_failed: '🎭',
      value_mismatch: '≠',
      length_mismatch: '📏',
    };
    return icons[errorType] || '❌';
  }

  /**
   * Display intelligent diff that handles pattern matching better
   * @param {*} expected - Expected value (may contain patterns)
   * @param {*} actual - Actual value
   */
  displayIntelligentDiff(expected, actual) {
    // Check if expected contains pattern matching objects
    if (this.containsPatterns(expected)) {
      console.log();
      console.log(chalk.cyan('    Pattern Analysis:'));
      const explanation = this.createPatternExplanation(expected, actual);
      console.log(`    ${explanation.split('\n').join('\n    ')}`);
      return;
    }

    // Standard diff for non-pattern cases
    const diffOutput = diff(expected, actual, {
      aAnnotation: 'Expected',
      bAnnotation: 'Received',
      contextLines: 2,
      expand: false,
    });

    if (diffOutput && diffOutput !== 'Compared values have no visual difference.') {
      console.log();
      console.log(chalk.gray('    Diff:'));
      console.log(`    ${diffOutput.split('\n').join('\n    ')}`);
    }
  }

  /**
   * Check if an object contains pattern matching directives
   * @param {*} obj - Object to check
   * @returns {boolean} Whether object contains patterns
   */
  containsPatterns(obj) {
    if (typeof obj === 'string' && obj.startsWith('match:')) {
      return true;
    }

    if (typeof obj === 'object' && obj !== null) {
      // Check for special pattern keys
      const patternKeys = ['match:arrayElements', 'match:partial', 'match:extractField'];
      if (patternKeys.some(key => key in obj)) {
        return true;
      }

      // Recursively check nested objects
      return Object.values(obj).some(value => this.containsPatterns(value));
    }

    return false;
  }

  /**
   * Create human-readable explanation for pattern matching
   * @param {*} expected - Expected pattern
   * @param {*} actual - Actual value
   * @returns {string} Human-readable explanation
   */
  createPatternExplanation(expected, actual) {
    const explanations = [];

    this.analyzePatterns(expected, actual, '', explanations);

    if (explanations.length === 0) {
      return 'Pattern validation completed - see error message above for specific failures';
    }

    return explanations.join('\n');
  }

  /**
   * Analyze patterns recursively and build explanations
   * @param {*} expected - Expected pattern
   * @param {*} actual - Actual value
   * @param {string} path - Current path
   * @param {Array} explanations - Array to collect explanations
   */
  analyzePatterns(expected, actual, path, explanations) {
    if (typeof expected === 'string' && expected.startsWith('match:')) {
      const pattern = expected.substring(6);
      const pathStr = path ? `${path}: ` : '';

      if (pattern.startsWith('type:')) {
        const expectedType = pattern.substring(5);
        const actualType = typeof actual;
        explanations.push(`${pathStr}Type validation: expected '${expectedType}', got '${actualType}'`);
      } else if (pattern.startsWith('arrayLength:')) {
        const expectedLength = pattern.substring(12);
        const actualLength = Array.isArray(actual) ? actual.length : 'N/A';
        explanations.push(`${pathStr}Length validation: expected ${expectedLength}, got ${actualLength}`);
      } else if (pattern.startsWith('contains:')) {
        const searchTerm = pattern.substring(9);
        explanations.push(`${pathStr}Contains validation: looking for '${searchTerm}' in value`);
      } else {
        explanations.push(`${pathStr}Pattern '${pattern}' applied`);
      }
      return;
    }

    if (typeof expected === 'object' && expected !== null) {
      // Handle special pattern objects
      if ('match:arrayElements' in expected) {
        const pathStr = path ? `${path}: ` : '';
        if (Array.isArray(actual)) {
          explanations.push(`${pathStr}arrayElements pattern: Validating ${actual.length} array items`);
          const elementPattern = expected['match:arrayElements'];
          explanations.push(`${pathStr}  Each item must match: ${JSON.stringify(elementPattern, null, 2).replace(/\n/g, ' ')}`);
        } else {
          explanations.push(`${pathStr}arrayElements pattern: Expected array, got ${typeof actual}`);
        }
        return;
      }

      if ('match:partial' in expected) {
        const pathStr = path ? `${path}: ` : '';
        explanations.push(`${pathStr}partial matching: Only validating specified fields`);
        return;
      }

      if ('match:extractField' in expected) {
        const pathStr = path ? `${path}: ` : '';
        const fieldPath = expected['match:extractField'];
        explanations.push(`${pathStr}field extraction: Extracting '${fieldPath}' for validation`);
        return;
      }

      // Recursively analyze nested objects
      Object.keys(expected).forEach(key => {
        const nextPath = path ? `${path}.${key}` : key;
        if (actual && typeof actual === 'object') {
          this.analyzePatterns(expected[key], actual[key], nextPath, explanations);
        } else {
          this.analyzePatterns(expected[key], undefined, nextPath, explanations);
        }
      });
    }
  }

  /**
   * Finalizes the current test suite
   */
  finalizeSuite() {
    if (this.currentSuite) {
      const suiteDuration = this.suiteStartTime ? Date.now() - this.suiteStartTime : 0;
      this.currentSuite.duration = suiteDuration;

      this.suiteResults.push({ ...this.currentSuite });
      this.currentSuite = null;

      this.logPerformance('Test suite completed', suiteDuration);
    }
  }

  /**
   * Logs stderr output if not empty
   * @param {string} stderr - Stderr content
   * @param {string} expectedStderr - Expected stderr pattern
   */
  logStderrInfo(stderr, expectedStderr) {
    if (expectedStderr === 'toBeEmpty' && stderr.trim() !== '') {
      console.log(chalk.yellow(`    ⚠️  Unexpected stderr output: ${stderr.trim()}`));
    } else if (expectedStderr && expectedStderr !== 'toBeEmpty') {
      console.log(chalk.gray(`    📝 Stderr: ${stderr.trim()}`));
    }
  }

  /**
   * Logs final test results summary
   */
  logSummary() {
    const totalDuration = Date.now() - this.startTime;

    if (this.json) {
      this.outputJsonResults(totalDuration);
      return;
    }

    if (this.verbose) {
      this.logVerboseResults();
    }

    if (!this.quiet) {
      console.log();
      console.log(chalk.bold('📊 Test Results:'));
      console.log(`   ${chalk.green(`✓ ${this.passedTests} passed`)}`);

      if (this.failedTests > 0) {
        console.log(`   ${chalk.red(`✗ ${this.failedTests} failed`)}`);
      }

      console.log(`   📈 Total: ${this.totalTests}`);

      if (this.timing) {
        console.log(`   ⏱️  Duration: ${totalDuration}ms`);
        this.logPerformanceMetrics();
      }

      console.log();

      if (this.failedTests === 0) {
        console.log(chalk.green.bold('🎉 All tests passed!'));
      } else {
        console.log(chalk.red.bold(`❌ ${this.failedTests} test(s) failed`));
      }
    }
  }

  /**
   * Output results in JSON format
   * @param {number} totalDuration - Total execution duration
   */
  outputJsonResults(totalDuration) {
    const results = {
      summary: {
        total: this.totalTests,
        passed: this.passedTests,
        failed: this.failedTests,
        duration: totalDuration,
        success: this.failedTests === 0,
      },
      performance: this.performanceMetrics,
      suites: this.suiteResults,
    };

    console.log(JSON.stringify(results, null, 2));
  }

  /**
   * Log performance metrics summary
   */
  logPerformanceMetrics() {
    if (!this.timing) {
      return;
    }

    console.log(chalk.yellow('   📊 Performance Metrics:'));
    Object.entries(this.performanceMetrics).forEach(([key, value]) => {
      if (value > 0) {
        console.log(chalk.yellow(`      ${key}: ${value}ms`));
      }
    });
  }

  /**
   * Logs verbose test results with hierarchy
   */
  logVerboseResults() {
    console.log();
    console.log(chalk.bold.blue('📋 Test Results Hierarchy:'));
    console.log();

    for (const suite of this.suiteResults) {
      // Log suite header with timing
      const timingInfo = this.timing && suite.duration ? chalk.gray(` (${suite.duration}ms)`) : '';
      console.log(`${chalk.bold.blue(`📁 ${suite.description}`)}${timingInfo}`);
      console.log(chalk.gray(`   ${suite.filePath}`));
      console.log();

      // Log each test in the suite
      for (const test of suite.tests) {
        const testTimingInfo = this.timing && test.duration ? chalk.gray(` (${test.duration}ms)`) : '';

        if (test.status === 'passed') {
          console.log(`  ${chalk.green('✓')} ${test.description}${testTimingInfo}`);
        } else if (test.status === 'failed') {
          console.log(`  ${chalk.red('✗')} ${test.description}${testTimingInfo}`);

          if (test.errorMessage) {
            console.log(chalk.red(`    ${test.errorMessage}`));
          }

          // Display enhanced validation analysis if available
          if (test.validationResult && test.validationResult.errors && test.validationResult.errors.length > 0) {
            this.displayEnhancedValidationErrors(test.validationResult);
          } else if (test.expected !== undefined && test.actual !== undefined) {
            this.displayIntelligentDiff(test.expected, test.actual);
          }
          console.log();
        }
      }
      console.log();
    }
  }

  /**
   * Returns whether all tests passed
   * @returns {boolean}
   */
  allTestsPassed() {
    return this.failedTests === 0;
  }

  /**
   * Logs an error message
   * @param {string} message - Error message
   */
  logError(message) {
    console.log(chalk.red(`❌ ${message}`));
  }

  /**
   * Logs an info message
   * @param {string} message - Info message
   */
  logInfo(message) {
    if (!this.quiet) {
      console.log(chalk.blue(`ℹ️  ${message}`));
    }
  }

  /**
   * Logs a warning message
   * @param {string} message - Warning message
   */
  logWarning(message) {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }
}
