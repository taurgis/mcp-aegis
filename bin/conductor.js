#!/usr/bin/env node

import { Command } from 'commander';
import { loadConfig } from '../src/core/configParser.js';
import { loadTestSuites } from '../src/cli/testParser.js';
import { runTests } from '../src/cli/testRunner.js';
import { existsSync, mkdirSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

/**
 * Generate conductor.config.json based on package.json
 */
function generateConfig(packageJson) {
  const config = {
    name: packageJson.name || 'MCP Server',
    command: 'node',
    args: ['./server.js'],
    cwd: './',
    startupTimeout: 10000,
  };

  // Try to determine the main entry point
  if (packageJson.main) {
    config.args = [packageJson.main];
  } else if (packageJson.scripts?.start) {
    // Parse npm start script if available
    const startScript = packageJson.scripts.start;
    if (startScript.includes('node ')) {
      const nodeIndex = startScript.indexOf('node ');
      const restOfScript = startScript.substring(nodeIndex + 5).trim();
      const args = restOfScript.split(' ').filter(arg => arg.length > 0);
      if (args.length > 0) {
        config.args = args;
      }
    }
  }

  // Add ready pattern if we can infer it
  if (packageJson.name) {
    config.readyPattern = `${packageJson.name} started|Server started|Ready`;
  }

  return config;
}

/**
 * Initialize MCP Conductor in current project
 */
async function initProject() {
  try {
    console.log('🚀 Initializing MCP Conductor in current project...');

    // Check if package.json exists
    if (!existsSync('./package.json')) {
      console.error('❌ package.json not found. Please run this command in a Node.js project directory.');
      process.exit(1);
    }

    // Read package.json
    const packageJsonContent = readFileSync('./package.json', 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    // Generate conductor.config.json
    const config = generateConfig(packageJson);
    const configPath = './conductor.config.json';

    if (existsSync(configPath)) {
      console.log('⚠️  conductor.config.json already exists, skipping...');
    } else {
      writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log('✅ Created conductor.config.json');
    }

    // Determine test directory - check for existing test/tests folders
    let testsDir = './test'; // Default to 'test'
    if (existsSync('./tests')) {
      testsDir = './tests';
    } else if (existsSync('./test')) {
      testsDir = './test';
    }

    const mcpTestsDir = `${testsDir}/mcp`;

    // Create test directory if it doesn't exist
    if (!existsSync(testsDir)) {
      mkdirSync(testsDir, { recursive: true });
    }

    // Create mcp subdirectory
    if (!existsSync(mcpTestsDir)) {
      mkdirSync(mcpTestsDir, { recursive: true });
      console.log(`✅ Created ${testsDir}/mcp directory`);
    } else {
      console.log(`⚠️  ${testsDir}/mcp directory already exists, skipping...`);
    }

    // Copy AGENTS.md to the determined test directory
    const agentsSourcePath = join(__dirname, '../AGENTS.md');
    const agentsDestPath = `${testsDir}/mcp/AGENTS.md`;

    if (existsSync(agentsDestPath)) {
      console.log(`⚠️  ${testsDir}/mcp/AGENTS.md already exists, skipping...`);
    } else {
      copyFileSync(agentsSourcePath, agentsDestPath);
      console.log(`✅ Copied AGENTS.md to ${testsDir}/mcp/`);
    }

    // Install mcp-conductor as dev dependency
    console.log('\n📦 Installing mcp-conductor as dev dependency...');
    await installDevDependency('mcp-conductor');

    console.log('\n🎉 MCP Conductor initialization complete!');
    console.log('\nNext steps:');
    console.log('1. Update conductor.config.json with your server configuration');
    console.log(`2. Create test files in ${testsDir}/mcp/ (e.g., ${testsDir}/mcp/my-server.test.mcp.yml)`);
    console.log(`3. Run tests with: npx mcp-conductor "${testsDir}/mcp/**/*.test.mcp.yml"`);
    console.log('   or add to package.json scripts: "test:mcp": "mcp-conductor \\"./test*/mcp/**/*.test.mcp.yml\\""');
    console.log(`\nFor more information, check out ${testsDir}/mcp/AGENTS.md`);

  } catch (error) {
    console.error('❌ Error during initialization:', error.message);
    process.exit(1);
  }
}

/**
 * Install a package as a dev dependency using npm
 * @param {string} packageName - Name of the package to install
 */
async function installDevDependency(packageName) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['install', '--save-dev', packageName], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Successfully installed ${packageName} as dev dependency`);
        resolve();
      } else {
        reject(new Error(`npm install failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to run npm install: ${error.message}`));
    });
  });
}

program
  .name('conductor')
  .description('MCP Conductor - A testing framework for Model Context Protocol servers')
  .version('1.0.0');

// Init command
program
  .command('init')
  .description('Initialize MCP Conductor in the current project')
  .action(async () => {
    await initProject();
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
  .action(async (testPattern, options, cmd) => {
    // If no test pattern provided and not running a specific command, show help
    if (!testPattern && cmd.args.length === 0) {
      program.help();
      return;
    }

    if (!testPattern) {
      console.error('❌ Test pattern is required when running tests');
      program.help();
      return;
    }

    try {
      // Load configuration
      const configPath = options.config;
      if (!existsSync(configPath)) {
        console.error(`❌ Configuration file not found: ${configPath}`);
        process.exit(1);
      }

      const config = await loadConfig(configPath);
      if (!options.json && !options.quiet) {
        console.log(`📋 Loaded configuration for: ${config.name}`);
      }

      // Load test suites
      const testSuites = await loadTestSuites(testPattern);
      if (!options.json && !options.quiet) {
        console.log(`🧪 Found ${testSuites.length} test suite(s)`);
      }

      if (testSuites.length === 0) {
        if (!options.json && !options.quiet) {
          console.log(`⚠️  No test files found matching pattern: ${testPattern}`);
        }
        process.exit(0);
      }

      // Run tests
      const testOptions = {
        verbose: options.verbose,
        debug: options.debug,
        timing: options.timing,
        json: options.json,
        quiet: options.quiet,
      };
      const success = await runTests(config, testSuites, testOptions);

      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse();
