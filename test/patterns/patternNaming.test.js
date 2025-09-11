/**
 * Pattern naming corrections tests
 * Validates enhanced debugging functionality for YAML pattern development
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  PATTERN_NAMING_CORRECTIONS,
  PATTERN_NAMING_REGEX_CORRECTIONS,
  AVAILABLE_PATTERNS,
  ALL_PATTERN_NAMES,
  isLikelyPattern,
  isPatternNameOnly,
  findSimilarPatterns,
  analyzePattern,
  generatePatternErrorMessage,
} from '../../src/test-engine/matchers/corrections/patternNaming.js';

describe('Pattern Naming Corrections - Enhanced Debugging', () => {
  describe('AVAILABLE_PATTERNS constant', () => {
    it('should contain all pattern categories', () => {
      const expectedCategories = ['core', 'string', 'array', 'numeric', 'date', 'complex'];
      expectedCategories.forEach(category => {
        assert.ok(AVAILABLE_PATTERNS[category], `Missing category: ${category}`);
        assert.ok(Array.isArray(AVAILABLE_PATTERNS[category]), `Category ${category} should be array`);
      });
    });

    it('should contain all expected core patterns', () => {
      const corePatterns = AVAILABLE_PATTERNS.core;
      assert.ok(corePatterns.includes('type'));
      assert.ok(corePatterns.includes('exists'));
      assert.ok(corePatterns.includes('length'));
      assert.ok(corePatterns.includes('count'));
    });

    it('should contain comprehensive string patterns', () => {
      const stringPatterns = AVAILABLE_PATTERNS.string;
      assert.ok(stringPatterns.includes('regex'));
      assert.ok(stringPatterns.includes('contains'));
      assert.ok(stringPatterns.includes('containsIgnoreCase'));
      assert.ok(stringPatterns.includes('startsWith'));
      assert.ok(stringPatterns.includes('endsWith'));
      assert.ok(stringPatterns.includes('equalsIgnoreCase'));
    });

    it('should contain all numeric patterns', () => {
      const numericPatterns = AVAILABLE_PATTERNS.numeric;
      const expectedNumeric = [
        'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual',
        'between', 'range', 'equals', 'notEquals', 'approximately',
        'multipleOf', 'divisibleBy', 'decimalPlaces',
      ];
      expectedNumeric.forEach(pattern => {
        assert.ok(numericPatterns.includes(pattern), `Missing numeric pattern: ${pattern}`);
      });
    });

    it('should contain all date patterns', () => {
      const datePatterns = AVAILABLE_PATTERNS.date;
      const expectedDate = [
        'dateValid', 'dateAfter', 'dateBefore', 'dateBetween',
        'dateAge', 'dateEquals', 'dateFormat',
      ];
      expectedDate.forEach(pattern => {
        assert.ok(datePatterns.includes(pattern), `Missing date pattern: ${pattern}`);
      });
    });
  });

  describe('ALL_PATTERN_NAMES constant', () => {
    it('should flatten all pattern categories', () => {
      assert.ok(Array.isArray(ALL_PATTERN_NAMES));
      assert.ok(ALL_PATTERN_NAMES.length > 25, 'Should have 25+ patterns');

      // Check it includes patterns from all categories
      assert.ok(ALL_PATTERN_NAMES.includes('type')); // core
      assert.ok(ALL_PATTERN_NAMES.includes('contains')); // string
      assert.ok(ALL_PATTERN_NAMES.includes('arrayLength')); // array
      assert.ok(ALL_PATTERN_NAMES.includes('greaterThan')); // numeric
      assert.ok(ALL_PATTERN_NAMES.includes('dateValid')); // date
      assert.ok(ALL_PATTERN_NAMES.includes('extractField')); // complex
    });
  });

  describe('Enhanced PATTERN_NAMING_CORRECTIONS', () => {
    it('should handle missing match: prefix for all patterns', () => {
      // Test core patterns
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['type:'], 'match:type:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['exists'], 'match:exists');

      // Test new numeric patterns
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['greaterThan:'], 'match:greaterThan:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['between:'], 'match:between:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['approximately:'], 'match:approximately:');

      // Test new date patterns
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['dateValid'], 'match:dateValid');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['dateAfter:'], 'match:dateAfter:');

      // Test case-insensitive patterns
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['containsIgnoreCase:'], 'match:containsIgnoreCase:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['equalsIgnoreCase:'], 'match:equalsIgnoreCase:');
    });

    it('should handle comprehensive aliases and misspellings', () => {
      // Common aliases
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:gt:'], 'match:greaterThan:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:lt:'], 'match:lessThan:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:eq:'], 'match:equals:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:ne:'], 'match:notEquals:');

      // Misspellings
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:aproximate:'], 'match:approximately:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:aproximately:'], 'match:approximately:');

      // Alternative names
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:substr:'], 'match:contains:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:beginsWith:'], 'match:startsWith:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:size:'], 'match:arrayLength:');

      // Date aliases
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:validDate:'], 'match:dateValid:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:newer:'], 'match:dateAfter:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:older:'], 'match:dateBefore:');

      // Complex pattern aliases
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:extract:'], 'match:extractField:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:pluck:'], 'match:extractField:');
      assert.strictEqual(PATTERN_NAMING_CORRECTIONS['match:negate:'], 'match:not:');
    });
  });

  describe('Enhanced PATTERN_NAMING_REGEX_CORRECTIONS', () => {
    it('should handle operator symbols from programming habits', () => {
      const corrections = PATTERN_NAMING_REGEX_CORRECTIONS;

      // Test operator symbols
      assert.ok(corrections['match:>']);
      assert.ok(corrections['match:<']);
      assert.ok(corrections['match:>=']);
      assert.ok(corrections['match:<=']);
      assert.ok(corrections['match:==']);
      assert.ok(corrections['match:!=']);

      // Test pattern matching
      const gtMatch = '>100'.match(corrections['match:>'].pattern);
      assert.ok(gtMatch);
      assert.strictEqual(corrections['match:>'].correction(...gtMatch), 'greaterThan:100');
    });

    it('should handle syntax errors with missing colons', () => {
      const corrections = PATTERN_NAMING_REGEX_CORRECTIONS;

      // Test space-separated syntax errors
      const typeMatch = 'type string'.match(/^type\s+(.+)$/);
      assert.ok(typeMatch);
      assert.strictEqual(corrections['match:type'].correction(...typeMatch), 'type:string');

      const containsMatch = 'contains error'.match(/^contains\s+(.+)$/);
      assert.ok(containsMatch);
      assert.strictEqual(corrections['match:contains'].correction(...containsMatch), 'contains:error');
    });

    it('should provide helpful syntax correction messages', () => {
      const corrections = PATTERN_NAMING_REGEX_CORRECTIONS;

      assert.strictEqual(corrections['match:between:'].category, 'syntax');
      assert.ok(corrections['match:between:'].message.includes('two values'));
      assert.ok(corrections['match:between:'].suggestion);

      assert.strictEqual(corrections['match:approximately:'].category, 'syntax');
      assert.ok(corrections['match:approximately:'].message.includes('tolerance'));
    });

    it('should handle date format shortcuts', () => {
      const corrections = PATTERN_NAMING_REGEX_CORRECTIONS;

      assert.strictEqual(corrections['match:today'].correction(), 'dateAge:1d');
      assert.strictEqual(corrections['match:recent'].correction(), 'dateAge:7d');
      assert.strictEqual(corrections['match:today'].category, 'alias');
    });
  });

  describe('isLikelyPattern function', () => {
    it('should identify likely patterns', () => {
      assert.ok(isLikelyPattern('arrayLength:5'));
      assert.ok(isLikelyPattern('contains:error'));
      assert.ok(isLikelyPattern('greaterThan:100'));
      assert.ok(isLikelyPattern('dateValid'));
      assert.ok(isLikelyPattern('extractField:'));

      // Should include new patterns
      assert.ok(isLikelyPattern('containsIgnoreCase:VALUE'));
      assert.ok(isLikelyPattern('greaterThanOrEqual:50'));
      assert.ok(isLikelyPattern('decimalPlaces:2'));
    });

    it('should not identify non-patterns', () => {
      assert.ok(!isLikelyPattern('hello world'));
      assert.ok(!isLikelyPattern('status: success'));
      assert.ok(!isLikelyPattern('name'));
      assert.ok(!isLikelyPattern('42'));
    });
  });

  describe('findSimilarPatterns function', () => {
    it('should find similar patterns with good fuzzy matching', () => {
      // Test misspellings
      const aproxResults = findSimilarPatterns('aproximately');
      assert.ok(aproxResults.length > 0);
      assert.ok(aproxResults.some(r => r.pattern === 'match:approximately'));

      // Test partial matches
      const containResults = findSimilarPatterns('contain');
      assert.ok(containResults.length > 0);
      assert.ok(containResults.some(r => r.pattern === 'match:contains'));

      // Test with typos
      const gretarResults = findSimilarPatterns('gretar');
      assert.ok(gretarResults.length > 0);
      assert.ok(gretarResults.some(r => r.pattern === 'match:greaterThan'));
    });

    it('should return results sorted by similarity', () => {
      const results = findSimilarPatterns('conta');
      assert.ok(results.length > 0);

      // Should be sorted by similarity (highest first)
      for (let i = 1; i < results.length; i++) {
        assert.ok(results[i - 1].similarity >= results[i].similarity);
      }
    });

    it('should include category information', () => {
      const results = findSimilarPatterns('contains');
      const containsResult = results.find(r => r.pattern === 'match:contains');
      assert.ok(containsResult);
      assert.strictEqual(containsResult.category, 'string');
    });

    it('should limit results to maxSuggestions', () => {
      const results = findSimilarPatterns('a', 3);
      assert.ok(results.length <= 3);
    });
  });

  describe('analyzePattern function', () => {
    it('should analyze valid patterns correctly', () => {
      const result = analyzePattern('match:contains:error');
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.category, 'string');
      assert.ok(result.examples.length > 0);
      assert.strictEqual(result.errors.length, 0);
    });

    it('should detect missing match: prefix', () => {
      const result = analyzePattern('contains:error');
      assert.strictEqual(result.isValid, true); // Pattern is valid, just needs prefix
      assert.ok(result.errors.some(e => e.includes('match:')));
      assert.strictEqual(result.corrected, 'match:contains:error');
    });

    it('should provide exact corrections', () => {
      const result = analyzePattern('match:aproximately:100:5');
      assert.ok(result.suggestions.some(s => s.type === 'regex_correction'));
      assert.strictEqual(result.corrected, 'match:approximately:100:5');
    });

    it('should provide similar pattern suggestions', () => {
      const result = analyzePattern('match:conta:error');
      assert.ok(result.suggestions.some(s => s.type === 'similar'));
      assert.ok(result.suggestions.some(s => s.text.includes('contains')));
    });

    it('should categorize patterns correctly', () => {
      const stringResult = analyzePattern('match:contains:test');
      assert.strictEqual(stringResult.category, 'string');

      const numericResult = analyzePattern('match:greaterThan:100');
      assert.strictEqual(numericResult.category, 'numeric');

      const dateResult = analyzePattern('match:dateValid');
      assert.strictEqual(dateResult.category, 'date');
    });

    it('should provide category-specific examples', () => {
      const stringResult = analyzePattern('match:contains:test');
      assert.ok(stringResult.examples.some(e => e.includes('contains')));
      assert.ok(stringResult.examples.some(e => e.includes('regex')));

      const numericResult = analyzePattern('match:greaterThan:100');
      assert.ok(numericResult.examples.some(e => e.includes('greaterThan')));
      assert.ok(numericResult.examples.some(e => e.includes('between')));
    });
  });

  describe('generatePatternErrorMessage function', () => {
    it('should generate comprehensive error messages', () => {
      const message = generatePatternErrorMessage('conta:error');

      // Should include the pattern
      assert.ok(message.includes('conta:error'));

      // Should include sections
      assert.ok(message.includes('Issues Found'));
      assert.ok(message.includes('Suggestions'));
      assert.ok(message.includes('Examples'));
      assert.ok(message.includes('documentation'));

      // Should include emojis for better readability
      assert.ok(message.includes('❌'));
      assert.ok(message.includes('🔍'));
      assert.ok(message.includes('💡'));
      assert.ok(message.includes('📚'));
      assert.ok(message.includes('📖'));
    });

    it('should include context when provided', () => {
      const message = generatePatternErrorMessage('bad:pattern', 'YAML validation failed');
      assert.ok(message.includes('Context: YAML validation failed'));
    });

    it('should show confidence levels for suggestions', () => {
      const message = generatePatternErrorMessage('aproximate:100:5');
      assert.ok(message.includes('confidence'));
    });

    it('should include helpful examples', () => {
      const message = generatePatternErrorMessage('contains:error');
      assert.ok(message.includes('Example'));
    });
  });

  describe('Real-world debugging scenarios', () => {
    it('should help debug common YAML pattern mistakes', () => {
      // Missing match: prefix
      const result1 = analyzePattern('arrayLength:5');
      assert.ok(result1.suggestions.some(s => s.confidence >= 0.9));

      // Misspelling
      const result2 = analyzePattern('match:aproximately:100:5');
      assert.strictEqual(result2.corrected, 'match:approximately:100:5');

      // Wrong operator
      const result3 = analyzePattern('match:>:100');
      // Should suggest greaterThan through regex correction

      // Fuzzy matching for typos
      const result4 = analyzePattern('match:containz:error');
      assert.ok(result4.suggestions.some(s => s.text.includes('contains')));
    });

    it('should provide category-appropriate suggestions', () => {
      // Numeric pattern should suggest numeric examples
      const numericAnalysis = analyzePattern('match:greater:100');
      assert.ok(numericAnalysis.examples.some(e => e.includes('greaterThan')));
      assert.ok(numericAnalysis.examples.some(e => e.includes('between')));

      // String pattern should suggest string examples
      const stringAnalysis = analyzePattern('match:contain:error');
      assert.ok(stringAnalysis.examples.some(e => e.includes('contains')));
      assert.ok(stringAnalysis.examples.some(e => e.includes('startsWith')));
    });

    it('should help AI agents understand pattern syntax', () => {
      const message = generatePatternErrorMessage('match:between:100');
      assert.ok(message.includes('two values'));
      assert.ok(message.includes('MIN:MAX'));
      assert.ok(message.includes('documentation'));
    });
  });
});
