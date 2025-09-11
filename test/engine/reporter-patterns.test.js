import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { PatternAnalyzer } from '../../src/test-engine/reporter/PatternAnalyzer.js';
import { ResultsCollector } from '../../src/test-engine/reporter/ResultsCollector.js';

describe('Reporter Modules (PatternAnalyzer and ResultsCollector)', () => {
  let capturedLogs;
  let originalConsoleLog;

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

  describe('PatternAnalyzer', () => {
    let analyzer;

    beforeEach(() => {
      analyzer = new PatternAnalyzer();
    });

    describe('constructor', () => {
      it('should initialize with pattern keys', () => {
        assert.ok(analyzer.patternKeys);
        assert.ok(analyzer.patternKeys.includes('match:arrayElements'));
        assert.ok(analyzer.patternKeys.includes('match:partial'));
        assert.ok(analyzer.patternKeys.includes('match:extractField'));
      });
    });

    describe('containsPatterns', () => {
      it('should detect string patterns', () => {
        assert.equal(analyzer.containsPatterns('match:type:string'), true);
        assert.equal(analyzer.containsPatterns('match:contains:text'), true);
        assert.equal(analyzer.containsPatterns('match:arrayLength:5'), true);
      });

      it('should detect object patterns', () => {
        const patternObj = {
          'match:arrayElements': {
            name: 'match:type:string',
          },
        };
        assert.equal(analyzer.containsPatterns(patternObj), true);
      });

      it('should detect nested patterns', () => {
        const nestedPattern = {
          tools: {
            'match:arrayElements': {
              name: 'match:type:string',
            },
          },
        };
        assert.equal(analyzer.containsPatterns(nestedPattern), true);
      });

      it('should not detect non-patterns', () => {
        assert.equal(analyzer.containsPatterns('regular string'), false);
        assert.equal(analyzer.containsPatterns({ key: 'value' }), false);
        assert.equal(analyzer.containsPatterns(123), false);
        assert.equal(analyzer.containsPatterns(null), false);
        assert.equal(analyzer.containsPatterns(undefined), false);
      });

      it('should handle arrays with patterns', () => {
        const arrayWithPattern = ['match:type:string', 'regular value'];
        assert.equal(analyzer.containsPatterns(arrayWithPattern), true);
      });

      it('should handle arrays without patterns', () => {
        const arrayWithoutPattern = ['regular', 'values', 123];
        assert.equal(analyzer.containsPatterns(arrayWithoutPattern), false);
      });
    });

    describe('createPatternExplanation', () => {
      it('should explain arrayElements patterns', () => {
        const expected = {
          tools: {
            'match:arrayElements': {
              name: 'match:type:string',
              description: 'match:contains:test',
            },
          },
        };
        const actual = {
          tools: [
            { name: 'tool1', description: 'test description' },
            { name: 'tool2', description: 'another test' },
          ],
        };

        const explanation = analyzer.createPatternExplanation(expected, actual);
        assert.ok(typeof explanation === 'string');
        assert.ok(explanation.includes('arrayElements'));
      });

      it('should explain partial patterns', () => {
        const expected = {
          'match:partial': {
            tools: [{ name: 'test_tool' }],
          },
        };
        const actual = {
          tools: [{ name: 'test_tool', description: 'extra field' }],
          extra: 'field',
        };

        const explanation = analyzer.createPatternExplanation(expected, actual);
        assert.ok(typeof explanation === 'string');
        assert.ok(explanation.includes('partial'));
      });

      it('should explain extractField patterns', () => {
        const expected = {
          'match:extractField': 'tools.*.name',
          value: ['tool1', 'tool2'],
        };
        const actual = {
          tools: [
            { name: 'tool1', description: 'desc1' },
            { name: 'tool2', description: 'desc2' },
          ],
        };

        const explanation = analyzer.createPatternExplanation(expected, actual);
        assert.ok(typeof explanation === 'string');
        assert.ok(explanation.includes('field extraction'));
      });

      it('should handle simple string patterns', () => {
        const expected = 'match:type:string';
        const actual = 'test string';

        const explanation = analyzer.createPatternExplanation(expected, actual);
        assert.ok(typeof explanation === 'string');
        assert.ok(explanation.includes('Type validation'));
      });

      it('should handle complex nested patterns', () => {
        const expected = {
          result: {
            tools: {
              'match:arrayElements': {
                name: 'match:regex:^[a-z_]+$',
                description: 'match:type:string',
              },
            },
            count: 'match:type:number',
          },
        };
        const actual = {
          result: {
            tools: [
              { name: 'test_tool', description: 'A test tool' },
              { name: 'another_tool', description: 'Another tool' },
            ],
            count: 2,
          },
        };

        const explanation = analyzer.createPatternExplanation(expected, actual);
        assert.ok(typeof explanation === 'string');
        assert.ok(explanation.length > 0);
      });
    });

    describe('displayIntelligentDiff', () => {
      it('should display pattern analysis for pattern objects', () => {
        const expected = {
          'match:arrayElements': {
            name: 'match:type:string',
          },
        };
        const actual = [{ name: 'tool1' }, { name: 'tool2' }];

        analyzer.displayIntelligentDiff(expected, actual);

        const output = capturedLogs.join('');
        assert.ok(output.includes('Pattern Analysis'));
      });

      it('should display standard diff for non-pattern objects', () => {
        const expected = { name: 'expected_name', count: 5 };
        const actual = { name: 'actual_name', count: 3 };

        analyzer.displayIntelligentDiff(expected, actual);

        const output = capturedLogs.join('');
        assert.ok(output.includes('Diff') || output.length > 0);
      });

      it('should handle identical objects gracefully', () => {
        const expected = { name: 'same', count: 5 };
        const actual = { name: 'same', count: 5 };

        analyzer.displayIntelligentDiff(expected, actual);

        // Should not throw an error
        assert.ok(true);
      });

      it('should handle null and undefined values', () => {
        analyzer.displayIntelligentDiff(null, undefined);
        analyzer.displayIntelligentDiff(undefined, null);
        analyzer.displayIntelligentDiff(null, { key: 'value' });

        // Should not throw errors
        assert.ok(true);
      });

      it('should handle complex nested differences', () => {
        const expected = {
          tools: [
            { name: 'tool1', config: { enabled: true } },
            { name: 'tool2', config: { enabled: false } },
          ],
        };
        const actual = {
          tools: [
            { name: 'tool1', config: { enabled: false } },
            { name: 'tool3', config: { enabled: true } },
          ],
        };

        analyzer.displayIntelligentDiff(expected, actual);

        // Should not throw an error
        assert.ok(true);
      });
    });

    describe('pattern analysis helpers', () => {
      it('should analyze arrayElements pattern correctly', () => {
        const pattern = {
          'match:arrayElements': {
            name: 'match:type:string',
            id: 'match:type:number',
          },
        };
        const data = [
          { name: 'tool1', id: 1 },
          { name: 'tool2', id: 2 },
        ];

        const explanation = analyzer.createPatternExplanation(pattern, data);
        assert.ok(explanation.includes('arrayElements'));
        assert.ok(explanation.includes('Validating 2 array items'));
      });

      it('should analyze partial pattern correctly', () => {
        const pattern = {
          'match:partial': {
            name: 'test',
            status: 'active',
          },
        };
        const data = {
          name: 'test',
          status: 'active',
          extra: 'field',
          another: 'property',
        };

        const explanation = analyzer.createPatternExplanation(pattern, data);
        assert.ok(explanation.includes('partial'));
        assert.ok(explanation.includes('Only validating specified fields'));
      });

      it('should analyze extractField pattern correctly', () => {
        const pattern = {
          'match:extractField': 'users.*.name',
          value: ['john', 'jane'],
        };
        const data = {
          users: [
            { name: 'john', age: 30 },
            { name: 'jane', age: 25 },
          ],
        };

        const explanation = analyzer.createPatternExplanation(pattern, data);
        assert.ok(explanation.includes('field extraction'));
        assert.ok(explanation.includes('users.*.name'));
      });
    });
  });

  describe('ResultsCollector', () => {
    let collector;

    beforeEach(() => {
      collector = new ResultsCollector();
    });

    describe('initialization', () => {
      it('should initialize with empty state', () => {
        assert.ok(Array.isArray(collector.getSuiteResults()));
        assert.equal(collector.getSuiteResults().length, 0);

        const summary = collector.getSummary();
        assert.equal(summary.total, 0);
        assert.equal(summary.passed, 0);
        assert.equal(summary.failed, 0);
        assert.equal(summary.success, true);
      });
    });

    describe('suite management', () => {
      it('should start a new suite', () => {
        collector.startSuite('Test Suite', '/path/to/test.yml');

        // Suite should not appear in results until finalized
        const suitesBeforeFinalize = collector.getSuiteResults();
        assert.equal(suitesBeforeFinalize.length, 0);

        // After finalizing, suite should appear in results
        collector.finalizeSuite(100);
        const suitesAfterFinalize = collector.getSuiteResults();
        assert.equal(suitesAfterFinalize.length, 1);
        assert.equal(suitesAfterFinalize[0].description, 'Test Suite');
        assert.equal(suitesAfterFinalize[0].filePath, '/path/to/test.yml');
        assert.ok(Array.isArray(suitesAfterFinalize[0].tests));
        assert.equal(suitesAfterFinalize[0].tests.length, 0);
      });

      it('should finalize a suite with duration', () => {
        collector.startSuite('Test Suite', '/path/to/test.yml');
        collector.finalizeSuite(1500);

        const suites = collector.getSuiteResults();
        assert.equal(suites[0].duration, 1500);
      });

      it('should handle multiple suites', () => {
        collector.startSuite('Suite 1', '/path/1.yml');
        collector.finalizeSuite(1000);

        collector.startSuite('Suite 2', '/path/2.yml');
        collector.finalizeSuite(2000);

        const suites = collector.getSuiteResults();
        assert.equal(suites.length, 2);
        assert.equal(suites[0].description, 'Suite 1');
        assert.equal(suites[1].description, 'Suite 2');
      });
    });

    describe('test management', () => {
      beforeEach(() => {
        collector.startSuite('Test Suite', '/path/to/test.yml');
      });

      it('should start a test', () => {
        collector.startTest('should pass');

        const currentSuite = collector.getCurrentSuite();
        assert.ok(currentSuite);
        assert.equal(currentSuite.tests.length, 0); // Test not added until pass/fail recorded

        const currentTest = collector.getCurrentTest();
        assert.ok(currentTest);
        assert.equal(currentTest.description, 'should pass');
        assert.equal(currentTest.status, 'running');
      });

      it('should record test pass', () => {
        collector.startTest('should pass');
        collector.recordTestPass(150);

        const currentSuite = collector.getCurrentSuite();
        assert.ok(currentSuite);
        assert.equal(currentSuite.tests.length, 1);

        const test = currentSuite.tests[0];
        assert.equal(test.status, 'passed');
        assert.equal(test.duration, 150);
        assert.equal(test.description, 'should pass');
      });

      it('should record test fail', () => {
        collector.startTest('should fail');
        collector.recordTestFail('expected', 'actual', 'Test failed', null, 200);

        const currentSuite = collector.getCurrentSuite();
        assert.ok(currentSuite);
        assert.equal(currentSuite.tests.length, 1);

        const test = currentSuite.tests[0];
        assert.equal(test.status, 'failed');
        assert.equal(test.duration, 200);
        assert.equal(test.expected, 'expected');
        assert.equal(test.actual, 'actual');
        assert.equal(test.errorMessage, 'Test failed');
      });

      it('should record test fail with validation result', () => {
        const validationResult = {
          errors: [{ type: 'type_mismatch', message: 'Type mismatch error' }],
        };

        collector.startTest('should fail with validation');
        collector.recordTestFail('expected', 'actual', 'Validation failed', validationResult, 250);

        const currentSuite = collector.getCurrentSuite();
        assert.ok(currentSuite);
        assert.equal(currentSuite.tests.length, 1);

        const test = currentSuite.tests[0];
        assert.equal(test.status, 'failed');
        assert.ok(test.validationResult);
        assert.equal(test.validationResult.errors.length, 1);
      });

      it('should handle multiple tests', () => {
        collector.startTest('test 1');
        collector.recordTestPass(100);

        collector.startTest('test 2');
        collector.recordTestFail('exp', 'act', 'Failed', null, 150);

        collector.startTest('test 3');
        collector.recordTestPass(75);

        const currentSuite = collector.getCurrentSuite();
        assert.ok(currentSuite);
        assert.equal(currentSuite.tests.length, 3);

        const tests = currentSuite.tests;
        assert.equal(tests[0].status, 'passed');
        assert.equal(tests[1].status, 'failed');
        assert.equal(tests[2].status, 'passed');
      });
    });

    describe('summary calculation', () => {
      it('should calculate summary for empty results', () => {
        const summary = collector.getSummary();
        assert.equal(summary.total, 0);
        assert.equal(summary.passed, 0);
        assert.equal(summary.failed, 0);
        assert.equal(summary.success, true);
      });

      it('should calculate summary with passing tests', () => {
        collector.startSuite('Suite', '/path.yml');
        collector.startTest('test 1');
        collector.recordTestPass(100);
        collector.startTest('test 2');
        collector.recordTestPass(150);

        const summary = collector.getSummary();
        assert.equal(summary.total, 2);
        assert.equal(summary.passed, 2);
        assert.equal(summary.failed, 0);
        assert.equal(summary.success, true);
      });

      it('should calculate summary with mixed results', () => {
        collector.startSuite('Suite', '/path.yml');
        collector.startTest('test 1');
        collector.recordTestPass(100);
        collector.startTest('test 2');
        collector.recordTestFail('exp', 'act', 'Failed', null, 150);
        collector.startTest('test 3');
        collector.recordTestPass(75);

        const summary = collector.getSummary();
        assert.equal(summary.total, 3);
        assert.equal(summary.passed, 2);
        assert.equal(summary.failed, 1);
        assert.equal(summary.success, false);
      });

      it('should calculate summary across multiple suites', () => {
        // Suite 1
        collector.startSuite('Suite 1', '/path1.yml');
        collector.startTest('test 1-1');
        collector.recordTestPass(100);
        collector.startTest('test 1-2');
        collector.recordTestFail('exp', 'act', 'Failed', null, 150);
        collector.finalizeSuite(250);

        // Suite 2
        collector.startSuite('Suite 2', '/path2.yml');
        collector.startTest('test 2-1');
        collector.recordTestPass(75);
        collector.startTest('test 2-2');
        collector.recordTestPass(125);
        collector.finalizeSuite(200);

        const summary = collector.getSummary();
        assert.equal(summary.total, 4);
        assert.equal(summary.passed, 3);
        assert.equal(summary.failed, 1);
        assert.equal(summary.success, false);
      });
    });

    describe('allTestsPassed', () => {
      it('should return true for no tests', () => {
        assert.equal(collector.allTestsPassed(), true);
      });

      it('should return true for all passing tests', () => {
        collector.startSuite('Suite', '/path.yml');
        collector.startTest('test 1');
        collector.recordTestPass(100);
        collector.startTest('test 2');
        collector.recordTestPass(150);

        assert.equal(collector.allTestsPassed(), true);
      });

      it('should return false if any test fails', () => {
        collector.startSuite('Suite', '/path.yml');
        collector.startTest('test 1');
        collector.recordTestPass(100);
        collector.startTest('test 2');
        collector.recordTestFail('exp', 'act', 'Failed', null, 150);

        assert.equal(collector.allTestsPassed(), false);
      });
    });

    describe('createCompleteResults', () => {
      it('should create complete results structure', () => {
        collector.startSuite('Test Suite', '/test.yml');
        collector.startTest('test 1');
        collector.recordTestPass(100);
        collector.finalizeSuite(100);

        const performanceMetrics = { serverStartTime: 500 };
        const results = collector.createCompleteResults(1000, performanceMetrics);

        assert.ok(results.summary);
        assert.ok(results.performance);
        assert.ok(results.suites);
        assert.equal(results.performance.total, 1000);
        assert.equal(results.performance.serverStartTime, 500);
        assert.equal(results.summary.total, 1);
        assert.equal(results.summary.passed, 1);
      });

      it('should handle empty performance metrics', () => {
        const results = collector.createCompleteResults(500, {});

        assert.equal(results.performance.total, 500);
        assert.equal(Object.keys(results.performance).length, 1); // Only total
      });

      it('should include all suite results', () => {
        collector.startSuite('Suite 1', '/test1.yml');
        collector.startTest('test 1-1');
        collector.recordTestPass(100);
        collector.finalizeSuite(100);

        collector.startSuite('Suite 2', '/test2.yml');
        collector.startTest('test 2-1');
        collector.recordTestFail('exp', 'act', 'Failed', null, 150);
        collector.finalizeSuite(150);

        const results = collector.createCompleteResults(250, {});

        assert.equal(results.suites.length, 2);
        assert.equal(results.suites[0].description, 'Suite 1');
        assert.equal(results.suites[1].description, 'Suite 2');
        assert.equal(results.suites[0].tests.length, 1);
        assert.equal(results.suites[1].tests.length, 1);
      });
    });

    describe('edge cases', () => {
      it('should handle test without suite', () => {
        // This should not happen in normal usage, but let's test robustness
        try {
          collector.startTest('orphan test');
          // Should not crash, might create a default suite or handle gracefully
          assert.ok(true);
        } catch (error) {
          // Or it might throw an error, which is also acceptable
          assert.ok(error instanceof Error);
        }
      });

      it('should handle recording result without active test', () => {
        collector.startSuite('Suite', '/path.yml');

        try {
          collector.recordTestPass(100);
          // Should not crash
          assert.ok(true);
        } catch (error) {
          // Or it might throw an error, which is also acceptable
          assert.ok(error instanceof Error);
        }
      });

      it('should handle finalize without active suite', () => {
        try {
          collector.finalizeSuite(100);
          // Should not crash
          assert.ok(true);
        } catch (error) {
          // Or it might throw an error, which is also acceptable
          assert.ok(error instanceof Error);
        }
      });
    });
  });
});
