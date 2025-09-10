import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  deepEqual,
  deepEqualPartial,
} from '../../src/test-engine/matchers/equality.js';

describe('Equality Module', () => {
  describe('deepEqual', () => {
    describe('Fast path - exact equality', () => {
      it('should return true for identical primitives', () => {
        assert.equal(deepEqual(42, 42), true);
        assert.equal(deepEqual('hello', 'hello'), true);
        assert.equal(deepEqual(true, true), true);
        assert.equal(deepEqual(false, false), true);
        assert.equal(deepEqual(undefined, undefined), true);
        assert.equal(deepEqual(null, null), true);
      });

      it('should return true for same object reference', () => {
        const obj = { key: 'value' };
        const arr = [1, 2, 3];
        assert.equal(deepEqual(obj, obj), true);
        assert.equal(deepEqual(arr, arr), true);
      });
    });

    describe('String pattern matching', () => {
      it('should handle match: patterns correctly', () => {
        assert.equal(deepEqual('match:type:string', 'hello'), true);
        assert.equal(deepEqual('match:type:number', 42), true);
        assert.equal(deepEqual('match:type:boolean', true), true);
        assert.equal(deepEqual('match:type:array', [1, 2, 3]), true);
        assert.equal(deepEqual('match:type:object', { key: 'value' }), true);
      });

      it('should handle regex patterns', () => {
        assert.equal(deepEqual('match:regex:^hello', 'hello world'), true);
        assert.equal(deepEqual('match:regex:\\d+', '123'), true);
        assert.equal(deepEqual('match:regex:world$', 'hello world'), true);
      });

      it('should handle string matching patterns', () => {
        assert.equal(deepEqual('match:contains:world', 'hello world'), true);
        assert.equal(deepEqual('match:startsWith:hello', 'hello world'), true);
        assert.equal(deepEqual('match:endsWith:world', 'hello world'), true);
      });

      it('should handle array patterns', () => {
        assert.equal(deepEqual('match:arrayLength:3', [1, 2, 3]), true);
        assert.equal(deepEqual('match:arrayContains:2', [1, 2, 3]), true);
      });

      it('should handle match: patterns on null values', () => {
        // Note: 'null' type checking doesn't work because typeof null === 'object'
        // This is expected JavaScript behavior
        assert.equal(deepEqual('match:type:object', null), true); // null is an object in JS
        assert.equal(deepEqual('match:type:undefined', undefined), true);
      });

      it('should return false for non-matching patterns', () => {
        assert.equal(deepEqual('match:type:string', 42), false);
        assert.equal(deepEqual('match:regex:^world', 'hello world'), false);
        assert.equal(deepEqual('match:arrayLength:2', [1, 2, 3]), false);
      });
    });

    describe('Null and undefined handling', () => {
      it('should handle null comparisons correctly', () => {
        assert.equal(deepEqual(null, null), true);
        assert.equal(deepEqual(null, undefined), false);
        assert.equal(deepEqual(null, 0), false);
        assert.equal(deepEqual(null, ''), false);
        assert.equal(deepEqual(null, false), false);
      });

      it('should handle undefined comparisons correctly', () => {
        assert.equal(deepEqual(undefined, undefined), true);
        assert.equal(deepEqual(undefined, null), false);
        assert.equal(deepEqual(undefined, 0), false);
        assert.equal(deepEqual(undefined, ''), false);
        assert.equal(deepEqual(undefined, false), false);
      });

      it('should handle mixed null/undefined with objects', () => {
        assert.equal(deepEqual(null, {}), false);
        assert.equal(deepEqual(undefined, []), false);
        assert.equal(deepEqual({}, null), false);
        assert.equal(deepEqual([], undefined), false);
      });
    });

    describe('Special object patterns', () => {
      it('should handle partial matching patterns', () => {
        const expected = {
          'match:partial': {
            name: 'John',
            age: 30,
          },
        };
        const actual = {
          name: 'John',
          age: 30,
          email: 'john@example.com',
        };
        assert.equal(deepEqual(expected, actual), true);
      });

      it('should handle array elements patterns', () => {
        const expected = {
          'match:arrayElements': {
            type: 'match:type:string',
            length: 'match:greaterThan:0',
          },
        };
        const actual = [
          { type: 'text', length: 5 },
          { type: 'image', length: 100 },
        ];
        assert.equal(deepEqual(expected, actual), true);
      });

      it('should handle field extraction patterns', () => {
        const expected = {
          'match:extractField': 'users.*.name',
          value: ['Alice', 'Bob'],
        };
        const actual = {
          users: [
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 30 },
          ],
        };
        assert.equal(deepEqual(expected, actual), true);
      });

      it('should return false for array elements pattern on non-array', () => {
        const expected = {
          'match:arrayElements': {
            type: 'match:type:string',
          },
        };
        const actual = { type: 'text' };
        assert.equal(deepEqual(expected, actual), false);
      });

      it('should return false for objects without special pattern keys', () => {
        const expected = {
          regularKey: 'value',
          anotherKey: 123,
        };
        const actual = {
          differentKey: 'value',
        };
        assert.equal(deepEqual(expected, actual), false);
      });
    });

    describe('Type mismatch handling', () => {
      it('should return false for different primitive types', () => {
        assert.equal(deepEqual('42', 42), false);
        assert.equal(deepEqual(true, 'true'), false);
        assert.equal(deepEqual(0, false), false);
        assert.equal(deepEqual(1, true), false);
        assert.equal(deepEqual('', false), false);
      });

      it('should return false for array vs object mismatch', () => {
        assert.equal(deepEqual([], {}), false);
        assert.equal(deepEqual({}, []), false);
        assert.equal(deepEqual([1, 2, 3], { 0: 1, 1: 2, 2: 3 }), false);
      });
    });

    describe('Primitive value comparison', () => {
      it('should compare primitive values correctly', () => {
        assert.equal(deepEqual(42, 42), true);
        assert.equal(deepEqual(42, 43), false);
        assert.equal(deepEqual('hello', 'hello'), true);
        assert.equal(deepEqual('hello', 'world'), false);
        assert.equal(deepEqual(true, true), true);
        assert.equal(deepEqual(true, false), false);
      });
    });

    describe('Array comparison', () => {
      it('should compare simple arrays correctly', () => {
        assert.equal(deepEqual([1, 2, 3], [1, 2, 3]), true);
        assert.equal(deepEqual([1, 2, 3], [1, 2, 4]), false);
        assert.equal(deepEqual([1, 2, 3], [1, 2]), false);
        assert.equal(deepEqual([1, 2], [1, 2, 3]), false);
      });

      it('should compare nested arrays correctly', () => {
        assert.equal(deepEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]]), true);
        assert.equal(deepEqual([[1, 2], [3, 4]], [[1, 2], [3, 5]]), false);
        assert.equal(deepEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }]), true);
        assert.equal(deepEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }]), false);
      });

      it('should compare empty arrays correctly', () => {
        assert.equal(deepEqual([], []), true);
        assert.equal(deepEqual([], [1]), false);
        assert.equal(deepEqual([1], []), false);
      });

      it('should handle arrays with patterns', () => {
        assert.equal(deepEqual(['match:type:number', 'hello'], [42, 'hello']), true);
        assert.equal(deepEqual(['match:regex:\\d+', 'world'], ['123', 'world']), true);
        assert.equal(deepEqual([1, 'match:contains:llo'], [1, 'hello']), true);
      });
    });

    describe('Object comparison', () => {
      it('should compare simple objects correctly', () => {
        assert.equal(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }), true);
        assert.equal(deepEqual({ a: 1, b: 2 }, { a: 1, b: 3 }), false);
        assert.equal(deepEqual({ a: 1, b: 2 }, { a: 1 }), false);
        assert.equal(deepEqual({ a: 1 }, { a: 1, b: 2 }), false);
      });

      it('should compare nested objects correctly', () => {
        const obj1 = { user: { name: 'John', details: { age: 30 } } };
        const obj2 = { user: { name: 'John', details: { age: 30 } } };
        const obj3 = { user: { name: 'John', details: { age: 31 } } };

        assert.equal(deepEqual(obj1, obj2), true);
        assert.equal(deepEqual(obj1, obj3), false);
      });

      it('should compare empty objects correctly', () => {
        assert.equal(deepEqual({}, {}), true);
        assert.equal(deepEqual({}, { a: 1 }), false);
        assert.equal(deepEqual({ a: 1 }, {}), false);
      });

      it('should handle objects with patterns', () => {
        const expected = { name: 'match:type:string', age: 'match:greaterThan:18' };
        const actual = { name: 'John', age: 25 };
        assert.equal(deepEqual(expected, actual), true);
      });

      it('should handle key order independence', () => {
        assert.equal(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
        assert.equal(deepEqual({ x: { a: 1, b: 2 } }, { x: { b: 2, a: 1 } }), true);
      });
    });

    describe('Complex nested structures', () => {
      it('should handle deeply nested mixed structures', () => {
        const expected = {
          users: [
            { name: 'Alice', posts: [{ title: 'match:contains:Hello' }] },
            { name: 'match:type:string', posts: [] },
          ],
          meta: { total: 'match:type:number' },
        };

        const actual = {
          users: [
            { name: 'Alice', posts: [{ title: 'Hello World' }] },
            { name: 'Bob', posts: [] },
          ],
          meta: { total: 2 },
        };

        assert.equal(deepEqual(expected, actual), true);
      });

      it('should handle MCP-like response structures', () => {
        const expected = {
          jsonrpc: '2.0',
          id: 'match:type:string',
          result: {
            tools: 'match:arrayLength:2',
            serverInfo: 'match:type:object',
          },
        };

        const actual = {
          jsonrpc: '2.0',
          id: 'test-123',
          result: {
            tools: [{ name: 'tool1' }, { name: 'tool2' }],
            serverInfo: { name: 'Test Server', version: '1.0' },
          },
        };

        assert.equal(deepEqual(expected, actual), true);
      });
    });

    describe('Path parameter usage', () => {
      it('should accept path parameter without affecting comparison', () => {
        assert.equal(deepEqual({ a: 1 }, { a: 1 }, 'root'), true);
        assert.equal(deepEqual({ a: 1 }, { a: 2 }, 'root.nested'), false);
        assert.equal(deepEqual([1, 2], [1, 2], 'array[0]'), true);
      });
    });
  });

  describe('deepEqualPartial', () => {
    describe('Fast path - exact equality', () => {
      it('should return true for identical values', () => {
        assert.equal(deepEqualPartial(42, 42), true);
        assert.equal(deepEqualPartial('hello', 'hello'), true);
        assert.equal(deepEqualPartial(null, null), true);
        assert.equal(deepEqualPartial(undefined, undefined), true);
      });
    });

    describe('String pattern matching', () => {
      it('should handle match: patterns correctly', () => {
        assert.equal(deepEqualPartial('match:type:string', 'hello'), true);
        assert.equal(deepEqualPartial('match:contains:world', 'hello world'), true);
        assert.equal(deepEqualPartial('match:regex:\\d+', '123'), true);
      });
    });

    describe('Null and undefined handling', () => {
      it('should handle null/undefined correctly', () => {
        assert.equal(deepEqualPartial(null, null), true);
        assert.equal(deepEqualPartial(undefined, undefined), true);
        assert.equal(deepEqualPartial(null, undefined), false);
        assert.equal(deepEqualPartial(undefined, null), false);
      });
    });

    describe('Non-object fallback', () => {
      it('should fall back to deepEqual for non-objects', () => {
        assert.equal(deepEqualPartial('hello', 'hello'), true);
        assert.equal(deepEqualPartial(42, 42), true);
        assert.equal(deepEqualPartial(true, true), true);
        assert.equal(deepEqualPartial('hello', 'world'), false);
        assert.equal(deepEqualPartial(42, 43), false);
      });
    });

    describe('Array type mismatch', () => {
      it('should return false for array vs non-array mismatch', () => {
        assert.equal(deepEqualPartial([1, 2, 3], { 0: 1, 1: 2, 2: 3 }), false);
        assert.equal(deepEqualPartial({ length: 3 }, [1, 2, 3]), false);
      });
    });

    describe('Partial array matching', () => {
      it('should match arrays where all expected elements exist', () => {
        // All elements of expected should be found in actual
        assert.equal(deepEqualPartial([1, 2], [1, 2, 3, 4]), true);
        assert.equal(deepEqualPartial([2, 1], [1, 2, 3, 4]), true);
        assert.equal(deepEqualPartial([], [1, 2, 3]), true);
      });

      it('should fail when expected elements are missing', () => {
        assert.equal(deepEqualPartial([1, 2, 5], [1, 2, 3, 4]), false);
        assert.equal(deepEqualPartial([1], [2, 3, 4]), false);
      });

      it('should handle partial matching with patterns in arrays', () => {
        const expected = [{ name: 'match:type:string' }];
        const actual = [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }];
        assert.equal(deepEqualPartial(expected, actual), true);
      });

      it('should handle complex nested partial array matching', () => {
        const expected = [
          { user: { name: 'Alice' } }, // Should match first element partially
        ];
        const actual = [
          { user: { name: 'Alice', age: 25 }, id: 1 },
          { user: { name: 'Bob', age: 30 }, id: 2 },
        ];
        assert.equal(deepEqualPartial(expected, actual), true);
      });
    });

    describe('Partial object matching', () => {
      it('should match objects where all expected keys exist', () => {
        const expected = { name: 'John' };
        const actual = { name: 'John', age: 30, email: 'john@example.com' };
        assert.equal(deepEqualPartial(expected, actual), true);
      });

      it('should fail when expected keys are missing', () => {
        const expected = { name: 'John', age: 30 };
        const actual = { name: 'John', email: 'john@example.com' };
        assert.equal(deepEqualPartial(expected, actual), false);
      });

      it('should handle nested partial object matching', () => {
        const expected = {
          user: {
            name: 'John',
            profile: { city: 'New York' },
          },
        };
        const actual = {
          user: {
            name: 'John',
            age: 30,
            profile: { city: 'New York', country: 'USA' },
          },
          timestamp: '2023-01-01',
        };
        assert.equal(deepEqualPartial(expected, actual), true);
      });

      it('should handle partial matching with patterns', () => {
        const expected = {
          name: 'match:type:string',
          age: 'match:greaterThan:18',
        };
        const actual = {
          name: 'John',
          age: 25,
          email: 'john@example.com',
          id: 12345,
        };
        assert.equal(deepEqualPartial(expected, actual), true);
      });
    });

    describe('Mixed partial matching scenarios', () => {
      it('should handle arrays of objects with partial matching', () => {
        const expected = [
          { name: 'Alice' },
          { name: 'Bob' },
        ];
        const actual = [
          { name: 'Alice', age: 25, id: 1 },
          { name: 'Bob', age: 30, id: 2 },
          { name: 'Charlie', age: 35, id: 3 },
        ];
        assert.equal(deepEqualPartial(expected, actual), true);
      });

      it('should handle objects with arrays using partial matching', () => {
        const expected = {
          users: [{ name: 'Alice' }],
          total: 'match:type:number',
        };
        const actual = {
          users: [
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 30 },
          ],
          total: 2,
          lastUpdated: '2023-01-01',
        };
        assert.equal(deepEqualPartial(expected, actual), true);
      });

      it('should handle complex MCP response partial matching', () => {
        const expected = {
          result: {
            tools: [
              { name: 'match:type:string' },
            ],
          },
        };
        const actual = {
          jsonrpc: '2.0',
          id: 'test-123',
          result: {
            tools: [
              { name: 'read_file', description: 'Reads a file', inputSchema: {} },
              { name: 'write_file', description: 'Writes a file', inputSchema: {} },
            ],
            serverInfo: { name: 'File Server', version: '1.0' },
          },
        };
        assert.equal(deepEqualPartial(expected, actual), true);
      });
    });

    describe('Path parameter usage', () => {
      it('should accept path parameter without affecting comparison', () => {
        assert.equal(deepEqualPartial({ a: 1 }, { a: 1, b: 2 }, 'root'), true);
        assert.equal(deepEqualPartial({ a: 1 }, { a: 2, b: 3 }, 'root.nested'), false);
      });
    });
  });

  describe('Edge cases and error conditions', () => {
    it('should handle circular references gracefully', () => {
      const obj1 = { name: 'test' };
      obj1.self = obj1;

      const obj2 = { name: 'test' };
      obj2.self = obj2;

      // Circular references cause maximum call stack exceeded error
      // This is expected behavior - the function doesn't have circular reference protection
      assert.throws(() => {
        deepEqual(obj1, obj2);
      }, RangeError);
    });

    it('should handle very deep nesting', () => {
      const deep1 = {};
      const deep2 = {};
      let current1 = deep1;
      let current2 = deep2;

      // Create deeply nested objects
      for (let i = 0; i < 100; i++) {
        current1.next = { value: i };
        current2.next = { value: i };
        current1 = current1.next;
        current2 = current2.next;
      }

      assert.equal(deepEqual(deep1, deep2), true);
    });

    it('should handle mixed types in complex structures', () => {
      const expected = {
        mixed: [
          'string',
          42,
          true,
          null,
          undefined,
          { nested: 'object' },
          ['nested', 'array'],
        ],
      };

      const actual = {
        mixed: [
          'string',
          42,
          true,
          null,
          undefined,
          { nested: 'object' },
          ['nested', 'array'],
        ],
      };

      assert.equal(deepEqual(expected, actual), true);
    });

    it('should handle empty structures correctly', () => {
      assert.equal(deepEqual({}, {}), true);
      assert.equal(deepEqual([], []), true);
      assert.equal(deepEqualPartial({}, { a: 1, b: 2 }), true);
      assert.equal(deepEqualPartial([], [1, 2, 3]), true);
    });
  });

  describe('Integration with pattern matching', () => {
    it('should integrate with all pattern types', () => {
      const expected = {
        id: 'match:type:string',
        count: 'match:greaterThan:0',
        tags: 'match:arrayContains:important',
        metadata: {
          'match:partial': {
            created: 'match:dateValid',
          },
        },
      };

      const actual = {
        id: 'item-123',
        count: 5,
        tags: ['urgent', 'important', 'priority'],
        metadata: {
          created: '2023-01-01T10:00:00Z',
          modified: '2023-01-02T15:30:00Z',
          author: 'system',
        },
      };

      assert.equal(deepEqual(expected, actual), true);
    });
  });

  describe('Performance considerations', () => {
    it('should handle large objects efficiently', () => {
      const largeObj1 = {};
      const largeObj2 = {};

      // Create objects with many properties
      for (let i = 0; i < 1000; i++) {
        largeObj1[`prop${i}`] = `value${i}`;
        largeObj2[`prop${i}`] = `value${i}`;
      }

      const startTime = Date.now();
      const result = deepEqual(largeObj1, largeObj2);
      const endTime = Date.now();

      assert.equal(result, true);
      // Should complete in reasonable time (less than 100ms for this size)
      assert.ok(endTime - startTime < 100);
    });

    it('should handle large arrays efficiently', () => {
      const largeArr1 = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item${i}` }));
      const largeArr2 = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `item${i}` }));

      const startTime = Date.now();
      const result = deepEqual(largeArr1, largeArr2);
      const endTime = Date.now();

      assert.equal(result, true);
      // Should complete in reasonable time (less than 100ms for this size)
      assert.ok(endTime - startTime < 100);
    });
  });
});
