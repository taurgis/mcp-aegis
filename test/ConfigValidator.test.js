import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ConfigValidator } from '../src/core/ConfigValidator.js';

describe('ConfigValidator', () => {
  describe('validate', () => {
    test('should validate valid minimal configuration', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
      };

      const result = ConfigValidator.validate(config);

      assert.equal(result.isValid, true);
      assert.equal(result.errors.length, 0);
      assert.equal(result.warnings.length, 0);
    });

    test('should validate complete configuration', () => {
      const config = {
        name: 'Complete Server',
        command: 'python',
        args: ['app.py', '--port', '8080'],
        cwd: '/path/to/server',
        env: { NODE_ENV: 'test', API_KEY: 'secret' },
        startupTimeout: 5000,
        readyPattern: 'Server listening',
      };

      const result = ConfigValidator.validate(config);

      assert.equal(result.isValid, true);
      assert.equal(result.errors.length, 0);
    });

    test('should reject null/undefined config', () => {
      const result1 = ConfigValidator.validate(null);
      assert.equal(result1.isValid, false);
      assert.ok(result1.errors[0].includes('Configuration must be a valid object'));

      const result2 = ConfigValidator.validate(undefined);
      assert.equal(result2.isValid, false);
      assert.ok(result2.errors[0].includes('Configuration must be a valid object'));
    });

    test('should reject non-object config', () => {
      const result = ConfigValidator.validate('not an object');
      assert.equal(result.isValid, false);
      assert.ok(result.errors[0].includes('Configuration must be a valid object'));
    });

    test('should reject missing required fields', () => {
      const config = {
        name: 'Incomplete Server',
        // Missing command and args
      };

      const result = ConfigValidator.validate(config);

      assert.equal(result.isValid, false);
      assert.ok(result.errors[0].includes('Missing required configuration fields'));
      assert.ok(result.errors[0].includes('command'));
      assert.ok(result.errors[0].includes('args'));
    });

    test('should validate field types correctly', () => {
      const config = {
        name: 123, // Should be string
        command: 'node',
        args: 'not-an-array', // Should be array
      };

      const result = ConfigValidator.validate(config);

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(err => err.includes('"name" must be a string')));
      assert.ok(result.errors.some(err => err.includes('"args" must be an array')));
    });

    test('should validate optional field types', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
        cwd: 123, // Should be string
        env: 'not-an-object', // Should be object
        startupTimeout: 'not-a-number', // Should be number
        readyPattern: 456, // Should be string
      };

      const result = ConfigValidator.validate(config);

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(err => err.includes('"cwd" must be a string')));
      assert.ok(result.errors.some(err => err.includes('"env" must be an object')));
      assert.ok(result.errors.some(err => err.includes('"startupTimeout" must be a number')));
      assert.ok(result.errors.some(err => err.includes('"readyPattern" must be a string')));
    });

    test('should validate args array elements', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['valid-string', 123, 'another-string'],
      };

      const result = ConfigValidator.validate(config);

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(err => err.includes('All elements in "args" array must be strings')));
    });

    test('should validate startupTimeout values', () => {
      const negativeConfig = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
        startupTimeout: -1000,
      };

      const result1 = ConfigValidator.validate(negativeConfig);
      assert.equal(result1.isValid, false);
      assert.ok(result1.errors.some(err => err.includes('startupTimeout" must be a positive number')));

      const lowConfig = {
        ...negativeConfig,
        startupTimeout: 500,
      };

      const result2 = ConfigValidator.validate(lowConfig);
      assert.equal(result2.isValid, true);
      assert.ok(result2.warnings.some(warn => warn.includes('less than 1000ms')));

      const highConfig = {
        ...negativeConfig,
        startupTimeout: 40000,
      };

      const result3 = ConfigValidator.validate(highConfig);
      assert.equal(result3.isValid, true);
      assert.ok(result3.warnings.some(warn => warn.includes('greater than 30000ms')));
    });

    test('should validate environment variables', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
        env: {
          VALID_STRING: 'value',
          INVALID_NUMBER: 123,
          INVALID_BOOLEAN: true,
        },
      };

      const result = ConfigValidator.validate(config);

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(err => err.includes('Environment variable "INVALID_NUMBER" must be a string')));
      assert.ok(result.errors.some(err => err.includes('Environment variable "INVALID_BOOLEAN" must be a string')));
    });

    test('should validate regex patterns', () => {
      const validConfig = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
        readyPattern: '\\d+ server ready',
      };

      const result1 = ConfigValidator.validate(validConfig);
      assert.equal(result1.isValid, true);

      const invalidConfig = {
        ...validConfig,
        readyPattern: '[invalid regex',
      };

      const result2 = ConfigValidator.validate(invalidConfig);
      assert.equal(result2.isValid, false);
      assert.ok(result2.errors.some(err => err.includes('not a valid regular expression')));
    });

    test('should handle arrays for env field validation', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['server.js'],
        env: ['not', 'an', 'object'], // Array instead of object
      };

      const result = ConfigValidator.validate(config);

      assert.equal(result.isValid, false);
      assert.ok(result.errors.some(err => err.includes('"env" must be an object')));
    });
  });
});
