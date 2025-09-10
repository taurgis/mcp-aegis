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
      assert.strictEqual(tools.length, 2, 'Should have exactly two tools');

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
});
