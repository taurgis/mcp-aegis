/**
 * ConfigValidator handles validation logic for MCP server configurations
 * Single responsibility: Configuration field validation and type checking
 */
export class ConfigValidator {
  /**
   * Validates the configuration object structure and types
   * @param {Object} config - Raw configuration object
   * @returns {Object} Validation result with { isValid, errors, warnings }
   */
  static validate(config) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!config || typeof config !== 'object') {
      result.isValid = false;
      result.errors.push('Configuration must be a valid object');
      return result;
    }

    // Validate required fields
    const requiredFields = this._getRequiredFields();
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      result.isValid = false;
      result.errors.push(`Missing required configuration fields: ${missingFields.join(', ')}`);
    }

    // Validate field types
    const typeValidationErrors = this._validateFieldTypes(config);
    if (typeValidationErrors.length > 0) {
      result.isValid = false;
      result.errors.push(...typeValidationErrors);
    }

    // Validate field values
    const valueValidationResults = this._validateFieldValues(config);
    result.errors.push(...valueValidationResults.errors);
    result.warnings.push(...valueValidationResults.warnings);
    
    if (valueValidationResults.errors.length > 0) {
      result.isValid = false;
    }

    return result;
  }

  /**
   * Gets the list of required configuration fields
   * @returns {string[]}
   * @private
   */
  static _getRequiredFields() {
    return ['name', 'command', 'args'];
  }

  /**
   * Validates the types of configuration fields
   * @param {Object} config - Configuration object
   * @returns {string[]} Array of error messages
   * @private
   */
  static _validateFieldTypes(config) {
    const errors = [];

    if (config.name !== undefined && typeof config.name !== 'string') {
      errors.push('Configuration field "name" must be a string');
    }

    if (config.command !== undefined && typeof config.command !== 'string') {
      errors.push('Configuration field "command" must be a string');
    }

    if (config.args !== undefined && !Array.isArray(config.args)) {
      errors.push('Configuration field "args" must be an array');
    }

    if (config.cwd !== undefined && typeof config.cwd !== 'string') {
      errors.push('Configuration field "cwd" must be a string');
    }

    if (config.env !== undefined && (typeof config.env !== 'object' || Array.isArray(config.env))) {
      errors.push('Configuration field "env" must be an object');
    }

    if (config.startupTimeout !== undefined && typeof config.startupTimeout !== 'number') {
      errors.push('Configuration field "startupTimeout" must be a number');
    }

    if (config.readyPattern !== undefined && typeof config.readyPattern !== 'string') {
      errors.push('Configuration field "readyPattern" must be a string');
    }

    return errors;
  }

  /**
   * Validates the values of configuration fields
   * @param {Object} config - Configuration object
   * @returns {Object} Object with errors and warnings arrays
   * @private
   */
  static _validateFieldValues(config) {
    const errors = [];
    const warnings = [];

    // Validate args array elements
    if (Array.isArray(config.args)) {
      const nonStringArgs = config.args.filter(arg => typeof arg !== 'string');
      if (nonStringArgs.length > 0) {
        errors.push('All elements in "args" array must be strings');
      }
    }

    // Validate timeout values
    if (typeof config.startupTimeout === 'number') {
      if (config.startupTimeout <= 0) {
        errors.push('Configuration field "startupTimeout" must be a positive number');
      } else if (config.startupTimeout < 1000) {
        warnings.push('Configuration field "startupTimeout" is less than 1000ms, which may cause startup failures');
      } else if (config.startupTimeout > 30000) {
        warnings.push('Configuration field "startupTimeout" is greater than 30000ms, which may cause slow test execution');
      }
    }

    // Validate environment variables
    if (config.env && typeof config.env === 'object') {
      for (const [key, value] of Object.entries(config.env)) {
        if (typeof value !== 'string') {
          errors.push(`Environment variable "${key}" must be a string, got ${typeof value}`);
        }
      }
    }

    // Validate ready pattern
    if (config.readyPattern) {
      try {
        new RegExp(config.readyPattern);
      } catch (error) {
        errors.push(`Configuration field "readyPattern" is not a valid regular expression: ${error.message}`);
      }
    }

    return { errors, warnings };
  }
}
