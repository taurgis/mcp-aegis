import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { PerformanceTracker } from '../../src/test-engine/reporter/PerformanceTracker.js';
import { ResultsCollector } from '../../src/test-engine/reporter/ResultsCollector.js';

describe('Reporter Coverage Completers', () => {
  describe('PerformanceTracker Coverage', () => {
    let tracker;

    beforeEach(() => {
      tracker = new PerformanceTracker();
    });

    it('should reset performance tracker state', () => {
      // Set some initial state
      tracker.recordPerformance('serverStartTime', 1000);
      tracker.startSuiteTiming();
      tracker.startTestTiming();

      // Reset should clear everything
      tracker.reset();

      // Verify reset state
      const metrics = tracker.getPerformanceMetrics();
      assert.equal(metrics.serverStartTime, 0);
      assert.equal(metrics.handshakeTime, 0);
      assert.equal(metrics.totalTestTime, 0);
      assert.equal(metrics.communicationTime, 0);

      // Should return 0 for durations after reset
      assert.equal(tracker.getTestDuration(), 0);
      assert.equal(tracker.getSuiteDuration(), 0);
    });

    it('should handle performance metrics with predefined keys only', () => {
      // Test all predefined metric keys
      tracker.recordPerformance('serverStartTime', 100);
      tracker.recordPerformance('handshakeTime', 200);
      tracker.recordPerformance('totalTestTime', 300);
      tracker.recordPerformance('communicationTime', 400);

      const metrics = tracker.getPerformanceMetrics();
      assert.equal(metrics.serverStartTime, 100);
      assert.equal(metrics.handshakeTime, 200);
      assert.equal(metrics.totalTestTime, 300);
      assert.equal(metrics.communicationTime, 400);

      // Test that unknown keys are ignored
      tracker.recordPerformance('unknownKey', 999);
      const metricsAfter = tracker.getPerformanceMetrics();
      assert.equal(metricsAfter.unknownKey, undefined);
    });
  });

  describe('ResultsCollector Coverage', () => {
    let collector;

    beforeEach(() => {
      collector = new ResultsCollector();
    });

    it('should handle test recording without active suite gracefully', () => {
      // Try to record test without starting suite
      collector.startTest('orphan test');
      collector.recordTestPass(100);

      // Should not crash and maintain valid state
      const summary = collector.getSummary();
      assert.equal(summary.total, 1);
      assert.equal(summary.passed, 1);
      assert.equal(summary.failed, 0);
    });

    it('should handle test results with proper structure', () => {
      collector.startSuite('Test Suite', '/path/to/test.yml');
      collector.startTest('should pass');

      // Complete test properly
      collector.recordTestPass(150);
      collector.finalizeSuite(500);

      const suites = collector.getSuiteResults();
      assert.equal(suites.length, 1);
      assert.equal(suites[0].description, 'Test Suite');
      assert.equal(suites[0].tests.length, 1);
      assert.equal(suites[0].tests[0].status, 'passed');
    });

    it('should create complete results with proper structure', () => {
      collector.startSuite('Test Suite', '/test.yml');
      collector.startTest('test 1');
      collector.recordTestPass(100);

      // Manually add test to suite for complete structure
      if (collector.currentSuite && collector.currentTest) {
        collector.currentSuite.tests.push({
          ...collector.currentTest,
          passed: true,
          duration: 100,
          error: null,
        });
      }

      collector.finalizeSuite(200);

      const performanceMetrics = {
        serverStartTime: 500,
        handshakeTime: 100,
      };
      const results = collector.createCompleteResults(1000, performanceMetrics);

      assert.ok(results.summary);
      assert.ok(results.performance);
      assert.ok(results.suites);
      assert.equal(results.summary.total, 1);
      assert.equal(results.summary.passed, 1);
      assert.equal(results.summary.duration, 1000);
      assert.equal(results.performance.serverStartTime, 500);
      assert.equal(results.performance.handshakeTime, 100);
      assert.equal(results.suites.length, 1);
    });

    it('should handle edge cases in result collection', () => {
      // Test finalize without active suite
      collector.finalizeSuite(100);
      assert.equal(collector.getSuiteResults().length, 0);

      // Test recording without active test
      collector.recordTestPass(50);
      assert.equal(collector.getSummary().total, 1);

      // Test recording fail without active test
      collector.recordTestFail('exp', 'act', 'failed', null, 100);
      const summary = collector.getSummary();
      assert.equal(summary.total, 2);
      assert.equal(summary.failed, 1);
    });

    it('should handle complex test scenarios', () => {
      // Multiple suites with different test outcomes
      collector.startSuite('Suite 1', '/test1.yml');
      collector.startTest('test 1-1');
      collector.recordTestPass(100);
      collector.startTest('test 1-2');
      collector.recordTestFail('expected', 'actual', 'Test failed', null, 150);
      collector.finalizeSuite(250);

      collector.startSuite('Suite 2', '/test2.yml');
      collector.startTest('test 2-1');
      collector.recordTestPass(75);
      collector.finalizeSuite(75);

      const summary = collector.getSummary();
      assert.equal(summary.total, 3);
      assert.equal(summary.passed, 2);
      assert.equal(summary.failed, 1);
      assert.equal(summary.success, false);

      const suites = collector.getSuiteResults();
      assert.equal(suites.length, 2);
      assert.equal(suites[0].description, 'Suite 1');
      assert.equal(suites[1].description, 'Suite 2');
    });
  });
});
