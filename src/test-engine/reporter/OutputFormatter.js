import chalk from 'chalk';

/**
 * Handles all console output formatting and display logic
 * Follows single responsibility principle - only concerned with output formatting
 */
export class OutputFormatter {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.debug = options.debug || false;
    this.timing = options.timing || false;
    this.json = options.json || false;
    this.quiet = options.quiet || false;
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
   * Display suite header
   * @param {string} description - Suite description
   * @param {string} filePath - Path to the test file
   */
  displaySuiteHeader(description, filePath) {
    if (!this.verbose && !this.quiet) {
      console.log();
      console.log(chalk.bold.blue(`📋 ${description}`));
      console.log(chalk.gray(`   ${filePath}`));
      console.log();
    }
  }

  /**
   * Display test start
   * @param {string} testDescription - Test description
   */
  displayTestStart(testDescription) {
    if (!this.verbose && !this.quiet) {
      process.stdout.write(`  ${chalk.gray('●')} ${testDescription} ... `);
    }
  }

  /**
   * Display test pass result
   * @param {string} [timingSuffix] - Optional timing suffix
   * @param {number} duration - Test duration in milliseconds
   */
  displayTestPass(timingSuffix = null, duration = 0) {
    if (!this.verbose && !this.quiet) {
      let timingInfo = '';
      if (timingSuffix) {
        timingInfo = ` ${chalk.gray(timingSuffix)}`;
      } else if (this.timing) {
        timingInfo = ` ${chalk.gray(`(${duration}ms)`)}`;
      }
      console.log(`${chalk.green('✓ PASS')}${timingInfo}`);
    }
  }

  /**
   * Display test fail result
   * @param {string} errorMessage - Error message
   * @param {number} duration - Test duration in milliseconds
   */
  displayTestFail(errorMessage, duration) {
    if (!this.verbose && !this.quiet) {
      const timingInfo = this.timing ? chalk.gray(` (${duration}ms)`) : '';
      console.log(`${chalk.red('✗ FAIL')}${timingInfo}`);

      if (errorMessage) {
        console.log(chalk.red(`    ${errorMessage}`));
      }
      console.log();
    }
  }

  /**
   * Display stderr information
   * @param {string} stderr - Stderr content
   * @param {string} expectedStderr - Expected stderr pattern
   */
  displayStderrInfo(stderr, expectedStderr) {
    if (expectedStderr === 'toBeEmpty' && stderr.trim() !== '') {
      console.log(chalk.yellow(`    ⚠️  Unexpected stderr output: ${stderr.trim()}`));
    } else if (expectedStderr && expectedStderr !== 'toBeEmpty') {
      console.log(chalk.gray(`    📝 Stderr: ${stderr.trim()}`));
    }
  }

  /**
   * Display final test summary
   * @param {Object} summary - Test results summary
   * @param {number} totalDuration - Total execution duration
   */
  displaySummary(summary, totalDuration) {
    if (!this.quiet) {
      console.log();
      console.log(chalk.bold('📊 Test Results:'));
      console.log(`   ${chalk.green(`✓ ${summary.passed} passed`)}`);

      if (summary.failed > 0) {
        console.log(`   ${chalk.red(`✗ ${summary.failed} failed`)}`);
      }

      console.log(`   📈 Total: ${summary.total}`);

      if (this.timing) {
        console.log(`   ⏱️  Duration: ${totalDuration}ms`);
      }

      console.log();

      if (summary.failed === 0) {
        console.log(chalk.green.bold('🎉 All tests passed!'));
      } else {
        console.log(chalk.red.bold(`❌ ${summary.failed} test(s) failed`));
      }
    }
  }

  /**
   * Display summary of failed tests
   * @param {Array} failedTests - Array of failed tests with suite information
   */
  displayFailedTestsSummary(failedTests) {
    if (this.quiet || failedTests.length === 0) {
      return;
    }

    console.log();
    console.log(chalk.red.bold('❌ Failed Tests Summary:'));
    console.log();

    for (const test of failedTests) {
      console.log(chalk.red.bold(`📁 ${test.suiteName}`));
      console.log(chalk.gray(`   ${test.suiteFilePath}`));
      console.log(chalk.red(`  ✗ ${test.description}`));

      if (test.errorMessage) {
        console.log(chalk.red(`    ${test.errorMessage}`));
      }

      // Display validation errors if available
      if (test.validationResult && test.validationResult.errors && test.validationResult.errors.length > 0) {
        console.log(chalk.yellow('    🔍 Validation Details:'));
        for (const error of test.validationResult.errors.slice(0, 3)) { // Limit to first 3 errors
          console.log(chalk.yellow(`      • ${error.message || error.type}`));
          if (error.path) {
            console.log(chalk.gray(`        Path: ${error.path}`));
          }
        }
        if (test.validationResult.errors.length > 3) {
          console.log(chalk.yellow(`      ... and ${test.validationResult.errors.length - 3} more validation error(s)`));
        }
      }

      console.log();
    }
  }

  /**
   * Display performance metrics
   * @param {Object} metrics - Performance metrics
   */
  displayPerformanceMetrics(metrics) {
    if (!this.timing) {
      return;
    }

    console.log(chalk.yellow('   📊 Performance Metrics:'));
    Object.entries(metrics).forEach(([key, value]) => {
      if (value > 0) {
        console.log(chalk.yellow(`      ${key}: ${value}ms`));
      }
    });
  }

  /**
   * Display verbose test results
   * @param {Array} suiteResults - Array of suite results
   */
  displayVerboseResults(suiteResults) {
    console.log();
    console.log(chalk.bold.blue('📋 Test Results Hierarchy:'));
    console.log();

    for (const suite of suiteResults) {
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
          console.log();
        }
      }
      console.log();
    }
  }

  /**
   * Output results in JSON format
   * @param {Object} results - Complete results object
   */
  outputJsonResults(results) {
    console.log(JSON.stringify(results, null, 2));
  }

  /**
   * Display error message
   * @param {string} message - Error message
   */
  displayError(message) {
    console.log(chalk.red(`❌ ${message}`));
  }

  /**
   * Display info message
   * @param {string} message - Info message
   */
  displayInfo(message) {
    if (!this.quiet) {
      console.log(chalk.blue(`ℹ️  ${message}`));
    }
  }

  /**
   * Display warning message
   * @param {string} message - Warning message
   */
  displayWarning(message) {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }
}
