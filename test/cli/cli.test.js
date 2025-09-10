import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

describe('CLI Integration Tests', () => {
  const testDir = './test/fixtures/cli';

  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
  });

  describe('conductor CLI', () => {
    it('should run successful tests via CLI', async () => {
      const configPath = join(testDir, 'cli-test.config.json');
      const testPath = join(testDir, 'cli-test.test.mcp.yml');

      // Use a longer-lived mock server
      const config = {
        name: 'CLI Test Server',
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
                } else if (req.method === 'tools/list') {
                  process.stdout.write(JSON.stringify({
                    jsonrpc: '2.0',
                    id: req.id,
                    result: { tools: [{ name: 'read_file', description: 'Read a file' }] }
                  }) + '\\n');
                }
              }
            }
          });
          process.stdin.on('end', () => process.exit(0));
        `],
        startupTimeout: 2000,
      };

      const testContent = `description: "CLI test suite"
tests:
  - it: "should list tools"
    request:
      jsonrpc: "2.0"
      id: 1
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: 1
        result:
          tools:
            - name: "read_file"
              description: "Read a file"
`;

      await writeFile(configPath, JSON.stringify(config, null, 2));
      await writeFile(testPath, testContent);

      // Run the CLI
      const result = await runCLI([testPath, '--config', configPath]);

      if (result.exitCode !== 0) {
        console.log('CLI stdout:', result.stdout);
        console.log('CLI stderr:', result.stderr);
      }

      assert.equal(result.exitCode, 0);
      assert.ok(result.stdout.includes('✓ PASS'));
      assert.ok(result.stdout.includes('All tests passed'));

      await unlink(configPath);
      await unlink(testPath);
    });

    it('should fail with non-existent config', async () => {
      const result = await runCLI(['./test.yml', '--config', './nonexistent.json']);

      assert.equal(result.exitCode, 1);
      assert.ok(result.stderr.includes('Configuration file not found'));
    });

    it('should handle no test files found', async () => {
      const configPath = join(testDir, 'empty-test.config.json');
      const config = {
        name: 'Empty Test',
        command: 'echo',
        args: ['test'],
      };

      await writeFile(configPath, JSON.stringify(config));

      const result = await runCLI(['./nonexistent/**/*.yml', '--config', configPath]);

      assert.equal(result.exitCode, 0);
      assert.ok(result.stdout.includes('No test files found'));

      await unlink(configPath);
    });

    it('should show help when no arguments provided', async () => {
      const result = await runCLI(['--help']);

      assert.equal(result.exitCode, 0);
      assert.ok(result.stdout.includes('Usage:'));
      assert.ok(result.stdout.includes('conductor'));
    });

    it('should handle test failures correctly', async () => {
      const configPath = join(testDir, 'fail-test.config.json');
      const testPath = join(testDir, 'fail-test.test.mcp.yml');

      const config = {
        name: 'Fail Test Server',
        command: 'node',
        args: ['./examples/filesystem-server/server.js'],
      };

      const testContent = `
description: "Failing test"
tests:
  - it: "should fail"
    request:
      jsonrpc: "2.0"
      id: "fail-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "fail-1"
        result:
          tools:
            - name: "nonexistent_tool"
              description: "This should fail"
`;

      await writeFile(configPath, JSON.stringify(config, null, 2));
      await writeFile(testPath, testContent);

      const result = await runCLI([testPath, '--config', configPath]);

      assert.equal(result.exitCode, 1);
      assert.ok(result.stdout.includes('✗ FAIL'));
      assert.ok(result.stdout.includes('test(s) failed'));

      await unlink(configPath);
      await unlink(testPath);
    });
  });

  describe('configuration edge cases', () => {
    it('should handle invalid configuration JSON', async () => {
      const configPath = join(testDir, 'invalid.config.json');
      await writeFile(configPath, '{ invalid json }');

      const result = await runCLI(['./test.yml', '--config', configPath]);

      assert.equal(result.exitCode, 1);
      assert.ok(result.stderr.includes('Error:'));

      await unlink(configPath);
    });

    it('should handle missing required config fields', async () => {
      const configPath = join(testDir, 'incomplete.config.json');
      const incompleteConfig = {
        name: 'Incomplete Config',
        // Missing command and args
      };

      await writeFile(configPath, JSON.stringify(incompleteConfig));

      const result = await runCLI(['./test.yml', '--config', configPath]);

      assert.equal(result.exitCode, 1);
      assert.ok(result.stderr.includes('Missing required configuration fields'));

      await unlink(configPath);
    });

    describe('query command', () => {
      it('should list available tools when no tool name provided', async () => {
        const configPath = join(testDir, 'query-list.config.json');

        const config = {
          name: 'Query List Test Server',
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
                          { name: 'read_file', description: 'Reads a file', inputSchema: { properties: { path: { type: 'string' } } } },
                          { name: 'calculator', description: 'Performs calculations', inputSchema: { properties: { expression: { type: 'string' } } } }
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

        const result = await runCLI(['query', '--config', configPath]);

        assert.equal(result.exitCode, 0);
        assert.ok(result.stdout.includes('Listing available tools:'));
        assert.ok(result.stdout.includes('read_file'));
        assert.ok(result.stdout.includes('calculator'));
        assert.ok(result.stdout.includes('Reads a file'));
        assert.ok(result.stdout.includes('Performs calculations'));
        assert.ok(result.stdout.includes('path'));
        assert.ok(result.stdout.includes('expression'));

        await unlink(configPath);
      });

      it('should call a specific tool with arguments', async () => {
        const configPath = join(testDir, 'query-call.config.json');

        const config = {
          name: 'Query Call Test Server',
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
                    if (req.params.name === 'read_file') {
                      process.stdout.write(JSON.stringify({
                        jsonrpc: '2.0',
                        id: req.id,
                        result: { 
                          content: [{ type: 'text', text: 'File contents: Hello World!' }],
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

        const result = await runCLI(['query', 'read_file', '{"path": "/test/file.txt"}', '--config', configPath]);

        assert.equal(result.exitCode, 0);
        assert.ok(result.stdout.includes('Calling tool: read_file'));
        assert.ok(result.stdout.includes('Arguments:'));
        assert.ok(result.stdout.includes('"/test/file.txt"'));
        assert.ok(result.stdout.includes('Result:'));
        assert.ok(result.stdout.includes('Hello World!'));

        await unlink(configPath);
      });

      it('should handle tool call failures gracefully', async () => {
        const configPath = join(testDir, 'query-fail.config.json');

        const config = {
          name: 'Query Fail Test Server',
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
                      error: { code: -32601, message: 'Tool not found' }
                    }) + '\\n');
                  }
                }
              }
            });
            process.stdin.on('end', () => process.exit(0));
          `],
        };

        await writeFile(configPath, JSON.stringify(config));

        const result = await runCLI(['query', 'nonexistent_tool', '{}', '--config', configPath]);

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes('Query failed'));
        assert.ok(result.stderr.includes('Tool not found'));

        await unlink(configPath);
      });

      it('should handle invalid JSON arguments', async () => {
        const configPath = join(testDir, 'query-json.config.json');

        const config = {
          name: 'Query JSON Test Server',
          command: 'echo',
          args: ['test'],
        };

        await writeFile(configPath, JSON.stringify(config));

        const result = await runCLI(['query', 'test_tool', 'invalid json', '--config', configPath]);

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes('Invalid JSON for tool arguments'));

        await unlink(configPath);
      });

      it('should handle missing config file', async () => {
        const result = await runCLI(['query', '--config', './nonexistent-config.json']);

        assert.equal(result.exitCode, 1);
        assert.ok(result.stderr.includes('Configuration file not found'));
      });

      it('should support JSON output format', async () => {
        const configPath = join(testDir, 'query-json-output.config.json');

        const config = {
          name: 'Query JSON Output Test Server',
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
                      result: { content: [{ type: 'text', text: 'Success' }], isError: false }
                    }) + '\\n');
                  }
                }
              }
            });
            process.stdin.on('end', () => process.exit(0));
          `],
        };

        await writeFile(configPath, JSON.stringify(config));

        const result = await runCLI(['query', 'test_tool', '{}', '--config', configPath, '--json']);

        assert.equal(result.exitCode, 0);
        // Should contain JSON result structure
        assert.ok(result.stdout.includes('"content"'));
        assert.ok(result.stdout.includes('"type": "text"'));

        await unlink(configPath);
      });

      it('should support quiet mode', async () => {
        const configPath = join(testDir, 'query-quiet.config.json');

        const config = {
          name: 'Query Quiet Test Server',
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
                      result: { tools: [{ name: 'test_tool', description: 'Test tool' }] }
                    }) + '\\n');
                  }
                }
              }
            });
            process.stdin.on('end', () => process.exit(0));
          `],
        };

        await writeFile(configPath, JSON.stringify(config));

        const result = await runCLI(['query', '--config', configPath, '--quiet']);

        assert.equal(result.exitCode, 0);
        // In quiet mode, should have minimal output
        assert.ok(!result.stdout.includes('🔧 Loaded server'));
        assert.ok(!result.stdout.includes('🚀 Starting server'));

        await unlink(configPath);
      });

      it('should show help for query command', async () => {
        const result = await runCLI(['query', '--help']);

        assert.equal(result.exitCode, 0);
        assert.ok(result.stdout.includes('Usage: conductor query'));
        assert.ok(result.stdout.includes('Query an MCP server tool directly for debugging'));
        assert.ok(result.stdout.includes('tool-name'));
        assert.ok(result.stdout.includes('tool-args'));
        assert.ok(result.stdout.includes('--config'));
        assert.ok(result.stdout.includes('--json'));
        assert.ok(result.stdout.includes('--quiet'));
      });
    });
  });

  // Note: npm script tests have been removed to avoid recursive test execution issues
  // The CLI functionality is already comprehensively tested above
});

/**
 * Helper function to run the CLI and capture output
 */
function runCLI(args) {
  return new Promise((resolve) => {
    const child = spawn('node', ['./bin/conductor.js', ...args], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (exitCode) => {
      resolve({ exitCode, stdout, stderr });
    });
  });
}

/**
 * Helper function to run npm scripts
 */
function runNpmScript(script) {
  return new Promise((resolve) => {
    const child = spawn('npm', ['run', script], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (exitCode) => {
      resolve({ exitCode, stdout, stderr });
    });
  });
}
