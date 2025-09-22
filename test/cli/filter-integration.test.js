/**
 * Tests for the filter functionality in the CLI test command
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { filterTestSuites } from '../../src/test-engine/parser.js';

describe('Filter CLI Integration', () => {
  const mockTestSuites = [
    {
      description: 'MCP Tools Validation Suite',
      filePath: '/path/to/tools.test.mcp.yml',
      tests: [
        { it: 'should list all available tools', request: {}, expect: {} },
        { it: 'should validate tool structure and schema', request: {}, expect: {} },
        { it: 'should handle invalid tool names gracefully', request: {}, expect: {} },
      ],
    },
    {
      description: 'File Operations Testing Suite',
      filePath: '/path/to/files.test.mcp.yml',
      tests: [
        { it: 'should read file content successfully', request: {}, expect: {} },
        { it: 'should handle missing files with proper errors', request: {}, expect: {} },
        { it: 'should validate file permissions', request: {}, expect: {} },
      ],
    },
    {
      description: 'Error Handling Suite',
      filePath: '/path/to/errors.test.mcp.yml',
      tests: [
        { it: 'should handle server errors gracefully', request: {}, expect: {} },
        { it: 'should return proper error messages', request: {}, expect: {} },
      ],
    },
  ];

  describe('Suite filtering', () => {
    it('should filter by suite description partial match', () => {
      const result = filterTestSuites(mockTestSuites, 'Tools');
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].description, 'MCP Tools Validation Suite');
      assert.strictEqual(result[0].tests.length, 3);
    });

    it('should filter by suite description case insensitive', () => {
      const result = filterTestSuites(mockTestSuites, 'file operations');
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].description, 'File Operations Testing Suite');
    });

    it('should match multiple suites with common keywords', () => {
      const result = filterTestSuites(mockTestSuites, 'Suite');
      assert.strictEqual(result.length, 3); // All suites contain "Suite"
    });
  });

  describe('Individual test filtering', () => {
    it('should filter by individual test name', () => {
      const result = filterTestSuites(mockTestSuites, 'should read file');
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].description, 'File Operations Testing Suite');
      assert.strictEqual(result[0].tests.length, 1);
      assert.strictEqual(result[0].tests[0].it, 'should read file content successfully');
    });

    it('should filter tests across multiple suites', () => {
      const result = filterTestSuites(mockTestSuites, 'should handle');
      assert.strictEqual(result.length, 3); // All suites have tests with "should handle"

      // Verify each suite only contains matching tests
      const toolsSuite = result.find(s => s.description.includes('Tools'));
      assert.strictEqual(toolsSuite.tests.length, 1);
      assert.strictEqual(toolsSuite.tests[0].it, 'should handle invalid tool names gracefully');

      const filesSuite = result.find(s => s.description.includes('File'));
      assert.strictEqual(filesSuite.tests.length, 1);
      assert.strictEqual(filesSuite.tests[0].it, 'should handle missing files with proper errors');

      const errorsSuite = result.find(s => s.description.includes('Error'));
      assert.strictEqual(errorsSuite.tests.length, 1);
      assert.strictEqual(errorsSuite.tests[0].it, 'should handle server errors gracefully');
    });
  });

  describe('Regex pattern filtering', () => {
    it('should support basic regex patterns', () => {
      const result = filterTestSuites(mockTestSuites, '/should (list|read)/');
      assert.strictEqual(result.length, 2);

      const toolsSuite = result.find(s => s.description.includes('Tools'));
      assert.strictEqual(toolsSuite.tests.length, 1);
      assert.strictEqual(toolsSuite.tests[0].it, 'should list all available tools');

      const filesSuite = result.find(s => s.description.includes('File'));
      assert.strictEqual(filesSuite.tests.length, 1);
      assert.strictEqual(filesSuite.tests[0].it, 'should read file content successfully');
    });

    it('should support case insensitive regex flags', () => {
      const result = filterTestSuites(mockTestSuites, '/TOOLS/i');
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].description, 'MCP Tools Validation Suite');
    });

    it('should handle complex regex patterns', () => {
      const result = filterTestSuites(mockTestSuites, '/^should (handle|validate)/');
      assert.strictEqual(result.length, 3);

      // Should match:
      // - "should handle invalid tool names gracefully"
      // - "should validate tool structure and schema"
      // - "should validate file permissions"
      // - "should handle missing files with proper errors"
      // - "should handle server errors gracefully"

      const totalMatchingTests = result.reduce((sum, suite) => sum + suite.tests.length, 0);
      assert.strictEqual(totalMatchingTests, 5);
    });
  });

  describe('Combined filtering scenarios', () => {
    it('should include entire suite when suite description matches', () => {
      const result = filterTestSuites(mockTestSuites, 'Error Handling Suite');
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].description, 'Error Handling Suite');
      assert.strictEqual(result[0].tests.length, 2); // All tests from matching suite
    });

    it('should filter precisely when pattern matches both suite and individual tests', () => {
      const result = filterTestSuites(mockTestSuites, 'Validation');
      assert.strictEqual(result.length, 1);

      // Should include:
      // 1. Tools suite (matches by description "Validation") - ALL tests because suite matches

      const toolsSuite = result.find(s => s.description.includes('Tools'));
      assert.strictEqual(toolsSuite.tests.length, 3); // All tests because suite description matches
    });

    it('should filter by individual test name when suite does not match', () => {
      const result = filterTestSuites(mockTestSuites, 'validate');
      assert.strictEqual(result.length, 2);

      // Should include:
      // 1. Tools suite - only the individual test that matches "validate"
      // 2. Files suite - only the individual test that matches "validate"

      const toolsSuite = result.find(s => s.description.includes('Tools'));
      assert.strictEqual(toolsSuite.tests.length, 1); // Only matching test
      assert.strictEqual(toolsSuite.tests[0].it, 'should validate tool structure and schema');

      const filesSuite = result.find(s => s.description.includes('File'));
      assert.strictEqual(filesSuite.tests.length, 1); // Only matching test
      assert.strictEqual(filesSuite.tests[0].it, 'should validate file permissions');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty filter gracefully', () => {
      const result = filterTestSuites(mockTestSuites, '');
      assert.strictEqual(result.length, 3); // Returns all suites
    });

    it('should handle filter that matches nothing', () => {
      const result = filterTestSuites(mockTestSuites, 'nonexistent pattern');
      assert.strictEqual(result.length, 0);
    });

    it('should handle special regex characters in string filters', () => {
      const testSuites = [
        {
          description: 'Test [special] chars (in) description',
          filePath: '/test.yml',
          tests: [{ it: 'test with $pecial ch@rs', request: {}, expect: {} }],
        },
      ];

      const result1 = filterTestSuites(testSuites, '[special]');
      assert.strictEqual(result1.length, 1);

      const result2 = filterTestSuites(testSuites, '$pecial');
      assert.strictEqual(result2.length, 1);
    });

    it('should maintain original suite structure in filtered results', () => {
      const result = filterTestSuites(mockTestSuites, 'Tools');
      assert.strictEqual(result[0].filePath, '/path/to/tools.test.mcp.yml');
      assert.deepStrictEqual(result[0].tests[0].request, {});
      assert.deepStrictEqual(result[0].tests[0].expect, {});
    });
  });
});
