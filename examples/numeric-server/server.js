#!/usr/bin/env node

/**
 * Simple Numeric Test Server - Returns numeric data for pattern testing
 * Uses basic stdio without external dependencies
 */

class SimpleNumericServer {
  constructor() {
    process.stdin.setEncoding('utf8');
    process.stdout.setEncoding('utf8');

    let buffer = '';
    process.stdin.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          this.handleMessage(line);
        }
      }
    });

    process.on('SIGINT', () => {
      process.exit(0);
    });

    console.error('Simple Numeric Server running on stdio');
  }

  handleMessage(message) {
    try {
      const request = JSON.parse(message);

      if (request.method === 'initialize') {
        const response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            protocolVersion: '2025-06-18',
            serverInfo: { name: 'Simple Numeric Server', version: '1.0.0' },
            capabilities: { tools: {} },
          },
        };
        this.sendMessage(response);
      } else if (request.method === 'notifications/initialized' || request.method === 'initialized') {
        // No response needed for notification
      } else if (request.method === 'tools/list') {
        const response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: [
              {
                name: 'get_numeric_data',
                description: 'Get numeric data for testing patterns',
                inputSchema: {
                  type: 'object',
                  properties: {
                    dataset: {
                      type: 'string',
                      description: 'Dataset to return (api, performance, ecommerce, validation)',
                    },
                  },
                  required: ['dataset'],
                },
              },
            ],
          },
        };
        this.sendMessage(response);
      } else if (request.method === 'tools/call' && request.params.name === 'get_numeric_data') {
        const dataset = request.params.arguments.dataset || 'api';
        let data;

        switch (dataset) {
          case 'api':
            data = {
              requestCount: 1250,
              errorCount: 3,
              averageResponseTime: 142,
              uptime: 99.8,
              activeUsers: 847,
              version: 2.1,
            };
            break;
          case 'performance':
            data = {
              cpuUsage: 67,
              memoryUsage: 82,
              diskUsage: 45,
              responseTime: 89,
              throughput: 1500,
              loadAverage: 1.2,
            };
            break;
          case 'ecommerce':
            data = {
              productCount: 42,
              price: 24.99,
              rating: 4.2,
              stock: 15,
              discountPercent: 12,
              categoryId: 8,
            };
            break;
          case 'validation':
            data = {
              score: 87,
              attempts: 2,
              successRate: 95.5,
              version: 2.1,
              priority: 5,
              retries: 1,
            };
            break;
          default:
            data = { error: 'Unknown dataset' };
        }

        const response = {
          jsonrpc: '2.0',
          id: request.id,
          result: data,
        };
        this.sendMessage(response);
      } else {
        // Unknown method
        const response = {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32601,
            message: 'Method not found',
          },
        };
        this.sendMessage(response);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  sendMessage(message) {
    console.log(JSON.stringify(message));
  }
}

new SimpleNumericServer();
