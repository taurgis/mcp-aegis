/**
 * categories.test.js
 * Comprehensive test suite for shared categories module
 * Tests all category lookup functions and edge cases
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import {
  FEATURE_CATEGORIES,
  SUGGESTION_TYPES,
  COMMON_ALTERNATIVES,
  getCategoryDescription,
  getSuggestionTypeDescription,
  getAlternativesForCategory,
} from '../../src/test-engine/matchers/corrections/shared/categories.js';

describe('Shared Categories Module', () => {
  describe('Constants', () => {
    test('should have FEATURE_CATEGORIES defined', () => {
      assert.ok(typeof FEATURE_CATEGORIES === 'object');
      assert.ok(FEATURE_CATEGORIES.network);
      assert.ok(FEATURE_CATEGORIES.validation);
      assert.ok(FEATURE_CATEGORIES.security);
    });

    test('should have SUGGESTION_TYPES defined', () => {
      assert.ok(typeof SUGGESTION_TYPES === 'object');
      assert.ok(SUGGESTION_TYPES.unsupported_feature);
      assert.ok(SUGGESTION_TYPES.syntax_error);
      assert.ok(SUGGESTION_TYPES.naming_error);
    });

    test('should have COMMON_ALTERNATIVES defined', () => {
      assert.ok(typeof COMMON_ALTERNATIVES === 'object');
      assert.ok(Array.isArray(COMMON_ALTERNATIVES.network));
      assert.ok(Array.isArray(COMMON_ALTERNATIVES.validation));
      assert.ok(Array.isArray(COMMON_ALTERNATIVES.security));
    });
  });

  describe('getCategoryDescription', () => {
    test('should return correct description for known categories', () => {
      assert.strictEqual(
        getCategoryDescription('network'),
        'Network and HTTP-related features',
      );
      assert.strictEqual(
        getCategoryDescription('validation'),
        'Data validation and format checking',
      );
      assert.strictEqual(
        getCategoryDescription('security'),
        'Security and authentication features',
      );
    });

    test('should return default message for unknown categories', () => {
      // Testing lines 82-83: fallback for unknown category
      assert.strictEqual(
        getCategoryDescription('nonexistent'),
        'Unknown feature category',
      );
      assert.strictEqual(
        getCategoryDescription('invalid_category'),
        'Unknown feature category',
      );
      assert.strictEqual(
        getCategoryDescription(''),
        'Unknown feature category',
      );
    });
  });

  describe('getSuggestionTypeDescription', () => {
    test('should return correct description for known types', () => {
      assert.strictEqual(
        getSuggestionTypeDescription('unsupported_feature'),
        'Feature is not supported in MCP Aegis',
      );
      assert.strictEqual(
        getSuggestionTypeDescription('syntax_error'),
        'Incorrect syntax or pattern format',
      );
      assert.strictEqual(
        getSuggestionTypeDescription('naming_error'),
        'Pattern name misspelling or variation',
      );
    });

    test('should return default message for unknown types', () => {
      // Testing lines 89-90: fallback for unknown suggestion type
      assert.strictEqual(
        getSuggestionTypeDescription('nonexistent'),
        'Unknown suggestion type',
      );
      assert.strictEqual(
        getSuggestionTypeDescription('invalid_type'),
        'Unknown suggestion type',
      );
      assert.strictEqual(
        getSuggestionTypeDescription(''),
        'Unknown suggestion type',
      );
    });
  });

  describe('getAlternativesForCategory', () => {
    test('should return correct alternatives for known categories', () => {
      const networkAlternatives = getAlternativesForCategory('network');
      assert.ok(Array.isArray(networkAlternatives));
      assert.ok(networkAlternatives.length > 0);
      assert.ok(networkAlternatives.includes('Use regex patterns for URL validation'));

      const securityAlternatives = getAlternativesForCategory('security');
      assert.ok(Array.isArray(securityAlternatives));
      assert.ok(securityAlternatives.length > 0);
      assert.ok(securityAlternatives.includes('Use regex patterns for token structure validation'));
    });

    test('should return validation alternatives for unknown categories', () => {
      // Testing lines 96-97: fallback to validation alternatives
      const unknownAlternatives = getAlternativesForCategory('nonexistent');
      assert.ok(Array.isArray(unknownAlternatives));
      assert.deepStrictEqual(unknownAlternatives, COMMON_ALTERNATIVES.validation);

      const emptyAlternatives = getAlternativesForCategory('');
      assert.ok(Array.isArray(emptyAlternatives));
      assert.deepStrictEqual(emptyAlternatives, COMMON_ALTERNATIVES.validation);

      const invalidAlternatives = getAlternativesForCategory('invalid_category');
      assert.ok(Array.isArray(invalidAlternatives));
      assert.deepStrictEqual(invalidAlternatives, COMMON_ALTERNATIVES.validation);
    });
  });

  describe('Edge cases and validation', () => {
    test('should handle null and undefined inputs gracefully', () => {
      assert.strictEqual(getCategoryDescription(null), 'Unknown feature category');
      assert.strictEqual(getCategoryDescription(undefined), 'Unknown feature category');

      assert.strictEqual(getSuggestionTypeDescription(null), 'Unknown suggestion type');
      assert.strictEqual(getSuggestionTypeDescription(undefined), 'Unknown suggestion type');

      assert.deepStrictEqual(getAlternativesForCategory(null), COMMON_ALTERNATIVES.validation);
      assert.deepStrictEqual(getAlternativesForCategory(undefined), COMMON_ALTERNATIVES.validation);
    });

    test('should handle numeric and boolean inputs', () => {
      assert.strictEqual(getCategoryDescription(123), 'Unknown feature category');
      assert.strictEqual(getCategoryDescription(true), 'Unknown feature category');

      assert.strictEqual(getSuggestionTypeDescription(123), 'Unknown suggestion type');
      assert.strictEqual(getSuggestionTypeDescription(false), 'Unknown suggestion type');

      assert.deepStrictEqual(getAlternativesForCategory(123), COMMON_ALTERNATIVES.validation);
      assert.deepStrictEqual(getAlternativesForCategory(false), COMMON_ALTERNATIVES.validation);
    });
  });
});
