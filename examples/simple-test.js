import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from '../src/index.js';

test('simple connection test', async () => {
  console.log('Starting test...');

  try {
    const client = await connect({
      name: 'Simple Filesystem Server',
      command: 'node',
      args: ['./server.js'],
      cwd: './filesystem-server',
      startupTimeout: 5000,
    });
    console.log('Connected successfully');

    // Try raw message first
    console.log('Sending raw message...');
    const rawResponse = await client.sendMessage({
      jsonrpc: '2.0',
      id: 'test-1',
      method: 'tools/list',
      params: {},
    });
    console.log('Raw response:', JSON.stringify(rawResponse, null, 2));

    await client.disconnect();
    console.log('Disconnected successfully');

    assert.ok(true);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
});
