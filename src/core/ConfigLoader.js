import { readFile } from 'fs/promises';
import { resolve } from 'path';

/**
 * ConfigLoader handles file loading and default value assignment
 * Single responsibility: File I/O and configuration merging
 */
export class ConfigLoader {
  /**
   * Loads raw configuration from file
   * @param {string} filePath - Path to configuration file
   * @returns {Promise<Object>} Raw configuration object
   */
  static async loadFromFile(filePath) {
    try {
      const resolvedPath = resolve(filePath);
      const configContent = await readFile(resolvedPath, 'utf8');
      return JSON.parse(configContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Configuration file not found: ${filePath}`);
      }
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in configuration file: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Applies default values to configuration
   * @param {Object} config - Raw configuration object
   * @returns {Object} Configuration with defaults applied
   */
  static applyDefaults(config) {
    const defaults = this._getDefaults();

    return {
      ...config,
      cwd: config.cwd || defaults.cwd,
      env: config.env ? { ...process.env, ...config.env } : defaults.env,
      startupTimeout: config.startupTimeout !== undefined ? config.startupTimeout : defaults.startupTimeout,
      readyPattern: config.readyPattern !== undefined ? config.readyPattern : defaults.readyPattern,
    };
  }

  /**
   * Gets default configuration values
   * @returns {Object} Default configuration values
   * @private
   */
  static _getDefaults() {
    return {
      cwd: process.cwd(),
      env: process.env,
      startupTimeout: 5000,
      readyPattern: null,
    };
  }

  /**
   * Merges environment variables properly
   * @param {Object} baseEnv - Base environment (usually process.env)
   * @param {Object} configEnv - Environment variables from config
   * @returns {Object} Merged environment variables
   */
  static mergeEnvironment(baseEnv, configEnv) {
    if (!configEnv || typeof configEnv !== 'object') {
      return { ...baseEnv };
    }

    return { ...baseEnv, ...configEnv };
  }
}
