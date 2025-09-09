import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

const TEST_DIR = '/tmp/conductor-init-test';
const CONDUCTOR_PATH = join(process.cwd(), 'bin/conductor.js');

describe('Init Command', () => {
  beforeEach(() => {
    // Clean up and create test directory
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });
    process.chdir(TEST_DIR);
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
  });

  it('should initialize project with basic package.json', async () => {
    // Create a basic package.json
    const packageJson = {
      name: 'test-server',
      version: '1.0.0',
      main: 'server.js',
      scripts: {
        start: 'node server.js',
      },
    };
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // Run init command
    const { stdout } = await execAsync(`node ${CONDUCTOR_PATH} init`);

    // Check output
    assert.ok(stdout.includes('🚀 Initializing MCP Conductor'));
    assert.ok(stdout.includes('✅ Created conductor.config.json'));
    assert.ok(stdout.includes('✅ Created ./test/mcp directory')); // Uses ./test/mcp format
    assert.ok(stdout.includes('✅ Created ./test/mcp/yaml directory'));
    assert.ok(stdout.includes('✅ Created ./test/mcp/node directory'));
    assert.ok(stdout.includes('✅ Copied main AGENTS.md'));
    assert.ok(stdout.includes('✅ Copied YAML AGENTS.md'));
    assert.ok(stdout.includes('✅ Copied Node.js AGENTS.md'));
    assert.ok(stdout.includes('🎉 MCP Conductor initialization complete!'));

    // Check created files
    assert.ok(existsSync('conductor.config.json'), 'Config file should be created');
    assert.ok(existsSync('test/mcp'), 'Test directory should be created (default to test/)');
    assert.ok(existsSync('test/mcp/yaml'), 'YAML subdirectory should be created');
    assert.ok(existsSync('test/mcp/node'), 'Node.js subdirectory should be created');
    assert.ok(existsSync('test/mcp/AGENTS.md'), 'Main AGENTS.md should be copied to test/mcp');
    assert.ok(existsSync('test/mcp/yaml/AGENTS.md'), 'YAML AGENTS.md should be copied to test/mcp/yaml');
    assert.ok(existsSync('test/mcp/node/AGENTS.md'), 'Node.js AGENTS.md should be copied to test/mcp/node');

    // Check config content
    const config = JSON.parse(readFileSync('conductor.config.json', 'utf8'));
    assert.equal(config.name, 'test-server');
    assert.equal(config.command, 'node');
    assert.deepEqual(config.args, ['server.js']);
    assert.equal(config.cwd, './');
    assert.equal(config.startupTimeout, 10000);
  });

  it('should handle existing files gracefully', async () => {
    // Create package.json
    writeFileSync('package.json', JSON.stringify({ name: 'test' }, null, 2));

    // Create existing files
    writeFileSync('conductor.config.json', '{"existing": true}');
    mkdirSync('test/mcp', { recursive: true });
    writeFileSync('test/mcp/AGENTS.md', 'existing content');

    // Run init command
    const { stdout } = await execAsync(`node ${CONDUCTOR_PATH} init`);

    // Check output includes skip messages
    assert.ok(stdout.includes('⚠️  conductor.config.json already exists, skipping'));
    assert.ok(stdout.includes('⚠️  ./test/mcp directory already exists, skipping'));
    assert.ok(stdout.includes('⚠️  ./test/mcp/AGENTS.md already exists, skipping'));

    // Check existing files weren't overwritten
    const config = readFileSync('conductor.config.json', 'utf8');
    assert.ok(config.includes('"existing": true'), 'Config should not be overwritten');

    const agents = readFileSync('test/mcp/AGENTS.md', 'utf8');
    assert.equal(agents, 'existing content', 'AGENTS.md should not be overwritten');
  });

  it('should fail gracefully without package.json', async () => {
    try {
      await execAsync(`node ${CONDUCTOR_PATH} init`);
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert.ok(error.stderr.includes('❌ Error during initialization: package.json not found'));
      assert.equal(error.code, 1);
    }
  });

  it('should generate correct config for npm-style package.json', async () => {
    // Create npm-style package.json (like npm init -y)
    const packageJson = {
      name: 'my-project',
      version: '1.0.0',
      description: '',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      keywords: [],
      author: '',
      license: 'ISC',
    };
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // Run init command
    await execAsync(`node ${CONDUCTOR_PATH} init`);

    // Check generated config
    const config = JSON.parse(readFileSync('conductor.config.json', 'utf8'));
    assert.equal(config.name, 'my-project');
    assert.deepEqual(config.args, ['index.js']);
  });

  it('should parse npm start script correctly', async () => {
    const packageJson = {
      name: 'test-server',
      scripts: {
        start: 'node src/app.js --port 3000',
      },
    };
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    await execAsync(`node ${CONDUCTOR_PATH} init`);

    const config = JSON.parse(readFileSync('conductor.config.json', 'utf8'));
    assert.deepEqual(config.args, ['src/app.js', '--port', '3000']);
  });

  it('should use existing "tests" directory when it exists', async () => {
    const packageJson = {
      name: 'test-server',
      main: 'server.js',
    };
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // Create existing tests directory
    mkdirSync('tests', { recursive: true });

    await execAsync(`node ${CONDUCTOR_PATH} init`);

    // Should use the existing tests directory
    assert.ok(existsSync('tests/mcp'), 'Should use existing tests directory');
    assert.ok(existsSync('tests/mcp/AGENTS.md'), 'AGENTS.md should be in tests/mcp');
  });

  it('should use existing "test" directory when it exists (and no "tests")', async () => {
    const packageJson = {
      name: 'test-server',
      main: 'server.js',
    };
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // Create existing test directory (not tests)
    mkdirSync('test', { recursive: true });

    await execAsync(`node ${CONDUCTOR_PATH} init`);

    // Should use the existing test directory
    assert.ok(existsSync('test/mcp'), 'Should use existing test directory');
    assert.ok(existsSync('test/mcp/AGENTS.md'), 'AGENTS.md should be in test/mcp');
    assert.ok(!existsSync('tests'), 'Should not create tests directory');
  });

  it('should prefer "tests" over "test" when both exist', async () => {
    const packageJson = {
      name: 'test-server',
      main: 'server.js',
    };
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    // Create both directories
    mkdirSync('test', { recursive: true });
    mkdirSync('tests', { recursive: true });

    await execAsync(`node ${CONDUCTOR_PATH} init`);

    // Should prefer tests directory
    assert.ok(existsSync('tests/mcp'), 'Should use tests directory when both exist');
    assert.ok(existsSync('tests/mcp/AGENTS.md'), 'AGENTS.md should be in tests/mcp');
    assert.ok(!existsSync('test/mcp'), 'Should not create test/mcp when tests exists');
  });

  it('should create "test" directory by default when neither exists', async () => {
    const packageJson = {
      name: 'test-server',
      main: 'server.js',
    };
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    await execAsync(`node ${CONDUCTOR_PATH} init`);

    // Should create test directory by default
    assert.ok(existsSync('test/mcp'), 'Should create test directory by default');
    assert.ok(existsSync('test/mcp/AGENTS.md'), 'AGENTS.md should be in test/mcp');
    assert.ok(!existsSync('tests'), 'Should not create tests directory');
  });
});
