import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  handleRegexPattern,
  handleContainsPattern,
  handleStartsWithPattern,
  handleEndsWithPattern,
  handleContainsIgnoreCasePattern,
  handleEqualsIgnoreCasePattern,
  handleDefaultPattern,
} from '../../src/test-engine/matchers/stringPatterns.js';

describe('String Patterns Module', () => {
  describe('handleRegexPattern', () => {
    it('should match basic regex patterns', () => {
      assert.strictEqual(handleRegexPattern('regex:\\d+', '123'), true);
      assert.strictEqual(handleRegexPattern('regex:\\d+', 'abc'), false);
      assert.strictEqual(handleRegexPattern('regex:[a-z]+', 'hello'), true);
      assert.strictEqual(handleRegexPattern('regex:[a-z]+', 'HELLO'), false);
    });

    it('should handle complex regex patterns', () => {
      assert.strictEqual(handleRegexPattern('regex:^[A-Z][a-z]+$', 'Hello'), true);
      assert.strictEqual(handleRegexPattern('regex:^[A-Z][a-z]+$', 'hello'), false);
      assert.strictEqual(handleRegexPattern('regex:^[A-Z][a-z]+$', 'HELLO'), false);
    });

    it('should handle email regex pattern', () => {
      const emailPattern = 'regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
      assert.strictEqual(handleRegexPattern(emailPattern, 'test@example.com'), true);
      assert.strictEqual(handleRegexPattern(emailPattern, 'invalid.email'), false);
      assert.strictEqual(handleRegexPattern(emailPattern, 'user@domain'), false);
    });

    it('should convert non-string values to strings', () => {
      assert.strictEqual(handleRegexPattern('regex:\\d+', 123), true);
      assert.strictEqual(handleRegexPattern('regex:true|false', true), true);
      assert.strictEqual(handleRegexPattern('regex:null', null), true);
    });

    it('should handle special regex characters', () => {
      assert.strictEqual(handleRegexPattern('regex:\\$\\d+\\.\\d{2}', '$19.99'), true);
      assert.strictEqual(handleRegexPattern('regex:\\(\\d{3}\\)\\s\\d{3}-\\d{4}', '(555) 123-4567'), true);
    });

    it('should handle empty patterns and values', () => {
      assert.strictEqual(handleRegexPattern('regex:', ''), true);
      assert.strictEqual(handleRegexPattern('regex:.*', ''), true);
      assert.strictEqual(handleRegexPattern('regex:.+', ''), false);
    });
  });

  describe('handleContainsPattern', () => {
    it('should match substring in strings', () => {
      assert.strictEqual(handleContainsPattern('contains:world', 'hello world'), true);
      assert.strictEqual(handleContainsPattern('contains:world', 'hello universe'), false);
      assert.strictEqual(handleContainsPattern('contains:abc', 'abcdef'), true);
    });

    it('should be case-sensitive', () => {
      assert.strictEqual(handleContainsPattern('contains:World', 'hello world'), false);
      assert.strictEqual(handleContainsPattern('contains:HELLO', 'hello world'), false);
      assert.strictEqual(handleContainsPattern('contains:hello', 'hello world'), true);
    });

    it('should handle array values', () => {
      assert.strictEqual(handleContainsPattern('contains:test', ['hello', 'test', 'world']), true);
      assert.strictEqual(handleContainsPattern('contains:missing', ['hello', 'test', 'world']), false);
      assert.strictEqual(handleContainsPattern('contains:est', ['hello', 'test', 'world']), true); // 'test' contains 'est'
    });

    it('should convert array elements to strings', () => {
      assert.strictEqual(handleContainsPattern('contains:123', [100, 123, 456]), true);
      assert.strictEqual(handleContainsPattern('contains:true', [false, true, null]), true);
      assert.strictEqual(handleContainsPattern('contains:12', [100, 123, 456]), true); // '123' contains '12'
    });

    it('should return false for non-string non-array values', () => {
      assert.strictEqual(handleContainsPattern('contains:test', 123), false);
      assert.strictEqual(handleContainsPattern('contains:test', null), false);
      assert.strictEqual(handleContainsPattern('contains:test', undefined), false);
      assert.strictEqual(handleContainsPattern('contains:test', {}), false);
    });

    it('should handle empty search values', () => {
      assert.strictEqual(handleContainsPattern('contains:', 'hello'), true); // Empty string is contained in any string
      assert.strictEqual(handleContainsPattern('contains:', ['hello']), true);
      assert.strictEqual(handleContainsPattern('contains:', ''), true);
    });
  });

  describe('handleStartsWithPattern', () => {
    it('should match string prefixes', () => {
      assert.strictEqual(handleStartsWithPattern('startsWith:hello', 'hello world'), true);
      assert.strictEqual(handleStartsWithPattern('startsWith:world', 'hello world'), false);
      assert.strictEqual(handleStartsWithPattern('startsWith:H', 'Hello'), true);
    });

    it('should be case-sensitive', () => {
      assert.strictEqual(handleStartsWithPattern('startsWith:Hello', 'hello world'), false);
      assert.strictEqual(handleStartsWithPattern('startsWith:HELLO', 'hello world'), false);
    });

    it('should only work with strings', () => {
      assert.strictEqual(handleStartsWithPattern('startsWith:1', 123), false);
      assert.strictEqual(handleStartsWithPattern('startsWith:t', true), false);
      assert.strictEqual(handleStartsWithPattern('startsWith:n', null), false);
      assert.strictEqual(handleStartsWithPattern('startsWith:hello', ['hello', 'world']), false);
    });

    it('should handle empty prefix', () => {
      assert.strictEqual(handleStartsWithPattern('startsWith:', 'hello'), true); // Empty prefix matches any string
      assert.strictEqual(handleStartsWithPattern('startsWith:', ''), true);
    });

    it('should handle exact matches', () => {
      assert.strictEqual(handleStartsWithPattern('startsWith:hello', 'hello'), true);
      assert.strictEqual(handleStartsWithPattern('startsWith:hello world', 'hello world'), true);
    });
  });

  describe('handleEndsWithPattern', () => {
    it('should match string suffixes', () => {
      assert.strictEqual(handleEndsWithPattern('endsWith:world', 'hello world'), true);
      assert.strictEqual(handleEndsWithPattern('endsWith:hello', 'hello world'), false);
      assert.strictEqual(handleEndsWithPattern('endsWith:d', 'world'), true);
    });

    it('should be case-sensitive', () => {
      assert.strictEqual(handleEndsWithPattern('endsWith:World', 'hello world'), false);
      assert.strictEqual(handleEndsWithPattern('endsWith:WORLD', 'hello world'), false);
    });

    it('should only work with strings', () => {
      assert.strictEqual(handleEndsWithPattern('endsWith:3', 123), false);
      assert.strictEqual(handleEndsWithPattern('endsWith:e', true), false);
      assert.strictEqual(handleEndsWithPattern('endsWith:l', null), false);
      assert.strictEqual(handleEndsWithPattern('endsWith:world', ['hello', 'world']), false);
    });

    it('should handle empty suffix', () => {
      assert.strictEqual(handleEndsWithPattern('endsWith:', 'hello'), true); // Empty suffix matches any string
      assert.strictEqual(handleEndsWithPattern('endsWith:', ''), true);
    });

    it('should handle exact matches', () => {
      assert.strictEqual(handleEndsWithPattern('endsWith:world', 'world'), true);
      assert.strictEqual(handleEndsWithPattern('endsWith:hello world', 'hello world'), true);
    });
  });

  describe('handleContainsIgnoreCasePattern', () => {
    it('should match substring case-insensitively in strings', () => {
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:world', 'hello WORLD'), true);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:HELLO', 'hello world'), true);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:WoRlD', 'hello world'), true);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:xyz', 'hello world'), false);
    });

    it('should handle array values case-insensitively', () => {
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:TEST', ['hello', 'test', 'world']), true);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:test', ['HELLO', 'TEST', 'WORLD']), true);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:ESt', ['hello', 'test', 'world']), true); // 'test' contains 'est'
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:missing', ['hello', 'test', 'world']), false);
    });

    it('should convert array elements to strings and match case-insensitively', () => {
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:123', [100, 123, 456]), true);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:TRUE', [false, true, null]), true);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:12', [100, 123, 456]), true);
    });

    it('should return false for non-string non-array values', () => {
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:test', 123), false);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:test', null), false);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:test', undefined), false);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:test', {}), false);
    });

    it('should handle empty search values', () => {
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:', 'HELLO'), true);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:', ['HELLO']), true);
      assert.strictEqual(handleContainsIgnoreCasePattern('containsIgnoreCase:', ''), true);
    });
  });

  describe('handleEqualsIgnoreCasePattern', () => {
    it('should match strings case-insensitively', () => {
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:hello', 'HELLO'), true);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:WORLD', 'world'), true);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:TeSt', 'test'), true);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:hello', 'hello world'), false);
    });

    it('should require exact matches (ignoring case)', () => {
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:hello world', 'HELLO WORLD'), true);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:hello', 'hello there'), false);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:test', 'testing'), false);
    });

    it('should only work with strings', () => {
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:123', 123), false);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:true', true), false);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:null', null), false);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:test', ['test']), false);
    });

    it('should handle empty strings', () => {
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:', ''), true);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:', 'hello'), false);
    });

    it('should handle special characters', () => {
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:hello@world.com', 'HELLO@WORLD.COM'), true);
      assert.strictEqual(handleEqualsIgnoreCasePattern('equalsIgnoreCase:test-123', 'TEST-123'), true);
    });
  });

  describe('handleDefaultPattern', () => {
    it('should detect and handle regex patterns', () => {
      // These patterns should be detected as regex by isRegexPattern
      assert.strictEqual(handleDefaultPattern('\\d+', '123'), true);
      assert.strictEqual(handleDefaultPattern('[a-z]+', 'hello'), true);
      assert.strictEqual(handleDefaultPattern('^test$', 'test'), true);
      assert.strictEqual(handleDefaultPattern('\\w+@\\w+\\.\\w+', 'test@example.com'), true);
    });

    it('should handle non-regex patterns as substring contains', () => {
      // Simple strings without regex characters
      assert.strictEqual(handleDefaultPattern('hello', 'hello world'), true);
      assert.strictEqual(handleDefaultPattern('world', 'hello world'), true);
      assert.strictEqual(handleDefaultPattern('missing', 'hello world'), false);
    });

    it('should convert values to strings for pattern matching', () => {
      assert.strictEqual(handleDefaultPattern('123', 123), true);
      assert.strictEqual(handleDefaultPattern('12', 123), true); // substring match
      assert.strictEqual(handleDefaultPattern('true', true), true);
      assert.strictEqual(handleDefaultPattern('null', null), true);
    });

    it('should handle complex regex patterns', () => {
      assert.strictEqual(handleDefaultPattern('\\d{4}-\\d{2}-\\d{2}', '2023-12-25'), true);
      assert.strictEqual(handleDefaultPattern('\\d{4}-\\d{2}-\\d{2}', '23-12-25'), false);
      assert.strictEqual(handleDefaultPattern('[A-Z][a-z]+', 'Hello'), true);
      assert.strictEqual(handleDefaultPattern('[A-Z][a-z]+', 'hello'), false);
    });

    it('should handle edge cases', () => {
      assert.strictEqual(handleDefaultPattern('', 'any string'), true); // Empty pattern matches as substring
      assert.strictEqual(handleDefaultPattern('test', ''), false); // No match in empty string
      assert.strictEqual(handleDefaultPattern('', ''), true); // Empty pattern matches empty string
    });

    it('should handle mixed regex and non-regex scenarios', () => {
      // Regex pattern with special characters
      assert.strictEqual(handleDefaultPattern('\\$\\d+', '$100'), true);
      // Non-regex pattern that might look like regex but isn't detected as such
      assert.strictEqual(handleDefaultPattern('test.log', 'test.log'), true);
      assert.strictEqual(handleDefaultPattern('test.log', 'test_log'), false);
    });
  });
});
