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
   */
  logTestPass() {
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
      const timingInfo = this.timing ? chalk.gray(` (${duration}ms)`) : '';
      console.log(`${chalk.green('✓ PASS')}${timingInfo}`);
    }

    this.logDebug(`Test passed in ${duration}ms`);
  }

  /**
   * Logs a failed test with detailed diff
   * @param {*} expected - Expected value
   * @param {*} actual - Actual value
   * @param {string} errorMessage - Optional error message
   */
  logTestFail(expected, actual, errorMessage = null) {
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
      this.currentTest.duration = duration;
      this.currentSuite.tests.push({ ...this.currentTest });
    }

    if (!this.verbose && !this.quiet) {
      const timingInfo = this.timing ? chalk.gray(` (${duration}ms)`) : '';
      console.log(`${chalk.red('✗ FAIL')}${timingInfo}`);

      if (errorMessage) {
        console.log(chalk.red(`    ${errorMessage}`));
      }

      if (expected !== undefined && actual !== undefined) {
        const diffOutput = diff(expected, actual, {
          aAnnotation: 'Expected',
          bAnnotation: 'Received',
          contextLines: 2,
          expand: false,
        });

        if (diffOutput && diffOutput !== 'Compared values have no visual difference.') {
          console.log();
          console.log(chalk.gray('    Diff:'));
          console.log(`    ${  diffOutput.split('\n').join('\n    ')}`);
        }
      }
      console.log();
    }

    this.logDebug(`Test failed in ${duration}ms`, { errorMessage, expected, actual });
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

          if (test.expected !== undefined && test.actual !== undefined) {
            const diffOutput = diff(test.expected, test.actual, {
              aAnnotation: 'Expected',
              bAnnotation: 'Received',
              contextLines: 2,
              expand: false,
            });

            if (diffOutput && diffOutput !== 'Compared values have no visual difference.') {
              console.log();
              console.log(chalk.gray('    Diff:'));
              console.log(`    ${  diffOutput.split('\n').join('\n    ')}`);
            }
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
