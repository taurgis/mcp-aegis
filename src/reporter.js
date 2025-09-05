import chalk from 'chalk';
import { diff } from 'jest-diff';

/**
 * Reporter class for formatting and displaying test results
 */
export class Reporter {
  constructor() {
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  /**
   * Logs the start of a test suite
   * @param {string} description - Suite description
   * @param {string} filePath - Path to the test file
   */
  logSuiteHeader(description, filePath) {
    console.log();
    console.log(chalk.bold.blue(`📋 ${description}`));
    console.log(chalk.gray(`   ${filePath}`));
    console.log();
  }

  /**
   * Logs the start of a test
   * @param {string} testDescription - Test description
   */
  logTestStart(testDescription) {
    process.stdout.write(`  ${chalk.gray('●')} ${testDescription} ... `);
  }

  /**
   * Logs a successful test
   */
  logTestPass() {
    console.log(chalk.green('✓ PASS'));
    this.passedTests++;
    this.totalTests++;
  }

  /**
   * Logs a failed test with detailed diff
   * @param {*} expected - Expected value
   * @param {*} actual - Actual value
   * @param {string} errorMessage - Optional error message
   */
  logTestFail(expected, actual, errorMessage = null) {
    console.log(chalk.red('✗ FAIL'));
    this.failedTests++;
    this.totalTests++;

    if (errorMessage) {
      console.log(chalk.red(`    ${errorMessage}`));
    }

    if (expected !== undefined && actual !== undefined) {
      const diffOutput = diff(expected, actual, {
        aAnnotation: 'Expected',
        bAnnotation: 'Received',
        contextLines: 2,
        expand: false
      });
      
      if (diffOutput && diffOutput !== 'Compared values have no visual difference.') {
        console.log();
        console.log(chalk.gray('    Diff:'));
        console.log('    ' + diffOutput.split('\n').join('\n    '));
      }
    }
    console.log();
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
    console.log();
    console.log(chalk.bold('📊 Test Results:'));
    console.log(`   ${chalk.green(`✓ ${this.passedTests} passed`)}`);
    
    if (this.failedTests > 0) {
      console.log(`   ${chalk.red(`✗ ${this.failedTests} failed`)}`);
    }
    
    console.log(`   📈 Total: ${this.totalTests}`);
    console.log();

    if (this.failedTests === 0) {
      console.log(chalk.green.bold('🎉 All tests passed!'));
    } else {
      console.log(chalk.red.bold(`❌ ${this.failedTests} test(s) failed`));
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
    console.log(chalk.blue(`ℹ️  ${message}`));
  }

  /**
   * Logs a warning message
   * @param {string} message - Warning message
   */
  logWarning(message) {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }
}
