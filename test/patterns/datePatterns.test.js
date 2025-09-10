/**
 * Date Patterns Tests - Comprehensive testing for date pattern matching
 * Tests all date-related patterns including edge cases and error handling
 */

import { strict as assert } from 'assert';
import { describe, it } from 'node:test';
import {
  handleDateAfterPattern,
  handleDateBeforePattern,
  handleDateBetweenPattern,
  handleDateValidPattern,
  handleDateAgePattern,
  handleDateEqualsPattern,
  handleDateFormatPattern,
} from '../../src/test-engine/matchers/datePatterns.js';

describe('Date Patterns', () => {
  describe('handleDateAfterPattern', () => {
    it('should match dates after the specified date', () => {
      assert.ok(handleDateAfterPattern('dateAfter:2023-01-01', '2023-06-15'));
      assert.ok(handleDateAfterPattern('dateAfter:2023-01-01', new Date('2023-06-15')));
      assert.ok(handleDateAfterPattern('dateAfter:2023-01-01T00:00:00Z', '2023-01-01T12:00:00Z'));
    });

    it('should not match dates before the specified date', () => {
      assert.ok(!handleDateAfterPattern('dateAfter:2023-06-15', '2023-01-01'));
      assert.ok(!handleDateAfterPattern('dateAfter:2023-06-15', new Date('2023-01-01')));
    });

    it('should not match equal dates', () => {
      assert.ok(!handleDateAfterPattern('dateAfter:2023-01-01', '2023-01-01'));
    });

    it('should handle timestamp inputs', () => {
      const jan1 = new Date('2023-01-01').getTime();
      const june15 = new Date('2023-06-15').getTime();
      assert.ok(handleDateAfterPattern('dateAfter:2023-01-01', june15));
      assert.ok(!handleDateAfterPattern('dateAfter:2023-06-15', jan1));
    });

    it('should return false for invalid dates', () => {
      assert.ok(!handleDateAfterPattern('dateAfter:invalid', '2023-01-01'));
      assert.ok(!handleDateAfterPattern('dateAfter:2023-01-01', 'invalid'));
      assert.ok(!handleDateAfterPattern('dateAfter:2023-01-01', null));
      assert.ok(!handleDateAfterPattern('dateAfter:2023-01-01', undefined));
    });
  });

  describe('handleDateBeforePattern', () => {
    it('should match dates before the specified date', () => {
      assert.ok(handleDateBeforePattern('dateBefore:2023-06-15', '2023-01-01'));
      assert.ok(handleDateBeforePattern('dateBefore:2023-06-15', new Date('2023-01-01')));
    });

    it('should not match dates after the specified date', () => {
      assert.ok(!handleDateBeforePattern('dateBefore:2023-01-01', '2023-06-15'));
      assert.ok(!handleDateBeforePattern('dateBefore:2023-01-01', new Date('2023-06-15')));
    });

    it('should not match equal dates', () => {
      assert.ok(!handleDateBeforePattern('dateBefore:2023-01-01', '2023-01-01'));
    });

    it('should return false for invalid dates', () => {
      assert.ok(!handleDateBeforePattern('dateBefore:invalid', '2023-01-01'));
      assert.ok(!handleDateBeforePattern('dateBefore:2023-01-01', 'invalid'));
    });
  });

  describe('handleDateBetweenPattern', () => {
    it('should match dates between the specified range (inclusive)', () => {
      assert.ok(handleDateBetweenPattern('dateBetween:2023-01-01:2023-12-31', '2023-06-15'));
      assert.ok(handleDateBetweenPattern('dateBetween:2023-01-01:2023-12-31', '2023-01-01'));
      assert.ok(handleDateBetweenPattern('dateBetween:2023-01-01:2023-12-31', '2023-12-31'));
      assert.ok(handleDateBetweenPattern('dateBetween:2023-01-01:2023-12-31', new Date('2023-06-15')));
    });

    it('should not match dates outside the range', () => {
      assert.ok(!handleDateBetweenPattern('dateBetween:2023-01-01:2023-12-31', '2022-12-31'));
      assert.ok(!handleDateBetweenPattern('dateBetween:2023-01-01:2023-12-31', '2024-01-01'));
    });

    it('should handle timestamp inputs', () => {
      const june15 = new Date('2023-06-15').getTime();
      assert.ok(handleDateBetweenPattern('dateBetween:2023-01-01:2023-12-31', june15));
    });

    it('should return false for invalid patterns', () => {
      assert.ok(!handleDateBetweenPattern('dateBetween:2023-01-01', '2023-06-15')); // Missing end date
      assert.ok(!handleDateBetweenPattern('dateBetween::2023-12-31', '2023-06-15')); // Missing start date
      assert.ok(!handleDateBetweenPattern('dateBetween:invalid:2023-12-31', '2023-06-15'));
      assert.ok(!handleDateBetweenPattern('dateBetween:2023-01-01:invalid', '2023-06-15'));
    });

    it('should return false for invalid actual dates', () => {
      assert.ok(!handleDateBetweenPattern('dateBetween:2023-01-01:2023-12-31', 'invalid'));
      assert.ok(!handleDateBetweenPattern('dateBetween:2023-01-01:2023-12-31', null));
    });
  });

  describe('handleDateValidPattern', () => {
    it('should match valid date strings', () => {
      assert.ok(handleDateValidPattern('dateValid', '2023-01-01'));
      assert.ok(handleDateValidPattern('dateValid', '2023-01-01T12:00:00Z'));
      assert.ok(handleDateValidPattern('dateValid', 'January 1, 2023'));
      assert.ok(handleDateValidPattern('dateValid', '01/01/2023'));
    });

    it('should match valid Date objects', () => {
      assert.ok(handleDateValidPattern('dateValid', new Date()));
      assert.ok(handleDateValidPattern('dateValid', new Date('2023-01-01')));
    });

    it('should match valid timestamps', () => {
      assert.ok(handleDateValidPattern('dateValid', Date.now()));
      assert.ok(handleDateValidPattern('dateValid', 1672531200000)); // 2023-01-01
      assert.ok(handleDateValidPattern('dateValid', 1672531200)); // Unix timestamp
    });

    it('should not match invalid dates', () => {
      assert.ok(!handleDateValidPattern('dateValid', 'invalid-date'));
      assert.ok(!handleDateValidPattern('dateValid', 'not a date'));
      assert.ok(!handleDateValidPattern('dateValid', new Date('invalid')));
      assert.ok(!handleDateValidPattern('dateValid', null));
      assert.ok(!handleDateValidPattern('dateValid', undefined));
      assert.ok(!handleDateValidPattern('dateValid', {}));
      assert.ok(!handleDateValidPattern('dateValid', []));
      assert.ok(!handleDateValidPattern('dateValid', 'NaN'));
    });
  });

  describe('handleDateAgePattern', () => {
    it('should match dates within the specified age', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      assert.ok(handleDateAgePattern('dateAge:2h', oneHourAgo.toISOString()));
      assert.ok(handleDateAgePattern('dateAge:2d', oneDayAgo.toISOString()));
      // Use a more generous time window to avoid timing issues
      assert.ok(handleDateAgePattern('dateAge:2h', oneHourAgo));
    });

    it('should not match dates older than the specified age', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      assert.ok(!handleDateAgePattern('dateAge:1d', threeDaysAgo.toISOString()));
      assert.ok(!handleDateAgePattern('dateAge:1h', threeDaysAgo));
    });

    it('should handle various duration formats', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 30000); // 30 seconds ago

      assert.ok(handleDateAgePattern('dateAge:1ms', now.toISOString()));
      assert.ok(handleDateAgePattern('dateAge:1s', now.toISOString()));
      assert.ok(handleDateAgePattern('dateAge:1m', recent.toISOString()));
      assert.ok(handleDateAgePattern('dateAge:1h', recent.toISOString()));
      assert.ok(handleDateAgePattern('dateAge:1d', recent.toISOString()));
    });

    it('should return false for invalid duration formats', () => {
      const now = new Date();
      assert.ok(!handleDateAgePattern('dateAge:invalid', now.toISOString()));
      assert.ok(!handleDateAgePattern('dateAge:1x', now.toISOString())); // Invalid unit
      assert.ok(!handleDateAgePattern('dateAge:abc', now.toISOString()));
      assert.ok(!handleDateAgePattern('dateAge:', now.toISOString()));
    });

    it('should return false for invalid dates', () => {
      assert.ok(!handleDateAgePattern('dateAge:1d', 'invalid-date'));
      assert.ok(!handleDateAgePattern('dateAge:1d', null));
    });
  });

  describe('handleDateEqualsPattern', () => {
    it('should match exactly equal dates', () => {
      const testDate = '2023-01-01T12:00:00.000Z';
      assert.ok(handleDateEqualsPattern('dateEquals:2023-01-01T12:00:00.000Z', testDate));
      assert.ok(handleDateEqualsPattern('dateEquals:2023-01-01T12:00:00.000Z', new Date(testDate)));
    });

    it('should match timestamps', () => {
      const timestamp = 1672531200000; // 2023-01-01T00:00:00.000Z
      assert.ok(handleDateEqualsPattern('dateEquals:2023-01-01T00:00:00.000Z', timestamp));
      assert.ok(handleDateEqualsPattern(`dateEquals:${timestamp}`, '2023-01-01T00:00:00.000Z'));
    });

    it('should not match different dates', () => {
      assert.ok(!handleDateEqualsPattern('dateEquals:2023-01-01', '2023-01-02'));
      assert.ok(!handleDateEqualsPattern('dateEquals:2023-01-01T12:00:00.000Z', '2023-01-01T13:00:00.000Z'));
    });

    it('should return false for invalid dates', () => {
      assert.ok(!handleDateEqualsPattern('dateEquals:invalid', '2023-01-01'));
      assert.ok(!handleDateEqualsPattern('dateEquals:2023-01-01', 'invalid'));
    });
  });

  describe('handleDateFormatPattern', () => {
    it('should match ISO format', () => {
      assert.ok(handleDateFormatPattern('dateFormat:iso', '2023-01-01T12:00:00.000Z'));
      assert.ok(handleDateFormatPattern('dateFormat:iso', '2023-01-01T12:00:00Z'));
      assert.ok(handleDateFormatPattern('dateFormat:iso', '2023-12-31T23:59:59.999Z'));
    });

    it('should match ISO date format', () => {
      assert.ok(handleDateFormatPattern('dateFormat:iso-date', '2023-01-01'));
      assert.ok(handleDateFormatPattern('dateFormat:iso-date', '2023-12-31'));
    });

    it('should match ISO time format', () => {
      assert.ok(handleDateFormatPattern('dateFormat:iso-time', '12:00:00'));
      assert.ok(handleDateFormatPattern('dateFormat:iso-time', '23:59:59.999'));
    });

    it('should match US date format', () => {
      assert.ok(handleDateFormatPattern('dateFormat:us-date', '1/1/2023'));
      assert.ok(handleDateFormatPattern('dateFormat:us-date', '12/31/2023'));
    });

    it('should match timestamp format', () => {
      assert.ok(handleDateFormatPattern('dateFormat:timestamp', '1672531200'));
      assert.ok(handleDateFormatPattern('dateFormat:timestamp', '1672531200000'));
    });

    it('should not match wrong formats', () => {
      assert.ok(!handleDateFormatPattern('dateFormat:iso', '2023-01-01')); // Missing time
      assert.ok(!handleDateFormatPattern('dateFormat:iso-date', '2023-01-01T12:00:00Z')); // Has time
      assert.ok(!handleDateFormatPattern('dateFormat:us-date', '2023-01-01')); // ISO format
      assert.ok(!handleDateFormatPattern('dateFormat:timestamp', '2023-01-01')); // Not numeric
    });

    it('should return false for unknown formats', () => {
      assert.ok(!handleDateFormatPattern('dateFormat:unknown', '2023-01-01'));
    });

    it('should return false for non-string inputs', () => {
      assert.ok(!handleDateFormatPattern('dateFormat:iso', new Date()));
      assert.ok(!handleDateFormatPattern('dateFormat:iso', 1672531200));
      assert.ok(!handleDateFormatPattern('dateFormat:iso', null));
    });
  });
});
