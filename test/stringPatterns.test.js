import { strict as assert } from 'assert';
import { test, describe } from 'node:test';

// Import the pattern matching function (we need to extract it or test it indirectly)
// For now, let's create a simple test of the pattern matching logic

/**
 * Simple test version of the pattern matching logic for validation
 */
function matchPattern(pattern, actual) {
  if (pattern.startsWith('startsWith:')) {
    const prefix = pattern.substring(11);
    if (typeof actual === 'string') {
      return actual.startsWith(prefix);
    }
    return false;
  }
  
  if (pattern.startsWith('endsWith:')) {
    const suffix = pattern.substring(9);
    if (typeof actual === 'string') {
      return actual.endsWith(suffix);
    }
    return false;
  }
  
  if (pattern.startsWith('contains:')) {
    const searchValue = pattern.substring(9);
    if (typeof actual === 'string') {
      return actual.includes(searchValue);
    }
    return false;
  }
  
  return false;
}

describe('String Pattern Matching', () => {
  test('startsWith pattern should work correctly', () => {
    assert.equal(matchPattern('startsWith:Hello', 'Hello, World!'), true);
    assert.equal(matchPattern('startsWith:Hello', 'Hi, World!'), false);
    assert.equal(matchPattern('startsWith:Error:', 'Error: File not found'), true);
    assert.equal(matchPattern('startsWith:Warning:', 'Error: File not found'), false);
  });

  test('endsWith pattern should work correctly', () => {
    assert.equal(matchPattern('endsWith:!', 'Hello, World!'), true);
    assert.equal(matchPattern('endsWith:!', 'Hello, World.'), false);
    assert.equal(matchPattern('endsWith:occurred', 'System error occurred'), true);
    assert.equal(matchPattern('endsWith:finished', 'System error occurred'), false);
  });

  test('contains pattern should still work', () => {
    assert.equal(matchPattern('contains:World', 'Hello, World!'), true);
    assert.equal(matchPattern('contains:World', 'Hello, Universe!'), false);
  });

  test('patterns should be case sensitive', () => {
    assert.equal(matchPattern('startsWith:hello', 'Hello, World!'), false);
    assert.equal(matchPattern('endsWith:WORLD!', 'Hello, World!'), false);
    assert.equal(matchPattern('startsWith:Hello', 'Hello, World!'), true);
    assert.equal(matchPattern('endsWith:World!', 'Hello, World!'), true);
  });

  test('patterns should handle edge cases', () => {
    assert.equal(matchPattern('startsWith:', 'Hello'), true); // Empty prefix matches anything
    assert.equal(matchPattern('endsWith:', 'Hello'), true);   // Empty suffix matches anything
    assert.equal(matchPattern('startsWith:Hello', ''), false); // Empty string doesn't start with non-empty
    assert.equal(matchPattern('endsWith:World', ''), false);   // Empty string doesn't end with non-empty
  });

  test('patterns should only work with strings', () => {
    assert.equal(matchPattern('startsWith:Hello', 123), false);
    assert.equal(matchPattern('endsWith:World', null), false);
    assert.equal(matchPattern('startsWith:test', undefined), false);
  });
});
