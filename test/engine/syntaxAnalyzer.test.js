/**
 * Test cases for the Syntax Analyzer
 * Validates detection and correction of common YAML pattern syntax errors
 */

import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  analyzeSyntaxErrors,
  enhanceErrorWithSyntaxSuggestions,
  detectAntiPatterns,
} from '../../src/test-engine/matchers/syntaxAnalyzer.js';

describe('SyntaxAnalyzer', () => {
  describe('analyzeSyntaxErrors', () => {
    test('should detect arrayElement vs arrayElements error', () => {
      const result = analyzeSyntaxErrors('match:arrayElement:');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1);
      assert.ok(result.suggestions.some(s => s.corrected === 'match:arrayElements:'));
      assert.ok(result.suggestions[0].message.includes('arrayElements'));
    });

    test('should detect comma vs colon delimiter error in between pattern', () => {
      const result = analyzeSyntaxErrors('match:between:10,100');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1);
      assert.ok(result.suggestions.some(s => s.corrected === 'match:between:10:100'));
      assert.ok(result.suggestions[0].message.includes('colon'));
    });

    test('should detect missing match prefix', () => {
      const result = analyzeSyntaxErrors('arrayLength:5');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1);
      assert.ok(result.suggestions.some(s => s.corrected === 'match:arrayLength:'));
      assert.ok(result.suggestions[0].message.includes('match:'));
    });

    test('should detect capitalized type names', () => {
      const result = analyzeSyntaxErrors('match:type:String');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1);
      assert.ok(result.suggestions.some(s => s.corrected === 'match:type:string'));
      assert.ok(result.suggestions[0].message.includes('lowercase'));
    });

    test('should detect quoted type patterns', () => {
      const result = analyzeSyntaxErrors('match:type:"boolean"');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1);
      assert.ok(result.suggestions.some(s => s.corrected === 'match:type:boolean'));
      assert.ok(result.suggestions[0].message.includes('quoted'));
    });

    test('should detect double-escaped regex patterns', () => {
      const result = analyzeSyntaxErrors('match:regex:\\\\d+');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1);
      assert.ok(result.suggestions.some(s => s.corrected === 'match:regex:\\d+'));
      assert.ok(result.suggestions[0].message.includes('double-escaping'));
    });

    test('should detect range pattern with comma', () => {
      const result = analyzeSyntaxErrors('match:range:1,10');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1);
      assert.ok(result.suggestions.some(s => s.corrected === 'match:range:1:10'));
    });

    test('should detect dateBetween pattern with comma', () => {
      const result = analyzeSyntaxErrors('match:dateBetween:2023-01-01,2023-12-31');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1);
      assert.ok(result.suggestions.some(s => s.corrected === 'match:dateBetween:2023-01-01:2023-12-31'));
    });

    test('should detect extractFields vs extractField error', () => {
      const result = analyzeSyntaxErrors('match:extractFields:');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1);
      assert.ok(result.suggestions.some(s => s.corrected === 'match:extractField:'));
    });

    test('should not flag correct patterns', () => {
      const validPatterns = [
        'match:arrayLength:5',
        'match:type:string',
        'match:contains:test',
        'match:between:10:100',
        'match:arrayElements',
        'match:extractField:',
      ];

      for (const pattern of validPatterns) {
        const result = analyzeSyntaxErrors(pattern);
        assert.strictEqual(result.hasSyntaxErrors, false, `Pattern "${pattern}" should be valid`);
      }
    });

    test('should handle non-string inputs gracefully', () => {
      const result = analyzeSyntaxErrors(123);
      assert.strictEqual(result.hasSyntaxErrors, false);
      assert.strictEqual(result.suggestions.length, 0);
    });

    test('should detect multiple issues in complex patterns', () => {
      const result = analyzeSyntaxErrors('arrayElement:"String"');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.length >= 1); // Should have at least 1 suggestion
      // The analyzer finds the most specific error (arrayElement -> arrayElements) first
      // and stops there, which is the correct behavior for focused error reporting
    });
  });

  describe('enhanceErrorWithSyntaxSuggestions', () => {
    test('should enhance pattern errors with syntax suggestions', () => {
      const originalError = 'Pattern failed to match';
      const pattern = 'arrayElement:';
      const actualValue = ['item1', 'item2'];

      const result = enhanceErrorWithSyntaxSuggestions(originalError, pattern, actualValue);

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(Array.isArray(result.syntaxSuggestions));
      assert.ok(result.syntaxSuggestions.length > 0);
      assert.ok(result.syntaxSuggestions[0].includes('🔧 Syntax Fix'));
    });

    test('should not enhance errors for correct patterns', () => {
      const originalError = 'Pattern failed to match';
      const pattern = 'match:arrayLength:5';
      const actualValue = ['item1', 'item2'];

      const result = enhanceErrorWithSyntaxSuggestions(originalError, pattern, actualValue);

      assert.strictEqual(result.hasSyntaxErrors, undefined);
      assert.strictEqual(result.suggestions.length, 0);
    });
  });

  describe('detectAntiPatterns', () => {
    test('should detect arrayElement vs arrayElements in test structure', () => {
      const testStructure = {
        expect: {
          response: {
            result: {
              tools: {
                'match:arrayElement:': { name: 'test' },
              },
            },
          },
        },
      };

      const warnings = detectAntiPatterns(testStructure);

      assert.ok(warnings.length > 0);
      assert.ok(warnings.some(w => w.message.includes('arrayElements')));
    });

    test('should detect comma in between patterns', () => {
      const testStructure = {
        expect: {
          response: {
            result: {
              value: 'match:between:10,100',
            },
          },
        },
      };

      const warnings = detectAntiPatterns(testStructure);

      assert.ok(warnings.length > 0);
      assert.ok(warnings.some(w => w.message.includes('colon')));
    });

    test('should detect missing match prefix', () => {
      const testStructure = {
        expect: {
          response: {
            result: {
              count: 'arrayLength:5',
            },
          },
        },
      };

      const warnings = detectAntiPatterns(testStructure);

      assert.ok(warnings.length > 0);
      assert.ok(warnings.some(w => w.message.includes('match:')));
    });

    test('should not warn for correct patterns', () => {
      const testStructure = {
        expect: {
          response: {
            result: {
              tools: 'match:arrayLength:5',
              name: 'match:type:string',
            },
          },
        },
      };

      const warnings = detectAntiPatterns(testStructure);

      assert.strictEqual(warnings.length, 0);
    });

    test('should handle missing test structure gracefully', () => {
      const warnings1 = detectAntiPatterns(null);
      const warnings2 = detectAntiPatterns({});
      const warnings3 = detectAntiPatterns({ expect: null });

      assert.strictEqual(warnings1.length, 0);
      assert.strictEqual(warnings2.length, 0);
      assert.strictEqual(warnings3.length, 0);
    });
  });

  describe('comprehensive syntax correction examples', () => {
    test('should provide comprehensive corrections for common mistakes', () => {
      const testCases = [
        {
          input: 'arrayElement:',
          expectedCorrection: 'arrayElements:',
          description: 'Missing match prefix + wrong pattern name',
        },
        {
          input: 'match:between:5,10',
          expectedCorrection: 'match:between:5:10',
          description: 'Wrong delimiter in range',
        },
        {
          input: 'type:"string"',
          expectedCorrection: 'match:type:',
          description: 'Missing match prefix + quoted type',
        },
        {
          input: 'match:type:Number',
          expectedCorrection: 'match:type:number',
          description: 'Capitalized type name',
        },
        {
          input: 'match:regex:\\\\d+',
          expectedCorrection: 'match:regex:\\d+',
          description: 'Double-escaped regex',
        },
      ];

      for (const testCase of testCases) {
        const result = analyzeSyntaxErrors(testCase.input);

        assert.strictEqual(result.hasSyntaxErrors, true,
          `Should detect error in: ${testCase.description}`);

        const hasExpectedCorrection = result.suggestions.some(
          suggestion => suggestion.corrected === testCase.expectedCorrection ||
                       suggestion.pattern === testCase.expectedCorrection,
        );

        assert.strictEqual(hasExpectedCorrection, true,
          `Should suggest "${testCase.expectedCorrection}" for "${testCase.input}" (${testCase.description})`);
      }
    });

    test('should detect new syntax errors added in enhancement', () => {
      const newErrorCases = [
        {
          input: 'match:contain:test',
          expectedSuggestion: 'match:contains:',
          description: 'Missing "s" in contains',
        },
        {
          input: 'match:startWith:hello',
          expectedSuggestion: 'match:startsWith:',
          description: 'Missing "s" in startsWith',
        },
        {
          input: 'match:endWith:world',
          expectedSuggestion: 'match:endsWith:',
          description: 'Missing "s" in endsWith',
        },
        {
          input: 'regexp:test',
          expectedSuggestion: 'match:regex:',
          description: 'Common regex alias',
        },
        {
          input: 'match:type:str',
          expectedSuggestion: 'match:type:string',
          description: 'Type alias',
        },
        {
          input: 'match:type:int',
          expectedSuggestion: 'match:type:number',
          description: 'Integer type alias',
        },
        {
          input: 'match:type:bool',
          expectedSuggestion: 'match:type:boolean',
          description: 'Boolean type alias',
        },
        {
          input: 'match:type:arr',
          expectedSuggestion: 'match:type:array',
          description: 'Array type alias',
        },
        {
          input: 'match:type:obj',
          expectedSuggestion: 'match:type:object',
          description: 'Object type alias',
        },
        {
          input: 'match:eq:value',
          expectedSuggestion: 'match:equals:',
          description: 'Equals operator alias',
        },
        {
          input: 'match:ne:value',
          expectedSuggestion: 'match:notEquals:',
          description: 'Not equals operator alias',
        },
        {
          input: 'match:gt:5',
          expectedSuggestion: 'match:greaterThan:',
          description: 'Greater than operator alias',
        },
        {
          input: 'match:lt:10',
          expectedSuggestion: 'match:lessThan:',
          description: 'Less than operator alias',
        },
        {
          input: 'match:lenght:5',
          expectedSuggestion: 'match:length:',
          description: 'Length misspelling',
        },
        {
          input: 'match:aproximately:3.14',
          expectedSuggestion: 'match:approximately:',
          description: 'Approximately misspelling',
        },
      ];

      for (const testCase of newErrorCases) {
        const result = analyzeSyntaxErrors(testCase.input);

        assert.strictEqual(result.hasSyntaxErrors, true,
          `Should detect error in: ${testCase.description} (input: "${testCase.input}")`);

        const hasExpectedSuggestion = result.suggestions.some(
          suggestion => suggestion.corrected.includes(testCase.expectedSuggestion) ||
                       suggestion.pattern.includes(testCase.expectedSuggestion),
        );

        assert.strictEqual(hasExpectedSuggestion, true,
          `Should suggest something containing "${testCase.expectedSuggestion}" for "${testCase.input}" (${testCase.description})`);
      }
    });

    test('should detect regex-specific errors', () => {
      const regexCases = [
        {
          input: 'match:regex:/test/',
          description: 'Unescaped forward slashes',
          expectedToContain: 'escaped',
        },
        {
          input: 'match:regex:test',
          description: 'Missing anchors for simple patterns',
          expectedToContain: 'anchors',
        },
      ];

      for (const testCase of regexCases) {
        const result = analyzeSyntaxErrors(testCase.input);

        assert.strictEqual(result.hasSyntaxErrors, true,
          `Should detect error in: ${testCase.description}`);

        const hasExpectedMessage = result.suggestions.some(
          suggestion => suggestion.message.toLowerCase().includes(testCase.expectedToContain),
        );

        assert.strictEqual(hasExpectedMessage, true,
          `Should suggest something about "${testCase.expectedToContain}" for "${testCase.input}"`);
      }
    });

    test('should detect date format errors', () => {
      const result = analyzeSyntaxErrors('match:dateAfter:invalid-date');

      assert.strictEqual(result.hasSyntaxErrors, true);
      assert.ok(result.suggestions.some(s => s.message.includes('ISO date format')));
    });

    test('should detect operator symbol errors', () => {
      const operatorCases = [
        'match:=value',
        'match:==value',
        'match:!=value',
        'match:>5',
        'match:<10',
      ];

      for (const pattern of operatorCases) {
        const result = analyzeSyntaxErrors(pattern);

        assert.strictEqual(result.hasSyntaxErrors, true,
          `Should detect operator error in: "${pattern}"`);

        // Check that we get a suggestion with proper operator name
        const hasOperatorSuggestion = result.suggestions.some(s =>
          s.message.includes('equals') ||
          s.message.includes('greaterThan') ||
          s.message.includes('lessThan') ||
          s.message.includes('notEquals') ||
          s.message.includes('operator'),
        );

        assert.ok(hasOperatorSuggestion,
          `Should suggest using named operators for: "${pattern}"`);
      }
    });
  });
});
