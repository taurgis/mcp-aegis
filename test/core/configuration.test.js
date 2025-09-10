/**
 * Comprehensive Configuration Tests
 * Consolidated tests for configuration loading, validation, and parsing
 * Covers ConfigLoader, ConfigValidator, and configParser functionality
 */

import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../../src/core/configParser.js';
import { ConfigLoader } from '../../src/core/ConfigLoader.js';
import { ConfigValidator } from '../../src/core/ConfigValidator.js';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

describe('Configuration Management', () => {
  const testConfigDir = './test/fixtures/config';

  // Setup test directory
  test('setup', async () => {
    try {
      await mkdir(testConfigDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  });

  describe('ConfigLoader', () => {
    it('should load valid JSON configuration files', async () => {
      const configPath = join(testConfigDir, 'loader-valid.json');
      const validConfig = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
        cwd: '/test/path',
        startupTimeout: 10000,
      };

      await writeFile(configPath, JSON.stringify(validConfig, null, 2));

      const config = await ConfigLoader.loadFromFile(configPath);
      assert.deepEqual(config, validConfig);

      await unlink(configPath);
    });

    it('should throw error for non-existent config file', async () => {
      const nonExistentPath = join(testConfigDir, 'non-existent.json');

      await assert.rejects(
        async () => await ConfigLoader.loadFromFile(nonExistentPath),
        {
          name: 'Error',
          message: /Configuration file not found/,
        },
      );
    });

    it('should throw error for invalid JSON', async () => {
      const configPath = join(testConfigDir, 'invalid-json.json');

      await writeFile(configPath, '{ invalid json }');

      await assert.rejects(
        async () => await ConfigLoader.loadFromFile(configPath),
        {
          name: 'Error',
          message: /Invalid JSON in configuration file/,
        },
      );

      await unlink(configPath);
    });

    it('should load configuration with environment variables', async () => {
      const configPath = join(testConfigDir, 'env-config.json');
      const configWithEnv = {
        name: 'Env Server',
        command: 'node',
        args: ['server.js'],
        env: {
          NODE_ENV: 'test',
          DEBUG: 'true',
        },
      };

      await writeFile(configPath, JSON.stringify(configWithEnv, null, 2));

      const config = await ConfigLoader.loadFromFile(configPath);
      assert.deepEqual(config.env, { NODE_ENV: 'test', DEBUG: 'true' });

      await unlink(configPath);
    });
  });

  describe('ConfigValidator', () => {
    it('should validate complete valid configuration', () => {
      const validConfig = {
        name: 'Valid Server',
        command: 'node',
        args: ['server.js'],
        cwd: '/test/path',
        env: { NODE_ENV: 'test' },
        startupTimeout: 5000,
        readyPattern: 'Server ready',
      };

      const result = ConfigValidator.validate(validConfig);
      assert.equal(result.isValid, true);
      assert.equal(result.errors.length, 0);
    });

    it('should reject configuration missing required name field', () => {
      const invalidConfig = {
        command: 'node',
        args: ['server.js'],
      };

      const result = ConfigValidator.validate(invalidConfig);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(error => error.includes('name')));
    });

    it('should reject configuration missing required command field', () => {
      const invalidConfig = {
        name: 'Test Server',
        args: ['server.js'],
      };

      const result = ConfigValidator.validate(invalidConfig);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(error => error.includes('command')));
    });

    it('should reject configuration missing required args field', () => {
      const invalidConfig = {
        name: 'Test Server',
        command: 'node',
      };

      const result = ConfigValidator.validate(invalidConfig);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(error => error.includes('args')));
    });

    it('should validate args as array', () => {
      const invalidConfig = {
        name: 'Test Server',
        command: 'node',
        args: 'not-an-array',
      };

      const result = ConfigValidator.validate(invalidConfig);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(error => error.includes('args') && error.includes('array')));
    });

    it('should validate startupTimeout as positive number', () => {
      const invalidConfig = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
        startupTimeout: -1000,
      };

      const result = ConfigValidator.validate(invalidConfig);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(error => error.includes('startupTimeout')));
    });

    it('should validate env as object', () => {
      const invalidConfig = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
        env: 'not-an-object',
      };

      const result = ConfigValidator.validate(invalidConfig);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(error => error.includes('env') && error.includes('object')));
    });

    it('should allow optional fields to be undefined', () => {
      const minimalConfig = {
        name: 'Minimal Server',
        command: 'python',
        args: ['app.py'],
      };

      const result = ConfigValidator.validate(minimalConfig);
      assert.equal(result.isValid, true);
      assert.equal(result.errors.length, 0);
    });

    it('should collect multiple validation errors', () => {
      const invalidConfig = {
        // Missing name, command, args
        startupTimeout: 'not-a-number',
        env: 'not-an-object',
      };

      const result = ConfigValidator.validate(invalidConfig);
      assert.equal(result.isValid, false);
      assert.ok(result.errors.length >= 3); // Multiple errors
    });
  });

  describe('configParser (integrated)', () => {
    it('should load and validate complete configuration', async () => {
      const configPath = join(testConfigDir, 'complete-config.json');
      const completeConfig = {
        name: 'Complete Test Server',
        command: 'node',
        args: ['server.js', '--port', '3000'],
        cwd: '/app',
        env: {
          NODE_ENV: 'test',
          PORT: '3000',
        },
        startupTimeout: 10000,
        readyPattern: 'Server listening on port',
      };

      await writeFile(configPath, JSON.stringify(completeConfig, null, 2));

      const config = await loadConfig(configPath);

      assert.equal(config.name, 'Complete Test Server');
      assert.equal(config.command, 'node');
      assert.deepEqual(config.args, ['server.js', '--port', '3000']);
      assert.equal(config.cwd, '/app');
      // Check only the specific env vars we set
      assert.equal(config.env.NODE_ENV, 'test');
      assert.equal(config.env.PORT, '3000');
      assert.equal(config.startupTimeout, 10000);
      assert.equal(config.readyPattern, 'Server listening on port');

      await unlink(configPath);
    });

    it('should apply default values for optional fields', async () => {
      const configPath = join(testConfigDir, 'minimal-config.json');
      const minimalConfig = {
        name: 'Minimal Server',
        command: 'python',
        args: ['app.py'],
      };

      await writeFile(configPath, JSON.stringify(minimalConfig, null, 2));

      const config = await loadConfig(configPath);

      assert.equal(config.name, 'Minimal Server');
      assert.equal(config.command, 'python');
      assert.deepEqual(config.args, ['app.py']);
      assert.equal(typeof config.cwd, 'string');
      assert.equal(config.startupTimeout, 5000); // Default value
      assert.equal(config.readyPattern, null); // Default value

      await unlink(configPath);
    });

    it('should reject invalid configuration and provide detailed errors', async () => {
      const configPath = join(testConfigDir, 'invalid-config.json');
      const invalidConfig = {
        name: 'Invalid Server',
        // Missing command and args
        startupTimeout: 'not-a-number',
        env: 'not-an-object',
      };

      await writeFile(configPath, JSON.stringify(invalidConfig, null, 2));

      await assert.rejects(
        async () => await loadConfig(configPath),
        (error) => {
          assert.ok(error.message.includes('name') || error.message.includes('command') || error.message.includes('args'));
          return true;
        },
      );

      await unlink(configPath);
    });

    it('should handle relative cwd paths', async () => {
      const configPath = join(testConfigDir, 'relative-cwd-config.json');
      const configWithRelativeCwd = {
        name: 'Relative CWD Server',
        command: 'node',
        args: ['server.js'],
        cwd: './examples/server',
      };

      await writeFile(configPath, JSON.stringify(configWithRelativeCwd, null, 2));

      const config = await loadConfig(configPath);

      // Should preserve the relative path as-is
      assert.equal(config.cwd, './examples/server');

      await unlink(configPath);
    });

    it('should handle configurations with no environment variables', async () => {
      const configPath = join(testConfigDir, 'no-env-config.json');
      const configNoEnv = {
        name: 'No Env Server',
        command: 'python',
        args: ['server.py'],
        startupTimeout: 8000,
      };

      await writeFile(configPath, JSON.stringify(configNoEnv, null, 2));

      const config = await loadConfig(configPath);

      assert.equal(config.name, 'No Env Server');
      assert.ok(config.env); // Should have process.env merged in
      assert.equal(config.startupTimeout, 8000);

      await unlink(configPath);
    });

    it('should validate readyPattern as string when provided', async () => {
      const configPath = join(testConfigDir, 'ready-pattern-config.json');
      const configWithPattern = {
        name: 'Pattern Server',
        command: 'node',
        args: ['server.js'],
        readyPattern: 'Application started successfully',
      };

      await writeFile(configPath, JSON.stringify(configWithPattern, null, 2));

      const config = await loadConfig(configPath);
      assert.equal(config.readyPattern, 'Application started successfully');

      await unlink(configPath);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle empty configuration object', async () => {
      const configPath = join(testConfigDir, 'empty-config.json');
      await writeFile(configPath, '{}');

      await assert.rejects(
        async () => await loadConfig(configPath),
        (error) => {
          assert.ok(error.message.includes('name') || error.message.includes('command') || error.message.includes('args'));
          return true;
        },
      );

      await unlink(configPath);
    });

    it('should handle configuration with null values', async () => {
      const configPath = join(testConfigDir, 'null-config.json');
      const configWithNulls = {
        name: 'Null Test Server',
        command: 'node',
        args: ['server.js'],
        cwd: null,
        env: null,
        readyPattern: null,
      };

      await writeFile(configPath, JSON.stringify(configWithNulls, null, 2));

      // Should reject null values for typed fields
      await assert.rejects(
        async () => await loadConfig(configPath),
        (error) => {
          assert.ok(error.message.includes('cwd') && error.message.includes('must be a string'));
          return true;
        },
      );

      await unlink(configPath);
    });

    it('should preserve exact configuration structure', async () => {
      const configPath = join(testConfigDir, 'exact-config.json');
      const exactConfig = {
        name: 'Exact Server',
        command: 'deno',
        args: ['run', '--allow-net', 'server.ts'],
        cwd: '/deno-app',
        env: {
          DENO_ENV: 'production',
          API_KEY: 'secret-key',
          PORT: '8080',
        },
        startupTimeout: 15000,
        readyPattern: 'Deno server running on :8080',
      };

      await writeFile(configPath, JSON.stringify(exactConfig, null, 2));

      const config = await loadConfig(configPath);

      // Should match exactly for fields we set
      assert.deepEqual(config.name, exactConfig.name);
      assert.deepEqual(config.command, exactConfig.command);
      assert.deepEqual(config.args, exactConfig.args);
      assert.deepEqual(config.cwd, exactConfig.cwd);
      // Check only the env vars we set
      assert.equal(config.env.DENO_ENV, exactConfig.env.DENO_ENV);
      assert.equal(config.env.API_KEY, exactConfig.env.API_KEY);
      assert.equal(config.env.PORT, exactConfig.env.PORT);
      assert.deepEqual(config.startupTimeout, exactConfig.startupTimeout);
      assert.deepEqual(config.readyPattern, exactConfig.readyPattern);

      await unlink(configPath);
    });
  });
});
