import { ConfigLoader } from './ConfigLoader.js';
import { ConfigValidator } from './ConfigValidator.js';

/**
 * Loads and validates the conductor configuration file
 * @param {string} filePath - Path to the conductor.config.json file
 * @returns {Promise<Object>} The validated configuration object
 */
export async function loadConfig(filePath) {
  // Load raw configuration from file
  const rawConfig = await ConfigLoader.loadFromFile(filePath);

  // Validate the configuration
  const validationResult = ConfigValidator.validate(rawConfig);

  if (!validationResult.isValid) {
    throw new Error(validationResult.errors.join('; '));
  }

  // Log warnings if any
  if (validationResult.warnings.length > 0) {
    console.warn('Configuration warnings:', validationResult.warnings.join('; '));
  }

  // Apply default values and return
  return ConfigLoader.applyDefaults(rawConfig);
}
