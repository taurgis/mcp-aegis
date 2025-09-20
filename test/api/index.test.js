import { test, describe, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { loadConfig, connect, createClient, MCPClient, getVersion, getClientInfo } from '../../src/index.js';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

describe('MCP Aegis Jest API', () => {
  const testDir = './test/fixtures/index-api';

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
  });

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

  test('should export getVersion function', () => {
    assert.equal(typeof getVersion, 'function');
  });

  test('should export getClientInfo function', () => {
    assert.equal(typeof getClientInfo, 'function');
  });

  test('should return version information', () => {
    const version = getVersion();
    assert.equal(typeof version, 'string');
    assert.ok(version.length > 0);
  });

  test('should return client information', () => {
    const clientInfo = getClientInfo();
    assert.equal(typeof clientInfo, 'object');
    assert.equal(typeof clientInfo.name, 'string');
    assert.equal(typeof clientInfo.version, 'string');
    assert.ok(clientInfo.name.length > 0);
    assert.ok(clientInfo.version.length > 0);
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

  test('should use default aegis.config.json when no serverConfig provided', async () => {
    // This test should reject since there's no aegis.config.json in the test directory
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

  test('should successfully create client from valid config file path', async () => {
    const configPath = join(testDir, 'valid.config.json');
    const config = {
      name: 'Test Server from File',
      command: 'node',
      args: ['--version'],
    };

    await writeFile(configPath, JSON.stringify(config));

    const client = await createClient(configPath);
    assert.ok(client instanceof MCPClient);
    assert.equal(client.config.name, 'Test Server from File');
    assert.equal(client.connected, false);

    await unlink(configPath);
  });

  test('should successfully connect to server using config file path', async () => {
    const configPath = join(testDir, 'connect-test.config.json');
    const config = {
      name: 'Connect Test Server',
      command: 'node',
      args: ['-e', `
        let buffer = '';
        process.stdin.on('data', (chunk) => {
          buffer += chunk.toString();
          let newlineIndex;
          while ((newlineIndex = buffer.indexOf('\\n')) !== -1) {
            const message = buffer.substring(0, newlineIndex).trim();
            buffer = buffer.substring(newlineIndex + 1);
            if (message) {
              const req = JSON.parse(message);
              if (req.method === 'initialize') {
                process.stdout.write(JSON.stringify({
                  jsonrpc: '2.0',
                  id: req.id,
                  result: { 
                    protocolVersion: '2025-06-18', 
                    capabilities: { tools: {} }, 
                    serverInfo: { name: 'Test', version: '1.0.0' }
                  }
                }) + '\\n');
              } else if (req.method === 'initialized') {
                // No response needed for notification
              }
            }
          }
        });
        process.stdin.on('end', () => process.exit(0));
      `],
    };

    await writeFile(configPath, JSON.stringify(config));

    const client = await connect(configPath);
    assert.ok(client instanceof MCPClient);
    assert.equal(client.config.name, 'Connect Test Server');
    assert.equal(client.connected, true);

    await client.disconnect();
    await unlink(configPath);
  });

  test('should successfully connect using config object', async () => {
    const config = {
      name: 'Connect Test Server with Object',
      command: 'node',
      args: ['-e', `
        let buffer = '';
        process.stdin.on('data', (chunk) => {
          buffer += chunk.toString();
          let newlineIndex;
          while ((newlineIndex = buffer.indexOf('\\n')) !== -1) {
            const message = buffer.substring(0, newlineIndex).trim();
            buffer = buffer.substring(newlineIndex + 1);
            if (message) {
              const req = JSON.parse(message);
              if (req.method === 'initialize') {
                process.stdout.write(JSON.stringify({
                  jsonrpc: '2.0',
                  id: req.id,
                  result: { 
                    protocolVersion: '2025-06-18', 
                    capabilities: { tools: {} }, 
                    serverInfo: { name: 'Test', version: '1.0.0' }
                  }
                }) + '\\n');
              } else if (req.method === 'initialized') {
                // No response needed for notification
              }
            }
          }
        });
        process.stdin.on('end', () => process.exit(0));
      `],
    };

    const client = await connect(config);
    assert.ok(client instanceof MCPClient);
    assert.equal(client.config.name, 'Connect Test Server with Object');
    assert.equal(client.connected, true);

    await client.disconnect();
  });

  test('should handle server connection failures gracefully', async () => {
    const config = {
      name: 'Failing Server',
      command: 'node',
      args: ['-e', 'process.exit(1)'], // Server that immediately exits
    };

    await assert.rejects(
      () => connect(config),
      /Read operation cancelled|Server process exited/,
    );
  });

  test('should handle connection timeout scenarios', async () => {
    const config = {
      name: 'Timeout Server',
      command: 'node',
      args: ['-e', 'setTimeout(() => process.exit(0), 30000)'], // Long-running server that doesn't respond
      startupTimeout: 100, // Very short timeout
    };

    await assert.rejects(
      () => connect(config),
      /timeout|Server process exited/,
    );
  });

  test('should handle edge cases with config objects', async () => {
    // Test createClient with config file that loads successfully but fails validation
    const configPath = join(testDir, 'invalid-config.json');
    const invalidConfig = {
      name: 'Invalid Config',
      // Missing required 'command' field
    };

    await writeFile(configPath, JSON.stringify(invalidConfig));

    await assert.rejects(
      () => createClient(configPath),
      /Missing required configuration fields/,
    );

    await unlink(configPath);
  });

  test('should handle createClient with string config path successfully', async () => {
    const configPath = join(testDir, 'createclient-path.config.json');
    const config = {
      name: 'CreateClient Path Test',
      command: 'node',
      args: ['--version'],
    };

    await writeFile(configPath, JSON.stringify(config));

    const client = await createClient(configPath);
    assert.ok(client instanceof MCPClient);
    assert.equal(client.config.name, 'CreateClient Path Test');
    assert.equal(client.connected, false);

    await unlink(configPath);
  });

  test('should handle parameter type validation for basic types', async () => {
    // Test the specific validation that happens in index.js for basic types only
    await assert.rejects(
      () => connect(42),
      /serverConfig must be a configuration object/,
    );

    await assert.rejects(
      () => createClient(true),
      /serverConfig must be a configuration object/,
    );

    // Skip arrays since they pass the typeof check but fail later - that's expected behavior
  });
});
