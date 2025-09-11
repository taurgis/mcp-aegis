/**
 * Test cases for Pattern Analyzer
 * Tests pattern-specific error detection and suggestions
 */

import assert from 'node:assert';
import { test, describe } from 'node:test';
import { analyzePatternSpecificErrors } from '../../src/test-engine/matchers/analyzers/patternAnalyzer.js';

describe('PatternAnalyzer', () => {
  describe('analyzePatternSpecificErrors', () => {
    test('should detect missing match: prefix for likely patterns', () => {
      const suggestions = analyzePatternSpecificErrors('arrayLength:5');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'missing_prefix' &&
        s.corrected === 'match:arrayLength:5',
      ));
      assert.ok(suggestions.some(s => s.message.includes('match:')));
    });

    test('should detect plural form errors - contains', () => {
      const suggestions = analyzePatternSpecificErrors('match:contain:test');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'pattern_name_error' &&
        s.corrected === 'match:contains:test',
      ));
      assert.ok(suggestions.some(s => s.message.includes('match:contains:')));
    });

    test('should detect plural form errors - startsWith', () => {
      const suggestions = analyzePatternSpecificErrors('match:startWith:hello');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'pattern_name_error' &&
        s.corrected === 'match:startsWith:hello',
      ));
      assert.ok(suggestions.some(s => s.message.includes('match:startsWith:')));
    });

    test('should detect plural form errors - endsWith', () => {
      const suggestions = analyzePatternSpecificErrors('match:endWith:world');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'pattern_name_error' &&
        s.corrected === 'match:endsWith:world',
      ));
      assert.ok(suggestions.some(s => s.message.includes('match:endsWith:')));
    });

    test('should detect missing colon after pattern names', () => {
      const suggestions = analyzePatternSpecificErrors('match:type');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'missing_colon' &&
        s.corrected === 'match:type:',
      ));
      assert.ok(suggestions.some(s => s.message.includes('colon')));
    });

    test('should detect incomplete arrayContains pattern', () => {
      const suggestions = analyzePatternSpecificErrors('match:arrayContains:');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'incomplete_pattern' &&
        s.corrected === 'match:arrayContains:fieldName:expectedValue',
      ));
      assert.ok(suggestions.some(s => s.message.includes('arrayContains needs')));
      assert.ok(suggestions.some(s => s.example && s.example.includes('match:arrayContains:')));
    });

    test('should detect invalid field path in extractField', () => {
      const suggestions = analyzePatternSpecificErrors('match:extractField:invalidpath');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'invalid_field_path' &&
        s.corrected.includes('extractField:invalidpath.*'),
      ));
      assert.ok(suggestions.some(s => s.message.includes('dot notation')));
      assert.ok(suggestions.some(s => s.example && s.example.includes('tools.*.name')));
    });

    test('should detect length patterns without numbers', () => {
      const suggestions = analyzePatternSpecificErrors('match:length:notanumber');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'invalid_length' &&
        s.corrected === 'match:length:0',
      ));
      assert.ok(suggestions.some(s => s.message.includes('requires a number')));
    });

    test('should detect invalid date format in dateAfter', () => {
      const suggestions = analyzePatternSpecificErrors('match:dateAfter:invalid-date');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'invalid_date_format' &&
        s.corrected === 'match:dateAfter:2023-01-01',
      ));
      assert.ok(suggestions.some(s => s.message.includes('ISO date format')));
      assert.ok(suggestions.some(s => s.example && s.example.includes('2023-01-01')));
    });

    test('should detect invalid date format in dateBefore', () => {
      const suggestions = analyzePatternSpecificErrors('match:dateBefore:bad-date-format');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'invalid_date_format' &&
        s.corrected === 'match:dateBefore:2023-01-01',
      ));
      assert.ok(suggestions.some(s => s.message.includes('ISO date format')));
    });

    test('should detect invalid date format in dateEquals', () => {
      const suggestions = analyzePatternSpecificErrors('match:dateEquals:wrong-format');

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'invalid_date_format' &&
        s.corrected === 'match:dateEquals:2023-01-01',
      ));
      assert.ok(suggestions.some(s => s.message.includes('ISO date format')));
    });

    test('should not flag valid patterns', () => {
      const validPatterns = [
        'match:arrayLength:5',
        'match:contains:test',
        'match:startsWith:hello',
        'match:endsWith:world',
        'match:type:string',
        'match:extractField:tools.*.name',
        'match:dateAfter:2023-01-01',
        'match:dateBefore:2024-12-31',
        'match:dateEquals:2023-06-15T14:30:00.000Z',
      ];

      for (const pattern of validPatterns) {
        const suggestions = analyzePatternSpecificErrors(pattern);
        // Should have no or minimal suggestions for valid patterns
        assert.ok(suggestions.length === 0 || suggestions.every(s =>
          !s.type.includes('error') && !s.message.includes('invalid'),
        ), `Valid pattern ${pattern} should not generate error suggestions`);
      }
    });

    test('should handle complex patterns with multiple issues', () => {
      const suggestions = analyzePatternSpecificErrors('contain:test');

      // Should detect both missing prefix and plural form error
      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s => s.type === 'missing_prefix'));
    });

    test('should handle patterns that do not look like patterns', () => {
      const suggestions = analyzePatternSpecificErrors('just-a-string');

      // Should not suggest adding match: prefix for random strings
      assert.ok(suggestions.length === 0 || !suggestions.some(s => s.type === 'missing_prefix'));
    });

    test('should handle arrayContains with proper format', () => {
      const suggestions = analyzePatternSpecificErrors('match:arrayContains:value');

      // Should not flag complete arrayContains patterns
      assert.ok(!suggestions.some(s => s.type === 'incomplete_pattern'));
    });

    test('should handle extractField with valid dot notation', () => {
      const suggestions = analyzePatternSpecificErrors('match:extractField:tools.*.name');

      // Should not flag valid extractField patterns
      assert.ok(!suggestions.some(s => s.type === 'invalid_field_path'));
    });

    test('should handle length patterns with valid numbers', () => {
      const suggestions = analyzePatternSpecificErrors('match:length:5');

      // Should not flag valid length patterns
      assert.ok(!suggestions.some(s => s.type === 'invalid_length'));
    });

    test('should handle date patterns with valid ISO dates', () => {
      const validDatePatterns = [
        'match:dateAfter:2023-01-01',
        'match:dateBefore:2024-12-31',
        'match:dateEquals:2023-06-15T14:30:00.000Z',
      ];

      for (const pattern of validDatePatterns) {
        const suggestions = analyzePatternSpecificErrors(pattern);
        assert.ok(!suggestions.some(s => s.type === 'invalid_date_format'),
          `Valid date pattern ${pattern} should not be flagged`);
      }
    });
  });
});
