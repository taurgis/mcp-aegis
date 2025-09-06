import { readFile } from 'fs/promises';
import { resolve } from 'path';

/**
 * Loads and validates the conductor configuration file
 * @param {string} filePath - Path to the conductor.config.json file
 * @returns {Promise<Object>} The validated configuration object
 */
export async function loadConfig(filePath) {
  try {
    const configContent = await readFile(resolve(filePath), 'utf8');
    const config = JSON.parse(configContent);

    // Validate required fields
    const requiredFields = ['name', 'command', 'args'];
    const missingFields = requiredFields.filter(field => !config[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required configuration fields: ${missingFields.join(', ')}`);
    }

    // Validate types
    if (typeof config.name !== 'string') {
      throw new Error('Configuration field "name" must be a string');
    }

    if (typeof config.command !== 'string') {
      throw new Error('Configuration field "command" must be a string');
    }

    if (!Array.isArray(config.args)) {
      throw new Error('Configuration field "args" must be an array');
    }

    // Set defaults for optional fields
    const validatedConfig = {
      ...config,
      cwd: config.cwd || process.cwd(),
      env: config.env ? { ...process.env, ...config.env } : process.env,
      startupTimeout: config.startupTimeout || 5000,
      readyPattern: config.readyPattern || null,
    };

    return validatedConfig;
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
