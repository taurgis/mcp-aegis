import { strict as assert } from 'assert';
import { test, describe } from 'node:test';
import { validateWithDetailedAnalysis } from '../../src/test-engine/matchers/validation.js';

describe('Validation Module', () => {
  describe('validateWithDetailedAnalysis', () => {
    describe('Basic Deep Equality', () => {
      test('should pass for exact matches', () => {
        const expected = { jsonrpc: '2.0', id: 'test-1' };
        const actual = { jsonrpc: '2.0', id: 'test-1' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(typeof result.analysis, 'object');
      });

      test('should fail for value mismatches', () => {
        const expected = { jsonrpc: '2.0', id: 'test-1' };
        const actual = { jsonrpc: '2.0', id: 'test-2' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.length > 0);
        assert.strictEqual(result.errors[0].type, 'value_mismatch');
        assert.strictEqual(result.errors[0].path, 'response.id');
      });

      test('should handle missing fields', () => {
        const expected = { jsonrpc: '2.0', id: 'test-1', result: {} };
        const actual = { jsonrpc: '2.0', id: 'test-1' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.some(error => error.type === 'missing_field'));
        assert.ok(result.errors.some(error => error.path === 'response.result'));
      });

      test('should handle extra fields gracefully', () => {
        const expected = { jsonrpc: '2.0', id: 'test-1' };
        const actual = { jsonrpc: '2.0', id: 'test-1', extra: 'field' };

        const result = validateWithDetailedAnalysis(expected, actual);
        // Extra fields actually fail validation - this is the expected behavior
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.some(error => error.type === 'extra_field'));
      });
    });

    describe('Pattern Matching Integration', () => {
      test('should handle regex patterns', () => {
        const expected = {
          jsonrpc: 'match:regex:2',
          message: 'match:regex:^[A-Z]',
        };
        const actual = {
          jsonrpc: '2.0',
          message: 'Hello world',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
        assert.strictEqual(result.errors.length, 0);
      });

      test('should fail invalid regex patterns', () => {
        const expected = {
          version: 'match:regex:^\\\\d+\\\\.',
        };
        const actual = {
          version: 'invalid-version',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.some(error => error.type === 'pattern_failed'));
      });

      test('should handle string patterns', () => {
        const expected = {
          text: 'match:contains:MCP',
          prefix: 'match:startsWith:Hello',
          suffix: 'match:endsWith:world',
        };
        const actual = {
          text: 'Hello MCP Conductor',
          prefix: 'Hello there',
          suffix: 'Hello world',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should handle type patterns', () => {
        const expected = {
          tools: 'match:type:array',
          count: 'match:type:number',
          isError: 'match:type:boolean',
        };
        const actual = {
          tools: ['read_file'],
          count: 1,
          isError: false,
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should handle array patterns', () => {
        const expected = {
          tools: 'match:arrayLength:2',
          data: 'match:arrayContains:test',
        };
        const actual = {
          tools: ['read_file', 'write_file'],
          data: ['test', 'other'],
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });
    });

    describe('Field Extraction Integration', () => {
      test('should handle field extraction patterns', () => {
        const expected = {
          'match:extractField': 'tools.*.name',
          value: ['read_file', 'write_file'],
        };
        const actual = {
          tools: [
            { name: 'read_file', description: 'Reads files' },
            { name: 'write_file', description: 'Writes files' },
          ],
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should handle field extraction with patterns', () => {
        const expected = {
          'match:extractField': 'tools.*.name',
          value: 'match:arrayContains:read_file',
        };
        const actual = {
          tools: [
            { name: 'read_file', description: 'Reads files' },
            { name: 'write_file', description: 'Writes files' },
          ],
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should fail missing field extraction', () => {
        const expected = {
          'match:extractField': 'nonexistent.field',
          value: ['test'],
        };
        const actual = {
          tools: [{ name: 'read_file' }],
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.some(error => error.type === 'missing_field'));
      });
    });

    describe('Partial Matching', () => {
      test('should handle partial matching patterns', () => {
        const expected = {
          'match:partial': {
            result: {
              tools: 'match:type:array',
            },
          },
        };
        const actual = {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            tools: ['read_file'],
            serverInfo: { name: 'Test Server' },
          },
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should fail partial matching for missing required fields', () => {
        const expected = {
          'match:partial': {
            result: {
              tools: 'match:type:array',
              requiredField: 'test',
            },
          },
        };
        const actual = {
          result: {
            tools: ['read_file'],
          },
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.some(error => error.type === 'missing_field'));
      });
    });

    describe('Pattern Negation', () => {
      test('should handle not: patterns', () => {
        const expected = {
          tools: 'match:not:arrayLength:0',
          text: 'match:not:contains:error',
          status: 'match:not:startsWith:invalid',
        };
        const actual = {
          tools: ['read_file'],
          text: 'success message',
          status: 'valid',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should fail when negation condition is met', () => {
        const expected = {
          tools: 'match:not:arrayLength:0',
        };
        const actual = {
          tools: [],
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.some(error => error.type === 'pattern_failed'));
      });
    });

    describe('Complex Nested Structures', () => {
      test('should validate complex MCP responses', () => {
        const expected = {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            content: [
              {
                type: 'text',
                text: 'match:contains:MCP',
              },
            ],
            isError: false,
          },
        };
        const actual = {
          jsonrpc: '2.0',
          id: 'test-1',
          result: {
            content: [
              {
                type: 'text',
                text: 'Hello, MCP Conductor!',
              },
            ],
            isError: false,
          },
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should handle array element patterns', () => {
        const expected = {
          tools: {
            'match:arrayElements': {
              name: 'match:type:string',
              description: 'match:type:string',
              inputSchema: 'match:type:object',
            },
          },
        };
        const actual = {
          tools: [
            {
              name: 'read_file',
              description: 'Reads a file',
              inputSchema: { type: 'object', properties: {} },
            },
            {
              name: 'write_file',
              description: 'Writes a file',
              inputSchema: { type: 'object', properties: {} },
            },
          ],
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });
    });

    describe('Error Response Validation', () => {
      test('should validate error responses', () => {
        const expected = {
          jsonrpc: '2.0',
          id: 'test-1',
          error: {
            code: 'match:type:number',
            message: 'match:type:string',
          },
        };
        const actual = {
          jsonrpc: '2.0',
          id: 'test-1',
          error: {
            code: -32601,
            message: 'Method not found',
          },
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should handle error structure mismatches', () => {
        const expected = {
          error: {
            code: 'match:type:number',
            message: 'match:type:string',
          },
        };
        const actual = {
          error: {
            code: 'invalid',
            message: 123,
          },
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.some(error => error.type === 'pattern_failed'));
        assert.ok(result.errors.some(error => error.path.includes('error.code')));
        assert.ok(result.errors.some(error => error.path.includes('error.message')));
      });
    });

    describe('Edge Cases and Error Handling', () => {
      test('should handle null and undefined values', () => {
        const expected = { value: null };
        const actual = { value: null };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should handle undefined vs null differences', () => {
        const expected = { value: null };
        const actual = { value: undefined };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.some(error => error.type === 'value_mismatch'));
      });

      test('should handle circular references gracefully', () => {
        const circularObj = { name: 'test' };
        circularObj.self = circularObj;

        const expected = { name: 'test' };

        try {
          const result = validateWithDetailedAnalysis(expected, circularObj);
          // If it doesn't crash, that's good
          assert.strictEqual(typeof result.passed, 'boolean');
        } catch (error) {
          // If it crashes with circular structure error, that's also expected
          assert.ok(error.message.includes('circular structure'));
        }
      });

      test('should handle empty objects and arrays', () => {
        const expected = {
          obj: {},
          arr: [],
          count: 'match:type:number',
        };
        const actual = {
          obj: {},
          arr: [],
          count: 0,
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should provide custom root path', () => {
        const expected = { field: 'value' };
        const actual = { field: 'wrong' };

        const result = validateWithDetailedAnalysis(expected, actual, 'custom.path');
        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.some(error => error.path.startsWith('custom.path')));
      });
    });

    describe('Validation Result Structure', () => {
      test('should return proper result structure', () => {
        const expected = { test: 'value' };
        const actual = { test: 'value' };

        const result = validateWithDetailedAnalysis(expected, actual);

        // Check result structure
        assert.ok(typeof result.passed === 'boolean');
        assert.ok(Array.isArray(result.errors));
        assert.ok(typeof result.analysis === 'object');

        // For successful validation
        assert.strictEqual(result.passed, true);
        assert.strictEqual(result.errors.length, 0);
      });

      test('should provide detailed error information', () => {
        const expected = {
          missing: 'field',
          wrong: 'value',
          type: 'match:type:number',
        };
        const actual = {
          wrong: 'different',
          type: 'string',
        };

        const result = validateWithDetailedAnalysis(expected, actual);

        assert.strictEqual(result.passed, false);
        assert.ok(result.errors.length > 0);

        // Check error structure
        const error = result.errors[0];
        assert.ok(typeof error.type === 'string');
        assert.ok(typeof error.path === 'string');
        assert.ok(typeof error.message === 'string');
        assert.ok('expected' in error);
        assert.ok('actual' in error);
        assert.ok(typeof error.suggestion === 'string');
        assert.ok(typeof error.category === 'string');
      });
    });

    describe('Performance and Memory', () => {
      test('should handle large objects efficiently', () => {
        const largeObj = {};
        for (let i = 0; i < 100; i++) {
          largeObj[`field${i}`] = `value${i}`;
        }

        const start = Date.now();
        const result = validateWithDetailedAnalysis(largeObj, largeObj);
        const duration = Date.now() - start;

        assert.strictEqual(result.passed, true);
        assert.ok(duration < 100); // Should complete quickly
      });

      test('should handle deeply nested structures', () => {
        let nested = { value: 'deep' };
        for (let i = 0; i < 10; i++) {
          nested = { level: i, child: nested };
        }

        const result = validateWithDetailedAnalysis(nested, nested);
        assert.strictEqual(result.passed, true);
      });
    });

    describe('MCP Protocol Specific Scenarios', () => {
      test('should validate tools/list responses', () => {
        const expected = {
          jsonrpc: '2.0',
          id: 'match:type:string',
          result: {
            tools: {
              'match:arrayElements': {
                name: 'match:type:string',
                description: 'match:type:string',
                inputSchema: 'match:type:object',
              },
            },
          },
        };
        const actual = {
          jsonrpc: '2.0',
          id: 'tools-1',
          result: {
            tools: [
              {
                name: 'read_file',
                description: 'Read a file from the filesystem',
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

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should validate tools/call responses', () => {
        const expected = {
          jsonrpc: '2.0',
          id: 'match:type:string',
          result: {
            content: 'match:type:array',
            isError: false,
          },
        };
        const actual = {
          jsonrpc: '2.0',
          id: 'call-1',
          result: {
            content: [
              {
                type: 'text',
                text: 'File contents here',
              },
            ],
            isError: false,
          },
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });

      test('should validate initialize responses', () => {
        const expected = {
          jsonrpc: '2.0',
          id: 'match:type:string',
          result: {
            protocolVersion: 'match:contains:2025',
            capabilities: 'match:type:object',
            serverInfo: {
              name: 'match:type:string',
              version: 'match:type:string',
            },
          },
        };
        const actual = {
          jsonrpc: '2.0',
          id: 'init-1',
          result: {
            protocolVersion: '2025-06-18',
            capabilities: {
              tools: {},
            },
            serverInfo: {
              name: 'Test MCP Server',
              version: '1.0.0',
            },
          },
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);
      });
    });
  });
});
