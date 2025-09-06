import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect, createClient, MCPClient, loadConfig } from '../src/index.js';

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
      /serverConfig must be a configuration object or path to config file/,
    );

    await assert.rejects(
      () => connect(null),
      /serverConfig must be a configuration object or path to config file/,
    );

    await assert.rejects(
      () => createClient(true),
      /serverConfig must be a configuration object or path to config file/,
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
});
