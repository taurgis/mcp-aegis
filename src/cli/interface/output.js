/**
 * Output Manager - Centralized output handling for different CLI modes
 * Manages console output based on CLI options (quiet, json, verbose, etc.)
 */

/**
 * Output manager class for handling different output modes
 */
export class OutputManager {
  constructor(options) {
    this.showProgress = !options.json && !options.quiet;
    this.showDetails = options.verbose && !options.quiet;
    this.showDebug = options.debug && !options.quiet;
    this.jsonOutput = options.json;
    this.quietMode = options.quiet;
  }

  /**
   * Log informational messages (suppressed in quiet/json modes)
   * @param {string} message - Message to log
   */
  logInfo(message) {
    if (this.showProgress) {
      console.log(message);
    }
  }

  /**
   * Log error messages (always shown unless JSON mode)
   * @param {string} message - Error message to log
   */
  logError(message) {
    if (!this.jsonOutput) {
      console.error(message);
    }
  }

  /**
   * Log success messages (suppressed in quiet/json modes)
   * @param {string} message - Success message to log
   */
  logSuccess(message) {
    if (this.showProgress) {
      console.log(message);
    }
  }

  /**
   * Log warning messages (suppressed in quiet/json modes)
   * @param {string} message - Warning message to log
   */
  logWarning(message) {
    if (this.showProgress) {
      console.log(message);
    }
  }

  /**
   * Log detailed messages (only in verbose mode)
   * @param {string} message - Detail message to log
   */
  logDetail(message) {
    if (this.showDetails) {
      console.log(message);
    }
  }

  /**
   * Log debug messages (only in debug mode)
   * @param {string} message - Debug message to log
   * @param {*} data - Optional data to log
   */
  logDebug(message, data = null) {
    if (this.showDebug) {
      console.log(`🔍 DEBUG: ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }

  /**
   * Check if output should be suppressed
   * @returns {boolean} True if output should be suppressed
   */
  shouldSuppress() {
    return this.jsonOutput || this.quietMode;
  }

  /**
   * Log configuration details
   * @param {string} configName - Name from configuration
   */
  logConfigLoaded(configName) {
    this.logInfo(`📋 Loaded configuration for: ${configName}`);
  }

  /**
   * Log test suite discovery
   * @param {number} count - Number of test suites found
   */
  logTestSuitesFound(count) {
    this.logInfo(`🧪 Found ${count} test suite(s)`);
  }

  /**
   * Log no test files warning
   * @param {string} pattern - Test pattern that was searched
   */
  logNoTestFiles(pattern) {
    this.logWarning(`⚠️  No test files found matching pattern: ${pattern}`);
  }
}
