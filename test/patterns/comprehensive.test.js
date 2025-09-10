/**
 * Comprehensive Pattern Matching Tests
 * Consolidated tests for all pattern matching functionality including:
 * - Basic patterns (string, numeric, array)
 * - Negation patterns
 * - Case sensitivity patterns
 * - Field extraction patterns
 */

import { strict as assert } from 'assert';
import { test, describe } from 'node:test';
import { matchPattern } from '../../src/test-engine/matchers/patterns.js';
import { extractFieldFromObject } from '../../src/test-engine/matchers/fields.js';

describe('Comprehensive Pattern Matching', () => {

  describe('String Patterns', () => {
    test('startsWith patterns', () => {
      assert.equal(matchPattern('startsWith:Hello', 'Hello, World!'), true);
      assert.equal(matchPattern('startsWith:Hello', 'Hi, World!'), false);
      assert.equal(matchPattern('startsWith:Error:', 'Error: File not found'), true);

      // Case sensitivity
      assert.equal(matchPattern('startsWith:hello', 'Hello, World!'), false);
      assert.equal(matchPattern('startsWith:HELLO', 'Hello, World!'), false);
    });

    test('endsWith patterns', () => {
      assert.equal(matchPattern('endsWith:!', 'Hello, World!'), true);
      assert.equal(matchPattern('endsWith:!', 'Hello, World.'), false);
      assert.equal(matchPattern('endsWith:occurred', 'System error occurred'), true);
    });

    test('contains patterns', () => {
      assert.equal(matchPattern('contains:World', 'Hello, World!'), true);
      assert.equal(matchPattern('contains:world', 'Hello, World!'), false); // Case sensitive
      assert.equal(matchPattern('contains:xyz', 'Hello, World!'), false);
    });

    test('regex patterns', () => {
      assert.equal(matchPattern('regex:^[A-Z]', 'Hello'), true);
      assert.equal(matchPattern('regex:^[a-z]', 'Hello'), false);
      assert.equal(matchPattern('regex:\\d+', 'Found 42 items'), true);
      assert.equal(matchPattern('regex:\\d+', 'Found zero items'), false);
    });
  });

  describe('Negation Patterns', () => {
    test('not:contains patterns', () => {
      const text = 'Hello, World!';

      assert.equal(matchPattern('contains:Hello', text), true);
      assert.equal(matchPattern('not:contains:Hello', text), false);
      assert.equal(matchPattern('not:contains:Goodbye', text), true);
    });

    test('not:startsWith patterns', () => {
      const text = 'Hello, World!';

      assert.equal(matchPattern('startsWith:Hello', text), true);
      assert.equal(matchPattern('not:startsWith:Hello', text), false);
      assert.equal(matchPattern('not:startsWith:World', text), true);
    });

    test('not:endsWith patterns', () => {
      const text = 'Hello, World!';

      assert.equal(matchPattern('endsWith:!', text), true);
      assert.equal(matchPattern('not:endsWith:!', text), false);
      assert.equal(matchPattern('not:endsWith:?', text), true);
    });

    test('not:arrayContains patterns', () => {
      const array = ['apple', 'banana', 'cherry'];

      assert.equal(matchPattern('arrayContains:apple', array), true);
      assert.equal(matchPattern('not:arrayContains:apple', array), false);
      assert.equal(matchPattern('not:arrayContains:grape', array), true);
    });

    test('not:type patterns', () => {
      assert.equal(matchPattern('type:string', 'hello'), true);
      assert.equal(matchPattern('not:type:string', 'hello'), false);
      assert.equal(matchPattern('not:type:string', 123), true);

      assert.equal(matchPattern('type:number', 42), true);
      assert.equal(matchPattern('not:type:number', 42), false);
      assert.equal(matchPattern('not:type:number', 'hello'), true);
    });
  });

  describe('Array Patterns', () => {
    test('arrayLength patterns', () => {
      const shortArray = [1, 2, 3];
      const longArray = [1, 2, 3, 4, 5];

      assert.equal(matchPattern('arrayLength:3', shortArray), true);
      assert.equal(matchPattern('arrayLength:5', longArray), true);
      assert.equal(matchPattern('arrayLength:2', shortArray), false);
    });

    test('arrayContains patterns', () => {
      const array = ['apple', 'banana', 'cherry'];
      const numArray = [1, 2, 3, 42];

      assert.equal(matchPattern('arrayContains:banana', array), true);
      assert.equal(matchPattern('arrayContains:grape', array), false);
      assert.equal(matchPattern('arrayContains:42', numArray), true);
    });

    test('arrayContains object field patterns', () => {
      const tools = [
        { name: 'read_file', type: 'tool' },
        { name: 'write_file', type: 'tool' },
        { name: 'list_files', type: 'utility' },
      ];

      assert.equal(matchPattern('arrayContains:name:read_file', tools), true);
      assert.equal(matchPattern('arrayContains:name:delete_file', tools), false);
      assert.equal(matchPattern('arrayContains:type:utility', tools), true);
    });
  });

  describe('Type Patterns', () => {
    test('basic type validation', () => {
      assert.equal(matchPattern('type:string', 'hello'), true);
      assert.equal(matchPattern('type:string', 123), false);

      assert.equal(matchPattern('type:number', 42), true);
      assert.equal(matchPattern('type:number', '42'), false);

      assert.equal(matchPattern('type:boolean', true), true);
      assert.equal(matchPattern('type:boolean', 'true'), false);

      assert.equal(matchPattern('type:array', [1, 2, 3]), true);
      assert.equal(matchPattern('type:array', 'not array'), false);

      assert.equal(matchPattern('type:object', { key: 'value' }), true);
      assert.equal(matchPattern('type:object', [1, 2, 3]), true); // Arrays are objects in JavaScript
    });
  });

  describe('Numeric Patterns', () => {
    test('numeric comparisons', () => {
      assert.equal(matchPattern('greaterThan:10', 15), true);
      assert.equal(matchPattern('greaterThan:10', 5), false);
      assert.equal(matchPattern('greaterThan:10', 10), false); // Not greater than, equal

      assert.equal(matchPattern('lessThan:10', 5), true);
      assert.equal(matchPattern('lessThan:10', 15), false);
      assert.equal(matchPattern('lessThan:10', 10), false); // Not less than, equal

      // Test range pattern instead of equals since equals pattern doesn't exist
      assert.equal(matchPattern('between:42:42', 42), true);
      assert.equal(matchPattern('between:42:42', 43), false);
    });
  });

  describe('Case Insensitive Patterns', () => {
    test('case insensitive string matching', () => {
      // Note: We would need to implement case insensitive variants
      // For now, document expected behavior
      const text = 'Hello, World!';

      // These would be case insensitive versions (if implemented)
      // assert.equal(matchPattern('icontains:hello', text), true);
      // assert.equal(matchPattern('istartsWith:hello', text), true);
      // assert.equal(matchPattern('iendsWith:world!', text), true);
    });
  });

  describe('Field Extraction', () => {
    const testData = {
      tools: [
        { name: 'list_components', description: 'List components' },
        { name: 'get_hook_docs', description: 'Get hook docs' },
        { name: 'search_docs', description: 'Search documentation' },
      ],
      content: [
        { type: 'text', text: 'Hello world' },
        { type: 'markdown', text: '# Title' },
      ],
      metadata: {
        version: '1.0.0',
        author: { name: 'John Doe', email: 'john@example.com' },
      },
    };

    test('basic field extraction', () => {
      assert.equal(extractFieldFromObject(testData, 'metadata.version'), '1.0.0');
      assert.equal(extractFieldFromObject(testData, 'metadata.author.name'), 'John Doe');
      assert.equal(extractFieldFromObject(testData, 'metadata.author.email'), 'john@example.com');
    });

    test('wildcard array extraction', () => {
      const result = extractFieldFromObject(testData, 'tools.*.name');
      assert.deepEqual(result, ['list_components', 'get_hook_docs', 'search_docs']);
    });

    test('bracket notation extraction', () => {
      assert.equal(extractFieldFromObject(testData, 'tools[0].name'), 'list_components');
      assert.equal(extractFieldFromObject(testData, 'tools[2].name'), 'search_docs');
      assert.equal(extractFieldFromObject(testData, 'content[1].type'), 'markdown');
    });

    test('mixed bracket and dot notation', () => {
      assert.equal(extractFieldFromObject(testData, 'tools[1].description'), 'Get hook docs');
      assert.equal(extractFieldFromObject(testData, 'content[0].text'), 'Hello world');
    });

    test('non-existent field extraction', () => {
      assert.equal(extractFieldFromObject(testData, 'nonexistent.field'), undefined);
      assert.equal(extractFieldFromObject(testData, 'tools[10].name'), undefined);
    });
  });

  describe('Complex Pattern Combinations', () => {
    test('multiple pattern validation', () => {
      const data = {
        tools: [
          { name: 'read_file', description: 'Reads a file from disk', active: true },
          { name: 'write_file', description: 'Writes data to a file', active: false },
          { name: 'list_files', description: 'Lists files in directory', active: true },
        ],
      };

      // Extract tool names
      const toolNames = extractFieldFromObject(data, 'tools.*.name');
      assert.equal(matchPattern('arrayLength:3', toolNames), true);
      assert.equal(matchPattern('arrayContains:read_file', toolNames), true);
      assert.equal(matchPattern('not:arrayContains:delete_file', toolNames), true);

      // Extract active status
      const activeFlags = extractFieldFromObject(data, 'tools.*.active');
      assert.equal(matchPattern('arrayContains:true', activeFlags), true);
      assert.equal(matchPattern('arrayContains:false', activeFlags), true);
    });
  });

  describe('Edge Cases', () => {
    test('null and undefined handling', () => {
      assert.equal(matchPattern('type:undefined', undefined), true);
      assert.equal(matchPattern('type:object', null), true); // typeof null === 'object' in JavaScript
      assert.equal(matchPattern('exists', 'any value'), true);
      assert.equal(matchPattern('exists', null), false);
      assert.equal(matchPattern('exists', undefined), false);
    });

    test('empty array and object handling', () => {
      assert.equal(matchPattern('arrayLength:0', []), true);
      assert.equal(matchPattern('type:array', []), true);
      assert.equal(matchPattern('type:object', {}), true);
    });

    test('numeric string handling', () => {
      // String numbers should not match numeric patterns
      assert.equal(matchPattern('type:number', '123'), false);
      assert.equal(matchPattern('type:string', '123'), true);
    });
  });
});
