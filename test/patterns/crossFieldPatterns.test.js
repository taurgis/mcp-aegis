import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  handleCrossFieldPattern,
} from '../../src/test-engine/matchers/crossFieldPatterns.js';
import { deepEqual } from '../../src/test-engine/matchers/equality.js';
import { validateWithDetailedAnalysis } from '../../src/test-engine/matchers/validation.js';

describe('Cross-Field Patterns', () => {
  describe('handleCrossFieldPattern', () => {
    it('should validate date comparison correctly', () => {
      const testData = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      };

      assert.equal(
        handleCrossFieldPattern('crossField:startDate < endDate', testData),
        true,
      );
    });

    it('should validate numeric comparison correctly', () => {
      const testData = {
        minValue: 10,
        maxValue: 100,
      };

      assert.equal(
        handleCrossFieldPattern('crossField:minValue < maxValue', testData),
        true,
      );
    });

    it('should fail when condition is not met', () => {
      const testData = {
        startDate: '2023-12-31',
        endDate: '2023-01-01',
      };

      assert.equal(
        handleCrossFieldPattern('crossField:startDate < endDate', testData),
        false,
      );
    });

    it('should handle equality comparison', () => {
      const testData = {
        value1: 42,
        value2: 42,
      };

      assert.equal(
        handleCrossFieldPattern('crossField:value1 = value2', testData),
        true,
      );
    });

    it('should handle inequality comparison', () => {
      const testData = {
        value1: 42,
        value2: 24,
      };

      assert.equal(
        handleCrossFieldPattern('crossField:value1 != value2', testData),
        true,
      );
    });

    it('should handle nested field paths', () => {
      const testData = {
        user: {
          profile: {
            age: 25,
          },
        },
        minAge: 18,
      };

      assert.equal(
        handleCrossFieldPattern('crossField:user.profile.age > minAge', testData),
        true,
      );
    });

    it('should fail with missing fields', () => {
      const testData = {
        startDate: '2023-01-01',
        // endDate missing
      };

      assert.equal(
        handleCrossFieldPattern('crossField:startDate < endDate', testData),
        false,
      );
    });

    it('should handle string comparison', () => {
      const testData = {
        name: 'Alice',
        otherName: 'Bob',
      };

      assert.equal(
        handleCrossFieldPattern('crossField:name < otherName', testData),
        true,
      );
    });
  });

  describe('deepEqual with crossField patterns', () => {
    it('should validate using deepEqual with crossField pattern', () => {
      const expected = {
        'match:crossField': 'startDate < endDate',
      };

      const actual = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        status: 'active',
      };

      assert.equal(deepEqual(expected, actual), true);
    });

    it('should fail validation when crossField condition is not met', () => {
      const expected = {
        'match:crossField': 'startDate < endDate',
      };

      const actual = {
        startDate: '2023-12-31',
        endDate: '2023-01-01',
        status: 'active',
      };

      assert.equal(deepEqual(expected, actual), false);
    });
  });

  describe('validateWithDetailedAnalysis with crossField patterns', () => {
    it('should provide detailed error for failed crossField validation', () => {
      const expected = {
        'match:crossField': 'startDate < endDate',
      };

      const actual = {
        startDate: '2023-12-31',
        endDate: '2023-01-01',
      };

      const result = validateWithDetailedAnalysis(expected, actual);

      assert.equal(result.passed, false);
      assert.equal(result.errors.length, 1);
      assert.equal(result.errors[0].type, 'pattern_failed');
      assert.equal(result.errors[0].patternType, 'crossField');
      assert.equal(result.errors[0].expected, 'startDate < endDate');
    });

    it('should pass validation for successful crossField validation', () => {
      const expected = {
        'match:crossField': 'startDate < endDate',
      };

      const actual = {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      };

      const result = validateWithDetailedAnalysis(expected, actual);

      assert.equal(result.passed, true);
      assert.equal(result.errors.length, 0);
    });

    it('should work with mixed patterns', () => {
      const expected = {
        'match:crossField': 'minValue <= maxValue',
        status: 'active',
        count: 'match:type:number',
      };

      const actual = {
        minValue: 10,
        maxValue: 100,
        status: 'active',
        count: 42,
      };

      const result = validateWithDetailedAnalysis(expected, actual);

      assert.equal(result.passed, true);
      assert.equal(result.errors.length, 0);
    });
  });

  describe('complex scenarios', () => {
    it('should handle date ranges in event data', () => {
      const expected = {
        event: {
          name: 'match:type:string',
          'match:crossField': 'startDate < endDate',
        },
      };

      const actual = {
        event: {
          name: 'Conference 2024',
          startDate: '2024-06-01T09:00:00Z',
          endDate: '2024-06-03T17:00:00Z',
          location: 'San Francisco',
        },
      };

      const result = validateWithDetailedAnalysis(expected, actual);

      assert.equal(result.passed, true);
      assert.equal(result.errors.length, 0);
    });

    it('should handle price range validation', () => {
      const expected = {
        product: {
          'match:crossField': 'discountPrice <= originalPrice',
        },
      };

      const actual = {
        product: {
          name: 'Widget',
          originalPrice: 100,
          discountPrice: 80,
          category: 'electronics',
        },
      };

      const result = validateWithDetailedAnalysis(expected, actual);

      assert.equal(result.passed, true);
      assert.equal(result.errors.length, 0);
    });
  });

  describe('enhanced mixed data type support', () => {
    it('should handle string numbers compared to real numbers', () => {
      const testData = {
        config: {
          maxRetries: '5',  // String number
          timeout: 3000,     // Actual number
        },
      };

      assert.equal(
        handleCrossFieldPattern('crossField:config.timeout > config.maxRetries', testData),
        true,
      );
    });

    it('should handle decimal string numbers', () => {
      const testData = {
        price: '99.99',
        budget: 100.00,
      };

      assert.equal(
        handleCrossFieldPattern('crossField:price < budget', testData),
        true,
      );
    });

    it('should not parse year strings as dates', () => {
      const testData = {
        yearValue: '2023',
        currentYear: 2024,
      };

      assert.equal(
        handleCrossFieldPattern('crossField:yearValue < currentYear', testData),
        true,
      );
    });

    it('should still parse proper date strings as dates', () => {
      const testData = {
        start: '2023-01-01',
        end: '2023-12-31',
      };

      assert.equal(
        handleCrossFieldPattern('crossField:start < end', testData),
        true,
      );
    });
  });

  describe('documentation examples validation', () => {
    it('should handle all nested object examples from docs', () => {
      // event.startTime < event.endTime
      const eventData = {
        event: {
          startTime: '2023-01-01T10:00:00Z',
          endTime: '2023-01-01T12:00:00Z',
        },
      };

      assert.equal(
        handleCrossFieldPattern('crossField:event.startTime < event.endTime', eventData),
        true,
      );

      // pricing.discount <= pricing.maxDiscount
      const pricingData = {
        pricing: {
          discount: 20,
          maxDiscount: 50,
        },
      };

      assert.equal(
        handleCrossFieldPattern('crossField:pricing.discount <= pricing.maxDiscount', pricingData),
        true,
      );

      // user.age >= config.minimumAge
      const userConfigData = {
        user: { age: 25 },
        config: { minimumAge: 18 },
      };

      assert.equal(
        handleCrossFieldPattern('crossField:user.age >= config.minimumAge', userConfigData),
        true,
      );

      // stats.used < stats.limit
      const statsData = {
        stats: {
          used: 75,
          limit: 100,
        },
      };

      assert.equal(
        handleCrossFieldPattern('crossField:stats.used < stats.limit', statsData),
        true,
      );
    });

    it('should handle very deep nesting', () => {
      const deepData = {
        level1: {
          level2: {
            level3: {
              level4: {
                value: 42,
              },
            },
          },
        },
        threshold: 10,
      };

      assert.equal(
        handleCrossFieldPattern('crossField:level1.level2.level3.level4.value > threshold', deepData),
        true,
      );
    });

    it('should handle field names with special characters', () => {
      const specialData = {
        'user-data': {
          'max-count': 100,
        },
        'current-count': 50,
      };

      assert.equal(
        handleCrossFieldPattern('crossField:current-count < user-data.max-count', specialData),
        true,
      );
    });
  });
});
