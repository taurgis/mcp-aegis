/**
 * CLI Module Exports
 * Provides centralized exports for all CLI components
 */

// Command handlers
export { initializeProject } from './commands/init.js';
export { executeTestCommand, validateTestCommand } from './commands/test.js';

// Interface components
export { parseOptions } from './interface/options.js';
export { OutputManager } from './interface/output.js';

// CLI module metadata
export const CLI_VERSION = '1.0.0';
export const CLI_NAME = 'MCP Conductor CLI';
