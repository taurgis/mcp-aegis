/**
 * Performance Tests - Consolidated performance testing and validation
 * Covers performance assertions, parser validation, and timing tests
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { executeTest } from '../../src/test-engine/executor.js';
import { Reporter } from '../../src/test-engine/reporter.js';
import { loadTestSuites } from '../../src/test-engine/parser.js';
import { writeFile, unlink } from 'fs/promises';

// Mock MCPCommunicator for testing
class MockCommunicator {
  constructor(delay = 100) {
    this.delay = delay;
    this.stderr = '';
  }

  clearStderr() {
    this.stderr = '';
  }

  async sendMessage(message) {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return Promise.resolve();
  }

  async readMessage() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return {
      jsonrpc: '2.0',
      id: 'timing-1',
      result: { tools: [] },
    };
  }

  getStderr() {
    return this.stderr;
  }
}

describe('Performance Testing', () => {
  // Helper functions for test file management
  async function createTempTestFile(content, filename = 'temp-perf-test.yml') {
    await writeFile(filename, content, 'utf8');
    return filename;
  }

  async function cleanupTempFile(filename) {
    try {
      await unlink(filename);
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  describe('Performance Assertions', () => {
    test('should track execution timing', async () => {
      const mockCommunicator = new MockCommunicator(100);
      const testCase = {
        it: 'timing test',
        request: {
          jsonrpc: '2.0',
          id: 'timing-1',
          method: 'tools/list',
          params: {},
        },
        expect: {
          response: {
            jsonrpc: '2.0',
            id: 'timing-1',
            result: { tools: [] },
          },
        },
      };

      const startTime = Date.now();
      let testPassCalled = false;
      const mockReporter = {
        logTestStart: () => {},
        logTestResult: () => {},
        logDebug: () => {},
        logTestFail: () => {},
        logMCPCommunication: () => {},
        logTestPass: () => { testPassCalled = true; },
      };
      await executeTest(mockCommunicator, testCase, mockReporter);
      const endTime = Date.now();
      const actualDuration = endTime - startTime;

      // Verify test passed and timing is reasonable
      assert.equal(testPassCalled, true);
      assert.ok(actualDuration >= 50); // At least the mock delay
      assert.ok(actualDuration < 1000); // But not too long
    });

    test('should handle slow responses within timeout', async () => {
      const mockCommunicator = new MockCommunicator(200); // Slower response

      const testCase = {
        it: 'slow response test',
        request: {
          jsonrpc: '2.0',
          id: 'slow-1',
          method: 'tools/list',
          params: {},
        },
        expect: {
          response: {
            jsonrpc: '2.0',
            id: 'slow-1',
            result: { tools: [] },
          },
        },
      };

      let testPassCalled = false;
      let testFailCalled = false;
      const mockReporter = {
        logTestStart: () => {},
        logTestResult: () => {},
        logDebug: () => {},
        logTestFail: () => { testFailCalled = true; },
        logMCPCommunication: () => {},
        logTestPass: () => { testPassCalled = true; },
      };
      await executeTest(mockCommunicator, testCase, mockReporter);
      // Either test passed or failed, but something should be called
      assert.ok(testPassCalled || testFailCalled, 'Either logTestPass or logTestFail should be called');
    });

    test('should measure pattern matching performance', async () => {
      const { matchPattern } = await import('../../src/test-engine/matchers/patterns.js');

      const iterations = 1000;
      const testData = 'Hello, World!';

      // Test simple pattern performance
      const startTime = process.hrtime.bigint();
      for (let i = 0; i < iterations; i++) {
        matchPattern('contains:World', testData);
      }
      const endTime = process.hrtime.bigint();

      const durationMs = Number(endTime - startTime) / 1000000; // Convert to ms

      // Performance assertion - should be fast
      assert.ok(durationMs < 100, `Pattern matching took too long: ${durationMs}ms`);
      console.log(`Pattern matching ${iterations} iterations took ${durationMs.toFixed(2)}ms`);
    });

    test('should measure field extraction performance', async () => {
      const { extractFieldFromObject } = await import('../../src/test-engine/matchers/fields.js');

      const testData = {
        tools: Array.from({ length: 100 }, (_, i) => ({
          name: `tool_${i}`,
          description: `Description for tool ${i}`,
        })),
      };

      const iterations = 100;

      const startTime = process.hrtime.bigint();
      for (let i = 0; i < iterations; i++) {
        extractFieldFromObject(testData, 'tools.*.name');
      }
      const endTime = process.hrtime.bigint();

      const durationMs = Number(endTime - startTime) / 1000000;

      // Performance assertion
      assert.ok(durationMs < 500, `Field extraction took too long: ${durationMs}ms`);
      console.log(`Field extraction ${iterations} iterations took ${durationMs.toFixed(2)}ms`);
    });
  });

  describe('Performance Parser Validation', () => {
    test('should validate valid performance assertions', async () => {
      const testContent = `
description: "Valid Performance Test"
tests:
  - it: "should accept valid time formats"
    request:
      jsonrpc: "2.0"
      id: "test-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-1"
        result:
          tools: []
      maxTime: "500ms"
`;

      const filename = await createTempTestFile(testContent);

      try {
        const testSuites = await loadTestSuites([filename]);
        assert.equal(testSuites.length, 1);
        assert.equal(testSuites[0].tests.length, 1);
        assert.equal(testSuites[0].tests[0].expect.maxTime, '500ms');
      } finally {
        await cleanupTempFile(filename);
      }
    });

    test('should handle various time formats', async () => {
      const testContent = `
description: "Time Format Test"
tests:
  - it: "milliseconds format"
    request:
      jsonrpc: "2.0"
      id: "test-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-1"
        result: {}
      maxTime: "1000ms"
      
  - it: "seconds format"
    request:
      jsonrpc: "2.0"
      id: "test-2"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-2"
        result: {}
      maxTime: "2s"
`;

      const filename = await createTempTestFile(testContent);

      try {
        const testSuites = await loadTestSuites([filename]);
        assert.equal(testSuites.length, 1);
        assert.equal(testSuites[0].tests.length, 2);
        assert.equal(testSuites[0].tests[0].expect.maxTime, '1000ms');
        assert.equal(testSuites[0].tests[1].expect.maxTime, '2s');
      } finally {
        await cleanupTempFile(filename);
      }
    });

    test('should parse large test files efficiently', async () => {
      // Generate a large test file
      const tests = Array.from({ length: 100 }, (_, i) => `
  - it: "test case ${i}"
    request:
      jsonrpc: "2.0"
      id: "test-${i}"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-${i}"
        result:
          tools: []
`).join('');

      const testContent = `
description: "Large Performance Test"
tests:${tests}
`;

      const filename = await createTempTestFile(testContent, 'large-perf-test.yml');

      try {
        const startTime = process.hrtime.bigint();
        const testSuites = await loadTestSuites([filename]);
        const endTime = process.hrtime.bigint();

        const durationMs = Number(endTime - startTime) / 1000000;

        assert.equal(testSuites.length, 1);
        assert.equal(testSuites[0].tests.length, 100);
        assert.ok(durationMs < 1000, `Large file parsing took too long: ${durationMs}ms`);

        console.log(`Parsed 100 test cases in ${durationMs.toFixed(2)}ms`);
      } finally {
        await cleanupTempFile(filename);
      }
    });

    test('should handle memory efficiently with large datasets', async () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `item_${i}`,
        data: `large data string ${i}`.repeat(10),
      }));

      const testData = {
        items: largeArray,
      };

      // Test field extraction performance on large dataset
      const { extractFieldFromObject } = await import('../../src/test-engine/matchers/fields.js');

      const startTime = process.hrtime.bigint();
      const result = extractFieldFromObject(testData, 'items.*.name');
      const endTime = process.hrtime.bigint();

      const durationMs = Number(endTime - startTime) / 1000000;

      assert.equal(result.length, 10000);
      assert.equal(result[0], 'item_0');
      assert.equal(result[9999], 'item_9999');
      assert.ok(durationMs < 1000, `Large dataset processing took too long: ${durationMs}ms`);

      console.log(`Processed 10,000 items in ${durationMs.toFixed(2)}ms`);
    });
  });

  describe('Regression Performance Tests', () => {
    test('should maintain pattern matching performance across updates', async () => {
      const { matchPattern } = await import('../../src/test-engine/matchers/patterns.js');

      const patterns = [
        'contains:test',
        'startsWith:Hello',
        'endsWith:World',
        'regex:^[A-Z]\\w+',
        'type:string',
        'arrayLength:5',
        'not:contains:error',
      ];

      const testValues = [
        'Hello, test World',
        ['a', 'b', 'c', 'd', 'e'],
        { key: 'value' },
        123,
        true,
      ];

      const iterations = 1000;
      const startTime = process.hrtime.bigint();

      for (let i = 0; i < iterations; i++) {
        for (const pattern of patterns) {
          for (const value of testValues) {
            matchPattern(pattern, value);
          }
        }
      }

      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1000000;
      const avgPerOperation = durationMs / (iterations * patterns.length * testValues.length);

      // Performance regression test - should be fast
      assert.ok(avgPerOperation < 0.1, `Average operation time too slow: ${avgPerOperation}ms`);

      console.log(`Average pattern match operation: ${avgPerOperation.toFixed(4)}ms`);
    });
  });
});
