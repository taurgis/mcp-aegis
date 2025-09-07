#!/usr/bin/env node

import { Command } from 'commander';
import { parseOptions } from '../src/cli/interface/options.js';
import { OutputManager } from '../src/cli/interface/output.js';
import { initializeProject } from '../src/cli/commands/init.js';
import { executeTestCommand, validateTestCommand } from '../src/cli/commands/test.js';

const program = new Command();

program
  .name('conductor')
  .description('MCP Conductor - A testing framework for Model Context Protocol servers')
  .version('1.0.0');

// Init command
program
  .command('init')
  .description('Initialize MCP Conductor in the current project')
  .action(async () => {
    const output = new OutputManager({ json: false, quiet: false });
    
    try {
      await initializeProject(output);
    } catch (error) {
      output.logError(`❌ ${error.message}`);
      process.exit(1);
    }
  });

// Default test command for backward compatibility
program
  .argument('[test-pattern]', 'glob pattern for test files (e.g., "./tests/mcp/**/*.test.mcp.yml")')
  .option('-c, --config <path>', 'path to conductor.config.json file', './conductor.config.json')
  .option('-v, --verbose', 'display individual test results with the test suite hierarchy')
  .option('-d, --debug', 'enable debug mode with detailed MCP communication logging')
  .option('-t, --timing', 'show timing information for tests and operations')
  .option('-j, --json', 'output results in JSON format for CI/automation')
  .option('-q, --quiet', 'suppress non-essential output (opposite of verbose)')
  .action(async (testPattern, rawOptions, cmd) => {
    // If no test pattern provided and not running a specific command, show help
    if (!testPattern && cmd.args.length === 0) {
      program.help();
      return;
    }

    try {
      // Parse and validate options
      const options = parseOptions(rawOptions);
      const output = new OutputManager(options);

      // Validate test command
      validateTestCommand(testPattern, options);

      // Execute test command
      const success = await executeTestCommand(testPattern, options, output);
      process.exit(success ? 0 : 1);

    } catch (error) {
      const output = new OutputManager({ json: false, quiet: false });
      output.logError(`❌ ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
