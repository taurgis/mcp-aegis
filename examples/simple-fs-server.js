#!/usr/bin/env node

/**
 * Simple MCP Server for testing purposes
 * Implements a basic file reading tool via the Model Context Protocol
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';

class SimpleMCPServer {
  constructor() {
    this.initialized = false;
    this.tools = [
      {
        name: 'read_file',
        description: 'Reads a file',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string'
            }
          },
          required: ['path']
        }
      }
    ];
  }

  /**
   * Processes incoming JSON-RPC messages
   */
  async processMessage(message) {
    try {
      const request = JSON.parse(message);
      
      if (request.method === 'initialize') {
        return await this.handleInitialize(request);
      } else if (request.method === 'notifications/initialized') {
        this.initialized = true;
        return null; // Notifications don't get responses
      } else if (request.method === 'tools/list') {
        return await this.handleToolsList(request);
      } else if (request.method === 'tools/call') {
        return await this.handleToolsCall(request);
      } else {
        return this.createErrorResponse(request.id, -32601, 'Method not found');
      }
    } catch (error) {
      return this.createErrorResponse(null, -32700, 'Parse error');
    }
  }

  /**
   * Handles initialize requests
   */
  async handleInitialize(request) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        protocolVersion: '2025-06-18',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'Simple Filesystem Server',
          version: '1.0.0'
        }
      }
    };
  }

  /**
   * Handles tools/list requests
   */
  async handleToolsList(request) {
    if (!this.initialized) {
      return this.createErrorResponse(request.id, -32002, 'Server not initialized');
    }

    return {
      jsonrpc: '2.0',
      id: request.id,
      result: {
        tools: this.tools
      }
    };
  }

  /**
   * Handles tools/call requests
   */
  async handleToolsCall(request) {
    if (!this.initialized) {
      return this.createErrorResponse(request.id, -32002, 'Server not initialized');
    }

    const { name, arguments: args } = request.params;

    if (name === 'read_file') {
      return await this.readFile(request.id, args);
    } else {
      return this.createErrorResponse(request.id, -32602, 'Tool not found');
    }
  }

  /**
   * Implements the read_file tool
   */
  async readFile(requestId, args) {
    try {
      if (!args.path) {
        return {
          jsonrpc: '2.0',
          id: requestId,
          result: {
            isError: true,
            content: [
              {
                type: 'text',
                text: 'Path parameter is required'
              }
            ]
          }
        };
      }

      const filePath = resolve(args.path);
      const content = await readFile(filePath, 'utf8');

      return {
        jsonrpc: '2.0',
        id: requestId,
        result: {
          content: [
            {
              type: 'text',
              text: content.trim() // Trim whitespace including newlines
            }
          ],
          isError: false
        }
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: requestId,
        result: {
          isError: true,
          content: [
            {
              type: 'text',
              text: `File not found: ${error.message}`
            }
          ]
        }
      };
    }
  }

  /**
   * Creates an error response
   */
  createErrorResponse(id, code, message) {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message
      }
    };
  }

  /**
   * Starts the server and processes stdin
   */
  start() {
    process.stdin.setEncoding('utf8');
    
    let buffer = '';
    
    process.stdin.on('data', async (chunk) => {
      buffer += chunk;
      
      // Process complete messages (newline-delimited)
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

    process.stdin.on('end', () => {
      process.exit(0);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      process.exit(0);
    });

    process.on('SIGINT', () => {
      process.exit(0);
    });
  }
}

// Start the server
const server = new SimpleMCPServer();
server.start();
