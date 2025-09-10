import { strict as assert } from 'assert';
import { test, describe } from 'node:test';

import { matchPattern } from '../../src/test-engine/matchers/patterns.js';

describe('Numeric Pattern Matching', () => {
  describe('greaterThan pattern', () => {
    test('should match numbers greater than threshold', () => {
      assert.equal(matchPattern('greaterThan:5', 10), true);
      assert.equal(matchPattern('greaterThan:5', 6), true);
      assert.equal(matchPattern('greaterThan:5', 5.1), true);
      assert.equal(matchPattern('greaterThan:0', 0.1), true);
      assert.equal(matchPattern('greaterThan:-5', 0), true);
    });

    test('should not match numbers equal to or less than threshold', () => {
      assert.equal(matchPattern('greaterThan:5', 5), false);
      assert.equal(matchPattern('greaterThan:5', 4), false);
      assert.equal(matchPattern('greaterThan:5', -10), false);
      assert.equal(matchPattern('greaterThan:0', 0), false);
    });

    test('should handle string numbers', () => {
      assert.equal(matchPattern('greaterThan:5', '10'), true);
      assert.equal(matchPattern('greaterThan:5', '5'), false);
      assert.equal(matchPattern('greaterThan:5', '3'), false);
    });

    test('should handle decimal thresholds', () => {
      assert.equal(matchPattern('greaterThan:5.5', 6), true);
      assert.equal(matchPattern('greaterThan:5.5', 5.5), false);
      assert.equal(matchPattern('greaterThan:5.5', 5.6), true);
    });

    test('should return false for non-numeric values', () => {
      assert.equal(matchPattern('greaterThan:5', 'abc'), false);
      assert.equal(matchPattern('greaterThan:5', null), false);
      assert.equal(matchPattern('greaterThan:5', undefined), false);
      assert.equal(matchPattern('greaterThan:5', {}), false);
      assert.equal(matchPattern('greaterThan:abc', 10), false);
    });
  });

  describe('lessThan pattern', () => {
    test('should match numbers less than threshold', () => {
      assert.equal(matchPattern('lessThan:5', 4), true);
      assert.equal(matchPattern('lessThan:5', 0), true);
      assert.equal(matchPattern('lessThan:5', -10), true);
      assert.equal(matchPattern('lessThan:0', -0.1), true);
    });

    test('should not match numbers equal to or greater than threshold', () => {
      assert.equal(matchPattern('lessThan:5', 5), false);
      assert.equal(matchPattern('lessThan:5', 6), false);
      assert.equal(matchPattern('lessThan:5', 100), false);
      assert.equal(matchPattern('lessThan:0', 0), false);
    });

    test('should handle string numbers', () => {
      assert.equal(matchPattern('lessThan:5', '3'), true);
      assert.equal(matchPattern('lessThan:5', '5'), false);
      assert.equal(matchPattern('lessThan:5', '10'), false);
    });
  });

  describe('greaterThanOrEqual pattern', () => {
    test('should match numbers greater than or equal to threshold', () => {
      assert.equal(matchPattern('greaterThanOrEqual:5', 5), true);
      assert.equal(matchPattern('greaterThanOrEqual:5', 6), true);
      assert.equal(matchPattern('greaterThanOrEqual:5', 100), true);
      assert.equal(matchPattern('greaterThanOrEqual:0', 0), true);
    });

    test('should not match numbers less than threshold', () => {
      assert.equal(matchPattern('greaterThanOrEqual:5', 4), false);
      assert.equal(matchPattern('greaterThanOrEqual:5', 4.9), false);
      assert.equal(matchPattern('greaterThanOrEqual:0', -0.1), false);
    });
  });

  describe('lessThanOrEqual pattern', () => {
    test('should match numbers less than or equal to threshold', () => {
      assert.equal(matchPattern('lessThanOrEqual:5', 5), true);
      assert.equal(matchPattern('lessThanOrEqual:5', 4), true);
      assert.equal(matchPattern('lessThanOrEqual:5', -100), true);
      assert.equal(matchPattern('lessThanOrEqual:100', 100), true);
    });

    test('should not match numbers greater than threshold', () => {
      assert.equal(matchPattern('lessThanOrEqual:5', 6), false);
      assert.equal(matchPattern('lessThanOrEqual:5', 5.1), false);
      assert.equal(matchPattern('lessThanOrEqual:100', 101), false);
    });
  });

  describe('between pattern', () => {
    test('should match numbers within range (inclusive)', () => {
      assert.equal(matchPattern('between:10:100', 10), true);   // Lower bound
      assert.equal(matchPattern('between:10:100', 100), true);  // Upper bound
      assert.equal(matchPattern('between:10:100', 50), true);   // Middle
      assert.equal(matchPattern('between:10:100', 10.1), true);
      assert.equal(matchPattern('between:10:100', 99.9), true);
    });

    test('should not match numbers outside range', () => {
      assert.equal(matchPattern('between:10:100', 9), false);
      assert.equal(matchPattern('between:10:100', 9.9), false);
      assert.equal(matchPattern('between:10:100', 101), false);
      assert.equal(matchPattern('between:10:100', 100.1), false);
    });

    test('should handle decimal ranges', () => {
      assert.equal(matchPattern('between:1.5:2.5', 1.5), true);
      assert.equal(matchPattern('between:1.5:2.5', 2.0), true);
      assert.equal(matchPattern('between:1.5:2.5', 2.5), true);
      assert.equal(matchPattern('between:1.5:2.5', 1.4), false);
      assert.equal(matchPattern('between:1.5:2.5', 2.6), false);
    });

    test('should handle negative ranges', () => {
      assert.equal(matchPattern('between:-10:-5', -7), true);
      assert.equal(matchPattern('between:-10:-5', -10), true);
      assert.equal(matchPattern('between:-10:-5', -5), true);
      assert.equal(matchPattern('between:-10:-5', -11), false);
      assert.equal(matchPattern('between:-10:-5', -4), false);
    });

    test('should handle string numbers', () => {
      assert.equal(matchPattern('between:10:100', '50'), true);
      assert.equal(matchPattern('between:10:100', '9'), false);
      assert.equal(matchPattern('between:10:100', '101'), false);
    });

    test('should return false for invalid format', () => {
      assert.equal(matchPattern('between:10', 50), false);         // Missing max
      assert.equal(matchPattern('between:10:20:30', 15), false);   // Too many parts
      assert.equal(matchPattern('between:', 50), false);           // Empty range
      assert.equal(matchPattern('between:abc:def', 50), false);    // Non-numeric bounds
    });

    test('should return false for non-numeric values', () => {
      assert.equal(matchPattern('between:10:100', 'abc'), false);
      assert.equal(matchPattern('between:10:100', null), false);
      assert.equal(matchPattern('between:10:100', {}), false);
    });
  });

  describe('range pattern (alias for between)', () => {
    test('should work identically to between pattern', () => {
      assert.equal(matchPattern('range:10:100', 50), true);
      assert.equal(matchPattern('range:10:100', 10), true);
      assert.equal(matchPattern('range:10:100', 100), true);
      assert.equal(matchPattern('range:10:100', 9), false);
      assert.equal(matchPattern('range:10:100', 101), false);
    });

    test('should handle decimal ranges', () => {
      assert.equal(matchPattern('range:0:100', 75.5), true);
      assert.equal(matchPattern('range:0:1', 0.5), true);
      assert.equal(matchPattern('range:0:1', 1.1), false);
    });
  });

  describe('pattern negation with numeric patterns', () => {
    test('should negate greaterThan pattern', () => {
      assert.equal(matchPattern('not:greaterThan:5', 3), true);   // 3 is NOT > 5
      assert.equal(matchPattern('not:greaterThan:5', 5), true);   // 5 is NOT > 5
      assert.equal(matchPattern('not:greaterThan:5', 10), false); // 10 IS > 5
    });

    test('should negate between pattern', () => {
      assert.equal(matchPattern('not:between:10:100', 5), true);   // 5 is NOT between 10-100
      assert.equal(matchPattern('not:between:10:100', 105), true); // 105 is NOT between 10-100
      assert.equal(matchPattern('not:between:10:100', 50), false); // 50 IS between 10-100
    });

    test('should negate range pattern', () => {
      assert.equal(matchPattern('not:range:0:100', -5), true);   // -5 is NOT in range 0-100
      assert.equal(matchPattern('not:range:0:100', 105), true);  // 105 is NOT in range 0-100
      assert.equal(matchPattern('not:range:0:100', 50), false);  // 50 IS in range 0-100
    });
  });
});
