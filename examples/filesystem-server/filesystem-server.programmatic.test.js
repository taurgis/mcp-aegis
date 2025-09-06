import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from '../../src/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Filesystem Server Programmatic Integration', () => {
  let client;

  before(async () => {
    // Connect to the filesystem server using inline config
    client = await connect({
      name: 'Simple Filesystem Server',
      command: 'node',
      args: ['./server.js'],
      cwd: join(__dirname, './'),
      startupTimeout: 5000
    });
  });

  after(async () => {
    // Clean up the connection
    if (client) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // Clear stderr before each test
    client.clearStderr();
  });

  test('should list available tools', async () => {
    const tools = await client.listTools();
    
    assert.equal(tools.length, 1);
    assert.deepStrictEqual(tools[0], {
      name: 'read_file',
      description: 'Reads a file',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string'
          }
        },
        required: ['path']
      }
    });
  });

  test('should successfully read an existing file', async () => {
    const result = await client.callTool('read_file', {
      path: '../shared-test-data/hello.txt'
    });

    assert.deepStrictEqual(result, {
      content: [{
        type: 'text',
        text: 'Hello, MCP Conductor!'
      }],
      isError: false
    });
    
    // Verify no stderr output
    assert.equal(client.getStderr(), '');
  });

  test('should return an error for a non-existent file', async () => {
    const result = await client.callTool('read_file', {
      path: 'non-existent-file.txt'
    });

    assert.equal(result.isError, true);
    assert.equal(result.content.length, 1);
    assert.equal(result.content[0].type, 'text');
    assert.match(result.content[0].text, /File not found.*ENOENT.*no such file or directory/);
  });

  test('should handle file with numbers using regex patterns', async () => {
    const result = await client.callTool('read_file', {
      path: '../shared-test-data/numbers.txt'
    });

    assert.equal(result.isError, false);
    
    // Use regex matching like the YAML tests
    const content = result.content[0].text;
    assert.match(content, /\d+/); // Contains numbers
    assert.match(content, /42/);  // Contains specific number
    assert.match(content, /\d{3}/); // Contains 3-digit number
  });

  test('should verify stderr is empty for successful operations', async () => {
    await client.callTool('read_file', {
      path: '../shared-test-data/hello.txt'
    });

    assert.equal(client.getStderr(), '');
  });

  test('should handle direct JSON-RPC message sending', async () => {
    const response = await client.sendMessage({
      jsonrpc: '2.0',
      id: 'custom-test-1',
      method: 'tools/call',
      params: {
        name: 'read_file',
        arguments: {
          path: '../shared-test-data/status.txt'
        }
      }
    });

    assert.equal(response.jsonrpc, '2.0');
    assert.equal(response.id, 'custom-test-1');
    assert.equal(response.result.isError, false);
    assert.equal(response.result.content.length, 1);
    assert.equal(response.result.content[0].type, 'text');
    assert.match(response.result.content[0].text, /Processing completed successfully|Operation success/);
  });
});
