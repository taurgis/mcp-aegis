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

// Version utilities
export { getVersion, getClientInfo } from '../core/version.js';

// CLI module metadata
export const CLI_NAME = 'MCP Aegis CLI';
