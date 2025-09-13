#!/usr/bin/env node

/**
 * Data Patterns Test Server - Returns numeric and timestamp data for comprehensive pattern testing
 * Uses basic stdio without external dependencies
 */

class DataPatternsServer {
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

    console.error('Data Patterns Server running on stdio');
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
            serverInfo: { name: 'Data Patterns Server', version: '1.0.0' },
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
              {
                name: 'get_crossfield_data',
                description: 'Get data with related fields for testing cross-field validation patterns',
                inputSchema: {
                  type: 'object',
                  properties: {
                    scenario: {
                      type: 'string',
                      description: 'Test scenario (event, pricing, user, inventory, financial)',
                      default: 'event',
                    },
                  },
                },
              },
              {
                name: 'get_nested_crossfield_data',
                description: 'Get nested object data for testing advanced cross-field validation patterns with dot notation',
                inputSchema: {
                  type: 'object',
                  properties: {
                    scenario: {
                      type: 'string',
                      description: 'Test scenario (nested_event, nested_pricing, nested_user_config, nested_stats, nested_financial, nested_inventory, nested_permissions, deep_nested, mixed_types, business_rules, special_chars, combined_patterns, missing_nested_field, failed_nested_condition)',
                      default: 'nested_event',
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
          case 'financial':
            // Added for failing-numeric-patterns tests: ensure decimalPlaces and range failures
            // price has 2 decimal places (should fail decimalPlaces:3) and tax intentionally out of range 50-100
            data = {
              price: 123.45,      // 2 decimals
              tax: 12.75,         // outside 50-100 range expected by tests
              fee: 7.5,           // extra numeric to show unexpected field handling if not referenced
              discount: 0.05,     // fraction for potential percentage tests
              gross: 131.20,      // derived style value
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
      } else if (request.method === 'tools/call' && request.params.name === 'get_crossfield_data') {
        const scenario = request.params.arguments?.scenario || 'event';
        let data;

        switch (scenario) {
          case 'event':
            data = {
              eventName: 'Annual Conference 2024',
              startDate: '2024-06-01T09:00:00Z',
              endDate: '2024-06-03T17:00:00Z',
              registrationStart: '2024-03-01T00:00:00Z',
              registrationEnd: '2024-05-30T23:59:59Z',
              minParticipants: 50,
              maxParticipants: 500,
              currentParticipants: 350,
              status: 'active',
            };
            break;
          case 'pricing':
            data = {
              productName: 'Premium Widget',
              originalPrice: 100.00,
              discountPrice: 80.00,
              minPrice: 50.00,
              maxDiscount: 30.00,
              currentDiscount: 20.00,
              wholesalePrice: 60.00,
              retailPrice: 100.00,
              cost: 40.00,
            };
            break;
          case 'user':
            data = {
              username: 'john_doe',
              age: 28,
              minAge: 18,
              maxAge: 65,
              accountBalance: 1500.50,
              creditLimit: 2000.00,
              availableCredit: 500.00,
              lastLoginDate: '2024-09-01T14:30:00Z',
              accountCreatedDate: '2022-01-15T10:00:00Z',
              passwordLastChanged: '2024-08-15T09:00:00Z',
            };
            break;
          case 'inventory':
            data = {
              productId: 'WIDGET-001',
              currentStock: 250,
              minStock: 50,
              maxStock: 1000,
              reorderLevel: 100,
              pendingOrders: 75,
              reservedStock: 25,
              availableStock: 200,
              lastRestocked: '2024-08-30T10:00:00Z',
              nextDelivery: '2024-09-15T14:00:00Z',
            };
            break;
          case 'financial':
            data = {
              transactionId: 'TXN-12345',
              amount: 250.75,
              minAmount: 10.00,
              maxAmount: 1000.00,
              fee: 5.25,
              netAmount: 245.50,
              balance: 1500.00,
              availableBalance: 1254.50,
              creditScore: 750,
              minCreditScore: 600,
              debtToIncomeRatio: 0.25,
              maxDebtToIncomeRatio: 0.40,
            };
            break;
          default:
            data = { error: 'Unknown scenario' };
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
      } else if (request.method === 'tools/call' && request.params.name === 'get_nested_crossfield_data') {
        const scenario = request.params.arguments?.scenario || 'nested_event';
        let data;

        switch (scenario) {
          case 'nested_event':
            data = {
              event: {
                name: 'Annual Conference 2024',
                startTime: '2024-06-01T09:00:00Z',
                endTime: '2024-06-03T17:00:00Z',
                registration: {
                  start: '2024-03-01T00:00:00Z',
                  end: '2024-05-30T23:59:59Z',
                },
                participants: {
                  current: 350,
                  minimum: 50,
                  maximum: 500,
                },
              },
              status: 'active',
            };
            break;
          case 'nested_pricing':
            data = {
              pricing: {
                discount: 20,
                maxDiscount: 50,
                wholesale: {
                  price: 60.00,
                  minimumQuantity: 100,
                },
                retail: {
                  price: 100.00,
                  margin: 0.40,
                },
                tiers: {
                  bronze: 80.00,
                  silver: 75.00,
                  gold: 70.00,
                },
              },
              product: {
                name: 'Premium Widget',
                category: 'electronics',
              },
            };
            break;
          case 'nested_user_config':
            data = {
              user: {
                id: 'user-123',
                age: 25,
                profile: {
                  maxConnections: 50,
                  preferences: {
                    notifications: true,
                    theme: 'dark',
                  },
                },
                permissions: {
                  level: 3,
                  roles: ['user', 'moderator'],
                },
              },
              config: {
                minimumAge: 18,
                system: {
                  connectionLimit: 100,
                  maxUsers: 1000,
                },
                defaults: {
                  theme: 'light',
                  notifications: false,
                },
              },
            };
            break;
          case 'nested_stats':
            data = {
              stats: {
                used: 75,
                limit: 100,
                memory: {
                  used: 512,
                  allocated: 1024,
                  available: 512,
                },
                cpu: {
                  usage: 45.5,
                  cores: 4,
                  frequency: 2.4,
                },
                disk: {
                  used: 250,
                  total: 500,
                },
              },
              performance: {
                responseTime: 120,
                throughput: 850,
              },
            };
            break;
          case 'nested_financial':
            data = {
              transaction: {
                id: 'txn-456',
                amount: 750.00,
                currency: 'USD',
                fees: {
                  processing: 15.00,
                  service: 5.00,
                },
              },
              account: {
                id: 'acc-789',
                balance: 2500.00,
                credit: {
                  limit: 5000.00,
                  used: 1200.00,
                  available: 3800.00,
                },
                owner: {
                  name: 'John Doe',
                  creditScore: 750,
                },
              },
            };
            break;
          case 'nested_inventory':
            data = {
              stock: {
                current: 150,
                reserved: 25,
                available: 125,
                minimum: 50,
              },
              inventory: {
                total: {
                  units: 800,
                  value: 45000.00,
                },
                categories: {
                  electronics: 250,
                  clothing: 300,
                  books: 250,
                },
              },
              warehouse: {
                id: 'WH-001',
                capacity: {
                  maxUnits: 1000,
                  currentUnits: 800,
                },
                location: {
                  zone: 'A',
                  aisle: 12,
                },
              },
            };
            break;
          case 'nested_permissions':
            data = {
              user: {
                id: 'usr-555',
                level: 5,
                role: {
                  name: 'manager',
                  priority: 3,
                  permissions: ['read', 'write', 'delete'],
                },
              },
              access: {
                required: 3,
                resource: 'confidential-data',
              },
              resource: {
                id: 'res-888',
                access: {
                  minPriority: 2,
                  requiredRoles: ['manager', 'admin'],
                },
              },
            };
            break;
          case 'deep_nested':
            data = {
              level1: {
                level2: {
                  level3: {
                    level4: {
                      value: 42,
                      data: 'deep value',
                    },
                  },
                  threshold: 10,
                },
              },
              company: {
                division: {
                  team: {
                    member: {
                      clearanceLevel: 4,
                      name: 'Alice Smith',
                    },
                  },
                },
              },
              project: {
                security: {
                  requirements: {
                    minClearance: 3,
                    classification: 'confidential',
                  },
                },
              },
            };
            break;
          case 'mixed_types':
            data = {
              config: {
                performance: {
                  timeout: 3000, // number
                  retryDelay: '500', // string number
                  maxRetries: '5', // string number
                },
              },
              schedule: {
                meeting: {
                  startTime: '2024-09-11T14:00:00Z',
                  endTime: '2024-09-11T15:30:00Z',
                  duration: 90, // minutes
                },
              },
            };
            break;
          case 'business_rules':
            data = {
              order: {
                id: 'ORD-001',
                items: {
                  total: {
                    price: 450.00,
                    quantity: 3,
                  },
                },
                shipping: {
                  estimatedDelivery: '2024-09-20T10:00:00Z',
                  cost: 25.00,
                },
                processing: {
                  completedDate: '2024-09-12T16:30:00Z',
                  status: 'processed',
                },
              },
              customer: {
                id: 'CUST-456',
                account: {
                  creditLimit: 1000.00,
                  currentBalance: 150.00,
                },
                profile: {
                  vipStatus: true,
                  memberSince: '2020-01-01',
                },
              },
            };
            break;
          case 'special_chars':
            data = {
              'user-data': {
                'max-count': 100,
                'active-sessions': 15,
              },
              'current-usage': {
                'active-count': 75,
                'peak-count': 85,
              },
              'system-config': {
                'connection-limit': 200,
                'session-timeout': 3600,
              },
            };
            break;
          case 'combined_patterns':
            data = {
              metrics: {
                performance: {
                  score: 85.5,
                  benchmark: 80.0,
                },
                baseline: {
                  minimum: 70.0,
                  target: 90.0,
                },
              },
              status: 'active-monitoring',
              dataPoints: [
                { timestamp: '2024-09-11T10:00:00Z', value: 82.1 },
                { timestamp: '2024-09-11T11:00:00Z', value: 84.3 },
                { timestamp: '2024-09-11T12:00:00Z', value: 85.5 },
                { timestamp: '2024-09-11T13:00:00Z', value: 86.2 },
                { timestamp: '2024-09-11T14:00:00Z', value: 85.9 },
              ],
              lastUpdated: '2024-09-11T14:00:00Z',
            };
            break;
          case 'missing_nested_field':
            data = {
              event: {
                name: 'Conference 2024',
                startTime: '2024-06-01T09:00:00Z',
                // endTime is intentionally missing
              },
              status: 'pending',
              'match:not:crossField': 'event.startTime < event.endTime',
            };
            break;
          case 'failed_nested_condition':
            data = {
              event: {
                name: 'Conference 2024',
                startTime: '2024-06-01T15:00:00Z', // Later time
                endTime: '2024-06-01T12:00:00Z',   // Earlier time (fails condition)
              },
              status: 'invalid',
              'match:not:crossField': 'event.startTime < event.endTime',
            };
            break;
          default:
            data = { error: 'Unknown nested scenario' };
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

new DataPatternsServer();
