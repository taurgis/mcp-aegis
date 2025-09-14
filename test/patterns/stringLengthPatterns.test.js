import { strict as assert } from 'assert';
import { test, describe } from 'node:test';
import {
  handleStringLengthPattern,
  handleStringLengthGreaterThanPattern,
  handleStringLengthLessThanPattern,
  handleStringLengthGreaterThanOrEqualPattern,
  handleStringLengthLessThanOrEqualPattern,
  handleStringLengthBetweenPattern,
  handleStringEmptyPattern,
  handleStringNotEmptyPattern,
} from '../../src/test-engine/matchers/stringPatterns.js';

describe('String Length Patterns Module', () => {
  describe('handleStringLengthPattern', () => {
    test('should match exact string lengths', () => {
      assert.equal(handleStringLengthPattern('stringLength:0', ''), true);
      assert.equal(handleStringLengthPattern('stringLength:5', 'hello'), true);
      assert.equal(handleStringLengthPattern('stringLength:13', 'Hello, World!'), true);
      assert.equal(handleStringLengthPattern('stringLength:5', 'hi'), false);
      assert.equal(handleStringLengthPattern('stringLength:0', 'not empty'), false);
    });

    test('should only work with strings', () => {
      assert.equal(handleStringLengthPattern('stringLength:3', [1, 2, 3]), false);
      assert.equal(handleStringLengthPattern('stringLength:0', null), false);
      assert.equal(handleStringLengthPattern('stringLength:1', 1), false);
      assert.equal(handleStringLengthPattern('stringLength:0', undefined), false);
    });

    test('should handle special characters and unicode', () => {
      assert.equal(handleStringLengthPattern('stringLength:9', '🚀🎯✅💻🌟'), true);
      assert.equal(handleStringLengthPattern('stringLength:12', 'hello\nworld!'), true);
      assert.equal(handleStringLengthPattern('stringLength:3', 'a\tb'), true);
    });
  });

  describe('handleStringLengthGreaterThanPattern', () => {
    test('should match strings longer than specified length', () => {
      assert.equal(handleStringLengthGreaterThanPattern('stringLengthGreaterThan:5', 'hello world'), true);
      assert.equal(handleStringLengthGreaterThanPattern('stringLengthGreaterThan:0', 'a'), true);
      assert.equal(handleStringLengthGreaterThanPattern('stringLengthGreaterThan:5', 'hello'), false);
      assert.equal(handleStringLengthGreaterThanPattern('stringLengthGreaterThan:5', 'hi'), false);
    });

    test('should only work with strings', () => {
      assert.equal(handleStringLengthGreaterThanPattern('stringLengthGreaterThan:2', [1, 2, 3]), false);
      assert.equal(handleStringLengthGreaterThanPattern('stringLengthGreaterThan:0', null), false);
    });
  });

  describe('handleStringLengthLessThanPattern', () => {
    test('should match strings shorter than specified length', () => {
      assert.equal(handleStringLengthLessThanPattern('stringLengthLessThan:5', 'hi'), true);
      assert.equal(handleStringLengthLessThanPattern('stringLengthLessThan:10', 'short'), true);
      assert.equal(handleStringLengthLessThanPattern('stringLengthLessThan:5', 'hello'), false);
      assert.equal(handleStringLengthLessThanPattern('stringLengthLessThan:5', 'hello world'), false);
    });

    test('should only work with strings', () => {
      assert.equal(handleStringLengthLessThanPattern('stringLengthLessThan:5', [1, 2]), false);
      assert.equal(handleStringLengthLessThanPattern('stringLengthLessThan:10', undefined), false);
    });
  });

  describe('handleStringLengthGreaterThanOrEqualPattern', () => {
    test('should match strings of specified length or longer', () => {
      assert.equal(handleStringLengthGreaterThanOrEqualPattern('stringLengthGreaterThanOrEqual:5', 'hello'), true);
      assert.equal(handleStringLengthGreaterThanOrEqualPattern('stringLengthGreaterThanOrEqual:5', 'hello world'), true);
      assert.equal(handleStringLengthGreaterThanOrEqualPattern('stringLengthGreaterThanOrEqual:0', ''), true);
      assert.equal(handleStringLengthGreaterThanOrEqualPattern('stringLengthGreaterThanOrEqual:5', 'hi'), false);
    });

    test('should only work with strings', () => {
      assert.equal(handleStringLengthGreaterThanOrEqualPattern('stringLengthGreaterThanOrEqual:3', [1, 2, 3]), false);
    });
  });

  describe('handleStringLengthLessThanOrEqualPattern', () => {
    test('should match strings of specified length or shorter', () => {
      assert.equal(handleStringLengthLessThanOrEqualPattern('stringLengthLessThanOrEqual:5', 'hello'), true);
      assert.equal(handleStringLengthLessThanOrEqualPattern('stringLengthLessThanOrEqual:5', 'hi'), true);
      assert.equal(handleStringLengthLessThanOrEqualPattern('stringLengthLessThanOrEqual:0', ''), true);
      assert.equal(handleStringLengthLessThanOrEqualPattern('stringLengthLessThanOrEqual:5', 'hello world'), false);
    });

    test('should only work with strings', () => {
      assert.equal(handleStringLengthLessThanOrEqualPattern('stringLengthLessThanOrEqual:5', [1, 2]), false);
    });
  });

  describe('handleStringLengthBetweenPattern', () => {
    test('should match strings within specified length range', () => {
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:3:8', 'hello'), true);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:1:5', 'hi'), true);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:0:0', ''), true);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:5:10', 'testing'), true);
    });

    test('should reject strings outside specified range', () => {
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:3:8', 'hi'), false);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:3:8', 'this is way too long'), false);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:1:5', ''), false);
    });

    test('should handle invalid range formats', () => {
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:invalid:range', 'test'), false);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:abc:def', 'test'), false);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:5', 'test'), false);
    });

    test('should only work with strings', () => {
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:1:5', [1, 2, 3]), false);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:0:10', null), false);
    });
  });

  describe('handleStringEmptyPattern', () => {
    test('should match empty strings', () => {
      assert.equal(handleStringEmptyPattern('stringEmpty', ''), true);
      assert.equal(handleStringEmptyPattern('stringEmpty', 'not empty'), false);
      assert.equal(handleStringEmptyPattern('stringEmpty', ' '), false);
    });

    test('should only work with strings', () => {
      assert.equal(handleStringEmptyPattern('stringEmpty', []), false);
      assert.equal(handleStringEmptyPattern('stringEmpty', null), false);
      assert.equal(handleStringEmptyPattern('stringEmpty', undefined), false);
      assert.equal(handleStringEmptyPattern('stringEmpty', 0), false);
    });
  });

  describe('handleStringNotEmptyPattern', () => {
    test('should match non-empty strings', () => {
      assert.equal(handleStringNotEmptyPattern('stringNotEmpty', 'hello'), true);
      assert.equal(handleStringNotEmptyPattern('stringNotEmpty', ' '), true);
      assert.equal(handleStringNotEmptyPattern('stringNotEmpty', '\n'), true);
      assert.equal(handleStringNotEmptyPattern('stringNotEmpty', ''), false);
    });

    test('should only work with strings', () => {
      assert.equal(handleStringNotEmptyPattern('stringNotEmpty', [1]), false);
      assert.equal(handleStringNotEmptyPattern('stringNotEmpty', null), false);
      assert.equal(handleStringNotEmptyPattern('stringNotEmpty', undefined), false);
      assert.equal(handleStringNotEmptyPattern('stringNotEmpty', 1), false);
    });
  });

  describe('Integration with special characters', () => {
    test('should handle unicode and special characters correctly', () => {
      const emojiString = '🚀🎯✅💻🌟';
      assert.equal(handleStringLengthPattern('stringLength:9', emojiString), true);
      assert.equal(handleStringLengthGreaterThanPattern('stringLengthGreaterThan:8', emojiString), true);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:8:10', emojiString), true);
    });

    test('should handle newlines and tabs correctly', () => {
      const multilineString = 'hello\nworld\ttesting';
      assert.equal(handleStringLengthPattern('stringLength:19', multilineString), true);
      assert.equal(handleStringLengthBetweenPattern('stringLengthBetween:15:25', multilineString), true);
    });
  });
});
