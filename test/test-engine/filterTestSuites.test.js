/**
 * Unit tests for filterTestSuites function
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { filterTestSuites } from '../../src/test-engine/parser.js';

describe('filterTestSuites', () => {
  const mockTestSuites = [
    {
      description: 'Tools validation suite',
      filePath: '/path/to/tools.test.mcp.yml',
      tests: [
        { it: 'should list tools', request: {}, expect: {} },
        { it: 'should validate tool structure', request: {}, expect: {} },
      ],
    },
    {
      description: 'File operations suite',
      filePath: '/path/to/files.test.mcp.yml',
      tests: [
        { it: 'should read files successfully', request: {}, expect: {} },
        { it: 'should handle missing files', request: {}, expect: {} },
      ],
    },
  ];

  it('should return all suites when no filter is provided', () => {
    const result = filterTestSuites(mockTestSuites, null);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].tests.length, 2);
    assert.strictEqual(result[1].tests.length, 2);
  });

  it('should return all suites when empty filter is provided', () => {
    const result = filterTestSuites(mockTestSuites, '');
    assert.strictEqual(result.length, 2);
  });

  it('should filter by suite description (case insensitive)', () => {
    const result = filterTestSuites(mockTestSuites, 'tools');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].description, 'Tools validation suite');
    assert.strictEqual(result[0].tests.length, 2);
  });

  it('should filter by individual test name', () => {
    const result = filterTestSuites(mockTestSuites, 'should read files');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].description, 'File operations suite');
    assert.strictEqual(result[0].tests.length, 1);
    assert.strictEqual(result[0].tests[0].it, 'should read files successfully');
  });

  it('should support regex patterns', () => {
    const result = filterTestSuites(mockTestSuites, '/should (list|read)/');
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].tests.length, 1); // Only "should read files successfully"
    assert.strictEqual(result[1].tests.length, 1); // Only "should list tools"
  });

  it('should filter tests within suites when individual test matches', () => {
    const result = filterTestSuites(mockTestSuites, 'missing files');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].description, 'File operations suite');
    assert.strictEqual(result[0].tests.length, 1);
    assert.strictEqual(result[0].tests[0].it, 'should handle missing files');
  });

  it('should combine suite and test matches properly', () => {
    const result = filterTestSuites(mockTestSuites, 'validation');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].description, 'Tools validation suite');
    assert.strictEqual(result[0].tests.length, 2); // All tests from matching suite
  });

  it('should handle case insensitive matching', () => {
    const result = filterTestSuites(mockTestSuites, 'TOOLS');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].description, 'Tools validation suite');
  });

  it('should return empty array when no matches found', () => {
    const result = filterTestSuites(mockTestSuites, 'nonexistent');
    assert.strictEqual(result.length, 0);
  });

  it('should escape special regex characters in string patterns', () => {
    const testSuites = [
      {
        description: 'Test with [brackets] and (parens)',
        filePath: '/path/to/test.yml',
        tests: [
          { it: 'should handle special chars', request: {}, expect: {} },
        ],
      },
    ];

    const result = filterTestSuites(testSuites, '[brackets]');
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].description, 'Test with [brackets] and (parens)');
  });

  it('should throw error for invalid regex patterns', () => {
    assert.throws(
      () => filterTestSuites(mockTestSuites, '/[invalid/'),
      /Invalid filter pattern/,
    );
  });

  it('should preserve original test suite structure', () => {
    const result = filterTestSuites(mockTestSuites, 'tools');
    assert.strictEqual(result[0].filePath, '/path/to/tools.test.mcp.yml');
    assert.deepStrictEqual(result[0].tests[0].request, {});
    assert.deepStrictEqual(result[0].tests[0].expect, {});
  });
});
