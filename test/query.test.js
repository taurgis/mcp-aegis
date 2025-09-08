import { test, describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { validateQueryCommand, executeQueryCommand } from '../src/cli/commands/query.js';
import { OutputManager } from '../src/cli/interface/output.js';
import { MCPClient } from '../src/programmatic/MCPClient.js';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

describe('Query Command Tests', () => {
  const testDir = './test/fixtures/query';

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
  });

  describe('validateQueryCommand', () => {
    it('should validate tool arguments successfully with valid JSON', () => {
      const options = { config: 'test.json' };
      const result = validateQueryCommand('test_tool', '{"key": "value"}', options);
      
      assert.deepEqual(result, { key: 'value' });
    });

    it('should return empty object when no tool arguments provided', () => {
      const options = { config: 'test.json' };
      const result = validateQueryCommand('test_tool', undefined, options);
      
      assert.deepEqual(result, {});
    });

    it('should return empty object when empty string provided', () => {
      const options = { config: 'test.json' };
      const result = validateQueryCommand('test_tool', '', options);
      
      assert.deepEqual(result, {});
    });

    it('should throw error for invalid JSON', () => {
      const options = { config: 'test.json' };
      
      assert.throws(() => {
        validateQueryCommand('test_tool', 'invalid json', options);
      }, /Invalid JSON for tool arguments/);
    });

    it('should throw error when tool arguments is not an object', () => {
      const options = { config: 'test.json' };
      
      assert.throws(() => {
        validateQueryCommand('test_tool', '["array"]', options);
      }, /Tool arguments must be a JSON object/);
    });

    it('should throw error when tool arguments is null', () => {
      const options = { config: 'test.json' };
      
      assert.throws(() => {
        validateQueryCommand('test_tool', 'null', options);
      }, /Tool arguments must be a JSON object/);
    });

    it('should validate complex nested objects', () => {
      const options = { config: 'test.json' };
      const complexJson = JSON.stringify({
        nested: { key: 'value' },
        array: [1, 2, 3],
        boolean: true,
        number: 42,
      });
      
      const result = validateQueryCommand('test_tool', complexJson, options);
      
      assert.deepEqual(result, {
        nested: { key: 'value' },
        array: [1, 2, 3],
        boolean: true,
        number: 42,
      });
    });
  });

  describe('executeQueryCommand', () => {
    it('should handle missing config file', async () => {
      const options = { config: './nonexistent.json', quiet: false, json: false };
      const output = new OutputManager(options);
      let errorMessage = '';
      
      // Mock the output.logError method to capture the error
      const originalLogError = output.logError;
      output.logError = (message) => {
        errorMessage = message;
      };

      const result = await executeQueryCommand('test_tool', {}, options, output);
      
      assert.equal(result, false);
      assert.ok(errorMessage.includes('Configuration file not found'));
    });

    it('should handle server startup failure', async () => {
      const configPath = join(testDir, 'bad-server.config.json');
      const config = {
        name: 'Bad Test Server',
        command: 'node',
        args: ['-e', 'process.exit(1)'], // Server that immediately exits
      };

      await writeFile(configPath, JSON.stringify(config));

      const options = { config: configPath, quiet: false, json: false };
      const output = new OutputManager(options);
      let errorCaptured = false;
      
      // Mock the output.logError method
      const originalLogError = output.logError;
      output.logError = (message) => {
        if (message.includes('Query failed')) {
          errorCaptured = true;
        }
      };

      const result = await executeQueryCommand('test_tool', {}, options, output);
      
      assert.equal(result, false);
      assert.ok(errorCaptured);

      await unlink(configPath);
    });

    it('should list tools when no tool name provided', async () => {
      const configPath = join(testDir, 'list-tools.config.json');
      const config = {
        name: 'List Tools Test Server',
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
                    result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'Test', version: '1.0.0' }}
                  }) + '\\n');
                } else if (req.method === 'initialized') {
                  // No response needed for notification
                } else if (req.method === 'tools/list') {
                  process.stdout.write(JSON.stringify({
                    jsonrpc: '2.0',
                    id: req.id,
                    result: { 
                      tools: [
                        { name: 'read_file', description: 'Reads a file' },
                        { name: 'write_file', description: 'Writes a file' }
                      ] 
                    }
                  }) + '\\n');
                }
              }
            }
          });
          process.stdin.on('end', () => process.exit(0));
        `],
      };

      await writeFile(configPath, JSON.stringify(config));

      const options = { config: configPath, quiet: false, json: false };
      const output = new OutputManager(options);
      const logMessages = [];
      
      // Mock the output.logInfo method to capture messages
      const originalLogInfo = output.logInfo;
      output.logInfo = (message) => {
        logMessages.push(message);
      };

      const result = await executeQueryCommand(null, {}, options, output);
      
      assert.equal(result, true);
      const allMessages = logMessages.join(' ');
      assert.ok(allMessages.includes('read_file'));
      assert.ok(allMessages.includes('write_file'));

      await unlink(configPath);
    });

    it('should call tool with arguments', async () => {
      const configPath = join(testDir, 'call-tool.config.json');
      const config = {
        name: 'Call Tool Test Server',
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
                    result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'Test', version: '1.0.0' }}
                  }) + '\\n');
                } else if (req.method === 'initialized') {
                  // No response needed for notification
                } else if (req.method === 'tools/call') {
                  if (req.params.name === 'echo') {
                    process.stdout.write(JSON.stringify({
                      jsonrpc: '2.0',
                      id: req.id,
                      result: { 
                        content: [{ type: 'text', text: 'Echo: ' + req.params.arguments.message }],
                        isError: false
                      }
                    }) + '\\n');
                  }
                }
              }
            }
          });
          process.stdin.on('end', () => process.exit(0));
        `],
      };

      await writeFile(configPath, JSON.stringify(config));

      const options = { config: configPath, quiet: false, json: false };
      const output = new OutputManager(options);
      const logMessages = [];
      let consoleOutput = '';
      
      // Mock the output.logInfo method and console.log
      const originalLogInfo = output.logInfo;
      const originalConsoleLog = console.log;
      output.logInfo = (message) => {
        logMessages.push(message);
      };
      console.log = (message) => {
        consoleOutput += message;
      };

      const result = await executeQueryCommand('echo', { message: 'Hello World' }, options, output);
      
      // Restore console.log
      console.log = originalConsoleLog;
      
      assert.equal(result, true);
      const allMessages = logMessages.join(' ');
      assert.ok(allMessages.includes('Calling tool: echo'));
      assert.ok(consoleOutput.includes('Echo: Hello World'));

      await unlink(configPath);
    });

    it('should handle tool call errors', async () => {
      const configPath = join(testDir, 'error-tool.config.json');
      const config = {
        name: 'Error Tool Test Server',
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
                    result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'Test', version: '1.0.0' }}
                  }) + '\\n');
                } else if (req.method === 'initialized') {
                  // No response needed for notification
                } else if (req.method === 'tools/call') {
                  process.stdout.write(JSON.stringify({
                    jsonrpc: '2.0',
                    id: req.id,
                    error: { code: -32000, message: 'Custom tool error' }
                  }) + '\\n');
                }
              }
            }
          });
          process.stdin.on('end', () => process.exit(0));
        `],
      };

      await writeFile(configPath, JSON.stringify(config));

      const options = { config: configPath, quiet: false, json: false };
      const output = new OutputManager(options);
      const errorMessages = [];
      
      // Mock the output.logError method
      const originalLogError = output.logError;
      output.logError = (message) => {
        errorMessages.push(message);
      };

      const result = await executeQueryCommand('failing_tool', {}, options, output);
      
      assert.equal(result, false);
      const allErrors = errorMessages.join(' ');
      assert.ok(allErrors.includes('Query failed'));
      assert.ok(allErrors.includes('Custom tool error'));

      await unlink(configPath);
    });

    it('should handle empty tools list', async () => {
      const configPath = join(testDir, 'empty-tools.config.json');
      const config = {
        name: 'Empty Tools Test Server',
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
                    result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'Test', version: '1.0.0' }}
                  }) + '\\n');
                } else if (req.method === 'initialized') {
                  // No response needed for notification
                } else if (req.method === 'tools/list') {
                  process.stdout.write(JSON.stringify({
                    jsonrpc: '2.0',
                    id: req.id,
                    result: { tools: [] }
                  }) + '\\n');
                }
              }
            }
          });
          process.stdin.on('end', () => process.exit(0));
        `],
      };

      await writeFile(configPath, JSON.stringify(config));

      const options = { config: configPath, quiet: false, json: false };
      const output = new OutputManager(options);
      const logMessages = [];
      
      // Mock the output.logInfo method
      const originalLogInfo = output.logInfo;
      output.logInfo = (message) => {
        logMessages.push(message);
      };

      const result = await executeQueryCommand(null, {}, options, output);
      
      assert.equal(result, true);
      const allMessages = logMessages.join(' ');
      assert.ok(allMessages.includes('No tools available'));

      await unlink(configPath);
    });
  });
});
