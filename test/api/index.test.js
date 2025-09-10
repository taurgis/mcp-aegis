import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { loadConfig, connect, createClient, MCPClient } from '../../src/index.js';

describe('MCP Conductor Jest API', () => {
  test('should export connect function', () => {
    assert.equal(typeof connect, 'function');
  });

  test('should export createClient function', () => {
    assert.equal(typeof createClient, 'function');
  });

  test('should export MCPClient class', () => {
    assert.equal(typeof MCPClient, 'function');
    assert.equal(MCPClient.name, 'MCPClient');
  });

  test('should export loadConfig function', () => {
    assert.equal(typeof loadConfig, 'function');
  });

  test('should reject invalid serverConfig types', async () => {
    await assert.rejects(
      () => connect(123),
      /serverConfig must be a configuration object, path to config file, or undefined/,
    );

    await assert.rejects(
      () => createClient(true),
      /serverConfig must be a configuration object, path to config file, or undefined/,
    );
  });

  test('should create client with object config', async () => {
    const config = {
      name: 'Test Server',
      command: 'node',
      args: ['test.js'],
    };

    const client = await createClient(config);
    assert.ok(client instanceof MCPClient);
    assert.equal(client.config.name, 'Test Server');
    assert.equal(client.connected, false);
  });

  test('should reject invalid config file paths', async () => {
    await assert.rejects(
      () => connect('./non-existent-config.json'),
      /Configuration file not found/,
    );

    await assert.rejects(
      () => createClient('./invalid-path.json'),
      /Configuration file not found/,
    );
  });

  test('should use default conductor.config.json when no serverConfig provided', async () => {
    // This test should reject since there's no conductor.config.json in the test directory
    await assert.rejects(
      () => createClient(),
      /Configuration file not found/,
    );

    await assert.rejects(
      () => createClient(null),
      /Configuration file not found/,
    );

    await assert.rejects(
      () => createClient(undefined),
      /Configuration file not found/,
    );
  });
});
