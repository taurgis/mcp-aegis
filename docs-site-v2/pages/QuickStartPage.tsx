import React from 'react';
import CodeBlock from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const QuickStartPage: React.FC = () => {
    return (
        <>
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
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "tools-test"
      method: "tools/list"
      params: {}
    expect:
      response:
        result:
          tools:
            - name: "hello"
              description: "match:contains:hello"

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
        result:
          content:
            - type: "text"
              text: "match:contains:Hello, World"
            `} />
            
            <H2 id="step-5-run-tests">Step 5: Run Your Tests</H2>
            <CodeBlock language="bash" code={`
# For Quick Setup
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml"

# For Manual Setup
conductor demo.test.mcp.yml --config conductor.config.json --verbose
            `} />
        </>
    );
};

export default QuickStartPage;