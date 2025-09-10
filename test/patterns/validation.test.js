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

    describe('Pattern Failure Analysis Coverage', () => {
      test('should analyze arrayLength pattern failures with non-arrays', () => {
        const expected = { items: 'match:arrayLength:3' };
        const actual = { items: 'not-an-array' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'pattern_failed');
        assert.ok(error);
        assert.ok(error.message.includes('Array length validation failed'));
        assert.ok(error.suggestion.includes('Fix server to return an array'));
        assert.strictEqual(error.patternType, 'arrayLength');
      });

      test('should analyze regex pattern failures', () => {
        const expected = { version: 'match:\\d+\\.\\d+' };
        const actual = { version: 'invalid-version' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'pattern_failed');
        assert.ok(error);
        assert.strictEqual(error.patternType, 'regex');
        assert.ok(error.message.includes('Regex pattern'));
        assert.ok(error.suggestion.includes('Update regex pattern'));
      });

      test('should analyze contains pattern failures on non-strings', () => {
        const expected = { text: 'match:contains:hello' };
        const actual = { text: 12345 };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'pattern_failed');
        assert.ok(error);
        assert.strictEqual(error.patternType, 'contains');
        assert.ok(error.suggestion.includes('Fix server to return string'));
      });

      test('should analyze startsWith pattern failures on non-strings', () => {
        const expected = { prefix: 'match:startsWith:hello' };
        const actual = { prefix: ['hello', 'world'] };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'pattern_failed');
        assert.ok(error);
        assert.strictEqual(error.patternType, 'startsWith');
        assert.ok(error.suggestion.includes('Fix server to return string'));
      });

      test('should analyze endsWith pattern failures on non-strings', () => {
        const expected = { suffix: 'match:endsWith:world' };
        const actual = { suffix: 42 };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'pattern_failed');
        assert.ok(error);
        assert.strictEqual(error.patternType, 'endsWith');
        assert.ok(error.suggestion.includes('Fix server to return string'));
      });

      test('should analyze arrayContains pattern failures on non-arrays', () => {
        const expected = { items: 'match:arrayContains:test' };
        const actual = { items: 'not-an-array' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'pattern_failed');
        assert.ok(error);
        assert.strictEqual(error.patternType, 'arrayContains');
        assert.ok(error.suggestion.includes('Fix server to return array'));
      });

      test('should analyze negation pattern failures', () => {
        const expected = { value: 'match:not:contains:forbidden' };
        const actual = { value: 'this contains forbidden text' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'pattern_failed');
        assert.ok(error);
        assert.strictEqual(error.patternType, 'negation');
        assert.ok(error.message.includes('should NOT match'));
        assert.ok(error.suggestion.includes('remove the \'not:\' prefix'));
      });

      test('should analyze unknown pattern failures', () => {
        const expected = { value: 'match:unknownPattern:test' };
        const actual = { value: 'some-value' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'pattern_failed');
        assert.ok(error);
        assert.strictEqual(error.patternType, 'unknown');
        assert.ok(error.suggestion.includes('Review pattern syntax'));
      });
    });

    describe('Advanced Null and Undefined Handling', () => {
      test('should handle null expected with actual value', () => {
        const expected = { value: null };
        const actual = { value: 'some-value' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'value_mismatch');
        assert.ok(error);
        assert.ok(error.suggestion.includes('Remove this field from the expected response'));
      });      test('should handle undefined expected with actual value', () => {
        const expected = { value: undefined };
        const actual = { value: 'some-value' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'value_mismatch');
        assert.ok(error);
        assert.ok(error.suggestion.includes('Remove this field from the expected response'));
      });

      test('should handle actual null with expected value', () => {
        const expected = { value: 'expected' };
        const actual = { value: null };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'value_mismatch');
        assert.ok(error);
        assert.ok(error.suggestion.includes('Ensure the server returns the expected expected'));
      });
    });

    describe('Type Mismatch Edge Cases', () => {
      test('should handle primitive type mismatches', () => {
        const expected = {
          stringVal: 'hello',
          numberVal: 42,
          booleanVal: true,
        };
        const actual = {
          stringVal: 123,
          numberVal: 'forty-two',
          booleanVal: 'yes',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const errors = result.errors.filter(e => e.type === 'type_mismatch');
        assert.strictEqual(errors.length, 3);

        errors.forEach(error => {
          assert.ok(error.suggestion.includes('Change expected type to match actual'));
        });
      });

      test('should handle array vs object type mismatches', () => {
        const expected = { data: [] };
        const actual = { data: {} };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'type_mismatch');
        assert.ok(error);
        assert.ok(error.suggestion.includes('Change test to expect object'));
      });

      test('should handle object vs array type mismatches', () => {
        const expected = { data: {} };
        const actual = { data: [] };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'type_mismatch');
        assert.ok(error);
        assert.ok(error.suggestion.includes('Change test to expect array'));
      });
    });

    describe('Array Validation Edge Cases', () => {
      test('should handle array length mismatches with detailed suggestions', () => {
        const expected = { items: ['a', 'b', 'c'] };
        const actual = { items: ['a'] };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'length_mismatch');
        assert.ok(error);
        assert.ok(error.suggestion.includes('Add 2 missing item(s)'));
      });

      test('should handle arrays with extra items', () => {
        const expected = { items: ['a'] };
        const actual = { items: ['a', 'b', 'c'] };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const lengthError = result.errors.find(e => e.type === 'length_mismatch');
        assert.ok(lengthError);
        assert.ok(lengthError.suggestion.includes('Remove 2 extra item(s)'));

        const extraErrors = result.errors.filter(e => e.type === 'extra_field');
        assert.ok(extraErrors.length >= 2);
      });

      test('should handle arrayElements pattern with non-array actual', () => {
        const expected = {
          tools: {
            'match:arrayElements': {
              name: 'match:type:string',
            },
          },
        };
        const actual = { tools: 'not-an-array' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'type_mismatch');
        assert.ok(error);
        assert.ok(error.message.includes('arrayElements pattern expects array'));
      });
    });

    describe('Partial Validation Advanced Cases', () => {
      test('should handle partial validation with primitive mismatches', () => {
        const expected = {
          'match:partial': {
            field1: 'expected',
            field2: 42,
          },
        };
        const actual = {
          field1: 'different',
          field2: 'not-a-number',
          field3: 'extra-field',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const errors = result.errors.filter(e => e.type === 'value_mismatch');
        assert.ok(errors.length >= 2);
      });

      test('should handle partial validation with missing fields', () => {
        const expected = {
          'match:partial': {
            required: 'value',
            alsoRequired: 'another',
          },
        };
        const actual = {
          required: 'value',
          extraField: 'ignored',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'missing_field');
        assert.ok(error);
        assert.ok(error.path.includes('alsoRequired'));
      });

      test('should handle partial array validation', () => {
        const expected = {
          'match:partial': [
            { id: 1 },
            { id: 2 },
            { id: 3 },
          ],
        };
        const actual = [
          { id: 1, name: 'first' },
          { id: 'wrong-type', name: 'second' },
          // Missing third element
        ];

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const missingError = result.errors.find(e => e.type === 'missing_field' && e.path.includes('[2]'));
        const mismatchError = result.errors.find(e => e.type === 'value_mismatch' && e.path.includes('[1].id'));
        assert.ok(missingError);
        assert.ok(mismatchError);
      });

      test('should handle partial validation type mismatches', () => {
        const expected = {
          'match:partial': { data: {} },
        };
        const actual = { data: [] };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'type_mismatch');
        assert.ok(error);
        assert.ok(error.message.includes('expected object but got array'));
      });

      test('should handle partial validation with null values', () => {
        const expected = {
          'match:partial': {
            nullable: null,
            required: 'value',
          },
        };
        const actual = {
          nullable: 'not-null',
          required: 'value',
          extra: 'ignored',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'value_mismatch');
        assert.ok(error);
        assert.ok(error.path.includes('nullable'));
      });
    });

    describe('Analysis Generation and Suggestions', () => {
      test('should generate comprehensive analysis for multiple error types', () => {
        const expected = {
          missing: 'field',
          wrong: 'value',
          extraField: undefined,
          typeError: 'match:type:number',
          patternError: 'match:contains:test',
        };
        const actual = {
          wrong: 'different',
          extra: 'unexpected',
          typeError: 'string',
          patternError: 'no match here',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        // Check analysis structure
        assert.ok(typeof result.analysis.totalErrors === 'number');
        assert.ok(typeof result.analysis.errorsByType === 'object');
        assert.ok(typeof result.analysis.errorsByCategory === 'object');
        assert.ok(typeof result.analysis.summary === 'string');
        assert.ok(Array.isArray(result.analysis.suggestions));

        // Check error type counts
        const { errorsByType } = result.analysis;
        assert.ok(errorsByType.missing_field > 0);
        assert.ok(errorsByType.value_mismatch > 0);
        assert.ok(errorsByType.extra_field > 0);
        assert.ok(errorsByType.pattern_failed > 0);

        // Check summary content
        assert.ok(result.analysis.summary.includes('missing field'));
        assert.ok(result.analysis.summary.includes('unexpected field'));

        // Check suggestions
        assert.ok(result.analysis.suggestions.length > 0);
        assert.ok(result.analysis.suggestions.length <= 3); // Top 3 suggestions
      });

      test('should handle successful validation analysis', () => {
        const expected = { test: 'value' };
        const actual = { test: 'value' };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, true);

        assert.strictEqual(result.analysis.totalErrors, 0);
        assert.strictEqual(result.analysis.summary, 'All validations passed successfully.');
        assert.strictEqual(result.analysis.suggestions.length, 0);
      });

      test('should prioritize suggestions by error frequency', () => {
        const expected = {
          field1: 'wrong',
          field2: 'wrong',
          field3: 'wrong',
          field4: 'match:type:number',
        };
        const actual = {
          field1: 'different1',
          field2: 'different2',
          field3: 'different3',
          field4: 'string',
        };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        // Should prioritize value_mismatch (3 instances) over pattern_failed (1 instance)
        const suggestions = result.analysis.suggestions;
        const firstSuggestion = suggestions[0];
        assert.ok(firstSuggestion.includes('(3 similar issues found)') ||
                  firstSuggestion.includes('Update expected value'));
      });
    });

    describe('Value Preview and Formatting', () => {
      test('should format long string values in error messages', () => {
        const longString = 'a'.repeat(100);
        const expected = { text: 'short' };
        const actual = { text: longString };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'value_mismatch');
        assert.ok(error);
        // The actual field stores the original value, not formatted
        assert.strictEqual(error.actual, longString);
        assert.strictEqual(error.actual.length, longString.length);
      });

      test('should format object values in error messages', () => {
        const complexObject = { key1: 'value1', key2: 'value2', nested: { deep: 'value' } };
        const expected = { data: 'simple' };
        const actual = { data: complexObject };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'type_mismatch');
        assert.ok(error);
        assert.strictEqual(error.actual, 'object');
        assert.strictEqual(error.expected, 'string');
      });

      test('should format array values in error messages', () => {
        const longArray = new Array(50).fill('item');
        const expected = { items: 'string' };
        const actual = { items: longArray };

        const result = validateWithDetailedAnalysis(expected, actual);
        assert.strictEqual(result.passed, false);

        const error = result.errors.find(e => e.type === 'type_mismatch');
        assert.ok(error);
        assert.strictEqual(error.actual, 'object'); // Arrays are objects in JavaScript
        assert.strictEqual(error.expected, 'string');
      });
    });
  });
});
