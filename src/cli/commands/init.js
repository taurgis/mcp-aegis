/**
 * Project Initializer - Handles MCP Conductor project initialization
 * Single responsibility: Set up new projects with proper structure
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Initialize MCP Conductor in current project
 * @param {OutputManager} output - Output manager for logging
 */
export async function initializeProject(output) {
  try {
    output.logInfo('🚀 Initializing MCP Conductor in current project...');

    // Check if package.json exists
    if (!existsSync('./package.json')) {
      throw new Error('package.json not found. Please run this command in a Node.js project directory.');
    }

    // Read and parse package.json
    const packageJsonContent = readFileSync('./package.json', 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    // Generate and create conductor.config.json
    await createConductorConfig(packageJson, output);

    // Create test directory structure
    const testsDir = await createTestDirectoryStructure(output);

    // Copy documentation
    await copyAgentsDocumentation(testsDir, output);

    // Install as dev dependency
    output.logInfo('\n📦 Installing mcp-conductor as dev dependency...');
    await installDevDependency('mcp-conductor', output);

    // Show completion message
    showCompletionMessage(testsDir, output);

  } catch (error) {
    throw new Error(`Error during initialization: ${error.message}`);
  }
}

/**
 * Generate and create conductor.config.json based on package.json
 * @param {Object} packageJson - Parsed package.json content
 * @param {OutputManager} output - Output manager for logging
 */
async function createConductorConfig(packageJson, output) {
  const config = generateConfigFromPackageJson(packageJson);
  const configPath = './conductor.config.json';

  if (existsSync(configPath)) {
    output.logWarning('⚠️  conductor.config.json already exists, skipping...');
  } else {
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    output.logSuccess('✅ Created conductor.config.json');
  }
}

/**
 * Generate conductor configuration based on package.json
 * @param {Object} packageJson - Parsed package.json content
 * @returns {Object} Generated configuration
 */
function generateConfigFromPackageJson(packageJson) {
  const config = {
    name: packageJson.name || 'MCP Server',
    command: 'node',
    args: ['./server.js'],
    cwd: './',
    startupTimeout: 10000,
  };

  // Determine main entry point
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
 * Create test directory structure with dedicated YAML and Node.js folders
 * @param {OutputManager} output - Output manager for logging
 * @returns {string} Path to the created tests directory
 */
async function createTestDirectoryStructure(output) {
  // Determine test directory - check for existing test/tests folders
  let testsDir = './test'; // Default to 'test'
  if (existsSync('./tests')) {
    testsDir = './tests';
  } else if (existsSync('./test')) {
    testsDir = './test';
  }

  const mcpTestsDir = `${testsDir}/mcp`;
  const mcpYamlDir = `${testsDir}/mcp/yaml`;
  const mcpNodeDir = `${testsDir}/mcp/node`;

  // Create test directory if it doesn't exist
  if (!existsSync(testsDir)) {
    mkdirSync(testsDir, { recursive: true });
  }

  // Create mcp subdirectory
  if (!existsSync(mcpTestsDir)) {
    mkdirSync(mcpTestsDir, { recursive: true });
    output.logSuccess(`✅ Created ${testsDir}/mcp directory`);
  } else {
    output.logWarning(`⚠️  ${testsDir}/mcp directory already exists, skipping...`);
  }

  // Create yaml subdirectory
  if (!existsSync(mcpYamlDir)) {
    mkdirSync(mcpYamlDir, { recursive: true });
    output.logSuccess(`✅ Created ${testsDir}/mcp/yaml directory`);
  } else {
    output.logWarning(`⚠️  ${testsDir}/mcp/yaml directory already exists, skipping...`);
  }

  // Create node subdirectory
  if (!existsSync(mcpNodeDir)) {
    mkdirSync(mcpNodeDir, { recursive: true });
    output.logSuccess(`✅ Created ${testsDir}/mcp/node directory`);
  } else {
    output.logWarning(`⚠️  ${testsDir}/mcp/node directory already exists, skipping...`);
  }

  return testsDir;
}

/**
 * Copy AGENTS.md files to the test directory structure
 * @param {string} testsDir - Path to the tests directory
 * @param {OutputManager} output - Output manager for logging
 */
async function copyAgentsDocumentation(testsDir, output) {
  // Copy main AGENTS.md to mcp folder
  const mainAgentsSourcePath = join(__dirname, '../../../AGENTS/AGENTS.md');
  const mainAgentsDestPath = `${testsDir}/mcp/AGENTS.md`;

  if (existsSync(mainAgentsDestPath)) {
    output.logWarning(`⚠️  ${testsDir}/mcp/AGENTS.md already exists, skipping...`);
  } else {
    copyFileSync(mainAgentsSourcePath, mainAgentsDestPath);
    output.logSuccess(`✅ Copied main AGENTS.md to ${testsDir}/mcp/`);
  }

  // Copy YAML-specific AGENTS.md to yaml folder
  const yamlAgentsSourcePath = join(__dirname, '../../../AGENTS/yaml/AGENTS.md');
  const yamlAgentsDestPath = `${testsDir}/mcp/yaml/AGENTS.md`;

  if (existsSync(yamlAgentsDestPath)) {
    output.logWarning(`⚠️  ${testsDir}/mcp/yaml/AGENTS.md already exists, skipping...`);
  } else {
    copyFileSync(yamlAgentsSourcePath, yamlAgentsDestPath);
    output.logSuccess(`✅ Copied YAML AGENTS.md to ${testsDir}/mcp/yaml/`);
  }

  // Copy Node.js-specific AGENTS.md to node folder
  const nodeAgentsSourcePath = join(__dirname, '../../../AGENTS/node/AGENTS.md');
  const nodeAgentsDestPath = `${testsDir}/mcp/node/AGENTS.md`;

  if (existsSync(nodeAgentsDestPath)) {
    output.logWarning(`⚠️  ${testsDir}/mcp/node/AGENTS.md already exists, skipping...`);
  } else {
    copyFileSync(nodeAgentsSourcePath, nodeAgentsDestPath);
    output.logSuccess(`✅ Copied Node.js AGENTS.md to ${testsDir}/mcp/node/`);
  }
}

/**
 * Install a package as a dev dependency using npm
 * @param {string} packageName - Name of the package to install
 * @param {OutputManager} output - Output manager for logging
 */
async function installDevDependency(packageName, output) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['install', '--save-dev', packageName], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        output.logSuccess(`✅ Successfully installed ${packageName} as dev dependency`);
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

/**
 * Show completion message with next steps
 * @param {string} testsDir - Path to the tests directory
 * @param {OutputManager} output - Output manager for logging
 */
function showCompletionMessage(testsDir, output) {
  output.logSuccess('\n🎉 MCP Conductor initialization complete!');
  output.logInfo('\nNext steps:');
  output.logInfo('1. Update conductor.config.json with your server configuration');
  output.logInfo('2. Create test files in the appropriate directories:');
  output.logInfo(`   • YAML tests: ${testsDir}/mcp/yaml/ (e.g., my-server.test.mcp.yml)`);
  output.logInfo(`   • Programmatic tests: ${testsDir}/mcp/node/ (e.g., my-server.programmatic.test.js)`);
  output.logInfo('3. Run tests with:');
  output.logInfo(`   • YAML: npx mcp-conductor "${testsDir}/mcp/yaml/**/*.test.mcp.yml"`);
  output.logInfo(`   • Node.js: node --test "${testsDir}/mcp/node/**/*.programmatic.test.js"`);
  output.logInfo('   or add to package.json scripts:');
  output.logInfo('   "test:mcp:yaml": "mcp-conductor \\"./test*/mcp/yaml/**/*.test.mcp.yml\\""');
  output.logInfo('   "test:mcp:node": "node --test \\"./test*/mcp/node/**/*.programmatic.test.js\\""');
  output.logInfo('\nFor guidance:');
  output.logInfo(`• Main overview: ${testsDir}/mcp/AGENTS.md`);
  output.logInfo(`• YAML testing: ${testsDir}/mcp/yaml/AGENTS.md`);
  output.logInfo(`• Programmatic testing: ${testsDir}/mcp/node/AGENTS.md`);
}
