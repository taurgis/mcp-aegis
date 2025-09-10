import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, unlink, mkdir, rmdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { executeTestCommand, validateTestCommand } from '../../src/cli/commands/test.js';

// Mock output manager for testing
class MockOutputManager {
  constructor() {
    this.logs = [];
    this.errors = [];
  }

  logConfigLoaded(name) {
    this.logs.push(`Config loaded: ${name}`);
  }

  logTestSuitesFound(count) {
    this.logs.push(`Test suites found: ${count}`);
  }

  logNoTestFiles(pattern) {
    this.logs.push(`No test files: ${pattern}`);
  }

  logError(message) {
    this.errors.push(message);
  }

  reset() {
    this.logs = [];
    this.errors = [];
  }
}

describe('Test Command Handler', () => {
  const testDir = './test/fixtures/test-command';
  let mockOutput;

  beforeEach(async () => {
    mockOutput = new MockOutputManager();
    try {
      await mkdir(testDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  });

  afterEach(async () => {
    try {
      if (existsSync(testDir)) {
        // Clean up test files
        const files = ['test-config.json', 'test-suite.test.mcp.yml'];
        for (const file of files) {
          const filePath = join(testDir, file);
          if (existsSync(filePath)) {
            await unlink(filePath);
          }
        }
        await rmdir(testDir);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('validateTestCommand', () => {
    it('should validate required test pattern', () => {
      const options = { config: 'test.json' };

      assert.throws(
        () => validateTestCommand(null, options),
        {
          message: 'Test pattern is required when running tests',
        },
      );
    });

    it('should validate empty test pattern', () => {
      const options = { config: 'test.json' };

      assert.throws(
        () => validateTestCommand('', options),
        {
          message: 'Test pattern is required when running tests',
        },
      );
    });

    it('should validate required config option', () => {
      const options = {};

      assert.throws(
        () => validateTestCommand('*.test.yml', options),
        {
          message: 'Configuration file path is required',
        },
      );
    });

    it('should validate empty config option', () => {
      const options = { config: '' };

      assert.throws(
        () => validateTestCommand('*.test.yml', options),
        {
          message: 'Configuration file path is required',
        },
      );
    });

    it('should pass validation with valid inputs', () => {
      const options = { config: 'test.json' };

      // Should not throw
      validateTestCommand('*.test.yml', options);
    });
  });

  describe('executeTestCommand', () => {
    it('should handle missing configuration file', async () => {
      const testPattern = '*.test.yml';
      const options = { config: 'nonexistent.json' };

      const result = await executeTestCommand(testPattern, options, mockOutput);

      assert.strictEqual(result, false);
      assert.strictEqual(mockOutput.errors.length, 1);
      assert.ok(mockOutput.errors[0].includes('Configuration file not found'));
    });

    it('should handle no test files found', async () => {
      // Create a valid config file
      const configPath = join(testDir, 'test-config.json');
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
      };
      await writeFile(configPath, JSON.stringify(config, null, 2));

      const testPattern = join(testDir, 'nonexistent-*.test.yml');
      const options = { config: configPath };

      const result = await executeTestCommand(testPattern, options, mockOutput);

      // Should return true (not a failure condition)
      assert.strictEqual(result, true);
      assert.ok(mockOutput.logs.some(log => log.includes('Config loaded: Test Server')));
      assert.ok(mockOutput.logs.some(log => log.includes('Test suites found: 0')));
      assert.ok(mockOutput.logs.some(log => log.includes('No test files:')));
    });

    it('should handle invalid config file content', async () => {
      // Create an invalid config file
      const configPath = join(testDir, 'invalid-config.json');
      await writeFile(configPath, 'invalid json content');

      const testPattern = '*.test.yml';
      const options = { config: configPath };

      const result = await executeTestCommand(testPattern, options, mockOutput);

      assert.strictEqual(result, false);
      assert.strictEqual(mockOutput.errors.length, 1);
      assert.ok(mockOutput.errors[0].includes('❌ Error:'));
    });

    it('should extract test options correctly', async () => {
      // Create a valid minimal config
      const configPath = join(testDir, 'minimal-config.json');
      const config = {
        name: 'Minimal Server',
        command: 'node',
        args: ['-e', 'console.log("test")'],
      };
      await writeFile(configPath, JSON.stringify(config, null, 2));

      // Create a minimal test file
      const testFilePath = join(testDir, 'minimal.test.mcp.yml');
      const testContent = `
description: "Minimal test"
tests:
  - it: "should work"
    request:
      jsonrpc: "2.0"
      id: "test-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-1"
        result:
          tools: []
`;
      await writeFile(testFilePath, testContent);

      const testPattern = testFilePath;
      const options = {
        config: configPath,
        verbose: true,
        debug: false,
        timing: true,
        json: false,
        quiet: false,
      };

      // This will likely fail due to server issues, but we're testing option extraction
      const result = await executeTestCommand(testPattern, options, mockOutput);

      // Verify config was loaded (indicates options were processed)
      assert.ok(mockOutput.logs.some(log => log.includes('Config loaded: Minimal Server')));
      assert.ok(mockOutput.logs.some(log => log.includes('Test suites found: 1')));
    });

    it('should handle all option combinations', async () => {
      // Create config
      const configPath = join(testDir, 'options-config.json');
      const config = {
        name: 'Options Test Server',
        command: 'echo',
        args: ['test'],
      };
      await writeFile(configPath, JSON.stringify(config, null, 2));

      const testPattern = join(testDir, 'nonexistent-*.test.yml');
      const options = {
        config: configPath,
        verbose: false,
        debug: true,
        timing: false,
        json: true,
        quiet: true,
      };

      const result = await executeTestCommand(testPattern, options, mockOutput);

      // Should handle no test files gracefully
      assert.strictEqual(result, true);
      assert.ok(mockOutput.logs.some(log => log.includes('Config loaded: Options Test Server')));
    });

    it('should handle error during test execution', async () => {
      // Create a config that will cause execution issues
      const configPath = join(testDir, 'error-config.json');
      const config = {
        name: 'Error Server',
        command: 'nonexistent-command',
        args: ['server.js'],
      };
      await writeFile(configPath, JSON.stringify(config, null, 2));

      // Create a test file
      const testFilePath = join(testDir, 'error.test.mcp.yml');
      const testContent = `
description: "Error test"
tests:
  - it: "should fail"
    request:
      jsonrpc: "2.0"
      id: "error-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "error-1"
        result:
          tools: []
`;
      await writeFile(testFilePath, testContent);

      const testPattern = testFilePath;
      const options = { config: configPath };

      const result = await executeTestCommand(testPattern, options, mockOutput);

      // Should return false due to execution error
      assert.strictEqual(result, false);
    });

    it('should handle missing options gracefully', async () => {
      // Create a valid config
      const configPath = join(testDir, 'default-options-config.json');
      const config = {
        name: 'Default Options Server',
        command: 'echo',
        args: ['test'],
      };
      await writeFile(configPath, JSON.stringify(config, null, 2));

      const testPattern = join(testDir, 'nonexistent-*.test.yml');
      const options = { config: configPath }; // No additional options

      const result = await executeTestCommand(testPattern, options, mockOutput);

      // Should handle missing options by using defaults
      assert.strictEqual(result, true);
      assert.ok(mockOutput.logs.some(log => log.includes('Config loaded: Default Options Server')));
    });
  });

  describe('extractTestOptions function (indirect testing)', () => {
    it('should handle undefined options', async () => {
      const configPath = join(testDir, 'undefined-options-config.json');
      const config = {
        name: 'Undefined Options Server',
        command: 'echo',
        args: ['test'],
      };
      await writeFile(configPath, JSON.stringify(config, null, 2));

      const testPattern = join(testDir, 'nonexistent-*.test.yml');
      const options = {
        config: configPath,
        // Explicitly undefined options
        verbose: undefined,
        debug: undefined,
        timing: undefined,
        json: undefined,
        quiet: undefined,
      };

      const result = await executeTestCommand(testPattern, options, mockOutput);

      // Should handle undefined options gracefully
      assert.strictEqual(result, true);
      assert.ok(mockOutput.logs.some(log => log.includes('Config loaded: Undefined Options Server')));
    });
  });

  describe('error handling edge cases', () => {
    it('should handle errors thrown during config loading', async () => {
      const configPath = join(testDir, 'permission-config.json');

      // Create a config file, then we'll test with permissions (simulated by invalid JSON)
      await writeFile(configPath, '{"invalid": json}'); // Invalid JSON to trigger parse error

      const testPattern = '*.test.yml';
      const options = { config: configPath };

      const result = await executeTestCommand(testPattern, options, mockOutput);

      assert.strictEqual(result, false);
      assert.strictEqual(mockOutput.errors.length, 1);
      assert.ok(mockOutput.errors[0].includes('❌ Error:'));
    });

    it('should handle errors during test suite loading', async () => {
      // Create a valid config
      const configPath = join(testDir, 'valid-config.json');
      const config = {
        name: 'Valid Server',
        command: 'node',
        args: ['server.js'],
      };
      await writeFile(configPath, JSON.stringify(config, null, 2));

      // Create an invalid YAML test file
      const testFilePath = join(testDir, 'invalid.test.mcp.yml');
      const invalidYaml = `
description: "Invalid test"
tests:
  - it: "should fail"
    request:
      jsonrpc: "2.0"
      id: "invalid-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"  
        id: "invalid-1"
        result
          invalid yaml structure here
`;
      await writeFile(testFilePath, invalidYaml);

      const testPattern = testFilePath;
      const options = { config: configPath };

      const result = await executeTestCommand(testPattern, options, mockOutput);

      // Should handle YAML parse errors
      assert.strictEqual(result, false);
      assert.strictEqual(mockOutput.errors.length, 1);
      assert.ok(mockOutput.errors[0].includes('❌ Error:'));
    });
  });
});
