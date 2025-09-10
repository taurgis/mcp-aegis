import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadTestSuites } from '../../src/test-engine/parser.js';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

describe('testParser', () => {
  const testDir = './test/fixtures/tests';

  // Setup test directory
  test('setup', async () => {
    try {
      await mkdir(testDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  });

  describe('loadTestSuites', () => {
    it('should load valid test suites', async () => {
      const testPath = join(testDir, 'valid.test.mcp.yml');
      const validTest = `
description: "Valid test suite"
tests:
  - it: "should test something"
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
`;

      await writeFile(testPath, validTest);

      const testSuites = await loadTestSuites(join(testDir, 'valid.test.mcp.yml'));

      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].description, 'Valid test suite');
      assert.equal(testSuites[0].tests.length, 1);
      assert.equal(testSuites[0].tests[0].it, 'should test something');
      assert.equal(testSuites[0].tests[0].request.jsonrpc, '2.0');
      assert.equal(testSuites[0].tests[0].request.method, 'tools/list');

      await unlink(testPath);
    });

    it('should load multiple test suites with glob pattern', async () => {
      const test1Path = join(testDir, 'suite1.test.mcp.yml');
      const test2Path = join(testDir, 'suite2.test.mcp.yml');

      const suite1 = `
description: "Suite 1"
tests:
  - it: "test 1"
    request:
      jsonrpc: "2.0"
      id: "1"
      method: "tools/list"
    expect:
      response: {}
`;

      const suite2 = `
description: "Suite 2"
tests:
  - it: "test 2"
    request:
      jsonrpc: "2.0"
      id: "2"
      method: "tools/call"
      params: {}
    expect:
      response: {}
`;

      await writeFile(test1Path, suite1);
      await writeFile(test2Path, suite2);

      const testSuites = await loadTestSuites(join(testDir, 'suite*.test.mcp.yml'));

      // Should find exactly 2 suites (suite1 and suite2)
      assert.equal(testSuites.length, 2);
      assert.ok(testSuites.some(suite => suite.description === 'Suite 1'));
      assert.ok(testSuites.some(suite => suite.description === 'Suite 2'));

      await unlink(test1Path);
      await unlink(test2Path);
    });

    it('should return empty array for no matching files', async () => {
      const testSuites = await loadTestSuites('./nonexistent/**/*.yml');
      assert.equal(testSuites.length, 0);
    });

    it('should throw error for invalid YAML', async () => {
      const testPath = join(testDir, 'invalid.test.mcp.yml');
      await writeFile(testPath, 'invalid: yaml: content: [');

      await assert.rejects(
        loadTestSuites(testPath),
        Error,
      );

      await unlink(testPath);
    });

    it('should throw error for missing description', async () => {
      const testPath = join(testDir, 'no-description.test.mcp.yml');
      const invalidTest = `
tests:
  - it: "test"
    request:
      jsonrpc: "2.0"
      method: "test"
    expect: {}
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /missing or invalid "description" field/,
        },
      );

      await unlink(testPath);
    });

    it('should throw error for non-array tests', async () => {
      const testPath = join(testDir, 'invalid-tests.test.mcp.yml');
      const invalidTest = `
description: "Invalid tests"
tests: "not an array"
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /"tests" must be an array/,
        },
      );

      await unlink(testPath);
    });

    it('should validate individual test structure', async () => {
      const testPath = join(testDir, 'invalid-test-item.test.mcp.yml');
      const invalidTest = `
description: "Invalid test item"
tests:
  - request: {}
    expect: {}
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /missing or invalid "it" field/,
        },
      );

      await unlink(testPath);
    });

    it('should validate JSON-RPC structure', async () => {
      const testPath = join(testDir, 'invalid-jsonrpc.test.mcp.yml');
      const invalidTest = `
description: "Invalid JSON-RPC"
tests:
  - it: "test"
    request:
      jsonrpc: "1.0"
      method: "test"
    expect: {}
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /request must have jsonrpc: "2.0"/,
        },
      );

      await unlink(testPath);
    });

    it('should validate method field', async () => {
      const testPath = join(testDir, 'no-method.test.mcp.yml');
      const invalidTest = `
description: "No method"
tests:
  - it: "test"
    request:
      jsonrpc: "2.0"
      id: "1"
    expect: {}
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /request must have a "method" field/,
        },
      );

      await unlink(testPath);
    });

    it('should add file path metadata', async () => {
      const testPath = join(testDir, 'metadata.test.mcp.yml');
      const validTest = `
description: "Metadata test"
tests:
  - it: "test"
    request:
      jsonrpc: "2.0"
      method: "test"
    expect: {}
`;

      await writeFile(testPath, validTest);

      const testSuites = await loadTestSuites(testPath);

      assert.equal(testSuites.length, 1);
      assert.equal(typeof testSuites[0].filePath, 'string');
      assert.ok(testSuites[0].filePath.includes('metadata.test.mcp.yml'));

      await unlink(testPath);
    });

    it('should handle file read errors with chmod permissions', async () => {
      // Skip this test on Windows as chmod permissions work differently
      if (process.platform === 'win32') {
        return;
      }

      const testPath = join(testDir, 'permission-denied.test.mcp.yml');
      const validTest = `
description: "Permission test"
tests:
  - it: "test"
    request:
      jsonrpc: "2.0"
      method: "test"
    expect: {}
`;

      await writeFile(testPath, validTest);

      // Remove read permissions to trigger permission error
      const { chmod } = await import('fs/promises');
      await chmod(testPath, 0o000);

      try {
        await assert.rejects(
          loadTestSuites(testPath),
          (error) => {
            return error.message.includes('Test file not found') ||
                   error.code === 'ENOENT' ||
                   error.code === 'EACCES';
          },
        );
      } finally {
        // Restore permissions and clean up
        await chmod(testPath, 0o644);
        await unlink(testPath);
      }
    });

    it('should return empty array for non-existent files in glob', async () => {
      // When glob doesn't find files, it returns empty array (not an error)
      const testSuites = await loadTestSuites('./nonexistent/**/*.yml');
      assert.equal(testSuites.length, 0);
    });

    it('should validate test suite structure - non-object', async () => {
      const testPath = join(testDir, 'non-object.test.mcp.yml');
      const invalidTest = '"just a string"';

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /Invalid test suite structure.*must be an object/,
        },
      );

      await unlink(testPath);
    });

    it('should validate test suite structure - null', async () => {
      const testPath = join(testDir, 'null-suite.test.mcp.yml');
      const invalidTest = 'null';

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /Invalid test suite structure.*must be an object/,
        },
      );

      await unlink(testPath);
    });

    it('should validate description field type', async () => {
      const testPath = join(testDir, 'invalid-description-type.test.mcp.yml');
      const invalidTest = `
description: 123
tests: []
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /missing or invalid "description" field/,
        },
      );

      await unlink(testPath);
    });

    it('should validate request field presence', async () => {
      const testPath = join(testDir, 'missing-request.test.mcp.yml');
      const invalidTest = `
description: "Missing request"
tests:
  - it: "test"
    expect: {}
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /missing or invalid "request" field/,
        },
      );

      await unlink(testPath);
    });

    it('should validate request field type', async () => {
      const testPath = join(testDir, 'invalid-request-type.test.mcp.yml');
      const invalidTest = `
description: "Invalid request type"
tests:
  - it: "test"
    request: "not an object"
    expect: {}
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /missing or invalid "request" field/,
        },
      );

      await unlink(testPath);
    });

    it('should validate expect field presence', async () => {
      const testPath = join(testDir, 'missing-expect.test.mcp.yml');
      const invalidTest = `
description: "Missing expect"
tests:
  - it: "test"
    request:
      jsonrpc: "2.0"
      method: "test"
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /missing or invalid "expect" field/,
        },
      );

      await unlink(testPath);
    });

    it('should validate expect field type', async () => {
      const testPath = join(testDir, 'invalid-expect-type.test.mcp.yml');
      const invalidTest = `
description: "Invalid expect type"
tests:
  - it: "test"
    request:
      jsonrpc: "2.0"
      method: "test"
    expect: "not an object"
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /missing or invalid "expect" field/,
        },
      );

      await unlink(testPath);
    });

    it('should validate it field type', async () => {
      const testPath = join(testDir, 'invalid-it-type.test.mcp.yml');
      const invalidTest = `
description: "Invalid it type"
tests:
  - it: 123
    request:
      jsonrpc: "2.0"
      method: "test"
    expect: {}
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /missing or invalid "it" field/,
        },
      );

      await unlink(testPath);
    });
  });

  describe('Performance Assertion Validation', () => {
    it('should validate valid performance assertions with maxResponseTime', async () => {
      const testPath = join(testDir, 'valid-performance.test.mcp.yml');
      const validTest = `
description: "Valid performance test"
tests:
  - it: "should be fast"
    request:
      jsonrpc: "2.0"
      id: "perf-1"
      method: "tools/list"
    expect:
      response: {}
      performance:
        maxResponseTime: "1000ms"
`;

      await writeFile(testPath, validTest);

      const testSuites = await loadTestSuites(testPath);

      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests[0].expect.performance.maxResponseTime, '1000ms');

      await unlink(testPath);
    });

    it('should validate valid performance assertions with minResponseTime', async () => {
      const testPath = join(testDir, 'valid-min-performance.test.mcp.yml');
      const validTest = `
description: "Valid min performance test"
tests:
  - it: "should have minimum time"
    request:
      jsonrpc: "2.0"
      id: "perf-2"
      method: "tools/call"
    expect:
      response: {}
      performance:
        minResponseTime: "100ms"
`;

      await writeFile(testPath, validTest);

      const testSuites = await loadTestSuites(testPath);

      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests[0].expect.performance.minResponseTime, '100ms');

      await unlink(testPath);
    });

    it('should validate valid performance assertions with both times', async () => {
      const testPath = join(testDir, 'valid-both-performance.test.mcp.yml');
      const validTest = `
description: "Valid both performance test"
tests:
  - it: "should have time range"
    request:
      jsonrpc: "2.0"
      id: "perf-3"
      method: "tools/call"
    expect:
      response: {}
      performance:
        minResponseTime: "50ms"
        maxResponseTime: "2s"
`;

      await writeFile(testPath, validTest);

      const testSuites = await loadTestSuites(testPath);

      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests[0].expect.performance.minResponseTime, '50ms');
      assert.equal(testSuites[0].tests[0].expect.performance.maxResponseTime, '2s');

      await unlink(testPath);
    });

    it('should validate numeric time formats', async () => {
      const testPath = join(testDir, 'numeric-performance.test.mcp.yml');
      const validTest = `
description: "Numeric performance test"
tests:
  - it: "should accept numbers"
    request:
      jsonrpc: "2.0"
      id: "perf-4"
      method: "tools/list"
    expect:
      response: {}
      performance:
        maxResponseTime: 1500
`;

      await writeFile(testPath, validTest);

      const testSuites = await loadTestSuites(testPath);

      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests[0].expect.performance.maxResponseTime, 1500);

      await unlink(testPath);
    });

    it('should validate decimal time formats', async () => {
      const testPath = join(testDir, 'decimal-performance.test.mcp.yml');
      const validTest = `
description: "Decimal performance test"
tests:
  - it: "should accept decimals"
    request:
      jsonrpc: "2.0"
      id: "perf-5"
      method: "tools/list"
    expect:
      response: {}
      performance:
        maxResponseTime: "1.5s"
        minResponseTime: "0.5s"
`;

      await writeFile(testPath, validTest);

      const testSuites = await loadTestSuites(testPath);

      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests[0].expect.performance.maxResponseTime, '1.5s');
      assert.equal(testSuites[0].tests[0].expect.performance.minResponseTime, '0.5s');

      await unlink(testPath);
    });

    it('should validate plain number strings', async () => {
      const testPath = join(testDir, 'plain-number-performance.test.mcp.yml');
      const validTest = `
description: "Plain number performance test"
tests:
  - it: "should accept plain number strings"
    request:
      jsonrpc: "2.0"
      id: "perf-6"
      method: "tools/list"
    expect:
      response: {}
      performance:
        maxResponseTime: "1000"
`;

      await writeFile(testPath, validTest);

      const testSuites = await loadTestSuites(testPath);

      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests[0].expect.performance.maxResponseTime, '1000');

      await unlink(testPath);
    });

    it('should reject performance assertions that are not objects', async () => {
      const testPath = join(testDir, 'invalid-performance-type.test.mcp.yml');
      const invalidTest = `
description: "Invalid performance type"
tests:
  - it: "should reject non-object performance"
    request:
      jsonrpc: "2.0"
      id: "perf-7"
      method: "tools/list"
    expect:
      response: {}
      performance: "not an object"
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /performance assertions must be an object/,
        },
      );

      await unlink(testPath);
    });

    it('should handle null performance assertions gracefully', async () => {
      // When performance is explicitly null, the validation should be skipped
      // This tests that null doesn't cause errors (expected behavior)
      const testPath = join(testDir, 'null-performance.test.mcp.yml');
      const validTest = `
description: "Null performance"
tests:
  - it: "should handle null performance gracefully"
    request:
      jsonrpc: "2.0"
      id: "perf-8"
      method: "tools/list"
    expect:
      response: {}
      performance: null
`;

      await writeFile(testPath, validTest);

      // This should NOT throw an error - null performance is handled gracefully
      const testSuites = await loadTestSuites(testPath);

      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests[0].expect.performance, null);

      await unlink(testPath);
    });

    it('should validate undefined performance assertions as missing', async () => {
      // When performance is undefined, it should be skipped without validation
      const testPath = join(testDir, 'undefined-performance.test.mcp.yml');
      const validTest = `
description: "Undefined performance"
tests:
  - it: "should handle undefined performance"
    request:
      jsonrpc: "2.0"
      id: "perf-9"
      method: "tools/list"
    expect:
      response: {}
`;

      await writeFile(testPath, validTest);

      const testSuites = await loadTestSuites(testPath);

      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests[0].expect.performance, undefined);

      await unlink(testPath);
    });

    it('should reject invalid maxResponseTime format', async () => {
      const testPath = join(testDir, 'invalid-max-format.test.mcp.yml');
      const invalidTest = `
description: "Invalid max format"
tests:
  - it: "should reject invalid format"
    request:
      jsonrpc: "2.0"
      id: "perf-9"
      method: "tools/list"
    expect:
      response: {}
      performance:
        maxResponseTime: "invalid-format"
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /maxResponseTime must be a valid time format/,
        },
      );

      await unlink(testPath);
    });

    it('should reject invalid minResponseTime format', async () => {
      const testPath = join(testDir, 'invalid-min-format.test.mcp.yml');
      const invalidTest = `
description: "Invalid min format"
tests:
  - it: "should reject invalid format"
    request:
      jsonrpc: "2.0"
      id: "perf-10"
      method: "tools/list"
    expect:
      response: {}
      performance:
        minResponseTime: "not-a-time"
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /minResponseTime must be a valid time format/,
        },
      );

      await unlink(testPath);
    });

    it('should reject negative numbers', async () => {
      const testPath = join(testDir, 'negative-performance.test.mcp.yml');
      const invalidTest = `
description: "Negative performance"
tests:
  - it: "should reject negative numbers"
    request:
      jsonrpc: "2.0"
      id: "perf-11"
      method: "tools/list"
    expect:
      response: {}
      performance:
        maxResponseTime: -1000
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /maxResponseTime must be a valid time format/,
        },
      );

      await unlink(testPath);
    });

    it('should reject empty performance objects', async () => {
      const testPath = join(testDir, 'empty-performance.test.mcp.yml');
      const invalidTest = `
description: "Empty performance"
tests:
  - it: "should reject empty performance"
    request:
      jsonrpc: "2.0"
      id: "perf-12"
      method: "tools/list"
    expect:
      response: {}
      performance: {}
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /performance assertions must include at least one of: maxResponseTime, minResponseTime/,
        },
      );

      await unlink(testPath);
    });

    it('should reject unsupported performance keys', async () => {
      const testPath = join(testDir, 'unsupported-performance.test.mcp.yml');
      const invalidTest = `
description: "Unsupported performance keys"
tests:
  - it: "should reject unsupported keys"
    request:
      jsonrpc: "2.0"
      id: "perf-13"
      method: "tools/list"
    expect:
      response: {}
      performance:
        maxResponseTime: "1000ms"
        unsupportedKey: "value"
        anotherUnsupported: 123
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /unsupported performance assertion keys: unsupportedKey, anotherUnsupported/,
        },
      );

      await unlink(testPath);
    });

    it('should validate boolean and array time formats as invalid', async () => {
      const testPath = join(testDir, 'boolean-performance.test.mcp.yml');
      const invalidTest = `
description: "Boolean performance"
tests:
  - it: "should reject boolean"
    request:
      jsonrpc: "2.0"
      id: "perf-14"
      method: "tools/list"
    expect:
      response: {}
      performance:
        maxResponseTime: true
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /maxResponseTime must be a valid time format/,
        },
      );

      await unlink(testPath);
    });

    it('should validate object time formats as invalid', async () => {
      const testPath = join(testDir, 'object-performance.test.mcp.yml');
      const invalidTest = `
description: "Object performance"
tests:
  - it: "should reject object"
    request:
      jsonrpc: "2.0"
      id: "perf-15"
      method: "tools/list"
    expect:
      response: {}
      performance:
        maxResponseTime: { value: 1000 }
`;

      await writeFile(testPath, invalidTest);

      await assert.rejects(
        loadTestSuites(testPath),
        {
          message: /maxResponseTime must be a valid time format/,
        },
      );

      await unlink(testPath);
    });
  });
});
