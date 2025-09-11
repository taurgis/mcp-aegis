/**
 * Test cases for Structure Analyzer
 * Tests YAML structure error detection and suggestions
 */

import assert from 'node:assert';
import { test, describe } from 'node:test';
import { analyzeStructureErrors } from '../../src/test-engine/matchers/analyzers/structureAnalyzer.js';

describe('StructureAnalyzer', () => {
  describe('analyzeStructureErrors', () => {
    test('should detect extractField without value', () => {
      const yamlContext = {
        hasExtractField: true,
        hasValue: false,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'structure_error' &&
        s.message.includes('must also include a "value:" key'),
      ));
      assert.ok(suggestions.some(s => s.example && s.example.includes('value:')));
    });

    test('should detect duplicate keys', () => {
      const yamlContext = {
        hasDuplicateKeys: true,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'structure_error' &&
        s.message.includes('duplicate YAML keys'),
      ));
      assert.ok(suggestions.some(s => s.example && s.example.includes('❌ WRONG')));
      assert.ok(suggestions.some(s => s.example && s.example.includes('✅ CORRECT')));
    });

    test('should detect partial matching without match:partial:', () => {
      const yamlContext = {
        hasPartialMatching: true,
        hasPartialPattern: false,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'structure_error' &&
        s.message.includes('match:partial:'),
      ));
      assert.ok(suggestions.some(s => s.example && s.example.includes('match:partial:')));
    });

    test('should detect arrayElements without proper structure', () => {
      const yamlContext = {
        hasArrayElements: true,
        hasProperArrayElementsStructure: false,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'structure_error' &&
        s.message.includes('match:arrayElements:'),
      ));
      assert.ok(suggestions.some(s => s.example && s.example.includes('match:arrayElements:')));
    });

    test('should detect mixed patterns and exact values', () => {
      const yamlContext = {
        hasMixedPatterns: true,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'structure_error' &&
        s.message.includes('mixing pattern matching and exact value'),
      ));
      assert.ok(suggestions.some(s => s.example && s.example.includes('Separate tests')));
    });

    test('should detect incorrect YAML nesting', () => {
      const yamlContext = {
        hasIncorrectNesting: true,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'structure_error' &&
        s.message.includes('properly nested'),
      ));
      assert.ok(suggestions.some(s => s.example && s.example.includes('❌ WRONG')));
      assert.ok(suggestions.some(s => s.example && s.example.includes('✅ CORRECT')));
    });

    test('should detect invalid stderr pattern', () => {
      const yamlContext = {
        hasInvalidStderrPattern: true,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.ok(suggestions.length > 0);
      assert.ok(suggestions.some(s =>
        s.type === 'structure_error' &&
        s.message.includes('stderr validation'),
      ));
      assert.ok(suggestions.some(s => s.example && s.example.includes('toBeEmpty')));
      assert.ok(suggestions.some(s => s.example && s.example.includes('match:contains:')));
    });

    test('should handle multiple structure errors', () => {
      const yamlContext = {
        hasExtractField: true,
        hasValue: false,
        hasDuplicateKeys: true,
        hasMixedPatterns: true,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.ok(suggestions.length >= 3);
      assert.ok(suggestions.some(s => s.message.includes('value:" key')));
      assert.ok(suggestions.some(s => s.message.includes('duplicate YAML keys')));
      assert.ok(suggestions.some(s => s.message.includes('mixing pattern matching')));
    });

    test('should return empty array for valid structure', () => {
      const yamlContext = {
        hasExtractField: false,
        hasValue: true,
        hasDuplicateKeys: false,
        hasPartialMatching: false,
        hasPartialPattern: true,
        hasArrayElements: false,
        hasProperArrayElementsStructure: true,
        hasMixedPatterns: false,
        hasIncorrectNesting: false,
        hasInvalidStderrPattern: false,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.strictEqual(suggestions.length, 0);
    });

    test('should handle extractField with value properly', () => {
      const yamlContext = {
        hasExtractField: true,
        hasValue: true,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      // Should not suggest adding value key when it's already present
      assert.ok(!suggestions.some(s => s.message.includes('must also include a "value:" key')));
    });

    test('should handle partial matching with proper pattern', () => {
      const yamlContext = {
        hasPartialMatching: true,
        hasPartialPattern: true,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      // Should not suggest using match:partial: when it's already used
      assert.ok(!suggestions.some(s => s.message.includes('match:partial:')));
    });

    test('should handle arrayElements with proper structure', () => {
      const yamlContext = {
        hasArrayElements: true,
        hasProperArrayElementsStructure: true,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      // Should not suggest fixing arrayElements when structure is proper
      assert.ok(!suggestions.some(s => s.message.includes('match:arrayElements:')));
    });

    test('should handle valid stderr patterns', () => {
      const yamlContext = {
        hasInvalidStderrPattern: false,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      // Should not suggest fixing stderr when pattern is valid
      assert.ok(!suggestions.some(s => s.message.includes('stderr validation')));
    });

    test('should handle empty yaml context', () => {
      const yamlContext = {};

      const suggestions = analyzeStructureErrors(yamlContext);

      assert.strictEqual(suggestions.length, 0);
    });

    test('should handle null yaml context gracefully', () => {
      const suggestions = analyzeStructureErrors(null);

      assert.strictEqual(suggestions.length, 0);
    });

    test('should handle undefined yaml context gracefully', () => {
      const suggestions = analyzeStructureErrors(undefined);

      assert.strictEqual(suggestions.length, 0);
    });

    test('should provide meaningful examples in suggestions', () => {
      const yamlContext = {
        hasExtractField: true,
        hasValue: false,
        hasDuplicateKeys: true,
        hasIncorrectNesting: true,
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      // Check that all suggestions have examples
      suggestions.forEach(suggestion => {
        assert.ok(suggestion.example, `Suggestion should have example: ${suggestion.message}`);
        assert.ok(suggestion.example.length > 0, 'Example should not be empty');
      });

      // Check for specific example content
      assert.ok(suggestions.some(s => s.example.includes('match:extractField')));
      assert.ok(suggestions.some(s => s.example.includes('value:')));
      assert.ok(suggestions.some(s => s.example.includes('❌ WRONG')));
      assert.ok(suggestions.some(s => s.example.includes('✅ CORRECT')));
    });

    test('should handle edge case combinations', () => {
      const yamlContext = {
        hasExtractField: false,
        hasValue: true, // Value without extractField
        hasPartialMatching: false,
        hasPartialPattern: true, // Pattern without partial matching
      };

      const suggestions = analyzeStructureErrors(yamlContext);

      // These edge cases should not generate errors
      assert.strictEqual(suggestions.length, 0);
    });
  });
});
