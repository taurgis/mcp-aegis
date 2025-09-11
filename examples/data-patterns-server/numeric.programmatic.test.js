/**
 * Programmatic Test Suite for Numeric Server
 *
 * This test file demonstrates programmatic testing of the numeric patterns
 * using the Node.js test runner with MCP Conductor's programmatic API.
 *
 * To run: node --test examples/data-patterns-server/numeric.programmatic.test.js
 */

import { describe, it, before, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import { connect } from '../../src/index.js';

describe('Data Patterns Server - Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./examples/data-patterns-server/server.config.json');
  });

  after(async () => {
    if (client) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // Clear buffers to prevent test interference
    client.clearAllBuffers();
  });

  describe('Tool Discovery', () => {
    it('should list available tools', async () => {
      const tools = await client.listTools();
      assert.ok(Array.isArray(tools), 'Tools should be an array');
      assert.strictEqual(tools.length, 4, 'Should have exactly four tools');

      const numericTool = tools.find(t => t.name === 'get_numeric_data');
      const timestampTool = tools.find(t => t.name === 'get_timestamp_data');

      assert.ok(numericTool, 'Should have get_numeric_data tool');
      assert.ok(timestampTool, 'Should have get_timestamp_data tool');

      assert.ok(numericTool.description.includes('numeric'), 'Description should mention numeric');
      assert.ok(numericTool.inputSchema, 'Tool should have input schema');
      assert.ok(numericTool.inputSchema.properties.dataset, 'Should have dataset parameter');

      assert.ok(timestampTool.description.includes('timestamp'), 'Timestamp tool description should mention timestamps');
      assert.ok(timestampTool.inputSchema, 'Timestamp tool should have input schema');
    });
  });

  describe('Numeric Data Retrieval', () => {
    it('should return API dataset with numeric values', async () => {
      const result = await client.callTool('get_numeric_data', { dataset: 'api' });

      // Validate structure
      assert.ok(typeof result === 'object', 'Result should be an object');
      assert.ok(typeof result.requestCount === 'number', 'requestCount should be numeric');
      assert.ok(typeof result.errorCount === 'number', 'errorCount should be numeric');
      assert.ok(typeof result.averageResponseTime === 'number', 'averageResponseTime should be numeric');
      assert.ok(typeof result.uptime === 'number', 'uptime should be numeric');
      assert.ok(typeof result.activeUsers === 'number', 'activeUsers should be numeric');
      assert.ok(typeof result.version === 'number', 'version should be numeric');

      // Validate expected ranges (these match what the server returns)
      assert.ok(result.requestCount > 1000, 'requestCount should be > 1000');
      assert.ok(result.errorCount < 10, 'errorCount should be < 10');
      assert.ok(result.averageResponseTime < 200, 'averageResponseTime should be < 200');
      assert.ok(result.uptime > 90, 'uptime should be > 90%');
      assert.ok(result.activeUsers > 500, 'activeUsers should be > 500');
    });

    it('should return performance dataset with numeric values', async () => {
      const result = await client.callTool('get_numeric_data', { dataset: 'performance' });

      // Validate all fields are numeric
      const fields = ['cpuUsage', 'memoryUsage', 'diskUsage', 'responseTime', 'throughput', 'loadAverage'];
      fields.forEach(field => {
        assert.ok(typeof result[field] === 'number', `${field} should be numeric`);
      });

      // Validate reasonable ranges
      assert.ok(result.cpuUsage >= 0 && result.cpuUsage <= 100, 'cpuUsage should be 0-100%');
      assert.ok(result.memoryUsage >= 0 && result.memoryUsage <= 100, 'memoryUsage should be 0-100%');
      assert.ok(result.diskUsage >= 0 && result.diskUsage <= 100, 'diskUsage should be 0-100%');
      assert.ok(result.throughput > 0, 'throughput should be positive');
    });

    it('should return ecommerce dataset with decimal values', async () => {
      const result = await client.callTool('get_numeric_data', { dataset: 'ecommerce' });

      // Validate structure
      assert.ok(typeof result.productCount === 'number', 'productCount should be numeric');
      assert.ok(typeof result.price === 'number', 'price should be numeric');
      assert.ok(typeof result.rating === 'number', 'rating should be numeric');
      assert.ok(typeof result.stock === 'number', 'stock should be numeric');
      assert.ok(typeof result.discountPercent === 'number', 'discountPercent should be numeric');
      assert.ok(typeof result.categoryId === 'number', 'categoryId should be numeric');

      // Validate expected ranges
      assert.ok(result.price > 20 && result.price < 30, 'price should be in range 20-30');
      assert.ok(result.rating >= 4 && result.rating <= 5, 'rating should be 4-5 stars');
      assert.ok(result.discountPercent >= 0 && result.discountPercent <= 100, 'discount should be 0-100%');
      assert.ok(result.stock > 10, 'stock should be > 10');
    });

    it('should return validation dataset', async () => {
      const result = await client.callTool('get_numeric_data', { dataset: 'validation' });

      // Validate structure
      assert.ok(typeof result.score === 'number', 'score should be numeric');
      assert.ok(typeof result.attempts === 'number', 'attempts should be numeric');
      assert.ok(typeof result.successRate === 'number', 'successRate should be numeric');
      assert.ok(typeof result.version === 'number', 'version should be numeric');
      assert.ok(typeof result.priority === 'number', 'priority should be numeric');
      assert.ok(typeof result.retries === 'number', 'retries should be numeric');

      // Validate expected ranges
      assert.ok(result.score >= 0 && result.score <= 100, 'score should be 0-100');
      assert.ok(result.successRate >= 0 && result.successRate <= 100, 'successRate should be 0-100%');
      assert.ok(result.priority >= 1 && result.priority <= 10, 'priority should be 1-10');
      assert.ok(result.attempts >= 1, 'attempts should be >= 1');
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown dataset gracefully', async () => {
      const result = await client.callTool('get_numeric_data', { dataset: 'unknown' });
      assert.ok(result.error, 'Should return error for unknown dataset');
      assert.strictEqual(result.error, 'Unknown dataset', 'Should return specific error message');
    });

    it('should use default dataset when arguments missing', async () => {
      // Server defaults to 'api' dataset when no dataset is provided
      const result = await client.callTool('get_numeric_data', {});

      // Should return the same as explicitly requesting 'api' dataset
      const apiResult = await client.callTool('get_numeric_data', { dataset: 'api' });
      assert.deepStrictEqual(result, apiResult, 'Should return same data as api dataset');

      // Validate it's the expected API dataset structure
      assert.ok(typeof result.requestCount === 'number', 'Should have requestCount');
      assert.ok(typeof result.errorCount === 'number', 'Should have errorCount');
      assert.ok(result.requestCount > 1000, 'Should match api dataset characteristics');
    });

    it('should handle non-existent tool', async () => {
      try {
        await client.callTool('non_existent_tool', {});
        assert.fail('Should throw error for non-existent tool');
      } catch (error) {
        assert.ok(error.message.includes('Failed to call tool'), 'Should indicate tool call failure');
      }
    });
  });

  describe('Server Health', () => {
    it('should maintain connection across multiple calls', async () => {
      // Make multiple calls to ensure server stability
      const datasets = ['api', 'performance', 'ecommerce', 'validation'];

      for (const dataset of datasets) {
        const result = await client.callTool('get_numeric_data', { dataset });
        assert.ok(typeof result === 'object', `Should return object for ${dataset}`);
        assert.ok(Object.keys(result).length > 0, `Should have data for ${dataset}`);
      }
    });

    it('should not accumulate stderr between calls', async () => {
      // Clear stderr and make a call
      client.clearStderr();
      await client.callTool('get_numeric_data', { dataset: 'api' });

      // Check that stderr is minimal (should only have minimal server output)
      const stderr = client.getStderr();
      // Numeric server should have minimal stderr output
      assert.ok(stderr.length < 1000, 'Stderr should be minimal');
    });
  });

  describe('🆕 New Numeric Patterns - Programmatic Validation', () => {
    describe('Equals and NotEquals Patterns', () => {
      it('should validate exact numeric equality', async () => {
        const result = await client.callTool('get_numeric_data', { dataset: 'ecommerce' });

        // Test exact equality
        assert.strictEqual(result.productCount, 42, 'Product count should equal 42');
        assert.strictEqual(result.stock, 15, 'Stock should equal 15');
        assert.strictEqual(result.categoryId, 8, 'Category ID should equal 8');

        // Test inequality
        assert.notStrictEqual(result.categoryId, 10, 'Category ID should not equal 10');
        assert.notStrictEqual(result.discountPercent, 0, 'Discount should not be 0');
      });
    });

    describe('Approximately Pattern', () => {
      it('should validate floating point tolerance', async () => {
        const result = await client.callTool('get_numeric_data', { dataset: 'validation' });

        // Test approximate matching with tolerance
        const successRate = result.successRate; // 95.5
        assert.ok(Math.abs(successRate - 95.5) <= 0.1, 'Success rate should be approximately 95.5 ±0.1');

        const version = result.version; // 2.1
        assert.ok(Math.abs(version - 2.0) <= 0.5, 'Version should be approximately 2.0 ±0.5');

        // Test performance data
        const perfResult = await client.callTool('get_numeric_data', { dataset: 'performance' });
        const loadAverage = perfResult.loadAverage; // 1.2
        assert.ok(Math.abs(loadAverage - 1.2) <= 0.1, 'Load average should be approximately 1.2 ±0.1');
      });
    });

    describe('MultipleOf and DivisibleBy Patterns', () => {
      it('should validate modular arithmetic', async () => {
        const result = await client.callTool('get_numeric_data', { dataset: 'ecommerce' });

        // Test multipleOf validation
        assert.strictEqual(result.productCount % 6, 0, 'Product count (42) should be multiple of 6');
        assert.strictEqual(result.stock % 5, 0, 'Stock (15) should be divisible by 5');
        assert.strictEqual(result.categoryId % 2, 0, 'Category ID (8) should be multiple of 2');

        // Test performance data
        const perfResult = await client.callTool('get_numeric_data', { dataset: 'performance' });
        assert.strictEqual(perfResult.cpuUsage % 1, 0, 'CPU usage should be whole number');
        assert.strictEqual(perfResult.memoryUsage % 1, 0, 'Memory usage should be whole number');
      });
    });

    describe('DecimalPlaces Pattern', () => {
      it('should validate decimal precision', async () => {
        const result = await client.callTool('get_numeric_data', { dataset: 'ecommerce' });

        // Helper function to count decimal places
        const countDecimals = (value) => {
          const str = value.toString();
          const decimalIndex = str.indexOf('.');
          return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
        };

        // Test decimal places
        assert.strictEqual(countDecimals(result.price), 2, 'Price (24.99) should have exactly 2 decimal places');
        assert.strictEqual(countDecimals(result.rating), 1, 'Rating (4.2) should have exactly 1 decimal place');
        assert.strictEqual(countDecimals(result.productCount), 0, 'Product count (42) should have 0 decimal places');
        assert.strictEqual(countDecimals(result.discountPercent), 0, 'Discount percent (12) should have 0 decimal places');

        // Test validation data
        const valResult = await client.callTool('get_numeric_data', { dataset: 'validation' });
        assert.strictEqual(countDecimals(valResult.successRate), 1, 'Success rate (95.5) should have 1 decimal place');
        assert.strictEqual(countDecimals(valResult.score), 0, 'Score (87) should have 0 decimal places');
      });
    });

    describe('Advanced Pattern Combinations', () => {
      it('should demonstrate complex business logic validation', async () => {
        const result = await client.callTool('get_numeric_data', { dataset: 'ecommerce' });

        // Currency validation: price should have exactly 2 decimal places
        const priceStr = result.price.toString();
        const priceDecimals = priceStr.includes('.') ? priceStr.split('.')[1].length : 0;
        assert.strictEqual(priceDecimals, 2, 'Price should be in currency format (2 decimal places)');

        // Stock validation: should be non-zero and whole number
        assert.notStrictEqual(result.stock, 0, 'Stock should not be zero (in stock)');
        assert.strictEqual(result.stock % 1, 0, 'Stock should be whole number');

        // Category validation: should be valid category ID (multiple of 2)
        assert.strictEqual(result.categoryId % 2, 0, 'Category ID should be valid (multiple of 2)');

        // Discount validation: should be whole percent
        assert.strictEqual(result.discountPercent % 1, 0, 'Discount should be whole percent');
      });

      it('should validate performance metrics with tolerance', async () => {
        const result = await client.callTool('get_numeric_data', { dataset: 'performance' });

        // CPU and memory should be whole numbers (no fractional percentages)
        assert.strictEqual(result.cpuUsage % 1, 0, 'CPU usage should be whole percentage');
        assert.strictEqual(result.memoryUsage % 1, 0, 'Memory usage should be whole percentage');

        // Load average should be reasonable (approximately 1.2)
        assert.ok(Math.abs(result.loadAverage - 1.2) <= 0.1, 'Load average should be approximately 1.2');

        // Memory and CPU should not be equal (different metrics)
        assert.notStrictEqual(result.memoryUsage, result.cpuUsage, 'Memory and CPU usage should be different');
      });
    });

    describe('Real-world Validation Scenarios', () => {
      it('should validate API metrics with new patterns', async () => {
        const result = await client.callTool('get_numeric_data', { dataset: 'api' });

        // Request count should be exactly what we expect
        assert.strictEqual(result.requestCount, 1250, 'Request count should be exactly 1250');

        // Error count should be low and whole number
        assert.strictEqual(result.errorCount % 1, 0, 'Error count should be whole number');
        assert.notStrictEqual(result.errorCount, 0, 'Error count should not be zero (some errors expected)');

        // Version should be approximately 2.x
        assert.ok(Math.abs(result.version - 2.0) <= 1.0, 'Version should be approximately 2.x');

        // Uptime should have decimal precision
        const uptimeStr = result.uptime.toString();
        const uptimeDecimals = uptimeStr.includes('.') ? uptimeStr.split('.')[1].length : 0;
        assert.ok(uptimeDecimals > 0, 'Uptime should have decimal precision');
      });

      it('should validate validation dataset with comprehensive checks', async () => {
        const result = await client.callTool('get_numeric_data', { dataset: 'validation' });

        // Score should be passing grade (not equal to failing scores)
        assert.notStrictEqual(result.score, 50, 'Score should not be failing (50)');
        assert.notStrictEqual(result.score, 60, 'Score should not be minimum passing (60)');

        // Attempts should be low (not multiple of high numbers)
        assert.notStrictEqual(result.attempts % 5, 0, 'Attempts should not be multiple of 5 (efficient)');

        // Success rate should be high precision
        const successRateStr = result.successRate.toString();
        assert.ok(successRateStr.includes('.'), 'Success rate should have decimal precision');

        // Priority should be reasonable (not maximum)
        assert.notStrictEqual(result.priority, 10, 'Priority should not be maximum (10)');
      });
    });
  });
});
