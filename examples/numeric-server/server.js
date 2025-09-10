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
                      description: 'Dataset to return (api, performance, ecommerce, validation, timestamps)',
                    },
                  },
                  required: ['dataset'],
                },
              },
              {
                name: 'get_timestamp_data',
                description: 'Get timestamp and date data for testing date patterns',
                inputSchema: {
                  type: 'object',
                  properties: {
                    format: {
                      type: 'string',
                      description: 'Format type (iso, timestamp, mixed)',
                      default: 'iso',
                    },
                  },
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
          case 'timestamps':
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            data = {
              currentTime: now.toISOString(),
              oneHourAgo: oneHourAgo.toISOString(),
              oneDayAgo: oneDayAgo.toISOString(),
              oneWeekAgo: oneWeekAgo.toISOString(),
              fixedDate: '2023-06-15T10:30:00.000Z',
              fixedTimestamp: 1687686600000, // 2023-06-25T10:30:00.000Z
              validDateString: '2023-01-01T00:00:00Z',
              invalidDateString: 'not-a-date',
              usDateFormat: '06/15/2023',
              timestampSeconds: Math.floor(now.getTime() / 1000),
              timestampMs: now.getTime(),
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
      } else if (request.method === 'tools/call' && request.params.name === 'get_timestamp_data') {
        const format = request.params.arguments?.format || 'iso';
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        let data;

        switch (format) {
          case 'iso':
            data = {
              createdAt: now.toISOString(),
              updatedAt: twoHoursAgo.toISOString(),
              publishDate: '2023-05-15T14:30:00.000Z',
              expireDate: '2024-12-31T23:59:59.999Z',
              validDate: '2023-01-01T12:00:00Z',
            };
            break;
          case 'timestamp':
            data = {
              createdAt: now.getTime(),
              updatedAt: twoHoursAgo.getTime(),
              publishTimestamp: 1684159800000, // 2023-05-15T14:30:00.000Z
              expireTimestamp: 1735689599999, // 2024-12-31T23:59:59.999Z
              validTimestamp: 1672574400000, // 2023-01-01T12:00:00.000Z
            };
            break;
          case 'mixed':
            data = {
              isoDate: now.toISOString(),
              timestamp: yesterday.getTime(),
              dateString: '2023-06-15',
              timeString: '14:30:00',
              usFormat: '12/25/2023',
              invalidDate: 'not-a-date',
              emptyDate: '',
              nullDate: null,
            };
            break;
          default:
            data = { error: 'Unknown format' };
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
