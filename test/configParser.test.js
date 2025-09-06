import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/core/configParser.js';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

describe('configParser', () => {
  const testConfigDir = './test/fixtures/config';

  // Setup test directory
  test('setup', async () => {
    try {
      await mkdir(testConfigDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  });

  describe('loadConfig', () => {
    it('should load valid configuration', async () => {
      const configPath = join(testConfigDir, 'valid-config.json');
      const validConfig = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
      };

      await writeFile(configPath, JSON.stringify(validConfig, null, 2));

      const config = await loadConfig(configPath);

      assert.equal(config.name, 'Test Server');
      assert.equal(config.command, 'node');
      assert.deepEqual(config.args, ['server.js']);
      assert.equal(typeof config.cwd, 'string');
      assert.equal(config.startupTimeout, 5000);
      assert.equal(config.readyPattern, null);

      await unlink(configPath);
    });

    it('should apply default values for optional fields', async () => {
      const configPath = join(testConfigDir, 'minimal-config.json');
      const minimalConfig = {
        name: 'Minimal Server',
        command: 'python',
        args: ['app.py'],
      };

      await writeFile(configPath, JSON.stringify(minimalConfig));

      const config = await loadConfig(configPath);

      assert.equal(config.startupTimeout, 5000);
      assert.equal(config.readyPattern, null);
      assert.equal(typeof config.env, 'object');
      assert.equal(typeof config.cwd, 'string');

      await unlink(configPath);
    });

    it('should merge environment variables correctly', async () => {
      const configPath = join(testConfigDir, 'env-config.json');
      const envConfig = {
        name: 'Env Server',
        command: 'node',
        args: ['server.js'],
        env: {
          'CUSTOM_VAR': 'test-value',
          'NODE_ENV': 'test',
        },
      };

      await writeFile(configPath, JSON.stringify(envConfig));

      const config = await loadConfig(configPath);

      assert.equal(config.env.CUSTOM_VAR, 'test-value');
      assert.equal(config.env.NODE_ENV, 'test');
      assert.equal(typeof config.env.PATH, 'string'); // Should inherit from process.env

      await unlink(configPath);
    });

    it('should throw error for missing required fields', async () => {
      const configPath = join(testConfigDir, 'invalid-config.json');
      const invalidConfig = {
        name: 'Invalid Server',
        // Missing command and args
      };

      await writeFile(configPath, JSON.stringify(invalidConfig));

      await assert.rejects(
        loadConfig(configPath),
        {
          message: /Missing required configuration fields: command, args/,
        },
      );

      await unlink(configPath);
    });

    it('should throw error for invalid field types', async () => {
      const configPath = join(testConfigDir, 'type-error-config.json');
      const typeErrorConfig = {
        name: 123, // Should be string
        command: 'node',
        args: ['server.js'],
      };

      await writeFile(configPath, JSON.stringify(typeErrorConfig));

      await assert.rejects(
        loadConfig(configPath),
        {
          message: /Configuration field "name" must be a string/,
        },
      );

      await unlink(configPath);
    });

    it('should throw error for non-array args', async () => {
      const configPath = join(testConfigDir, 'args-error-config.json');
      const argsErrorConfig = {
        name: 'Args Error Server',
        command: 'node',
        args: 'server.js', // Should be array
      };

      await writeFile(configPath, JSON.stringify(argsErrorConfig));

      await assert.rejects(
        loadConfig(configPath),
        {
          message: /Configuration field "args" must be an array/,
        },
      );

      await unlink(configPath);
    });

    it('should throw error for non-existent file', async () => {
      await assert.rejects(
        loadConfig('./nonexistent/config.json'),
        {
          message: /Configuration file not found/,
        },
      );
    });

    it('should throw error for invalid JSON', async () => {
      const configPath = join(testConfigDir, 'invalid-json.json');
      await writeFile(configPath, '{ invalid json }');

      await assert.rejects(
        loadConfig(configPath),
        {
          message: /Invalid JSON in configuration file/,
        },
      );

      await unlink(configPath);
    });
  });
});
