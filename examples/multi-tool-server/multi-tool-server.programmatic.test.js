import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from '../../src/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Multi-Tool Server Programmatic Integration', () => {
  let client;

  before(async () => {
    // Connect using inline config
    const config = {
      name: 'Multi-Tool MCP Server',
      command: '/Users/thomastheunen/.nvm/versions/node/v20.18.1/bin/node',
      args: ['./server.js'],
      cwd: join(__dirname, './'),
      env: {},
      startupTimeout: 5000,
      readyPattern: 'Multi-Tool MCP Server started',
    };
    client = await connect(config);
  });

  after(async () => {
    if (client) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    client.clearStderr();
  });

  describe('Tool Discovery', () => {
    test('should list all available tools', async () => {
      const tools = await client.listTools();

      assert.equal(tools.length, 4);

      const toolNames = tools.map(tool => tool.name);
      assert.ok(toolNames.includes('calculator'));
      assert.ok(toolNames.includes('text_processor'));
      assert.ok(toolNames.includes('data_validator'));
      assert.ok(toolNames.includes('file_manager'));
    });
  });

  describe('Calculator Tool', () => {
    test('should perform addition correctly', async () => {
      const result = await client.callTool('calculator', {
        operation: 'add',
        a: 15,
        b: 27,
      });

      assert.equal(result.isError, false);
      assert.equal(result.content.length, 1);
      assert.equal(result.content[0].type, 'text');
      assert.equal(result.content[0].text, 'Result: 42');
    });

    test('should perform multiplication correctly', async () => {
      const result = await client.callTool('calculator', {
        operation: 'multiply',
        a: 6,
        b: 7,
      });

      assert.equal(result.isError, false);
      assert.equal(result.content[0].text, 'Result: 42');
    });

    test('should handle division by zero gracefully', async () => {
      const result = await client.callTool('calculator', {
        operation: 'divide',
        a: 10,
        b: 0,
      });

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /Division by zero/);
    });
  });

  describe('Text Processor Tool', () => {
    test('should convert text to uppercase', async () => {
      const result = await client.callTool('text_processor', {
        action: 'uppercase',
        text: 'hello world',
      });

      assert.equal(result.isError, false);
      assert.equal(result.content[0].text, 'HELLO WORLD');
    });

    test('should count words correctly', async () => {
      const result = await client.callTool('text_processor', {
        action: 'count_words',
        text: 'The quick brown fox jumps',
      });

      assert.equal(result.isError, false);
      assert.equal(result.content[0].text, '5');
    });

    test('should reverse text correctly', async () => {
      const result = await client.callTool('text_processor', {
        action: 'reverse',
        text: 'hello',
      });

      assert.equal(result.isError, false);
      assert.equal(result.content[0].text, 'olleh');
    });
  });

  describe('Data Validator Tool', () => {
    test('should validate email addresses', async () => {
      const result = await client.callTool('data_validator', {
        type: 'email',
        data: 'test@example.com',
      });

      assert.equal(result.isError, false);
      assert.match(result.content[0].text, /Valid email/i);
    });

    test('should reject invalid email addresses', async () => {
      const result = await client.callTool('data_validator', {
        type: 'email',
        data: 'invalid-email',
      });

      assert.equal(result.isError, false);
      assert.match(result.content[0].text, /Invalid email/i);
    });

    test('should validate URLs', async () => {
      const result = await client.callTool('data_validator', {
        type: 'url',
        data: 'https://example.com',
      });

      assert.equal(result.isError, false);
      assert.match(result.content[0].text, /Valid URL/i);
    });
  });

  describe('File Manager Tool', () => {
    test('should list files in shared-test-data directory', async () => {
      const result = await client.callTool('file_manager', {
        action: 'list',
        path: '../shared-test-data',
      });

      assert.equal(result.isError, false);
      assert.match(result.content[0].text, /Files: .*README\.md.*hello\.txt/);
    });

    test('should get file info correctly', async () => {
      const result = await client.callTool('file_manager', {
        action: 'info',
        path: '../shared-test-data/hello.txt',
      });

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /File operation failed/);
    });

    test('should handle non-existent paths gracefully', async () => {
      const result = await client.callTool('file_manager', {
        action: 'info',
        path: 'non-existent-file.txt',
      });

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /File operation failed/);
    });
  });

  describe('Error Handling', () => {
    test('should handle unknown tools gracefully', async () => {
      const result = await client.callTool('nonexistent_tool', {});

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /Unknown tool/);
    });

    test('should handle invalid parameters', async () => {
      const result = await client.callTool('calculator', {
        operation: 'invalid_operation',
        a: 1,
        b: 2,
      });

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /Unsupported operation/);
    });
  });

  describe('Advanced Features', () => {
    test('should support chaining multiple operations', async () => {
      // First, perform a calculation
      const calcResult = await client.callTool('calculator', {
        operation: 'multiply',
        a: 17,
        b: 3,
      });

      assert.equal(calcResult.isError, false);
      assert.equal(calcResult.content[0].text, 'Result: 51');

      // Then process the result with text operations
      const textResult = await client.callTool('text_processor', {
        action: 'reverse',
        text: calcResult.content[0].text,
      });

      assert.equal(textResult.isError, false);
      assert.equal(textResult.content[0].text, '15 :tluseR');
    });

    test('should maintain server state across calls', async () => {
      // Make multiple calls to ensure server doesn't crash
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('calculator', {
          operation: 'add',
          a: i,
          b: 1,
        });

        assert.equal(result.isError, false);
        assert.equal(result.content[0].text, `Result: ${i + 1}`);
      }
    });

    test('should manage resources efficiently for AI agents', async () => {
      // Warm-up GC opportunity (only if --expose-gc enabled)
      if ((globalThis).gc) { (globalThis).gc(); }
      const memBefore = process.memoryUsage();
      for (let i = 0; i < 120; i++) {
        const res = await client.callTool('calculator', { operation: 'add', a: i, b: i + 1 });
        assert.equal(res.isError, false);
        if (i % 10 === 0) {
          client.clearStderr();
          // Allow event loop + GC breathing room for long loops
          await new Promise(r => setTimeout(r, 0));
        }
      }
      if ((globalThis).gc) { (globalThis).gc(); }
      const memAfter = process.memoryUsage();
      const heapGrowth = memAfter.heapUsed - memBefore.heapUsed;
      // 50MB guard rail; adjust if CI environment differs
      assert.ok(heapGrowth < 50 * 1024 * 1024, `Memory growth should be under 50MB (actual ${(heapGrowth / (1024 * 1024)).toFixed(2)}MB)`);
    });
  });
});
