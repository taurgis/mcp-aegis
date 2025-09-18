import React from 'react';
import { Link } from 'react-router-dom';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import { Head } from 'vite-react-ssg';

const ProgrammaticTestingPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>Programmatic Testing API - MCP Conductor</title>
                <meta name="description" content="Comprehensive JavaScript/TypeScript API for programmatic Model Context Protocol testing. Integrate MCP testing with Jest, Mocha, Node.js test runner, and existing test suites." />
                <meta name="keywords" content="programmatic MCP testing, JavaScript MCP API, TypeScript MCP testing, MCP Node.js API, Jest MCP integration, Mocha MCP testing, programmatic API testing" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph tags */}
                <meta property="og:title" content="MCP Conductor Programmatic API - JavaScript/TypeScript MCP Testing" />
                <meta property="og:description" content="Master programmatic Model Context Protocol testing with JavaScript/TypeScript API. Perfect for Jest, Mocha, and Node.js test runner integration." />
                <meta property="og:url" content="https://conductor.rhino-inquisitor.com/programmatic-testing" />
                <meta property="og:type" content="website" />
                
                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Conductor Programmatic API - JavaScript/TypeScript MCP Testing" />
                <meta name="twitter:description" content="Master programmatic Model Context Protocol testing with JavaScript/TypeScript API. Perfect for Jest, Mocha, and Node.js test runner integration." />
                
                {/* Canonical URL */}
                <link rel="canonical" href="https://conductor.rhino-inquisitor.com/programmatic-testing" />
                
                {/* Character encoding */}
                <meta charSet="utf-8" />
            </Head>
            <H1 id="programmatic-testing-api">Programmatic Testing API</H1>
            <PageSubtitle>JavaScript/TypeScript MCP Server Testing</PageSubtitle>
            <p>MCP Conductor provides a comprehensive JavaScript/TypeScript API for programmatic Model Context Protocol testing, enabling seamless integration with existing test suites and complex validation scenarios.</p>

            <H2 id="getting-started">Getting Started</H2>
            <p>Initialize MCP Conductor in your project first:</p>
            <CodeBlock language="bash" code="npx mcp-conductor init" />
            <p>Your programmatic tests can then reference the generated <InlineCode>conductor.config.json</InlineCode>:</p>
            <CodeBlock language="javascript" code={`
import { createClient } from 'mcp-conductor';

const client = await createClient('./conductor.config.json');
await client.connect();

// List available tools
const tools = await client.listTools();
console.log('Available tools:', tools.map(t => t.name));

// Execute a tool
const result = await client.callTool('my_tool', { param: 'value' });
console.log('Result:', result.content[0].text);

// Clean up
await client.disconnect();
            `} />

            <div className="my-6 p-4 border border-slate-200 rounded-md bg-slate-50">
              <h4 className="font-semibold mb-2">Alternative: Auto-Connect Helper</h4>
              <p className="text-sm text-slate-700 mb-2">Instead of creating then connecting, use the <code>connect()</code> helper which returns a ready client:</p>
              <CodeBlock language="javascript" code={`import { connect } from 'mcp-conductor';\n\nconst client = await connect('./conductor.config.json'); // Already connected + handshake done\nconst tools = await client.listTools();\n// ... use tools\nawait client.disconnect();`} />
            </div>

            <H2 id="api-reference-overview">API Reference Overview</H2>
            <p>See the full <Link to="/api-reference">API Reference</Link> for all methods and properties.</p>
            <H3 id="main-entry-points">Main Entry Points</H3>
      <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>createClient(config)</InlineCode>: Creates a new <InlineCode>MCPClient</InlineCode> instance without connecting.</li>
                <li><InlineCode>connect(config)</InlineCode>: Creates and automatically connects a client.</li>
            </ul>

            <H3 id="mcpclient-class">MCPClient Class Core Methods</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>async connect()</InlineCode>: Start MCP server and perform handshake.</li>
                <li><InlineCode>async disconnect()</InlineCode>: Gracefully shutdown server connection.</li>
                <li><InlineCode>async listTools()</InlineCode>: Retrieve available tools from server.</li>
                <li><InlineCode>async callTool(name, arguments)</InlineCode>: Execute a specific tool with arguments.</li>
                <li><InlineCode>async sendMessage(jsonRpcMessage)</InlineCode>: Send raw JSON-RPC message to server.</li>
            </ul>

            <H3 id="utility-methods">Utility Methods</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>getStderr()</InlineCode>: Retrieve current stderr buffer content.</li>
                <li><InlineCode>clearStderr()</InlineCode>: Clear stderr buffer.</li>
                <li><InlineCode>clearAllBuffers()</InlineCode>: Clear all buffers (stderr, stdout) and reset state.</li>
                <li><InlineCode>isConnected()</InlineCode>: Check if client is connected and handshake is completed.</li>
            </ul>

            <H3 id="properties">Properties</H3>
            <ul className="list-disc pl-6 space-y-1">
                <li><InlineCode>connected</InlineCode>: <InlineCode>boolean</InlineCode> - Connection status</li>
                <li><InlineCode>config</InlineCode>: <InlineCode>object</InlineCode> - Configuration used for connection</li>
                <li><InlineCode>handshakeCompleted</InlineCode>: <InlineCode>boolean</InlineCode> - MCP handshake status</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Critical: Preventing Test Interference</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p><strong>The #1 cause of flaky programmatic tests is output/buffer state leaking between tests.</strong></p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>stderr buffer</strong>: lingering error/debug lines</li>
                      <li><strong>stdout partial frames</strong>: incomplete JSON fragments still queued</li>
                      <li><strong>ready/state flags</strong>: previous handshake state influencing new tests</li>
                      <li><strong>pending message handlers</strong>: unresolved reads consuming the next test's response</li>
                    </ul>
                    <p className="mt-2"><strong>Always include this pattern:</strong></p>
                    <CodeBlock language="javascript" code={`beforeEach(() => {
  client.clearAllBuffers();
});`} />
                    <p className="mt-2">Without this you'll see: isolated passes, suite failures, mismatched JSON-RPC ids, unexpected stderr.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-6 p-4 border border-indigo-200 rounded-md bg-indigo-50">
              <h4 className="font-semibold mb-2 text-indigo-800">Transport vs Logical Errors</h4>
              <p className="text-sm text-indigo-800">Two distinct failure surfaces:</p>
              <ul className="list-disc pl-5 mt-2 text-sm text-indigo-800 space-y-1">
                <li><strong>Transport / JSON-RPC error</strong>: Server responds with top-level <code>error</code>. <code>callTool()</code> throws.</li>
                <li><strong>Logical tool error</strong>: Server returns normal <code>result</code> with <code>isError: true</code>.</li>
              </ul>
              <CodeBlock language="javascript" code={`// Transport error
await assert.rejects(() => client.callTool('nonexistent_tool', {}), /Failed to call tool/);

// Logical error
const r = await client.callTool('validate_input', { value: '' });
if (r.isError) console.log(r.content[0].text);`} />
            </div>

            <div className="my-6 p-4 border border-slate-200 rounded-md bg-slate-50">
              <h4 className="font-semibold mb-2">Auto Config Resolution</h4>
              <p className="text-sm text-slate-700 mb-2">Omit the path when your config is the default <code>conductor.config.json</code>:</p>
              <CodeBlock language="javascript" code={`import { connect } from 'mcp-conductor';

const client = await connect();
console.log(client.isConnected());
await client.disconnect();`} />
            </div>

            <H2 id="testing-frameworks">Testing Frameworks Integration</H2>
            <p>MCP Conductor integrates seamlessly with Node.js built-in test runner, Jest, Mocha, and more.</p>
            <CodeBlock language="javascript" code={`
import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { createClient } from 'mcp-conductor';

describe('MCP Server Tests', () => {
  let client;

  before(async () => {
    client = await createClient('./conductor.config.json');
    await client.connect();
  });

  after(async () => {
    if (client && client.connected) {
                                  </div>
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Prevents buffer leaking between tests
    client.clearAllBuffers();
  });

  test('should list available tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools), 'Tools should be an array');
    assert.ok(tools.length > 0, 'Should have at least one tool');
  });

  test('should execute a tool correctly', async () => {
    const result = await client.callTool('hello', { name: 'Node.js' });
    assert.ok(result.content[0].text.includes('Hello, Node.js'));
    assert.strictEqual(result.isError, undefined, 'Should not be an error');
  });
});
            `} />
            <p>Run tests with: <InlineCode>node --test tests/mcp.test.js</InlineCode></p>

            <H3 id="jest-integration">Jest Integration</H3>
            <CodeBlock language="javascript" code={`
import { createClient } from 'mcp-conductor';

describe('MCP Server Integration', () => {
  let client;

  beforeAll(async () => {
    client = await createClient('./conductor.config.json');
    await client.connect();
  }, 10000); // 10 second timeout for server startup

  afterAll(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Prevents buffer leaking between tests
    client.clearAllBuffers();
  });

  test('should validate tool schemas', async () => {
    const tools = await client.listTools();
    
    tools.forEach(tool => {
      expect(tool.name).toMatch(/^[a-z][a-z0-9_]*$/); // snake_case
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema).toHaveProperty('type', 'object');
    });
  });

  test('should handle tool execution errors', async () => {
    await expect(
      client.callTool('nonexistent_tool', {})
    ).rejects.toThrow(/Failed to call tool/);
  });
});
            `} />

            <H3 id="mocha-integration">Mocha Integration</H3>
            <CodeBlock language="javascript" code={`
import { expect } from 'chai';
import { createClient } from 'mcp-conductor';

describe('MCP Server Tests', function() {
  let client;

  before(async function() {
    this.timeout(10000);
    client = await createClient('./conductor.config.json');
    await client.connect();
  });

  after(async function() {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(function() {
    // CRITICAL: Prevents buffer leaking between tests
    client.clearAllBuffers();
  });

  it('should perform tool operations', async function() {
    const result = await client.callTool('calculator', {
      operation: 'add',
      a: 15,
      b: 27
    });

    expect(result.content).to.be.an('array');
    expect(result.content[0].text).to.include('42');
    expect(result.isError).to.be.undefined;
  });
});
            `} />

            <H2 id="detailed-api-methods">Detailed API Methods</H2>
            <H3 id="connection-management">Connection Management</H3>
            <CodeBlock language="javascript" code={`
// Create client without connecting
const client = await createClient('./config.json');
console.log('Connected:', client.connected); // false

// Connect and perform handshake
await client.connect();
console.log('Connected:', client.connected); // true
console.log('Handshake:', client.handshakeCompleted); // true

// Check connection status
const isReady = client.isConnected();
console.log('Client ready:', isReady);

// Graceful disconnect
await client.disconnect();
            `} />

            <H3 id="tool-operations">Tool Operations</H3>
            <CodeBlock language="javascript" code={`
// List all available tools
const tools = await client.listTools();
tools.forEach(tool => {
  console.log(\`Tool: \${tool.name}\`);
  console.log(\`Description: \${tool.description}\`);
  console.log(\`Schema:\`, tool.inputSchema);
});

// Execute a tool
const result = await client.callTool('calculator', {
  operation: 'add',
  a: 15,
  b: 27
});

console.log('Content:', result.content);
console.log('Error:', result.isError);
            `} />

            <H3 id="stderr-management">Stderr Management</H3>
            <CodeBlock language="javascript" code={`
// Clear buffers before operation (recommended)
client.clearAllBuffers();

// Perform operation
await client.callTool('my_tool', {});

// Check for stderr output
const stderr = client.getStderr();
if (stderr.trim()) {
  console.warn('Stderr output:', stderr);
}
            `} />

            <H3 id="raw-messaging">Raw JSON-RPC Messaging</H3>
            <CodeBlock language="javascript" code={`
// Send custom JSON-RPC message
const response = await client.sendMessage({
  jsonrpc: "2.0",
  id: "custom-1",
  method: "tools/list",
  params: {}
});

console.log('Raw response:', response);
            `} />

            <H2 id="advanced-patterns">Advanced Patterns</H2>
            <H3 id="dynamic-test-generation">Dynamic Test Generation</H3>
            <CodeBlock language="javascript" code={`
describe('Generated Tool Tests', () => {
  let client;
  let tools;

  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
    tools = await client.listTools();
  });

  after(async () => {
    await client?.disconnect();
  });

  beforeEach(() => {
    // CRITICAL: Prevents buffer leaking between tests
    client.clearAllBuffers();
  });

  // Dynamically generate tests for each tool
  tools?.forEach(tool => {
    test(\`should execute \${tool.name} successfully\`, async () => {
      // Generate basic test arguments based on schema
      const args = generateTestArgs(tool.inputSchema);
      
      const result = await client.callTool(tool.name, args);
      
      assert.ok(result.content, \`\${tool.name} should return content\`);
      assert.ok(!result.isError, \`\${tool.name} should not error with valid args\`);
    });
  });
});

function generateTestArgs(schema) {
  const args = {};
  
  if (schema?.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.type === 'string') {
        args[key] = 'test_value';
      } else if (prop.type === 'number') {
        args[key] = 42;
      } else if (prop.type === 'boolean') {
        args[key] = true;
      }
    }
  }
  
  return args;
}
            `} />

            <H3 id="performance-testing">Performance Testing</H3>
            <CodeBlock language="javascript" code={`
describe('Performance Tests', () => {
  let client;

  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });

  after(async () => {
    await client?.disconnect();
  });

  beforeEach(() => {
    // CRITICAL: Prevents buffer leaking between tests
    client.clearAllBuffers();
  });

  test('should handle concurrent tool calls', async () => {
    const startTime = Date.now();
    
    // Execute 10 concurrent tool calls
    const promises = Array.from({ length: 10 }, (_, i) => 
      client.callTool('calculator', { operation: 'add', a: i, b: 1 })
    );
    
    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    assert.equal(results.length, 10);
    assert.ok(duration < 5000, \`Should complete within 5 seconds, took \${duration}ms\`);
    
    results.forEach((result, i) => {
      assert.ok(result.content[0].text.includes(\`\${i + 1}\`));
    });
  });
});
            `} />
            <p className="text-xs text-slate-600 mt-2">Note: The <code>startupTimeout</code> in config only governs initial server readiness. Performance assertions like <code>duration &lt; 5000</code> are application-level expectations—you may tune them per environment (CI vs local).</p>

            <H3 id="error-handling-patterns">Error Handling Patterns</H3>
            <CodeBlock language="javascript" code={`
describe('Error Handling', () => {
  let client;

  before(async () => {
    client = await createClient('./config.json');
    await client.connect();
  });

  after(async () => {
    await client?.disconnect();
  });

  beforeEach(() => {
    // CRITICAL: Prevents buffer leaking between tests
    client.clearAllBuffers();
  });

  test('should handle connection errors gracefully', async () => {
    // Disconnect client
    await client.disconnect();
    
    // Attempt to use disconnected client
    await assert.rejects(
      async () => await client.listTools(),
      /Client not connected/
    );
  });

  test('should handle tool execution errors', async () => {
    const result = await client.callTool('invalid_tool', {});
    
    assert.strictEqual(result.isError, true);
    assert.ok(result.content[0].text.includes('Unknown tool'));
  });

  test('should handle malformed arguments', async () => {
    try {
      await client.callTool('calculator', {
        operation: 'invalid_op',
        a: 'not_a_number',
        b: null
      });
    } catch (error) {
      assert.ok(error.message.includes('Invalid arguments'));
    }
  });
});
            `} />

            <H2 id="best-practices">Best Practices</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-red-600">CRITICAL: Always clear buffers in beforeEach</strong>: Use <InlineCode>client.clearAllBuffers()</InlineCode> (recommended) or <InlineCode>client.clearStderr()</InlineCode> (minimum) in <InlineCode>beforeEach()</InlineCode> hooks to prevent buffer leaking between tests</li>
                <li><strong>Always use before/after hooks</strong>: Ensure proper setup and cleanup</li>
                <li><strong>Check connection status</strong>: Use <InlineCode>client.isConnected()</InlineCode> before operations</li>
                <li><strong>Handle timeouts</strong>: Set appropriate timeouts for server startup</li>
                <li><strong>Test both success and error scenarios</strong>: Validate error handling</li>
                <li><strong>Use stderr monitoring</strong>: Clear and check stderr for unexpected output</li>
                <li><strong>Validate tool schemas</strong>: Ensure tools have proper schema definitions</li>
                <li><strong>Test concurrent operations</strong>: Verify server can handle multiple requests</li>
                <li><strong>Generate dynamic tests</strong>: Create tests based on available tools</li>
                <li><strong>Monitor performance</strong>: Include timing assertions for critical operations</li>
            </ul>
        </>
    );
};

export default ProgrammaticTestingPage;