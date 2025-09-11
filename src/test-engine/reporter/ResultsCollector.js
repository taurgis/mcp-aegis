/**
 * Manages collection and organization of test results
 * Follows single responsibility principle - only concerned with result data management
 */
export class ResultsCollector {
  constructor() {
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.suiteResults = [];
    this.currentSuite = null;
    this.currentTest = null;
  }

  /**
   * Start a new test suite
   * @param {string} description - Suite description
   * @param {string} filePath - Path to the test file
   */
  startSuite(description, filePath) {
    this.currentSuite = {
      description,
      filePath,
      tests: [],
      startTime: Date.now(),
      duration: 0,
    };
  }

  /**
   * Start a new test
   * @param {string} testDescription - Test description
   */
  startTest(testDescription) {
    this.currentTest = {
      description: testDescription,
      status: 'running',
      startTime: Date.now(),
      duration: 0,
    };
  }

  /**
   * Record a test pass
   * @param {number} duration - Test duration in milliseconds
   */
  recordTestPass(duration = 0) {
    this.passedTests++;
    this.totalTests++;

    if (this.currentTest) {
      this.currentTest.status = 'passed';
      this.currentTest.duration = duration;
      
      // Only push to suite if it exists
      if (this.currentSuite && this.currentSuite.tests) {
        this.currentSuite.tests.push({ ...this.currentTest });
      }
    }
  }

  /**
   * Record a test failure
   * @param {*} expected - Expected value
   * @param {*} actual - Actual value
   * @param {string} errorMessage - Error message
   * @param {ValidationResult} validationResult - Enhanced validation result
   * @param {number} duration - Test duration in milliseconds
   */
  recordTestFail(expected, actual, errorMessage = null, validationResult = null, duration = 0) {
    this.failedTests++;
    this.totalTests++;

    if (this.currentTest) {
      this.currentTest.status = 'failed';
      this.currentTest.expected = expected;
      this.currentTest.actual = actual;
      this.currentTest.errorMessage = errorMessage;
      this.currentTest.validationResult = validationResult;
      this.currentTest.duration = duration;
      
      // Only push to suite if it exists
      if (this.currentSuite && this.currentSuite.tests) {
        this.currentSuite.tests.push({ ...this.currentTest });
      }
    }
  }

  /**
   * Finalize the current test suite
   * @param {number} duration - Suite duration in milliseconds
   */
  finalizeSuite(duration = 0) {
    if (this.currentSuite) {
      this.currentSuite.duration = duration;
      this.suiteResults.push({ ...this.currentSuite });
      this.currentSuite = null;
    }
  }

  /**
   * Get test results summary
   * @returns {Object} Summary object
   */
  getSummary() {
    return {
      total: this.totalTests,
      passed: this.passedTests,
      failed: this.failedTests,
      success: this.failedTests === 0,
    };
  }

  /**
   * Get all suite results
   * @returns {Array} Array of suite results
   */
  getSuiteResults() {
    return [...this.suiteResults];
  }

  /**
   * Check if all tests passed
   * @returns {boolean} Whether all tests passed
   */
  allTestsPassed() {
    return this.failedTests === 0;
  }

  /**
   * Get current test information
   * @returns {Object|null} Current test object or null
   */
  getCurrentTest() {
    return this.currentTest ? { ...this.currentTest } : null;
  }

  /**
   * Get current suite information
   * @returns {Object|null} Current suite object or null
   */
  getCurrentSuite() {
    return this.currentSuite ? { ...this.currentSuite } : null;
  }

  /**
   * Reset all collected results
   */
  reset() {
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.suiteResults = [];
    this.currentSuite = null;
    this.currentTest = null;
  }

  /**
   * Create complete results object for JSON output
   * @param {number} totalDuration - Total execution duration
   * @param {Object} performanceMetrics - Performance metrics
   * @returns {Object} Complete results object
   */
  createCompleteResults(totalDuration, performanceMetrics) {
    return {
      summary: {
        ...this.getSummary(),
        duration: totalDuration,
      },
      performance: {
        ...performanceMetrics,
        total: totalDuration,
      },
      suites: this.getSuiteResults(),
    };
  }
}
