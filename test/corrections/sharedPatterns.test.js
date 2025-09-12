/**
 * sharedPatterns.test.js
 * Comprehensive test suite for shared patterns module
 * Tests all pattern lookup functions and edge cases
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import {
  AVAILABLE_PATTERNS,
  ALL_PATTERN_NAMES,
  VALID_PATTERNS,
  PATTERN_EXAMPLES,
  isValidPattern,
  getPatternCategory,
  getExamplesForType,
} from '../../src/test-engine/matchers/corrections/shared/patterns.js';

describe('Shared Patterns Module', () => {
  describe('Constants', () => {
    test('should have AVAILABLE_PATTERNS defined', () => {
      assert.ok(typeof AVAILABLE_PATTERNS === 'object');
      assert.ok(Array.isArray(AVAILABLE_PATTERNS.core));
      assert.ok(Array.isArray(AVAILABLE_PATTERNS.string));
      assert.ok(Array.isArray(AVAILABLE_PATTERNS.array));
      assert.ok(Array.isArray(AVAILABLE_PATTERNS.numeric));
    });

    test('should have ALL_PATTERN_NAMES as flat array', () => {
      assert.ok(Array.isArray(ALL_PATTERN_NAMES));
      assert.ok(ALL_PATTERN_NAMES.length > 0);
      assert.ok(ALL_PATTERN_NAMES.includes('type'));
      assert.ok(ALL_PATTERN_NAMES.includes('regex'));
      assert.ok(ALL_PATTERN_NAMES.includes('arrayLength'));
    });

    test('should have VALID_PATTERNS defined', () => {
      assert.ok(typeof VALID_PATTERNS === 'object');
      assert.ok(VALID_PATTERNS.regex);
      assert.ok(VALID_PATTERNS.contains);
      assert.ok(VALID_PATTERNS.arrayLength);
    });

    test('should have PATTERN_EXAMPLES defined', () => {
      assert.ok(typeof PATTERN_EXAMPLES === 'object');
      assert.ok(Array.isArray(PATTERN_EXAMPLES.string));
      assert.ok(Array.isArray(PATTERN_EXAMPLES.numeric));
      assert.ok(Array.isArray(PATTERN_EXAMPLES.default));
    });
  });

  describe('isValidPattern', () => {
    test('should return true for valid patterns', () => {
      assert.strictEqual(isValidPattern('type'), true);
      assert.strictEqual(isValidPattern('regex'), true);
      assert.strictEqual(isValidPattern('contains'), true);
      assert.strictEqual(isValidPattern('arrayLength'), true);
      assert.strictEqual(isValidPattern('greaterThan'), true);
      assert.strictEqual(isValidPattern('dateValid'), true);
    });

    test('should return false for invalid patterns', () => {
      // Testing lines 114-115: invalid pattern check
      assert.strictEqual(isValidPattern('nonexistent'), false);
      assert.strictEqual(isValidPattern('invalid_pattern'), false);
      assert.strictEqual(isValidPattern('fake_pattern'), false);
      assert.strictEqual(isValidPattern(''), false);
      assert.strictEqual(isValidPattern(null), false);
      assert.strictEqual(isValidPattern(undefined), false);
    });
  });

  describe('getPatternCategory', () => {
    test('should return correct category for known patterns', () => {
      assert.strictEqual(getPatternCategory('type'), 'core');
      assert.strictEqual(getPatternCategory('exists'), 'core');
      assert.strictEqual(getPatternCategory('length'), 'core');
      
      assert.strictEqual(getPatternCategory('regex'), 'string');
      assert.strictEqual(getPatternCategory('contains'), 'string');
      assert.strictEqual(getPatternCategory('startsWith'), 'string');
      
      assert.strictEqual(getPatternCategory('arrayLength'), 'array');
      assert.strictEqual(getPatternCategory('arrayContains'), 'array');
      assert.strictEqual(getPatternCategory('arrayElements'), 'array');
      
      assert.strictEqual(getPatternCategory('greaterThan'), 'numeric');
      assert.strictEqual(getPatternCategory('lessThan'), 'numeric');
      assert.strictEqual(getPatternCategory('between'), 'numeric');
      
      assert.strictEqual(getPatternCategory('dateValid'), 'date');
      assert.strictEqual(getPatternCategory('dateAfter'), 'date');
      assert.strictEqual(getPatternCategory('dateBefore'), 'date');
      
      assert.strictEqual(getPatternCategory('extractField'), 'complex');
      assert.strictEqual(getPatternCategory('partial'), 'complex');
      assert.strictEqual(getPatternCategory('not'), 'complex');
    });

    test('should return "unknown" for invalid patterns', () => {
      // Testing lines 121-127: loop through categories and fallback to 'unknown'
      assert.strictEqual(getPatternCategory('nonexistent'), 'unknown');
      assert.strictEqual(getPatternCategory('invalid_pattern'), 'unknown');
      assert.strictEqual(getPatternCategory('fake_pattern'), 'unknown');
      assert.strictEqual(getPatternCategory(''), 'unknown');
      assert.strictEqual(getPatternCategory(null), 'unknown');
      assert.strictEqual(getPatternCategory(undefined), 'unknown');
      assert.strictEqual(getPatternCategory(123), 'unknown');
      assert.strictEqual(getPatternCategory(true), 'unknown');
    });
  });

  describe('getExamplesForType', () => {
    test('should return correct examples for known types', () => {
      const stringExamples = getExamplesForType('string');
      assert.ok(Array.isArray(stringExamples));
      assert.ok(stringExamples.includes('match:contains:example'));
      assert.ok(stringExamples.includes('match:startsWith:prefix'));

      const numericExamples = getExamplesForType('numeric');
      assert.ok(Array.isArray(numericExamples));
      assert.ok(numericExamples.includes('match:equals:42'));
      assert.ok(numericExamples.includes('match:greaterThan:0'));

      const arrayExamples = getExamplesForType('array');
      assert.ok(Array.isArray(arrayExamples));
      assert.ok(arrayExamples.includes('match:arrayLength:5'));
      assert.ok(arrayExamples.includes('match:arrayContains:value'));

      const typeExamples = getExamplesForType('type');
      assert.ok(Array.isArray(typeExamples));
      assert.ok(typeExamples.includes('match:type:string'));
      assert.ok(typeExamples.includes('match:type:number'));

      const dateExamples = getExamplesForType('date');
      assert.ok(Array.isArray(dateExamples));
      assert.ok(dateExamples.includes('match:dateValid'));
      assert.ok(dateExamples.includes('match:dateAfter:2023-01-01'));
    });

    test('should return default examples for unknown types', () => {
      // Testing lines 133-134: fallback to default examples
      const unknownExamples = getExamplesForType('nonexistent');
      assert.ok(Array.isArray(unknownExamples));
      assert.deepStrictEqual(unknownExamples, PATTERN_EXAMPLES.default);

      const emptyExamples = getExamplesForType('');
      assert.ok(Array.isArray(emptyExamples));
      assert.deepStrictEqual(emptyExamples, PATTERN_EXAMPLES.default);

      const nullExamples = getExamplesForType(null);
      assert.ok(Array.isArray(nullExamples));
      assert.deepStrictEqual(nullExamples, PATTERN_EXAMPLES.default);

      const undefinedExamples = getExamplesForType(undefined);
      assert.ok(Array.isArray(undefinedExamples));
      assert.deepStrictEqual(undefinedExamples, PATTERN_EXAMPLES.default);

      const numericTypeExamples = getExamplesForType(123);
      assert.ok(Array.isArray(numericTypeExamples));
      assert.deepStrictEqual(numericTypeExamples, PATTERN_EXAMPLES.default);

      const booleanTypeExamples = getExamplesForType(true);
      assert.ok(Array.isArray(booleanTypeExamples));
      assert.deepStrictEqual(booleanTypeExamples, PATTERN_EXAMPLES.default);
    });
  });

  describe('Data integrity and consistency', () => {
    test('should have consistent pattern names across constants', () => {
      // Check that patterns in VALID_PATTERNS are also in ALL_PATTERN_NAMES
      const validPatternKeys = Object.keys(VALID_PATTERNS);
      for (const pattern of validPatternKeys) {
        assert.ok(
          ALL_PATTERN_NAMES.includes(pattern),
          `Pattern ${pattern} from VALID_PATTERNS should be in ALL_PATTERN_NAMES`,
        );
      }
    });

    test('should have all categories represented in AVAILABLE_PATTERNS', () => {
      const categories = Object.keys(AVAILABLE_PATTERNS);
      assert.ok(categories.includes('core'));
      assert.ok(categories.includes('string'));
      assert.ok(categories.includes('array'));
      assert.ok(categories.includes('numeric'));
      assert.ok(categories.includes('date'));
      assert.ok(categories.includes('complex'));
    });

    test('should have examples for major pattern types', () => {
      const exampleTypes = Object.keys(PATTERN_EXAMPLES);
      assert.ok(exampleTypes.includes('string'));
      assert.ok(exampleTypes.includes('numeric'));
      assert.ok(exampleTypes.includes('array'));
      assert.ok(exampleTypes.includes('type'));
      assert.ok(exampleTypes.includes('date'));
      assert.ok(exampleTypes.includes('default'));
    });
  });

  describe('Edge cases and validation', () => {
    test('should handle special characters in pattern names', () => {
      // These should be invalid patterns
      assert.strictEqual(isValidPattern('match:type:string'), false); // Full pattern syntax
      assert.strictEqual(isValidPattern('type:string'), false); // Partial syntax
      assert.strictEqual(isValidPattern('regex:^test$'), false); // Regex with value
    });

    test('should handle array and object inputs gracefully', () => {
      assert.strictEqual(isValidPattern([]), false);
      assert.strictEqual(isValidPattern({}), false);
      assert.strictEqual(isValidPattern(['type']), false);
      
      assert.strictEqual(getPatternCategory([]), 'unknown');
      assert.strictEqual(getPatternCategory({}), 'unknown');
      assert.strictEqual(getPatternCategory(['type']), 'unknown');
      
      // Arrays and objects should return default examples, except when they coerce to valid keys
      assert.deepStrictEqual(getExamplesForType([]), PATTERN_EXAMPLES.default);
      assert.deepStrictEqual(getExamplesForType({}), PATTERN_EXAMPLES.default);
      // Array ['type'] coerces to string 'type' which is a valid key, so returns type examples
      assert.deepStrictEqual(getExamplesForType(['type']), PATTERN_EXAMPLES.type);
    });
  });
});
