#!/usr/bin/env node

import { Command } from 'commander';
import { loadConfig } from '../src/core/configParser.js';
import { loadTestSuites } from '../src/cli/testParser.js';
import { runTests } from '../src/cli/testRunner.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name('conductor')
  .description('MCP Conductor - A testing framework for Model Context Protocol servers')
  .version('1.0.0')
  .argument('<test-pattern>', 'glob pattern for test files (e.g., "./examples/**/*.test.mcp.yml")')
  .option('-c, --config <path>', 'path to conductor.config.json file', './conductor.config.json')
  .action(async (testPattern, options) => {
    try {
      // Load configuration
      const configPath = options.config;
      if (!existsSync(configPath)) {
        console.error(`❌ Configuration file not found: ${configPath}`);
        process.exit(1);
      }

      const config = await loadConfig(configPath);
      console.log(`📋 Loaded configuration for: ${config.name}`);

      // Load test suites
      const testSuites = await loadTestSuites(testPattern);
      console.log(`🧪 Found ${testSuites.length} test suite(s)`);

      if (testSuites.length === 0) {
        console.log(`⚠️  No test files found matching pattern: ${testPattern}`);
        process.exit(0);
      }

      // Run tests
      const success = await runTests(config, testSuites);
      
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse();
