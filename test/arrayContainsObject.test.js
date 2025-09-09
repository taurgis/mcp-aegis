import { strict as assert } from 'assert';
import { test, describe } from 'node:test';
import { matchPattern } from '../src/test-engine/matchers/patterns.js';

describe('Array Contains Object Patterns', () => {
  const toolsArray = [
    { name: 'get_sfcc_class_info', description: 'Get SFCC class information' },
    { name: 'search_docs', description: 'Search documentation' },
    { name: 'list_components', description: 'List available components' },
  ];

  const mixedArray = [
    'simple_string',
    { name: 'tool1', version: '1.0' },
    { name: 'tool2', version: '2.0' },
    42,
    { type: 'component', name: 'button' },
  ];

  describe('Simple value matching (original behavior)', () => {
    test('should match simple string values', () => {
      assert.equal(matchPattern('arrayContains:simple_string', mixedArray), true);
      assert.equal(matchPattern('arrayContains:nonexistent', mixedArray), false);
    });

    test('should match numeric values', () => {
      assert.equal(matchPattern('arrayContains:42', mixedArray), true);
      assert.equal(matchPattern('arrayContains:99', mixedArray), false);
    });

    test('should work with empty arrays', () => {
      assert.equal(matchPattern('arrayContains:anything', []), false);
    });
  });

  describe('Object field matching (new functionality)', () => {
    test('should match objects by name field', () => {
      assert.equal(matchPattern('arrayContains:name:get_sfcc_class_info', toolsArray), true);
      assert.equal(matchPattern('arrayContains:name:search_docs', toolsArray), true);
      assert.equal(matchPattern('arrayContains:name:nonexistent_tool', toolsArray), false);
    });

    test('should match objects by description field', () => {
      assert.equal(matchPattern('arrayContains:description:Get SFCC class information', toolsArray), true);
      assert.equal(matchPattern('arrayContains:description:Search documentation', toolsArray), true);
      assert.equal(matchPattern('arrayContains:description:Invalid description', toolsArray), false);
    });

    test('should match objects by version field', () => {
      assert.equal(matchPattern('arrayContains:version:1.0', mixedArray), true);
      assert.equal(matchPattern('arrayContains:version:2.0', mixedArray), true);
      assert.equal(matchPattern('arrayContains:version:3.0', mixedArray), false);
    });

    test('should match objects by type field', () => {
      assert.equal(matchPattern('arrayContains:type:component', mixedArray), true);
      assert.equal(matchPattern('arrayContains:type:widget', mixedArray), false);
    });

    test('should handle non-existent fields', () => {
      assert.equal(matchPattern('arrayContains:nonexistent:value', toolsArray), false);
    });

    test('should handle mixed arrays correctly', () => {
      // Should find name field in objects, ignore non-objects
      assert.equal(matchPattern('arrayContains:name:tool1', mixedArray), true);
      assert.equal(matchPattern('arrayContains:name:button', mixedArray), true);
      assert.equal(matchPattern('arrayContains:name:simple_string', mixedArray), false);
    });
  });

  describe('Edge cases and error handling', () => {
    test('should return false for non-arrays', () => {
      assert.equal(matchPattern('arrayContains:field:value', 'not an array'), false);
      assert.equal(matchPattern('arrayContains:field:value', { key: 'value' }), false);
      assert.equal(matchPattern('arrayContains:field:value', null), false);
      assert.equal(matchPattern('arrayContains:field:value', undefined), false);
    });

    test('should handle arrays with null/undefined objects', () => {
      const arrayWithNulls = [
        { name: 'tool1' },
        null,
        undefined,
        { name: 'tool2' },
      ];
      assert.equal(matchPattern('arrayContains:name:tool1', arrayWithNulls), true);
      assert.equal(matchPattern('arrayContains:name:tool2', arrayWithNulls), true);
      assert.equal(matchPattern('arrayContains:name:nonexistent', arrayWithNulls), false);
    });

    test('should handle objects with nested field names containing colons', () => {
      const complexArray = [
        { 'field:with:colons': 'value1' },
        { name: 'tool1' },
      ];
      // Should match the first field name part before colon
      assert.equal(matchPattern('arrayContains:field:value2', complexArray), false);
      assert.equal(matchPattern('arrayContains:name:tool1', complexArray), true);
    });

    test('should handle string conversion properly', () => {
      const numericArray = [
        { id: 123, name: 'tool1' },
        { id: '456', name: 'tool2' },
      ];
      // Should match numeric values as strings
      assert.equal(matchPattern('arrayContains:id:123', numericArray), true);
      assert.equal(matchPattern('arrayContains:id:456', numericArray), true);
      assert.equal(matchPattern('arrayContains:id:789', numericArray), false);
    });
  });

  describe('Integration with negation', () => {
    test('should work with not: prefix for field matching', () => {
      assert.equal(matchPattern('not:arrayContains:name:get_sfcc_class_info', toolsArray), false);
      assert.equal(matchPattern('not:arrayContains:name:nonexistent_tool', toolsArray), true);
    });

    test('should work with not: prefix for simple value matching', () => {
      assert.equal(matchPattern('not:arrayContains:simple_string', mixedArray), false);
      assert.equal(matchPattern('not:arrayContains:nonexistent', mixedArray), true);
    });
  });

  describe('Real-world MCP tool scenarios', () => {
    const mcpToolsResponse = {
      tools: [
        {
          name: 'get_sfcc_class_info',
          description: 'Get detailed information about an SFCC class',
          inputSchema: {
            type: 'object',
            properties: {
              className: { type: 'string' },
            },
          },
        },
        {
          name: 'search_sfcc_classes',
          description: 'Search for SFCC classes by name',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string' },
            },
          },
        },
        {
          name: 'get_sfcc_method_info',
          description: 'Get information about SFCC methods',
          inputSchema: {
            type: 'object',
            properties: {
              className: { type: 'string' },
              methodName: { type: 'string' },
            },
          },
        },
      ],
    };

    test('should validate MCP tools list contains expected tools', () => {
      const tools = mcpToolsResponse.tools;

      // Test the exact scenario from the user's request
      assert.equal(matchPattern('arrayContains:name:get_sfcc_class_info', tools), true);
      assert.equal(matchPattern('arrayContains:name:search_sfcc_classes', tools), true);
      assert.equal(matchPattern('arrayContains:name:get_sfcc_method_info', tools), true);
      assert.equal(matchPattern('arrayContains:name:nonexistent_tool', tools), false);
    });

    test('should validate tool descriptions contain expected content', () => {
      const tools = mcpToolsResponse.tools;

      assert.equal(matchPattern('arrayContains:description:Get detailed information about an SFCC class', tools), true);
      assert.equal(matchPattern('arrayContains:description:Search for SFCC classes by name', tools), true);
      assert.equal(matchPattern('arrayContains:description:Invalid description', tools), false);
    });
  });
});
