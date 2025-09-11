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

  describe('equals pattern', () => {
    test('should match exact numeric values', () => {
      assert.equal(matchPattern('equals:42', 42), true);
      assert.equal(matchPattern('equals:0', 0), true);
      assert.equal(matchPattern('equals:-5', -5), true);
      assert.equal(matchPattern('equals:3.14', 3.14), true);
    });

    test('should not match different numeric values', () => {
      assert.equal(matchPattern('equals:42', 43), false);
      assert.equal(matchPattern('equals:0', 1), false);
      assert.equal(matchPattern('equals:-5', -4), false);
      assert.equal(matchPattern('equals:3.14', 3.15), false);
    });

    test('should handle string numbers', () => {
      assert.equal(matchPattern('equals:42', '42'), true);
      assert.equal(matchPattern('equals:3.14', '3.14'), true);
      assert.equal(matchPattern('equals:42', '43'), false);
    });

    test('should return false for non-numeric values', () => {
      assert.equal(matchPattern('equals:42', 'abc'), false);
      assert.equal(matchPattern('equals:42', null), false);
      assert.equal(matchPattern('equals:42', undefined), false);
      assert.equal(matchPattern('equals:abc', 42), false);
    });
  });

  describe('notEquals pattern', () => {
    test('should match different numeric values', () => {
      assert.equal(matchPattern('notEquals:42', 43), true);
      assert.equal(matchPattern('notEquals:0', 1), true);
      assert.equal(matchPattern('notEquals:-5', -4), true);
      assert.equal(matchPattern('notEquals:3.14', 3.15), true);
    });

    test('should not match equal numeric values', () => {
      assert.equal(matchPattern('notEquals:42', 42), false);
      assert.equal(matchPattern('notEquals:0', 0), false);
      assert.equal(matchPattern('notEquals:-5', -5), false);
      assert.equal(matchPattern('notEquals:3.14', 3.14), false);
    });

    test('should handle string numbers', () => {
      assert.equal(matchPattern('notEquals:42', '43'), true);
      assert.equal(matchPattern('notEquals:42', '42'), false);
      assert.equal(matchPattern('notEquals:3.14', '3.15'), true);
    });

    test('should return false for non-numeric values', () => {
      assert.equal(matchPattern('notEquals:42', 'abc'), false);
      assert.equal(matchPattern('notEquals:42', null), false);
      assert.equal(matchPattern('notEquals:42', undefined), false);
      assert.equal(matchPattern('notEquals:abc', 42), false);
    });
  });

  describe('approximately pattern', () => {
    test('should match values within tolerance', () => {
      assert.equal(matchPattern('approximately:10:0.1', 10.05), true);
      assert.equal(matchPattern('approximately:10:0.1', 9.95), true);
      assert.equal(matchPattern('approximately:10:0.1', 10), true);
      assert.equal(matchPattern('approximately:3.14159:0.001', 3.141), true);
    });

    test('should not match values outside tolerance', () => {
      assert.equal(matchPattern('approximately:10:0.1', 10.2), false);
      assert.equal(matchPattern('approximately:10:0.1', 9.8), false);
      assert.equal(matchPattern('approximately:3.14159:0.001', 3.143), false);
    });

    test('should handle string numbers', () => {
      assert.equal(matchPattern('approximately:10:0.1', '10.05'), true);
      assert.equal(matchPattern('approximately:10:0.1', '10.2'), false);
    });

    test('should return false for invalid format', () => {
      assert.equal(matchPattern('approximately:10', 10), false);         // Missing tolerance
      assert.equal(matchPattern('approximately:10:0.1:extra', 10), false); // Too many parts
      assert.equal(matchPattern('approximately:', 10), false);           // Empty params
      assert.equal(matchPattern('approximately:abc:def', 10), false);    // Non-numeric params
    });

    test('should return false for non-numeric values', () => {
      assert.equal(matchPattern('approximately:10:0.1', 'abc'), false);
      assert.equal(matchPattern('approximately:10:0.1', null), false);
      assert.equal(matchPattern('approximately:10:0.1', undefined), false);
    });
  });

  describe('multipleOf pattern', () => {
    test('should match multiples of the divisor', () => {
      assert.equal(matchPattern('multipleOf:5', 10), true);
      assert.equal(matchPattern('multipleOf:5', 15), true);
      assert.equal(matchPattern('multipleOf:5', 0), true);
      assert.equal(matchPattern('multipleOf:3', 9), true);
      assert.equal(matchPattern('multipleOf:2', 8), true);
    });

    test('should not match non-multiples of the divisor', () => {
      assert.equal(matchPattern('multipleOf:5', 7), false);
      assert.equal(matchPattern('multipleOf:5', 13), false);
      assert.equal(matchPattern('multipleOf:3', 10), false);
      assert.equal(matchPattern('multipleOf:2', 7), false);
    });

    test('should handle decimal divisors', () => {
      assert.equal(matchPattern('multipleOf:0.5', 1), true);
      assert.equal(matchPattern('multipleOf:0.5', 1.5), true);
      assert.equal(matchPattern('multipleOf:0.5', 1.3), false);
    });

    test('should handle string numbers', () => {
      assert.equal(matchPattern('multipleOf:5', '10'), true);
      assert.equal(matchPattern('multipleOf:5', '7'), false);
    });

    test('should return false for zero divisor', () => {
      assert.equal(matchPattern('multipleOf:0', 5), false);
    });

    test('should return false for non-numeric values', () => {
      assert.equal(matchPattern('multipleOf:5', 'abc'), false);
      assert.equal(matchPattern('multipleOf:5', null), false);
      assert.equal(matchPattern('multipleOf:abc', 10), false);
    });
  });

  describe('divisibleBy pattern', () => {
    test('should work identically to multipleOf pattern', () => {
      assert.equal(matchPattern('divisibleBy:5', 10), true);
      assert.equal(matchPattern('divisibleBy:5', 15), true);
      assert.equal(matchPattern('divisibleBy:5', 7), false);
      assert.equal(matchPattern('divisibleBy:3', 9), true);
      assert.equal(matchPattern('divisibleBy:3', 10), false);
    });

    test('should handle edge cases like multipleOf', () => {
      assert.equal(matchPattern('divisibleBy:0', 5), false);
      assert.equal(matchPattern('divisibleBy:5', 'abc'), false);
      assert.equal(matchPattern('divisibleBy:abc', 10), false);
    });
  });

  describe('decimalPlaces pattern', () => {
    test('should match exact decimal places', () => {
      assert.equal(matchPattern('decimalPlaces:2', 12.34), true);
      assert.equal(matchPattern('decimalPlaces:0', 42), true);
      assert.equal(matchPattern('decimalPlaces:1', 3.5), true);
      assert.equal(matchPattern('decimalPlaces:3', 1.234), true);
    });

    test('should not match different decimal places', () => {
      assert.equal(matchPattern('decimalPlaces:2', 12.3), false);    // 1 decimal place
      assert.equal(matchPattern('decimalPlaces:0', 42.5), false);    // 1 decimal place
      assert.equal(matchPattern('decimalPlaces:1', 3.55), false);    // 2 decimal places
      assert.equal(matchPattern('decimalPlaces:3', 1.23), false);    // 2 decimal places
    });

    test('should handle string numbers', () => {
      assert.equal(matchPattern('decimalPlaces:2', '12.34'), true);
      assert.equal(matchPattern('decimalPlaces:0', '42'), true);
      assert.equal(matchPattern('decimalPlaces:2', '12.3'), false);
    });

    test('should handle edge cases', () => {
      assert.equal(matchPattern('decimalPlaces:0', 0), true);
      assert.equal(matchPattern('decimalPlaces:0', 0.0), true);  // JavaScript converts to 0
    });

    test('should return false for non-numeric values', () => {
      assert.equal(matchPattern('decimalPlaces:2', 'abc'), false);
      assert.equal(matchPattern('decimalPlaces:2', null), false);
      assert.equal(matchPattern('decimalPlaces:abc', 12.34), false);
    });
  });

  describe('pattern negation with new numeric patterns', () => {
    test('should negate equals pattern', () => {
      assert.equal(matchPattern('not:equals:42', 43), true);   // 43 is NOT equal to 42
      assert.equal(matchPattern('not:equals:42', 42), false);  // 42 IS equal to 42
    });

    test('should negate approximately pattern', () => {
      assert.equal(matchPattern('not:approximately:10:0.1', 10.2), true);  // 10.2 is NOT approximately 10 ±0.1
      assert.equal(matchPattern('not:approximately:10:0.1', 10.05), false); // 10.05 IS approximately 10 ±0.1
    });

    test('should negate multipleOf pattern', () => {
      assert.equal(matchPattern('not:multipleOf:5', 7), true);   // 7 is NOT multiple of 5
      assert.equal(matchPattern('not:multipleOf:5', 10), false); // 10 IS multiple of 5
    });

    test('should negate decimalPlaces pattern', () => {
      assert.equal(matchPattern('not:decimalPlaces:2', 12.3), true);   // 12.3 does NOT have 2 decimal places
      assert.equal(matchPattern('not:decimalPlaces:2', 12.34), false); // 12.34 DOES have 2 decimal places
    });
  });
});
