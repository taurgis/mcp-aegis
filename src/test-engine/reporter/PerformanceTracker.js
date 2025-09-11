/**
 * Handles performance tracking and timing measurements
 * Follows single responsibility principle - only concerned with performance metrics
 */
export class PerformanceTracker {
  constructor() {
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
   * Get test duration since test start
   * @returns {number} Duration in milliseconds
   */
  getTestDuration() {
    return this.testStartTime ? Date.now() - this.testStartTime : 0;
  }

  /**
   * Get suite duration since suite start
   * @returns {number} Duration in milliseconds
   */
  getSuiteDuration() {
    return this.suiteStartTime ? Date.now() - this.suiteStartTime : 0;
  }

  /**
   * Get total duration since tracker creation
   * @returns {number} Duration in milliseconds
   */
  getTotalDuration() {
    return Date.now() - this.startTime;
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
   * Get all performance metrics
   * @returns {Object} Performance metrics object
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Reset all timing state
   */
  reset() {
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
}
