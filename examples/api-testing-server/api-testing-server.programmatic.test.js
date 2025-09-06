import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from '../../src/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('API Testing Server Programmatic Integration', () => {
  let client;

  before(async () => {
    // Connect using inline config
    const config = {
      name: "API Testing & Monitoring MCP Server",
      command: "/Users/thomastheunen/.nvm/versions/node/v20.18.1/bin/node",
      args: ["./server.js"],
      cwd: join(__dirname, './'),
      env: {},
      startupTimeout: 5000,
      readyPattern: "API Testing MCP Server started"
    };
    client = await connect(config);
  });

  after(async () => {
    if (client) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    client.clearStderr();
  });

  describe('Tool Discovery', () => {
    test('should list all available API testing tools', async () => {
      const tools = await client.listTools();
      
      assert.equal(tools.length, 6, 'Should have exactly 6 tools');
      
      const toolNames = tools.map(tool => tool.name);
      const expectedTools = [
        'http_request', 
        'response_analyzer', 
        'endpoint_monitor', 
        'data_transformer', 
        'load_tester', 
        'webhook_simulator'
      ];
      
      expectedTools.forEach(expectedTool => {
        assert.ok(toolNames.includes(expectedTool), `Should include ${expectedTool} tool`);
      });
    });

    test('should have proper tool schemas', async () => {
      const tools = await client.listTools();
      
      tools.forEach(tool => {
        assert.ok(tool.name, 'Tool should have a name');
        assert.ok(tool.description, 'Tool should have a description');
        assert.ok(tool.inputSchema, 'Tool should have input schema');
        assert.equal(tool.inputSchema.type, 'object', 'Input schema should be an object');
        assert.ok(tool.inputSchema.properties, 'Input schema should have properties');
      });
    });
  });

  describe('HTTP Request Tool', () => {
    test('should make successful GET request', async () => {
      const result = await client.callTool('http_request', {
        url: 'https://api.example.com/api/users',
        method: 'GET'
      });

      assert.equal(result.isError, false, 'Request should not be an error');
      assert.ok(result.content, 'Should have content');
      assert.equal(result.content[0].type, 'text', 'Content should be text type');
      assert.match(result.content[0].text, /HTTP GET/, 'Should mention HTTP GET');
      assert.match(result.content[0].text, /Status: 200/, 'Should show status 200');
      
      // Validate metadata
      assert.ok(result.metadata, 'Should have metadata');
      assert.ok(result.metadata.responseData, 'Should have response data');
      assert.equal(result.metadata.responseData.status, 200, 'Status should be 200');
      assert.ok(result.metadata.responseData.headers, 'Should have headers');
      assert.ok(result.metadata.responseData.timing, 'Should have timing data');
    });

    test('should handle POST request with custom headers and body', async () => {
      const result = await client.callTool('http_request', {
        url: 'https://api.example.com/api/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: '{"name": "Test User", "email": "test@example.com"}'
      });

      assert.equal(result.isError, false);
      assert.match(result.content[0].text, /HTTP POST/, 'Should mention HTTP POST');
      
      const responseData = result.metadata.responseData;
      assert.equal(responseData.request.method, 'POST', 'Request method should be POST');
      assert.ok(responseData.request.headers, 'Should include request headers');
      assert.ok(responseData.request.body, 'Should include request body');
    });

    test('should simulate error responses correctly', async () => {
      const result = await client.callTool('http_request', {
        url: 'https://api.example.com/error',
        method: 'GET'
      });

      assert.equal(result.isError, false, 'Tool should not error, but simulate error response');
      assert.equal(result.metadata.responseData.status, 500, 'Should simulate 500 status');
      assert.match(result.content[0].text, /Status: 500/, 'Should show status 500');
    });

    test('should simulate health check endpoint', async () => {
      const result = await client.callTool('http_request', {
        url: 'https://api.example.com/api/health',
        method: 'GET'
      });

      const responseData = result.metadata.responseData;
      const body = JSON.parse(responseData.body);
      
      assert.equal(body.status, 'healthy', 'Health check should return healthy');
      assert.ok(body.timestamp, 'Should include timestamp');
      assert.match(body.timestamp, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, 'Should have valid timestamp format');
    });
  });

  describe('Response Analyzer Tool', () => {
    test('should analyze successful response correctly', async () => {
      // First make a request to get response data
      const httpResult = await client.callTool('http_request', {
        url: 'https://api.example.com/api/users',
        method: 'GET'
      });

      const responseData = httpResult.metadata.responseData;
      
      // Now analyze the response
      const result = await client.callTool('response_analyzer', {
        responseData,
        analysis: ['status_check', 'content_type', 'response_time'],
        expectations: {
          status: 200,
          contentType: 'application/json',
          maxResponseTime: 1000
        }
      });

      assert.equal(result.isError, false);
      assert.ok(result.metadata.summary, 'Should have analysis summary');
      assert.equal(result.metadata.summary.status, 'PASS', 'Analysis should pass');
      assert.equal(result.metadata.summary.failed, 0, 'Should have no failures');
      assert.equal(result.metadata.summary.total, 3, 'Should have 3 tests');
    });

    test('should detect analysis failures', async () => {
      const responseData = {
        status: 500,
        headers: { 'content-type': 'text/html' },
        body: 'Internal Server Error',
        timing: { requestTime: 5500 }
      };

      const result = await client.callTool('response_analyzer', {
        responseData,
        analysis: ['status_check', 'response_time'],
        expectations: {
          status: 200,
          maxResponseTime: 2000
        }
      });

      assert.equal(result.isError, false);
      assert.equal(result.metadata.summary.status, 'FAIL', 'Analysis should fail');
      assert.equal(result.metadata.summary.failed, 2, 'Should have 2 failures');
    });

    test('should validate JSON structure', async () => {
      const responseData = {
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: '{"users": [{"id": 1, "name": "John"}], "total": 1}',
        timing: { requestTime: 200 }
      };

      const result = await client.callTool('response_analyzer', {
        responseData,
        analysis: ['json_structure'],
        expectations: {
          jsonSchema: {
            type: 'object',
            properties: {
              users: { type: 'array' },
              total: { type: 'number' }
            },
            required: ['users', 'total']
          }
        }
      });

      assert.equal(result.isError, false);
      const jsonTest = result.metadata.analysisResults.find(r => r.test === 'json_structure');
      assert.ok(jsonTest, 'Should have JSON structure test');
      assert.equal(jsonTest.passed, true, 'JSON structure validation should pass');
    });

    test('should analyze security headers', async () => {
      const responseData = {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'strict-transport-security': 'max-age=31536000',
          'x-content-type-options': 'nosniff',
          'x-frame-options': 'DENY'
        },
        body: '{"data": "test"}',
        timing: { requestTime: 100 }
      };

      const result = await client.callTool('response_analyzer', {
        responseData,
        analysis: ['security_headers']
      });

      const securityTest = result.metadata.analysisResults.find(r => r.test === 'security_headers');
      assert.ok(securityTest, 'Should have security headers test');
      assert.ok(securityTest.present.length > 0, 'Should find some security headers');
      assert.ok(securityTest.present.includes('strict-transport-security'), 'Should find HSTS header');
    });
  });

  describe('Endpoint Monitor Tool', () => {
    test('should start monitoring an endpoint', async () => {
      const result = await client.callTool('endpoint_monitor', {
        action: 'start',
        url: 'https://api.example.com/health',
        interval: 30000,
        monitorId: 'test-monitor-1'
      });

      assert.equal(result.isError, false);
      assert.match(result.content[0].text, /Started monitoring/, 'Should confirm monitoring started');
      assert.equal(result.metadata.monitorId, 'test-monitor-1', 'Should return monitor ID');
    });

    test('should check monitoring status', async () => {
      const result = await client.callTool('endpoint_monitor', {
        action: 'status'
      });

      assert.equal(result.isError, false);
      assert.match(result.content[0].text, /Active Monitors/, 'Should show active monitors');
      assert.ok(Array.isArray(result.metadata.activeMonitors), 'Should return monitors array');
    });

    test('should generate monitoring report', async () => {
      const result = await client.callTool('endpoint_monitor', {
        action: 'report',
        monitorId: 'test-monitor-1'
      });

      assert.equal(result.isError, false);
      assert.ok(result.metadata.report, 'Should have report data');
      assert.ok(result.metadata.report.uptime, 'Should have uptime data');
      assert.match(result.metadata.report.uptime, /\d+\.\d+%/, 'Uptime should be percentage');
      assert.match(result.metadata.report.averageResponseTime, /\d+ms/, 'Should have response time');
    });

    test('should stop monitoring', async () => {
      const result = await client.callTool('endpoint_monitor', {
        action: 'stop',
        monitorId: 'test-monitor-1'
      });

      assert.equal(result.isError, false);
      assert.match(result.content[0].text, /Stopped monitoring/, 'Should confirm monitoring stopped');
    });

    test('should handle invalid monitor ID', async () => {
      const result = await client.callTool('endpoint_monitor', {
        action: 'report',
        monitorId: 'invalid-monitor-id'
      });

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /Invalid monitor ID/, 'Should report invalid ID');
    });
  });

  describe('Data Transformer Tool', () => {
    test('should extract JSON data with JSONPath', async () => {
      const result = await client.callTool('data_transformer', {
        data: '{"users": [{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}], "total": 2}',
        transformation: 'json_extract',
        parameters: {
          jsonPath: '$.users[0].name'
        }
      });

      assert.equal(result.isError, false);
      assert.equal(result.metadata.transformedData, 'John', 'Should extract John\'s name');
    });

    test('should extract root JSON data', async () => {
      const result = await client.callTool('data_transformer', {
        data: '{"status": "success", "code": 200}',
        transformation: 'json_extract',
        parameters: {
          jsonPath: '$'
        }
      });

      assert.equal(result.isError, false);
      assert.equal(result.metadata.transformedData.status, 'success');
      assert.equal(result.metadata.transformedData.code, 200);
    });

    test('should extract data using regex', async () => {
      const result = await client.callTool('data_transformer', {
        data: 'Email: john@example.com, Phone: 555-1234, Email: jane@test.org',
        transformation: 'regex_extract',
        parameters: {
          regex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
        }
      });

      assert.equal(result.isError, false);
      assert.ok(Array.isArray(result.metadata.transformedData), 'Should return array of matches');
      assert.equal(result.metadata.transformedData.length, 2, 'Should find 2 email addresses');
      assert.ok(result.metadata.transformedData.includes('john@example.com'));
      assert.ok(result.metadata.transformedData.includes('jane@test.org'));
    });

    test('should decode base64 data', async () => {
      const result = await client.callTool('data_transformer', {
        data: 'SGVsbG8gV29ybGQh', // "Hello World!" in base64
        transformation: 'base64_decode'
      });

      assert.equal(result.isError, false);
      assert.equal(result.metadata.transformedData, 'Hello World!');
    });

    test('should generate hash with different algorithms', async () => {
      const testData = 'password123';
      
      // Test SHA256 (default)
      const sha256Result = await client.callTool('data_transformer', {
        data: testData,
        transformation: 'hash_generate',
        parameters: {
          hashAlgorithm: 'sha256'
        }
      });

      assert.equal(sha256Result.isError, false);
      assert.match(sha256Result.metadata.transformedData, /^[a-f0-9]{64}$/, 'Should be 64-char hex string for SHA256');

      // Test MD5
      const md5Result = await client.callTool('data_transformer', {
        data: testData,
        transformation: 'hash_generate',
        parameters: {
          hashAlgorithm: 'md5'
        }
      });

      assert.equal(md5Result.isError, false);
      assert.match(md5Result.metadata.transformedData, /^[a-f0-9]{32}$/, 'Should be 32-char hex string for MD5');
    });

    test('should convert CSV to JSON', async () => {
      const result = await client.callTool('data_transformer', {
        data: 'name,age,city\nJohn,30,NYC\nJane,25,LA\nBob,35,Chicago',
        transformation: 'csv_to_json'
      });

      assert.equal(result.isError, false);
      const jsonData = result.metadata.transformedData;
      assert.ok(Array.isArray(jsonData), 'Should return array');
      assert.equal(jsonData.length, 3, 'Should have 3 records');
      assert.equal(jsonData[0].name, 'John');
      assert.equal(jsonData[0].age, '30');
      assert.equal(jsonData[0].city, 'NYC');
    });

    test('should handle XML to JSON conversion', async () => {
      const result = await client.callTool('data_transformer', {
        data: '<name>John</name><age>30</age><city>NYC</city>',
        transformation: 'xml_to_json'
      });

      assert.equal(result.isError, false);
      const jsonData = result.metadata.transformedData;
      assert.equal(jsonData.name, 'John');
      assert.equal(jsonData.age, '30');
      assert.equal(jsonData.city, 'NYC');
    });
  });

  describe('Load Tester Tool', () => {
    test('should perform basic load test', async () => {
      const result = await client.callTool('load_tester', {
        url: 'https://api.example.com/health',
        concurrency: 5,
        totalRequests: 50,
        method: 'GET'
      });

      assert.equal(result.isError, false);
      assert.ok(result.metadata.loadTestReport, 'Should have load test report');
      
      const report = result.metadata.loadTestReport;
      assert.equal(report.url, 'https://api.example.com/health');
      assert.equal(report.configuration.concurrency, 5);
      assert.equal(report.configuration.totalRequests, 50);
      assert.equal(report.configuration.method, 'GET');
      
      assert.ok(report.results.requestsPerSecond > 0, 'Should have positive RPS');
      assert.ok(report.results.averageResponseTime > 0, 'Should have positive response time');
      assert.match(report.results.successRate, /\d+\.\d+%/, 'Should have success rate percentage');
      assert.ok(report.results.statusCodeDistribution, 'Should have status code distribution');
    });

    test('should handle POST load test with body', async () => {
      const result = await client.callTool('load_tester', {
        url: 'https://api.example.com/api/users',
        concurrency: 3,
        totalRequests: 30,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{"test": "data"}'
      });

      assert.equal(result.isError, false);
      const report = result.metadata.loadTestReport;
      assert.equal(report.configuration.method, 'POST');
    });

    test('should use default values when not specified', async () => {
      const result = await client.callTool('load_tester', {
        url: 'https://api.example.com/test'
      });

      assert.equal(result.isError, false);
      const config = result.metadata.loadTestReport.configuration;
      assert.equal(config.concurrency, 10, 'Should use default concurrency of 10');
      assert.equal(config.totalRequests, 100, 'Should use default totalRequests of 100');
      assert.equal(config.method, 'GET', 'Should use default method GET');
    });
  });

  describe('Webhook Simulator Tool', () => {
    test('should generate GitHub webhook payload', async () => {
      const result = await client.callTool('webhook_simulator', {
        action: 'generate',
        webhookType: 'github',
        event: 'push',
        payload: {
          ref: 'refs/heads/main',
          commits: []
        }
      });

      assert.equal(result.isError, false);
      const webhook = result.metadata.webhookResult;
      assert.equal(webhook.action, 'push');
      assert.ok(webhook.repository, 'Should have repository object');
      assert.ok(webhook.sender, 'Should have sender object');
      assert.equal(webhook.ref, 'refs/heads/main');
    });

    test('should generate Stripe webhook payload', async () => {
      const result = await client.callTool('webhook_simulator', {
        action: 'generate',
        webhookType: 'stripe',
        event: 'payment_intent.succeeded'
      });

      assert.equal(result.isError, false);
      const webhook = result.metadata.webhookResult;
      assert.ok(webhook.id.startsWith('evt_'), 'Should have Stripe event ID format');
      assert.equal(webhook.object, 'event');
      assert.equal(webhook.type, 'payment_intent.succeeded');
      assert.ok(webhook.data, 'Should have data object');
      assert.ok(webhook.created, 'Should have created timestamp');
    });

    test('should generate Slack webhook payload', async () => {
      const result = await client.callTool('webhook_simulator', {
        action: 'generate',
        webhookType: 'slack',
        event: 'message'
      });

      assert.equal(result.isError, false);
      const webhook = result.metadata.webhookResult;
      assert.ok(webhook.token, 'Should have token');
      assert.ok(webhook.team_id, 'Should have team_id');
      assert.ok(webhook.event, 'Should have event object');
      assert.equal(webhook.event.type, 'message');
    });

    test('should validate webhook payloads', async () => {
      const validGithubPayload = {
        repository: { name: 'test-repo' },
        sender: { login: 'testuser' }
      };

      const result = await client.callTool('webhook_simulator', {
        action: 'validate',
        webhookType: 'github',
        payload: validGithubPayload
      });

      assert.equal(result.isError, false);
      const validation = result.metadata.webhookResult;
      assert.equal(validation.valid, true, 'Should validate as true');
      assert.equal(validation.errors.length, 0, 'Should have no errors');
    });

    test('should detect invalid webhook payloads', async () => {
      const invalidGithubPayload = {
        action: 'push'
        // Missing repository and sender
      };

      const result = await client.callTool('webhook_simulator', {
        action: 'validate',
        webhookType: 'github',
        payload: invalidGithubPayload
      });

      assert.equal(result.isError, false);
      const validation = result.metadata.webhookResult;
      assert.equal(validation.valid, false, 'Should validate as false');
      assert.ok(validation.errors.length > 0, 'Should have validation errors');
      assert.ok(validation.errors.some(err => err.includes('repository')), 'Should report missing repository');
      assert.ok(validation.errors.some(err => err.includes('sender')), 'Should report missing sender');
    });

    test('should sign webhook payloads', async () => {
      const payload = { event: 'test', data: 'sample' };
      const secret = 'webhook-secret-key';

      const result = await client.callTool('webhook_simulator', {
        action: 'sign',
        payload,
        secret
      });

      assert.equal(result.isError, false);
      const signed = result.metadata.webhookResult;
      assert.ok(signed.payload, 'Should have payload string');
      assert.ok(signed.signature, 'Should have signature');
      assert.ok(signed.signature.startsWith('sha256='), 'Signature should start with sha256=');
      assert.ok(signed.headers, 'Should have headers');
      assert.ok(signed.headers['X-Hub-Signature-256'], 'Should have GitHub-style signature header');
    });
  });

  describe('Error Handling', () => {
    test('should handle unknown tool gracefully', async () => {
      const result = await client.callTool('nonexistent_tool', {});

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /Unknown tool.*nonexistent_tool/, 'Should report unknown tool');
    });

    test('should handle missing required parameters', async () => {
      const result = await client.callTool('http_request', {});

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /URL parameter is required/, 'Should report missing URL parameter');
    });

    test('should handle invalid transformation type', async () => {
      const result = await client.callTool('data_transformer', {
        data: 'test data',
        transformation: 'invalid_transformation'
      });

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /Unknown transformation.*invalid_transformation/, 'Should report unknown transformation');
    });

    test('should handle invalid JSON in transformer', async () => {
      const result = await client.callTool('data_transformer', {
        data: 'invalid json {{{',
        transformation: 'json_extract'
      });

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /Transformation failed/, 'Should report transformation failure');
    });

    test('should handle missing regex parameter', async () => {
      const result = await client.callTool('data_transformer', {
        data: 'test data',
        transformation: 'regex_extract',
        parameters: {} // Missing regex parameter
      });

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /regex parameter required/, 'Should report missing regex parameter');
    });

    test('should handle missing secret for webhook signing', async () => {
      const result = await client.callTool('webhook_simulator', {
        action: 'sign',
        payload: { test: 'data' }
        // Missing secret parameter
      });

      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /Secret is required for signing/, 'Should report missing secret');
    });
  });

  describe('Integration Scenarios', () => {
    test('should perform end-to-end API testing workflow', async () => {
      // Step 1: Make HTTP request
      const httpResult = await client.callTool('http_request', {
        url: 'https://api.example.com/api/users',
        method: 'GET'
      });

      assert.equal(httpResult.isError, false);
      const responseData = httpResult.metadata.responseData;

      // Step 2: Analyze the response
      const analysisResult = await client.callTool('response_analyzer', {
        responseData,
        analysis: ['status_check', 'json_structure', 'response_time'],
        expectations: {
          status: 200,
          maxResponseTime: 1000,
          jsonSchema: {
            type: 'object',
            properties: {
              users: { type: 'array' },
              total: { type: 'number' }
            }
          }
        }
      });

      assert.equal(analysisResult.isError, false);
      assert.equal(analysisResult.metadata.summary.status, 'PASS');

      // Step 3: Extract data from response
      const extractResult = await client.callTool('data_transformer', {
        data: responseData.body,
        transformation: 'json_extract',
        parameters: {
          jsonPath: '$.users[0].name'
        }
      });

      assert.equal(extractResult.isError, false);
      assert.equal(extractResult.metadata.transformedData, 'John Doe');

      // Step 4: Start monitoring the endpoint
      const monitorResult = await client.callTool('endpoint_monitor', {
        action: 'start',
        url: 'https://api.example.com/api/users',
        interval: 60000,
        monitorId: 'integration-test-monitor'
      });

      assert.equal(monitorResult.isError, false);
      assert.equal(monitorResult.metadata.monitorId, 'integration-test-monitor');
    });

    test('should validate webhook and then simulate response', async () => {
      // Step 1: Generate webhook payload
      const generateResult = await client.callTool('webhook_simulator', {
        action: 'generate',
        webhookType: 'github',
        event: 'pull_request',
        payload: {
          action: 'opened',
          number: 123
        }
      });

      assert.equal(generateResult.isError, false);
      const webhook = generateResult.metadata.webhookResult;

      // Step 2: Validate the generated payload
      const validateResult = await client.callTool('webhook_simulator', {
        action: 'validate',
        webhookType: 'github',
        payload: webhook
      });

      assert.equal(validateResult.isError, false);
      assert.equal(validateResult.metadata.webhookResult.valid, true);

      // Step 3: Sign the webhook
      const signResult = await client.callTool('webhook_simulator', {
        action: 'sign',
        payload: webhook,
        secret: 'integration-test-secret'
      });

      assert.equal(signResult.isError, false);
      assert.ok(signResult.metadata.webhookResult.signature);
    });
  });
});
