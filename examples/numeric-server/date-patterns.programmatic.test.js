#!/usr/bin/env node
/**
 * Date Patterns Programmatic Tests
 * Tests the programmatic API for date pattern validation
 */

import { strict as assert } from 'assert';
import { describe, it, before, after, beforeEach } from 'node:test';
import { connect } from '../../src/index.js';

describe('Date Pattern Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./examples/numeric-server/server.config.json');
  });

  after(async () => {
    if (client) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    client.clearAllBuffers();
  });

  describe('Basic date validation patterns', () => {
    it('should validate timestamp data using dateValid pattern', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'iso' });

      // Validate that all timestamp fields are valid dates
      assert.ok(result.createdAt, 'Should have createdAt field');
      assert.ok(result.updatedAt, 'Should have updatedAt field');
      assert.ok(result.publishDate, 'Should have publishDate field');
      assert.ok(result.expireDate, 'Should have expireDate field');
      assert.ok(result.validDate, 'Should have validDate field');

      // Validate that these are actual valid dates
      assert.ok(!isNaN(Date.parse(result.createdAt)), 'createdAt should be a valid date');
      assert.ok(!isNaN(Date.parse(result.updatedAt)), 'updatedAt should be a valid date');
      assert.ok(!isNaN(Date.parse(result.publishDate)), 'publishDate should be a valid date');
      assert.ok(!isNaN(Date.parse(result.expireDate)), 'expireDate should be a valid date');
      assert.ok(!isNaN(Date.parse(result.validDate)), 'validDate should be a valid date');
    });

    it('should validate timestamp numbers as valid dates', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'timestamp' });

      // Validate that all timestamp numbers are valid
      assert.ok(typeof result.createdAt === 'number', 'createdAt should be a number');
      assert.ok(typeof result.updatedAt === 'number', 'updatedAt should be a number');
      assert.ok(typeof result.publishTimestamp === 'number', 'publishTimestamp should be a number');

      // Validate that these numbers represent valid dates
      assert.ok(!isNaN(new Date(result.createdAt).getTime()), 'createdAt timestamp should be valid');
      assert.ok(!isNaN(new Date(result.updatedAt).getTime()), 'updatedAt timestamp should be valid');
      assert.ok(!isNaN(new Date(result.publishTimestamp).getTime()), 'publishTimestamp should be valid');
    });
  });

  describe('Date comparison patterns', () => {
    it('should validate dateAfter pattern programmatically', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'iso' });

      // Test that recent timestamps are after 2023
      const createdAt = new Date(result.createdAt);
      const jan2023 = new Date('2023-01-01');
      assert.ok(createdAt > jan2023, 'createdAt should be after 2023-01-01');

      // Test that publish date is after 2023
      const publishDate = new Date(result.publishDate);
      assert.ok(publishDate > jan2023, 'publishDate should be after 2023-01-01');
    });

    it('should validate dateBefore pattern programmatically', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'iso' });

      // Test that publish date is before 2024
      const publishDate = new Date(result.publishDate);
      const jan2024 = new Date('2024-01-01');
      assert.ok(publishDate < jan2024, 'publishDate should be before 2024-01-01');

      // Test that expire date is before 2025
      const expireDate = new Date(result.expireDate);
      const jan2025 = new Date('2025-01-01');
      assert.ok(expireDate < jan2025, 'expireDate should be before 2025-01-01');
    });

    it('should validate dateBetween pattern programmatically', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'iso' });

      // Test that publish date is between 2023 and 2024
      const publishDate = new Date(result.publishDate);
      const jan2023 = new Date('2023-01-01');
      const jan2024 = new Date('2024-01-01');
      assert.ok(publishDate >= jan2023 && publishDate <= jan2024,
        'publishDate should be between 2023-01-01 and 2024-01-01');
    });

    it('should validate dateAge pattern programmatically', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'iso' });

      // Test that created and updated timestamps are recent (within 1 day)
      const now = new Date();
      const createdAt = new Date(result.createdAt);
      const updatedAt = new Date(result.updatedAt);

      const oneDayMs = 24 * 60 * 60 * 1000;
      const createdAge = now.getTime() - createdAt.getTime();
      const updatedAge = now.getTime() - updatedAt.getTime();

      assert.ok(createdAge <= oneDayMs, 'createdAt should be within last day');
      assert.ok(updatedAge <= oneDayMs, 'updatedAt should be within last day');
    });

    it('should validate dateEquals pattern programmatically', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'iso' });

      // Test exact date matches for fixed dates
      assert.strictEqual(result.publishDate, '2023-05-15T14:30:00.000Z', 'publishDate should match exactly');
      assert.strictEqual(result.expireDate, '2024-12-31T23:59:59.999Z', 'expireDate should match exactly');
      assert.strictEqual(result.validDate, '2023-01-01T12:00:00Z', 'validDate should match exactly');
    });
  });

  describe('Date format validation', () => {
    it('should validate different date formats', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'mixed' });

      // Test ISO format
      assert.ok(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(result.isoDate),
        'isoDate should match ISO format');

      // Test ISO date format
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(result.dateString),
        'dateString should match ISO date format');

      // Test ISO time format
      assert.ok(/^\d{2}:\d{2}:\d{2}(\.\d{3})?$/.test(result.timeString),
        'timeString should match ISO time format');

      // Test US date format
      assert.ok(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(result.usFormat),
        'usFormat should match US date format');
    });
  });

  describe('Date pattern negation validation', () => {
    it('should validate invalid dates are NOT valid', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'mixed' });

      // Test that invalid date strings fail validation
      assert.ok(isNaN(Date.parse(result.invalidDate)), 'invalidDate should not be a valid date');
      assert.ok(isNaN(Date.parse(result.emptyDate)), 'emptyDate should not be a valid date');
      assert.strictEqual(result.nullDate, null, 'nullDate should be null');
    });

    it('should validate negated date comparisons', async () => {
      const result = await client.callTool('get_timestamp_data', { format: 'mixed' });

      // Test that current ISO date is NOT before 2024 (it's 2025)
      const isoDate = new Date(result.isoDate);
      const jan2024 = new Date('2024-01-01');
      assert.ok(!(isoDate < jan2024), 'isoDate should NOT be before 2024-01-01');

      // Test that date string (2023-06-15) is NOT after 2024
      const dateString = new Date(result.dateString);
      const jan2024Date = new Date('2024-01-01');
      assert.ok(!(dateString > jan2024Date), 'dateString should NOT be after 2024-01-01');
    });
  });

  describe('Timestamp dataset validation', () => {
    it('should validate timestamp data from numeric dataset', async () => {
      const result = await client.callTool('get_numeric_data', { dataset: 'timestamps' });

      // Validate that current time is recent
      const currentTime = new Date(result.currentTime);
      const now = new Date();
      const timeDiff = Math.abs(now.getTime() - currentTime.getTime());
      const oneHour = 60 * 60 * 1000;
      assert.ok(timeDiff <= oneHour, 'currentTime should be within last hour');

      // Validate fixed dates match exactly
      assert.strictEqual(result.fixedDate, '2023-06-15T10:30:00.000Z', 'fixedDate should match exactly');
      assert.strictEqual(result.fixedTimestamp, 1687686600000, 'fixedTimestamp should match exactly');

      // Validate that validDateString is a valid date
      assert.ok(!isNaN(Date.parse(result.validDateString)), 'validDateString should be valid');

      // Validate that invalidDateString is not a valid date
      assert.ok(isNaN(Date.parse(result.invalidDateString)), 'invalidDateString should be invalid');
    });
  });

  describe('Comprehensive date pattern integration', () => {
    it('should handle complex date validation scenarios', async () => {
      const tools = await client.listTools();
      assert.ok(Array.isArray(tools), 'Should return array of tools');

      const timestampTool = tools.find(tool => tool.name === 'get_timestamp_data');
      assert.ok(timestampTool, 'Should have get_timestamp_data tool');
      assert.ok(timestampTool.description.includes('timestamp'), 'Description should mention timestamps');

      // Test multiple formats
      const isoResult = await client.callTool('get_timestamp_data', { format: 'iso' });
      const timestampResult = await client.callTool('get_timestamp_data', { format: 'timestamp' });
      const mixedResult = await client.callTool('get_timestamp_data', { format: 'mixed' });

      // Validate structure consistency
      assert.ok(isoResult.createdAt, 'ISO result should have createdAt');
      assert.ok(timestampResult.createdAt, 'Timestamp result should have createdAt');
      assert.ok(mixedResult.isoDate, 'Mixed result should have isoDate');

      // Validate type consistency
      assert.ok(typeof isoResult.createdAt === 'string', 'ISO createdAt should be string');
      assert.ok(typeof timestampResult.createdAt === 'number', 'Timestamp createdAt should be number');
      assert.ok(typeof mixedResult.isoDate === 'string', 'Mixed isoDate should be string');
    });
  });
});
