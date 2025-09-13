import chalk from 'chalk';
import { analyzeSyntaxErrors } from '../matchers/syntaxAnalyzer.js';

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
    // New debugging options
    this.errorsOnly = options.errorsOnly || false;
    this.syntaxOnly = options.syntaxOnly || false;
    this.noAnalysis = options.noAnalysis || false;
    this.groupErrors = options.groupErrors || false;
    this.maxErrors = options.maxErrors || 5;
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
    // Skip suite headers in errorsOnly mode unless verbose is enabled
    if (this.errorsOnly && !this.verbose) {
      return;
    }

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
    // In errorsOnly mode, we'll conditionally show this later based on test result
    if (this.errorsOnly) {
      this.pendingTestDescription = testDescription;
      return;
    }

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
    // Skip passing tests if errorsOnly mode is enabled
    if (this.errorsOnly) {
      // Clear any pending test description since the test passed
      this.pendingTestDescription = null;
      return;
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
  }

  /**
   * Display test fail result
   * @param {string} errorMessage - Error message
   * @param {number} duration - Test duration in milliseconds
   */
  displayTestFail(errorMessage, duration) {
    if (!this.verbose && !this.quiet) {
      // In errorsOnly mode, show the test description first
      if (this.errorsOnly && this.pendingTestDescription) {
        process.stdout.write(`  ${chalk.gray('●')} ${this.pendingTestDescription} ... `);
        this.pendingTestDescription = null;
      }

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
    
    if (this.errorsOnly) {
      console.log(chalk.red.bold('🚨 Error-Only Summary:'));
    } else {
      console.log(chalk.red.bold('❌ Failed Tests Summary:'));
    }
    
    console.log();

    // Group errors by type if requested
    if (this.groupErrors) {
      this.displayGroupedErrorSummary(failedTests);
      return;
    }

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
        for (const error of test.validationResult.errors.slice(0, this.maxErrors)) { // Use maxErrors limit
          console.log(chalk.yellow(`      • ${error.message || error.type}`));
          if (error.path) {
            console.log(chalk.gray(`        Path: ${error.path}`));
          }
        }
        if (test.validationResult.errors.length > this.maxErrors) {
          console.log(chalk.yellow(`      ... and ${test.validationResult.errors.length - this.maxErrors} more validation error(s)`));
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

  /**
   * Display grouped error summary to reduce repetition
   * @param {Array} failedTests - Array of failed tests
   */
  displayGroupedErrorSummary(failedTests) {
    const errorGroups = new Map();
    
    // Group errors by type and pattern
    failedTests.forEach(test => {
      if (test.validationResult && test.validationResult.errors) {
        test.validationResult.errors.forEach(error => {
          let key = error.type;
          if (error.type === 'pattern_failed' && error.expected) {
            key = `${error.type}:${error.expected}`;
          }
          
          if (!errorGroups.has(key)) {
            errorGroups.set(key, {
              type: error.type,
              pattern: error.expected,
              message: error.message,
              count: 0,
              tests: [],
              paths: new Set(),
              fieldNames: new Set(), // For structural aggregation improvements
            });
          }
          
          const group = errorGroups.get(key);
          group.count++;
          group.tests.push(`${test.suiteName} > ${test.description}`);
          if (error.path) {
            group.paths.add(error.path);
            // Extract terminal field name for structural errors (response.result.isoDate -> isoDate)
            if (error.type === 'extra_field' || error.type === 'missing_field') {
              const lastSegment = error.path.split(/\.|\//).pop();
              if (lastSegment && !lastSegment.includes('[')) {
                group.fieldNames.add(lastSegment.replace(/^result\.?/, ''));
              }
            }
          }
        });
      }
    });

    // Display grouped errors
    console.log(chalk.cyan(`📊 Found ${errorGroups.size} unique error pattern(s):`));
    console.log();

    for (const [, group] of errorGroups) {
      console.log(chalk.red(`❌ ${group.type.replace('_', ' ').toUpperCase()}`));

      let displayMessage = group.message;
      if ((group.type === 'extra_field' || group.type === 'missing_field') && group.fieldNames.size > 1) {
        const names = [...group.fieldNames];
        const limited = names.slice(0, 8);
        displayMessage = group.type === 'extra_field'
          ? `Unexpected field(s): ${limited.join(', ')}${names.length > 8 ? `, +${names.length - 8} more` : ''}`
          : `Missing required field(s): ${limited.join(', ')}${names.length > 8 ? `, +${names.length - 8} more` : ''}`;
      }
      console.log(chalk.white(`   ${displayMessage}`));

      const uniqueTests = [...new Set(group.tests)].length;
      // Provide distinct metrics for structural noise reduction
      if (group.type === 'extra_field' || group.type === 'missing_field') {
        console.log(chalk.yellow(`   Affected ${uniqueTests} test(s); ${group.fieldNames.size || group.paths.size} distinct field path(s); ${group.count} total occurrence(s)`));
      } else {
        console.log(chalk.yellow(`   Occurred ${group.count} time(s) across ${uniqueTests} test(s)`));
      }

      if (group.paths.size > 0) {
        const pathList = [...group.paths].slice(0, 3).join(', ');
        console.log(chalk.gray(`   Paths: ${pathList}`));
        if (group.paths.size > 3) {
          console.log(chalk.gray(`          ... and ${group.paths.size - 3} more`));
        }
      }

      if (group.pattern && this.syntaxOnly) {
        const syntaxAnalysis = analyzeSyntaxErrors ? analyzeSyntaxErrors(group.pattern) : null;
        if (syntaxAnalysis && syntaxAnalysis.hasSyntaxErrors) {
          console.log(chalk.magenta('   🔧 Syntax Issues Detected'));
        }
      }

      console.log();
    }
  }
}
