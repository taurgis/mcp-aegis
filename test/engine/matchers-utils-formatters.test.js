/**
 * Test suite for src/test-engine/matchers/utils/formatters.js
 * Coverage target: Improve from 64.04% to 95%+
 * Focus: Error message formatting utilities for pattern suggestions and warnings
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  formatSuggestion,
  formatSuggestions,
  createSuggestion,
  formatAntiPatternWarnings,
} from '../../src/test-engine/matchers/utils/formatters.js';

describe('Formatters Utility Functions', () => {
  describe('formatSuggestion()', () => {
    describe('non_existent_feature type', () => {
      it('should format basic non-existent feature message', () => {
        const suggestion = {
          type: 'non_existent_feature',
          message: 'Pattern not supported in MCP Conductor',
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('❌ Unsupported Feature: Pattern not supported in MCP Conductor'));
      });

      it('should include solution when provided', () => {
        const suggestion = {
          type: 'non_existent_feature',
          message: 'Pattern not supported',
          suggestion: 'Use match:arrayLength instead',
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('💡 Solution: Use match:arrayLength instead'));
      });

      it('should include alternatives when provided', () => {
        const suggestion = {
          type: 'non_existent_feature',
          message: 'Pattern not supported',
          alternatives: ['match:contains', 'match:startsWith', 'match:endsWith', 'match:regex'],
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('✅ Available alternatives:'));
        assert.ok(result.includes('• match:contains'));
        assert.ok(result.includes('• match:startsWith'));
        assert.ok(result.includes('• match:endsWith'));
        // Should limit to 3 alternatives
        assert.ok(!result.includes('• match:regex'));
      });

      it('should include example when provided', () => {
        const suggestion = {
          type: 'non_existent_feature',
          message: 'Pattern not supported',
          example: {
            incorrect: 'match:invalidPattern:value',
            correct: 'match:contains:value',
          },
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('📝 Example:'));
        assert.ok(result.includes('❌ match:invalidPattern:value'));
        assert.ok(result.includes('✅ match:contains:value'));
      });

      it('should include all components when provided', () => {
        const suggestion = {
          type: 'non_existent_feature',
          message: 'Invalid pattern used',
          suggestion: 'Use supported patterns',
          alternatives: ['match:type', 'match:arrayLength'],
          example: {
            incorrect: 'match:invalid',
            correct: 'match:type:string',
          },
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('❌ Unsupported Feature:'));
        assert.ok(result.includes('💡 Solution:'));
        assert.ok(result.includes('✅ Available alternatives:'));
        assert.ok(result.includes('📝 Example:'));
      });
    });

    describe('confusing_pattern type', () => {
      it('should format confusing pattern message', () => {
        const suggestion = {
          type: 'confusing_pattern',
          message: 'Similar pattern exists',
          original: 'match:arrayLenght',
          corrected: 'match:arrayLength',
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('🔀 Similar Pattern Available: Similar pattern exists'));
        assert.ok(result.includes('Change: "match:arrayLenght" → "match:arrayLength"'));
      });

      it('should handle confusing pattern without change info', () => {
        const suggestion = {
          type: 'confusing_pattern',
          message: 'Pattern might be confusing',
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('🔀 Similar Pattern Available: Pattern might be confusing'));
        assert.ok(result.includes('Change: "undefined" → "undefined"'));
      });
    });

    describe('sounds_like_feature type', () => {
      it('should format sounds-like feature message', () => {
        const suggestion = {
          type: 'sounds_like_feature',
          message: 'Feature sounds familiar but not available',
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('❌ Feature Not Available: Feature sounds familiar but not available'));
      });

      it('should include alternative when provided', () => {
        const suggestion = {
          type: 'sounds_like_feature',
          message: 'Feature not available',
          suggestion: 'Try match:arrayContains instead',
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('❌ Feature Not Available: Feature not available'));
        assert.ok(result.includes('💡 Alternative: Try match:arrayContains instead'));
      });
    });

    describe('default formatting', () => {
      it('should format default suggestion type', () => {
        const suggestion = {
          type: 'syntax_error',
          message: 'Invalid syntax detected',
          original: 'match arrayLength 5',
          corrected: 'match:arrayLength:5',
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('🔧 Syntax Fix: Invalid syntax detected'));
        assert.ok(result.includes('Change: "match arrayLength 5" → "match:arrayLength:5"'));
      });

      it('should not show change when original equals corrected', () => {
        const suggestion = {
          type: 'syntax_error',
          message: 'Minor issue',
          original: 'match:type:string',
          corrected: 'match:type:string',
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('🔧 Syntax Fix: Minor issue'));
        assert.ok(!result.includes('Change:'));
      });

      it('should include example when provided', () => {
        const suggestion = {
          type: 'syntax_error',
          message: 'Fix needed',
          original: 'bad',
          corrected: 'good',
          example: 'Use match:type:string for type validation',
        };

        const result = formatSuggestion(suggestion);
        assert.ok(result.includes('🔧 Syntax Fix: Fix needed'));
        assert.ok(result.includes('Example: Use match:type:string for type validation'));
      });
    });
  });

  describe('formatSuggestions()', () => {
    it('should format array of suggestions', () => {
      const suggestions = [
        {
          type: 'non_existent_feature',
          message: 'Feature A not supported',
        },
        {
          type: 'confusing_pattern',
          message: 'Pattern B is confusing',
          original: 'bad',
          corrected: 'good',
        },
        {
          type: 'sounds_like_feature',
          message: 'Feature C sounds familiar',
        },
      ];

      const results = formatSuggestions(suggestions);
      assert.strictEqual(results.length, 3);
      assert.ok(results[0].includes('❌ Unsupported Feature:'));
      assert.ok(results[1].includes('🔀 Similar Pattern Available:'));
      assert.ok(results[2].includes('❌ Feature Not Available:'));
    });

    it('should handle empty array', () => {
      const results = formatSuggestions([]);
      assert.strictEqual(results.length, 0);
    });

    it('should handle single suggestion', () => {
      const suggestions = [
        {
          type: 'syntax_error',
          message: 'Single error',
          original: 'wrong',
          corrected: 'right',
        },
      ];

      const results = formatSuggestions(suggestions);
      assert.strictEqual(results.length, 1);
      assert.ok(results[0].includes('🔧 Syntax Fix:'));
    });
  });

  describe('createSuggestion()', () => {
    it('should create basic suggestion object', () => {
      const options = {
        type: 'syntax_error',
        original: 'match arrayLength',
        corrected: 'match:arrayLength',
        message: 'Missing colon',
      };

      const result = createSuggestion(options);
      assert.strictEqual(result.type, 'syntax_error');
      assert.strictEqual(result.original, 'match arrayLength');
      assert.strictEqual(result.corrected, 'match:arrayLength');
      assert.strictEqual(result.pattern, 'match:arrayLength');
      assert.strictEqual(result.message, 'Missing colon');
      assert.ok(!('example' in result));
    });

    it('should include example when provided', () => {
      const options = {
        type: 'syntax_error',
        original: 'bad',
        corrected: 'good',
        message: 'Fix this',
        example: 'Example usage',
      };

      const result = createSuggestion(options);
      assert.strictEqual(result.example, 'Example usage');
    });

    it('should handle all required fields', () => {
      const options = {
        type: 'non_existent_feature',
        original: 'match:unsupported',
        corrected: 'match:supported',
        message: 'Feature not available',
      };

      const result = createSuggestion(options);
      assert.ok(Object.prototype.hasOwnProperty.call(result, 'type'));
      assert.ok(Object.prototype.hasOwnProperty.call(result, 'original'));
      assert.ok(Object.prototype.hasOwnProperty.call(result, 'corrected'));
      assert.ok(Object.prototype.hasOwnProperty.call(result, 'pattern'));
      assert.ok(Object.prototype.hasOwnProperty.call(result, 'message'));
    });
  });

  describe('formatAntiPatternWarnings()', () => {
    it('should format basic warning without fix', () => {
      const warnings = [
        {
          message: 'Potential issue detected',
        },
      ];

      const results = formatAntiPatternWarnings(warnings);
      assert.strictEqual(results.length, 1);
      assert.ok(results[0].includes('⚠️ Anti-Pattern: Potential issue detected'));
      assert.ok(!results[0].includes('Fix:'));
    });

    it('should format warning with fix', () => {
      const warnings = [
        {
          message: 'Duplicate keys found',
          fix: 'Remove duplicate key or merge values',
        },
      ];

      const results = formatAntiPatternWarnings(warnings);
      assert.strictEqual(results.length, 1);
      assert.ok(results[0].includes('⚠️ Anti-Pattern: Duplicate keys found'));
      assert.ok(results[0].includes('Fix: Remove duplicate key or merge values'));
    });

    it('should format multiple warnings', () => {
      const warnings = [
        {
          message: 'Warning 1',
          fix: 'Fix 1',
        },
        {
          message: 'Warning 2',
        },
        {
          message: 'Warning 3',
          fix: 'Fix 3',
        },
      ];

      const results = formatAntiPatternWarnings(warnings);
      assert.strictEqual(results.length, 3);
      assert.ok(results[0].includes('⚠️ Anti-Pattern: Warning 1'));
      assert.ok(results[0].includes('Fix: Fix 1'));
      assert.ok(results[1].includes('⚠️ Anti-Pattern: Warning 2'));
      assert.ok(!results[1].includes('Fix:'));
      assert.ok(results[2].includes('⚠️ Anti-Pattern: Warning 3'));
      assert.ok(results[2].includes('Fix: Fix 3'));
    });

    it('should handle empty warnings array', () => {
      const results = formatAntiPatternWarnings([]);
      assert.strictEqual(results.length, 0);
    });

    it('should handle warnings with empty messages', () => {
      const warnings = [
        {
          message: '',
          fix: 'Some fix',
        },
      ];

      const results = formatAntiPatternWarnings(warnings);
      assert.strictEqual(results.length, 1);
      assert.ok(results[0].includes('⚠️ Anti-Pattern: '));
      assert.ok(results[0].includes('Fix: Some fix'));
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle undefined suggestion gracefully', () => {
      // This tests the default case when type doesn't match known types
      const suggestion = {
        message: 'Unknown type',
      };

      const result = formatSuggestion(suggestion);
      assert.ok(result.includes('🔧 Syntax Fix: Unknown type'));
    });

    it('should handle suggestion with missing properties', () => {
      const suggestion = {
        type: 'confusing_pattern',
        message: 'Missing properties test',
        // Missing original and corrected
      };

      const result = formatSuggestion(suggestion);
      assert.ok(result.includes('🔀 Similar Pattern Available:'));
    });

    it('should handle null/undefined in arrays', () => {
      const suggestions = [null, undefined, { type: 'syntax_error', message: 'Valid' }];
      
      // This would normally cause errors, but we're testing robustness
      assert.throws(() => formatSuggestions(suggestions));
    });
  });
});
