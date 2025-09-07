import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadTestSuites } from '../src/test-engine/parser.js';
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

      const testSuites = await loadTestSuites(join(testDir, '*.test.mcp.yml'));

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
  });
});
