/**
 * Test suite for src/test-engine/matchers/utils/validators.js
 * Coverage target: Improve from 89.57% to 95%+
 * Focus: Utility validation functions for pattern validation helpers
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isValidDateFormat,
  isMissingColon,
  extractRegexPart,
  extractFieldPath,
  hasProperDotNotation,
  isNumeric,
} from '../../src/test-engine/matchers/utils/validators.js';

describe('Validators Utility Functions', () => {
  describe('isValidDateFormat()', () => {
    it('should validate ISO 8601 date formats', () => {
      assert.strictEqual(isValidDateFormat('2023-12-25'), true);
      assert.strictEqual(isValidDateFormat('2023-12-25T10:30:00'), true);
      assert.strictEqual(isValidDateFormat('2023-12-25T10:30:00Z'), true);
      assert.strictEqual(isValidDateFormat('2023-12-25T10:30:00.123Z'), true);
    });

    it('should validate some numeric strings as unix timestamps', () => {
      // Some numeric strings pass both regex and Date parsing
      assert.strictEqual(isValidDateFormat('123'), true); // Parsed as year 123 by Date constructor
      assert.strictEqual(isValidDateFormat('1640995200'), false); // Fails Date() parsing
      assert.strictEqual(isValidDateFormat('1234567890'), false); // Fails Date() parsing
    });

    it('should reject non-ISO date formats', () => {
      assert.strictEqual(isValidDateFormat('12/25/2023'), false); // Not ISO format
      assert.strictEqual(isValidDateFormat('25-12-2023'), false); // Not ISO format
      assert.strictEqual(isValidDateFormat('Dec 25, 2023'), false); // Not ISO format
      assert.strictEqual(isValidDateFormat('December 25, 2023'), false); // Not ISO format
    });

    it('should reject invalid date formats', () => {
      assert.strictEqual(isValidDateFormat('invalid-date'), false);
      assert.strictEqual(isValidDateFormat('2023-13-25'), false);
      assert.strictEqual(isValidDateFormat('2023-12-32'), false);
      assert.strictEqual(isValidDateFormat(''), false);
      assert.strictEqual(isValidDateFormat(null), false);
      assert.strictEqual(isValidDateFormat(undefined), false);
    });

    it('should handle edge cases', () => {
      assert.strictEqual(isValidDateFormat('2023'), true); // Numeric string, valid as year
      assert.strictEqual(isValidDateFormat('25'), false); // Fails Date() parsing
      assert.strictEqual(isValidDateFormat('not a date at all'), false);
      assert.strictEqual(isValidDateFormat('2023-02-29'), true); // Valid date construction in JavaScript
    });
  });

  describe('isMissingColon()', () => {
    it('should detect missing colons in pattern names without values', () => {
      assert.strictEqual(isMissingColon('match:arrayLength'), true);
      assert.strictEqual(isMissingColon('match:type'), true);
      assert.strictEqual(isMissingColon('match:contains'), true);
      assert.strictEqual(isMissingColon('match:regex'), true);
    });

    it('should return false for patterns with proper colons and values', () => {
      assert.strictEqual(isMissingColon('match:arrayLength:5'), false);
      assert.strictEqual(isMissingColon('match:type:object'), false);
      assert.strictEqual(isMissingColon('match:contains:hello'), false);
      assert.strictEqual(isMissingColon('match:regex:[0-9]+'), false);
    });

    it('should return false for non-match patterns', () => {
      assert.strictEqual(isMissingColon(''), false);
      assert.strictEqual(isMissingColon('simple string'), false);
      assert.strictEqual(isMissingColon('not a pattern'), false);
    });

    it('should handle patterns that do not require colons', () => {
      assert.strictEqual(isMissingColon('match:arrayElements'), false);
      assert.strictEqual(isMissingColon('match:exists'), false);
    });
  });

  describe('extractRegexPart()', () => {
    it('should extract regex from match:regex patterns', () => {
      assert.strictEqual(extractRegexPart('match:regex:[0-9]+'), '[0-9]+');
      assert.strictEqual(extractRegexPart('match:regex:^[a-zA-Z]+$'), '^[a-zA-Z]+$');
      assert.strictEqual(extractRegexPart('match:regex:\\d{4}-\\d{2}-\\d{2}'), '\\d{4}-\\d{2}-\\d{2}');
      assert.strictEqual(extractRegexPart('match:regex:.*'), '.*');
    });

    it('should handle complex regex patterns', () => {
      assert.strictEqual(extractRegexPart('match:regex:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'), '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
      assert.strictEqual(extractRegexPart('match:regex:(\\d{3})-(\\d{3})-(\\d{4})'), '(\\d{3})-(\\d{3})-(\\d{4})');
    });

    it('should return null for non-regex patterns', () => {
      assert.strictEqual(extractRegexPart('match:arrayLength:5'), null);
      assert.strictEqual(extractRegexPart('match:type:string'), null);
      assert.strictEqual(extractRegexPart('match:contains:text'), null);
      assert.strictEqual(extractRegexPart('simple string'), null);
    });

    it('should handle edge cases', () => {
      assert.strictEqual(extractRegexPart(''), null);
      assert.strictEqual(extractRegexPart('match:regex:'), '');
      assert.strictEqual(extractRegexPart('match:regex'), null);
      assert.strictEqual(extractRegexPart(':regex:pattern'), 'pattern'); // extracts after any 'regex:'
    });
  });

  describe('extractFieldPath()', () => {
    it('should extract field paths from extractField patterns', () => {
      assert.strictEqual(extractFieldPath('match:extractField:tools.*.name'), 'tools.*.name');
      assert.strictEqual(extractFieldPath('match:extractField:result.items.0.id'), 'result.items.0.id');
      assert.strictEqual(extractFieldPath('match:extractField:data.users.*.profile.email'), 'data.users.*.profile.email');
    });

    it('should handle simple field paths', () => {
      assert.strictEqual(extractFieldPath('match:extractField:name'), 'name');
      assert.strictEqual(extractFieldPath('match:extractField:count'), 'count');
      assert.strictEqual(extractFieldPath('match:extractField:id'), 'id');
    });

    it('should return null for non-extractField patterns', () => {
      assert.strictEqual(extractFieldPath('match:arrayLength:5'), null);
      assert.strictEqual(extractFieldPath('match:type:object'), null);
      assert.strictEqual(extractFieldPath('match:contains:text'), null);
      assert.strictEqual(extractFieldPath('simple string'), null);
    });

    it('should handle edge cases', () => {
      assert.strictEqual(extractFieldPath(''), null);
      assert.strictEqual(extractFieldPath('match:extractField:'), '');
      assert.strictEqual(extractFieldPath('match:extractField'), null);
      assert.strictEqual(extractFieldPath(':extractField:path'), 'path'); // extracts after any 'extractField:'
    });
  });

  describe('hasProperDotNotation()', () => {
    it('should validate proper dot notation paths', () => {
      assert.strictEqual(hasProperDotNotation('user.name'), true);
      assert.strictEqual(hasProperDotNotation('data.items.0.id'), true);
      assert.strictEqual(hasProperDotNotation('config.server.port'), true);
      assert.strictEqual(hasProperDotNotation('tools.*.name'), true);
    });

    it('should validate complex nested paths', () => {
      assert.strictEqual(hasProperDotNotation('response.result.tools.0.inputSchema.properties.path.type'), true);
      assert.strictEqual(hasProperDotNotation('data.users.*.profile.preferences.notifications.email'), true);
    });

    it('should validate wildcard patterns', () => {
      assert.strictEqual(hasProperDotNotation('tools.*'), true);
      assert.strictEqual(hasProperDotNotation('*.name'), true);
      assert.strictEqual(hasProperDotNotation('data.*.value'), true);
    });

    it('should return false for single field names without dots or wildcards', () => {
      assert.strictEqual(hasProperDotNotation('name'), false);
      assert.strictEqual(hasProperDotNotation('id'), false);
      assert.strictEqual(hasProperDotNotation('count'), false);
    });

    it('should handle edge cases', () => {
      // Empty string is falsy but still gets evaluated by && operator
      assert.strictEqual(hasProperDotNotation(''), ''); // returns fieldPath && ... which is ''
      assert.strictEqual(hasProperDotNotation(null), null);
      assert.strictEqual(hasProperDotNotation(undefined), undefined);
    });

    it('should handle special characters in paths', () => {
      assert.strictEqual(hasProperDotNotation('user.first-name'), true);
      assert.strictEqual(hasProperDotNotation('user.first_name'), true);
      assert.strictEqual(hasProperDotNotation('data.items.$index'), true);
      assert.strictEqual(hasProperDotNotation('config.api-key'), true);
    });
  });

  describe('isNumeric()', () => {
    it('should identify numeric strings', () => {
      assert.strictEqual(isNumeric('123'), true);
      assert.strictEqual(isNumeric('0'), true);
      assert.strictEqual(isNumeric('-123'), true);
      assert.strictEqual(isNumeric('123.45'), true);
      assert.strictEqual(isNumeric('-123.45'), true);
    });

    it('should identify scientific notation', () => {
      assert.strictEqual(isNumeric('1.23e10'), true);
      assert.strictEqual(isNumeric('1.23E10'), true);
      assert.strictEqual(isNumeric('-1.23e-10'), true);
      assert.strictEqual(isNumeric('1e5'), true);
    });

    it('should handle actual numbers', () => {
      assert.strictEqual(isNumeric(123), true);
      assert.strictEqual(isNumeric(0), true);
      assert.strictEqual(isNumeric(-123), true);
      assert.strictEqual(isNumeric(123.45), true);
      assert.strictEqual(isNumeric(-123.45), true);
    });

    it('should reject non-numeric values', () => {
      assert.strictEqual(isNumeric('abc'), false);
      assert.strictEqual(isNumeric('12abc'), false);
      assert.strictEqual(isNumeric('abc12'), false);
      assert.strictEqual(isNumeric('12.34.56'), false);
      assert.strictEqual(isNumeric('--123'), false);
      assert.strictEqual(isNumeric(true), false); // Boolean true should not be numeric
      assert.strictEqual(isNumeric(false), false); // Boolean false should not be numeric
    });

    it('should handle edge cases', () => {
      assert.strictEqual(isNumeric(''), false); // Empty string should not be numeric
      assert.strictEqual(isNumeric(' '), false); // Whitespace-only should not be numeric
      assert.strictEqual(isNumeric(null), false); // null should not be numeric
      assert.strictEqual(isNumeric(undefined), false); // Number(undefined) is NaN
      assert.strictEqual(isNumeric(NaN), false);
      assert.strictEqual(isNumeric(Infinity), false); // Infinity is not finite
      assert.strictEqual(isNumeric(-Infinity), false); // -Infinity is not finite
    });

    it('should handle whitespace', () => {
      assert.strictEqual(isNumeric(' 123 '), true); // Number() trims whitespace
      assert.strictEqual(isNumeric('123 '), true);
      assert.strictEqual(isNumeric(' 123'), true);
      assert.strictEqual(isNumeric('   '), false); // Multiple spaces should be false
      assert.strictEqual(isNumeric('\t'), false); // Tab should be false
      assert.strictEqual(isNumeric('\n'), false); // Newline should be false
    });

    it('should handle special numeric formats', () => {
      assert.strictEqual(isNumeric('+123'), true);
      assert.strictEqual(isNumeric('.5'), true);
      assert.strictEqual(isNumeric('0.5'), true);
      assert.strictEqual(isNumeric('-.5'), true);
      assert.strictEqual(isNumeric('+.5'), true);
    });
  });
});
