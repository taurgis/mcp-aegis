import { strict as assert } from 'assert';
import { test, describe } from 'node:test';
import { extractFieldFromObject } from '../src/test-engine/matchers/fields.js';

describe('Field Extraction - Bracket Notation Support', () => {
  const testData = {
    tools: [
      { name: 'list_components', description: 'List components' },
      { name: 'list_hooks', description: 'List hooks' },
      { name: 'get_hook_categories', description: 'Get categories' },
      { name: 'get_component_docs', description: 'Get component docs' },
      { name: 'get_hook_docs', description: 'Get hook docs' },
      { name: 'search_docs', description: 'Search documentation' },
    ],
    content: [
      { type: 'text', text: 'Hello world' },
      { type: 'markdown', text: '# Title' },
    ],
  };

  describe('Bracket Notation', () => {
    test('should extract array element by index using bracket notation', () => {
      const result = extractFieldFromObject(testData, 'tools[0].name');
      assert.equal(result, 'list_components');
    });

    test('should extract specific array element by high index', () => {
      const result = extractFieldFromObject(testData, 'tools[5].name');
      assert.equal(result, 'search_docs');
    });

    test('should extract nested properties with bracket notation', () => {
      const result = extractFieldFromObject(testData, 'content[1].type');
      assert.equal(result, 'markdown');
    });

    test('should handle bracket notation with multiple levels', () => {
      const complexData = {
        levels: [
          { items: [{ value: 'first' }, { value: 'second' }] },
          { items: [{ value: 'third' }, { value: 'fourth' }] },
        ],
      };
      
      const result = extractFieldFromObject(complexData, 'levels[1].items[0].value');
      assert.equal(result, 'third');
    });

    test('should handle mixed bracket and dot notation', () => {
      const result = extractFieldFromObject(testData, 'tools[3].name');
      assert.equal(result, 'get_component_docs');
    });

    test('should return undefined for out-of-bounds bracket index', () => {
      const result = extractFieldFromObject(testData, 'tools[99].name');
      assert.equal(result, undefined);
    });
  });

  describe('Dot Notation (existing functionality)', () => {
    test('should still work with traditional dot notation', () => {
      const result = extractFieldFromObject(testData, 'tools.0.name');
      assert.equal(result, 'list_components');
    });

    test('should extract with wildcard using dot notation', () => {
      const result = extractFieldFromObject(testData, 'tools.*.name');
      assert.deepEqual(result, [
        'list_components',
        'list_hooks', 
        'get_hook_categories',
        'get_component_docs',
        'get_hook_docs',
        'search_docs',
      ]);
    });
  });

  describe('Bracket Notation with Wildcards', () => {
    test('should support wildcard in bracket notation', () => {
      const result = extractFieldFromObject(testData, 'tools[*].name');
      assert.deepEqual(result, [
        'list_components',
        'list_hooks',
        'get_hook_categories', 
        'get_component_docs',
        'get_hook_docs',
        'search_docs',
      ]);
    });

    test('should support mixed bracket wildcard and dot notation', () => {
      const result = extractFieldFromObject(testData, 'content[*].type');
      assert.deepEqual(result, ['text', 'markdown']);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty brackets gracefully', () => {
      const result = extractFieldFromObject(testData, 'tools[].name');
      // This should be treated as invalid and return undefined
      assert.equal(result, undefined);
    });

    test('should handle malformed bracket notation', () => {
      const result = extractFieldFromObject(testData, 'tools[abc].name');
      // Non-numeric index should return undefined
      assert.equal(result, undefined);
    });

    test('should handle nested bracket arrays', () => {
      const nestedData = {
        matrix: [
          [{ val: 1 }, { val: 2 }],
          [{ val: 3 }, { val: 4 }],
        ],
      };
      
      const result = extractFieldFromObject(nestedData, 'matrix[1][0].val');
      assert.equal(result, 3);
    });
  });
});
