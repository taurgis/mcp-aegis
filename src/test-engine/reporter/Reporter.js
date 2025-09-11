import { OutputFormatter } from './OutputFormatter.js';
import { PerformanceTracker } from './PerformanceTracker.js';
import { ValidationErrorAnalyzer } from './ValidationErrorAnalyzer.js';
import { PatternAnalyzer } from './PatternAnalyzer.js';
import { ResultsCollector } from './ResultsCollector.js';

/**
 * Main Reporter class that coordinates all reporting functionality
 * Follows composition pattern and single responsibility principle
 * Acts as a facade for the various specialized reporter modules
 */
export class Reporter {
  constructor(options = {}) {
    this.options = options;
    
    // Initialize specialized modules following composition pattern
    this.outputFormatter = new OutputFormatter(options);
    this.performanceTracker = new PerformanceTracker();
    this.validationErrorAnalyzer = new ValidationErrorAnalyzer();
    this.patternAnalyzer = new PatternAnalyzer();
    this.resultsCollector = new ResultsCollector();
  }

  // ==========================================
  // Debug and Communication Logging
  // ==========================================

  /**
   * Log debug information (delegated to OutputFormatter)
   * @param {string} message - Debug message
   * @param {*} data - Optional data to log
   */
  logDebug(message, data = null) {
    this.outputFormatter.logDebug(message, data);
  }

  /**
   * Log MCP communication details (delegated to OutputFormatter)
   * @param {string} direction - 'SEND' or 'RECV'
   * @param {Object} message - JSON-RPC message
   */
  logMCPCommunication(direction, message) {
    this.outputFormatter.logMCPCommunication(direction, message);
  }

  // ==========================================
  // Performance and Timing
  // ==========================================

  /**
   * Start timing for a suite (delegated to PerformanceTracker)
   */
  startSuiteTiming() {
    this.performanceTracker.startSuiteTiming();
  }

  /**
   * Start timing for a test (delegated to PerformanceTracker)
   */
  startTestTiming() {
    this.performanceTracker.startTestTiming();
  }

  /**
   * Log performance metrics (delegated to OutputFormatter)
   * @param {string} operation - Operation name
   * @param {number} duration - Duration in milliseconds
   */
  logPerformance(operation, duration) {
    this.outputFormatter.logPerformance(operation, duration);
  }

  /**
   * Record performance metric (delegated to PerformanceTracker)
   * @param {string} metric - Metric name
   * @param {number} duration - Duration in milliseconds
   */
  recordPerformance(metric, duration) {
    this.performanceTracker.recordPerformance(metric, duration);
  }

  // ==========================================
  // Test Suite Lifecycle
  // ==========================================

  /**
   * Logs the start of a test suite
   * @param {string} description - Suite description
   * @param {string} filePath - Path to the test file
   */
  logSuiteHeader(description, filePath) {
    this.startSuiteTiming();
    this.resultsCollector.startSuite(description, filePath);
    this.outputFormatter.displaySuiteHeader(description, filePath);
    this.logDebug(`Starting test suite: ${description}`);
  }

  /**
   * Logs the start of a test
   * @param {string} testDescription - Test description
   */
  logTestStart(testDescription) {
    this.startTestTiming();
    this.resultsCollector.startTest(testDescription);
    this.outputFormatter.displayTestStart(testDescription);
    this.logDebug(`Starting test: ${testDescription}`);
  }

  /**
   * Logs a successful test
   * @param {string} [timingSuffix] - Optional timing suffix to display (e.g., "(150ms)")
   */
  logTestPass(timingSuffix = null) {
    const duration = this.performanceTracker.getTestDuration();
    
    this.resultsCollector.recordTestPass(duration);
    this.outputFormatter.displayTestPass(timingSuffix, duration);
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
    const duration = this.performanceTracker.getTestDuration();
    
    this.resultsCollector.recordTestFail(expected, actual, errorMessage, validationResult, duration);
    this.outputFormatter.displayTestFail(errorMessage, duration);

    // Display enhanced validation analysis if available
    if (validationResult && validationResult.errors && validationResult.errors.length > 0) {
      this.validationErrorAnalyzer.displayEnhancedValidationErrors(validationResult);
    } else if (expected !== undefined && actual !== undefined) {
      this.patternAnalyzer.displayIntelligentDiff(expected, actual);
    }

    this.logDebug(`Test failed in ${duration}ms`, { errorMessage, expected, actual, validationResult });
  }

  /**
   * Finalizes the current test suite
   */
  finalizeSuite() {
    const suiteDuration = this.performanceTracker.getSuiteDuration();
    this.resultsCollector.finalizeSuite(suiteDuration);
    this.logPerformance('Test suite completed', suiteDuration);
  }

  // ==========================================
  // Output and Display
  // ==========================================

  /**
   * Logs stderr output if not empty (delegated to OutputFormatter)
   * @param {string} stderr - Stderr content
   * @param {string} expectedStderr - Expected stderr pattern
   */
  logStderrInfo(stderr, expectedStderr) {
    this.outputFormatter.displayStderrInfo(stderr, expectedStderr);
  }

  /**
   * Logs final test results summary
   */
  logSummary() {
    const totalDuration = this.performanceTracker.getTotalDuration();
    const summary = this.resultsCollector.getSummary();
    const performanceMetrics = this.performanceTracker.getPerformanceMetrics();

    if (this.options.json) {
      const results = this.resultsCollector.createCompleteResults(totalDuration, performanceMetrics);
      this.outputFormatter.outputJsonResults(results);
      return;
    }

    if (this.options.verbose) {
      this.outputFormatter.displayVerboseResults(this.resultsCollector.getSuiteResults());
    }

    this.outputFormatter.displaySummary(summary, totalDuration);

    if (this.options.timing) {
      this.outputFormatter.displayPerformanceMetrics(performanceMetrics);
    }
  }

  // ==========================================
  // Simple Message Logging
  // ==========================================

  /**
   * Logs an error message (delegated to OutputFormatter)
   * @param {string} message - Error message
   */
  logError(message) {
    this.outputFormatter.displayError(message);
  }

  /**
   * Logs an info message (delegated to OutputFormatter)
   * @param {string} message - Info message
   */
  logInfo(message) {
    this.outputFormatter.displayInfo(message);
  }

  /**
   * Logs a warning message (delegated to OutputFormatter)
   * @param {string} message - Warning message
   */
  logWarning(message) {
    this.outputFormatter.displayWarning(message);
  }

  // ==========================================
  // Result Access
  // ==========================================

  /**
   * Returns whether all tests passed (delegated to ResultsCollector)
   * @returns {boolean}
   */
  allTestsPassed() {
    return this.resultsCollector.allTestsPassed();
  }

  /**
   * Get test results summary (delegated to ResultsCollector)
   * @returns {Object} Summary object
   */
  getSummary() {
    return this.resultsCollector.getSummary();
  }

  /**
   * Get all suite results (delegated to ResultsCollector)
   * @returns {Array} Array of suite results
   */
  getSuiteResults() {
    return this.resultsCollector.getSuiteResults();
  }
}
