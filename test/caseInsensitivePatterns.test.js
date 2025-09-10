import { strict as assert } from 'assert';
import { test, describe } from 'node:test';
import { matchPattern } from '../src/test-engine/matchers/patterns.js';

describe('Case-Insensitive String Pattern Matching', () => {
  describe('containsIgnoreCase pattern', () => {
    test('should match strings containing substring (case-insensitive)', () => {
      assert.equal(matchPattern('containsIgnoreCase:john', 'John Doe'), true);
      assert.equal(matchPattern('containsIgnoreCase:john', 'JOHN DOE'), true);
      assert.equal(matchPattern('containsIgnoreCase:john', 'johnny'), true);
      assert.equal(matchPattern('containsIgnoreCase:ERROR', 'There was an error'), true);
      assert.equal(matchPattern('containsIgnoreCase:success', 'Operation SUCCESS'), true);
    });

    test('should not match strings not containing substring', () => {
      assert.equal(matchPattern('containsIgnoreCase:john', 'alice'), false);
      assert.equal(matchPattern('containsIgnoreCase:error', 'Everything is fine'), false);
      assert.equal(matchPattern('containsIgnoreCase:test', 'production'), false);
    });

    test('should work with arrays (case-insensitive)', () => {
      assert.equal(matchPattern('containsIgnoreCase:john', ['Alice', 'JOHN', 'Bob']), true);
      assert.equal(matchPattern('containsIgnoreCase:ERROR', ['info', 'warning', 'Error occurred']), true);
      assert.equal(matchPattern('containsIgnoreCase:missing', ['found', 'present', 'available']), false);
    });

    test('should handle edge cases', () => {
      assert.equal(matchPattern('containsIgnoreCase:', 'any string'), true); // Empty search string
      assert.equal(matchPattern('containsIgnoreCase:test', ''), false); // Empty target string
      assert.equal(matchPattern('containsIgnoreCase:test', null), false); // Null target
      assert.equal(matchPattern('containsIgnoreCase:test', undefined), false); // Undefined target
      assert.equal(matchPattern('containsIgnoreCase:test', 123), false); // Non-string target
    });

    test('should work with special characters', () => {
      assert.equal(matchPattern('containsIgnoreCase:@', 'user@domain.com'), true);
      assert.equal(matchPattern('containsIgnoreCase:.txt', 'FILE.TXT'), true);
      assert.equal(matchPattern('containsIgnoreCase:http://', 'HTTP://example.com'), true);
    });
  });

  describe('equalsIgnoreCase pattern', () => {
    test('should match exact strings (case-insensitive)', () => {
      assert.equal(matchPattern('equalsIgnoreCase:SUCCESS', 'success'), true);
      assert.equal(matchPattern('equalsIgnoreCase:SUCCESS', 'Success'), true);
      assert.equal(matchPattern('equalsIgnoreCase:SUCCESS', 'SUCCESS'), true);
      assert.equal(matchPattern('equalsIgnoreCase:error', 'ERROR'), true);
      assert.equal(matchPattern('equalsIgnoreCase:Test123', 'test123'), true);
    });

    test('should not match different strings', () => {
      assert.equal(matchPattern('equalsIgnoreCase:SUCCESS', 'FAILURE'), false);
      assert.equal(matchPattern('equalsIgnoreCase:error', 'warning'), false);
      assert.equal(matchPattern('equalsIgnoreCase:complete', 'completed'), false); // Substring, not equal
    });

    test('should only work with strings', () => {
      assert.equal(matchPattern('equalsIgnoreCase:123', 123), false); // Number
      assert.equal(matchPattern('equalsIgnoreCase:true', true), false); // Boolean
      assert.equal(matchPattern('equalsIgnoreCase:test', null), false); // Null
      assert.equal(matchPattern('equalsIgnoreCase:test', undefined), false); // Undefined
      assert.equal(matchPattern('equalsIgnoreCase:test', ['test']), false); // Array
    });

    test('should handle edge cases', () => {
      assert.equal(matchPattern('equalsIgnoreCase:', ''), true); // Empty strings
      assert.equal(matchPattern('equalsIgnoreCase:test', ''), false); // Non-empty vs empty
      assert.equal(matchPattern('equalsIgnoreCase:', 'test'), false); // Empty vs non-empty
    });

    test('should work with special characters', () => {
      assert.equal(matchPattern('equalsIgnoreCase:user@domain.com', 'USER@DOMAIN.COM'), true);
      assert.equal(matchPattern('equalsIgnoreCase:file.txt', 'FILE.TXT'), true);
      assert.equal(matchPattern('equalsIgnoreCase:http://example.com', 'HTTP://EXAMPLE.COM'), true);
    });
  });

  describe('case-insensitive patterns with negation', () => {
    test('should work with not:containsIgnoreCase', () => {
      assert.equal(matchPattern('not:containsIgnoreCase:error', 'Success message'), true);
      assert.equal(matchPattern('not:containsIgnoreCase:error', 'ERROR occurred'), false);
      assert.equal(matchPattern('not:containsIgnoreCase:john', 'Alice and Bob'), true);
      assert.equal(matchPattern('not:containsIgnoreCase:john', 'JOHN DOE'), false);
    });

    test('should work with not:equalsIgnoreCase', () => {
      assert.equal(matchPattern('not:equalsIgnoreCase:failure', 'SUCCESS'), true);
      assert.equal(matchPattern('not:equalsIgnoreCase:failure', 'FAILURE'), false);
      assert.equal(matchPattern('not:equalsIgnoreCase:error', 'warning'), true);
      assert.equal(matchPattern('not:equalsIgnoreCase:error', 'ERROR'), false);
    });
  });

  describe('integration with existing patterns', () => {
    test('should work alongside case-sensitive patterns', () => {
      // Case-sensitive contains
      assert.equal(matchPattern('contains:John', 'John Doe'), true);
      assert.equal(matchPattern('contains:John', 'john doe'), false);
      
      // Case-insensitive contains
      assert.equal(matchPattern('containsIgnoreCase:John', 'John Doe'), true);
      assert.equal(matchPattern('containsIgnoreCase:John', 'john doe'), true);
    });

    test('should maintain correct pattern precedence', () => {
      // Longer pattern names should be matched first
      assert.equal(matchPattern('containsIgnoreCase:test', 'Testing'), true);
      assert.equal(matchPattern('contains:test', 'Testing'), false);
    });
  });
});
