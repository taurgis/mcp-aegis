/**
 * Test utilities and helpers for MCP Conductor tests
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Creates a temporary test configuration file
 */
export async function createTestConfig(dir, name, config) {
  await mkdir(dir, { recursive: true });
  const configPath = join(dir, `${name}.config.json`);
  await writeFile(configPath, JSON.stringify(config, null, 2));
  return configPath;
}

/**
 * Creates a temporary test file
 */
export async function createTestFile(dir, name, content) {
  await mkdir(dir, { recursive: true });
  const testPath = join(dir, `${name}.test.mcp.yml`);
  await writeFile(testPath, content);
  return testPath;
}

/**
 * Creates a minimal MCP server for testing
 */
export function createMinimalMCPServerCode() {
  return `
import { spawn } from 'child_process';

class MinimalMCPServer {
  constructor() {
    this.initialized = false;
  }

  async processMessage(message) {
    const request = JSON.parse(message);
    
    if (request.method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          protocolVersion: '2025-06-18',
          capabilities: { tools: {} },
          serverInfo: { name: 'Minimal Test Server', version: '1.0.0' }
        }
      };
    } else if (request.method === 'notifications/initialized') {
      this.initialized = true;
      return null;
    } else if (request.method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: { tools: [] }
      };
    }
    
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: { code: -32601, message: 'Method not found' }
    };
  }

  start() {
    process.stdin.setEncoding('utf8');
    let buffer = '';
    
    process.stdin.on('data', async (chunk) => {
      buffer += chunk;
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\\n')) !== -1) {
        const message = buffer.substring(0, newlineIndex).trim();
        buffer = buffer.substring(newlineIndex + 1);
        if (message) {
          const response = await this.processMessage(message);
          if (response) {
            process.stdout.write(JSON.stringify(response) + '\\n');
          }
        }
      }
    });

    process.stdin.on('end', () => process.exit(0));
    process.on('SIGTERM', () => process.exit(0));
    process.on('SIGINT', () => process.exit(0));
  }
}

new MinimalMCPServer().start();
`;
}

/**
 * Standard test configurations
 */
export const testConfigs = {
  minimal: {
    name: 'Minimal Test Server',
    command: 'node',
    args: ['./test/fixtures/minimal-server.js']
  },
  
  existing: {
    name: 'Simple Filesystem Server',
    command: 'node',
    args: ['./examples/simple-fs-server.js']
  },
  
  withTimeout: {
    name: 'Timeout Test Server',
    command: 'node',
    args: ['./test/fixtures/minimal-server.js'],
    startupTimeout: 1000
  },
  
  withEnv: {
    name: 'Environment Test Server',
    command: 'node',
    args: ['./test/fixtures/minimal-server.js'],
    env: {
      TEST_MODE: 'true',
      NODE_ENV: 'test'
    }
  }
};

/**
 * Standard test suites
 */
export const testSuites = {
  basic: `
description: "Basic test suite"
tests:
  - it: "should initialize successfully"
    request:
      jsonrpc: "2.0"
      id: "test-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-1"
        result:
          tools: []
`,

  filesystem: `
description: "Filesystem test suite"
tests:
  - it: "should list filesystem tools"
    request:
      jsonrpc: "2.0"
      id: "fs-1"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "fs-1"
        result:
          tools:
            - name: "read_file"
              description: "Reads a file"
`,

  withRegex: `
description: "Regex pattern test suite"  
tests:
  - it: "should match with regex"
    request:
      jsonrpc: "2.0"
      id: "regex-1"
      method: "tools/call"
      params:
        name: "test_tool"
        arguments: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "regex-1"
        result:
          content:
            - type: "text"
              text: "match:Test result \\\\d+"
`
};

/**
 * Mock console for capturing test output
 */
export class MockConsole {
  constructor() {
    this.logs = [];
    this.originalLog = console.log;
    this.originalError = console.error;
  }

  start() {
    console.log = (...args) => {
      this.logs.push({ type: 'log', args });
    };
    console.error = (...args) => {
      this.logs.push({ type: 'error', args });
    };
  }

  stop() {
    console.log = this.originalLog;
    console.error = this.originalError;
  }

  getLogs() {
    return this.logs;
  }

  getOutput() {
    return this.logs.map(entry => entry.args.join(' ')).join('\\n');
  }

  clear() {
    this.logs = [];
  }
}

/**
 * Async delay utility
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Cleanup helper for test files
 */
export async function cleanup(paths) {
  const { unlink } = await import('fs/promises');
  await Promise.all(
    paths.map(async (path) => {
      try {
        await unlink(path);
      } catch (error) {
        // Ignore errors - file might not exist
      }
    })
  );
}
