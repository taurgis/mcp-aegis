import { test } from 'node:test';
import assert from 'node:assert';
import { loadTestSuites } from '../src/test-engine/parser.js';
import { writeFile, unlink } from 'fs/promises';

test('Performance Assertion Parser Validation', async (t) => {
  // Helper function to create a temporary test file
  async function createTempTestFile(content, filename = 'temp-perf-test.yml') {
    await writeFile(filename, content, 'utf8');
    return filename;
  }

  // Helper function to cleanup temp file
  async function cleanupTempFile(filename) {
    try {
      await unlink(filename);
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  await t.test('should validate valid performance assertions', async () => {
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
        result: {}
      performance:
        maxResponseTime: "2000ms"
        minResponseTime: "100ms"
      stderr: "toBeEmpty"
`;

    const filename = await createTempTestFile(testContent);

    try {
      const testSuites = await loadTestSuites(filename);
      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests.length, 1);
    } finally {
      await cleanupTempFile(filename);
    }
  });

  await t.test('should validate numeric time formats', async () => {
    const testContent = `
description: "Valid Numeric Performance Test"
tests:
  - it: "should accept numeric formats"
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
      performance:
        maxResponseTime: 2000
      stderr: "toBeEmpty"
`;

    const filename = await createTempTestFile(testContent);

    try {
      const testSuites = await loadTestSuites(filename);
      assert.equal(testSuites.length, 1);
    } finally {
      await cleanupTempFile(filename);
    }
  });

  await t.test('should validate seconds format', async () => {
    const testContent = `
description: "Valid Seconds Performance Test"
tests:
  - it: "should accept seconds format"
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
      performance:
        maxResponseTime: "2.5s"
      stderr: "toBeEmpty"
`;

    const filename = await createTempTestFile(testContent);

    try {
      const testSuites = await loadTestSuites(filename);
      assert.equal(testSuites.length, 1);
    } finally {
      await cleanupTempFile(filename);
    }
  });

  await t.test('should reject invalid time formats', async () => {
    const testContent = `
description: "Invalid Performance Test"
tests:
  - it: "should reject invalid format"
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
      performance:
        maxResponseTime: "invalid-time"
      stderr: "toBeEmpty"
`;

    const filename = await createTempTestFile(testContent);

    try {
      await assert.rejects(
        async () => await loadTestSuites(filename),
        /maxResponseTime must be a valid time format/,
      );
    } finally {
      await cleanupTempFile(filename);
    }
  });

  await t.test('should reject negative numbers', async () => {
    const testContent = `
description: "Negative Performance Test"
tests:
  - it: "should reject negative numbers"
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
      performance:
        maxResponseTime: -100
      stderr: "toBeEmpty"
`;

    const filename = await createTempTestFile(testContent);

    try {
      await assert.rejects(
        async () => await loadTestSuites(filename),
        /maxResponseTime must be a valid time format/,
      );
    } finally {
      await cleanupTempFile(filename);
    }
  });

  await t.test('should require at least one performance assertion', async () => {
    const testContent = `
description: "Empty Performance Test"
tests:
  - it: "should require at least one assertion"
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
      performance: {}
      stderr: "toBeEmpty"
`;

    const filename = await createTempTestFile(testContent);

    try {
      await assert.rejects(
        async () => await loadTestSuites(filename),
        /performance assertions must include at least one of/,
      );
    } finally {
      await cleanupTempFile(filename);
    }
  });

  await t.test('should reject unsupported performance keys', async () => {
    const testContent = `
description: "Unsupported Performance Test"
tests:
  - it: "should reject unsupported keys"
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
      performance:
        maxResponseTime: "1000ms"
        unsupportedKey: "value"
      stderr: "toBeEmpty"
`;

    const filename = await createTempTestFile(testContent);

    try {
      await assert.rejects(
        async () => await loadTestSuites(filename),
        /unsupported performance assertion keys: unsupportedKey/,
      );
    } finally {
      await cleanupTempFile(filename);
    }
  });

  await t.test('should work without performance assertions (backward compatibility)', async () => {
    const testContent = `
description: "Backward Compatible Test"
tests:
  - it: "should work without performance"
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
      stderr: "toBeEmpty"
`;

    const filename = await createTempTestFile(testContent);

    try {
      const testSuites = await loadTestSuites(filename);
      assert.equal(testSuites.length, 1);
      assert.equal(testSuites[0].tests.length, 1);
      // Performance should be undefined for backward compatibility
      assert.equal(testSuites[0].tests[0].expect.performance, undefined);
    } finally {
      await cleanupTempFile(filename);
    }
  });
});
