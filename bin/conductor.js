#!/usr/bin/env node

import { Command } from 'commander';
import { parseOptions } from '../src/cli/interface/options.js';
import { OutputManager } from '../src/cli/interface/output.js';
import { getVersion } from '../src/core/version.js';
import { initializeProject } from '../src/cli/commands/init.js';
import { executeTestCommand, validateTestCommand } from '../src/cli/commands/test.js';
import { executeQueryCommand, validateQueryCommand } from '../src/cli/commands/query.js';

const program = new Command();

program
  .name('conductor')
  .description('MCP Conductor - A testing framework for Model Context Protocol servers')
  .version(getVersion());

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

// Query command for debugging individual tools
program
  .command('query')
  .description('Query an MCP server tool directly for debugging\n\nNote: This command inherits global options like --config, --json, --quiet, etc.')
  .argument('[tool-name]', 'name of the tool to call (omit to list all available tools)')
  .argument('[tool-args]', 'JSON string of tool arguments (e.g., \'{"path": "/tmp/file.txt"}\')')
  .action(async (toolName, toolArgsString) => {
    try {
      // Get parent command options (the global options defined on the program)
      const parentOptions = program.opts();

      // Parse and validate options using the standardized parser
      const parsedOptions = parseOptions(parentOptions);

      // Parse and validate tool arguments
      const toolArgs = validateQueryCommand(toolName, toolArgsString, parsedOptions);

      // Create output manager with parsed options
      const output = new OutputManager(parsedOptions);

      // Execute query command
      const success = await executeQueryCommand(toolName, toolArgs, parsedOptions, output);
      process.exit(success ? 0 : 1);

    } catch (error) {
      const output = new OutputManager({ json: false, quiet: false });
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
  .option('--errors-only', 'show only failed tests and their errors, hide passing tests')
  .option('--syntax-only', 'show only syntax-related errors and suggestions')
  .option('--no-analysis', 'disable detailed validation analysis, show only basic error messages')
  .option('--group-errors', 'group similar errors together to reduce repetition')
  .option('--max-errors <number>', 'limit the number of validation errors shown per test (default: 5)', '5')
  .action(async (testPattern, options, cmd) => {
    // If no test pattern provided and not running a specific command, show help
    if (!testPattern && cmd.args.length === 0) {
      program.help();
      return;
    }

    try {
      // Parse and validate options using the standardized parser
      const parsedOptions = parseOptions(options);
      const output = new OutputManager(parsedOptions);

      // Validate test command
      validateTestCommand(testPattern, parsedOptions);

      // Execute test command
      const success = await executeTestCommand(testPattern, parsedOptions, output);
      process.exit(success ? 0 : 1);

    } catch (error) {
      const output = new OutputManager({ json: false, quiet: false });
      output.logError(`❌ ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
