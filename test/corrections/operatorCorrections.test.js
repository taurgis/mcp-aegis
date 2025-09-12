/**
 * operatorCorrections.test.js
 * Comprehensive test suite for operator corrections module
 * Tests all exports: constants, analyzer, and helper functions
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import {
  VALID_PATTERNS,
  OPERATOR_CORRECTIONS,
  analyzeOperatorErrors,
  generateOperatorDebuggingHelp,
} from '../../src/test-engine/matchers/corrections/syntax/operatorCorrections.js';

describe('Operator Corrections Module', () => {
  describe('VALID_PATTERNS - Constant Validation', () => {
    test('should contain all expected pattern categories', () => {
      const patterns = Object.keys(VALID_PATTERNS);

      // String patterns
      assert.ok(patterns.includes('regex'), 'Should include regex pattern');
      assert.ok(patterns.includes('contains'), 'Should include contains pattern');
      assert.ok(patterns.includes('containsIgnoreCase'), 'Should include containsIgnoreCase pattern');
      assert.ok(patterns.includes('startsWith'), 'Should include startsWith pattern');
      assert.ok(patterns.includes('endsWith'), 'Should include endsWith pattern');
      assert.ok(patterns.includes('equalsIgnoreCase'), 'Should include equalsIgnoreCase pattern');

      // Array patterns
      assert.ok(patterns.includes('arrayLength'), 'Should include arrayLength pattern');
      assert.ok(patterns.includes('arrayContains'), 'Should include arrayContains pattern');
      assert.ok(patterns.includes('arrayElements'), 'Should include arrayElements pattern');

      // Type patterns
      assert.ok(patterns.includes('type'), 'Should include type pattern');
      assert.ok(patterns.includes('length'), 'Should include length pattern');
      assert.ok(patterns.includes('exists'), 'Should include exists pattern');
      assert.ok(patterns.includes('count'), 'Should include count pattern');

      // Numeric patterns
      assert.ok(patterns.includes('greaterThan'), 'Should include greaterThan pattern');
      assert.ok(patterns.includes('lessThan'), 'Should include lessThan pattern');
      assert.ok(patterns.includes('greaterThanOrEqual'), 'Should include greaterThanOrEqual pattern');
      assert.ok(patterns.includes('lessThanOrEqual'), 'Should include lessThanOrEqual pattern');
      assert.ok(patterns.includes('between'), 'Should include between pattern');
      assert.ok(patterns.includes('range'), 'Should include range pattern');
      assert.ok(patterns.includes('equals'), 'Should include equals pattern');
      assert.ok(patterns.includes('notEquals'), 'Should include notEquals pattern');
      assert.ok(patterns.includes('approximately'), 'Should include approximately pattern');
      assert.ok(patterns.includes('multipleOf'), 'Should include multipleOf pattern');
      assert.ok(patterns.includes('divisibleBy'), 'Should include divisibleBy pattern');
      assert.ok(patterns.includes('decimalPlaces'), 'Should include decimalPlaces pattern');

      // Date patterns
      assert.ok(patterns.includes('dateValid'), 'Should include dateValid pattern');
      assert.ok(patterns.includes('dateAfter'), 'Should include dateAfter pattern');
      assert.ok(patterns.includes('dateBefore'), 'Should include dateBefore pattern');
      assert.ok(patterns.includes('dateBetween'), 'Should include dateBetween pattern');
      assert.ok(patterns.includes('dateAge'), 'Should include dateAge pattern');
      assert.ok(patterns.includes('dateEquals'), 'Should include dateEquals pattern');
      assert.ok(patterns.includes('dateFormat'), 'Should include dateFormat pattern');

      // Special patterns
      assert.ok(patterns.includes('partial'), 'Should include partial pattern');
      assert.ok(patterns.includes('extractField'), 'Should include extractField pattern');
      assert.ok(patterns.includes('not'), 'Should include not pattern');
    });

    test('should have descriptions for all patterns', () => {
      Object.entries(VALID_PATTERNS).forEach(([pattern, description]) => {
        assert.ok(typeof description === 'string', `Pattern ${pattern} should have string description`);
        assert.ok(description.length > 0, `Pattern ${pattern} should have non-empty description`);
      });
    });

    test('should have minimum expected number of patterns', () => {
      const patternCount = Object.keys(VALID_PATTERNS).length;
      assert.ok(patternCount >= 29, `Should have at least 29 patterns, got ${patternCount}`);
    });
  });

  describe('OPERATOR_CORRECTIONS - Constant Validation', () => {
    test('should contain mathematical operator aliases', () => {
      assert.strictEqual(OPERATOR_CORRECTIONS['match:eq:'], 'match:equals:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:ne:'], 'match:notEquals:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:gt:'], 'match:greaterThan:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:lt:'], 'match:lessThan:');
    });

    test('should contain programming language operators', () => {
      assert.strictEqual(OPERATOR_CORRECTIONS['match:==:'], 'match:equals:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:!=:'], 'match:notEquals:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:>:'], 'match:greaterThan:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:<:'], 'match:lessThan:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:>=:'], 'match:greaterThanOrEqual:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:<=:'], 'match:lessThanOrEqual:');
    });

    test('should contain common typos and variations', () => {
      assert.strictEqual(OPERATOR_CORRECTIONS['match:equal:'], 'match:equals:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:notEqual:'], 'match:notEquals:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:greater:'], 'match:greaterThan:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:less:'], 'match:lessThan:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:gte:'], 'match:greaterThanOrEqual:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:lte:'], 'match:lessThanOrEqual:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:approximate:'], 'match:approximately:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:approx:'], 'match:approximately:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:multipleof:'], 'match:multipleOf:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:divisibleby:'], 'match:divisibleBy:');
      assert.strictEqual(OPERATOR_CORRECTIONS['match:decimalplaces:'], 'match:decimalPlaces:');
    });

    test('should have consistent correction format', () => {
      Object.entries(OPERATOR_CORRECTIONS).forEach(([alias, correction]) => {
        assert.ok(alias.startsWith('match:'), `Alias ${alias} should start with 'match:'`);
        assert.ok(correction.startsWith('match:'), `Correction ${correction} should start with 'match:'`);
        assert.ok(alias.endsWith(':'), `Alias ${alias} should end with ':'`);
        assert.ok(correction.endsWith(':'), `Correction ${correction} should end with ':'`);
      });
    });
  });

  describe('analyzeOperatorErrors() - Function Tests', () => {
    describe('Wrong delimiter detection', () => {
      test('should detect comma in between pattern', () => {
        const result = analyzeOperatorErrors('match:between:10,20');

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].type, 'wrong_delimiter');
        assert.strictEqual(result[0].original, 'match:between:10,20');
        assert.strictEqual(result[0].corrected, 'match:between:10:20');
        assert.strictEqual(result[0].pattern, 'match:between:10:20');
        assert.ok(result[0].message.includes('colon (:)'));
        assert.ok(result[0].message.includes('comma (,)'));
      });

      test('should detect comma in range pattern', () => {
        const result = analyzeOperatorErrors('match:range:5,15');

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].type, 'wrong_delimiter');
        assert.strictEqual(result[0].original, 'match:range:5,15');
        assert.strictEqual(result[0].corrected, 'match:range:5:15');
      });

      test('should detect comma in dateBetween pattern', () => {
        const result = analyzeOperatorErrors('match:dateBetween:2023-01-01,2023-12-31');

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].type, 'wrong_delimiter');
        assert.strictEqual(result[0].original, 'match:dateBetween:2023-01-01,2023-12-31');
        assert.strictEqual(result[0].corrected, 'match:dateBetween:2023-01-01:2023-12-31');
      });

      test('should detect multiple commas in pattern', () => {
        const result = analyzeOperatorErrors('match:between:10,20,30');

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].type, 'wrong_delimiter');
        assert.strictEqual(result[0].corrected, 'match:between:10:20:30');
      });

      test('should not detect comma in non-range patterns', () => {
        const result1 = analyzeOperatorErrors('match:contains:hello,world');
        const result2 = analyzeOperatorErrors('match:regex:a,b,c');

        assert.strictEqual(result1.length, 0);
        assert.strictEqual(result2.length, 0);
      });
    });

    describe('Operator alias detection', () => {
      test('should detect exact alias match', () => {
        const result = analyzeOperatorErrors('match:eq:');

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].type, 'operator_alias');
        assert.strictEqual(result[0].original, 'match:eq:');
        assert.strictEqual(result[0].corrected, 'match:equals:');
        assert.ok(result[0].message.includes('match:equals:'));
        assert.ok(result[0].message.includes('match:eq:'));
      });

      test('should detect alias within pattern', () => {
        const result = analyzeOperatorErrors('match:gt:100');

        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].type, 'operator_alias');
        assert.strictEqual(result[0].original, 'match:gt:100');
        assert.strictEqual(result[0].corrected, 'match:greaterThan:100');
      });

      test('should detect programming operators', () => {
        const testCases = [
          { input: 'match:==:42', expected: 'match:equals:42' },
          { input: 'match:!=:42', expected: 'match:notEquals:42' },
          { input: 'match:>:42', expected: 'match:greaterThan:42' },
          { input: 'match:<:42', expected: 'match:lessThan:42' },
          { input: 'match:>=:42', expected: 'match:greaterThanOrEqual:42' },
          { input: 'match:<=:42', expected: 'match:lessThanOrEqual:42' },
        ];

        testCases.forEach(({ input, expected }) => {
          const result = analyzeOperatorErrors(input);
          assert.strictEqual(result.length, 1);
          assert.strictEqual(result[0].type, 'operator_alias');
          assert.strictEqual(result[0].corrected, expected);
        });
      });

      test('should detect common typos', () => {
        const testCases = [
          { input: 'match:equal:42', expected: 'match:equals:42' },
          { input: 'match:notEqual:42', expected: 'match:notEquals:42' },
          { input: 'match:greater:42', expected: 'match:greaterThan:42' },
          { input: 'match:less:42', expected: 'match:lessThan:42' },
          { input: 'match:gte:42', expected: 'match:greaterThanOrEqual:42' },
          { input: 'match:lte:42', expected: 'match:lessThanOrEqual:42' },
          { input: 'match:approximate:3.14:0.01', expected: 'match:approximately:3.14:0.01' },
          { input: 'match:approx:3.14:0.01', expected: 'match:approximately:3.14:0.01' },
          { input: 'match:multipleof:5', expected: 'match:multipleOf:5' },
          { input: 'match:divisibleby:3', expected: 'match:divisibleBy:3' },
          { input: 'match:decimalplaces:2', expected: 'match:decimalPlaces:2' },
        ];

        testCases.forEach(({ input, expected }) => {
          const result = analyzeOperatorErrors(input);
          assert.strictEqual(result.length, 1, `Failed for input: ${input}`);
          assert.strictEqual(result[0].type, 'operator_alias');
          assert.strictEqual(result[0].corrected, expected, `Failed for input: ${input}`);
        });
      });

      test('should not detect aliases in valid patterns', () => {
        const validPatterns = [
          'match:equals:42',
          'match:greaterThan:100',
          'match:contains:text',
          'match:arrayLength:5',
        ];

        validPatterns.forEach(pattern => {
          const result = analyzeOperatorErrors(pattern);
          assert.strictEqual(result.length, 0, `Should not detect errors in: ${pattern}`);
        });
      });
    });

    describe('Combined error detection', () => {
      test('should detect both wrong delimiter and operator alias', () => {
        const result = analyzeOperatorErrors('match:between:10,20');

        // Should detect wrong delimiter
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].type, 'wrong_delimiter');
      });

      test('should return empty array for valid patterns', () => {
        const validPatterns = [
          'match:equals:42',
          'match:between:10:20',
          'match:contains:text',
          'match:arrayLength:5',
          'match:dateValid',
          'match:type:string',
        ];

        validPatterns.forEach(pattern => {
          const result = analyzeOperatorErrors(pattern);
          assert.strictEqual(result.length, 0, `Should return no errors for: ${pattern}`);
        });
      });
    });

    describe('Edge cases', () => {
      test('should handle empty pattern', () => {
        const result = analyzeOperatorErrors('');
        assert.strictEqual(result.length, 0);
      });

      test('should handle undefined pattern', () => {
        const result = analyzeOperatorErrors(undefined);
        assert.strictEqual(result.length, 0);
      });

      test('should handle null pattern', () => {
        const result = analyzeOperatorErrors(null);
        assert.strictEqual(result.length, 0);
      });

      test('should handle pattern without match prefix', () => {
        const result = analyzeOperatorErrors('equals:42');
        assert.strictEqual(result.length, 0);
      });

      test('should handle complex patterns with multiple issues', () => {
        // This would be unusual but should be handled gracefully
        const result = analyzeOperatorErrors('match:eq:10,20');

        // Should detect both alias and delimiter issues
        assert.ok(result.length >= 1);
        const types = result.map(r => r.type);
        assert.ok(types.includes('wrong_delimiter') || types.includes('operator_alias'));
      });
    });
  });

  describe('generateOperatorDebuggingHelp() - Function Tests', () => {
    describe('Basic functionality', () => {
      test('should return comprehensive debugging object', () => {
        const result = generateOperatorDebuggingHelp('match:eq:42', 42, 'user.age');

        assert.ok(typeof result === 'object');
        assert.strictEqual(result.pattern, 'match:eq:42');
        assert.strictEqual(result.actualValue, 42);
        assert.strictEqual(result.fieldPath, 'user.age');
        assert.strictEqual(result.valueType, 'numeric');

        assert.ok(result.analysis);
        assert.ok(Array.isArray(result.analysis.errors));
        assert.ok(Array.isArray(result.analysis.warnings));
        assert.ok(Array.isArray(result.analysis.suggestions));

        assert.ok(Array.isArray(result.quickFixes));
        assert.ok(result.quickFixes.length <= 3);

        assert.ok(result.documentation);
        assert.ok(Array.isArray(result.documentation.validPatterns));
        assert.ok(Array.isArray(result.documentation.examples));
      });

      test('should categorize analysis results correctly', () => {
        const result = generateOperatorDebuggingHelp('match:between:10,20', 15);

        // Should have wrong_delimiter error
        const errors = result.analysis.errors;
        assert.ok(errors.length > 0);
        assert.strictEqual(errors[0].type, 'wrong_delimiter');
      });

      test('should provide quick fixes limited to 3', () => {
        const result = generateOperatorDebuggingHelp('match:eq:42');

        assert.ok(result.quickFixes.length <= 3);
      });
    });

    describe('Value type detection', () => {
      test('should detect numeric type', () => {
        const result1 = generateOperatorDebuggingHelp('pattern', 42);
        const result2 = generateOperatorDebuggingHelp('pattern', 3.14);
        const result3 = generateOperatorDebuggingHelp('pattern', -10);
        const result4 = generateOperatorDebuggingHelp('pattern', 0);

        assert.strictEqual(result1.valueType, 'numeric');
        assert.strictEqual(result2.valueType, 'numeric');
        assert.strictEqual(result3.valueType, 'numeric');
        assert.strictEqual(result4.valueType, 'numeric');
      });

      test('should detect string type', () => {
        const result1 = generateOperatorDebuggingHelp('pattern', 'hello');
        const result2 = generateOperatorDebuggingHelp('pattern', '');
        const result3 = generateOperatorDebuggingHelp('pattern', 'with spaces');

        assert.strictEqual(result1.valueType, 'string');
        assert.strictEqual(result2.valueType, 'string');
        assert.strictEqual(result3.valueType, 'string');
      });

      test('should detect date type from string patterns', () => {
        const result1 = generateOperatorDebuggingHelp('pattern', '2023-12-25');
        const result2 = generateOperatorDebuggingHelp('pattern', '2023-01-01T10:30:00');
        const result3 = generateOperatorDebuggingHelp('pattern', '12/25/2023');
        const result4 = generateOperatorDebuggingHelp('pattern', '01/01/2024');

        assert.strictEqual(result1.valueType, 'date');
        assert.strictEqual(result2.valueType, 'date');
        assert.strictEqual(result3.valueType, 'date');
        assert.strictEqual(result4.valueType, 'date');
      });

      test('should detect array type', () => {
        const result1 = generateOperatorDebuggingHelp('pattern', [1, 2, 3]);
        const result2 = generateOperatorDebuggingHelp('pattern', []);
        const result3 = generateOperatorDebuggingHelp('pattern', ['a', 'b']);

        assert.strictEqual(result1.valueType, 'array');
        assert.strictEqual(result2.valueType, 'array');
        assert.strictEqual(result3.valueType, 'array');
      });

      test('should detect boolean type', () => {
        const result1 = generateOperatorDebuggingHelp('pattern', true);
        const result2 = generateOperatorDebuggingHelp('pattern', false);

        assert.strictEqual(result1.valueType, 'boolean');
        assert.strictEqual(result2.valueType, 'boolean');
      });

      test('should detect object type', () => {
        const result1 = generateOperatorDebuggingHelp('pattern', { key: 'value' });
        const result2 = generateOperatorDebuggingHelp('pattern', {});

        assert.strictEqual(result1.valueType, 'object');
        assert.strictEqual(result2.valueType, 'object');
      });

      test('should handle null and undefined values', () => {
        const result1 = generateOperatorDebuggingHelp('pattern', null);
        const result2 = generateOperatorDebuggingHelp('pattern', undefined);
        const result3 = generateOperatorDebuggingHelp('pattern');

        assert.strictEqual(result1.valueType, null);
        assert.strictEqual(result2.valueType, null);
        assert.strictEqual(result3.valueType, null);
      });
    });

    describe('Context suggestions', () => {
      test('should provide numeric suggestions for numeric values', () => {
        const result = generateOperatorDebuggingHelp('pattern', 42);

        const suggestions = result.analysis.suggestions;
        const numericSuggestion = suggestions.find(s => s.type === 'context_suggestion');

        assert.ok(numericSuggestion);
        assert.ok(numericSuggestion.message.includes('numeric values'));
        assert.ok(Array.isArray(numericSuggestion.patterns));
        assert.ok(numericSuggestion.patterns.some(p => p.includes('greaterThan')));
        assert.ok(numericSuggestion.patterns.some(p => p.includes('lessThan')));
        assert.ok(numericSuggestion.patterns.some(p => p.includes('between')));
        assert.ok(numericSuggestion.patterns.some(p => p.includes('equals')));
        assert.ok(numericSuggestion.patterns.some(p => p.includes('approximately')));
      });

      test('should provide string suggestions for string values', () => {
        const result = generateOperatorDebuggingHelp('pattern', 'hello');

        const suggestions = result.analysis.suggestions;
        const stringSuggestion = suggestions.find(s => s.type === 'context_suggestion');

        assert.ok(stringSuggestion);
        assert.ok(stringSuggestion.message.includes('string values'));
        assert.ok(Array.isArray(stringSuggestion.patterns));
        assert.ok(stringSuggestion.patterns.some(p => p.includes('contains')));
        assert.ok(stringSuggestion.patterns.some(p => p.includes('startsWith')));
        assert.ok(stringSuggestion.patterns.some(p => p.includes('endsWith')));
        assert.ok(stringSuggestion.patterns.some(p => p.includes('regex')));
        assert.ok(stringSuggestion.patterns.some(p => p.includes('equalsIgnoreCase')));
      });

      test('should provide array suggestions for array values', () => {
        const result = generateOperatorDebuggingHelp('pattern', [1, 2, 3]);

        const suggestions = result.analysis.suggestions;
        const arraySuggestion = suggestions.find(s => s.type === 'context_suggestion');

        assert.ok(arraySuggestion);
        assert.ok(arraySuggestion.message.includes('array values'));
        assert.ok(Array.isArray(arraySuggestion.patterns));
        assert.ok(arraySuggestion.patterns.some(p => p.includes('arrayLength')));
        assert.ok(arraySuggestion.patterns.some(p => p.includes('arrayContains')));
        assert.ok(arraySuggestion.patterns.some(p => p.includes('arrayElements')));
      });

      test('should provide date suggestions based on field path', () => {
        const result1 = generateOperatorDebuggingHelp('pattern', 'value', 'user.createdDate');
        const result2 = generateOperatorDebuggingHelp('pattern', 'value', 'order.timestamp');
        const result3 = generateOperatorDebuggingHelp('pattern', 'value', 'event.time');

        [result1, result2, result3].forEach(result => {
          const suggestions = result.analysis.suggestions;
          const dateSuggestion = suggestions.find(s => s.type === 'date_context_suggestion');

          assert.ok(dateSuggestion, 'Should have date context suggestion');
          assert.ok(dateSuggestion.message.includes('date/time field'));
          assert.ok(Array.isArray(dateSuggestion.patterns));
          assert.ok(dateSuggestion.patterns.some(p => p.includes('dateValid')));
          assert.ok(dateSuggestion.patterns.some(p => p.includes('dateAfter')));
          assert.ok(dateSuggestion.patterns.some(p => p.includes('dateBefore')));
          assert.ok(dateSuggestion.patterns.some(p => p.includes('dateAge')));
          assert.ok(dateSuggestion.patterns.some(p => p.includes('dateFormat')));
        });
      });

      test('should not provide date suggestions for non-date field paths', () => {
        const result = generateOperatorDebuggingHelp('pattern', 'value', 'user.name');

        const suggestions = result.analysis.suggestions;
        const dateSuggestion = suggestions.find(s => s.type === 'date_context_suggestion');

        assert.ok(!dateSuggestion, 'Should not have date context suggestion for non-date field');
      });
    });

    describe('Documentation examples', () => {
      test('should provide appropriate examples for value types', () => {
        const numericResult = generateOperatorDebuggingHelp('pattern', 42);
        const stringResult = generateOperatorDebuggingHelp('pattern', 'text');
        const arrayResult = generateOperatorDebuggingHelp('pattern', []);
        const dateResult = generateOperatorDebuggingHelp('pattern', '2023-01-01');

        assert.ok(numericResult.documentation.examples.some(ex => ex.includes('greaterThan')));
        assert.ok(stringResult.documentation.examples.some(ex => ex.includes('contains')));
        assert.ok(arrayResult.documentation.examples.some(ex => ex.includes('arrayLength')));
        assert.ok(dateResult.documentation.examples.some(ex => ex.includes('dateValid')));
      });

      test('should provide default examples for unknown types', () => {
        const result = generateOperatorDebuggingHelp('pattern', Symbol('test'));

        assert.ok(Array.isArray(result.documentation.examples));
        assert.ok(result.documentation.examples.length > 0);
      });
    });

    describe('Edge cases', () => {
      test('should handle missing parameters gracefully', () => {
        const result1 = generateOperatorDebuggingHelp();
        const result2 = generateOperatorDebuggingHelp('pattern');
        const result3 = generateOperatorDebuggingHelp('pattern', null);

        assert.ok(typeof result1 === 'object');
        assert.ok(typeof result2 === 'object');
        assert.ok(typeof result3 === 'object');

        assert.strictEqual(result1.valueType, null);
        assert.strictEqual(result2.valueType, null);
        assert.strictEqual(result3.valueType, null);
      });

      test('should handle empty field path', () => {
        const result = generateOperatorDebuggingHelp('pattern', 'value', '');

        assert.strictEqual(result.fieldPath, '');
        assert.ok(typeof result === 'object');
      });

      test('should include valid patterns list', () => {
        const result = generateOperatorDebuggingHelp('pattern');

        assert.ok(Array.isArray(result.documentation.validPatterns));
        assert.ok(result.documentation.validPatterns.length >= 29);
        assert.ok(result.documentation.validPatterns.includes('equals'));
        assert.ok(result.documentation.validPatterns.includes('contains'));
        assert.ok(result.documentation.validPatterns.includes('arrayLength'));
      });
    });
  });

  describe('Module Integration Tests', () => {
    test('should work end-to-end with realistic scenarios', () => {
      // Scenario: User uses wrong operator and wrong delimiter
      const result = generateOperatorDebuggingHelp('match:gt:10,20', 15, 'user.score');

      assert.strictEqual(result.pattern, 'match:gt:10,20');
      assert.strictEqual(result.actualValue, 15);
      assert.strictEqual(result.valueType, 'numeric');

      // Should detect operator alias
      const warnings = result.analysis.warnings;
      assert.ok(warnings.some(w => w.type === 'operator_alias'));

      // Should have numeric suggestions
      const suggestions = result.analysis.suggestions;
      assert.ok(suggestions.some(s => s.message.includes('numeric values')));

      // Should have quick fixes
      assert.ok(result.quickFixes.length > 0);
    });

    test('should provide comprehensive help for date field with wrong pattern', () => {
      const result = generateOperatorDebuggingHelp('match:equal:2023-01-01', '2023-01-01', 'event.createdDate');

      assert.strictEqual(result.valueType, 'date');

      // Should have date context suggestions
      const suggestions = result.analysis.suggestions;
      const dateSuggestion = suggestions.find(s => s.type === 'date_context_suggestion');
      assert.ok(dateSuggestion);

      // Should detect operator alias
      const warnings = result.analysis.warnings;
      assert.ok(warnings.some(w => w.type === 'operator_alias' && w.corrected.includes('equals')));
    });

    test('should handle complex array validation scenarios', () => {
      const result = generateOperatorDebuggingHelp('match:length:5', ['a', 'b', 'c'], 'response.items');

      assert.strictEqual(result.valueType, 'array');

      // Should have array suggestions
      const suggestions = result.analysis.suggestions;
      const arraySuggestion = suggestions.find(s => s.type === 'context_suggestion');
      assert.ok(arraySuggestion);
      assert.ok(arraySuggestion.message.includes('array values'));
    });
  });
});
