import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseParameters, getParameterFormatExamples } from '../../src/core/parameterParser.js';

describe('Parameter Parser Tests', () => {
  describe('parseParameters - JSON format', () => {
    test('should parse valid JSON object', () => {
      const result = parseParameters('{"key": "value", "num": 42}');
      assert.deepEqual(result, { key: 'value', num: 42 });
    });

    test('should parse complex JSON object', () => {
      const result = parseParameters('{"nested": {"key": "value"}, "array": [1, 2, 3], "bool": true}');
      assert.deepEqual(result, {
        nested: { key: 'value' },
        array: [1, 2, 3],
        bool: true,
      });
    });

    test('should return empty object for empty string', () => {
      const result = parseParameters('');
      assert.deepEqual(result, {});
    });

    test('should return empty object for null/undefined', () => {
      assert.deepEqual(parseParameters(null), {});
      assert.deepEqual(parseParameters(undefined), {});
    });

    test('should throw error for invalid JSON', () => {
      assert.throws(() => {
        parseParameters('{invalid json}');
      }, /Invalid JSON for parameters/);
    });

    test('should throw error for JSON array', () => {
      assert.throws(() => {
        parseParameters('[1, 2, 3]');
      }, /parameters must be a JSON object/);
    });

    test('should throw error for JSON null', () => {
      assert.throws(() => {
        parseParameters('null');
      }, /parameters must be a JSON object/);
    });
  });

  describe('parseParameters - Pipe-separated format', () => {
    test('should parse simple key:value pairs', () => {
      const result = parseParameters('key1:value1|key2:value2');
      assert.deepEqual(result, { key1: 'value1', key2: 'value2' });
    });

    test('should parse single key:value pair', () => {
      const result = parseParameters('key:value');
      assert.deepEqual(result, { key: 'value' });
    });

    test('should parse mixed data types', () => {
      const result = parseParameters('text:hello|num:42|float:3.14|bool:true|nil:null|false:false');
      assert.deepEqual(result, {
        text: 'hello',
        num: 42,
        float: 3.14,
        bool: true,
        nil: null,
        false: false,
      });
    });

    test('should parse nested object notation', () => {
      const result = parseParameters('obj.field:value|obj.count:5|other.nested.deep:test');
      assert.deepEqual(result, {
        obj: { field: 'value', count: 5 },
        other: { nested: { deep: 'test' } },
      });
    });

    test('should handle escaped pipes', () => {
      const result = parseParameters('message:hello\\|world|other:value');
      assert.deepEqual(result, { message: 'hello|world', other: 'value' });
    });

    test('should parse JSON values in pipe format', () => {
      const result = parseParameters('config:{"key": "value"}|items:[1,2,3]|quoted:"hello world"');
      assert.deepEqual(result, {
        config: { key: 'value' },
        items: [1, 2, 3],
        quoted: 'hello world',
      });
    });

    test('should handle empty values', () => {
      const result = parseParameters('empty:|nonempty:value');
      assert.deepEqual(result, { empty: '', nonempty: 'value' });
    });

    test('should handle whitespace around keys and values', () => {
      const result = parseParameters(' key1 : value1 | key2 : value2 ');
      assert.deepEqual(result, { key1: 'value1', key2: 'value2' });
    });

    test('should throw error for missing colon', () => {
      assert.throws(() => {
        parseParameters('invalidformat|key:value');
      }, /Invalid parameters format.*expected format "key:value"/);
    });

    test('should throw error for empty key', () => {
      assert.throws(() => {
        parseParameters(':value|other:test');
      }, /Invalid parameters format: empty key/);
    });

    test('should handle malformed JSON values gracefully', () => {
      const result = parseParameters('broken:{"invalid:json}|valid:test');
      assert.deepEqual(result, { broken: '{"invalid:json}', valid: 'test' });
    });
  });

  describe('parseParameters - Edge cases', () => {
    test('should handle mixed JSON attempt that falls back to pipe format', () => {
      // This looks like JSON but is malformed, should be parsed as pipe format since it doesn't end with }
      const result = parseParameters('{key:value');
      assert.deepEqual(result, { '{key': 'value' });
    });

    test('should handle complex nested objects with arrays', () => {
      const result = parseParameters('user.profile.settings:{"theme": "dark"}|user.permissions:[1,2,3]|user.active:true');
      assert.deepEqual(result, {
        user: {
          profile: { settings: { theme: 'dark' } },
          permissions: [1, 2, 3],
          active: true,
        },
      });
    });

    test('should handle special characters in values', () => {
      const result = parseParameters('path:/home/user/file.txt|url:https://example.com|special:@#$%^&*()');
      assert.deepEqual(result, {
        path: '/home/user/file.txt',
        url: 'https://example.com',
        special: '@#$%^&*()',
      });
    });

    test('should handle numerical keys when parsed as pipe format', () => {
      const result = parseParameters('123:value|456:test');
      assert.deepEqual(result, { '123': 'value', '456': 'test' });
    });
  });

  describe('parseParameters - Custom context', () => {
    test('should use custom context in error messages', () => {
      assert.throws(() => {
        parseParameters('[1, 2, 3]', 'tool arguments');
      }, /tool arguments must be a JSON object/);
    });

    test('should use custom context in pipe format errors', () => {
      assert.throws(() => {
        parseParameters('invalid format', 'method params');
      }, /Invalid method params format/);
    });
  });

  describe('getParameterFormatExamples', () => {
    test('should return array of example strings', () => {
      const examples = getParameterFormatExamples();
      assert.ok(Array.isArray(examples));
      assert.ok(examples.length > 0);
      assert.ok(examples.every(example => typeof example === 'string'));
    });

    test('should include both JSON and pipe format examples', () => {
      const examples = getParameterFormatExamples();
      const hasJsonExample = examples.some(ex => ex.includes('JSON format'));
      const hasPipeExample = examples.some(ex => ex.includes('Pipe format'));
      assert.ok(hasJsonExample);
      assert.ok(hasPipeExample);
    });
  });
});
