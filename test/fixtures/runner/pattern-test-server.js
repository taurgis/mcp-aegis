
import { createServer } from 'http';
import { spawn } from 'child_process';

class PatternTestServer {
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
          serverInfo: { name: 'Pattern Test', version: '1.0.0' },
        },
      };
    } else if (request.method === 'initialized') {
      this.initialized = true;
      return null;
    } else if (request.method === 'tools/call' && request.params.name === 'pattern_test') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          content: [{ type: 'text', text: 'Pattern: 12345 matches!' }],
          isError: false,
        },
      };
    }

    return { jsonrpc: '2.0', id: request.id, error: { code: -32601, message: 'Method not found' } };
  }

  start() {
    process.stdin.setEncoding('utf8');
    let buffer = '';

    process.stdin.on('data', async (chunk) => {
      buffer += chunk;
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const message = buffer.substring(0, newlineIndex).trim();
        buffer = buffer.substring(newlineIndex + 1);
        if (message) {
          const response = await this.processMessage(message);
          if (response) {
            process.stdout.write(`${JSON.stringify(response)  }\n`);
          }
        }
      }
    });

    process.stdin.on('end', () => process.exit(0));
    process.on('SIGTERM', () => process.exit(0));
    process.on('SIGINT', () => process.exit(0));
  }
}

new PatternTestServer().start();
