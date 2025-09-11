import { strict as assert } from 'assert';
import { test, describe } from 'node:test';
import {
  handleLengthPattern,
  handleTypePattern,
  handleExistsPattern,
  handleCountPattern,
} from '../../src/test-engine/matchers/typePatterns.js';

describe('Type Patterns Module', () => {
  describe('handleLengthPattern', () => {
    test('should match string lengths', () => {
      assert.equal(handleLengthPattern('length:0', ''), true);
      assert.equal(handleLengthPattern('length:5', 'hello'), true);
      assert.equal(handleLengthPattern('length:13', 'Hello, World!'), true);
      assert.equal(handleLengthPattern('length:5', 'hi'), false);
      assert.equal(handleLengthPattern('length:0', 'not empty'), false);
    });

    test('should match array lengths', () => {
      assert.equal(handleLengthPattern('length:0', []), true);
      assert.equal(handleLengthPattern('length:3', [1, 2, 3]), true);
      assert.equal(handleLengthPattern('length:1', ['single']), true);
      assert.equal(handleLengthPattern('length:5', [1, 2, 3]), false);
      assert.equal(handleLengthPattern('length:0', [1]), false);
    });

    test('should handle nested arrays', () => {
      const nestedArray = [[1, 2], [3, 4, 5], []];
      assert.equal(handleLengthPattern('length:3', nestedArray), true);
      assert.equal(handleLengthPattern('length:2', nestedArray), false);
    });

    test('should return false for non-string/non-array values', () => {
      assert.equal(handleLengthPattern('length:1', 123), false);
      assert.equal(handleLengthPattern('length:1', true), false);
      assert.equal(handleLengthPattern('length:1', null), false);
      assert.equal(handleLengthPattern('length:1', undefined), false);
      assert.equal(handleLengthPattern('length:1', { length: 1 }), false); // Object with length property
    });

    test('should handle zero length patterns', () => {
      assert.equal(handleLengthPattern('length:0', ''), true);
      assert.equal(handleLengthPattern('length:0', []), true);
      assert.equal(handleLengthPattern('length:0', 'a'), false);
      assert.equal(handleLengthPattern('length:0', [1]), false);
    });

    test('should parse integer lengths correctly', () => {
      assert.equal(handleLengthPattern('length:10', 'exactly10!'), true);
      assert.equal(handleLengthPattern('length:100', 'a'.repeat(100)), true);
      assert.equal(handleLengthPattern('length:1000', 'x'.repeat(999)), false);
    });

    test('should handle MCP-specific use cases', () => {
      // Tool names
      assert.equal(handleLengthPattern('length:9', 'read_file'), true);
      assert.equal(handleLengthPattern('length:10', 'write_file'), true);

      // JSON-RPC version
      assert.equal(handleLengthPattern('length:3', '2.0'), true);

      // Array of tools
      const tools = [
        { name: 'tool1' },
        { name: 'tool2' },
        { name: 'tool3' },
      ];
      assert.equal(handleLengthPattern('length:3', tools), true);
    });
  });

  describe('handleTypePattern', () => {
    test('should match string types', () => {
      assert.equal(handleTypePattern('type:string', 'hello'), true);
      assert.equal(handleTypePattern('type:string', ''), true);
      assert.equal(handleTypePattern('type:string', '123'), true);
      assert.equal(handleTypePattern('type:string', 123), false);
      assert.equal(handleTypePattern('type:string', null), false);
    });

    test('should match number types', () => {
      assert.equal(handleTypePattern('type:number', 123), true);
      assert.equal(handleTypePattern('type:number', 0), true);
      assert.equal(handleTypePattern('type:number', -456), true);
      assert.equal(handleTypePattern('type:number', 3.14), true);
      assert.equal(handleTypePattern('type:number', Infinity), true);
      assert.equal(handleTypePattern('type:number', NaN), true); // NaN is technically a number
      assert.equal(handleTypePattern('type:number', '123'), false);
      assert.equal(handleTypePattern('type:number', null), false);
    });

    test('should match boolean types', () => {
      assert.equal(handleTypePattern('type:boolean', true), true);
      assert.equal(handleTypePattern('type:boolean', false), true);
      assert.equal(handleTypePattern('type:boolean', 'true'), false);
      assert.equal(handleTypePattern('type:boolean', 1), false);
      assert.equal(handleTypePattern('type:boolean', 0), false);
      assert.equal(handleTypePattern('type:boolean', null), false);
    });

    test('should match array types', () => {
      assert.equal(handleTypePattern('type:array', []), true);
      assert.equal(handleTypePattern('type:array', [1, 2, 3]), true);
      assert.equal(handleTypePattern('type:array', ['a', 'b']), true);
      assert.equal(handleTypePattern('type:array', [{ nested: true }]), true);
      assert.equal(handleTypePattern('type:array', 'not array'), false);
      assert.equal(handleTypePattern('type:array', { length: 3 }), false); // Array-like object
      assert.equal(handleTypePattern('type:array', null), false);
    });

    test('should match object types', () => {
      assert.strictEqual(handleTypePattern('type:object', {}), true);
      assert.strictEqual(handleTypePattern('type:object', []), true); // Arrays are objects
      assert.strictEqual(handleTypePattern('type:object', null), true); // typeof null is "object"
      assert.strictEqual(handleTypePattern('type:object', 'string'), false);
    });

    test('should match null type', () => {
      // typeof null is "object", not "null" - this is JavaScript's quirk
      assert.equal(handleTypePattern('type:null', null), false);
      assert.equal(handleTypePattern('type:object', null), true);
      assert.equal(handleTypePattern('type:null', undefined), false);
      assert.equal(handleTypePattern('type:null', 0), false);
      assert.equal(handleTypePattern('type:null', ''), false);
      assert.equal(handleTypePattern('type:null', false), false);
    });

    test('should match undefined type', () => {
      assert.equal(handleTypePattern('type:undefined', undefined), true);
      assert.equal(handleTypePattern('type:undefined', null), false);
      assert.equal(handleTypePattern('type:undefined', 0), false);
      assert.equal(handleTypePattern('type:undefined', ''), false);
      assert.equal(handleTypePattern('type:undefined', false), false);
    });

    test('should handle unknown types gracefully', () => {
      // Function uses typeof which returns actual types for unknown types
      assert.equal(handleTypePattern('type:unknown', 'test'), false);
      assert.equal(handleTypePattern('type:symbol', Symbol('test')), true);
      assert.equal(handleTypePattern('type:function', () => {}), true);
      assert.equal(handleTypePattern('type:bigint', BigInt(123)), true);
    });

    test('should handle MCP-specific type validation', () => {
      // JSON-RPC message structure
      const jsonrpcMessage = {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      };

      assert.equal(handleTypePattern('type:object', jsonrpcMessage), true);
      assert.equal(handleTypePattern('type:string', jsonrpcMessage.jsonrpc), true);
      assert.equal(handleTypePattern('type:string', jsonrpcMessage.id), true);
      assert.equal(handleTypePattern('type:object', jsonrpcMessage.params), true);

      // Tools array validation
      const tools = [
        { name: 'read_file', description: 'Reads a file' },
        { name: 'write_file', description: 'Writes a file' },
      ];

      assert.equal(handleTypePattern('type:array', tools), true);
      assert.equal(handleTypePattern('type:object', tools[0]), true);
      assert.equal(handleTypePattern('type:string', tools[0].name), true);
    });
  });

  describe('handleExistsPattern', () => {
    test('should return true for exists pattern with non-null/undefined values', () => {
      assert.equal(handleExistsPattern('exists', 'string'), true);
      assert.equal(handleExistsPattern('exists', 123), true);
      assert.equal(handleExistsPattern('exists', true), true);
      assert.equal(handleExistsPattern('exists', false), true);
      assert.equal(handleExistsPattern('exists', 0), true);
      assert.equal(handleExistsPattern('exists', ''), true);
      assert.equal(handleExistsPattern('exists', []), true);
      assert.equal(handleExistsPattern('exists', {}), true);
    });

    test('should return false for exists pattern with null/undefined', () => {
      assert.equal(handleExistsPattern('exists', null), false);
      assert.equal(handleExistsPattern('exists', undefined), false);
    });

    test('should handle edge cases', () => {
      // NaN exists as a value
      assert.equal(handleExistsPattern('exists', NaN), true);

      // Even objects with falsy properties exist
      const obj = { value: null, flag: false, count: 0 };
      assert.equal(handleExistsPattern('exists', obj), true);
      assert.equal(handleExistsPattern('exists', obj.value), false); // null property
      assert.equal(handleExistsPattern('exists', obj.flag), true); // false property
      assert.equal(handleExistsPattern('exists', obj.count), true); // 0 property
      assert.equal(handleExistsPattern('exists', obj.nonexistent), false); // undefined property
    });

    test('should work with MCP response validation', () => {
      const response = {
        jsonrpc: '2.0',
        id: 'test-1',
        result: {
          tools: [],
          optional: null,
        },
      };

      assert.equal(handleExistsPattern('exists', response.jsonrpc), true);
      assert.equal(handleExistsPattern('exists', response.id), true);
      assert.equal(handleExistsPattern('exists', response.result), true);
      assert.equal(handleExistsPattern('exists', response.result.tools), true);
      assert.equal(handleExistsPattern('exists', response.result.optional), false); // null
      assert.equal(handleExistsPattern('exists', response.result.missing), false); // undefined
      assert.equal(handleExistsPattern('exists', response.error), false); // undefined
    });
  });

  describe('handleCountPattern', () => {
    test('should count array elements correctly', () => {
      assert.equal(handleCountPattern('count:0', []), true);
      assert.equal(handleCountPattern('count:3', [1, 2, 3]), true);
      assert.equal(handleCountPattern('count:1', ['single']), true);
      assert.equal(handleCountPattern('count:5', [1, 2, 3]), false);
      assert.equal(handleCountPattern('count:2', [1]), false);
    });

    test('should count object keys correctly', () => {
      assert.equal(handleCountPattern('count:0', {}), true);
      assert.equal(handleCountPattern('count:2', { a: 1, b: 2 }), true);
      assert.equal(handleCountPattern('count:1', { key: 'value' }), true);
      assert.equal(handleCountPattern('count:3', { a: 1, b: 2 }), false);
      assert.equal(handleCountPattern('count:1', { a: 1, b: 2, c: 3 }), false);
    });

    test('should handle nested objects and arrays', () => {
      const nestedObj = {
        config: { timeout: 5000, retries: 3 },
        tools: [1, 2, 3],
        metadata: null,
      };
      assert.equal(handleCountPattern('count:3', nestedObj), true);
      assert.equal(handleCountPattern('count:2', nestedObj.config), true);
      assert.equal(handleCountPattern('count:3', nestedObj.tools), true);
    });

    test('should return false for non-countable values', () => {
      assert.equal(handleCountPattern('count:1', 'string'), false);
      assert.equal(handleCountPattern('count:1', 123), false);
      assert.equal(handleCountPattern('count:1', true), false);
      assert.equal(handleCountPattern('count:0', null), false);
      assert.equal(handleCountPattern('count:0', undefined), false);
    });

    test('should handle zero count patterns', () => {
      assert.equal(handleCountPattern('count:0', []), true);
      assert.equal(handleCountPattern('count:0', {}), true);
      assert.equal(handleCountPattern('count:0', [1]), false);
      assert.equal(handleCountPattern('count:0', { a: 1 }), false);
    });

    test('should handle MCP-specific count scenarios', () => {
      // Tools list with specific count
      const toolsResponse = {
        tools: [
          { name: 'read_file' },
          { name: 'write_file' },
          { name: 'list_files' },
        ],
      };
      assert.equal(handleCountPattern('count:1', toolsResponse), true); // One key: 'tools'
      assert.equal(handleCountPattern('count:3', toolsResponse.tools), true); // Three tools

      // JSON-RPC message structure count
      const jsonrpcMessage = {
        jsonrpc: '2.0',
        id: 'test-1',
        method: 'tools/list',
        params: {},
      };
      assert.equal(handleCountPattern('count:4', jsonrpcMessage), true); // Four properties
      assert.equal(handleCountPattern('count:0', jsonrpcMessage.params), true); // Empty params

      // Error response count
      const errorResponse = {
        jsonrpc: '2.0',
        id: 'error-1',
        error: { code: -32601, message: 'Method not found' },
      };
      assert.equal(handleCountPattern('count:3', errorResponse), true); // Three properties
      assert.equal(handleCountPattern('count:2', errorResponse.error), true); // Two error properties
    });
  });

  describe('Integration Tests', () => {
    test('should work together for comprehensive validation', () => {
      const testData = {
        name: 'test-server',
        tools: [
          { name: 'tool1', active: true },
          { name: 'tool2', active: false },
        ],
        metadata: null,
        config: {
          timeout: 5000,
          retries: 3,
        },
      };

      // Test various patterns on the same data
      assert.equal(handleTypePattern('type:object', testData), true);
      assert.equal(handleTypePattern('type:string', testData.name), true);
      assert.equal(handleLengthPattern('length:11', testData.name), true); // 'test-server'
      assert.equal(handleTypePattern('type:array', testData.tools), true);
      assert.equal(handleLengthPattern('length:2', testData.tools), true);
      assert.equal(handleExistsPattern('exists', testData.metadata), false); // null
      assert.equal(handleExistsPattern('exists', testData.config), true);
      assert.equal(handleTypePattern('type:number', testData.config.timeout), true);
    });

    test('should handle complex MCP validation scenarios', () => {
      const mcpToolsResponse = {
        jsonrpc: '2.0',
        id: 'tools-1',
        result: {
          tools: [
            {
              name: 'read_file',
              description: 'Reads a file from the filesystem',
              inputSchema: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                },
                required: ['path'],
              },
            },
          ],
        },
      };

      // Validate structure types
      assert.equal(handleTypePattern('type:object', mcpToolsResponse), true);
      assert.equal(handleTypePattern('type:string', mcpToolsResponse.jsonrpc), true);
      assert.equal(handleTypePattern('type:array', mcpToolsResponse.result.tools), true);

      // Validate array length
      assert.equal(handleLengthPattern('length:1', mcpToolsResponse.result.tools), true);

      // Validate nested object existence
      const tool = mcpToolsResponse.result.tools[0];
      assert.equal(handleExistsPattern('exists', tool.name), true);
      assert.equal(handleExistsPattern('exists', tool.description), true);
      assert.equal(handleExistsPattern('exists', tool.inputSchema), true);
      assert.equal(handleExistsPattern('exists', tool.optional), false); // undefined

      // Validate string lengths
      assert.equal(handleLengthPattern('length:9', tool.name), true); // 'read_file'
      assert.equal(handleTypePattern('type:string', tool.description), true);
      assert.equal(handleTypePattern('type:object', tool.inputSchema), true);
    });

    test('should handle error response validation', () => {
      const errorResponse = {
        jsonrpc: '2.0',
        id: 'error-1',
        error: {
          code: -32601,
          message: 'Method not found',
          data: null,
        },
      };

      assert.equal(handleTypePattern('type:object', errorResponse), true);
      assert.equal(handleExistsPattern('exists', errorResponse.error), true);
      assert.equal(handleExistsPattern('exists', errorResponse.result), false); // undefined
      assert.equal(handleTypePattern('type:number', errorResponse.error.code), true);
      assert.equal(handleTypePattern('type:string', errorResponse.error.message), true);
      assert.equal(handleExistsPattern('exists', errorResponse.error.data), false); // null
      assert.equal(handleLengthPattern('length:16', errorResponse.error.message), true); // 'Method not found'
    });
  });
});
