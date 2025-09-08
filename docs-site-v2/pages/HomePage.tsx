import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';

const HomePage: React.FC = () => {
    const yamlTestCode = `
description: "Basic MCP server tests"
tests:
  - it: "should list available tools"
    request:
      jsonrpc: "2.0"
      id: "test-1" 
      method: "tools/list"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "test-1"
        result:
          tools: "match:type:array"
`;

    const jsTestCode = `
import { test, before, after } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

let client;
before(async () => { client = await connect('./conductor.config.json'); });
after(async () => { await client.disconnect(); });

test('should list available tools', async () => {
  const tools = await client.listTools();
  assert.ok(Array.isArray(tools), 'Should return array of tools');
});
`;
    
    return (
        <>
            <H1 id="mcp-conductor">MCP Conductor</H1>
            <PageSubtitle>The Complete Model Context Protocol Testing Solution</PageSubtitle>
            <p>A powerful Node.js testing library that provides both YAML-based declarative testing and programmatic testing for MCP servers with advanced pattern matching capabilities and 100% protocol compliance validation.</p>
            
            <div className="flex items-center gap-2 my-4">
                <img src="https://img.shields.io/npm/v/mcp-conductor.svg" alt="npm version" />
                <img src="https://img.shields.io/github/stars/taurgis/mcp-conductor.svg" alt="GitHub stars" />
            </div>

            <H2 id="quick-start">🚀 Quick Start</H2>
            <p>Get up and running with MCP Conductor in minutes:</p>
            <CodeBlock language="bash" code={`
# Install globally
npm install -g mcp-conductor

# Initialize in your MCP project
cd my-mcp-project
npx mcp-conductor init

# This creates:
# - conductor.config.json (auto-configured from package.json)
# - test/mcp/ or tests/mcp/ directory structure  
# - AGENTS.md guide for AI development
            `} />
            <p>Create your first test:</p>
            <H3 id="yaml-testing">YAML Testing (<InlineCode>test/mcp/my-server.test.mcp.yml</InlineCode>):</H3>
            <CodeBlock language="yaml" code={yamlTestCode} />
            <H3 id="programmatic-testing">Programmatic Testing (<InlineCode>test/mcp/my-server.test.js</InlineCode>):</H3>
            <CodeBlock language="javascript" code={jsTestCode} />
            <p>Run the tests:</p>
            <CodeBlock language="bash" code={`
# Run YAML tests
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml"

# With verbose output and debugging
npx mcp-conductor "test*/mcp/**/*.test.mcp.yml" --verbose --debug

# Run programmatic tests
node --test "test*/mcp/*.test.js"
            `} />

            <H2 id="key-features">✨ Key Features</H2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Declarative Testing:</strong> Write tests in simple YAML files with intuitive syntax.</li>
                <li><strong>Automatic Protocol Handling:</strong> Handles MCP initialization handshake and JSON-RPC messaging.</li>
                <li><strong>Advanced Pattern Matching:</strong> 11+ verified pattern types including regex, partial matching, and field extraction.</li>
                <li><strong>Rich Reporting:</strong> Color-coded output with detailed diffs for test failures.</li>
                <li><strong>Programmatic API:</strong> JavaScript/TypeScript API for complex testing scenarios.</li>
                <li><strong>Framework Integration:</strong> Works with Node.js test runner, Jest, Mocha, and more.</li>
            </ul>

            <H2 id="why-mcp-conductor">Why Choose MCP Conductor?</H2>
            <p><strong>The industry standard for MCP testing</strong> - battle-tested with production servers and trusted by developers building AI agents and protocol-compliant applications.</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Complete Protocol Coverage:</strong> Full MCP 2025-06-18 compliance with JSON-RPC 2.0 validation.</li>
                <li><strong>Dual Testing Approaches:</strong> Both YAML declarative and programmatic JavaScript/TypeScript APIs.</li>
                <li><strong>Advanced Pattern Matching:</strong> 11+ verified pattern types for flexible validation.</li>
                <li><strong>Production Ready:</strong> 280+ test cases, 100% test coverage, successfully tested with real MCP servers.</li>
                <li><strong>Developer Friendly:</strong> Rich reporting, colored output, detailed diffs, and CI/CD integration.</li>
            </ul>
        </>
    );
};

export default HomePage;