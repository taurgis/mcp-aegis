import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { ConfigLoader } from '../src/core/ConfigLoader.js';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

describe('ConfigLoader', () => {
  const testConfigDir = './test/fixtures/config-loader';

  beforeEach(async () => {
    try {
      await mkdir(testConfigDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  });

  describe('loadFromFile', () => {
    test('should load valid JSON configuration', async () => {
      const configPath = join(testConfigDir, 'valid.json');
      const testConfig = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
      };

      await writeFile(configPath, JSON.stringify(testConfig));

      const result = await ConfigLoader.loadFromFile(configPath);

      assert.deepEqual(result, testConfig);

      await unlink(configPath);
    });

    test('should handle complex configuration objects', async () => {
      const configPath = join(testConfigDir, 'complex.json');
      const complexConfig = {
        name: 'Complex Server',
        command: 'python',
        args: ['app.py', '--verbose', '--port', '8080'],
        cwd: '/custom/path',
        env: {
          NODE_ENV: 'production',
          API_KEY: 'secret-key',
          DEBUG: 'true',
        },
        startupTimeout: 10000,
        readyPattern: 'Server listening on port \\d+',
      };

      await writeFile(configPath, JSON.stringify(complexConfig, null, 2));

      const result = await ConfigLoader.loadFromFile(configPath);

      assert.deepEqual(result, complexConfig);

      await unlink(configPath);
    });

    test('should throw error for non-existent file', async () => {
      await assert.rejects(
        ConfigLoader.loadFromFile('./nonexistent/config.json'),
        { message: /Configuration file not found/ },
      );
    });

    test('should throw error for invalid JSON', async () => {
      const configPath = join(testConfigDir, 'invalid.json');
      await writeFile(configPath, '{ invalid json syntax }');

      await assert.rejects(
        ConfigLoader.loadFromFile(configPath),
        { message: /Invalid JSON in configuration file/ },
      );

      await unlink(configPath);
    });

    test('should handle empty file', async () => {
      const configPath = join(testConfigDir, 'empty.json');
      await writeFile(configPath, '');

      await assert.rejects(
        ConfigLoader.loadFromFile(configPath),
        { message: /Invalid JSON in configuration file/ },
      );

      await unlink(configPath);
    });

    test('should resolve relative paths correctly', async () => {
      const configPath = join(testConfigDir, 'relative.json');
      const testConfig = { name: 'Relative Test', command: 'echo', args: ['test'] };

      await writeFile(configPath, JSON.stringify(testConfig));

      // Test with relative path
      const relativePath = './test/fixtures/config-loader/relative.json';
      const result = await ConfigLoader.loadFromFile(relativePath);

      assert.deepEqual(result, testConfig);

      await unlink(configPath);
    });
  });

  describe('applyDefaults', () => {
    test('should apply default values to minimal config', () => {
      const minimalConfig = {
        name: 'Minimal Server',
        command: 'node',
        args: ['server.js'],
      };

      const result = ConfigLoader.applyDefaults(minimalConfig);

      assert.equal(result.name, 'Minimal Server');
      assert.equal(result.command, 'node');
      assert.deepEqual(result.args, ['server.js']);
      assert.equal(typeof result.cwd, 'string');
      assert.equal(typeof result.env, 'object');
      assert.equal(result.startupTimeout, 5000);
      assert.equal(result.readyPattern, null);
    });

    test('should preserve existing values', () => {
      const customConfig = {
        name: 'Custom Server',
        command: 'python',
        args: ['app.py'],
        cwd: '/custom/path',
        env: { CUSTOM: 'value' },
        startupTimeout: 10000,
        readyPattern: 'ready',
      };

      const result = ConfigLoader.applyDefaults(customConfig);

      assert.equal(result.name, 'Custom Server');
      assert.equal(result.command, 'python');
      assert.deepEqual(result.args, ['app.py']);
      assert.equal(result.cwd, '/custom/path');
      assert.ok(result.env.CUSTOM === 'value');
      assert.equal(result.startupTimeout, 10000);
      assert.equal(result.readyPattern, 'ready');
    });

    test('should handle zero values correctly', () => {
      const zeroConfig = {
        name: 'Zero Server',
        command: 'node',
        args: ['server.js'],
        startupTimeout: 0,
      };

      const result = ConfigLoader.applyDefaults(zeroConfig);

      assert.equal(result.startupTimeout, 0); // Should preserve 0, not use default
    });

    test('should merge environment variables correctly', () => {
      const originalPath = process.env.PATH;
      
      const config = {
        name: 'Env Server',
        command: 'node',
        args: ['server.js'],
        env: { CUSTOM: 'value', NODE_ENV: 'test' },
      };

      const result = ConfigLoader.applyDefaults(config);

      assert.equal(result.env.CUSTOM, 'value');
      assert.equal(result.env.NODE_ENV, 'test');
      assert.equal(result.env.PATH, originalPath); // Should inherit from process.env
    });

    test('should handle null and undefined environment', () => {
      const config1 = {
        name: 'Null Env Server',
        command: 'node',
        args: ['server.js'],
        env: null,
      };

      const result1 = ConfigLoader.applyDefaults(config1);
      assert.equal(typeof result1.env, 'object');
      assert.ok(result1.env.PATH); // Should have process.env values

      const config2 = {
        name: 'Undefined Env Server',
        command: 'node',
        args: ['server.js'],
        // env is undefined
      };

      const result2 = ConfigLoader.applyDefaults(config2);
      assert.equal(typeof result2.env, 'object');
      assert.ok(result2.env.PATH); // Should have process.env values
    });
  });

  describe('mergeEnvironment', () => {
    test('should merge environments correctly', () => {
      const baseEnv = { PATH: '/usr/bin', HOME: '/home/user' };
      const configEnv = { NODE_ENV: 'test', PATH: '/custom/bin' };

      const result = ConfigLoader.mergeEnvironment(baseEnv, configEnv);

      assert.equal(result.HOME, '/home/user'); // From base
      assert.equal(result.NODE_ENV, 'test'); // From config
      assert.equal(result.PATH, '/custom/bin'); // Config overrides base
    });

    test('should handle null config environment', () => {
      const baseEnv = { PATH: '/usr/bin', HOME: '/home/user' };

      const result = ConfigLoader.mergeEnvironment(baseEnv, null);

      assert.deepEqual(result, baseEnv);
    });

    test('should handle undefined config environment', () => {
      const baseEnv = { PATH: '/usr/bin', HOME: '/home/user' };

      const result = ConfigLoader.mergeEnvironment(baseEnv, undefined);

      assert.deepEqual(result, baseEnv);
    });

    test('should handle invalid config environment', () => {
      const baseEnv = { PATH: '/usr/bin', HOME: '/home/user' };

      const result = ConfigLoader.mergeEnvironment(baseEnv, 'not an object');

      assert.deepEqual(result, baseEnv);
    });

    test('should create new object (not mutate originals)', () => {
      const baseEnv = { PATH: '/usr/bin' };
      const configEnv = { NODE_ENV: 'test' };

      const result = ConfigLoader.mergeEnvironment(baseEnv, configEnv);

      // Modify result
      result.CUSTOM = 'value';

      // Originals should be unchanged
      assert.ok(!baseEnv.CUSTOM);
      assert.ok(!configEnv.CUSTOM);
    });
  });
});
