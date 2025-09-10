import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { MCPClient } from '../../src/programmatic/MCPClient.js';

describe('MCPClient', () => {
  test('should create client with config', () => {
    const config = {
      name: 'Test Server',
      command: 'node',
      args: ['test.js'],
    };

    const client = new MCPClient(config);
    assert.equal(client.config.name, 'Test Server');
    assert.equal(client.connected, false);
    assert.equal(client.handshakeCompleted, false);
  });

  test('should return correct connection status', () => {
    const config = {
      name: 'Test Server',
      command: 'node',
      args: ['test.js'],
    };

    const client = new MCPClient(config);
    assert.equal(client.isConnected(), false);
  });

  test('should throw error when calling methods without connection', async () => {
    const config = {
      name: 'Test Server',
      command: 'node',
      args: ['test.js'],
    };

    const client = new MCPClient(config);

    await assert.rejects(
      () => client.listTools(),
      /Client is not connected/,
    );

    await assert.rejects(
      () => client.callTool('test', {}),
      /Client is not connected/,
    );

    await assert.rejects(
      () => client.sendMessage({}),
      /Client is not connected/,
    );
  });

  test('should handle stderr operations without connection', () => {
    const config = {
      name: 'Test Server',
      command: 'node',
      args: ['test.js'],
    };

    const client = new MCPClient(config);

    // Should not throw
    assert.equal(client.getStderr(), '');
    client.clearStderr(); // Should not throw
  });

  test('should handle disconnect when not connected', async () => {
    const config = {
      name: 'Test Server',
      command: 'node',
      args: ['test.js'],
    };

    const client = new MCPClient(config);

    // Should not throw
    await client.disconnect();
    assert.equal(client.connected, false);
  });
});
