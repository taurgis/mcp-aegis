#!/usr/bin/env node

/**
 * Multi-Tool MCP Server
 * Provides multiple tools for comprehensive testing scenarios:
 * - calculator: Basic math operations
 * - text_processor: Text manipulation and analysis
 * - data_validator: Data format validation
 * - file_manager: File operations (list, create, delete)
 */

import { spawn } from 'child_process';

class MultiToolMCPServer {
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
          serverInfo: {
            name: 'Multi-Tool MCP Server',
            version: '1.0.0'
          }
        }
      };
    } else if (request.method === 'notifications/initialized') {
      this.initialized = true;
      return null;
    } else if (request.method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          tools: [
            {
              name: 'calculator',
              description: 'Performs basic mathematical operations',
              inputSchema: {
                type: 'object',
                properties: {
                  operation: {
                    type: 'string',
                    enum: ['add', 'subtract', 'multiply', 'divide']
                  },
                  a: { type: 'number' },
                  b: { type: 'number' }
                },
                required: ['operation', 'a', 'b']
              }
            },
            {
              name: 'text_processor',
              description: 'Processes and analyzes text content',
              inputSchema: {
                type: 'object',
                properties: {
                  action: {
                    type: 'string',
                    enum: ['analyze', 'reverse', 'uppercase', 'count_words']
                  },
                  text: { type: 'string' }
                },
                required: ['action', 'text']
              }
            },
            {
              name: 'data_validator',
              description: 'Validates various data formats',
              inputSchema: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['email', 'url', 'json', 'uuid']
                  },
                  data: { type: 'string' }
                },
                required: ['type', 'data']
              }
            },
            {
              name: 'file_manager',
              description: 'Manages files and directories',
              inputSchema: {
                type: 'object',
                properties: {
                  action: {
                    type: 'string',
                    enum: ['list', 'create', 'delete', 'exists']
                  },
                  path: { type: 'string' },
                  content: { type: 'string' }
                },
                required: ['action', 'path']
              }
            }
          ]
        }
      };
    } else if (request.method === 'tools/call') {
      return await this.handleToolCall(request);
    }
    
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: { code: -32601, message: 'Method not found' }
    };
  }

  async handleToolCall(request) {
    const { name, arguments: args } = request.params;

    try {
      let result;
      
      switch (name) {
        case 'calculator':
          result = this.handleCalculator(args);
          break;
        case 'text_processor':
          result = this.handleTextProcessor(args);
          break;
        case 'data_validator':
          result = this.handleDataValidator(args);
          break;
        case 'file_manager':
          result = await this.handleFileManager(args);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        jsonrpc: '2.0',
        id: request.id,
        result
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          isError: true,
          content: [{
            type: 'text',
            text: error.message
          }]
        }
      };
    }
  }

  handleCalculator(args) {
    const { operation, a, b } = args;
    let result;

    switch (operation) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        if (b === 0) throw new Error('Division by zero');
        result = a / b;
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    return {
      content: [{
        type: 'text',
        text: `Result: ${result}`
      }],
      isError: false
    };
  }

  handleTextProcessor(args) {
    const { action, text } = args;
    let result;

    switch (action) {
      case 'analyze':
        const chars = text.length;
        const words = text.trim().split(/\s+/).length;
        const lines = text.split('\n').length;
        result = `Characters: ${chars}, Words: ${words}, Lines: ${lines}`;
        break;
      case 'reverse':
        result = text.split('').reverse().join('');
        break;
      case 'uppercase':
        result = text.toUpperCase();
        break;
      case 'count_words':
        result = text.trim().split(/\s+/).length.toString();
        break;
      default:
        throw new Error(`Unsupported text action: ${action}`);
    }

    return {
      content: [{
        type: 'text',
        text: result
      }],
      isError: false
    };
  }

  handleDataValidator(args) {
    const { type, data } = args;
    let isValid = false;
    let message = '';

    switch (type) {
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        isValid = emailRegex.test(data);
        message = isValid ? 'Valid email address' : 'Invalid email format';
        break;
      case 'url':
        try {
          new URL(data);
          isValid = true;
          message = 'Valid URL';
        } catch {
          isValid = false;
          message = 'Invalid URL format';
        }
        break;
      case 'json':
        try {
          JSON.parse(data);
          isValid = true;
          message = 'Valid JSON';
        } catch {
          isValid = false;
          message = 'Invalid JSON format';
        }
        break;
      case 'uuid':
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        isValid = uuidRegex.test(data);
        message = isValid ? 'Valid UUID' : 'Invalid UUID format';
        break;
      default:
        throw new Error(`Unsupported validation type: ${type}`);
    }

    return {
      content: [{
        type: 'text',
        text: `${message} - Status: ${isValid ? 'VALID' : 'INVALID'}`
      }],
      isError: false
    };
  }

  async handleFileManager(args) {
    const { action, path, content } = args;
    const fs = await import('fs/promises');

    try {
      switch (action) {
        case 'exists':
          const exists = await fs.access(path).then(() => true).catch(() => false);
          return {
            content: [{
              type: 'text',
              text: `File exists: ${exists}`
            }],
            isError: false
          };
        case 'list':
          const files = await fs.readdir(path);
          return {
            content: [{
              type: 'text',
              text: `Files: ${files.join(', ')}`
            }],
            isError: false
          };
        case 'create':
          if (!content) throw new Error('Content required for create action');
          await fs.writeFile(path, content);
          return {
            content: [{
              type: 'text',
              text: `File created: ${path}`
            }],
            isError: false
          };
        case 'delete':
          await fs.unlink(path);
          return {
            content: [{
              type: 'text',
              text: `File deleted: ${path}`
            }],
            isError: false
          };
        default:
          throw new Error(`Unsupported file action: ${action}`);
      }
    } catch (error) {
      throw new Error(`File operation failed: ${error.message}`);
    }
  }

  start() {
    console.error('Multi-Tool MCP Server started');
    
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
            process.stdout.write(JSON.stringify(response) + '\n');
          }
        }
      }
    });

    process.stdin.on('end', () => process.exit(0));
    process.on('SIGTERM', () => process.exit(0));
    process.on('SIGINT', () => process.exit(0));
  }
}

new MultiToolMCPServer().start();
