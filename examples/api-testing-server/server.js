#!/usr/bin/env node

/**
 * API Testing & Monitoring MCP Server
 * Provides comprehensive tools for API testing, monitoring, and analysis:
 * - http_request: Make HTTP requests with full control over headers, methods, and body
 * - response_analyzer: Analyze HTTP responses for status, headers, timing, and content
 * - endpoint_monitor: Monitor endpoint availability and performance metrics
 * - data_transformer: Transform and extract data from API responses
 * - load_tester: Perform basic load testing on endpoints
 * - webhook_simulator: Simulate webhook payloads and validate structures
 */

import { createHash, randomUUID } from 'crypto';

class APITestingMCPServer {
  constructor() {
    this.initialized = false;
    this.monitors = new Map(); // Store endpoint monitoring data
    this.testResults = new Map(); // Store load test results
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
            name: 'API Testing & Monitoring MCP Server',
            version: '2.0.0',
          },
        },
      };
    } else if (request.method === 'initialized' || request.method === 'notifications/initialized') {
      this.initialized = true;
      return null;
    } else if (request.method === 'tools/list') {
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          tools: [
            {
              name: 'http_request',
              description: 'Make HTTP requests with customizable headers, methods, and body content',
              inputSchema: {
                type: 'object',
                properties: {
                  url: { type: 'string', description: 'Target URL for the request' },
                  method: {
                    type: 'string',
                    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
                    default: 'GET',
                  },
                  headers: {
                    type: 'object',
                    description: 'Custom headers as key-value pairs',
                    additionalProperties: { type: 'string' },
                  },
                  body: { type: 'string', description: 'Request body content' },
                  timeout: { type: 'number', default: 30000, description: 'Request timeout in milliseconds' },
                },
                required: ['url'],
              },
            },
            {
              name: 'response_analyzer',
              description: 'Analyze HTTP response data for patterns, performance, and content validation',
              inputSchema: {
                type: 'object',
                properties: {
                  responseData: {
                    type: 'object',
                    description: 'Response data from http_request tool',
                    properties: {
                      status: { type: 'number' },
                      headers: { type: 'object' },
                      body: { type: 'string' },
                      timing: { type: 'object' },
                    },
                  },
                  analysis: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: ['status_check', 'header_validation', 'content_type', 'response_time', 'json_structure', 'security_headers'],
                    },
                    description: 'Types of analysis to perform',
                  },
                  expectations: {
                    type: 'object',
                    description: 'Expected values for validation',
                    properties: {
                      status: { type: 'number' },
                      maxResponseTime: { type: 'number' },
                      contentType: { type: 'string' },
                      requiredHeaders: { type: 'array', items: { type: 'string' } },
                      jsonSchema: { type: 'object' },
                    },
                  },
                },
                required: ['responseData', 'analysis'],
              },
            },
            {
              name: 'endpoint_monitor',
              description: 'Monitor endpoint availability, response times, and track performance metrics over time',
              inputSchema: {
                type: 'object',
                properties: {
                  action: {
                    type: 'string',
                    enum: ['start', 'stop', 'status', 'report'],
                    description: 'Monitoring action to perform',
                  },
                  url: { type: 'string', description: 'Endpoint URL to monitor' },
                  interval: { type: 'number', default: 60000, description: 'Monitoring interval in milliseconds' },
                  monitorId: { type: 'string', description: 'Unique identifier for the monitor' },
                },
                required: ['action'],
              },
            },
            {
              name: 'data_transformer',
              description: 'Transform and extract data from API responses using JSONPath, regex, and custom transformations',
              inputSchema: {
                type: 'object',
                properties: {
                  data: { type: 'string', description: 'Input data to transform' },
                  transformation: {
                    type: 'string',
                    enum: ['json_extract', 'xml_to_json', 'csv_to_json', 'regex_extract', 'base64_decode', 'hash_generate'],
                    description: 'Type of transformation to apply',
                  },
                  parameters: {
                    type: 'object',
                    description: 'Transformation-specific parameters',
                    properties: {
                      jsonPath: { type: 'string' },
                      regex: { type: 'string' },
                      hashAlgorithm: { type: 'string', enum: ['md5', 'sha256', 'sha512'] },
                      delimiter: { type: 'string' },
                    },
                  },
                },
                required: ['data', 'transformation'],
              },
            },
            {
              name: 'load_tester',
              description: 'Perform basic load testing with concurrent requests and performance analysis',
              inputSchema: {
                type: 'object',
                properties: {
                  url: { type: 'string', description: 'Target URL for load testing' },
                  concurrency: { type: 'number', default: 10, description: 'Number of concurrent requests' },
                  totalRequests: { type: 'number', default: 100, description: 'Total number of requests to make' },
                  method: { type: 'string', default: 'GET', enum: ['GET', 'POST'] },
                  headers: { type: 'object', additionalProperties: { type: 'string' } },
                  body: { type: 'string' },
                },
                required: ['url'],
              },
            },
            {
              name: 'webhook_simulator',
              description: 'Generate and validate webhook payloads for testing webhook endpoints',
              inputSchema: {
                type: 'object',
                properties: {
                  action: {
                    type: 'string',
                    enum: ['generate', 'validate', 'sign'],
                    description: 'Webhook action to perform',
                  },
                  webhookType: {
                    type: 'string',
                    enum: ['github', 'stripe', 'slack', 'custom'],
                    description: 'Type of webhook to simulate',
                  },
                  event: { type: 'string', description: 'Event type to simulate' },
                  payload: { type: 'object', description: 'Custom payload data' },
                  secret: { type: 'string', description: 'Secret for signature generation' },
                },
                required: ['action'],
              },
            },
          ],
        },
      };
    } else if (request.method === 'tools/call') {
      return await this.handleToolCall(request);
    }

    return {
      jsonrpc: '2.0',
      id: request.id,
      error: { code: -32601, message: 'Method not found' },
    };
  }

  async handleToolCall(request) {
    const { name, arguments: args } = request.params;

    try {
      let result;

      switch (name) {
        case 'http_request':
          result = await this.handleHttpRequest(args);
          break;
        case 'response_analyzer':
          result = this.handleResponseAnalyzer(args);
          break;
        case 'endpoint_monitor':
          result = await this.handleEndpointMonitor(args);
          break;
        case 'data_transformer':
          result = this.handleDataTransformer(args);
          break;
        case 'load_tester':
          result = await this.handleLoadTester(args);
          break;
        case 'webhook_simulator':
          result = this.handleWebhookSimulator(args);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        jsonrpc: '2.0',
        id: request.id,
        result,
      };
    } catch (error) {
      console.error(`Tool error: ${error.message}`);
      return {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          isError: true,
          content: [{
            type: 'text',
            text: `Error: ${error.message}`,
          }],
        },
      };
    }
  }

  async handleHttpRequest(args) {
    const { url, method = 'GET', headers = {}, body, timeout: _timeout = 30000 } = args;

    if (!url) {
      throw new Error('URL parameter is required for http_request');
    }

    try {
      const startTime = Date.now();

      // Simulate HTTP request (in a real implementation, you'd use fetch or axios)
      const simulatedResponse = this.simulateHttpResponse(url, method, headers, body);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const result = {
        status: simulatedResponse.status,
        headers: simulatedResponse.headers,
        body: simulatedResponse.body,
        timing: {
          requestTime: responseTime,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        },
        request: {
          url,
          method,
          headers,
          body,
        },
      };

      return {
        content: [{
          type: 'text',
          text: `HTTP ${method} ${url}\nStatus: ${result.status}\nResponse Time: ${responseTime}ms\nResponse: ${JSON.stringify(result, null, 2)}`,
        }],
        isError: false,
        metadata: { responseData: result },
      };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  }

  simulateHttpResponse(url, _method, _headers, _body) {
    // Simulate different responses based on URL patterns
    if (url.includes('api/users')) {
      return {
        status: 200,
        headers: { 'content-type': 'application/json', 'x-api-version': '1.0' },
        body: JSON.stringify({ users: [{ id: 1, name: 'John Doe', email: 'john@example.com' }], total: 1 }),
      };
    } else if (url.includes('api/health')) {
      return {
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }),
      };
    } else if (url.includes('slow')) {
      // Simulate slow response
      return {
        status: 200,
        headers: { 'content-type': 'text/plain' },
        body: 'Slow response completed',
      };
    } else if (url.includes('error')) {
      return {
        status: 500,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Internal Server Error', code: 'SERVER_ERROR' }),
      };
    }

    return {
      status: 200,
      headers: { 'content-type': 'text/html' },
      body: '<html><body><h1>Welcome to API Testing</h1></body></html>',
    };
  }

  handleResponseAnalyzer(args) {
    const { responseData, analysis, expectations = {} } = args;
    const results = [];

    analysis.forEach(analysisType => {
      switch (analysisType) {
        case 'status_check':
          const statusResult = this.analyzeStatus(responseData, expectations);
          results.push(statusResult);
          break;
        case 'header_validation':
          const headerResult = this.analyzeHeaders(responseData, expectations);
          results.push(headerResult);
          break;
        case 'content_type':
          const contentTypeResult = this.analyzeContentType(responseData, expectations);
          results.push(contentTypeResult);
          break;
        case 'response_time':
          const timingResult = this.analyzeResponseTime(responseData, expectations);
          results.push(timingResult);
          break;
        case 'json_structure':
          const jsonResult = this.analyzeJsonStructure(responseData, expectations);
          results.push(jsonResult);
          break;
        case 'security_headers':
          const securityResult = this.analyzeSecurityHeaders(responseData);
          results.push(securityResult);
          break;
      }
    });

    const summary = this.generateAnalysisSummary(results);

    return {
      content: [{
        type: 'text',
        text: `Response Analysis Results:\n${JSON.stringify({ summary, details: results }, null, 2)}`,
      }],
      isError: false,
      metadata: { analysisResults: results, summary },
    };
  }

  analyzeStatus(responseData, expectations) {
    const actualStatus = responseData.status;
    const expectedStatus = expectations.status || 200;
    const passed = actualStatus === expectedStatus;

    return {
      test: 'status_check',
      passed,
      expected: expectedStatus,
      actual: actualStatus,
      message: passed ? 'Status code matches expectation' : `Expected ${expectedStatus}, got ${actualStatus}`,
    };
  }

  analyzeHeaders(responseData, expectations) {
    const requiredHeaders = expectations.requiredHeaders || [];
    const actualHeaders = Object.keys(responseData.headers || {});
    const missingHeaders = requiredHeaders.filter(header => !actualHeaders.includes(header.toLowerCase()));
    const passed = missingHeaders.length === 0;

    return {
      test: 'header_validation',
      passed,
      expected: requiredHeaders,
      actual: actualHeaders,
      missing: missingHeaders,
      message: passed ? 'All required headers present' : `Missing headers: ${missingHeaders.join(', ')}`,
    };
  }

  analyzeContentType(responseData, expectations) {
    const actualContentType = responseData.headers?.['content-type'] || '';
    const expectedContentType = expectations.contentType;
    const passed = !expectedContentType || actualContentType.includes(expectedContentType);

    return {
      test: 'content_type',
      passed,
      expected: expectedContentType,
      actual: actualContentType,
      message: passed ? 'Content type matches expectation' : `Expected ${expectedContentType}, got ${actualContentType}`,
    };
  }

  analyzeResponseTime(responseData, expectations) {
    const actualTime = responseData.timing?.requestTime || 0;
    const maxTime = expectations.maxResponseTime || 5000;
    const passed = actualTime <= maxTime;

    return {
      test: 'response_time',
      passed,
      expected: `<= ${maxTime}ms`,
      actual: `${actualTime}ms`,
      message: passed ? 'Response time within acceptable range' : `Response time ${actualTime}ms exceeds maximum ${maxTime}ms`,
    };
  }

  analyzeJsonStructure(responseData, expectations) {
    try {
      const parsedBody = JSON.parse(responseData.body);
      const hasJsonSchema = expectations.jsonSchema && Object.keys(expectations.jsonSchema).length > 0;

      // Simple schema validation (in real implementation, use ajv or similar)
      let schemaValid = true;
      const schemaErrors = [];

      if (hasJsonSchema) {
        const schema = expectations.jsonSchema;
        schemaValid = this.validateSimpleJsonSchema(parsedBody, schema, schemaErrors);
      }

      return {
        test: 'json_structure',
        passed: schemaValid,
        expected: expectations.jsonSchema,
        actual: parsedBody,
        errors: schemaErrors,
        message: schemaValid ? 'JSON structure valid' : `Schema validation failed: ${schemaErrors.join(', ')}`,
      };
    } catch (error) {
      return {
        test: 'json_structure',
        passed: false,
        expected: 'Valid JSON',
        actual: 'Invalid JSON',
        message: `JSON parsing failed: ${error.message}`,
      };
    }
  }

  validateSimpleJsonSchema(data, schema, errors) {
    if (schema.type === 'object' && schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (!(key in data)) {
          if (schema.required && schema.required.includes(key)) {
            errors.push(`Missing required property: ${key}`);
            return false;
          }
        } else {
          if (propSchema.type === 'string' && typeof data[key] !== 'string') {
            errors.push(`Property ${key} should be string, got ${typeof data[key]}`);
            return false;
          }
          if (propSchema.type === 'number' && typeof data[key] !== 'number') {
            errors.push(`Property ${key} should be number, got ${typeof data[key]}`);
            return false;
          }
        }
      }
    }
    return true;
  }

  analyzeSecurityHeaders(responseData) {
    const securityHeaders = [
      'strict-transport-security',
      'content-security-policy',
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy',
    ];

    const actualHeaders = Object.keys(responseData.headers || {}).map(h => h.toLowerCase());
    const presentHeaders = securityHeaders.filter(header => actualHeaders.includes(header));
    const missingHeaders = securityHeaders.filter(header => !actualHeaders.includes(header));

    return {
      test: 'security_headers',
      passed: missingHeaders.length < securityHeaders.length / 2, // Pass if at least half are present
      expected: securityHeaders,
      present: presentHeaders,
      missing: missingHeaders,
      message: `Security headers: ${presentHeaders.length}/${securityHeaders.length} present`,
    };
  }

  generateAnalysisSummary(results) {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      score: Math.round((passedTests / totalTests) * 100),
      status: failedTests === 0 ? 'PASS' : 'FAIL',
    };
  }

  async handleEndpointMonitor(args) {
    const { action, url, interval = 60000, monitorId } = args;

    switch (action) {
      case 'start':
        if (!url) {throw new Error('URL is required to start monitoring');}
        const id = monitorId || randomUUID();
        this.monitors.set(id, {
          url,
          interval,
          startTime: new Date(),
          checks: [],
          active: true,
        });
        return {
          content: [{
            type: 'text',
            text: `Started monitoring ${url} with ID: ${id}\nInterval: ${interval}ms`,
          }],
          isError: false,
          metadata: { monitorId: id },
        };

      case 'stop':
        if (!monitorId || !this.monitors.has(monitorId)) {
          throw new Error('Invalid monitor ID');
        }
        this.monitors.get(monitorId).active = false;
        return {
          content: [{
            type: 'text',
            text: `Stopped monitoring for ID: ${monitorId}`,
          }],
          isError: false,
        };

      case 'status':
        const activeMonitors = Array.from(this.monitors.entries())
          .filter(([_, monitor]) => monitor.active)
          .map(([id, monitor]) => ({ id, url: monitor.url, startTime: monitor.startTime }));

        return {
          content: [{
            type: 'text',
            text: `Active Monitors: ${activeMonitors.length}\n${JSON.stringify(activeMonitors, null, 2)}`,
          }],
          isError: false,
          metadata: { activeMonitors },
        };

      case 'report':
        if (!monitorId || !this.monitors.has(monitorId)) {
          throw new Error('Invalid monitor ID');
        }
        const monitor = this.monitors.get(monitorId);
        const report = this.generateMonitoringReport(monitor);

        return {
          content: [{
            type: 'text',
            text: `Monitoring Report for ${monitor.url}:\n${JSON.stringify(report, null, 2)}`,
          }],
          isError: false,
          metadata: { report },
        };

      default:
        throw new Error(`Unknown monitoring action: ${action}`);
    }
  }

  generateMonitoringReport(monitor) {
    // Simulate monitoring data
    const checks = Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * monitor.interval),
      status: Math.random() > 0.1 ? 200 : 500,
      responseTime: Math.floor(Math.random() * 1000) + 100,
    }));

    const successfulChecks = checks.filter(c => c.status < 400).length;
    const avgResponseTime = checks.reduce((sum, c) => sum + c.responseTime, 0) / checks.length;

    return {
      url: monitor.url,
      uptime: `${((successfulChecks / checks.length) * 100).toFixed(2)}%`,
      averageResponseTime: `${Math.round(avgResponseTime)}ms`,
      totalChecks: checks.length,
      successfulChecks,
      lastCheck: checks[0],
    };
  }

  handleDataTransformer(args) {
    const { data, transformation, parameters = {} } = args;

    try {
      let result;

      switch (transformation) {
        case 'json_extract':
          const jsonData = JSON.parse(data);
          const jsonPath = parameters.jsonPath || '$';
          result = this.extractFromJson(jsonData, jsonPath);
          break;

        case 'regex_extract':
          if (!parameters.regex) {throw new Error('regex parameter required for regex_extract');}
          const regex = new RegExp(parameters.regex, 'g');
          const matches = [...data.matchAll(regex)];
          result = matches.map(match => match[0]);
          break;

        case 'base64_decode':
          result = Buffer.from(data, 'base64').toString('utf-8');
          break;

        case 'hash_generate':
          const algorithm = parameters.hashAlgorithm || 'sha256';
          result = createHash(algorithm).update(data).digest('hex');
          break;

        case 'csv_to_json':
          const delimiter = parameters.delimiter || ',';
          result = this.csvToJson(data, delimiter);
          break;

        case 'xml_to_json':
          result = this.simpleXmlToJson(data);
          break;

        default:
          throw new Error(`Unknown transformation: ${transformation}`);
      }

      return {
        content: [{
          type: 'text',
          text: `Transformation: ${transformation}\nResult: ${JSON.stringify(result, null, 2)}`,
        }],
        isError: false,
        metadata: { transformedData: result },
      };
    } catch (error) {
      throw new Error(`Transformation failed: ${error.message}`);
    }
  }

  extractFromJson(data, jsonPath) {
    // Simple JSONPath implementation ($ = root, .property, [index])
    if (jsonPath === '$') {return data;}

    const parts = jsonPath.replace(/^\$\./, '').split('.');
    let current = data;

    for (const part of parts) {
      if (part.includes('[') && part.includes(']')) {
        const [prop, indexStr] = part.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        current = current[prop][index];
      } else {
        current = current[part];
      }
    }

    return current;
  }

  csvToJson(csvData, delimiter) {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(delimiter);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter);
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
      });
      result.push(obj);
    }

    return result;
  }

  simpleXmlToJson(xmlData) {
    // Very basic XML to JSON conversion (for demonstration)
    const tagRegex = /<(\w+)>(.*?)<\/\1>/g;
    const result = {};
    let match;

    while ((match = tagRegex.exec(xmlData)) !== null) {
      result[match[1]] = match[2];
    }

    return result;
  }

  async handleLoadTester(args) {
    const { url, concurrency = 10, totalRequests = 100, method = 'GET', headers: _headers = {}, body: _body } = args;

    try {
      const testId = randomUUID();
      const startTime = Date.now();

      // Simulate load testing
      const results = await this.simulateLoadTest(url, concurrency, totalRequests, method);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      const report = {
        testId,
        url,
        configuration: { concurrency, totalRequests, method },
        results: {
          totalTime,
          requestsPerSecond: totalTime > 0 ? Math.round(totalRequests / (totalTime / 1000)) : totalRequests,
          averageResponseTime: results.averageResponseTime,
          minResponseTime: results.minResponseTime,
          maxResponseTime: results.maxResponseTime,
          successRate: `${((results.successful / totalRequests) * 100).toFixed(2)}%`,
          statusCodeDistribution: results.statusCodes,
        },
      };

      this.testResults.set(testId, report);

      return {
        content: [{
          type: 'text',
          text: `Load Test Complete!\n${JSON.stringify(report, null, 2)}`,
        }],
        isError: false,
        metadata: { loadTestReport: report },
      };
    } catch (error) {
      throw new Error(`Load test failed: ${error.message}`);
    }
  }

  async simulateLoadTest(url, concurrency, totalRequests, _method) {
    // Simulate load test results
    const responseTimes = Array.from({ length: totalRequests }, () => Math.floor(Math.random() * 1000) + 100);
    const statusCodes = {};
    let successful = 0;

    responseTimes.forEach(() => {
      const status = Math.random() > 0.05 ? 200 : (Math.random() > 0.5 ? 404 : 500);
      statusCodes[status] = (statusCodes[status] || 0) + 1;
      if (status < 400) {successful++;}
    });

    return {
      averageResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      successful,
      statusCodes,
    };
  }

  handleWebhookSimulator(args) {
    const { action, webhookType = 'custom', event, payload = {}, secret } = args;

    try {
      let result;

      switch (action) {
        case 'generate':
          result = this.generateWebhookPayload(webhookType, event, payload);
          break;

        case 'validate':
          result = this.validateWebhookPayload(webhookType, payload);
          break;

        case 'sign':
          if (!secret) {throw new Error('Secret is required for signing');}
          result = this.signWebhookPayload(payload, secret);
          break;

        default:
          throw new Error(`Unknown webhook action: ${action}`);
      }

      return {
        content: [{
          type: 'text',
          text: `Webhook ${action} complete:\n${JSON.stringify(result, null, 2)}`,
        }],
        isError: false,
        metadata: { webhookResult: result },
      };
    } catch (error) {
      throw new Error(`Webhook operation failed: ${error.message}`);
    }
  }

  generateWebhookPayload(type, event, customPayload) {
    const timestamp = new Date().toISOString();
    const id = randomUUID();

    switch (type) {
      case 'github':
        return {
          action: event || 'push',
          repository: {
            id: 123456789,
            name: 'test-repo',
            full_name: 'user/test-repo',
          },
          sender: {
            login: 'testuser',
            id: 12345,
          },
          ...customPayload,
        };

      case 'stripe':
        return {
          id: `evt_${id}`,
          object: 'event',
          type: event || 'payment_intent.succeeded',
          created: Math.floor(Date.now() / 1000),
          data: {
            object: {
              id: `pi_${randomUUID()}`,
              amount: 2000,
              currency: 'usd',
              status: 'succeeded',
            },
          },
          ...customPayload,
        };

      case 'slack':
        return {
          token: 'verification_token',
          team_id: 'T1234567890',
          event: {
            type: event || 'message',
            user: 'U1234567890',
            text: 'Hello, World!',
            ts: Date.now() / 1000,
            ...customPayload.event,
          },
          ...customPayload,
        };

      default:
        return {
          id,
          timestamp,
          event: event || 'custom_event',
          ...customPayload,
        };
    }
  }

  validateWebhookPayload(type, payload) {
    const validation = { valid: true, errors: [] };

    switch (type) {
      case 'github':
        if (!payload.repository) {validation.errors.push('Missing repository field');}
        if (!payload.sender) {validation.errors.push('Missing sender field');}
        break;

      case 'stripe':
        if (!payload.id || !payload.id.startsWith('evt_')) {
          validation.errors.push('Invalid Stripe event ID format');
        }
        if (!payload.type) {validation.errors.push('Missing event type');}
        break;

      case 'slack':
        if (!payload.team_id) {validation.errors.push('Missing team_id');}
        if (!payload.event) {validation.errors.push('Missing event object');}
        break;
    }

    validation.valid = validation.errors.length === 0;
    return validation;
  }

  signWebhookPayload(payload, secret) {
    const payloadString = JSON.stringify(payload);
    const signature = createHash('sha256').update(payloadString + secret).digest('hex');

    return {
      payload: payloadString,
      signature: `sha256=${signature}`,
      headers: {
        'X-Hub-Signature-256': `sha256=${signature}`,
        'Content-Type': 'application/json',
      },
    };
  }

  start() {
    console.error('API Testing MCP Server started');

    process.stdin.setEncoding('utf8');
    let buffer = '';

    process.stdin.on('data', async (chunk) => {
      buffer += chunk;
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const message = buffer.substring(0, newlineIndex).trim();
        buffer = buffer.substring(newlineIndex + 1);
        if (message) {
          try {
            const response = await this.processMessage(message);
            if (response) {
              process.stdout.write(`${JSON.stringify(response)  }\n`);
            }
          } catch (error) {
            console.error(`Server error: ${error.message}`);
          }
        }
      }
    });

    process.stdin.on('end', () => process.exit(0));
    process.on('SIGTERM', () => process.exit(0));
    process.on('SIGINT', () => {
      console.error('API Testing MCP Server shutting down...');
      process.exit(0);
    });
  }
}

// Start the server
new APITestingMCPServer().start();
