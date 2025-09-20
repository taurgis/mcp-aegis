import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseOptions,
  getTestOptions,
  shouldSuppressOutput,
  getOutputConfig,
  validateRequiredOptions,
} from '../../src/cli/interface/options.js';

describe('CLI Options Handler', () => {
  describe('parseOptions', () => {
    it('should parse options with defaults', () => {
      const rawOptions = {};
      const result = parseOptions(rawOptions);

      assert.deepEqual(result, {
        config: './aegis.config.json',
        verbose: false,
        debug: false,
        timing: false,
        json: false,
        quiet: false,
        errorsOnly: false,
        syntaxOnly: false,
        noAnalysis: false,
        groupErrors: false,
        concise: false,
        maxErrors: 5,
      });
    });

    it('should use provided config path', () => {
      const rawOptions = { config: './custom-config.json' };
      const result = parseOptions(rawOptions);

      assert.equal(result.config, './custom-config.json');
    });

    it('should convert truthy values to boolean true', () => {
      const rawOptions = {
        verbose: 'true',
        debug: 1,
        timing: 'yes',
        // Note: not setting json to avoid precedence logic affecting verbose
      };
      const result = parseOptions(rawOptions);

      assert.equal(result.verbose, true);
      assert.equal(result.debug, true);
      assert.equal(result.timing, true);
      assert.equal(result.json, false); // Default value
      assert.equal(result.quiet, false); // Default value
    });

    it('should convert truthy json value but apply precedence rule', () => {
      const rawOptions = {
        verbose: 'true',
        json: {}, // Truthy object
      };
      const result = parseOptions(rawOptions);

      assert.equal(result.json, true);
      assert.equal(result.verbose, false); // Disabled due to JSON precedence
    });    it('should convert falsy values to boolean false', () => {
      const rawOptions = {
        verbose: false,
        debug: 0,
        timing: '',
        json: null,
        quiet: undefined,
      };
      const result = parseOptions(rawOptions);

      assert.equal(result.verbose, false);
      assert.equal(result.debug, false);
      assert.equal(result.timing, false);
      assert.equal(result.json, false);
      assert.equal(result.quiet, false);
    });

    it('should throw error when both verbose and quiet are true', () => {
      const rawOptions = { verbose: true, quiet: true };

      assert.throws(() => {
        parseOptions(rawOptions);
      }, {
        name: 'Error',
        message: 'Cannot use both --verbose and --quiet options together',
      });
    });

    it('should disable verbose when json is true', () => {
      const rawOptions = { verbose: true, json: true };
      const result = parseOptions(rawOptions);

      assert.equal(result.verbose, false);
      assert.equal(result.json, true);
    });

    it('should handle all options together (except conflicting ones)', () => {
      const rawOptions = {
        config: './test-config.json',
        debug: true,
        timing: true,
        json: true,
      };
      const result = parseOptions(rawOptions);

      assert.deepEqual(result, {
        config: './test-config.json',
        verbose: false, // Disabled due to json being true
        debug: true,
        timing: true,
        json: true,
        quiet: false,
        errorsOnly: false,
        syntaxOnly: false,
        noAnalysis: false,
        groupErrors: false,
        concise: false,
        maxErrors: 5,
      });
    });

    describe('New debugging options', () => {
      it('should parse errorsOnly option', () => {
        const rawOptions = { errorsOnly: true };
        const result = parseOptions(rawOptions);

        assert.equal(result.errorsOnly, true);
        assert.equal(result.syntaxOnly, false);
        assert.equal(result.noAnalysis, false);
        assert.equal(result.groupErrors, false);
        assert.equal(result.maxErrors, 5);
      });

      it('should parse syntaxOnly option', () => {
        const rawOptions = { syntaxOnly: true };
        const result = parseOptions(rawOptions);

        assert.equal(result.errorsOnly, false);
        assert.equal(result.syntaxOnly, true);
        assert.equal(result.noAnalysis, false);
        assert.equal(result.groupErrors, false);
        assert.equal(result.maxErrors, 5);
      });

      it('should parse noAnalysis option correctly', () => {
        const rawOptions = { analysis: false }; // Commander.js sets 'analysis' to false for --no-analysis
        const result = parseOptions(rawOptions);

        assert.equal(result.errorsOnly, false);
        assert.equal(result.syntaxOnly, false);
        assert.equal(result.noAnalysis, true);
        assert.equal(result.groupErrors, false);
        assert.equal(result.maxErrors, 5);
      });

      it('should parse groupErrors option', () => {
        const rawOptions = { groupErrors: true };
        const result = parseOptions(rawOptions);

        assert.equal(result.errorsOnly, false);
        assert.equal(result.syntaxOnly, false);
        assert.equal(result.noAnalysis, false);
        assert.equal(result.groupErrors, true);
        assert.equal(result.maxErrors, 5);
      });

      it('should parse maxErrors option with valid number', () => {
        const rawOptions = { maxErrors: '10' };
        const result = parseOptions(rawOptions);

        assert.equal(result.errorsOnly, false);
        assert.equal(result.syntaxOnly, false);
        assert.equal(result.noAnalysis, false);
        assert.equal(result.groupErrors, false);
        assert.equal(result.maxErrors, 10);
      });

      it('should use default maxErrors when not provided', () => {
        const rawOptions = {};
        const result = parseOptions(rawOptions);

        assert.equal(result.maxErrors, 5);
      });

      it('should parse all debugging options together', () => {
        const rawOptions = {
          errorsOnly: true,
          groupErrors: true,
          maxErrors: '3',
        };
        const result = parseOptions(rawOptions);

        assert.equal(result.errorsOnly, true);
        assert.equal(result.syntaxOnly, false);
        assert.equal(result.noAnalysis, false);
        assert.equal(result.groupErrors, true);
        assert.equal(result.maxErrors, 3);
      });

      it('should throw error when errorsOnly and verbose are both true', () => {
        const rawOptions = { errorsOnly: true, verbose: true };

        assert.throws(() => {
          parseOptions(rawOptions);
        }, {
          name: 'Error',
          message: 'Cannot use both --errors-only and --verbose options together',
        });
      });

      it('should throw error when syntaxOnly and noAnalysis are both true', () => {
        const rawOptions = { syntaxOnly: true, analysis: false }; // noAnalysis is set via analysis: false

        assert.throws(() => {
          parseOptions(rawOptions);
        }, {
          name: 'Error',
          message: 'Cannot use both --syntax-only and --no-analysis options together',
        });
      });

      it('should throw error when maxErrors is zero', () => {
        const rawOptions = { maxErrors: '0' };

        assert.throws(() => {
          parseOptions(rawOptions);
        }, {
          name: 'Error',
          message: '--max-errors must be a positive number',
        });
      });

      it('should throw error when maxErrors is negative', () => {
        const rawOptions = { maxErrors: '-5' };

        assert.throws(() => {
          parseOptions(rawOptions);
        }, {
          name: 'Error',
          message: '--max-errors must be a positive number',
        });
      });

      it('should convert string maxErrors to number', () => {
        const rawOptions = { maxErrors: '15' };
        const result = parseOptions(rawOptions);

        assert.equal(result.maxErrors, 15);
        assert.equal(typeof result.maxErrors, 'number');
      });

      it('should handle non-numeric maxErrors gracefully', () => {
        const rawOptions = { maxErrors: 'invalid' };
        const result = parseOptions(rawOptions);

        assert.equal(result.maxErrors, 5); // Should default to 5 when parseInt fails
      });
    });
  });

  describe('getTestOptions', () => {
    it('should extract test execution options including new debugging options', () => {
      const options = {
        config: './config.json',
        verbose: true,
        debug: true,
        timing: true,
        json: false,
        quiet: false,
        errorsOnly: true,
        syntaxOnly: false,
        noAnalysis: true,
        groupErrors: true,
        maxErrors: 10,
        extraProperty: 'should-be-ignored',
      };

      const result = getTestOptions(options);

      assert.deepEqual(result, {
        verbose: true,
        debug: true,
        timing: true,
        json: false,
        quiet: false,
        errorsOnly: true,
        syntaxOnly: false,
        noAnalysis: true,
        groupErrors: true,
        concise: undefined,
        maxErrors: 10,
      });
    });

    it('should handle false values', () => {
      const options = {
        verbose: false,
        debug: false,
        timing: false,
        json: false,
        quiet: false,
        errorsOnly: false,
        syntaxOnly: false,
        noAnalysis: false,
        groupErrors: false,
        maxErrors: 5,
      };

      const result = getTestOptions(options);

      assert.deepEqual(result, {
        verbose: false,
        debug: false,
        timing: false,
        json: false,
        quiet: false,
        errorsOnly: false,
        syntaxOnly: false,
        noAnalysis: false,
        groupErrors: false,
        concise: undefined,
        maxErrors: 5,
      });
    });

    it('should work with minimal options object', () => {
      const options = {
        verbose: true,
      };

      const result = getTestOptions(options);

      assert.deepEqual(result, {
        verbose: true,
        debug: undefined,
        timing: undefined,
        json: undefined,
        quiet: undefined,
        errorsOnly: undefined,
        syntaxOnly: undefined,
        noAnalysis: undefined,
        groupErrors: undefined,
        concise: undefined,
        maxErrors: undefined,
      });
    });
  });

  describe('shouldSuppressOutput', () => {
    it('should return true when json is true', () => {
      const options = { json: true, quiet: false };
      const result = shouldSuppressOutput(options);

      assert.equal(result, true);
    });

    it('should return true when quiet is true', () => {
      const options = { json: false, quiet: true };
      const result = shouldSuppressOutput(options);

      assert.equal(result, true);
    });

    it('should return true when both json and quiet are true', () => {
      const options = { json: true, quiet: true };
      const result = shouldSuppressOutput(options);

      assert.equal(result, true);
    });

    it('should return false when both json and quiet are false', () => {
      const options = { json: false, quiet: false };
      const result = shouldSuppressOutput(options);

      assert.equal(result, false);
    });

    it('should handle missing properties as falsy', () => {
      const options = {};
      const result = shouldSuppressOutput(options);

      // undefined || undefined returns undefined in JavaScript, not false
      assert.equal(result, undefined);
    });
  });

  describe('getOutputConfig', () => {
    it('should return correct config for default options', () => {
      const options = {
        verbose: false,
        debug: false,
        timing: false,
        json: false,
        quiet: false,
      };

      const result = getOutputConfig(options);

      assert.deepEqual(result, {
        showProgress: true,
        showDetails: false,
        showDebug: false,
        showTiming: false,
        jsonOutput: false,
        quietMode: false,
      });
    });

    it('should suppress progress when json output is enabled', () => {
      const options = { json: true };
      const result = getOutputConfig(options);

      assert.equal(result.showProgress, false);
      assert.equal(result.jsonOutput, true);
    });

    it('should suppress progress when quiet mode is enabled', () => {
      const options = { quiet: true };
      const result = getOutputConfig(options);

      assert.equal(result.showProgress, false);
      assert.equal(result.quietMode, true);
    });

    it('should enable details when verbose is true and quiet is false', () => {
      const options = { verbose: true, quiet: false };
      const result = getOutputConfig(options);

      assert.equal(result.showDetails, true);
    });

    it('should disable details when quiet is true even if verbose is true', () => {
      const options = { verbose: true, quiet: true };
      const result = getOutputConfig(options);

      assert.equal(result.showDetails, false);
    });

    it('should enable debug when debug is true and quiet is false', () => {
      const options = { debug: true, quiet: false };
      const result = getOutputConfig(options);

      assert.equal(result.showDebug, true);
    });

    it('should disable debug when quiet is true even if debug is true', () => {
      const options = { debug: true, quiet: true };
      const result = getOutputConfig(options);

      assert.equal(result.showDebug, false);
    });

    it('should enable timing when timing is true and quiet is false', () => {
      const options = { timing: true, quiet: false };
      const result = getOutputConfig(options);

      assert.equal(result.showTiming, true);
    });

    it('should disable timing when quiet is true even if timing is true', () => {
      const options = { timing: true, quiet: true };
      const result = getOutputConfig(options);

      assert.equal(result.showTiming, false);
    });

    it('should handle complex combinations correctly', () => {
      const options = {
        verbose: true,
        debug: true,
        timing: true,
        json: false,
        quiet: false,
      };

      const result = getOutputConfig(options);

      assert.deepEqual(result, {
        showProgress: true,
        showDetails: true,
        showDebug: true,
        showTiming: true,
        jsonOutput: false,
        quietMode: false,
      });
    });

    it('should handle json output mode correctly', () => {
      const options = {
        verbose: true,
        debug: true,
        timing: true,
        json: true,
        quiet: false,
      };

      const result = getOutputConfig(options);

      assert.deepEqual(result, {
        showProgress: false, // Suppressed due to JSON
        showDetails: true,
        showDebug: true,
        showTiming: true,
        jsonOutput: true,
        quietMode: false,
      });
    });
  });

  describe('validateRequiredOptions', () => {
    it('should pass validation with valid inputs', () => {
      const testPattern = '*.test.mcp.yml';
      const options = { config: './config.json' };

      // Should not throw
      assert.doesNotThrow(() => {
        validateRequiredOptions(testPattern, options);
      });
    });

    it('should throw error when test pattern is missing', () => {
      const options = { config: './config.json' };

      assert.throws(() => {
        validateRequiredOptions('', options);
      }, {
        name: 'Error',
        message: 'Test pattern is required when running tests',
      });
    });

    it('should throw error when test pattern is null', () => {
      const options = { config: './config.json' };

      assert.throws(() => {
        validateRequiredOptions(null, options);
      }, {
        name: 'Error',
        message: 'Test pattern is required when running tests',
      });
    });

    it('should throw error when test pattern is undefined', () => {
      const options = { config: './config.json' };

      assert.throws(() => {
        validateRequiredOptions(undefined, options);
      }, {
        name: 'Error',
        message: 'Test pattern is required when running tests',
      });
    });

    it('should throw error when config is missing', () => {
      const testPattern = '*.test.mcp.yml';
      const options = {};

      assert.throws(() => {
        validateRequiredOptions(testPattern, options);
      }, {
        name: 'Error',
        message: 'Configuration file path is required',
      });
    });

    it('should throw error when config is null', () => {
      const testPattern = '*.test.mcp.yml';
      const options = { config: null };

      assert.throws(() => {
        validateRequiredOptions(testPattern, options);
      }, {
        name: 'Error',
        message: 'Configuration file path is required',
      });
    });

    it('should throw error when config is empty string', () => {
      const testPattern = '*.test.mcp.yml';
      const options = { config: '' };

      assert.throws(() => {
        validateRequiredOptions(testPattern, options);
      }, {
        name: 'Error',
        message: 'Configuration file path is required',
      });
    });

    it('should pass with whitespace-only test pattern (edge case)', () => {
      const testPattern = '   ';
      const options = { config: './config.json' };

      // Whitespace-only string is truthy, so validation passes
      assert.doesNotThrow(() => {
        validateRequiredOptions(testPattern, options);
      });
    });

    it('should accept any truthy config value', () => {
      const testPattern = '*.test.mcp.yml';
      const options = { config: 'any-path.json' };

      assert.doesNotThrow(() => {
        validateRequiredOptions(testPattern, options);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work with parseOptions -> getTestOptions flow', () => {
      const rawOptions = {
        config: './test.json',
        verbose: true,
        debug: true,
        timing: false,
        json: false,
        quiet: false,
      };

      const parsedOptions = parseOptions(rawOptions);
      const testOptions = getTestOptions(parsedOptions);

      assert.equal(testOptions.verbose, true);
      assert.equal(testOptions.debug, true);
      assert.equal(testOptions.timing, false);
      assert.equal(testOptions.json, false);
      assert.equal(testOptions.quiet, false);
    });

    it('should work with parseOptions -> getOutputConfig flow', () => {
      const rawOptions = {
        verbose: true,
        debug: true,
        timing: true,
        json: false,
        quiet: false,
      };

      const parsedOptions = parseOptions(rawOptions);
      const outputConfig = getOutputConfig(parsedOptions);

      assert.equal(outputConfig.showProgress, true);
      assert.equal(outputConfig.showDetails, true);
      assert.equal(outputConfig.showDebug, true);
      assert.equal(outputConfig.showTiming, true);
      assert.equal(outputConfig.jsonOutput, false);
      assert.equal(outputConfig.quietMode, false);
    });

    it('should handle JSON mode precedence correctly', () => {
      const rawOptions = {
        verbose: true,
        json: true,
      };

      const parsedOptions = parseOptions(rawOptions);
      const outputConfig = getOutputConfig(parsedOptions);

      // Verbose should be disabled due to JSON mode
      assert.equal(parsedOptions.verbose, false);
      assert.equal(outputConfig.showDetails, false);
      assert.equal(outputConfig.jsonOutput, true);
      assert.equal(outputConfig.showProgress, false); // Suppressed by JSON
    });

    it('should prevent conflicting options from the start', () => {
      const rawOptions = { verbose: true, quiet: true };

      assert.throws(() => {
        parseOptions(rawOptions);
      }, {
        name: 'Error',
        message: 'Cannot use both --verbose and --quiet options together',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined rawOptions gracefully', () => {
      assert.throws(() => {
        parseOptions(undefined);
      }, TypeError);
    });

    it('should handle null rawOptions gracefully', () => {
      assert.throws(() => {
        parseOptions(null);
      }, TypeError);
    });

    it('should handle options with undefined values', () => {
      const options = {
        verbose: undefined,
        debug: undefined,
        timing: undefined,
        json: undefined,
        quiet: undefined,
      };

      const outputConfig = getOutputConfig(options);

      // When inputs are undefined, the logical operations return undefined
      assert.equal(outputConfig.showDetails, undefined); // undefined && !undefined
      assert.equal(outputConfig.showDebug, undefined);   // undefined && !undefined
      assert.equal(outputConfig.showTiming, undefined);  // undefined && !undefined
      assert.equal(outputConfig.jsonOutput, undefined);  // undefined
      assert.equal(outputConfig.quietMode, undefined);   // undefined
      // showProgress depends on shouldSuppressOutput which returns undefined
      assert.equal(outputConfig.showProgress, true); // !undefined is true
    });    it('should handle very long config paths', () => {
      const longPath = `${'a'.repeat(1000)  }.json`;
      const rawOptions = { config: longPath };
      const result = parseOptions(rawOptions);

      assert.equal(result.config, longPath);
    });

    it('should handle special characters in config path', () => {
      const specialPath = './config-with-特殊字符-and-émojis-🚀.json';
      const rawOptions = { config: specialPath };
      const result = parseOptions(rawOptions);

      assert.equal(result.config, specialPath);
    });
  });
});
