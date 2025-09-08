import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const ProgrammaticTestingPage: React.FC = () => {
    return (
        <>
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

            <H2 id="api-reference-overview">API Reference Overview</H2>
            <p>See the full <a href="#/api-reference">API Reference</a> for all methods and properties.</p>
            <H3 id="main-entry-points">Main Entry Points</H3>
            <ul className="list-disc pl-6">
                <li><InlineCode>createClient(config)</InlineCode>: Creates a new <InlineCode>MCPClient</InlineCode> instance without connecting.</li>
                <li><InlineCode>connect(config)</InlineCode>: Creates and automatically connects a client.</li>
            </ul>

            <H3 id="mcpclient-class">MCPClient Class Core Methods</H3>
            <ul className="list-disc pl-6">
                <li><InlineCode>async connect()</InlineCode>: Start MCP server and perform handshake.</li>
                <li><InlineCode>async disconnect()</InlineCode>: Gracefully shutdown server connection.</li>
                <li><InlineCode>async listTools()</InlineCode>: Retrieve available tools from server.</li>
                <li><InlineCode>async callTool(name, arguments)</InlineCode>: Execute a specific tool with arguments.</li>
                <li><InlineCode>async sendMessage(jsonRpcMessage)</InlineCode>: Send raw JSON-RPC message to server.</li>
            </ul>

            <H2 id="testing-frameworks">Testing Frameworks Integration</H2>
            <p>MCP Conductor integrates seamlessly with Node.js built-in test runner, Jest, Mocha, and more.</p>
            <H3 id="nodejs-test-runner">Node.js Test Runner Example</H3>
            <CodeBlock language="javascript" code={`
import { test, describe, before, after } from 'node:test';
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
      await client.disconnect();
    }
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
        </>
    );
};

export default ProgrammaticTestingPage;