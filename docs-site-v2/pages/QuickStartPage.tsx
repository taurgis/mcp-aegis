import React from 'react';
import CodeBlock from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import SEOHead from '../hooks/useSEO';

const QuickStartPage: React.FC = () => {
    return (
        <>
            <SEOHead 
                title="Quick Start Guide - MCP Conductor"
                description="Get up and running with MCP Conductor in 5 minutes. Step-by-step guide to start testing Model Context Protocol servers with YAML and programmatic approaches."
                keywords="MCP quick start, MCP Conductor tutorial, Model Context Protocol testing guide, MCP setup, YAML testing setup, programmatic testing setup"
                canonical="https://conductor.rhino-inquisitor.com/#/quick-start"
                ogTitle="MCP Conductor Quick Start - Test MCP Servers in 5 Minutes"
                ogDescription="Complete quick start guide for MCP Conductor. Learn to test Model Context Protocol servers with YAML and programmatic approaches in just 5 minutes."
                ogUrl="https://conductor.rhino-inquisitor.com/#/quick-start"
            />
            <H1 id="quick-start-guide">Quick Start Guide</H1>
            <PageSubtitle>MCP Testing in 5 Minutes</PageSubtitle>
            <p>Get up and running with MCP Conductor Model Context Protocol testing in 5 minutes with this step-by-step guide.</p>
            
            <H2 id="method-1-quick-setup">Method 1: Quick Setup (Recommended)</H2>
            <p>The fastest way to get started in an existing Node.js project:</p>
            <CodeBlock language="bash" code={`
# Navigate to your MCP project directory
cd my-mcp-project

# Initialize MCP Conductor
npx mcp-conductor init
            `} />
            <p>This creates: <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">conductor.config.json</code>, a test directory, and installs the package. Skip to Step 3 if using this method.</p>
            
            <H2 id="method-2-manual-setup">Method 2: Manual Setup</H2>
            <H3 id="step-1-install">Step 1: Install MCP Conductor</H3>
            <CodeBlock language="bash" code="npm install -g mcp-conductor" />
            
            <H3 id="step-2-server">Step 2: Create a Simple MCP Server</H3>
            <p>Create a basic MCP server for testing (<code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">server.js</code>):</p>
            <CodeBlock language="javascript" code={`
#!/usr/bin/env node

const serverInfo = { name: "demo-server", version: "1.0.0" };
const tools = [
  {
    name: "hello",
    description: "Says hello",
    inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] }
  }
];

process.stdin.on('data', (data) => {
  const message = JSON.parse(data.toString());
  if (message.method === 'initialize') {
    sendResponse(message.id, { protocolVersion: "2025-06-18", capabilities: { tools: {} }, serverInfo });
  } else if (message.method === 'tools/list') {
    sendResponse(message.id, { tools });
  } else if (message.method === 'tools/call' && message.params.name === 'hello') {
    sendResponse(message.id, { content: [{ type: "text", text: \`Hello, \${message.params.arguments.name}! 👋\` }] });
  } else {
    sendError(message.id, -32601, "Method not found");
  }
});

function sendResponse(id, result) {
  console.log(JSON.stringify({ jsonrpc: "2.0", id, result }));
}
function sendError(id, code, message) {
  console.log(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }));
}

setTimeout(() => console.error("Server ready"), 100);
            `} />
            
            <H3 id="step-3-config">Step 3: Create Configuration (Manual Setup Only)</H3>
            <p>Create <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">conductor.config.json</code>:</p>
            <CodeBlock language="json" code={`
{
  "name": "Demo MCP Server",
  "command": "node",
  "args": ["./server.js"],
  "startupTimeout": 5000,
  "readyPattern": "Server ready"
}
            `} />

            <H2 id="step-4-write-test">Step 4: Write Your First Test</H2>
            <p>Create <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">demo.test.mcp.yml</code>:</p>
            <CodeBlock language="yaml" code={`
description: "Demo MCP Server Tests"
tests:
  - it: "should initialize successfully"
    request:
      jsonrpc: "2.0"
      id: "init-test"
      method: "initialize"
      params:
        protocolVersion: "2025-06-18"  # Explicit because we are manually sending initialize
        capabilities: { tools: {} }
        clientInfo: { name: "test-client", version: "1.0.0" }
    expect:
      response:
        jsonrpc: "2.0"
        id: "init-test"
        result:
          # Accept any valid MCP protocol date version (YYYY-MM-DD)
          protocolVersion: "match:regex:20\\d{2}-\\d{2}-\\d{2}"
          capabilities: "match:type:object"
          serverInfo:
            name: "demo-server"
            version: "1.0.0"
    stderr: "toBeEmpty"

  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "tools-test"
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "tools-test"
        result:
          tools:
            - name: "hello"
              description: "match:contains:hello"
              inputSchema:
                type: "object"
                properties: "match:type:object"
                required: ["name"]
    stderr: "toBeEmpty"

  - it: "should execute hello tool"
    request:
      jsonrpc: "2.0"
      id: "hello-test"
      method: "tools/call"
      params:
        name: "hello"
        arguments:
          name: "World"
    expect:
      response:
        jsonrpc: "2.0"
        id: "hello-test"
        result:
          content:
            - type: "text"
              text: "match:contains:Hello, World"
    stderr: "toBeEmpty"

  - it: "should handle invalid tool"
    request:
      jsonrpc: "2.0" 
      id: "error-test"
      method: "tools/call"
      params:
        name: "nonexistent"
        arguments: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "error-test"
        error:
          code: -32601
          message: "Method not found"
    stderr: "toBeEmpty"
            `} />
            <p className="mt-4 text-sm text-slate-700"><strong>Handshake note:</strong> The CLI automatically performs the MCP handshake (initialize + initialized) before the first test unless you explicitly include an <code>initialize</code> request. We include it here so we can assert the protocol fields directly. Avoid sending it twice.</p>
            <div className="my-8 p-4 border border-amber-300 bg-amber-50 rounded-md">
              <h4 className="font-semibold text-amber-800 mb-1">Error Handling Models</h4>
              <p className="text-sm text-amber-800">Two patterns exist for representing failures:</p>
              <ul className="list-disc pl-5 text-sm text-amber-800 space-y-1 mt-2">
                <li><strong>JSON-RPC transport / protocol error</strong>: Use the top-level <code>error</code> object (method not found, invalid request).</li>
                <li><strong>Tool-level logical failure</strong>: Return a normal <code>result</code> with <code>isError: true</code> and explanatory <code>content</code>.</li>
              </ul>
              <p className="text-xs text-amber-700 mt-2">Pick one per response; do not mix both for the same request.</p>
            </div>
            
            <H2 id="step-5-run-tests">Step 5: Run Your Tests</H2>
            <H3 id="for-quick-setup">For Quick Setup (Method 1):</H3>
            <CodeBlock language="bash" code={`
# After init, you can use npx:
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml"  # Matches both test/ and tests/

# Or add to package.json scripts:
# "scripts": { "test:mcp": "mcp-conductor \\"./test*/mcp/**/*.test.mcp.yml\\"" }
# Then run:
npm run test:mcp

# Specific directory examples:
# npx mcp-conductor "test/mcp/**/*.test.mcp.yml"     # for test/mcp/
# npx mcp-conductor "tests/mcp/**/*.test.mcp.yml"   # for tests/mcp/
            `} />
            
            <H3 id="for-manual-setup">For Manual Setup (Method 2):</H3>
            <CodeBlock language="bash" code={`
# Basic test execution
conductor demo.test.mcp.yml --config conductor.config.json

# With verbose output for detailed results
conductor demo.test.mcp.yml --config conductor.config.json --verbose

# With debug mode for MCP communication details  
conductor demo.test.mcp.yml --config conductor.config.json --debug

# With timing information for performance analysis
conductor demo.test.mcp.yml --config conductor.config.json --timing

# Combine options for maximum debugging
conductor demo.test.mcp.yml --config conductor.config.json --verbose --debug --timing

# Error reporting options for focused debugging
conductor demo.test.mcp.yml --config conductor.config.json --errors-only
conductor demo.test.mcp.yml --config conductor.config.json --syntax-only
conductor demo.test.mcp.yml --config conductor.config.json --group-errors
conductor demo.test.mcp.yml --config conductor.config.json --max-errors 3
            `} />

            <H2 id="understanding-output">Understanding the Test Output</H2>
            <p>You should see output like this:</p>
            <CodeBlock language="bash" code={`
📋 Loaded configuration for: Demo MCP Server
🧪 Found 1 test suite(s)
ℹ️  Starting MCP server...
ℹ️  Server started successfully
ℹ️  Performing MCP handshake...
ℹ️  Handshake completed successfully

📋 Test Suite: Demo MCP Server Tests
   demo.test.mcp.yml

  ● should initialize successfully ... ✓ PASS (12ms)
  ● should list available tools ... ✓ PASS (5ms)  
  ● should execute hello tool ... ✓ PASS (8ms)
  ● should handle invalid tool ... ✓ PASS (3ms)

🎉 All tests passed! (4/4)
   Total time: 156ms
            `} />

            <H2 id="understanding-test-structure">Understanding the Test Structure</H2>
            <p>Each MCP Conductor YAML test has this structure:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>description</strong>: Human-readable test suite description</li>
                <li><strong>tests</strong>: Array of individual test cases</li>
                <li><strong>it</strong>: Description of what the test should do</li>
                <li><strong>request</strong>: JSON-RPC request to send to server</li>
                <li><strong>expect</strong>: Expected response structure</li>
                <li><strong>stderr</strong>: Expected stderr output (optional)</li>
            </ul>

            <H2 id="next-steps">Next Steps</H2>
            <p>Now that you have a basic test running, explore these advanced features:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><a href="#/yaml-testing" className="text-blue-600 hover:text-blue-800">YAML Testing Guide</a> - Learn advanced YAML testing patterns</li>
                <li><a href="#/pattern-matching" className="text-blue-600 hover:text-blue-800">Pattern Matching</a> - Master 50+ pattern types for flexible validation</li>
                <li><a href="#/programmatic-testing" className="text-blue-600 hover:text-blue-800">Programmatic Testing</a> - Use the JavaScript/TypeScript API</li>
                <li><a href="#/examples" className="text-blue-600 hover:text-blue-800">Examples</a> - See real-world testing scenarios</li>
                <li><a href="#/troubleshooting#query-command-debugging" className="text-blue-600 hover:text-blue-800">Query Command</a> - Debug individual tools interactively without test files</li>
            </ul>

            <H2 id="debugging-with-query">Quick Debugging with Query Command</H2>
            <p>Use the <code className="text-sm font-mono bg-rose-100 text-rose-800 rounded-md px-1 py-0.5">query</code> command to test tools directly without writing test files:</p>
            <CodeBlock language="bash" code={`
# List all available tools from your server
conductor query --config conductor.config.json

# Test the hello tool with arguments
conductor query hello '{"name": "World"}' --config conductor.config.json

# Get JSON output (useful for scripting)
conductor query hello '{"name": "World"}' --config conductor.config.json --json
            `} />
            <p>This is perfect for:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Verifying your server is working before writing tests</li>
                <li>Exploring what tools your server provides</li>
                <li>Testing tool arguments and responses quickly</li>
                <li>Debugging issues during development</li>
            </ul>

            <H2 id="common-patterns">Common Patterns</H2>
            <p>Here are some useful patterns you'll use frequently:</p>
            
            <H3 id="pattern-matching-basics">Pattern Matching Basics</H3>
            <CodeBlock language="yaml" code={`
# Type validation
result: "match:type:object"
tools: "match:type:array"
count: "match:type:number"

# String patterns
message: "match:contains:success"
filename: "match:startsWith:data_"
extension: "match:endsWith:.json"

# Array patterns
tools: "match:arrayLength:3"        # Exactly 3 elements
# To assert presence of a specific tool name (use in a separate assertion, not together):
# tools: "match:arrayContains:name:hello"

# Negation & extraction examples
tools: "match:not:arrayLength:0"    # Array must NOT be empty
match:extractField: "tools.*.name"  # (Use in separate test: extract all tool names)
            `} />

            <H3 id="error-handling-patterns">Error Handling</H3>
            <CodeBlock language="yaml" code={`
- it: "should handle errors gracefully"
  request:
    method: "tools/call"
    params:
      name: "invalid_tool"
      arguments: {}
  expect:
    response:
      result:
        isError: true
        content:
          - type: "text"
            text: "match:contains:Unknown tool"
            `} />
        </>
    );
};

export default QuickStartPage;